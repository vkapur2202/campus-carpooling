import { Context } from '../../utils'

export const Event = {
  user: (parent, args, ctx: Context) => {
    console.log(parent.user_id)
    return ctx.prisma.user.findOne({
      where: {
        id: parent.user_id,
      },
    })
  },
}
