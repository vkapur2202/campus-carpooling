import { user as UserType } from '@prisma/client'
import * as moment from 'moment'

import config from '../../config'
import { activateAccountEmail, resetPasswordEmail, transport } from '../../mail'
import { AuthError, Context, ISuccessMessage } from '../../utils'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const Auth = {
  async signup(parent, args, ctx: Context): Promise<UserType | Error> {
    const email: string = args.email.toLowerCase()
    const password: string = await bcrypt.hash(args.password, 10)

    const user = await ctx.prisma.user.findOne({
      where: {
        email: args.email,
      },
    })

    if (user) {
      throw new Error(`The email ${email} is already in use`)
    }

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

  async activateAccount(parent, args, ctx: Context): Promise<ISuccessMessage | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const user = await ctx.prisma.user.findOne({
      where: {
        id: ctx.request.userId,
      },
    })
    const token: string = jwt.sign({ userId: ctx.request.userId }, config.APP_SECRET, { expiresIn: '1h' })
    const sent = await transport.sendMail({
      from: config.MAIL_USER,
      to: user.email,
      subject: `${config.APP_NAME}: Confirm your account!`,
      html: activateAccountEmail(
        `<a href="${config.FRONTEND_URL}/confirm/${token}">Click here to confirm your account!</a>`
      ),
    })

    if (!sent) {
      throw new Error(`Couldn't send email to ${user.email}`)
    }

    return { message: 'Confirmation email successfully sent!' }
  },

  async confirmAccount(parent, { token }, ctx: Context): Promise<UserType | Error> {
    const userId = jwt.verify(token, config.APP_SECRET).userId

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error(`The token is either invalid or expired.`)
    }

    const updatedUser: UserType = await ctx.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          confirmed: true,
          confirmed_on: moment().toDate(),
          updated_on: moment().toDate(), // TODO: make POSTGRES trigger to do this
        },
      })
      .catch(() => {
        throw new Error(`Error confirming account.`)
      })
    return updatedUser
  },

  async resetRequest(parent, { email }, ctx: Context): Promise<ISuccessMessage | Error> {
    email = email.toLowerCase()
    const user: UserType = await ctx.prisma.user.findOne({ where: { email } })
    if (!user) {
      throw new Error(`Can't find a user in our system with email: ${email}`)
    }
    const token: string = jwt.sign({ userId: user.id }, config.APP_SECRET, { expiresIn: '1h' })
    const sent = await transport.sendMail({
      from: config.MAIL_USER,
      to: user.email,
      subject: `${config.APP_NAME}: Password reset request`,
      html: resetPasswordEmail(
        `<a href="${config.FRONTEND_URL}/reset_password/${token}">Click here to reset your password!</a>`
      ),
    })

    if (!sent) {
      throw new Error(`Couldn't send email to ${user.email}`)
    }

    return { message: 'Reset password email successfully sent!' }
  },

  async resetPassword(parent, { token, password }, ctx: Context): Promise<UserType | Error> {
    const userId = jwt.verify(token, config.APP_SECRET).userId

    const user = await ctx.prisma.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new Error(`The token is either invalid or expired.`)
    }

    const newPassword: string = await bcrypt.hash(password, 10)
    const updatedUser: UserType = await ctx.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          password: newPassword,
          updated_on: moment().toDate(), // TODO: make POSTGRES trigger to do this
        },
      })
      .catch(() => {
        throw new Error(`Error resetting password.`)
      })
    return updatedUser
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
      maxAge: 1000 * 60 * 60, // 1 hour cookie
    })

    return user
  },

  async logout(parent, args, ctx: Context): Promise<ISuccessMessage> {
    ctx.response.clearCookie(config.TOKEN_NAME)
    return { message: "You've successfully logged out. Bye!" }
  },
}
