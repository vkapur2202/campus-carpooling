import { Context } from '../../utils'

export const Registration = {
  user: (parent, args, ctx: Context) => {
    return ctx.prisma.user.findOne({
      where: {
        id: parent.user_id,
      },
    })
  },

  event: (parent, args, ctx: Context) => {
    return ctx.prisma.event.findOne({
      where: {
        id: parent.event_id,
      },
    })
  },
}
