import { Context } from '../utils'
import { Registration } from './query/registration'

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
  event(parent, { id }, ctx: Context) {
    id = parseInt(id)
    return ctx.prisma.event.findOne({
      where: { id },
    })
  },
  activeEvents(parent, args, ctx: Context) {
    return ctx.prisma.event.findMany({
      where: {
        is_active: true,
      },
    })
  },
  inactiveEvents(parent, args, ctx: Context) {
    return ctx.prisma.event.findMany({
      where: {
        is_active: false,
      },
    })
  },
  events(parent, args, ctx: Context) {
    return ctx.prisma.event.findMany()
  },

  registrations(parent, args, ctx: Context) {
    return ctx.prisma.registration.findMany()
  },

  participants(parent, { id }, ctx: Context) {
    return ctx.prisma.registration.findMany({
      where: {
        event_id: id,
      },
    })
  },

  registration(parent, { id }, ctx: Context) {
    return ctx.prisma.registration.findOne({
      where: {
        id,
      },
    })
  },
}
