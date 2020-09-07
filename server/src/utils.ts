import { PrismaClient, user as UserType } from '@prisma/client'
import { Request } from 'express'

export interface Context {
  prisma: PrismaClient
  request: IUserRequest
  response: any
}
export interface IUserRequest extends Request {
  userId: number
  user: UserType
}

export interface ISuccessMessage {
  message: string
}

export class AuthError extends Error {
  constructor() {
    super('You are not authorized to view this resource.')
  }
}
