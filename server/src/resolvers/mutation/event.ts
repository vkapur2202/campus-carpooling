import { event as EventType, registration as RegistrationType, user as UserType } from '@prisma/client'
import * as moment from 'moment'
import { start } from 'repl'

import config from '../../config'
import { eventDeleteEmail, eventUpdateEmail, transport } from '../../mail'
import { AuthError, Context, ISuccessMessage } from '../../utils'

export const Event = {
  async createEvent(
    parent,
    { name, max_participants, start_location, end_location, event_date },
    ctx: Context
  ): Promise<EventType | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const user: UserType = await ctx.prisma.user.findOne({
      where: {
        id: ctx.request.userId,
      },
    })

    const event: EventType = await ctx.prisma.event
      .findMany({
        where: {
          user_id: user.id,
          event_date: event_date,
        },
      })
      .then((resp) => resp[0])

    if (event) {
      throw new Error(`You have an existing event at this date and time.`)
    }

    const newEvent: EventType = await ctx.prisma.event
      .create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          name,
          max_participants,
          start_location,
          end_location,
          event_date,
        },
      })
      .catch(() => {
        throw new Error(`Error creating new event.`)
      })
    return newEvent
  },

  async deleteEvent(parent, { event_id }, ctx: Context): Promise<ISuccessMessage | Error> {
    // assumes a user can't have multiple active events at the same time
    if (!ctx.request.userId) {
      throw new AuthError()
    }

    const eventToDelete: EventType = await ctx.prisma.event.findOne({
      where: {
        id: event_id,
      },
    })

    if (!eventToDelete) {
      throw new Error(`Event could not be found.`)
    }

    const registrations = await ctx.prisma.registration.findMany({
      where: {
        event_id: eventToDelete.id,
      },
    })

    const emails: string[] = []
    registrations.forEach(async (registration) => {
      const user = await ctx.prisma.user.findOne({
        where: {
          id: registration.user_id,
        },
      })
      emails.push(user.email)
    })

    await ctx.prisma.registration.deleteMany({
      where: {
        event_id: eventToDelete.id,
      },
    })

    await ctx.prisma.event
      .delete({
        where: {
          id: eventToDelete.id,
        },
      })
      .catch(() => {
        throw new Error(`Error deleting event.`)
      })

    if (emails.length > 0) {
      const sent = await transport.sendMail({
        from: config.MAIL_USER,
        to: emails,
        subject: `${config.APP_NAME}: Event "${eventToDelete.name}" Cancellation!`,
        html: eventDeleteEmail(
          `<p> 
            Name: ${eventToDelete.name} <br> Maximum Participants: ${eventToDelete.max_participants} <br> Start Location: ${eventToDelete.start_location} 
            <br> End Location: ${eventToDelete.end_location} <br> Event Date and Time: ${eventToDelete.event_date}
          </p>`
        ),
      })

      if (!sent) {
        throw new Error(`Couldn't send email to registered users`)
      }
    }
    return { message: 'Event successfully deleted!' }
  },

  async updateEvent(
    parent,
    { id, name, max_participants, start_location, end_location, event_date },
    ctx: Context
  ): Promise<EventType | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }

    const event: EventType = await ctx.prisma.event.findOne({
      where: {
        id: id,
      },
    })

    const registrations = await ctx.prisma.registration.findMany({
      where: {
        event_id: event.id,
      },
    })

    const emails: string[] = []
    registrations.forEach(async (registration) => {
      const user = await ctx.prisma.user.findOne({
        where: {
          id: registration.user_id,
        },
      })
      emails.push(user.email)
    })

    const updateEvent: EventType = await ctx.prisma.event
      .update({
        where: {
          id: event.id,
        },
        data: {
          name,
          max_participants,
          start_location,
          end_location,
          event_date,
          updated_on: moment().toDate(),
        },
      })
      .catch(() => {
        throw new Error(`Error updating event.`)
      })

    if (emails.length > 0) {
      const sent = await transport.sendMail({
        from: config.MAIL_USER,
        to: emails,
        subject: `${config.APP_NAME}: Event "${updateEvent.name}" Update!`,
        html: eventUpdateEmail(
          `<p> 
            Name: ${updateEvent.name} <br> Maximum Participants: ${updateEvent.max_participants} <br> Start Location: ${updateEvent.start_location} 
            <br> End Location: ${updateEvent.end_location} <br> Event Date and Time: ${updateEvent.event_date}
          </p>`
        ),
      })

      if (!sent) {
        throw new Error(`Couldn't send email to registered users`)
      }
    }
    return updateEvent
  },

  async register(parent, { event_id }, ctx: Context): Promise<RegistrationType | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }

    const user: UserType = await ctx.prisma.user.findOne({
      where: {
        id: ctx.request.userId,
      },
    })

    const event: EventType = await ctx.prisma.event.findOne({
      where: {
        id: event_id,
      },
    })

    if (!event) {
      throw new Error(`Event could not be found.`)
    }

    // const participants = event.participants;

    // const updateParticipants: EventType = await ctx.prisma.event
    //   .update({
    //     where: {
    //       id: event.id,
    //     },
    //     data: {
    //       name,
    //       participants
    //       updated_on: moment().toDate(),
    //     },

    const register: RegistrationType = await ctx.prisma.registration
      .create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          event: {
            connect: {
              id: event.id,
            },
          },
        },
      })
      .catch(() => {
        throw new Error(`Error registering for event.`)
      })
    return register
  },

  async unregister(parent, { event_id }, ctx: Context): Promise<ISuccessMessage | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }

    const user: UserType = await ctx.prisma.user.findOne({
      where: {
        id: ctx.request.userId,
      },
    })

    const event: EventType = await ctx.prisma.event.findOne({
      where: {
        id: event_id,
      },
    })

    if (!event) {
      throw new Error(`Event could not be found.`)
    }

    const registration: RegistrationType = await ctx.prisma.registration
      .findMany({
        where: {
          event_id: event_id,
          user_id: user.id,
        },
      })
      .then((resp) => resp[0])

    //   await ctx.prisma.registration
    //     .delete({
    //       where: {
    //         id: registration.id,
    //       },
    //     })
    //     .catch(() => {
    //       throw new Error(`Error deleting registration.`)
    //     })
    //   return { message: 'Registration successfully deleted!' }
    // },

    // async participants(parent, { event_id }, ctx: Context): Promise<ISuccessMessage | Error> {
    //   if (!ctx.request.userId) {
    //     throw new AuthError()
    //   }

    //   const user: UserType = await ctx.prisma.user.findOne({
    //     where: {
    //       id: ctx.request.userId,
    //     },
    //   })

    //   const event: EventType = await ctx.prisma.event.findOne({
    //     where: {
    //       id: event_id,
    //     },
    //   })

    //   if (!event) {
    //     throw new Error(`Event could not be found.`)
    //   }

    //   const registration: RegistrationType = await ctx.prisma.registration
    //     .findMany({
    //       where: {
    //         event_id: event_id,
    //         user_id: user.id,
    //       },
    //     })
    //     .then((resp) => resp[0])

    await ctx.prisma.registration
      .delete({
        where: {
          id: registration.id,
        },
      })
      .catch(() => {
        throw new Error(`Error deleting registration.`)
      })
    return { message: 'Registration successfully deleted!' }
  },
}
