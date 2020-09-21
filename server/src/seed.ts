import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

const main = async () => {
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

  console.log('created users')

  const test_event = await prisma.event.create({
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
  console.log('created events')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
