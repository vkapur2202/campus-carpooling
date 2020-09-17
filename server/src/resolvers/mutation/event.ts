import {
    event as EventType,
    user as UserType,
} from '@prisma/client'
import { start } from 'repl'

import { AuthError, Context, ISuccessMessage } from '../../utils'

export const Event = {
    async createEvent(parent, { args }, ctx: Context): Promise<EventType | Error> {
        if (!ctx.request.userId) {
            throw new AuthError()
        }
        const user: UserType = ctx.request.user

        const event: EventType = await ctx.prisma.event
            .findMany({
                where: {
                    user: user,
                },
            })
            .then((resp) => resp[0])

        if (event) {
            throw new Error(`This event already exists.`)
        }

        const newEvent: EventType = await ctx.prisma.event
            .create({
                data: {
                    user: {
                        connect: {
                            id: user.id,
                        },
                    },
                    ...args
                },
            })
            .catch(() => {
                throw new Error(`Error creating new event.`)
            })
        return newEvent
    },

    async deleteEvent(parent, { event_date }, ctx: Context): Promise<ISuccessMessage> {
        // assumes a user can't have multiple active events with the same charity
        if (!ctx.request.userId) {
            throw new AuthError()
        }
        const user = ctx.request.user

        const eventToDelete: EventType = await ctx.prisma.event
            .findMany({
                where: {
                    user: user,
                    event_date
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
