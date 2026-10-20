-- CreateTable
CREATE TABLE "MediaCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MediaCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "excerpt" JSONB NOT NULL,
    "body" JSONB NOT NULL,
    "images" JSONB NOT NULL DEFAULT '[]',
    "videoUrl" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BrandToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BrandToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaCategory_slug_key" ON "MediaCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Media_slug_key" ON "Media"("slug");

-- CreateIndex
CREATE INDEX "Media_publishedAt_idx" ON "Media"("publishedAt");

-- CreateIndex
CREATE INDEX "Media_categoryId_idx" ON "Media"("categoryId");

-- CreateIndex
CREATE INDEX "_BrandToMedia_B_index" ON "_BrandToMedia"("B");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MediaCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToMedia" ADD CONSTRAINT "_BrandToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BrandToMedia" ADD CONSTRAINT "_BrandToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Move existing MEDIA posts into Media (same id, slug and URL); the cover becomes the first image
INSERT INTO "Media" ("id", "slug", "title", "excerpt", "body", "images", "videoUrl", "publishedAt", "createdAt", "updatedAt")
SELECT "id", "slug", "title", "excerpt", "body",
       CASE WHEN "coverUrl" <> '' THEN jsonb_build_array("coverUrl") ELSE '[]'::jsonb END,
       "videoUrl", "publishedAt", "createdAt", "updatedAt"
FROM "Post"
WHERE "type" = 'MEDIA';

DELETE FROM "Post" WHERE "type" = 'MEDIA';

-- AlterEnum
BEGIN;
CREATE TYPE "PostType_new" AS ENUM ('ARTICLE', 'ACTIVITY');
ALTER TABLE "Post" ALTER COLUMN "type" TYPE "PostType_new" USING ("type"::text::"PostType_new");
ALTER TYPE "PostType" RENAME TO "PostType_old";
ALTER TYPE "PostType_new" RENAME TO "PostType";
DROP TYPE "public"."PostType_old";
COMMIT;
