const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('Testing DB conection...');
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database.');

    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users.`);

    // Manual Layout Migration
    console.log('Attempting to add missing column...');
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "HealthRecord" ADD COLUMN IF NOT EXISTS "notes" TEXT;`
    );
    console.log(
      '✅ Successfully added "notes" column to HealthRecord (if it didn\'t exist).'
    );
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
