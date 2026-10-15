#!/usr/bin/env node
/**
 * Syncs all 15 slide banners into the database.
 * Run safely on local or production server:
 *   node scripts/sync-slides.cjs
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

const slidesData = [
  {
    product: { th: "BeautyUp Official Salon Partner", en: "BeautyUp Official Salon Partner" },
    caption: { th: "ศูนย์รวมผลิตภัณฑ์ซาลอนมืออาชีพ", en: "Professional Salon & Beauty Products" },
    href: "/products",
    imageUrl: "/slides/1.jpg",
    sortOrder: 0,
    isActive: true,
  },
  {
    product: { th: "Beauty Promotion 2", en: "Beauty Promotion 2" },
    caption: { th: "โปรโมชันสุดคุ้มเพื่อช่างผมมืออาชีพ", en: "Exclusive Salon Deals" },
    href: "/products",
    imageUrl: "/slides/2.jpg",
    sortOrder: 1,
    isActive: true,
  },
  {
    product: { th: "Nook Eco-Conscious Beauty", en: "Nook Eco-Conscious Beauty" },
    caption: { th: "ผลิตภัณฑ์ดูแลเส้นผมธรรมชาติจากอิตาลี", en: "Nature-inspired salon care from Italy" },
    href: "/products/nook",
    imageUrl: "/slides/3.jpg",
    sortOrder: 2,
    isActive: true,
  },
  {
    product: { th: "Sweet Professional Hair Treatment", en: "Sweet Professional Hair Treatment" },
    caption: { th: "นวัตกรรมยืดผมระดับสากลจากบราซิล", en: "Global Hair Transformation" },
    href: "/products/sweet-professional",
    imageUrl: "/slides/4.jpg",
    sortOrder: 3,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Hair Product 5", en: "BeautyUp Hair Product 5" },
    caption: { th: "ผลิตภัณฑ์บำรุงและฟื้นฟูเส้นผมล้ำลึก", en: "Deep Hair Nourishment" },
    href: "/products",
    imageUrl: "/slides/5.jpg",
    sortOrder: 4,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Professional Care 6", en: "BeautyUp Professional Care 6" },
    caption: { th: "มาตรฐานการดูแลเส้นผมระดับซาลอนชั้นนำ", en: "Professional Salon Standard" },
    href: "/products",
    imageUrl: "/slides/6.jpg",
    sortOrder: 5,
    isActive: true,
  },
  {
    product: { th: "Salon Inspiration 7", en: "Salon Inspiration 7" },
    caption: { th: "สร้างสรรค์ผลงานช่างผมมืออาชีพ", en: "Creative Styling Solutions" },
    href: "/products",
    imageUrl: "/slides/7.jpg",
    sortOrder: 6,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Essential 8", en: "BeautyUp Essential 8" },
    caption: { th: "ผลิตภัณฑ์จำเป็นสำหรับร้านซาลอน", en: "Essential Salon Care" },
    href: "/products",
    imageUrl: "/slides/8.jpg",
    sortOrder: 7,
    isActive: true,
  },
  {
    product: { th: "La Prairie Caviar Collection", en: "La Prairie Caviar Collection" },
    caption: { th: "ศาสตร์แห่งการชะลอวัยชั้นเลิศจากสวิตเซอร์แลนด์", en: "The Swiss Luxury Skincare" },
    href: "/shop",
    imageUrl: "/slides/10 La Prairie.jpg",
    sortOrder: 8,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Showcase 10", en: "BeautyUp Showcase 10" },
    caption: { th: "คอลเลกชันสินค้าคุณภาพยอดนิยม", en: "Featured Collection" },
    href: "/shop",
    imageUrl: "/slides/10.png",
    sortOrder: 9,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Premium 11", en: "BeautyUp Premium 11" },
    caption: { th: "ผลิตภัณฑ์ระดับพรีเมียม", en: "Premium Beauty Line" },
    href: "/products",
    imageUrl: "/slides/11.png",
    sortOrder: 10,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Trend 12", en: "BeautyUp Trend 12" },
    caption: { th: "อัปเดตเทรนด์ความงามใหม่ล่าสุด", en: "Latest Beauty Trends" },
    href: "/products",
    imageUrl: "/slides/12.jpg",
    sortOrder: 11,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Special 13", en: "BeautyUp Special 13" },
    caption: { th: "สิทธิประโยชน์สำหรับสมาชิกและซาลอน", en: "Member Exclusive" },
    href: "/contact/salon-partner",
    imageUrl: "/slides/13.jpg",
    sortOrder: 12,
    isActive: true,
  },
  {
    product: { th: "Salon Partner Community 14", en: "Salon Partner Community 14" },
    caption: { th: "ร่วมเป็นพันธมิตรซาลอนกับบิวตี้อัพทั่วประเทศ", en: "Grow your vision with BeautyUp" },
    href: "/contact/salon-partner",
    imageUrl: "/slides/14.jpg",
    sortOrder: 13,
    isActive: true,
  },
  {
    product: { th: "BeautyUp Academy 15", en: "BeautyUp Academy 15" },
    caption: { th: "คอร์สเรียนและพัฒนาทักษะช่างผม", en: "Professional Hairdressing Academy" },
    href: "/courses",
    imageUrl: "/slides/15.jpg",
    sortOrder: 14,
    isActive: true,
  },
];

async function main() {
  console.log("Syncing all 15 hero slides into database...");
  await prisma.heroSlide.deleteMany();
  for (const s of slidesData) {
    await prisma.heroSlide.create({ data: s });
  }
  console.log(`✓ All ${slidesData.length} hero slides synced successfully!`);

  console.log("Checking salonHairSlides setting in database...");
  const existingHairSlides = await prisma.setting.findUnique({ where: { key: "salonHairSlides" } });
  if (!existingHairSlides) {
    await prisma.setting.create({
      data: {
        key: "salonHairSlides",
        value: {
          eyebrow: { th: "Salon Hair Showcase", en: "Salon Hair Showcase" },
          title: { th: "ผลิตภัณฑ์ซาลอนมืออาชีพ", en: "Professional Salon Products" },
          description: { th: "แรงบันดาลใจและสูตรสีผมระดับซาลอนชั้นนำจากอิตาลีและระดับสากล", en: "Inspiration and hair formula by leading master salons" },
          items: [
            {
              imageUrl: "/cards/fanola-1.jpg",
              title: { th: "Balayage Ash Blonde", en: "Balayage Ash Blonde" },
              formula: "BLEACH & 3% (ORO 20G/20G)",
              description: { th: "No Yellow Care Protection", en: "No Yellow Care Protection" },
              href: "/products/fanola?category=no-yellow-care",
            },
            {
              imageUrl: "/slides/1.jpg",
              title: { th: "Pure Ice Blonde", en: "Pure Ice Blonde" },
              formula: "VIOLET BLEACH 9 TONES",
              description: { th: "Anti-Yellow Neutralizing", en: "Anti-Yellow Neutralizing" },
              href: "/products/fanola?category=no-yellow-care",
            },
            {
              imageUrl: "/cards/fanola-2.jpg",
              title: { th: "Cool Smokey Brunette", en: "Cool Smokey Brunette" },
              formula: "BLACK 3% + NO RED MASK",
              description: { th: "Cool Neutralizing Tone", en: "Cool Neutralizing Tone" },
              href: "/products/fanola?category=no-red",
            },
            {
              imageUrl: "/slides/3.jpg",
              title: { th: "Platinum Silver Balayage", en: "Platinum Silver Balayage" },
              formula: "BLEACH & 6% + SHAMPOO",
              description: { th: "Extra Violet Pigments", en: "Extra Violet Pigments" },
              href: "/products/fanola?category=no-yellow-care",
            },
            {
              imageUrl: "/cards/fanola-3.jpg",
              title: { th: "Warm Honey Caramel", en: "Warm Honey Caramel" },
              formula: "CHESTNUT BLEACH + 3%",
              description: { th: "Deep Conditioning Care", en: "Deep Conditioning Care" },
              href: "/products/fanola?category=nutri-care",
            },
            {
              imageUrl: "/cards/fanola-4.jpg",
              title: { th: "Warm Brown Copper", en: "Warm Brown Copper" },
              formula: "WARM BROWN + 3%",
              description: { th: "Color Keratin Protection", en: "Color Keratin Protection" },
              href: "/products/fanola?category=no-orange",
            },
            {
              imageUrl: "/slides/4.jpg",
              title: { th: "Luxury Gloss Waves", en: "Luxury Gloss Waves" },
              formula: "ORO THERAPY 24K",
              description: { th: "Argan Oil & Keratin Infusion", en: "Argan Oil & Keratin Infusion" },
              href: "/products/fanola?category=oro-therapy",
            },
          ],
        },
      },
    });
    console.log("✓ Default salonHairSlides setting created in database!");
  } else {
    console.log("✓ salonHairSlides setting already exists in database.");
  }
}

main()
  .catch((e) => {
    console.error("✗ Failed to sync slides:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
