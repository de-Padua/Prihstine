
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function db() {
    // ... you will write your Prisma Client queries here
}

db()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })



module.exports = prisma
