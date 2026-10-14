-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "brandSlug" TEXT DEFAULT '',
ADD COLUMN     "sections" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "showProducts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slides" JSONB NOT NULL DEFAULT '[]';
