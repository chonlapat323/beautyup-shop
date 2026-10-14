#!/usr/bin/env node
/**
 * Updates Fanola brand with 4 feature pillars, series quick pills,
 * and categorizes products into 'Fanola Salon' and 'Fanola Hair Care'.
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
    // fallback if dotenv not in apps/api/node_modules
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

async function main() {
  console.log("Updating Fanola brand content...");

  const features = [
    {
      title: { th: "ผลิตภัณฑ์ดูแลผม", en: "Hair Care Products" },
      description: {
        th: "การดูแลผมที่มีประสิทธิภาพตั้งแต่เส้นผมรากผมและหนังศีรษะช่วยให้ผมแข็งแรงนุ่มสลวยเงางามมีน้ำหนัก สุขภาพดีตั้งแต่ภายใน ป้องกันการสร้างเม็ดสีแฝง (เหลือง ส้ม แดง) ที่เกิดขึ้นใหม่ตลอดเวลา ผลิตภัณฑ์ฟาโนลามีกลิ่นหอมหรูหราด้วยแรงบันดาลใจจากน้ำหอมชั้นดี ปกป้องเส้นผมจากมลภาวะแสงแดดสารเคมีและความร้อน ทำให้เส้นผมสีสันสวยงามอยู่ทนนานเป็นพิเศษเหมือนออกจากซาลอนทุกวัน",
        en: "Effective hair care from root to tip and scalp, enhancing strength, silky smoothness, shine, and inner vitality. Prevents unwanted undertones (yellow, orange, red) while shielding hair from heat and pollution.",
      },
      href: "#fanola-hair-care",
      imageUrl: "",
    },
    {
      title: { th: "ผลิตภัณฑ์ทำสีผม", en: "Hair Color Products" },
      description: {
        th: "การทำสีผมที่มีความแตกต่าง มีรายละเอียดสูง เอกลักษณ์โดดเด่น ตอบโจทย์ความคิดสร้างสรรค์ สีทำผม 5 คอลเลคชั่น การทำงานของสีรวดเร็ว เม็ดสีติดแน่นทนนาน ไม่ติดแดงติดส้ม มีสารป้องกันเม็ดสีเหลืองแฝงในเส้นผม ช่วยให้ทำสีได้สวย ตรงใจ สีย้อมผมที่ให้ความเงางามมีระดับปราศจากกลิ่นฉุนไม่พึงประสงค์ ปราศจากแอมโมเนียและสารก่อมะเร็ง มีส่วนผสมพิเศษ อาทิ ทองคำ 24k เคราติน อาร์แกนออยล์",
        en: "Exceptional hair color with 5 distinctive collections. Fast-acting, rich, long-lasting pigments without brassiness. Ammonia-free, enriched with 24k gold, keratin, and argan oil.",
      },
      href: "#fanola-salon",
      imageUrl: "",
    },
    {
      title: { th: "ผลิตภัณฑ์ฟอกสีผม", en: "Hair Bleaching Products" },
      description: {
        th: "การฟอกสีผม ด้วยความเข้าใจในสภาพเส้นผมและความต้องการที่แตกต่างกัน รองรับการฟอกผมทุกสภาพทุกสไตล์ ด้วยผลิตภัณฑ์ฟอกผม 8 แบบ ตั้งแต่การยกระดับ 9 ระดับ รวดเร็วให้ความสว่างสดใส, ครีมฟอกที่ให้ความนวลกลมกลืน และอ่อนโยนแม้กับเส้นผมอ่อนแอเส้นเล็ก, ผงฟอกแม่ม่วง/แม่น้ำเงิน/แม่เขียว กำจัดเม็ดสีเหลือง/ส้ม/แดง อย่างตรงจุด ทนุถนอมเส้นผมและเพิ่มความชุ่มชื้น ผมไม่แห้ง ผมเงางาม สุขภาพดี",
        en: "Advanced lightening with 8 formulas lifting up to 9 levels. Gentle bleaching cream for fragile hair, specialized violet/blue/green toning bleaches to neutralize yellow/orange/red undertones.",
      },
      href: "#fanola-salon",
      imageUrl: "",
    },
    {
      title: { th: "ผลิตภัณฑ์ยืดดัดผม", en: "Perm & Straightening" },
      description: {
        th: "การดัดผม ยืดผมด้วยน้ำยาที่มีส่วนผสมพิเศษ อาทิ โปรตีนอัลมอนด์ สูตรปราศจากแอมโมเนีย อ่อนโยนต่อเส้นผม ปลอดภัยต่อสุขภาพในระยะยาว น้ำยาดัดผมกลิ่นอ่อนโยน กลิ่นไม่ฉุน ขั้นตอนการทำงานไม่ยุ่งยาก น้ำยาดัดเย็น และ น้ำยาดัด/ยืดดิจิตอล สามารถดัดผมอ่อนแอและผมแข็งแรงได้อย่างมีประสิทธิภาพ ให้ผลลัพธ์คือ ผมสวยลอนเด้งกระชับ อยู่ทรงนานและผมมีสุขภาพดีเงางาม",
        en: "Ammonia-free straightening and perming enriched with almond protein. Gentle scent, easy application for cold and digital perm, leaving hair bouncy, resilient, and full of natural shine.",
      },
      href: "#fanola-salon",
      imageUrl: "",
    },
  ];

  const series = [
    { name: "No yellow Care", href: "#fanola-salon" },
    { name: "After colour", href: "#fanola-salon" },
    { name: "Frequent", href: "#fanola-salon" },
    { name: "Scrub Gel", href: "#fanola-salon" },
    { name: "Rebalance Purity", href: "#fanola-salon" },
    { name: "NO MORE", href: "#fanola-salon" },
    { name: "FIBER FIX", href: "#fanola-salon" },
  ];

  const fanolaBrand = await prisma.brand.findUnique({ where: { slug: "fanola" } });
  if (!fanolaBrand) {
    console.error("Brand 'fanola' not found!");
    return;
  }

  await prisma.brand.update({
    where: { slug: "fanola" },
    data: {
      features: features,
      series: series,
    },
  });
  console.log("Fanola features and series updated.");

  // Products to categorize and insert if missing
  const salonProducts = [
    { slug: "no-red-mask-1000ml", nameTh: "No red Mask 1,000 ml. โนเรด มาส์ค", nameEn: "No Red Mask 1,000ml", price: 2590, badges: ["New"] },
    { slug: "blue-foam-no-orange-250ml", nameTh: "BLUE FOAM No orange 250 ml. บลูโฟม โนออเรนจ์", nameEn: "Blue Foam No Orange 250ml", price: 2250, badges: ["New"] },
    { slug: "no-orange-mask-1000ml", nameTh: "No orange Mask 1,000 ml. โนออเรนจ์ มาส์ค", nameEn: "No Orange Mask 1,000ml", price: 2590, badges: ["Hot"] },
    { slug: "nutri-care-shampoo-1000ml", nameTh: "Nutri Care Shampoo 1,000 ml. นูทริ แชมพู", nameEn: "Nutri Care Shampoo 1,000ml", price: 1850, badges: ["Soft hair"] },
    { slug: "no-red-shampoo-1000ml", nameTh: "No red Shampoo 1,000 ml. โนเรด แชมพู", nameEn: "No Red Shampoo 1,000ml", price: 1950, badges: ["New"] },
    { slug: "no-orange-shampoo-1000ml", nameTh: "No orange Shampoo 1,000 ml. โนออเรนจ์ แชมพู", nameEn: "No Orange Shampoo 1,000ml", price: 1950, badges: ["Hot"] },
    { slug: "shield-protective-mist-100ml", nameTh: "Shield Protective Mist 100 ml. สเปรย์น้ำหอม ชิลด์มิสท์", nameEn: "Shield Protective Mist 100ml", price: 1590, badges: [] },
    { slug: "2-phase-potion-leave-in-150ml", nameTh: "2-Phase Potion Leave In Conditioner 150 ml. ทูว - เฟส ลีฟอิน คอนดิชันเนอร์", nameEn: "2-Phase Potion Leave In Conditioner 150ml", price: 1290, badges: [] },
    { slug: "thermo-protective-cream-150ml", nameTh: "Thermo - Protective Cream 150 ml. เทอร์โม โพรเทคทีฟ ครีม", nameEn: "Thermo-Protective Cream 150ml", price: 1650, badges: [] },
    { slug: "incredible-foam-250ml", nameTh: "Incredible Foam อินคริดิเบิลโฟม 250 ml.", nameEn: "Incredible Foam 250ml", price: 2250, badges: ["Hot"] },
    { slug: "no-yellow-mask-1000ml", nameTh: "No yellow Mask 1,000 ml. โนเยลโล มาส์ค 1,000 มล.", nameEn: "No Yellow Mask 1,000ml", price: 2590, badges: ["Best Seller"] },
    { slug: "no-yellow-shampoo-1000ml", nameTh: "No yellow Shampoo 1,000 ml. โนเยลโล แชมพู 1,000 มล.", nameEn: "No Yellow Shampoo 1,000ml", price: 1950, badges: ["Best Seller"] },
  ];

  const hairCareProducts = [
    { slug: "no-red-set-100ml", nameTh: "No red Set 100 ml. (Shampoo & Mask) โนเรด เช็ทเดินทาง", nameEn: "No Red Set 100ml (Shampoo & Mask)", price: 1080, badges: ["New"] },
    { slug: "no-red-mask-350ml", nameTh: "No red Mask 350 ml. โนเรด มาส์ค", nameEn: "No Red Mask 350ml", price: 1390, badges: ["New"] },
    { slug: "no-red-shampoo-350ml", nameTh: "No red Shampoo 350 ml. โนเรด แชมพู", nameEn: "No Red Shampoo 350ml", price: 1168, badges: ["New"] },
    { slug: "no-orange-mask-350ml", nameTh: "No orange Mask 350 ml. โนออเรนจ์ มาส์ค", nameEn: "No Orange Mask 350ml", price: 1390, badges: ["Hot"] },
    { slug: "no-orange-shampoo-350ml", nameTh: "No orange Shampoo 350 ml. โนออเรนจ์ แชมพู", nameEn: "No Orange Shampoo 350ml", price: 1168, badges: ["Hot"] },
  ];

  let order = 0;
  for (const item of salonProducts) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        name: { th: item.nameTh, en: item.nameEn },
        description: { th: "", en: "" },
        brandId: fanolaBrand.id,
        category: "Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)",
        price: item.price,
        badges: item.badges,
        sortOrder: order++,
        isActive: true,
      },
      update: {
        category: "Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)",
        price: item.price,
        name: { th: item.nameTh, en: item.nameEn },
      },
    });
  }

  for (const item of hairCareProducts) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        name: { th: item.nameTh, en: item.nameEn },
        description: { th: "", en: "" },
        brandId: fanolaBrand.id,
        category: "Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)",
        price: item.price,
        badges: item.badges,
        sortOrder: order++,
        isActive: true,
      },
      update: {
        category: "Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)",
        price: item.price,
        name: { th: item.nameTh, en: item.nameEn },
      },
    });
  }

  console.log("Fanola products categorized successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
