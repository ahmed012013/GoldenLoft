import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@goldenloft.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`Resetting password for ${email}...`);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        name: 'Test User',
        password: hashedPassword,
        lofts: {
          create: {
            name: 'Main Loft',
          },
        },
      },
    });
    console.log(`User ${user.email} updated successfully.`);
    console.log(`New Password: ${password}`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
