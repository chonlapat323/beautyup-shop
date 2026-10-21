-- Products belong to one collection (Category) only. Before dropping the free-text
-- category/series fields, link each unassigned product to the collection the brand
-- page used to guess for it (same rules as the old slug/name matching), so pages
-- look the same after the deploy.
UPDATE "Product" AS p
SET "categoryId" = m."categoryId"
FROM (
  SELECT DISTINCT ON (p2."id") p2."id" AS "productId", c."id" AS "categoryId"
  FROM "Product" p2
  JOIN "Category" c ON c."brandId" = p2."brandId"
  WHERE p2."categoryId" IS NULL
    AND (
      CASE lower(c."slug")
        WHEN 'no-yellow-care' THEN
          lower(p2."slug") ~ '(no-yellow|shield-protective|2-phase-potion|thermo-protective|incredible-foam)'
          OR lower(coalesce(p2."name"->>'en', '') || ' ' || coalesce(p2."name"->>'th', '')) ~ '(no yellow|โนเยลโล)'
        WHEN 'no-orange' THEN
          lower(p2."slug") ~ '(no-orange|blue-foam)'
          OR lower(coalesce(p2."name"->>'en', '') || ' ' || coalesce(p2."name"->>'th', '')) ~ '(no orange|โนออเรนจ์)'
        WHEN 'no-red' THEN
          lower(p2."slug") LIKE '%no-red%'
          OR lower(coalesce(p2."name"->>'en', '') || ' ' || coalesce(p2."name"->>'th', '')) ~ '(no red|โนเรด)'
        WHEN 'nutri-care' THEN
          lower(p2."slug") LIKE '%nutri-care%'
          OR lower(coalesce(p2."name"->>'en', '') || ' ' || coalesce(p2."name"->>'th', '')) ~ '(nutri|นูทริ)'
        ELSE
          strpos(lower(p2."slug"), lower(c."slug")) > 0
          OR strpos(lower(coalesce(p2."name"->>'en', '') || ' ' || coalesce(p2."name"->>'th', '')), lower(c."slug")) > 0
          OR strpos(lower(p2."category"), lower(c."slug")) > 0
          OR strpos(lower(p2."series"), lower(c."slug")) > 0
      END
    )
  ORDER BY p2."id", c."sortOrder", c."id"
) AS m
WHERE p."id" = m."productId";

-- DropIndex
DROP INDEX IF EXISTS "Product_category_idx";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "series";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "series";
