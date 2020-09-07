import { Context } from '../utils'

export const Query = {
  me(parent, args, ctx: Context) {
    if (!ctx.request.userId) {
      return null
    }
    return ctx.request.user
  },
  user(parent, { id }, ctx: Context) {
    id = parseInt(id)
    return ctx.prisma.user.findOne({ where: { id } })
  },
  users(parent, args, ctx: Context) {
    return ctx.prisma.user.findMany()
  },
}
