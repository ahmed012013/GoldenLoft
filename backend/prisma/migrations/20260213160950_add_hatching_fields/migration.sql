-- DropForeignKey
ALTER TABLE "Egg" DROP CONSTRAINT "Egg_pairingId_fkey";

-- AlterTable
ALTER TABLE "Egg" ADD COLUMN     "candlingDate" TIMESTAMP(3),
ADD COLUMN     "candlingResult" TEXT;

-- AlterTable
ALTER TABLE "Pairing" ADD COLUMN     "nestBox" TEXT,
ADD COLUMN     "notes" TEXT;

-- AddForeignKey
ALTER TABLE "Egg" ADD CONSTRAINT "Egg_pairingId_fkey" FOREIGN KEY ("pairingId") REFERENCES "Pairing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
