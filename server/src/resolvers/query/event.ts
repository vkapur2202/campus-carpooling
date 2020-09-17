import { Context } from '../../utils'

export const Event = {
    user: (parent, args, ctx: Context) => {
        return ctx.prisma.user.findOne({
            where: {
                id: parent.user_id,
            },
        })
    },
}