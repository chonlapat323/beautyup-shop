-- AlterTable: add images array to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Backfill images from existing imageUrl
UPDATE "Product"
SET "images" = ARRAY["imageUrl"]
WHERE "imageUrl" <> '' AND cardinality("images") = 0;
