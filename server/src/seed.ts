import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

const main = async () => {
  await prisma.registration.deleteMany({})
  await prisma.event.deleteMany({})
  await prisma.user.deleteMany({})

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@case.edu',
      password: await bcrypt.hash('password', 10),
    },
  })

  await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@case.edu',
      password: await bcrypt.hash('pass123', 10),
    },
  })

  const vivek = await prisma.user.create({
    data: {
      name: 'Vivek Kapur',
      email: 'vkk9@case.edu',
      password: await bcrypt.hash('pass', 10),
    },
  })

  const sanhi = await prisma.user.create({
    data: {
      name: 'Sanhi Kumari',
      email: 'sxk1409@case.edu',
      password: await bcrypt.hash('sanhitest', 10),
    },
  })
  console.log('created users')

  const test_active = await prisma.event.create({
    data: {
      user: {
        connect: {
          id: vivek.id,
        },
      },
      name: 'event test 1',
      max_participants: 3,
      start_location: 'Clarke',
      end_location: 'Fribley',
      event_date: new Date(2020, 9, 27, 18, 30, 0, 0),
    },
  })
  await prisma.event.create({
    data: {
      user: {
        connect: {
          id: vivek.id,
        },
      },
      name: 'event test 2',
      max_participants: 4,
      start_location: 'Daves',
      end_location: 'Bingham',
      event_date: new Date(2021, 1, 2, 12, 45, 0, 0),
      is_active: false,
    },
  })
  console.log('created events')

  await prisma.registration.create({
    data: {
      user: {
        connect: {
          id: sanhi.id,
        },
      },
      event: {
        connect: {
          id: test_active.id,
        },
      },
    },
  })
  console.log('registered for event')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
