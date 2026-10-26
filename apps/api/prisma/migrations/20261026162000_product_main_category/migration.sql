-- AlterTable: add mainCategoryId to Product
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "mainCategoryId" TEXT;

-- Backfill Product.mainCategoryId from its assigned Collection (Category.mainCategoryId)
UPDATE "Product" p
SET "mainCategoryId" = c."mainCategoryId"
FROM "Category" c
WHERE p."categoryId" = c."id"
  AND p."mainCategoryId" IS NULL
  AND c."mainCategoryId" IS NOT NULL;

-- Backfill any remaining Product without mainCategoryId to its brand's first MainCategory (if one exists)
UPDATE "Product" p
SET "mainCategoryId" = (
  SELECT mc."id"
  FROM "MainCategory" mc
  WHERE mc."brandId" = p."brandId"
  ORDER BY mc."sortOrder" ASC, mc."id" ASC
  LIMIT 1
)
WHERE p."mainCategoryId" IS NULL;

-- Backfill any Category without mainCategoryId to its brand's first MainCategory (if one exists)
UPDATE "Category" c
SET "mainCategoryId" = (
  SELECT mc."id"
  FROM "MainCategory" mc
  WHERE mc."brandId" = c."brandId"
  ORDER BY mc."sortOrder" ASC, mc."id" ASC
  LIMIT 1
)
WHERE c."mainCategoryId" IS NULL;

-- CreateIndex & AddForeignKey
CREATE INDEX IF NOT EXISTS "Product_mainCategoryId_idx" ON "Product"("mainCategoryId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Product_mainCategoryId_fkey'
  ) THEN
    ALTER TABLE "Product"
      ADD CONSTRAINT "Product_mainCategoryId_fkey"
      FOREIGN KEY ("mainCategoryId") REFERENCES "MainCategory"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
