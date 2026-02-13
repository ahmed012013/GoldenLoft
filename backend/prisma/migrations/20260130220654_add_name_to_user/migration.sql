-- 1. إضافة العمود الجديد (اختياري في الأول عشان ميضربش)
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- 2. نقل البيانات من loftName لـ name (عشان الـ 11 مستخدم بياناتهم متضيعش)
UPDATE "User" SET "name" = "loftName";

-- 3. جعل العمود الجديد إجباري (بعد ما اتملى بيانات)
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL;

-- 4. مسح العمود القديم
ALTER TABLE "User" DROP COLUMN "loftName";