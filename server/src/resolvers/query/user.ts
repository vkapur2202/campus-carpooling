import { Context } from '../../utils'

export const User = {
  events: (parent, args, ctx: Context) => {
    return ctx.prisma.event.findMany({
      where: {
        user_id: parent.id,
      },
    })
  },
  active_events: (parent, args, ctx: Context) => {
    return ctx.prisma.event.findMany({
      where: {
        user_id: parent.id,
        is_active: true,
      },
    })
  },
  inactive_events: (parent, args, ctx: Context) => {
    return ctx.prisma.event.findMany({
      where: {
        user_id: parent.id,
        is_active: false,
      },
    })
  },
}
