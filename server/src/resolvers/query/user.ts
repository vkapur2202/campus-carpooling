import { Context } from '../../utils'

export const User = {
    events: (parent, args, ctx: Context) => {
        return ctx.prisma.event.findMany({
            where: {
                user_id: parent.id,
            },
        })
    },
    activeEvents: (parent, args, ctx: Context) => {
        return ctx.prisma.event.findMany({
            where: {
                user_id: parent.id,
                is_active: true,
            },
        })
    },
    inactiveEvents: (parent, args, ctx: Context) => {
        return ctx.prisma.event.findMany({
            where: {
                user_id: parent.id,
                is_active: false,
            },
        })
    },
}
