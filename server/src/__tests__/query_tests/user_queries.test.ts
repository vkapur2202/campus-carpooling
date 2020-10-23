import { PrismaClient } from '@prisma/client'

import { Query } from '../../resolvers/query'
import { User } from '../../resolvers/query/user'
import { AuthError } from '../../utils'

require('sinon')
const { mockRequest, mockResponse } = require('mock-req-res')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('user queries', () => {
  it('me', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })
    const meResponse = await Query.me(null, null, { prisma: prisma, request: req, response: res })

    const dbUser = await prisma.user.findOne({
      where: {
        id: user.id,
      },
    })

    expect(meResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('meAuthError', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const meResponse = await Query.me(null, null, { prisma: prisma, request: req, response: res })

    expect(meResponse).toBeNull()

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('user', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const userResponse = await Query.user(null, { id: user.id }, { prisma: prisma, request: req, response: res })

    const dbUser = await prisma.user.findOne({
      where: {
        id: user.id,
      },
    })

    expect(userResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('userEvents', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const userResponse = await User.events(user, { id: user.id }, { prisma: prisma, request: req, response: res })

    const dbUserEvents = await prisma.event.findMany({
      where: {
        id: user.id,
      },
    })

    expect(userResponse).toEqual(dbUserEvents)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('userActiveEvents', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const userResponse = await User.active_events(
      user,
      { id: user.id },
      { prisma: prisma, request: req, response: res }
    )

    const dbUserActiveEvents = await prisma.event.findMany({
      where: {
        id: user.id,
        is_active: true,
      },
    })

    expect(userResponse).toEqual(dbUserActiveEvents)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('userInactiveEvents', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const userResponse = await User.inactive_events(
      user,
      { id: user.id },
      { prisma: prisma, request: req, response: res }
    )

    const dbUserInactiveEvents = await prisma.event.findMany({
      where: {
        id: user.id,
        is_active: false,
      },
    })

    expect(userResponse).toEqual(dbUserInactiveEvents)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('userRegistrations', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const userResponse = await User.registrations(
      user,
      { id: user.id },
      { prisma: prisma, request: req, response: res }
    )

    const dbUserRegistrations = await prisma.registration.findMany({
      where: {
        id: user.id,
      },
    })

    expect(userResponse).toEqual(dbUserRegistrations)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('users', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })

    const testUser2 = {
      name: 'Test Man2',
      email: 'test2@test2.com',
      password: 'testpass2',
    }

    const user2 = await prisma.user.create({
      data: {
        name: testUser2.name,
        email: testUser2.email,
        password: await bcrypt.hash(testUser2.password, 10),
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const usersResponse = await Query.users(null, null, { prisma: prisma, request: req, response: res })

    const dbUsers = await prisma.user.findMany({})

    expect(usersResponse).toEqual(dbUsers)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
    await prisma.user.delete({
      where: {
        id: user2.id,
      },
    })
  })
})
