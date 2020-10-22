import { event as EventType, user as UserType } from '@prisma/client'
import * as moment from 'moment'
import { start } from 'repl'

import { AuthError, Context, ISuccessMessage } from '../../utils'

export const Event = {
  async createEvent(
    parent,
    { userId, name, max_participants, start_location, end_location, event_date },
    ctx: Context
  ): Promise<EventType | Error> {
    // if (!ctx.request.userId) {
    //   throw new AuthError()
    // }
    // const user: UserType = ctx.request.user

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new AuthError()
    }

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

  async deleteEvent(parent, { userId, event_date }, ctx: Context): Promise<ISuccessMessage | Error> {
    // assumes a user can't have multiple active events at the same time
    // if (!ctx.request.userId) {
    //   throw new AuthError()
    // }
    // const user = ctx.request.user

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new AuthError()
    }

    const eventToDelete: EventType = await ctx.prisma.event
      .findMany({
        where: {
          user: user,
          event_date,
        },
      })
      .then((resp) => resp[0])

    if (!eventToDelete) {
      throw new Error(`Event could not be found.`)
    }
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
    { userId, id, name, max_participants, start_location, end_location, event_date },
    ctx: Context
  ): Promise<EventType | Error> {
    // if (!ctx.request.userId) {
    //   throw new AuthError()
    // }

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new AuthError()
    }

    const updateEvent: EventType = await ctx.prisma.event
      .update({
        where: {
          id,
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
}
