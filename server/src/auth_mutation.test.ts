import { PrismaClient } from '@prisma/client'
import { request } from 'graphql-request'

import { main } from './seed'

const host = 'http://localhost:4000'

const bcrypt = require('bcryptjs')

const signupMutation = `
    mutation($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }
`

const loginMutation = `
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`

const logoutMutation = `
  mutation {
    logout {
      message
    }
  }
`

const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('auth mutations', () => {
  it('signup', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

    const signupResponse = await request(host, signupMutation, {
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    })

    const dbUser = await prisma.user.findOne({ where: { email: testUser.email } })
    expect(dbUser).toBeDefined()
    expect(dbUser.name).toEqual(testUser.name)
    expect(dbUser.email).toEqual(testUser.email)
    expect(await bcrypt.compare(testUser.password, dbUser.password)).toEqual(true)

    expect(signupResponse).toEqual({
      signup: {
        id: `${dbUser!.id}`,
        name: dbUser.name,
        email: dbUser.email,
      },
    })

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('login', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

    await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })

    const loginResponse = await request(host, loginMutation, {
      email: testUser.email,
      password: testUser.password,
    })

    const dbUser = await prisma.user.findOne({ where: { email: testUser.email } })

    expect(loginResponse).toEqual({
      login: {
        id: `${dbUser!.id}`,
        name: dbUser.name,
        email: dbUser.email,
      },
    })

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('logout', async () => {
    const logoutResponse = await request(host, logoutMutation)

    expect(logoutResponse).toEqual({
      logout: {
        message: "You've successfully logged out. Bye!",
      },
    })
  })
})
