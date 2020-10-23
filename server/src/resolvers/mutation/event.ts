import { event as EventType, registration as RegistrationType, user as UserType } from '@prisma/client'
import * as moment from 'moment'
import { start } from 'repl'

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
