import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  await prisma.user.deleteMany({})

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@case.edu',
      password: 'pass',
    },
  })

  await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane.doe@case.edu',
      password: 'password',
    },
  })

  const sally = await prisma.user.create({
    data: {
      name: 'Vivek Kapur',
      email: 'vkk9@case.edu',
      password: 'something>password',
    },
  })

  console.log('created users')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
