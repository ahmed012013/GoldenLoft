import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  console.log(
    '🚀 Pushing schema manually via WebSocket (bypassing port 5432)...'
  );

  const sqls = [
    // 1. FeedingPlan Table
    `CREATE TABLE IF NOT EXISTS "FeedingPlan" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "nameAr" TEXT,
        "targetGroup" TEXT NOT NULL,
        "feedType" TEXT NOT NULL,
        "morningAmount" TEXT NOT NULL,
        "eveningAmount" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "pigeonCount" INTEGER NOT NULL DEFAULT 0,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FeedingPlan_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE INDEX IF NOT EXISTS "FeedingPlan_userId_idx" ON "FeedingPlan"("userId")`,
    `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FeedingPlan_userId_fkey') THEN
            ALTER TABLE "FeedingPlan" ADD CONSTRAINT "FeedingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END $$;`,

    // 2. Supplement Table
    `CREATE TABLE IF NOT EXISTS "Supplement" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "name" TEXT NOT NULL,
        "nameAr" TEXT,
        "type" TEXT NOT NULL,
        "dosage" TEXT NOT NULL,
        "frequency" TEXT NOT NULL,
        "purpose" TEXT,
        "purposeAr" TEXT,
        "inStock" BOOLEAN NOT NULL DEFAULT true,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE INDEX IF NOT EXISTS "Supplement_userId_idx" ON "Supplement"("userId")`,
    `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Supplement_userId_fkey') THEN
            ALTER TABLE "Supplement" ADD CONSTRAINT "Supplement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END $$;`,

    // 3. WaterSchedule Table
    `CREATE TABLE IF NOT EXISTS "WaterSchedule" (
        "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
        "loft" TEXT NOT NULL,
        "loftAr" TEXT,
        "lastChange" TIMESTAMP(3) NOT NULL,
        "nextChange" TIMESTAMP(3) NOT NULL,
        "quality" TEXT NOT NULL,
        "additive" TEXT,
        "additiveAr" TEXT,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WaterSchedule_pkey" PRIMARY KEY ("id")
    )`,
    `CREATE INDEX IF NOT EXISTS "WaterSchedule_userId_idx" ON "WaterSchedule"("userId")`,
    `DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'WaterSchedule_userId_fkey') THEN
            ALTER TABLE "WaterSchedule" ADD CONSTRAINT "WaterSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
    END $$;`,
  ];

  for (const sql of sqls) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log('✅ Executed SQL successfully');
    } catch (e) {
      console.error('❌ Error executing SQL:', sql);
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    }
  }

  await prisma.$disconnect();
  console.log('🎯 Schema manual update completed!');
  process.exit(0);
}

main().catch((err) => {
  console.error('💥 Fatal error during manual push:', err);
  process.exit(1);
});
