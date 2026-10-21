-- The /products page used to be split between its menu item and two settings
-- (productsPage, salonHairSlides). Everything now lives on the menu item: copy the
-- hero text, slides, sections and oval showcase over, then remove the settings.

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN "hero" JSONB NOT NULL DEFAULT '{}';

DO $$
DECLARE
  p jsonb := coalesce((SELECT "value"::jsonb FROM "Setting" WHERE "key" = 'productsPage'), '{}');
  s jsonb := coalesce((SELECT "value"::jsonb FROM "Setting" WHERE "key" = 'salonHairSlides'), '{}');
  empty jsonb := '{"th":"","en":""}';
  oval_items jsonb;
  oval jsonb;
BEGIN
  UPDATE "MenuItem" SET "hero" = jsonb_build_object(
    'eyebrow', coalesce(nullif(p->'heroEyebrow', 'null'), nullif(s->'heroEyebrow', 'null'), empty),
    'headline', coalesce(nullif(p->'heroHeadline', 'null'), nullif(s->'heroHeadline', 'null'), empty),
    'lead', coalesce(nullif(p->'heroLead', 'null'), nullif(s->'heroLead', 'null'), empty)
  )
  WHERE rtrim("href", '/') = '/products';

  -- Slides: the page showed the menu's own first, then productsPage, then salonHairSlides
  UPDATE "MenuItem" SET "slides" = CASE
      WHEN jsonb_array_length(coalesce(p->'slides', '[]')) > 0 THEN p->'slides'
      ELSE coalesce(s->'slides', '[]')
    END
  WHERE rtrim("href", '/') = '/products' AND jsonb_array_length("slides"::jsonb) = 0;

  -- Sections: the menu's own first, then productsPage
  UPDATE "MenuItem" SET "sections" = coalesce(p->'sections', '[]')
  WHERE rtrim("href", '/') = '/products' AND jsonb_array_length("sections"::jsonb) = 0;

  -- The oval showcase was shown on its own (unless hidden) when no section had one;
  -- make it the first section so it stays where it was
  IF coalesce((p->>'showOvalCarousel')::boolean, true) THEN
    oval_items := CASE
      WHEN jsonb_array_length(coalesce(p->'ovalItems', '[]')) > 0 THEN p->'ovalItems'
      ELSE coalesce(s->'items', '[]')
    END;
    oval := jsonb_build_object(
      'layout', 'oval-carousel',
      'title', coalesce(nullif(p->'ovalTitle', 'null'), nullif(s->'title', 'null'), empty),
      'description', coalesce(nullif(p->'ovalDescription', 'null'), nullif(s->'description', 'null'), empty),
      'imageUrl', '',
      'buttonText', empty,
      'buttonHref', '',
      'cards', coalesce((
        SELECT jsonb_agg(jsonb_build_object(
          'title', jsonb_build_object(
            'th', coalesce(nullif(it->'title'->>'th', ''), nullif(it->'title'->>'en', ''), '-'),
            'en', coalesce(it->'title'->>'en', '')),
          'description', coalesce(nullif(it->'description', 'null'), empty),
          'imageUrl', coalesce(it->>'imageUrl', ''),
          'href', coalesce(it->>'href', '')
        ))
        FROM jsonb_array_elements(oval_items) AS it
      ), '[]')
    );
    UPDATE "MenuItem" SET "sections" = jsonb_build_array(oval) || "sections"::jsonb
    WHERE rtrim("href", '/') = '/products'
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("sections"::jsonb) AS sec WHERE sec->>'layout' = 'oval-carousel'
      );
  END IF;

END $$;

DELETE FROM "Setting" WHERE "key" IN ('productsPage', 'salonHairSlides');
