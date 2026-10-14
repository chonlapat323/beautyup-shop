import { DEPARTMENTS, MENU_LOCATIONS, POST_TYPES, REGIONS, type ResourceName } from "@beautyup/types";

/* Field definitions drive the generic admin form and list for every resource. */

export type Option = { value: string; label: string };

export type Field =
  | { type: "text" | "textarea" | "url" | "color" | "date"; name: string; label: string; help?: string; required?: boolean }
  | { type: "number"; name: string; label: string; help?: string; required?: boolean; step?: string }
  | { type: "localized" | "localizedTextarea"; name: string; label: string; help?: string; required?: boolean }
  | { type: "boolean"; name: string; label: string; help?: string }
  | { type: "select"; name: string; label: string; options: Option[]; help?: string; required?: boolean }
  | { type: "relation"; name: string; label: string; resource: ResourceName; nullable?: boolean; help?: string; required?: boolean }
  | { type: "image" | "file"; name: string; label: string; help?: string }
  | { type: "tags"; name: string; label: string; help?: string; suggestions?: string[] }
  | { type: "socials"; name: string; label: string; help?: string }
  | { type: "list"; name: string; label: string; item: Field[]; help?: string };

export type Column = {
  name: string;
  label: string;
  kind?: "localized" | "image" | "boolean" | "price" | "date" | "enum" | "brand" | "color";
  enumLabels?: Record<string, string>;
};

export const regionLabels: Record<string, string> = {
  BANGKOK_CENTRAL: "กรุงเทพฯ และภาคกลาง",
  EAST: "ภาคตะวันออก",
  WEST: "ภาคตะวันตก",
  NORTH: "ภาคเหนือ",
  SOUTH: "ภาคใต้",
  NORTHEAST: "ภาคตะวันออกเฉียงเหนือ",
};
export const postTypeLabels: Record<string, string> = { ARTICLE: "บทความ", ACTIVITY: "กิจกรรม", MEDIA: "มีเดีย" };
export const departmentLabels: Record<string, string> = {
  SALES: "ฝ่ายขาย",
  TECHNICIAN: "เทคนิคเชี่ยน",
  FINANCE: "การเงินและบัญชี",
  LEGAL: "กฎหมาย",
};
export const brandTypeLabels: Record<string, string> = { SALON: "แบรนด์ซาลอน", COUNTER: "เคาน์เตอร์แบรนด์" };

const opts = (values: readonly string[], labels: Record<string, string>) =>
  values.map((v) => ({ value: v, label: labels[v] ?? v }));

const slugHelp = "ส่วนท้ายของ URL เช่น no-yellow-shampoo (a-z, 0-9, -)";
const sortOrder: Field = { type: "number", name: "sortOrder", label: "ลำดับการแสดง", help: "เลขน้อยแสดงก่อน" };
const isActive: Field = { type: "boolean", name: "isActive", label: "แสดงบนเว็บไซต์" };
const activeCol: Column = { name: "isActive", label: "แสดง", kind: "boolean" };

export interface ResourceUi {
  title: string;
  /** Singular noun for buttons, e.g. "เพิ่มสินค้า" */
  noun: string;
  description?: string;
  fields: Field[];
  columns: Column[];
  /** Which field to show as the row title */
  titleField: string;
  searchable?: boolean;
}

