import { PrismaClient } from '@prisma/client'
import { request } from 'graphql-request'

const bcrypt = require('bcryptjs')

const host = 'http://localhost:4000'

const createEventMutation = `
  mutation($userId: Int!, $name: String!, $max_participants: Int!, $start_location: String!, $end_location: String!, $event_date: DateTime!) {
    createEvent(userId: $userId, name: $name, max_participants: $max_participants, start_location: $start_location, end_location: $end_location, event_date: $event_date) {
      user{
        id
      }
      id
      name
      max_participants
      start_location
      end_location
      event_date
    }
  }
`
const updateEventMutation = `
  mutation($userId: Int!, $id: Int!, $name: String!, $max_participants: Int!, $start_location: String!, $end_location: String!, $event_date: DateTime!) {
    updateEvent(userId: $userId, id: $id, name: $name, max_participants: $max_participants, start_location: $start_location, end_location: $end_location, event_date: $event_date) {
      message
    }
  }
`
const deleteEventMutation = `
  mutation($userId: Int!, $name: String!, $event_date: DateTime!) {
    deleteEvent(userId: $userId, name: $name,  event_date: $event_date) {
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

describe('event mutations', () => {
  it('createEvent', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })

    const event = {
      name: 'Test Event',
      max_participants: 4,
      start_location: 'Test Start',
      end_location: 'Test End',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }
    const createEventResponse = await request(host, createEventMutation, {
      userId: user.id,
      name: event.name,
      max_participants: event.max_participants,
      start_location: event.start_location,
      end_location: event.end_location,
      event_date: event.event_date,
    })

    const dbEvent = await prisma.event
      .findMany({
        where: {
          user_id: user.id,
          event_date: event.event_date,
        },
      })
      .then((resp) => resp[0])

    expect(dbEvent).toBeDefined()
    expect(createEventResponse).toEqual({
      createEvent: {
        user: {
          id: `${dbEvent.user_id}`,
        },
        id: `${dbEvent.id}`,
        name: dbEvent.name,
        max_participants: dbEvent.max_participants,
        start_location: dbEvent.start_location,
        end_location: dbEvent.end_location,
        event_date: JSON.stringify(dbEvent.event_date).slice(1, 25),
      },
    })
    expect(dbEvent.user_id).toEqual(user.id)
    expect(dbEvent.name).toEqual(event.name)
    expect(dbEvent.max_participants).toEqual(event.max_participants)
    expect(dbEvent.start_location).toEqual(event.start_location)
    expect(dbEvent.end_location).toEqual(event.end_location)
    expect(dbEvent.event_date).toEqual(event.event_date)

    await prisma.event.delete({
      where: {
        id: dbEvent.id,
      },
    })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  // it('updateEvent', async () => {
  //   const testUser = { name: "Test Man", email: "test@test.com", password: "testpass", year: "Freshman", gender: "Woman", can_drive: true, max_capacity: 3 }

  //   const user = await prisma.user.create({
  //     data: {
  //       name: testUser.name,
  //       email: testUser.email,
  //       password: await bcrypt.hash(testUser.password, 10),
  //     },
  //   })

  //   const event = await prisma.event.create({
  //     data
  //   })
  //   const updateEventResponse = await request(host, updateEventMutation, {
  //     userId: user.id,
  //     name: user
  //           max_participants
  //           start_location
  //           end_location
  //           event_date
  //   })

  //   const dbUser = await prisma.user.findOne({ where: { id: user.id } })

  //   expect(updateEventResponse).toEqual({
  //     updateEvent: {
  //       id: `${dbUser!.id}`,
  //       name: dbUser.name,
  //       email: dbUser.email,
  //       year: dbUser.year,
  //       gender: dbUser.gender,
  //       can_drive: dbUser.can_drive,
  //       max_capacity: dbUser.max_capacity,
  //     },
  //   })

  //   await prisma.user.delete({
  //     where: {
  //       id: dbUser.id
  //     }
  //   })
  // })

  // it('deleteEvent', async () => {
  //   const testUser = { name: "Test Man", email: "test@test.com", password: "testpass", year: "Freshman", gender: "Woman", can_drive: true, max_capacity: 3 }

  //   const user = await prisma.user.create({
  //     data: {
  //       name: testUser.name,
  //       email: testUser.email,
  //       password: await bcrypt.hash(testUser.password, 10),
  //     },
  //   })

  //   const event = await prisma.event.create({
  //     data
  //   })
  //   const deleteEventResponse = await request(host, deleteEventMutation, {
  //     userId: user.id,
  //     name: user
  //           max_participants
  //           start_location
  //           end_location
  //           event_date
  //   })

  //   const dbUser = await prisma.user.findOne({ where: { id: user.id } })

  //   expect(deleteEventResponse).toEqual({
  //     deleteEvent: {
  //       id: `${dbUser!.id}`,
  //       name: dbUser.name,
  //       email: dbUser.email,
  //       year: dbUser.year,
  //       gender: dbUser.gender,
  //       can_drive: dbUser.can_drive,
  //       max_capacity: dbUser.max_capacity,
  //     },
  //   })

  //   await prisma.user.delete({
  //     where: {
  //       id: dbUser.id
  //     }
  //   })
  // })
})
