import { PrismaClient } from '@prisma/client'

import { Query } from '../../resolvers/query'

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

describe('registration queries', () => {
  it('registration', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@test.com',
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

    const res = mockResponse()
    const req = mockRequest()
    const registrationResponse = await Query.registration(
      null,
      { id: registration.id },
      { prisma: prisma, request: req, response: res }
    )

    const dbRegistration = await prisma.registration.findOne({
      where: {
        id: registration.id,
      },
    })

    expect(registrationResponse).toEqual(dbRegistration)

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

  it('eventRegistrations', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@test.com',
      password: 'testpass',
    }

    const user = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: await bcrypt.hash(testUser.password, 10),
      },
    })

    const testUser2 = {
      name: 'Test Man 2',
      email: 'test2@test2.com',
      password: 'testpass2',
    }

    const user2 = await prisma.user.create({
      data: {
        name: testUser2.name,
        email: testUser2.email,
        password: await bcrypt.hash(testUser2.password, 10),
      },
    })

    const testEvent = {
      name: 'Test Event',
      max_participants: 3,
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

    const registration2 = await prisma.registration.create({
      data: {
        user: {
          connect: {
            id: user2.id,
          },
        },
        event: {
          connect: {
            id: event.id,
          },
        },
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const eventRegistrationsResponse = await Query.eventRegistrations(
      null,
      { id: event.id },
      { prisma: prisma, request: req, response: res }
    )

    const dbEventRegistrations = await prisma.registration.findMany({
      where: {
        event_id: event.id,
      },
    })

    expect(eventRegistrationsResponse).toEqual(dbEventRegistrations)

    await prisma.registration.delete({
      where: {
        id: registration.id,
      },
    })

    await prisma.registration.delete({
      where: {
        id: registration2.id,
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

    await prisma.user.delete({
      where: {
        id: user2.id,
      },
    })
  })

  it('registrations', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@test.com',
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

    const registration2 = await prisma.registration.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        event: {
          connect: {
            id: event2.id,
          },
        },
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const registrationsResponse = await Query.registrations(null, null, { prisma: prisma, request: req, response: res })

    const dbRegistrations = await prisma.registration.findMany({})

    expect(registrationsResponse).toEqual(dbRegistrations)

    await prisma.registration.delete({
      where: {
        id: registration.id,
      },
    })

    await prisma.registration.delete({
      where: {
        id: registration2.id,
      },
    })

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

  it('userRegistrations', async () => {
    const testUser = {
      name: 'Test Man',
      email: 'test@test.com',
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

    const registration2 = await prisma.registration.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        event: {
          connect: {
            id: event2.id,
          },
        },
      },
    })

    const res = mockResponse()
    const req = mockRequest()
    const userRegistrationsResponse = await Query.userRegistrations(
      null,
      { id: user.id },
      { prisma: prisma, request: req, response: res }
    )

    const dbUserRegistrations = await prisma.registration.findMany({
      where: {
        user_id: user.id,
      },
    })

    expect(userRegistrationsResponse).toEqual(dbUserRegistrations)

    await prisma.registration.delete({
      where: {
        id: registration.id,
      },
    })

    await prisma.registration.delete({
      where: {
        id: registration2.id,
      },
    })

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
