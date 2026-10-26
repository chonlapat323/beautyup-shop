-- Brand page hierarchy: brand -> main category (ดูแลผม, ทำสีผม ...) -> collection -> product.

-- CreateTable
CREATE TABLE "MainCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "MainCategory_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Category" ADD COLUMN "mainCategoryId" TEXT;

-- CreateIndex
CREATE INDEX "MainCategory_brandId_idx" ON "MainCategory"("brandId");
CREATE UNIQUE INDEX "MainCategory_brandId_slug_key" ON "MainCategory"("brandId", "slug");
CREATE INDEX "Category_mainCategoryId_idx" ON "Category"("mainCategoryId");

-- AddForeignKey
ALTER TABLE "MainCategory" ADD CONSTRAINT "MainCategory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "MainCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- The main-category cards used to be a "columns" block on each brand's menu item, with
-- links that went nowhere. Turn those cards into main categories (so they are edited in
-- one place) and remove the block. The "all collections" card is dropped: the collection
-- grid sits right below on the brand page.
DO $$
DECLARE
  m RECORD;
  b_id TEXT;
  sec jsonb;
  sec_idx int;
  card jsonb;
  card_idx int;
  title_th text;
  new_slug text;
BEGIN
  FOR m IN SELECT "id", "href", "sections"::jsonb AS sections FROM "MenuItem" WHERE "href" ~ '^/products/[^/]+/?$' LOOP
    SELECT "id" INTO b_id FROM "Brand" WHERE "slug" = split_part(trim(both '/' from m."href"), '/', 2);
    CONTINUE WHEN b_id IS NULL OR EXISTS (SELECT 1 FROM "MainCategory" WHERE "brandId" = b_id);

    sec_idx := NULL;
    FOR i IN 0 .. coalesce(jsonb_array_length(m.sections), 0) - 1 LOOP
      IF m.sections->i->>'layout' = 'columns' THEN sec_idx := i; EXIT; END IF;
    END LOOP;
    CONTINUE WHEN sec_idx IS NULL;
    sec := m.sections->sec_idx;

    card_idx := 0;
    FOR card IN SELECT * FROM jsonb_array_elements(coalesce(sec->'cards', '[]')) LOOP
      title_th := coalesce(card->'title'->>'th', '');
      IF title_th NOT LIKE '%ตระกูล%' THEN
        new_slug := CASE
          WHEN title_th LIKE '%ดูแล%' THEN 'hair-care'
          WHEN title_th LIKE '%ทำสี%' THEN 'hair-color'
          WHEN title_th LIKE '%ฟอก%' THEN 'bleaching'
          WHEN title_th LIKE '%ยืด%' OR title_th LIKE '%ดัด%' THEN 'perm-straightening'
          ELSE 'group-' || (card_idx + 1)
        END;
        INSERT INTO "MainCategory" ("id", "slug", "name", "description", "imageUrl", "sortOrder", "brandId")
        VALUES (gen_random_uuid()::text, new_slug, card->'title', card->'description', coalesce(card->>'imageUrl', ''), card_idx, b_id)
        ON CONFLICT ("brandId", "slug") DO NOTHING;
      END IF;
      card_idx := card_idx + 1;
    END LOOP;

    UPDATE "MenuItem" SET "sections" = (m.sections - sec_idx) WHERE "id" = m."id";
  END LOOP;
END $$;

-- Sample grouping of Fanola's collections (edit in Admin -> คอลเลกชัน -> หมวดหมู่หลัก)
UPDATE "Category" c SET "mainCategoryId" = mc."id"
FROM "MainCategory" mc, "Brand" b
WHERE b."slug" = 'fanola' AND mc."brandId" = b."id" AND c."brandId" = b."id" AND c."mainCategoryId" IS NULL
  AND (
    (mc."slug" = 'hair-care' AND c."slug" IN ('nutri-care', 'daily-care', 'sensi-care', 'volume', 'purity', 'rebalance', 'energy', 'hygiene', 'oro-therapy', 'botugen', 'after-colour', 'no-more'))
    OR (mc."slug" = 'hair-color' AND c."slug" IN ('color-mask', 'color-keratin'))
    OR (mc."slug" = 'bleaching' AND c."slug" IN ('no-yellow-care', 'no-orange', 'no-red', 'fiber-fix'))
    OR (mc."slug" = 'perm-straightening' AND c."slug" IN ('curly-shine', 'keraterm'))
  );
