import { user as UserType } from '@prisma/client'

import config from '../../config'
import { Context, ISuccessMessage } from '../../utils'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const Auth = {
  async signup(parent, args, ctx: Context): Promise<UserType | Error> {
    const email: string = args.email.toLowerCase()
    const password: string = await bcrypt.hash(args.password, 10)

    const newUser: UserType = await ctx.prisma.user
      .create({
        data: {
          ...args,
          email,
          password,
        },
      })
      .catch(() => {
        throw new Error(`Error creating a new user with email: ${email}`)
      })

    // const token: string = jwt.sign({ userId: newUser.id }, config.APP_SECRET)

    // set the jwt as a cookie on the response
    // ctx.response.cookie(config.TOKEN_NAME, token, {
    //   httpOnly: true,
    //   // maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    // })

    return newUser
  },

  async login(parent, { email, password }, ctx: Context): Promise<UserType | Error> {
    email = email.toLowerCase()
    const user: UserType = await ctx.prisma.user.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error(`User with email '${email}' does not exist.`)
    }

    const valid: boolean = await bcrypt.compare(password, user.password)

    if (!valid) {
      throw new Error('Invalid password.')
    }

    const token: string = jwt.sign({ userId: user.id }, config.APP_SECRET)

    // set the jwt as a cookie on the response
    ctx.response.cookie(config.TOKEN_NAME, token, {
      httpOnly: false,
      // maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })

    return user
  },

  async logout(parent, args, ctx: Context): Promise<ISuccessMessage> {
    ctx.response.clearCookie(config.TOKEN_NAME)
    return { message: "You've successfully logged out. Bye!" }
  },
}
