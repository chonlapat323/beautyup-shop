-- Add multi-image array column to Post and seed existing coverUrl into images[0]
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "Post"
SET "images" = ARRAY["coverUrl"]
WHERE "coverUrl" <> '' AND cardinality("images") = 0;
