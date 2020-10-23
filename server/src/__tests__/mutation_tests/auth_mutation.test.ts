import { PrismaClient } from '@prisma/client'

import { Auth } from '../../resolvers/mutation/auth'

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
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }
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

    console.log(signupResponse)
    const dbUser = await prisma.user.findOne({ where: { email: testUser.email } })
    expect(dbUser).toBeDefined()
    expect(dbUser.name).toEqual(testUser.name)
    expect(dbUser.email).toEqual(testUser.email)
    expect(await bcrypt.compare(testUser.password, dbUser.password)).toEqual(true)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('login', async () => {
    const req = mockRequest()
    const res = mockResponse()
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

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
    console.log(loginResponse)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
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
    console.log(logoutResponse)
  })
  it('resetRequest', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@test.com',
      password: 'testpass',
      year: 'Freshman',
      gender: 'Woman',
      can_drive: true,
      max_capacity: 3,
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
        year: testUser.year,
        gender: testUser.gender,
        can_drive: testUser.can_drive,
        max_capacity: testUser.max_capacity,
      },
    })
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })
    const updatedUser = { password: 'testpass2' }

    const resetRequestResponse = await Auth.resetRequest(
      null,
      {
        email: user.email,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('resetPassword', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })
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

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('activateAccount', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

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
    console.log(activateAccountResponse)
    expect(activateAccountResponse).toEqual({ message: 'Confirmation email successfully sent!' })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('confirmAccount', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })
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
    expect(confirmAccountResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })
})
