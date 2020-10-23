import { PrismaClient } from '@prisma/client'

import { User } from '../../resolvers/mutation/user'
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

describe('user mutations', () => {
  it('setProfile', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
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
      },
    })
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })
    const setProfileResponse = await User.setProfile(
      null,
      {
        //userId: user.id,
        year: testUser.year,
        gender: testUser.gender,
        can_drive: testUser.can_drive,
        max_capacity: testUser.max_capacity,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    expect(setProfileResponse).toEqual(dbUser)

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('setProfileAuthError', async () => {
    const testUser = {
      year: 'Freshman',
      gender: 'Woman',
      can_drive: true,
      max_capacity: 3,
    }

    const res = mockResponse()
    const req = mockRequest()
    await expect(
      User.setProfile(
        null,
        {
          //userId: user.id,
          year: testUser.year,
          gender: testUser.gender,
          can_drive: testUser.can_drive,
          max_capacity: testUser.max_capacity,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(new AuthError())
  })

  it('updateProfile', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
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
    const updatedUser = { year: 'Sophomore', gender: 'Woman', can_drive: false, max_capacity: 0 }

    const updateProfileResponse = await User.updateProfile(
      null,
      {
        args: {
          year: updatedUser.year,
          gender: updatedUser.gender,
          can_drive: updatedUser.can_drive,
          max_capacity: updatedUser.max_capacity,
        },
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    expect(dbUser.year).toEqual(updatedUser.year)
    expect(dbUser.gender).toEqual(updatedUser.gender)
    expect(dbUser.can_drive).toEqual(updatedUser.can_drive)
    expect(dbUser.max_capacity).toEqual(updatedUser.max_capacity)
    expect(updateProfileResponse).toEqual({ message: `Profile has been updated!` })

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('updateProfileAuthError', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@example.com',
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
    const req = mockRequest()
    await expect(
      User.updateProfile(
        null,
        {
          args: {
            id: user.id,
            year: testUser.year,
            gender: testUser.gender,
            can_drive: testUser.can_drive,
            max_capacity: testUser.max_capacity,
          },
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(new AuthError())

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })
})
