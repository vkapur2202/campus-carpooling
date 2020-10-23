import { user as UserType } from '@prisma/client'
import * as moment from 'moment'

import { AuthError, Context, ISuccessMessage } from '../../utils'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

export const User = {
  async setProfile(parent, { year, gender, can_drive, max_capacity }, ctx: Context): Promise<UserType | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    const updatedUser: UserType = await ctx.prisma.user
      .update({
        where: {
          id: ctx.request.userId,
        },
        data: {
          year: year,
          gender: gender,
          can_drive: can_drive,
          max_capacity: max_capacity,
          updated_on: moment().toDate(),
        },
      })
      .catch(() => {
        throw new Error(`Error updating user`)
      })

    return updatedUser
  },

  async updateProfile(parent, { args }, ctx: Context): Promise<ISuccessMessage | Error> {
    if (!ctx.request.userId) {
      throw new AuthError()
    }
    await ctx.prisma.user
      .update({
        where: {
          id: ctx.request.userId,
        },
        data: {
          ...args,
          updated_on: moment().toDate(),
        },
      })
      .catch(() => {
        throw new Error(`Error updating profile`)
      })

    return { message: `Profile has been updated!` }
  },
}
