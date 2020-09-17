import { Auth } from './mutation/auth'
import { User } from './mutation/user'
import { Event } from './mutation/event'

export const Mutation = {
  ...Auth,
  ...User,
  ...Event,
}
