import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database content...');

  const users = await prisma.user.findMany({
    include: {
      lofts: {
        include: {
          _count: {
            select: { birds: true },
          },
        },
      },
    },
  });

  console.log(`Found ${users.length} users:`);
  users.forEach((u) => {
    console.log(`- User: ${u.email} (ID: ${u.id})`);
    if (u.lofts.length === 0) {
      console.log('  No lofts.');
    } else {
      u.lofts.forEach((l) => {
        console.log(
          `  - Loft: ${l.name} (ID: ${l.id}) - Birds: ${l._count.birds}`
        );
      });
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
