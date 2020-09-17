import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

const main = async () => {
  await prisma.user.deleteMany({})

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@case.edu',
      password: await bcrypt.hash("password", 10),
    },
  })

  await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@case.edu',
      password: await bcrypt.hash("pass123", 10),
    },
  })

  const sally = await prisma.user.create({
    data: {
      name: 'Vivek Kapur',
      email: 'vkk9@case.edu',
      password: await bcrypt.hash("pass", 10),
    },
  })

  console.log('created users')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
