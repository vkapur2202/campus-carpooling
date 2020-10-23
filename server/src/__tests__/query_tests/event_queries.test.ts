import { PrismaClient } from '@prisma/client'

import { Query } from '../../resolvers/query'
import { Event } from '../../resolvers/query/event'

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

describe('event queries', () => {
  it('eventUser', async () => {
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
    const eventUserResponse = await Event.user(event, null, { prisma: prisma, request: req, response: res })

    expect(eventUserResponse).toEqual(user)
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

  it('event', async () => {
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
    const eventResponse = await Query.event(null, { id: event.id }, { prisma: prisma, request: req, response: res })

    const dbEvent = await prisma.event.findOne({
      where: {
        id: event.id,
      },
    })

    expect(eventResponse).toEqual(dbEvent)

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

  it('events', async () => {
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

    const testEvent2 = {
      name: 'Test Event 2',
      max_participants: 3,
      start_location: 'Test Start 2',
      end_location: 'Test End 2',
      event_date: new Date(2020, 9, 28, 18, 30, 0, 0),
    }

    const event2 = await prisma.event.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name: testEvent2.name,
        max_participants: testEvent2.max_participants,
        start_location: testEvent2.start_location,
        end_location: testEvent2.end_location,
        event_date: testEvent2.event_date,
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const eventsResponse = await Query.events(null, null, { prisma: prisma, request: req, response: res })

    const dbEvents = await prisma.event.findMany({})

    expect(eventsResponse).toEqual(dbEvents)

    await prisma.event.delete({
      where: {
        id: event.id,
      },
    })

    await prisma.event.delete({
      where: {
        id: event2.id,
      },
    })
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('activeEvents', async () => {
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

    const testEvent = {
      name: 'Test Event',
      max_participants: 4,
      start_location: 'Test Start',
      end_location: 'Test End',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
      is_active: true,
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
        is_active: testEvent.is_active,
      },
    })

    const testEvent2 = {
      name: 'Test Event 2',
      max_participants: 3,
      start_location: 'Test Start 2',
      end_location: 'Test End 2',
      event_date: new Date(2020, 9, 28, 18, 30, 0, 0),
      is_active: true,
    }

    const event2 = await prisma.event.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name: testEvent2.name,
        max_participants: testEvent2.max_participants,
        start_location: testEvent2.start_location,
        end_location: testEvent2.end_location,
        event_date: testEvent2.event_date,
        is_active: testEvent2.is_active,
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const eventsResponse = await Query.activeEvents(null, null, { prisma: prisma, request: req, response: res })

    const dbActiveEvents = await prisma.event.findMany({
      where: {
        is_active: true,
      },
    })

    expect(eventsResponse).toEqual(dbActiveEvents)

    await prisma.event.delete({
      where: {
        id: event.id,
      },
    })

    await prisma.event.delete({
      where: {
        id: event2.id,
      },
    })
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })

  it('inactiveEvents', async () => {
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

    const testEvent = {
      name: 'Test Event',
      max_participants: 4,
      start_location: 'Test Start',
      end_location: 'Test End',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
      is_active: true,
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
        is_active: testEvent.is_active,
      },
    })

    const testEvent2 = {
      name: 'Test Event 2',
      max_participants: 3,
      start_location: 'Test Start 2',
      end_location: 'Test End 2',
      event_date: new Date(2020, 9, 28, 18, 30, 0, 0),
      is_active: false,
    }

    const event2 = await prisma.event.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name: testEvent2.name,
        max_participants: testEvent2.max_participants,
        start_location: testEvent2.start_location,
        end_location: testEvent2.end_location,
        event_date: testEvent2.event_date,
        is_active: testEvent2.is_active,
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const eventsResponse = await Query.inactiveEvents(null, null, { prisma: prisma, request: req, response: res })

    const dbInactiveEvents = await prisma.event.findMany({
      where: {
        is_active: false,
      },
    })

    expect(eventsResponse).toEqual(dbInactiveEvents)

    await prisma.event.delete({
      where: {
        id: event.id,
      },
    })

    await prisma.event.delete({
      where: {
        id: event2.id,
      },
    })
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
  })
})
