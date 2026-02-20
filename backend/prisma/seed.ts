import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  // 1. Get or Create User
  const user = await prisma.user.upsert({
    where: { email: 'test@goldenloft.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'test@goldenloft.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // 2. Get or Create Loft
  const loft = await prisma.loft.findFirst({ where: { userId: user.id } });
  let loftId = loft?.id;

  if (!loftId) {
    const newLoft = await prisma.loft.create({
      data: {
        name: 'Main Loft',
        userId: user.id,
      },
    });
    loftId = newLoft.id;
  }

  // 3. Define Data Arrays
  const breeds = [
    { name: 'Zajel', weight: 0.4 }, // 40%
    { name: 'Messawid', weight: 0.15 }, // 15%
    { name: 'Ablaq', weight: 0.15 }, // 15%
    { name: 'Safi', weight: 0.2 }, // 20%
    { name: 'Other', weight: 0.1 }, // 10%
  ];

  const statuses = [
    { name: 'ACTIVE', weight: 0.7 }, // 70%
    { name: 'BREEDING', weight: 0.15 }, // 15%
    { name: 'SICK', weight: 0.05 }, // 5%
    { name: 'RACING', weight: 0.1 }, // 10%
  ];

  const colors = ['Blue Bar', 'Checkered', 'White', 'Black', 'Grizzle'];
  const genders = ['MALE', 'FEMALE'];

  // 4. Generate Birds
  const birds: any[] = [];
  const totalBirds = 50;

  for (let i = 0; i < totalBirds; i++) {
    // Select Breed based on weight
    const breedRand = Math.random();
    let selectedBreed = 'Other';
    let accumWeight = 0;
    for (const b of breeds) {
      accumWeight += b.weight;
      if (breedRand <= accumWeight) {
        selectedBreed = b.name;
        break;
      }
    }

    // Select Status based on weight
    const statusRand = Math.random();
    let selectedStatus = 'ACTIVE';
    accumWeight = 0;
    for (const s of statuses) {
      accumWeight += s.weight;
      if (statusRand <= accumWeight) {
        selectedStatus = s.name;
        break;
      }
    }

    // Colors and Gender
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    const selectedGender = genders[Math.floor(Math.random() * genders.length)];

    // Hatch Date (Last 3 years)
    const today = new Date();
    const threeYearsAgo = new Date(
      today.getFullYear() - 3,
      today.getMonth(),
      today.getDate()
    );
    const hatchDate = new Date(
      threeYearsAgo.getTime() +
        Math.random() * (today.getTime() - threeYearsAgo.getTime())
    );

    // Ring Number
    const ringNumber = `EG-${2023 + Math.floor(Math.random() * 3)}-${10000 + i}`;

    birds.push({
      ringNumber,
      type: selectedBreed, // Schema uses 'type'
      gender: selectedGender,
      color: selectedColor,
      status: selectedStatus,
      birthDate: hatchDate, // Schema uses 'birthDate'
      loftId: loftId!,
      image: `https://placehold.co/600x400?text=${selectedBreed}+${selectedColor}`,
      name: `Pigeon ${i + 1}`,
    });
  }

  // 5. Bulk Insert
  await prisma.bird.createMany({
    data: birds as any,
  });

  console.log(`Successfully seeded ${totalBirds} pigeons! 🐦`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
