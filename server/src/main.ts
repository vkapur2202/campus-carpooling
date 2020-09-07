import { PrismaClient, user as UserType } from '@prisma/client'
import { GraphQLServer } from 'graphql-yoga'

import config from './config'
import resolvers from './resolvers'
import { IUserRequest } from './utils'

const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
  context: (request) => ({
    ...request,
    prisma,
  }),
})

server.express.use(cookieParser())

// decode the JWT so we can get the user Id on each request
server.express.use((req: IUserRequest, res, next) => {
  const { token } = req.cookies
  if (token) {
    const { userId } = jwt.verify(token, config.APP_SECRET)
    // put the userId onto the req for future requests to access
    req.userId = userId
  }
  next()
})

// populates the user on each request
server.express.use(async (req: IUserRequest, res, next) => {
  // if they aren't logged in, skip this
  if (!req.userId) return next()
  const user: UserType = await prisma.user.findOne({ where: { id: req.userId } })
  req.user = user
  next()
})

server.start(
  {
    cors: {
      credentials: true,
      origin: config.FRONTEND_URL,
    },
  },
  () => console.log(`Server is running on http://localhost:${config.SERVER_PORT} 🚀`)
)
