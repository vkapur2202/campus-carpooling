import { Auth } from './mutation/auth'
import { User } from './mutation/user'

export const Mutation = {
  ...Auth,
  ...User,
}
