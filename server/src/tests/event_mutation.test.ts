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

  it('updateEvent', async () => {
    const testUser = { name: 'Test Man', email: 'test@test.com', password: 'testpass' }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })

    const testEvent = {
      name: 'Test Event',
      max_participants: 4,
      start_location: 'Test Start',
      end_location: 'Test End',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }

    const event = await prisma.event.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name: testEvent.name,
        max_participants: testEvent.max_participants,
        start_location: testEvent.start_location,
        end_location: testEvent.end_location,
        event_date: testEvent.event_date,
      },
    })

    const updatedEvent = {
      name: 'Test Event2',
      max_participants: 3,
      start_location: 'Test Start2',
      end_location: 'Test End2',
      event_date: new Date(2020, 9, 26, 18, 30, 0, 0),
    }

    const updateEventResponse = await request(host, updateEventMutation, {
      userId: user.id,
      id: event.id,
      name: updatedEvent.name,
      max_participants: updatedEvent.max_participants,
      start_location: updatedEvent.start_location,
      end_location: updatedEvent.end_location,
      event_date: updatedEvent.event_date,
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
    expect(updateEventResponse).toEqual({
      updateEvent: {
        user: {
          id: `${user.id}`,
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
    expect(dbEvent.name).toEqual(updatedEvent.name)
    expect(dbEvent.max_participants).toEqual(updatedEvent.max_participants)
    expect(dbEvent.start_location).toEqual(updatedEvent.start_location)
    expect(dbEvent.end_location).toEqual(updatedEvent.end_location)
    expect(dbEvent.event_date).toEqual(updatedEvent.event_date)

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

  // it('deleteEvent', async () => {
  //   const testUser = { name: "Test Man", email: "test@test.com", password: "testpass" }

  //   const user = await prisma.user.create({
  //     data: {
  //       name: testUser.name,
  //       email: testUser.email,
  //       password: await bcrypt.hash(testUser.password, 10),
  //     },
  //   })

  //   const testEvent = {
  //     name: 'Test Event',
  //     max_participants: 4,
  //     start_location: 'Test Start',
  //     end_location: 'Test End',
  //     event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
  //   }

  //   const event = await prisma.event.create({
  //     data: {
  //       user: {
  //         connect: {
  //           id: user.id,
  //         },
  //       },
  //       name: testEvent.name,
  //       max_participants: testEvent.max_participants,
  //       start_location: testEvent.start_location,
  //       end_location: testEvent.end_location,
  //       event_date: testEvent.event_date,
  //     },
  //   })

  //   const deleteEventResponse = await request(host, createEventMutation, {
  //     userId: user.id,
  //     name: event.name,
  //     max_participants: event.max_participants,
  //     start_location: event.start_location,
  //     end_location: event.end_location,
  //     event_date: event.event_date,
  //   })

  //   const dbEvent = await prisma.event
  //     .findMany({
  //       where: {
  //         user_id: user.id,
  //         event_date: event.event_date,
  //       },
  //     })
  //     .then((resp) => resp[0])

  //   expect(dbEvent).toBeDefined()
  //   expect(deleteEventResponse).toEqual({
  //     updateEvent: {
  //       user: {
  //         id: `${dbEvent.user_id}`,
  //       },
  //       id: `${dbEvent.id}`,
  //       message: 'Event successfully deleted!'
  //     },
  //   })

  //   await prisma.event.delete({
  //     where: {
  //       id: dbEvent.id,
  //     },
  //   })

  //   await prisma.user.delete({
  //     where: {
  //       id: user.id,
  //     },
  //   })
  // })
})
