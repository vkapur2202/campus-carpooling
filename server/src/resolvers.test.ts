import { PrismaClient } from '@prisma/client'
import { request } from 'graphql-request'

const host = 'http://localhost:4000'

const signupMutation = `
    mutation($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }
`

const loginMutation = `
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
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

describe('resolvers', () => {
  it('signup and login', async () => {
    const testUser = { name: 'Bob Ross', email: 'bob@bob.com', password: 'bobby' }

    const signupResponse = await request(host, signupMutation, {
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
    })
    console.log('SIGNUP', signupResponse)

    const dbUser = await prisma.user.findOne({ where: { email: testUser.email } })
    expect(dbUser).toBeDefined()

    expect(signupResponse).toEqual({
      signup: {
        id: `${dbUser!.id}`,
        name: dbUser.name,
        email: dbUser.email,
      },
    })
  })
})
