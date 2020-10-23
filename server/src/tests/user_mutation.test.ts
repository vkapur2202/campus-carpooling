import { PrismaClient } from '@prisma/client'
import { request } from 'graphql-request'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const host = 'http://localhost:4000'

const loginMutation = `
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
    }
  }
`

const setProfileMutation = `
    mutation($userId: Int!, $year: String!, $gender: String!, $can_drive: Boolean!, $max_capacity: Int!) {
        setProfile(userId: $userId, year: $year, gender: $gender, can_drive: $can_drive, max_capacity: $max_capacity) {
            id
            name
            email
            year
            gender
            can_drive
            max_capacity
        }
    }
`
const updateProfileMutation = `
    mutation($userId: Int!, $year: String!, $gender: String!, $can_drive: Boolean!, $max_capacity: Int!) {
        updateProfile(userId: $userId, year: $year, gender: $gender, can_drive: $can_drive, max_capacity: $max_capacity) {
            message
        }
    }
`
// const resetRequestMutation = `
//     mutation($email: String!) {
//         resetRequest(email: $email) {
//             message
//         }
//     }
// `

const resetPasswordMutation = `
    mutation($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            id
            name
            email
            password
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

describe('user mutations', () => {
  it('setProfile', async () => {
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
      },
    })

    const setProfileResponse = await request(host, setProfileMutation, {
      userId: user.id,
      year: testUser.year,
      gender: testUser.gender,
      can_drive: testUser.can_drive,
      max_capacity: testUser.max_capacity,
    })

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    expect(setProfileResponse).toEqual({
      setProfile: {
        id: `${dbUser!.id}`,
        name: dbUser.name,
        email: dbUser.email,
        year: dbUser.year,
        gender: dbUser.gender,
        can_drive: dbUser.can_drive,
        max_capacity: dbUser.max_capacity,
      },
    })

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  it('updateProfile', async () => {
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

    const updatedUser = { year: 'Sophomore', gender: 'Woman', can_drive: false, max_capacity: 0 }

    const updateProfileResponse = await request(host, updateProfileMutation, {
      userId: user.id,
      year: updatedUser.year,
      gender: updatedUser.gender,
      can_drive: updatedUser.can_drive,
      max_capacity: updatedUser.max_capacity,
    })

    const dbUser = await prisma.user.findOne({ where: { id: user.id } })

    expect(dbUser.year).toEqual(updatedUser.year)
    expect(dbUser.gender).toEqual(updatedUser.gender)
    expect(dbUser.can_drive).toEqual(updatedUser.can_drive)
    expect(dbUser.max_capacity).toEqual(updatedUser.max_capacity)
    expect(updateProfileResponse).toEqual({
      updateProfile: {
        message: `User has been updated!`,
      },
    })

    await prisma.user.delete({
      where: {
        id: dbUser.id,
      },
    })
  })

  // it('resetRequest', async () => {
  //     const testUser = { name: "Test Man", email: "test@test.com", password: "testpass", year: "Freshman", gender: "Woman", can_drive: true, max_capacity: 3 }

  //     const user = await prisma.user.create({
  //         data: {
  //             name: testUser.name,
  //             email: testUser.email,
  //             password: await bcrypt.hash(testUser.password, 10),
  //             year: testUser.year,
  //             gender: testUser.gender,
  //             can_drive: testUser.can_drive,
  //             max_capacity: testUser.max_capacity
  //         },
  //     })

  //     const updatedUser = { password: "testpass2" }

  //     const resetRequestResponse = await request(host, resetRequestMutation, {
  //         userId: user.id,
  //         password: await bcrypt.hash(updatedUser.password, 10),
  //     })

  //     const dbUser = await prisma.user.findOne({ where: { id: user.id } })

  //     expect(dbUser.password).toEqual(updatedUser.password)
  //     expect(resetRequestResponse).toEqual({
  //         resetRequest: {
  //             message: 'Reset password email successfully sent!'
  //         },
  //     })

  //     await prisma.user.delete({
  //         where: {
  //             id: dbUser.id
  //         }
  //     })
  // })

  // it('resetPassword', async () => {
  //     const testUser = { name: "Test Man", email: "test@test.com", password: "testpass" }

  //     const user = await prisma.user.create({
  //         data: {
  //             name: testUser.name,
  //             email: testUser.email,
  //             password: await bcrypt.hash(testUser.password, 10),
  //         },
  //     })

  //     const token: string = jwt.sign({ userId: user.id }, "s3cUr3@SEcr3t!", { expiresIn: '1h' })

  //     const updatedUser = { password: "testpass2" }

  //     const resetPasswordResponse = await request(host, resetPasswordMutation, {
  //         token: token,
  //         password: updatedUser.password,
  //     })

  //     const dbUser = await prisma.user.findOne({ where: { id: user.id } })

  //     expect(resetPasswordResponse).toEqual({
  //         resetPassword: {
  //             id: `${dbUser!.id}`,
  //             name: dbUser.name,
  //             email: dbUser.email,
  //             password: await bcrypt.hash(updatedUser.password, 10)
  //         },
  //     })

  //     expect(await bcrypt.compare(updatedUser.password, dbUser.password)).toEqual(true)

  //     await prisma.user.delete({
  //         where: {
  //             id: dbUser.id
  //         }
  //     })
  // })
})