export const resourceUi: Record<ResourceName, ResourceUi> = {
  products: {
    title: "สินค้า",
    noun: "สินค้า",
    titleField: "name",
    searchable: true,
    fields: [
      { type: "localized", name: "name", label: "ชื่อสินค้า", required: true },
      { type: "text", name: "slug", label: "Slug", help: slugHelp, required: true },
      { type: "relation", name: "brandId", label: "แบรนด์", resource: "brands", required: true },
      { type: "number", name: "price", label: "ราคา (บาท)", step: "0.01", required: true },
      { type: "number", name: "salePrice", label: "ราคาลด (บาท)", step: "0.01", help: "เว้นว่างถ้าไม่มีส่วนลด" },
      { type: "tags", name: "badges", label: "ป้าย", suggestions: ["New", "Hot", "Best Seller", "Soft hair"] },
      { type: "image", name: "imageUrl", label: "รูปสินค้า" },
      { type: "localizedTextarea", name: "description", label: "รายละเอียด" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "imageUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อ", kind: "localized" },
      { name: "brand", label: "แบรนด์", kind: "brand" },
      { name: "price", label: "ราคา", kind: "price" },
      activeCol,
    ],
  },
  brands: {
    title: "แบรนด์",
    noun: "แบรนด์",
    titleField: "name",
    searchable: true,
    fields: [
      { type: "text", name: "name", label: "ชื่อแบรนด์", required: true },
      { type: "text", name: "slug", label: "Slug", help: slugHelp, required: true },
      { type: "select", name: "type", label: "ประเภท", options: opts(["SALON", "COUNTER"], brandTypeLabels), required: true },
      { type: "localized", name: "localName", label: "ชื่อเรียก (เช่น ฟาโนลา)" },
      { type: "localized", name: "country", label: "ประเทศ" },
      { type: "localized", name: "tagline", label: "สโลแกน" },
      { type: "localizedTextarea", name: "description", label: "คำอธิบาย" },
      { type: "list", name: "highlights", label: "จุดเด่น", item: [{ type: "localized", name: "", label: "จุดเด่น", required: true }] },
      { type: "image", name: "logoUrl", label: "โลโก้ / รูปแบรนด์" },
      { type: "url", name: "website", label: "เว็บไซต์แบรนด์" },
      { type: "file", name: "catalogUrl", label: "แคตตาล็อก (PDF)" },
      { type: "socials", name: "socials", label: "โซเชียล" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "logoUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อ" },
      { name: "type", label: "ประเภท", kind: "enum", enumLabels: brandTypeLabels },
      activeCol,
    ],
  },
  "hero-slides": {
    title: "สไลด์หน้าแรก",
    noun: "สไลด์",
    description: "แบนเนอร์สไลด์หน้าแรก (อัตราส่วนแนะนำ 16:9) สามารถคลิกเพื่อลิงก์ไปยังสินค้าหรือหน้าเว็บที่ต้องการได้",
    titleField: "product",
    fields: [
      { type: "image", name: "imageUrl", label: "ภาพแบนเนอร์ (16:9)", help: "ขนาดแนะนำ 16:9 เช่น 1920x1080 หรือ 1280x720" },
      { type: "localized", name: "product", label: "หัวข้อ / ชื่อสไลด์", required: true },
      { type: "localized", name: "caption", label: "คำบรรยายสั้น (ไม่บังคับ)" },
      { type: "text", name: "href", label: "ลิงก์เมื่อกด", help: "เช่น /products หรือ /shop หรือลิงก์ภายนอก", required: true },
      { type: "relation", name: "brandId", label: "แบรนด์ (ไม่บังคับ)", resource: "brands", nullable: true },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "imageUrl", label: "ภาพแบนเนอร์", kind: "image" },
      { name: "product", label: "ชื่อสไลด์ / แบนเนอร์", kind: "localized" },
      { name: "href", label: "ลิงก์ปลายทาง" },
      activeCol,
    ],
  },
  "menu-items": {
    title: "เมนูเว็บไซต์",
    noun: "เมนู",
    titleField: "label",
    fields: [
      { type: "localized", name: "label", label: "ชื่อเมนู", required: true },
      { type: "text", name: "href", label: "ลิงก์", help: "เช่น /products หรือ https://...", required: true },
      { type: "relation", name: "parentId", label: "อยู่ใต้เมนู", resource: "menu-items", nullable: true, help: "เว้นว่างถ้าเป็นเมนูหลัก" },
      { type: "select", name: "location", label: "ตำแหน่ง", options: opts(MENU_LOCATIONS, { header: "ส่วนหัว", footer: "ท้ายเว็บ" }) },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "label", label: "ชื่อเมนู", kind: "localized" },
      { name: "href", label: "ลิงก์" },
      activeCol,
    ],
  },
  courses: {
    title: "คอร์สเรียน",
    noun: "คอร์ส",
    titleField: "title",
    searchable: true,
    fields: [
      { type: "localized", name: "title", label: "ชื่อคอร์ส", required: true },
      { type: "text", name: "slug", label: "Slug", help: slugHelp, required: true },
      { type: "localized", name: "priceText", label: "ราคา", help: "เช่น 49,900 ฿" },
      { type: "localized", name: "duration", label: "ระยะเวลา", help: "เช่น 3 วัน" },
      { type: "localizedTextarea", name: "summary", label: "สรุปสั้น" },
      { type: "localizedTextarea", name: "content", label: "สิ่งที่จะได้เรียนรู้", help: "หนึ่งข้อต่อหนึ่งบรรทัด" },
      { type: "image", name: "coverUrl", label: "รูปปก" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "coverUrl", label: "", kind: "image" },
      { name: "title", label: "ชื่อคอร์ส", kind: "localized" },
      { name: "priceText", label: "ราคา", kind: "localized" },
      activeCol,
    ],
  },
  posts: {
    title: "บทความ / กิจกรรม / มีเดีย",
    noun: "โพสต์",
    titleField: "title",
    searchable: true,
    fields: [
      { type: "select", name: "type", label: "หมวด", options: opts(POST_TYPES, postTypeLabels), required: true },
      { type: "localized", name: "title", label: "หัวข้อ", required: true },
      { type: "text", name: "slug", label: "Slug", help: slugHelp, required: true },
      { type: "localizedTextarea", name: "excerpt", label: "สรุปสั้น" },
      { type: "localizedTextarea", name: "body", label: "เนื้อหา", help: "หนึ่งย่อหน้าต่อหนึ่งบรรทัด" },
      { type: "image", name: "coverUrl", label: "รูปปก" },
      { type: "url", name: "videoUrl", label: "ลิงก์วิดีโอ (YouTube)" },
      { type: "date", name: "publishedAt", label: "วันที่เผยแพร่", help: "เว้นว่าง = ฉบับร่าง (ยังไม่แสดงบนเว็บ)" },
    ],
    columns: [
      { name: "coverUrl", label: "", kind: "image" },
      { name: "title", label: "หัวข้อ", kind: "localized" },
      { name: "type", label: "หมวด", kind: "enum", enumLabels: postTypeLabels },
      { name: "publishedAt", label: "เผยแพร่", kind: "date" },
    ],
  },
  pages: {
    title: "หน้าเนื้อหา",
    noun: "หน้า",
    description: "หน้าข้อความ เช่น นโยบาย ใช้ slug เป็นชื่อหน้า (policy = /policy)",
    titleField: "title",
    fields: [
      { type: "localized", name: "title", label: "หัวข้อ", required: true },
      { type: "text", name: "slug", label: "Slug", help: slugHelp, required: true },
      { type: "localizedTextarea", name: "body", label: "เนื้อหา", help: "หนึ่งย่อหน้าต่อหนึ่งบรรทัด ขึ้นต้นด้วย ## เพื่อทำหัวข้อย่อย" },
    ],
    columns: [
      { name: "title", label: "หัวข้อ", kind: "localized" },
      { name: "slug", label: "Slug" },
    ],
  },
  videos: {
    title: "วิดีโอ",
    noun: "วิดีโอ",
    titleField: "title",
    fields: [
      { type: "localized", name: "title", label: "ชื่อวิดีโอ", required: true },
      { type: "url", name: "youtubeUrl", label: "ลิงก์ YouTube", required: true },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "title", label: "ชื่อ", kind: "localized" },
      { name: "youtubeUrl", label: "ลิงก์" },
      activeCol,
    ],
  },
  ambassadors: {
    title: "แบรนด์แอมบาสเดอร์",
    noun: "แอมบาสเดอร์",
    titleField: "name",
    fields: [
      { type: "text", name: "name", label: "ชื่อ", required: true },
      { type: "localized", name: "title", label: "ตำแหน่ง / ร้าน" },
      { type: "image", name: "photoUrl", label: "รูป" },
      { type: "socials", name: "socials", label: "โซเชียล" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "photoUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อ" },
      { name: "title", label: "ตำแหน่ง", kind: "localized" },
      activeCol,
    ],
  },
  salons: {
    title: "ซาลอนพันธมิตร",
    noun: "ซาลอน",
    titleField: "name",
    searchable: true,
    fields: [
      { type: "text", name: "name", label: "ชื่อร้าน", required: true },
      { type: "select", name: "region", label: "ภาค", options: opts(REGIONS, regionLabels), required: true },
      { type: "text", name: "province", label: "จังหวัด", required: true },
      { type: "textarea", name: "address", label: "ที่อยู่" },
      { type: "text", name: "phone", label: "เบอร์โทร" },
      { type: "url", name: "mapUrl", label: "ลิงก์ Google Maps" },
      isActive,
    ],
    columns: [
      { name: "name", label: "ชื่อร้าน" },
      { name: "province", label: "จังหวัด" },
      { name: "region", label: "ภาค", kind: "enum", enumLabels: regionLabels },
      activeCol,
    ],
  },
  team: {
    title: "ทีมงาน",
    noun: "ทีมงาน",
    titleField: "name",
    fields: [
      { type: "localized", name: "name", label: "ชื่อ", required: true },
      { type: "localized", name: "position", label: "ตำแหน่ง" },
      { type: "select", name: "department", label: "ฝ่าย", options: opts(DEPARTMENTS, departmentLabels), required: true },
      { type: "text", name: "phone", label: "เบอร์โทร" },
      { type: "text", name: "lineId", label: "LINE ID" },
      { type: "image", name: "photoUrl", label: "รูป" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "photoUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อ", kind: "localized" },
      { name: "department", label: "ฝ่าย", kind: "enum", enumLabels: departmentLabels },
      activeCol,
    ],
  },
};

