const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@dmi.cm' },
    update: {},
    create: { id: 'demo-user', email: 'demo@dmi.cm', role: 'ADMIN', name: 'Larry' }
  })
  console.log('Seeded demo-user')
}
main()