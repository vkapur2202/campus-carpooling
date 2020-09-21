import { Auth } from './mutation/auth'
import { Event } from './mutation/event'
import { User } from './mutation/user'

export const Mutation = {
  ...Auth,
  ...User,
  ...Event,
}
