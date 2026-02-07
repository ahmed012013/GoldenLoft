-- Add tokenVersion field to User table for token rotation tracking
ALTER TABLE "User" ADD COLUMN "tokenVersion" INTEGER NOT NULL DEFAULT 0;
