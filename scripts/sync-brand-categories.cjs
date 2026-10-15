#!/usr/bin/env node
/**
 * Synchronizes Brand -> Category -> Product relations in PostgreSQL.
 * 1. Ensures Category table and Product.categoryId exist.
 * 2. Seeds all 20 Fanola categories as relational Category rows.
 * 3. Links existing Fanola products to their respective categoryId.
 */
const fs = require("node:fs");
const path = require("node:path");
const { PrismaPg } = require("../apps/api/node_modules/@prisma/adapter-pg");
const { PrismaClient } = require("../apps/api/dist/generated/prisma/client.js");

const apiEnv = path.resolve(__dirname, "../apps/api/.env");
if (fs.existsSync(apiEnv)) {
  try {
    require("../apps/api/node_modules/dotenv").config({ path: apiEnv });
  } catch {
    const content = fs.readFileSync(apiEnv, "utf-8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      const match = line.match(/^DATABASE_URL\s*=\s*["']?(.*?)["']?$/);
      if (match) {
        process.env.DATABASE_URL = match[1].trim();
        break;
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Error: DATABASE_URL is not defined in environment or apps/api/.env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const FANOLA_CATEGORIES = [
  {
    slug: "no-yellow-care",
    name: { th: "No yellow Care", en: "No Yellow Care" },
    subtitle: {
      th: "ANTIGIALLO สำหรับผมผ่านการฟอก, ผมบลอนด์, ผมทำไฮไลท์, ผมโทนเทาหม่น",
      en: "ANTIGIALLO for bleached, blonde, highlighted, and ash-toned hair",
    },
    description: {
      th: "No yellow care™ แชมพู & มาร์ค ที่มีส่วนผสมของ Pigment Violet เข้มข้น ต่อต้านเม็ดสีเหลืองส้มในเส้นผมให้จางลงได้อย่างมีประสิทธิภาพ พร้อมนวัตกรรม Hydra capture system กักเก็บความชุ่มชื้นในเส้นผม บำรุงและปกป้องเส้นผมจากความร้อน แสงแดด และรังสี UVA ทำให้เส้นผมไม่แห้งเสียง่าย มีกรด Hyaluronic, Collagen ทำให้ผมนุ่มสลวยเงางามมากยิ่งขึ้น แมกนีเซียมและกรดอะมิโน ช่วยรักษาความชัดเจน ความสว่างของสีผมให้อยู่ทนยาวนาน ทำความสะอาดเส้นผมอย่างอ่อนโยน ไม่ก่อให้เกิดการแพ้ สามารถใช้ได้บ่อยตามต้องการ",
      en: "No yellow care™ Shampoo & Mask formulated with concentrated Violet Pigments to neutralize unwanted brassy reflections effectively. Infused with the Hydra capture system, Hyaluronic Acid, and Collagen to preserve optimal moisture, nourish, and defend hair against heat and UV rays.",
    },
    highlights: {
      th: "IT'S MY BLOND! 360° BLONDE PROTECTION พัฒนาขึ้นสำหรับผมบลอนด์, ผมฟอก เพื่อให้ได้โทนสีบลอนด์ที่บริสุทธิ์สมบูรณ์แบบ ปกป้องเส้นผมบลอนด์ที่ต้องเผชิญกับความเปราะบาง ความเสียหายจากปัจจัยภายในที่มีอยู่แล้ว และปกป้องสีผมจากปัจจัยภายนอก ได้แก่ ความร้อน, ความชื้น, มลภาวะ",
      en: "IT'S MY BLOND! 360° BLONDE PROTECTION specifically crafted for blonde and bleached hair to achieve the purest blonde tone while protecting against fragility, heat, humidity, and pollution.",
    },
    imageUrl: "/categories/fanola/no-yellow-care.jpg",
    bannerUrl: "/categories/fanola/no-yellow-banner.jpg",
    accentColor: "#7e22ce",
    subCategories: [
      { th: "ทั้งหมด", en: "All" },
      { th: "แชมพู", en: "Shampoo" },
      { th: "มาส์ค&ทรีทเมนท์", en: "Mask & Treatment" },
      { th: "ลีฟอิน", en: "Leave In" },
      { th: "สเปรย์&ป้องกันความร้อน", en: "Spray & Heat Protect" },
    ],
  },
  {
    slug: "no-orange",
    name: { th: "No orange", en: "No Orange" },
    subtitle: {
      th: "ANTI-ARANCIO กำจัดเม็ดสีส้ม/ทองแดง สำหรับผมบลอนด์เข้มและผมสีสว่าง",
      en: "ANTI-ARANCIO neutralizes orange & copper reflections for light & brunette hair",
    },
    description: {
      th: "No Orange แชมพูและมาส์คสูตรพิเศษที่อุดมด้วยเม็ดสีน้ำเงิน Extra Blue Pigment เข้มข้น กำจัดประกายสีส้มและทองแดงที่ไม่พึงประสงค์ ให้ผมสีสว่างสดใส คมชัด พร้อมบำรุงให้นุ่มลื่น มีประกายเงางาม",
      en: "Specialized formula enriched with extra blue pigments to neutralize unwanted copper and red reflections, ensuring bright, radiant tones with silky softness.",
    },
    imageUrl: "/categories/fanola/no-orange.jpg",
    accentColor: "#1d4ed8",
    subCategories: [
      { th: "ทั้งหมด", en: "All" },
      { th: "แชมพู", en: "Shampoo" },
      { th: "มาส์ค", en: "Mask" },
      { th: "บลูโฟม", en: "Blue Foam" },
    ],
  },
  {
    slug: "no-red",
    name: { th: "No red", en: "No Red" },
    subtitle: {
      th: "ANTI-ROSSO กำจัดเม็ดสีแดง สำหรับผมสีน้ำตาลและโทนธรรมชาติ",
      en: "ANTI-ROSSO eliminates unwanted red reflections for brunette and natural dark hair",
    },
    description: {
      th: "แชมพูและมาส์คเม็ดสีเขียวสูตรเข้มข้น ต่อต้านเม็ดสีแดงในเส้นผมสีน้ำตาลอย่างได้ผล รักษาสีผมโทนเย็น (Cool Brunette) ให้สวยสดใส ไม่ติดแดง พร้อมบำรุงให้ผมนุ่มลื่นเงางาม",
      en: "Formulated with green pigments to neutralize undesirable red reflections on brunette hair, keeping tones cool, pure, and deeply conditioned.",
    },
    imageUrl: "/categories/fanola/no-red.jpg",
    accentColor: "#047857",
  },
  {
    slug: "nutri-care",
    name: { th: "Nutri care", en: "Nutri Care" },
    subtitle: {
      th: "ฟื้นฟูผมแห้งเสีย หยาบกระด้าง ให้กลับมานุ่มสลวย มีน้ำหนัก",
      en: "Deep nourishing line with milk proteins for dry, frizzy, and stressed hair",
    },
    imageUrl: "/categories/fanola/nutri-care.jpg",
    accentColor: "#ea580c",
  },
  {
    slug: "after-colour",
    name: { th: "After colour", en: "After Colour" },
    subtitle: {
      th: "บำรุงและล็อกสีผมหลังทำสี ช่วยให้สีผมสดชัดยาวนานเป็นพิเศษ",
      en: "Color lock and preservation with Vitamin E and Linseed Oil",
    },
    imageUrl: "/categories/fanola/after-colour.jpg",
    accentColor: "#b91c1c",
  },
  {
    slug: "daily-care",
    name: { th: "Daily care", en: "Daily Care" },
    subtitle: {
      th: "ดูแลและทำความสะอาดเส้นผมทุกวันอย่างอ่อนโยน ปรับสมดุลตามธรรมชาติ",
      en: "Gentle daily care for frequent washing without stripping natural moisture",
    },
    imageUrl: "/categories/fanola/daily-care.jpg",
    accentColor: "#0284c7",
  },
  {
    slug: "sensi-care",
    name: { th: "Sensi care", en: "Sensi Care" },
    subtitle: {
      th: "สูตรอ่อนโยนพิเศษสำหรับหนังศีรษะบอบบางและแพ้ง่าย ปลอบประโลมลดการระคายเคือง",
      en: "Soothing care for sensitive scalp enriched with Aloe Vera and Panthenol",
    },
    imageUrl: "/categories/fanola/sensi-care.jpg",
    accentColor: "#ec4899",
  },
  {
    slug: "volume",
    name: { th: "Volume", en: "Volume" },
    subtitle: {
      th: "เพิ่มวอลลุ่มและความหนานุ่ม ยกโคนผมสำหรับผมเส้นเล็กและลีบแบน",
      en: "Bodifying and volumizing line for fine, limp, and lifeless hair",
    },
    imageUrl: "/categories/fanola/volume.jpg",
    accentColor: "#06b6d4",
  },
  {
    slug: "curly-shine",
    name: { th: "Curly shine", en: "Curly Shine" },
    subtitle: {
      th: "บำรุงลอนดัดและผมหยิกธรรมชาติ ให้ลอนกระชับ นุ่มเด้ง ไม่ชี้ฟู",
      en: "Elasticity and definition for curly, permed, and wavy hair with Silk Proteins",
    },
    imageUrl: "/categories/fanola/curly-shine.jpg",
    accentColor: "#f59e0b",
  },
  {
    slug: "purity",
    name: { th: "Purity", en: "Purity" },
    subtitle: {
      th: "ขจัดรังแคและสิ่งตกค้าง ทำความสะอาดหนังศีรษะอย่างล้ำลึกหมดจด",
      en: "Purifying anti-dandruff treatment with Piroctone Olamine",
    },
    imageUrl: "/categories/fanola/purity.jpg",
    accentColor: "#10b981",
  },
  {
    slug: "rebalance",
    name: { th: "Rebalance", en: "Rebalance" },
    subtitle: {
      th: "ควบคุมความมันส่วนเกินบนหนังศีรษะ ปรับสมดุลความมันอย่างมีประสิทธิภาพ",
      en: "Sebum-regulating line with wheat protein for oily scalp and greasy hair",
    },
    imageUrl: "/categories/fanola/rebalance.jpg",
    accentColor: "#6366f1",
  },
  {
    slug: "energy",
    name: { th: "Energy", en: "Energy" },
    subtitle: {
      th: "ลดการขาดหลุดร่วง เสริมสร้างความแข็งแรง กระตุ้นการเกิดใหม่ของเส้นผม",
      en: "Energizing and anti-hair-loss prevention with Rosemary and Nettle extracts",
    },
    imageUrl: "/categories/fanola/energy.jpg",
    accentColor: "#ef4444",
  },
  {
    slug: "color-mask",
    name: { th: "Color mask", en: "Color Mask" },
    subtitle: {
      th: "มาส์คเติมประกายสีผม เติมสีพร้อมบำรุงให้ผมนุ่มลื่นเงางามในขั้นตอนเดียว",
      en: "Color nourishing masks with Avocado Oil to refresh, tone, and illuminate",
    },
    imageUrl: "/categories/fanola/color-mask.jpg",
    accentColor: "#d946ef",
  },
  {
    slug: "hygiene",
    name: { th: "Hygiene", en: "Hygiene" },
    subtitle: {
      th: "ทำความสะอาดล้ำลึก เพื่อสุขอนามัยที่ดีเยี่ยมของเส้นผมและหนังศีรษะ",
      en: "Sanitizing and hygienic cleansing for deep purifying care",
    },
    imageUrl: "/categories/fanola/hygiene.jpg",
    accentColor: "#14b8a6",
  },
  {
    slug: "no-more",
    name: { th: "No more", en: "No More" },
    subtitle: {
      th: "ลดขั้นตอนการสระผม ช่วยประหยัดน้ำและเวลา เป็นมิตรกับสิ่งแวดล้อม",
      en: "Eco-friendly, water-saving care with minimal styling time",
    },
    imageUrl: "/categories/fanola/no-more.jpg",
    accentColor: "#84cc16",
  },
  {
    slug: "botugen",
    name: { th: "Botugen Hair botox", en: "Botugen Hair Botox" },
    subtitle: {
      th: "โบท็อกซ์เส้นผม ฟื้นบำรุงโครงสร้างแกนผมล้ำลึก เติมเต็มเนื้อผมให้มีน้ำหนัก",
      en: "Botolife restorative complex that fills and rebuilds damaged hair cortex",
    },
    imageUrl: "/categories/fanola/botugen.jpg",
    accentColor: "#a855f7",
  },
  {
    slug: "fiber-fix",
    name: { th: "Fiber fix", en: "Fiber Fix" },
    subtitle: {
      th: "นวัตกรรมเชื่อมพันธะแกนผม ปกป้องและซ่อมแซมเส้นผมขณะทำเคมี",
      en: "Bond connector restructuring treatment protecting hair bonds during chemical services",
    },
    imageUrl: "/categories/fanola/fiber-fix.jpg",
    accentColor: "#475569",
  },
  {
    slug: "keraterm",
    name: { th: "Keraterm", en: "Keraterm" },
    subtitle: {
      th: "บำรุงและล็อกผมตรง ยืดอายุการยืดผม ป้องกันความร้อนและความชื้น",
      en: "Thermo-active smoothing discipline line for straightened and chemically treated hair",
    },
    imageUrl: "/categories/fanola/keraterm.jpg",
    accentColor: "#ca8a04",
  },
  {
    slug: "oro-therapy",
    name: { th: "Oro therapy", en: "Oro Therapy" },
    subtitle: {
      th: "ฟื้นฟูเส้นผมระดับพรีเมียมด้วยทองคำบริสุทธิ์ 24K เคราติน และน้ำมันอาร์แกน",
      en: "Precious 24K Micro-Active Gold, Keratin, and Argan Oil for extraordinary radiance",
    },
    imageUrl: "/categories/fanola/oro-therapy.jpg",
    accentColor: "#eab308",
  },
  {
    slug: "color-keratin",
    name: { th: "Color Keratin", en: "Color Keratin" },
    subtitle: {
      th: "สีทำผมปราศจากแอมโมเนีย ผสมเคราติน ให้สีสดเด่น ชุ่มชื้น ไม่ทำร้ายเส้นผม",
      en: "Ammonia-free permanent coloring cream enriched with keratin & argan oil",
    },
    imageUrl: "/categories/fanola/color-keratin.jpg",
    accentColor: "#78350f",
  },
];

async function main() {
  console.log("Synchronizing Brand -> Category -> Product relations in database...");

  // 1. Ensure Table and Columns exist via DDL
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Category" (
      "id" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "name" JSONB NOT NULL,
      "subtitle" JSONB,
      "description" JSONB,
      "highlights" JSONB,
      "imageUrl" TEXT NOT NULL DEFAULT '',
      "bannerUrl" TEXT NOT NULL DEFAULT '',
      "accentColor" TEXT NOT NULL DEFAULT '#d6297f',
      "subCategories" JSONB NOT NULL DEFAULT '[]',
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "brandId" TEXT NOT NULL,
      CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
    EXCEPTION
      WHEN duplicate_column THEN null;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "Category_brandId_idx" ON "Category"("brandId");
    CREATE UNIQUE INDEX IF NOT EXISTS "Category_brandId_slug_key" ON "Category"("brandId", "slug");
    CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
  `);

  // 2. Find Fanola Brand
  const fanola = await prisma.brand.findUnique({ where: { slug: "fanola" } });
  if (!fanola) {
    console.error("Fanola brand not found in database. Exiting.");
    return;
  }

  // 3. Upsert 20 Fanola Categories
  console.log(`Upserting ${FANOLA_CATEGORIES.length} categories for Fanola (ID: ${fanola.id})...`);
  const categoryMap = {}; // slug -> id

  for (let i = 0; i < FANOLA_CATEGORIES.length; i++) {
    const c = FANOLA_CATEGORIES[i];
    const cat = await prisma.category.upsert({
      where: {
        brandId_slug: {
          brandId: fanola.id,
          slug: c.slug,
        },
      },
      create: {
        brandId: fanola.id,
        slug: c.slug,
        name: c.name,
        subtitle: c.subtitle || null,
        description: c.description || null,
        highlights: c.highlights || null,
        imageUrl: c.imageUrl,
        bannerUrl: c.bannerUrl || "",
        accentColor: c.accentColor,
        subCategories: c.subCategories || [],
        sortOrder: i + 1,
        isActive: true,
      },
      update: {
        name: c.name,
        subtitle: c.subtitle || null,
        description: c.description || null,
        highlights: c.highlights || null,
        imageUrl: c.imageUrl,
        bannerUrl: c.bannerUrl || "",
        accentColor: c.accentColor,
        subCategories: c.subCategories || [],
        sortOrder: i + 1,
      },
    });

    categoryMap[c.slug] = cat.id;
  }
  console.log("Fanola categories successfully saved to database.");

  // 4. Link Fanola products to their respective categoryId
  console.log("Linking Fanola products to relational categories...");
  const fanolaProducts = await prisma.product.findMany({
    where: { brandId: fanola.id },
  });

  let linkedCount = 0;
  for (const p of fanolaProducts) {
    const pSlug = p.slug.toLowerCase();
    const pName = JSON.stringify(p.name).toLowerCase();
    let matchedCatId = null;

    if (pSlug.includes("no-yellow") || pName.includes("no yellow") || pName.includes("โนเยลโล")) {
      matchedCatId = categoryMap["no-yellow-care"];
    } else if (pSlug.includes("no-orange") || pName.includes("no orange") || pName.includes("โนออเรนจ์")) {
      matchedCatId = categoryMap["no-orange"];
    } else if (pSlug.includes("no-red") || pName.includes("no red") || pName.includes("โนเรด")) {
      matchedCatId = categoryMap["no-red"];
    } else if (pSlug.includes("nutri") || pName.includes("nutri") || pName.includes("นูทริ")) {
      matchedCatId = categoryMap["nutri-care"];
    } else if (pSlug.includes("after-colour") || pName.includes("after colour")) {
      matchedCatId = categoryMap["after-colour"];
    } else if (pSlug.includes("fiber-fix") || pName.includes("fiber fix")) {
      matchedCatId = categoryMap["fiber-fix"];
    } else if (pSlug.includes("botugen") || pName.includes("botugen")) {
      matchedCatId = categoryMap["botugen"];
    }

    if (matchedCatId && p.categoryId !== matchedCatId) {
      await prisma.product.update({
        where: { id: p.id },
        data: { categoryId: matchedCatId },
      });
      linkedCount++;
    }
  }

  console.log(`Successfully linked ${linkedCount} products to their Category relation!`);
  console.log("Database relation sync completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error syncing brand categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
