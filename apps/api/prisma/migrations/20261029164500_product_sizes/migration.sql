-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizes" JSONB DEFAULT '[]'::jsonb;
