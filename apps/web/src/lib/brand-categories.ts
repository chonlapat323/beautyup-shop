import type { Locale } from "@/i18n";

export interface BrandCategoryData {
  slug: string;
  brandSlug: string;
  name: { th: string; en: string };
  subtitle?: { th: string; en: string };
  description?: { th: string; en: string };
  highlights?: { th: string; en: string };
  imageUrl: string;
  bannerUrl?: string;
  accentColor: string;
  subCategories?: { th: string; en: string }[];
}

export interface BrandCategory {
  slug: string;
  brandSlug: string;
  name: string;
  subtitle?: string;
  description?: string;
  highlights?: string;
  imageUrl: string;
  bannerUrl?: string;
  accentColor: string;
  subCategories?: string[];
}

export const FANOLA_CATEGORIES: BrandCategoryData[] = [
  {
    slug: "no-yellow-care",
    brandSlug: "fanola",
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
    accentColor: "#7e22ce", // Purple
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
    brandSlug: "fanola",
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
    accentColor: "#1d4ed8", // Blue
    subCategories: [
      { th: "ทั้งหมด", en: "All" },
      { th: "แชมพู", en: "Shampoo" },
      { th: "บลูโฟม", en: "Blue Foam" },
      { th: "มาส์ค", en: "Mask" },
    ],
  },
  {
    slug: "no-red",
    brandSlug: "fanola",
    name: { th: "No red", en: "No Red" },
    subtitle: {
      th: "ANTI-ROSSO สำหรับผมสีน้ำตาลและสีธรรมชาติ เพื่อกำจัดเม็ดสีแดงแฝง",
      en: "ANTI-ROSSO green pigment treatment to neutralize red reflections on brown hair",
    },
    description: {
      th: "No Red นวัตกรรมเม็ดสีเขียวเข้มข้น ออกแบบมาเพื่อผมสีน้ำตาลเข้มและสีธรรมชาติโดยเฉพาะ กำจัดโทนสีแดงแฝง ให้ผมสีน้ำตาลดูคูล ชิค หรูหรา เป็นธรรมชาติที่สุด",
      en: "Formulated with green pigments to cancel out unwanted red reflections on brown and natural dark hair, leaving hair cool-toned, refreshed, and glossy.",
    },
    imageUrl: "/categories/fanola/no-red.jpg",
    accentColor: "#047857", // Emerald Green
  },
  {
    slug: "nutri-care",
    brandSlug: "fanola",
    name: { th: "Nutri Care", en: "Nutri Care" },
    subtitle: {
      th: "ฟื้นบำรุงผมแห้งเสีย ขาดการบำรุง ด้วยสารสกัดโปรตีนนมบริสุทธิ์",
      en: "Deep nourishment for dry and frizzy hair with milk proteins",
    },
    description: {
      th: "กลุ่มผลิตภัณฑ์ Nutri Care ช่วยบำรุงเส้นผมที่แห้งเสีย ชี้ฟู ให้กลับมานุ่มลื่น มีน้ำหนัก สางง่าย หวีไม่พันกัน ด้วยคุณค่าโปรตีนนม ให้กลิ่นหอมละมุนน่าหลงใหล",
      en: "Enriched with nourishing milk proteins to hydrate and reconstruct dry, frizzy, and brittle hair, restoring softness, vitality, and shine.",
    },
    imageUrl: "/categories/fanola/nutri-care.jpg",
    accentColor: "#d97706", // Amber
  },
  {
    slug: "after-colour",
    brandSlug: "fanola",
    name: { th: "After colour", en: "After Colour" },
    subtitle: {
      th: "ล็อคและปกป้องสีผมหลังการทำสี ให้สีสดชัด เงางาม อยู่ทรงนาน",
      en: "Color lock and preservation treatment for color-treated hair",
    },
    description: {
      th: "After Colour ช่วยปิดเกล็ดผมทันทีหลังทำสี ล็อคเม็ดสีให้อยู่ในเส้นผมยาวนาน ป้องกันสีผมเฟดจากแสงแดดและความร้อน พร้อมสารต้านอนุมูลอิสระจากวิตามิน E และน้ำมันเมล็ดแฟลกซ์",
      en: "Formulated with Vitamin E and Linseed Oil to protect and maintain color intensity and brilliance over time.",
    },
    imageUrl: "/categories/fanola/after-colour.jpg",
    accentColor: "#be185d", // Magenta
  },
  {
    slug: "daily-care",
    brandSlug: "fanola",
    name: { th: "Daily Care", en: "Daily Care" },
    subtitle: {
      th: "ดูแลผมสำหรับใช้เป็นประจำทุกวัน อ่อนโยน เหมาะสำหรับทุกสภาพเส้นผม",
      en: "Everyday gentle cleansing and balancing hair care",
    },
    imageUrl: "/categories/fanola/daily-care.jpg",
    accentColor: "#f59e0b",
  },
  {
    slug: "sensi-care",
    brandSlug: "fanola",
    name: { th: "Sensi care", en: "Sensi Care" },
    subtitle: {
      th: "สูตรอ่อนโยนพิเศษสำหรับหนังศีรษะบอบบางและแพ้ง่าย",
      en: "Gentle soothing treatment for sensitive and delicate scalps",
    },
    imageUrl: "/categories/fanola/sensi-care.jpg",
    accentColor: "#0d9488",
  },
  {
    slug: "volume",
    brandSlug: "fanola",
    name: { th: "Volume", en: "Volume" },
    subtitle: {
      th: "เพิ่มวอลลุ่มให้เส้นผมลีบแบน ดูหนานุ่ม มีชีวิตชีวาอย่างเป็นธรรมชาติ",
      en: "Volumizing line for fine, limp, and lifeless hair",
    },
    imageUrl: "/categories/fanola/volume.jpg",
    accentColor: "#db2777",
  },
  {
    slug: "curly-shine",
    brandSlug: "fanola",
    name: { th: "Curly shine", en: "Curly Shine" },
    subtitle: {
      th: "สำหรับผมดัดและผมหยิก จัดลอนสวย เด้ง นุ่มสลวย ไม่ชี้ฟู",
      en: "Defines and revitalizes natural curls and permed hair",
    },
    imageUrl: "/categories/fanola/curly-shine.jpg",
    accentColor: "#854d0e",
  },
  {
    slug: "purity",
    brandSlug: "fanola",
    name: { th: "Purity & Scalp", en: "Purity & Scalp" },
    subtitle: {
      th: "ขจัดรังแค ดีท็อกซ์ และทำความสะอาดหนังศีรษะอย่างล้ำลึก",
      en: "Anti-dandruff and purifying scalp treatments",
    },
    imageUrl: "/categories/fanola/purity.jpg",
    accentColor: "#2563eb",
  },
  {
    slug: "rebalance",
    brandSlug: "fanola",
    name: { th: "Rebalance", en: "Rebalance" },
    subtitle: {
      th: "ควบคุมและปรับสมดุลความมันส่วนเกินบนหนังศีรษะ",
      en: "Sebum-regulating care for oily hair and scalps",
    },
    imageUrl: "/categories/fanola/rebalance.jpg",
    accentColor: "#16a34a",
  },
  {
    slug: "energy",
    brandSlug: "fanola",
    name: { th: "Energy", en: "Energy" },
    subtitle: {
      th: "ป้องกันผมร่วงและกระตุ้นการไหลเวียนของหนังศีรษะให้รากผมแข็งแรง",
      en: "Strengthening and anti-hair-loss revitalizing care",
    },
    imageUrl: "/categories/fanola/energy.jpg",
    accentColor: "#dc2626",
  },
  {
    slug: "color-mask",
    brandSlug: "fanola",
    name: { th: "Color Mask", en: "Color Mask" },
    subtitle: {
      th: "มาส์คเติมประกายสีผม เปล่งประกายเงางามภายในไม่กี่นาที",
      en: "Nourishing coloring masks to enhance and refresh hair tones",
    },
    imageUrl: "/categories/fanola/color-mask.jpg",
    accentColor: "#ea580c",
  },
  {
    slug: "hygiene",
    brandSlug: "fanola",
    name: { th: "Hygiene", en: "Hygiene" },
    subtitle: {
      th: "ทำความสะอาดและปกป้องสุขอนามัยสำหรับช่างผมและลูกค้าซาลอน",
      en: "Sanitizing and hygienic care for salons and clients",
    },
    imageUrl: "/categories/fanola/hygiene.jpg",
    accentColor: "#0284c7",
  },
  {
    slug: "no-more",
    brandSlug: "fanola",
    name: { th: "NO MORE", en: "NO MORE" },
    subtitle: {
      th: "สไตล์มินิมอล ลดขั้นตอน ประหยัดน้ำ จัดแต่งทรงผมง่ายอย่างยั่งยืน",
      en: "Eco-friendly, water-saving minimal styling and care",
    },
    imageUrl: "/categories/fanola/no-more.jpg",
    accentColor: "#475569",
  },
  {
    slug: "botugen",
    brandSlug: "fanola",
    name: { th: "Botugen (Botolife)", en: "Botugen (Botolife)" },
    subtitle: {
      th: "ฟื้นบำรุงลึกระดับโครงสร้างเส้นผม ด้วยพลัง Botolife และเคราติน",
      en: "Botolife intensive reconstruction for severely damaged hair",
    },
    imageUrl: "/categories/fanola/botugen.jpg",
    accentColor: "#7c3aed",
  },
  {
    slug: "fiber-fix",
    brandSlug: "fanola",
    name: { th: "Fiber Fix", en: "Fiber Fix" },
    subtitle: {
      th: "เทคโนโลยีเชื่อมพันธะแกนผม ป้องกันผมขาดเสียจากการทำเคมี",
      en: "Bond-multiplying treatment protecting hair during chemical services",
    },
    imageUrl: "/categories/fanola/fiber-fix.jpg",
    accentColor: "#991b1b",
  },
  {
    slug: "keraterm",
    brandSlug: "fanola",
    name: { th: "Keraterm", en: "Keraterm" },
    subtitle: {
      th: "บำรุงผมผ่านการยืดและผมชี้ฟู ให้ตรงสลวย เรียบเนียน เงางาม ทนความร้อน",
      en: "Thermo-active smoothing discipline for straightened and frizzy hair",
    },
    imageUrl: "/categories/fanola/keraterm.jpg",
    accentColor: "#1e3a8a",
  },
  {
    slug: "oro-therapy",
    brandSlug: "fanola",
    name: { th: "Oro Therapy", en: "Oro Therapy" },
    subtitle: {
      th: "ปรนนิบัติผมล้ำค่าด้วยทองคำ 24k คาเวียร์ และอาร์แกนออยล์",
      en: "Precious ritual enriched with 24k micro-active gold, argan oil & caviar",
    },
    imageUrl: "/categories/fanola/oro-therapy.jpg",
    accentColor: "#b45309",
  },
  {
    slug: "color-keratin",
    brandSlug: "fanola",
    name: { th: "Color Keratin", en: "Color Keratin" },
    subtitle: {
      th: "สีทำผมปราศจากแอมโมเนีย ผสมเคราติน ให้สีสดเด่น ชุ่มชื้น ไม่ทำร้ายเส้นผม",
      en: "Ammonia-free permanent coloring cream enriched with keratin & argan oil",
    },
    imageUrl: "/categories/fanola/color-keratin.jpg",
    accentColor: "#78350f",
  },
];

export function getBrandCategories(brandSlug: string, lang: Locale): BrandCategory[] {
  if (brandSlug.toLowerCase() === "fanola") {
    return FANOLA_CATEGORIES.map((c) => ({
      slug: c.slug,
      brandSlug: c.brandSlug,
      name: lang === "en" ? c.name.en : c.name.th,
      subtitle: c.subtitle ? (lang === "en" ? c.subtitle.en : c.subtitle.th) : undefined,
      description: c.description ? (lang === "en" ? c.description.en : c.description.th) : undefined,
      highlights: c.highlights ? (lang === "en" ? c.highlights.en : c.highlights.th) : undefined,
      imageUrl: c.imageUrl,
      bannerUrl: c.bannerUrl,
      accentColor: c.accentColor,
      subCategories: c.subCategories ? c.subCategories.map((s) => (lang === "en" ? s.en : s.th)) : undefined,
    }));
  }
  return [];
}

export function getBrandCategory(
  brandSlug: string,
  categorySlug: string,
  lang: Locale,
): BrandCategory | undefined {
  const categories = getBrandCategories(brandSlug, lang);
  return categories.find((c) => c.slug.toLowerCase() === categorySlug.toLowerCase());
}
