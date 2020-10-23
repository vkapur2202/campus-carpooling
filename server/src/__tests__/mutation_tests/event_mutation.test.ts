import { PrismaClient } from '@prisma/client'
import { userInfo } from 'os'

import { Event } from '../../resolvers/mutation/event'
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

describe('event mutations', () => {
  it('createEvent', async () => {
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
    expect(createEventResponse).toEqual(dbEvent)
  })

  it('createEventError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }

    const user = await prisma.user.findOne({
      where: {
        email: testUser.email,
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

    await expect(
      Event.createEvent(
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
    ).rejects.toThrowError(`You have an existing event at this date and time.`)

    const dbEvent = await prisma.event
      .findMany({
        where: {
          user_id: user.id,
          event_date: event.event_date,
        },
      })
      .then((resp) => resp[0])

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

  it('createEventAuthError', async () => {
    const event = {
      name: 'Test Event',
      max_participants: 4,
      start_location: 'Test Start',
      end_location: 'Test End',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    }
    const res = mockResponse()
    const req = mockRequest()

    await expect(
      Event.createEvent(
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
    ).rejects.toThrowError(new AuthError())
  })

  it('updateEvent', async () => {
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

    const dbEvent = await prisma.event.findOne({
      where: {
        id: event.id,
      },
    })

    expect(updateEventResponse).toEqual(dbEvent)

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

  it('updateEventAuthError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }
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

    const res = mockResponse()
    const req = mockRequest()

    await expect(
      Event.updateEvent(
        null,
        {
          id: event.id,
          name: event.name,
          max_participants: event.max_participants,
          start_location: event.start_location,
          end_location: event.end_location,
          event_date: event.event_date,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(new AuthError())

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

  it('deleteEvent', async () => {
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
    expect(deleteEventResponse).toEqual({ message: 'Event successfully deleted!' })

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('deleteEventAuthError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }
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

    const res = mockResponse()
    const req = mockRequest()

    await expect(
      Event.deleteEvent(
        null,
        {
          event_id: event.id,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(new AuthError())

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

  it('deleteEventError', async () => {
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

    await expect(
      Event.deleteEvent(
        null,
        {
          event_id: -1,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(`Event could not be found.`)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('register', async () => {
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

  it('registerError', async () => {
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

    await expect(
      Event.register(
        null,
        {
          event_id: -1,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(`Event could not be found.`)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('registerAuthError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }
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

    const res = mockResponse()
    const req = mockRequest()

    await expect(
      Event.register(
        null,
        {
          event_id: event.id,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(new AuthError())

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

  it('unregisterError', async () => {
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
    await expect(
      Event.unregister(
        null,
        {
          event_id: -1,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(`Event could not be found.`)

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('unregisterAuthError', async () => {
    const testUser = { name: 'Test Man', email: 'test@example.com', password: 'testpass' }
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

    const res = mockResponse()
    const req = mockRequest()
    await expect(
      Event.unregister(
        null,
        {
          event_id: event.id,
        },
        { prisma: prisma, request: req, response: res }
      )
    ).rejects.toThrowError(new AuthError())

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
