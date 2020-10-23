import { PrismaClient } from '@prisma/client'

import { Event } from '../../resolvers/mutation/event'

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
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })

    const event = {
      name: 'Test Event',
      max_participants: 4,
      start_location: 'Test Start',
      end_location: 'Test End',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }
    const createEventResponse = await Event.createEvent(
      null,
      {
        name: event.name,
        max_participants: event.max_participants,
        start_location: event.start_location,
        end_location: event.end_location,
        event_date: event.event_date,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbEvent = await prisma.event
      .findMany({
        where: {
          user_id: user.id,
          event_date: event.event_date,
        },
      })
      .then((resp) => resp[0])

    expect(dbEvent).toBeDefined()
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
    const res = mockResponse()
    const req = mockRequest({ userId: user.id })
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

    const updateEventResponse = await Event.updateEvent(
      null,
      {
        id: event.id,
        name: updatedEvent.name,
        max_participants: updatedEvent.max_participants,
        start_location: updatedEvent.start_location,
        end_location: updatedEvent.end_location,
        event_date: updatedEvent.event_date,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbEvent = await prisma.event
      .findMany({
        where: {
          user_id: user.id,
          event_date: event.event_date,
        },
      })
      .then((resp) => resp[0])

    expect(dbEvent).toBeDefined()
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

  it('deleteEvent', async () => {
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

    const deleteEventResponse = await Event.deleteEvent(
      null,
      {
        event_id: event.id,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbEvent = await prisma.event.findOne({
      where: {
        id: event.id,
      },
    })

    expect(dbEvent).toBeNull()

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('register', async () => {
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

    const registerResponse = await Event.register(
      null,
      {
        event_id: event.id,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbRegistration = await prisma.registration
      .findMany({
        where: {
          user_id: user.id,
          event_id: event.id,
        },
      })
      .then((resp) => resp[0])

    expect(dbRegistration).toBeDefined()
    expect(registerResponse).toEqual(dbRegistration)

    await prisma.registration.delete({
      where: {
        id: dbRegistration.id,
      },
    })

    await prisma.event.delete({
      where: {
        id: event.id,
      },
    })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('unregister', async () => {
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

    const registration = await prisma.registration.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        event: {
          connect: {
            id: event.id,
          },
        },
      },
    })
    const unregisterResponse = await Event.unregister(
      null,
      {
        event_id: event.id,
      },
      { prisma: prisma, request: req, response: res }
    )

    const dbRegistration = await prisma.registration.findOne({
      where: {
        id: registration.id,
      },
    })

    expect(dbRegistration).toBeNull()
    expect(unregisterResponse).toEqual({ message: 'Registration successfully deleted!' })

    await prisma.event.delete({
      where: {
        id: event.id,
      },
    })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })
})
