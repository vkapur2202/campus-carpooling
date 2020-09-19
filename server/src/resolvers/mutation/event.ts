import { event as EventType, user as UserType } from '@prisma/client'
import * as moment from 'moment'
import { start } from 'repl'

import { AuthError, Context, ISuccessMessage } from '../../utils'

export const Event = {
  async createEvent(
    parent,
    { name, event_date, max_participants, start_location, end_location, new_date },
    ctx: Context
  ): Promise<EventType | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const user: UserType = ctx.request.user

    const event: EventType = await ctx.prisma.event
      .findMany({
        where: {
          user: user,
          event_date: event_date,
        },
      })
      .then((resp) => resp[0])

    if (event) {
      throw new Error(`You have an existing event with this date and time.`)
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
          event_date: new_date,
        },
      })
      .catch(() => {
        throw new Error(`Error creating new event.`)
      })
    return newEvent
  },

  async updateEvent(parent, { args }, ctx: Context): Promise<ISuccessMessage | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const user = ctx.request.user

    const eventToUpdate: EventType = await ctx.prisma.event
      .findMany({
        where: {
          user: user,
          event_date: args.event_date,
        },
      })
      .then((resp) => resp[0])

    if (!eventToUpdate) {
      throw new Error(`Event could not be found.`)
    }
    await ctx.prisma.event
      .update({
        where: {
          id: eventToUpdate.id,
        },
        data: {
          ...args,
          updated_on: moment().toDate(),
        },
      })
      .catch(() => {
        throw new Error(`Error updating event.`)
      })
    return { message: 'Event successfully updated!' }
  },

  async deleteEvent(parent, { event_date }, ctx: Context): Promise<ISuccessMessage | Error> {
    // assumes a user can't have multiple active events at the same time
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const user = ctx.request.user

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
}
