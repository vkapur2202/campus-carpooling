import { user as UserType } from '@prisma/client'
import * as moment from 'moment'

import config from '../../config'
import { activateAccountEmail, resetPasswordEmail, transport } from '../../mail'
import { AuthError, Context, ISuccessMessage } from '../../utils'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const User = {
  async activateAccount(parent, args, ctx: Context): Promise<ISuccessMessage | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const token: string = jwt.sign({ userId: ctx.request.userId }, config.APP_SECRET, { expiresIn: '1h' })
    const sent = await transport.sendMail({
      from: config.MAIL_USER,
      to: ctx.request.user.email,
      subject: `${config.APP_NAME}: Confirm your account!`,
      html: activateAccountEmail(
        `<a href="${config.FRONTEND_URL}/confirm/${token}">Click here to confirm your account!</a>`
      ),
    })

    if (!sent) {
      throw new Error(`Couldn't send email to ${ctx.request.user.email}`)
    }

    return { message: 'Confirmation email successfully sent!' }
  },

  async confirmAccount(parent, { token }, ctx: Context): Promise<UserType | Error> {
    const { userId } = jwt.verify(token, config.APP_SECRET)

    if (!userId) {
      throw new Error('The token is either invalid or expired.')
    }

    const updatedUser: UserType = await ctx.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        confirmed: true,
        confirmed_on: moment().toDate(),
        updated_on: moment().toDate(), // TODO: make POSTGRES trigger to do this
      },
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
    let uId
    try {
      uId = jwt.verify(token, config.APP_SECRET).userId
      console.log(uId)
    } catch (e) {
      throw new Error('The password reset token is either invalid or expired.')
    }

    const newPassword: string = await bcrypt.hash(password, 10)
    const updatedUser: UserType = await ctx.prisma.user.update({
      where: { id: uId, }, data: {
        password: newPassword, updated_on: moment().toDate(), // TODO: make POSTGRES trigger to do this
      },
    })
    return updatedUser
  },
}