/** Settings forms reuse the same field renderer. */
export const settingsUi = {
  company: {
    title: "ข้อมูลบริษัท",
    fields: [
      { type: "localized", name: "name", label: "ชื่อบริษัท", required: true },
      { type: "localizedTextarea", name: "address", label: "ที่อยู่", required: true },
      { type: "tags", name: "phones", label: "เบอร์โทร" },
      { type: "text", name: "email", label: "อีเมล" },
      { type: "text", name: "taxId", label: "เลขประจำตัวผู้เสียภาษี" },
      { type: "url", name: "mapUrl", label: "ลิงก์ Google Maps" },
      { type: "url", name: "facebookGroup", label: "กลุ่ม Facebook" },
      {
        type: "list",
        name: "departments",
        label: "ติดต่อฝ่ายต่าง ๆ",
        item: [
          { type: "localized", name: "name", label: "ฝ่าย", required: true },
          { type: "text", name: "phone", label: "เบอร์โทร" },
        ],
      },
      {
        type: "list",
        name: "bankAccounts",
        label: "บัญชีธนาคาร (หน้าการชำระเงิน)",
        item: [
          { type: "localized", name: "bank", label: "ธนาคาร", required: true },
          { type: "localized", name: "accountName", label: "ชื่อบัญชี", required: true },
          { type: "text", name: "accountNo", label: "เลขบัญชี" },
        ],
      },
    ] satisfies Field[],
  },
  timeline: {
    title: "เส้นทางของบิวตี้อัพ (หน้าเกี่ยวกับเรา)",
    fields: [
      {
        type: "list",
        name: "",
        label: "เหตุการณ์",
        item: [
          { type: "text", name: "year", label: "ปี" },
          { type: "localized", name: "text", label: "รายละเอียด", required: true },
        ],
      },
    ] satisfies Field[],
  },
  ppStudio: {
    title: "บริการ PP STUDIO",
    fields: [
      {
        type: "list",
        name: "",
        label: "บริการ",
        item: [
          { type: "text", name: "title", label: "ชื่อบริการ" },
          { type: "localizedTextarea", name: "text", label: "รายละเอียด", required: true },
        ],
      },
    ] satisfies Field[],
  },
  regionCounts: {
    title: "จำนวนซาลอนแต่ละภาค (แสดงบนเว็บ)",
    description: "ใช้แทนการนับจากรายชื่อซาลอน จนกว่าจะนำเข้ารายชื่อครบ เว้นว่างเพื่อให้นับอัตโนมัติ",
    fields: REGIONS.map((r) => ({ type: "number" as const, name: r, label: regionLabels[r] })),
  },
} as const;
