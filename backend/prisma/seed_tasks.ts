import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TASKS_CATEGORIES = [
  'feeding',
  'cleaning',
  'health',
  'training',
  'medication',
  'water',
  'maintenance',
];

const PRIORITIES = ['low', 'medium', 'high'];
const FREQUENCIES = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY'];

const TITLES = [
  { ar: 'إطعام الحمام', en: 'Feed Pigeons', cat: 'feeding' },
  { ar: 'تنظيف اللوفت', en: 'Clean Loft', cat: 'cleaning' },
  { ar: 'تغيير الماء', en: 'Change Water', cat: 'water' },
  { ar: 'فحص صحي', en: 'Health Check', cat: 'health' },
  { ar: 'تدريب صباحي', en: 'Morning Training', cat: 'training' },
  { ar: 'إعطاء فيتامينات', en: 'Give Vitamins', cat: 'medication' },
  { ar: 'صيانة الاقفاص', en: 'Cage Maintenance', cat: 'maintenance' },
  { ar: 'فحص الزغاليل', en: 'Check Squabs', cat: 'health' },
  { ar: 'تحصين دوري', en: 'Routine Vaccination', cat: 'health' },
  { ar: 'تنظيف المشارب', en: 'Clean Drinkers', cat: 'cleaning' },
  { ar: 'خلطة تحديق', en: 'Grit Mix', cat: 'feeding' },
  { ar: 'مراقبة الطيران', en: 'Observe Flight', cat: 'training' },
];

async function main() {
  const email = 'test@goldenloft.com';
  console.log(`Looking for user: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error('User not found!');
    return;
  }

  console.log(`Found user: ${user.id}`);

  const tasksToCreate = [];

  for (let i = 0; i < 100; i++) {
    const template = TITLES[Math.floor(Math.random() * TITLES.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const frequency =
      FREQUENCIES[Math.floor(Math.random() * FREQUENCIES.length)]; // Skew towards NONE/DAILY

    // Random date within next 30 days
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 5); // -5 to +25 days
    date.setHours(Math.floor(Math.random() * 12) + 6, 0, 0, 0); // 6 AM to 6 PM

    // Format time HH:mm
    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    tasksToCreate.push({
      userId: user.id,
      title: `${template.ar} ${i + 1}`,
      titleEn: `${template.en} ${i + 1}`,
      description: `Description for task ${i + 1}`,
      descriptionEn: `Description for task ${i + 1}`,
      category: template.cat,
      priority: priority,
      frequency: i % 5 === 0 ? 'WEEKLY' : i % 3 === 0 ? 'DAILY' : 'NONE', // Mix frequencies
      startDate: date,
      time: time,
      isActive: true,
    });
  }

  console.log(`Creating ${tasksToCreate.length} tasks...`);

  await prisma.task.createMany({
    data: tasksToCreate,
  });

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
