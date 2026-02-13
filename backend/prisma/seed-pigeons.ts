import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BREEDS = [
  { name: 'Zajel', weight: 40 },
  { name: 'Messawid', weight: 15 },
  { name: 'Ablaq', weight: 15 },
  { name: 'Safi', weight: 10 },
  { name: 'Karakandi', weight: 10 },
  { name: 'Other', weight: 10 },
];

const COLORS = ['Blue Bar', 'Checkered', 'White', 'Black', 'Grizzle'];

const STATUSES = [
  { name: 'Active', weight: 70 },
  { name: 'Breeding', weight: 15 },
  { name: 'Sick', weight: 5 },
  { name: 'Racing', weight: 10 },
];

// Helper to pick random item based on weights
function weightedRandom(items: { name: string; weight: number }[]) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) return item.name;
  }
  return items[0].name;
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomDate(yearsBack: number) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - Math.floor(Math.random() * yearsBack));
  date.setMonth(Math.floor(Math.random() * 12));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date;
}

async function main() {
  console.log('Starting realistic pigeon seeed...');

  // 1. Find or Create User/Loft
  // Try to find the test user first, or just the first user in DB
  let user = await prisma.user.findUnique({
    where: { email: 'test@goldenloft.com' },
  });

  if (!user) {
    console.log('Test user not found, checking for ANY user...');
    const firstUser = await prisma.user.findFirst({ include: { lofts: true } });
    if (firstUser) {
      user = firstUser;
      console.log(`Using existing user: ${user.email}`);
    } else {
      console.log('No users found. Creating test user...');
      user = await prisma.user.create({
        data: {
          email: 'test@goldenloft.com',
          password: 'password123', // In real app, hash this!
          name: 'Test User',
          lofts: {
            create: {
              name: 'Main Loft',
            },
          },
        },
        include: { lofts: true },
      });
    }
  }

  // Ensure user has a loft
  let loft = await prisma.loft.findFirst({ where: { userId: user.id } });
  if (!loft) {
    console.log('User has no loft. Creating one...');
    loft = await prisma.loft.create({
      data: {
        name: 'Main Loft',
        userId: user.id,
      },
    });
  }

  console.log(
    `Seeding birds for User: ${user.email}, Loft: ${loft.name} (${loft.id})`
  );

  const birdsData = [];

  for (let i = 0; i < 50; i++) {
    const breed = weightedRandom(BREEDS);
    const gender = Math.random() < 0.5 ? 'Male' : 'Female'; // 50/50
    const status = weightedRandom(STATUSES);
    const color = getRandomItem(COLORS);
    const birthDate = getRandomDate(3); // Last 3 years
    const ringNumber = `EG-${birthDate.getFullYear()}-${10000 + i}`; // Unique Ring

    // Placeholder image (using generic pigeon placeholder as PNG)
    const image = `https://placehold.co/400x400.png?text=${breed}+Pigeon`;

    birdsData.push({
      ringNumber,
      name: `Pigeon ${i + 1}`,
      type: breed, // 'type' field in Bird model maps to Breed
      gender,
      color,
      status, // 'status' field in Bird model
      birthDate,
      image,
      loftId: loft.id,
      notes: `Generated seed data. Breed: ${breed}, Status: ${status}`,
    });
  }

  // Bulk insert
  // Note: createMany is not supported for SQLite, but fine for Postgres.
  // schema.prisma says provider = "postgresql", so we are good.
  const result = await prisma.bird.createMany({
    data: birdsData,
    skipDuplicates: true, // In case script is re-run
  });

  console.log(`Successfully seeded ${result.count} realistic pigeons! 🐦`);
  console.log('User email to login:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
