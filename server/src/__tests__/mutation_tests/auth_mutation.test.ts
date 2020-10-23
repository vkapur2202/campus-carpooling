import { PrismaClient } from '@prisma/client'

import { Auth } from '../../resolvers/mutation/auth'
import { AuthError } from '../../utils'

require('sinon')
const { mockRequest, mockResponse } = require('mock-req-res')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()

beforeAll(async () => {
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('auth mutations', () => {
  it('signup', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }
    const req = mockRequest()
    const res = mockResponse()
    const signupResponse = await Auth.signup(
      null,
      {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({ where: { email: testUser.email } })

    expect(dbUser).toBeDefined()
    expect(signupResponse).toEqual(dbUser)
  })

  it('signupError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }
    const req = mockRequest()
    const res = mockResponse()
    await expect(
      Auth.signup(
        null,
        {
          name: testUser.name,
          email: testUser.email,
          password: testUser.password,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(`The email ${testUser.email} is already in use`)

    await prisma.user.delete({
      where: {
        email: testUser.email,
      },
    })
  })

  it('login', async () => {
    const req = mockRequest()
    const res = mockResponse()
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })

    const loginResponse = await Auth.login(
      null,
      {
        email: testUser.email,
        password: testUser.password,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    expect(loginResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('loginEmailError', async () => {
    const testUser = {
      email: 'test@example.com',
      password: 'testpass',
    }
    const req = mockRequest()
    const res = mockResponse()
    await expect(
      Auth.login(
        null,
        { email: testUser.email, password: testUser.password },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(`User with email '${testUser.email}' does not exist.`)
  })

  it('loginPasswordError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass', incorrectPassword: 'test' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const req = mockRequest()
    const res = mockResponse()
    await expect(
      Auth.login(
        null,
        { email: testUser.email, password: testUser.incorrectPassword },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError('Invalid password.')

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('logout', async () => {
    const req = mockRequest()
    const res = mockResponse()
    const token: string = jwt.sign({ userId: 3 }, process.env.APP_SECRET)
    res.cookie(process.env.TOKEN_NAME, token, {
      httpOnly: false,
      maxAge: 1000 * 60 * 60, // 1 hour cookie
    })
    const logoutResponse = await Auth.logout(null, null, { prisma: prisma, request: req, response: res })

    expect(logoutResponse).toEqual({ message: "You've successfully logged out. Bye!" })
  })

  it('resetRequest', async () => {
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

    const resetRequestResponse = await Auth.resetRequest(
      null,
      {
        email: user.email,
      },
      { prisma: prisma, request: req, response: res }
    )

    expect(resetRequestResponse).toEqual({ message: 'Reset password email successfully sent!' })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('resetRequestError', async () => {
    const testUser = {
      email: 'test@example.com',
    }
    const req = mockRequest()
    const res = mockResponse()
    await expect(
      Auth.resetRequest(null, { email: testUser.email }, { prisma: prisma, request: req, response: res })
    ).rejects.toThrowError(`Can't find a user in our system with email: ${testUser.email}`)
  })

  it('resetPassword', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const token: string = jwt.sign({ userId: user.id }, process.env.APP_SECRET, { expiresIn: '1h' })
    const updatedUser = { password: 'testpass2' }

    const resetPasswordResponse = await Auth.resetPassword(
      null,
      {
        token: token,
        password: updatedUser.password,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    expect(await bcrypt.compare(updatedUser.password, dbUser.password)).toEqual(true)
    expect(resetPasswordResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('activateAccount', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })

    const activateAccountResponse = await Auth.activateAccount(
      null,
      { args: null },
      { prisma: prisma, request: req, response: res }
    )

    expect(activateAccountResponse).toEqual({ message: 'Confirmation email successfully sent!' })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('activateAccountAuthError', async () => {
    const res = mockResponse()
    const req = mockRequest()

    await expect(
      Auth.activateAccount(null, { args: null }, { prisma: prisma, request: req, response: res })
    ).rejects.toThrowError(new AuthError())
  })

  it('confirmAccount', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest()
    const token: string = jwt.sign({ userId: user.id }, process.env.APP_SECRET, { expiresIn: '1h' })
    const confirmAccountResponse = await Auth.confirmAccount(
      null,
      { token: token },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({
      where: {
        id: user.id,
      },
    })

    expect(dbUser.confirmed).toEqual(true)
    expect(confirmAccountResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })
})
