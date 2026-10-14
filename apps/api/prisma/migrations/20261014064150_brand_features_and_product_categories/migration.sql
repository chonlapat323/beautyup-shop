-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "features" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "series" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "series" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
