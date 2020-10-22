// import { PrismaClient } from '@prisma/client'
// import { request } from 'graphql-request'

// const bcrypt = require('bcryptjs')

// const host = 'http://localhost:4000'

// const meQuery = `
//     query{
//         me{

//         }
//     }
// `
// const userQuery = `
//     query{
//         user{

//         }
//     }
// `

// const usersQuery = `
//     query{
//         users{

//         }
//     }
// `
// const eventQuery = `
//     query{
//         event{

//         }
//     }
// `
// const activeEventsQuery = `
//     query{
//         activeEvents{

//         }
//     }
// `
// const inactiveEventsQuery = `
//     query{
//         inactiveEvents{

//         }
//     }
// `
// const eventsQuery = `
//     query{
//         events{

//         }
//     }
// `

// const prisma = new PrismaClient()

// beforeAll(async () => {
//     await prisma.$connect()
// })

// afterAll(async () => {
//     await prisma.$disconnect()
// })

// describe('user queries', () => {
//     it('user', async () => {
//         const testUser = { year: "Freshman", gender: "Woman", can_drive: true, max_capacity: 3 }

//         const dbUser = await prisma.user.create({
//             data: {
//                 name: 'Test Man',
//                 email: 'test@test.com',
//                 password: await bcrypt.hash('testpass', 10),
//             },
//         })

//         const setProfileResponse = await request(host, setProfileMutation, {
//             id: dbUser.id,
//             year: testUser.year,
//             gender: testUser.gender,
//             can_drive: testUser.can_drive,
//             max_capacity: testUser.max_capacity,
//         })

//         expect(setProfileResponse).toEqual({
//             setProfile: {
//                 id: `${dbUser!.id} `,
//                 name: dbUser.name,
//                 email: dbUser.email,
//                 year: dbUser.year,
//                 gender: dbUser.gender,
//                 can_drive: dbUser.can_drive,
//                 max_capacity: dbUser.max_capacity,
//             },
//         })
//     })
// })
