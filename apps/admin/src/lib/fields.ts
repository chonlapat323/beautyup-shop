import { DEPARTMENTS, POST_TYPES, REGIONS, type ResourceName, type SettingKey } from "@beautyup/types";

/* Field definitions drive the generic admin form and list for every resource. */

/** `parent` lets a dependent dropdown show only some options (e.g. collections of the chosen brand) */
export type Option = { value: string; label: string; parent?: string };

/** Extras every field accepts */
type FieldExtras = {
  /** Show the field only while another field has this value (e.g. brand type SALON) */
  showIf?: { field: string; equals: string };
};

export type Field = FieldExtras &
  (
  | { type: "text" | "textarea" | "url" | "color" | "date"; name: string; label: string; help?: string; required?: boolean; /** Fill this field from another one (slug from name) until edited by hand */ slugFrom?: string }
  | { type: "number"; name: string; label: string; help?: string; required?: boolean; step?: string }
  | { type: "localized" | "localizedTextarea"; name: string; label: string; help?: string; required?: boolean }
  | { type: "boolean"; name: string; label: string; help?: string }
  | { type: "select"; name: string; label: string; options: Option[]; help?: string; required?: boolean }
  | { type: "relation"; name: string; label: string; resource: ResourceName; nullable?: boolean; help?: string; required?: boolean; /** Only options whose parent equals this field's value */ filterBy?: string }
  /** Pick any number of rows; the value is an array of ids */
  | { type: "relations"; name: string; label: string; resource: ResourceName; help?: string }
  | { type: "image" | "file"; name: string; label: string; help?: string }
  /** Several images in one drag-and-drop box; the value is an array of URLs */
  | { type: "images"; name: string; label: string; help?: string; max?: number }
  | { type: "tags"; name: string; label: string; help?: string; suggestions?: string[] }
  | { type: "socials"; name: string; label: string; help?: string }
  | { type: "list"; name: string; label: string; item: Field[]; help?: string }
  );

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
export const postTypeLabels: Record<string, string> = { ARTICLE: "บทความ", ACTIVITY: "กิจกรรม" };
export const departmentLabels: Record<string, string> = {
  SALES: "ฝ่ายขาย",
  TECHNICIAN: "ฝ่ายเทคนิค",
  FINANCE: "การเงินและบัญชี",
  LEGAL: "กฎหมาย",
};
export const brandTypeLabels: Record<string, string> = { SALON: "แบรนด์ซาลอน", COUNTER: "เคาน์เตอร์แบรนด์" };

const opts = (values: readonly string[], labels: Record<string, string>) =>
  values.map((v) => ({ value: v, label: labels[v] ?? v }));

const slugHelp = "ส่วนท้ายของลิงก์หน้าเว็บ ใช้ a-z ตัวเล็ก ตัวเลข และ - เช่น no-yellow-shampoo ระบบสร้างจากชื่อภาษาอังกฤษให้ แก้เองได้";
/** URL part, filled from the English name/title while it is still untouched */
const slugField = (from: string): Field => ({ type: "text", name: "slug", label: "ชื่อในลิงก์ (URL)", help: slugHelp, required: true, slugFrom: from });
const slugCol: Column = { name: "slug", label: "ชื่อในลิงก์" };
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
  "main-categories": {
    title: "หมวดหมู่หลัก",
    noun: "หมวดหมู่หลัก",
    description: "กลุ่มใหญ่ของสินค้าแต่ละแบรนด์ (เช่น ผลิตภัณฑ์ดูแลผม, ผลิตภัณฑ์ทำสีผม) แสดงเป็นการ์ดบนหน้าแบรนด์ กดแล้วเห็นคอลเลกชันและสินค้าในหมวดนั้น เลือกว่าคอลเลกชันไหนอยู่หมวดไหนได้ที่หน้าแก้ไขคอลเลกชัน",
    titleField: "name",
    searchable: true,
    fields: [
      { type: "relation", name: "brandId", label: "แบรนด์", resource: "brands", required: true },
      { type: "localized", name: "name", label: "ชื่อหมวดหมู่หลัก", required: true },
      slugField("name"),
      { type: "localizedTextarea", name: "description", label: "คำอธิบาย (แสดงบนการ์ดและด้านบนหน้าหมวด)" },
      { type: "image", name: "imageUrl", label: "รูปการ์ด" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "imageUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อหมวดหมู่หลัก", kind: "localized" },
      { name: "brand", label: "แบรนด์", kind: "brand" },
      { name: "sortOrder", label: "ลำดับ" },
      activeCol,
    ],
  },
  categories: {
    title: "คอลเลกชัน (ไม่บังคับ)",
    noun: "คอลเลกชัน",
    description: "กลุ่มสินค้าย่อยภายใต้หมวดหมู่หลัก (เช่น No Yellow Care, Nutri Care) ใช้เฉพาะแบรนด์/หมวดที่มีการแบ่งคอลเลกชันย่อย",
    titleField: "name",
    searchable: true,
    fields: [
      { type: "relation", name: "brandId", label: "แบรนด์", resource: "brands", required: true },
      { type: "relation", name: "mainCategoryId", label: "หมวดหมู่หลัก", resource: "main-categories", required: true, filterBy: "brandId", help: "บังคับเลือกหมวดหมู่หลักที่คอลเลกชันนี้สังกัดอยู่ (แสดงเฉพาะหมวดของแบรนด์ที่เลือก)" },
      { type: "localized", name: "name", label: "ชื่อคอลเลกชัน", required: true },
      slugField("name"),
      { type: "localized", name: "subtitle", label: "คำโปรยสั้น" },
      { type: "localizedTextarea", name: "description", label: "คำอธิบาย (แสดงด้านบนหน้าคอลเลกชัน)" },
      { type: "localizedTextarea", name: "highlights", label: "จุดเด่น (เช่น 360° Blonde Protection)" },
      { type: "image", name: "imageUrl", label: "รูปการ์ดคอลเลกชัน" },
      { type: "image", name: "bannerUrl", label: "รูปพื้นหลังด้านบนหน้าคอลเลกชัน" },
      { type: "color", name: "accentColor", label: "สีประจำคอลเลกชัน" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "imageUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อคอลเลกชัน", kind: "localized" },
      { name: "brand", label: "แบรนด์", kind: "brand" },
      { name: "mainCategory", label: "หมวดหมู่หลัก", kind: "brand" },
      slugCol,
      activeCol,
    ],
  },
  products: {
    title: "สินค้า",
    noun: "สินค้า",
    description: "รายการสินค้า (บังคับเลือก แบรนด์ → หมวดหมู่หลัก ส่วนคอลเลกชันเลือกเฉพาะกรณีที่มี) พร้อมคำค้นหา SEO / AI",
    titleField: "name",
    searchable: true,
    fields: [
      { type: "localized", name: "name", label: "ชื่อสินค้า", required: true },
      slugField("name"),
      { type: "relation", name: "brandId", label: "แบรนด์", resource: "brands", required: true },
      { type: "relation", name: "mainCategoryId", label: "หมวดหมู่หลัก", resource: "main-categories", required: true, filterBy: "brandId", help: "บังคับเลือกหมวดหมู่หลักของสินค้า (แสดงเฉพาะหมวดของแบรนด์ที่เลือก)" },
      { type: "relation", name: "categoryId", label: "คอลเลกชัน (ไม่บังคับ)", resource: "categories", nullable: true, filterBy: "mainCategoryId", help: "ถ้าหมวดนี้ไม่มีคอลเลกชันย่อย ให้เว้นว่างไว้เป็น — ไม่ระบุ — ได้เลย" },
      { type: "number", name: "price", label: "ราคา (บาท)", step: "0.01", required: true },
      { type: "number", name: "salePrice", label: "ราคาลด (บาท)", step: "0.01", help: "เว้นว่างถ้าไม่มีส่วนลด" },
      { type: "tags", name: "badges", label: "ป้าย", suggestions: ["New", "Hot", "Best Seller", "Soft hair"] },
      { type: "tags", name: "tags", label: "คำค้นหา (แท็ก SEO / AI)", help: "พิมพ์แล้วกด Enter เช่น shampoo, แชมพูม่วง, ลดประกายเหลือง, ทำสีผม เพื่อให้ Google และ AI ค้นหาเจอ" },
      {
        type: "image",
        name: "imageUrl",
        label: "รูปสินค้า",
        help: "ตอนบันทึก ระบบตั้งชื่อไฟล์รูปใหม่ให้บอกว่าเป็นรูปของอะไร (แบรนด์-slug-tag-วันที่-1) เช่น fanola-no-yellow-shampoo-1000ml-20261026-1.jpg ให้ Google และ AI อ่านเข้าใจ",
      },
      { type: "localizedTextarea", name: "description", label: "รายละเอียด" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "imageUrl", label: "", kind: "image" },
      { name: "name", label: "ชื่อ", kind: "localized" },
      { name: "brand", label: "แบรนด์", kind: "brand" },
      { name: "mainCategory", label: "หมวดหมู่หลัก", kind: "brand" },
      { name: "categoryRel", label: "คอลเลกชัน", kind: "brand" },
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
      slugField("name"),
      { type: "select", name: "type", label: "ประเภท", options: opts(["SALON", "COUNTER"], brandTypeLabels), required: true },
      { type: "localized", name: "localName", label: "ชื่อเรียก (เช่น ฟาโนลา)" },
      { type: "localized", name: "country", label: "ประเทศ" },
      { type: "localized", name: "tagline", label: "สโลแกน", showIf: { field: "type", equals: "SALON" } },
      { type: "localizedTextarea", name: "description", label: "คำอธิบาย" },
      { type: "list", name: "highlights", label: "จุดเด่น", item: [{ type: "localized", name: "", label: "จุดเด่น", required: true }], showIf: { field: "type", equals: "SALON" } },
      { type: "image", name: "logoUrl", label: "โลโก้ / รูปแบรนด์" },
      { type: "url", name: "website", label: "เว็บไซต์แบรนด์" },
      { type: "file", name: "catalogUrl", label: "แคตตาล็อก (PDF)", showIf: { field: "type", equals: "SALON" } },
      { type: "socials", name: "socials", label: "โซเชียล", showIf: { field: "type", equals: "SALON" } },
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
    title: "เมนูและหน้าเว็บ",
    noun: "เมนู",
    titleField: "label",
    // Edited in the menu editor; these fields only tell loadRelations which dropdowns it needs
    fields: [
      { type: "localized", name: "label", label: "ชื่อเมนู", required: true },
      { type: "relation", name: "parentId", label: "อยู่ใต้เมนู", resource: "menu-items", nullable: true },
      { type: "relation", name: "brandId", label: "แบรนด์", resource: "brands", nullable: true },
    ],
    columns: [
      { name: "label", label: "ชื่อเมนู", kind: "localized" },
      { name: "href", label: "ลิงก์" },
      { name: "parent", label: "อยู่ใต้เมนู", kind: "brand" },
      { name: "sortOrder", label: "ลำดับ" },
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
      slugField("title"),
      { type: "localized", name: "priceText", label: "ราคา", help: "เช่น 49,900 ฿" },
      { type: "localized", name: "duration", label: "ระยะเวลา", help: "เช่น 3 วัน" },
      { type: "localizedTextarea", name: "summary", label: "สรุปสั้น" },
      { type: "localizedTextarea", name: "content", label: "สิ่งที่จะได้เรียนรู้", help: "หนึ่งข้อต่อหนึ่งบรรทัด" },
      { type: "image", name: "coverUrl", label: "รูปปก" },
      { type: "images", name: "images", label: "รูปภาพเพิ่มเติม", help: "แสดงเป็นแกลเลอรี่ในหน้าคอร์ส", max: 5 },
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
    title: "บทความ / กิจกรรม",
    noun: "โพสต์",
    titleField: "title",
    searchable: true,
    fields: [
      { type: "select", name: "type", label: "หมวด", options: opts(POST_TYPES, postTypeLabels), required: true },
      { type: "localized", name: "title", label: "หัวข้อ", required: true },
      slugField("title"),
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
  media: {
    title: "มีเดีย",
    noun: "มีเดีย",
    description: "รูปภาพและวิดีโอ แสดงที่มุมสมาชิก → มีเดีย พร้อมข้อมูลให้ Google และ AI ค้นหาเจอ",
    titleField: "title",
    searchable: true,
    fields: [
      { type: "localized", name: "title", label: "หัวข้อ", required: true },
      slugField("title"),
      { type: "relation", name: "categoryId", label: "หมวดหมู่มีเดีย", resource: "media-categories", nullable: true },
      { type: "relations", name: "brandIds", label: "แบรนด์ที่เกี่ยวข้อง", resource: "brands", help: "เลือกได้หลายแบรนด์ ใช้ตั้งชื่อไฟล์รูปและบอก Google/AI ว่ามีเดียนี้เกี่ยวกับแบรนด์ไหน" },
      { type: "tags", name: "tags", label: "คำค้นหา (แท็ก)", help: "พิมพ์แล้วกด Enter เช่น shampoo, ทำสีผม, งานสัมมนา" },
      { type: "localizedTextarea", name: "excerpt", label: "สรุปสั้น", help: "ใช้เป็นคำอธิบายใน Google และตอนแชร์ลิงก์" },
      { type: "localizedTextarea", name: "body", label: "เนื้อหา", help: "หนึ่งย่อหน้าต่อหนึ่งบรรทัด" },
      {
        type: "images",
        name: "images",
        label: "รูปภาพ",
        help: "ตอนบันทึก ระบบตั้งชื่อไฟล์รูปใหม่ให้บอกว่าเป็นรูปของอะไร (แบรนด์-slug-tag-วันที่-ลำดับ) เช่น fanola-20-years-of-fanola-campaign-20261019-1.jpg ให้ Google และ AI อ่านเข้าใจ",
        max: 20,
      },
      { type: "url", name: "videoUrl", label: "ลิงก์วิดีโอ (YouTube)" },
      { type: "date", name: "publishedAt", label: "วันที่เผยแพร่", help: "เว้นว่าง = ฉบับร่าง (ยังไม่แสดงบนเว็บ)" },
    ],
    columns: [
      { name: "images", label: "", kind: "image" },
      { name: "title", label: "หัวข้อ", kind: "localized" },
      { name: "brands", label: "แบรนด์", kind: "brand" },
      { name: "publishedAt", label: "เผยแพร่", kind: "date" },
    ],
  },
  "forum-topics": {
    title: "กระทู้",
    noun: "กระทู้",
    description: "ผู้เยี่ยมชมตั้งกระทู้ได้เองและขึ้นเว็บทันที ปิด \"แสดงบนเว็บไซต์\" เพื่อซ่อนกระทู้ที่ไม่เหมาะสม",
    titleField: "title",
    searchable: true,
    fields: [
      { type: "relation", name: "categoryId", label: "หมวดหมู่", resource: "forum-categories", required: true },
      { type: "text", name: "title", label: "หัวข้อ", required: true },
      { type: "textarea", name: "body", label: "รายละเอียด", required: true },
      { type: "text", name: "authorName", label: "ชื่อผู้ตั้งกระทู้", required: true },
      { type: "images", name: "images", label: "รูปแนบ", max: 4 },
      { type: "boolean", name: "isPinned", label: "ปักหมุด (แสดงบนสุด)" },
      { type: "boolean", name: "isLocked", label: "ปิดการตอบ" },
      isActive,
    ],
    columns: [
      { name: "images", label: "", kind: "image" },
      { name: "title", label: "หัวข้อ" },
      { name: "authorName", label: "ผู้ตั้ง" },
      { name: "category", label: "หมวดหมู่", kind: "brand" },
      { name: "createdAt", label: "วันที่", kind: "date" },
      activeCol,
    ],
  },
  "forum-replies": {
    title: "ความคิดเห็น",
    noun: "ความคิดเห็น",
    description: "ความคิดเห็นทุกกระทู้ ใหม่สุดอยู่บน ปิด \"แสดงบนเว็บไซต์\" เพื่อซ่อน",
    titleField: "body",
    searchable: true,
    fields: [
      { type: "relation", name: "topicId", label: "กระทู้", resource: "forum-topics", required: true },
      { type: "textarea", name: "body", label: "ข้อความ", required: true },
      { type: "text", name: "authorName", label: "ชื่อผู้แสดงความคิดเห็น", required: true },
      { type: "images", name: "images", label: "รูปแนบ", max: 4 },
      isActive,
    ],
    columns: [
      { name: "body", label: "ข้อความ" },
      { name: "authorName", label: "ผู้เขียน" },
      { name: "topic", label: "กระทู้", kind: "brand" },
      { name: "createdAt", label: "วันที่", kind: "date" },
      activeCol,
    ],
  },
  "forum-categories": {
    title: "หมวดหมู่ฟอรั่ม",
    noun: "หมวดหมู่",
    titleField: "name",
    fields: [
      { type: "localized", name: "name", label: "ชื่อหมวดหมู่", required: true },
      slugField("name"),
      { type: "localizedTextarea", name: "description", label: "คำอธิบาย" },
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "name", label: "ชื่อหมวดหมู่", kind: "localized" },
      slugCol,
      activeCol,
    ],
  },
  "media-categories": {
    title: "หมวดหมู่มีเดีย",
    noun: "หมวดหมู่",
    titleField: "name",
    fields: [
      { type: "localized", name: "name", label: "ชื่อหมวดหมู่", required: true },
      slugField("name"),
      sortOrder,
      isActive,
    ],
    columns: [
      { name: "name", label: "ชื่อหมวดหมู่", kind: "localized" },
      slugCol,
      activeCol,
    ],
  },
  pages: {
    title: "หน้าข้อความ",
    noun: "หน้า",
    description: "หน้าที่มีแต่ข้อความ เช่น นโยบาย ชื่อในลิงก์คือที่อยู่หน้า (policy = /policy) หน้าที่มีรูปหรือสไลด์ให้สร้างที่ เมนูและหน้าเว็บ",
    titleField: "title",
    fields: [
      { type: "localized", name: "title", label: "หัวข้อ", required: true },
      slugField("title"),
      { type: "localizedTextarea", name: "body", label: "เนื้อหา", help: "หนึ่งย่อหน้าต่อหนึ่งบรรทัด · บรรทัดที่ขึ้นต้นด้วย ## คือหัวข้อ" },
      isActive,
    ],
    columns: [
      { name: "title", label: "หัวข้อ", kind: "localized" },
      slugCol,
      activeCol,
    ],
  },
  videos: {
    title: "วิดีโอหน้าแรก",
    noun: "วิดีโอ",
    description: "หน้าแรกแสดงวิดีโอลำดับแรกที่เปิดแสดงอยู่ 1 รายการ",
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
  about: {
    title: "หน้าเกี่ยวกับเรา",
    description: "ข้อความ รูปผู้ก่อตั้ง และปุ่มลิงก์ในหน้าเกี่ยวกับเรา",
    fields: [
      { type: "localized", name: "eyebrow", label: "ข้อความเล็กเหนือหัวเรื่อง" },
      { type: "localized", name: "headline", label: "หัวเรื่อง", required: true },
      { type: "localizedTextarea", name: "lead", label: "ข้อความแนะนำบริษัท" },
      { type: "localizedTextarea", name: "welcomeText", label: "ข้อความต้อนรับ" },
      { type: "image", name: "founderPhoto", label: "รูปผู้ก่อตั้ง" },
      { type: "localized", name: "founderName", label: "ชื่อผู้ก่อตั้ง", required: true },
      { type: "localized", name: "founderRole", label: "ตำแหน่งผู้ก่อตั้ง" },
      { type: "localizedTextarea", name: "education", label: "ประวัติการศึกษา (หนึ่งบรรทัดต่อรายการ)" },
      { type: "socials", name: "socials", label: "โซเชียลของผู้ก่อตั้ง" },
      {
        type: "list",
        name: "links",
        label: "ปุ่มลิงก์",
        item: [
          { type: "localized", name: "label", label: "ข้อความบนปุ่ม", required: true },
          { type: "text", name: "href", label: "ลิงก์ปลายทาง (เช่น /products หรือ https://...)", required: true },
        ],
      },
    ] satisfies Field[],
  },
  aboutSlides: {
    title: "สไลด์หน้าเกี่ยวกับเรา",
    description: "ภาพสไลด์ในหน้าเกี่ยวกับเรา (แยกจากสไลด์หน้าแรก)",
    fields: [
      {
        type: "list",
        name: "",
        label: "รายการภาพสไลด์",
        item: [
          { type: "image", name: "imageUrl", label: "รูปภาพสไลด์" },
          { type: "localized", name: "title", label: "ชื่อภาพ / หัวข้อ (ไม่บังคับ)" },
          { type: "localized", name: "caption", label: "คำบรรยายภาพ (ไม่บังคับ)" },
        ],
      },
    ] satisfies Field[],
  },
  vipCustomer: {
    title: "แบนเนอร์ลูกค้า VIP",
    description: "ข้อความและรูปพื้นหลังด้านบนหน้าลูกค้า (/customers)",
    fields: [
      { type: "localized", name: "eyebrow", label: "ข้อความเล็กเหนือหัวเรื่อง", help: "เช่น Our VIP Customer" },
      { type: "localizedTextarea", name: "quote", label: "ข้อความหลัก", help: "เช่น ช่างผมประสบการณ์สูง ความสามารถโดดเด่น... (ขึ้นบรรทัดใหม่ได้)" },
      { type: "localized", name: "subtext", label: "ข้อความเสริมใต้ข้อความหลัก (ไม่บังคับ)" },
      { type: "image", name: "bgImageUrl", label: "รูปพื้นหลัง", help: "แสดงจางๆ ด้านหลังข้อความ เว้นว่างได้" },
    ] satisfies Field[],
  },
  growVision: {
    title: "แถบ Grow Your Vision",
    description: "กล่องรูปและลิงก์ที่แสดงก่อนท้ายเว็บของทุกหน้า",
    fields: [
      { type: "image", name: "imageUrl", label: "รูปภาพฝั่งขวา" },
      { type: "localized", name: "badge", label: "ป้ายข้อความบนรูป", help: "เช่น Heona · No Yellow · Sweet" },
      {
        type: "list",
        name: "items",
        label: "รายการลิงก์และข้อความ",
        item: [
          { type: "localized", name: "title", label: "หัวข้อ", required: true },
          { type: "localized", name: "text", label: "คำบรรยายสั้น" },
          { type: "text", name: "href", label: "ลิงก์ปลายทาง (เช่น /products หรือ https://...)", required: true },
        ],
      },
    ] satisfies Field[],
  },
  timeline: {
    title: "เส้นทางของบิวตี้อัพ",
    description: "ไทม์ไลน์ประวัติบริษัทในหน้าเกี่ยวกับเรา",
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
  regionCounts: {
    title: "จำนวนซาลอนแต่ละภาค (แสดงบนเว็บ)",
    description: "ใช้แทนการนับจากรายชื่อซาลอน จนกว่าจะนำเข้ารายชื่อครบ เว้นว่างเพื่อให้นับอัตโนมัติ",
    fields: REGIONS.map((r) => ({ type: "number" as const, name: r, label: regionLabels[r] })),
  },
} as const;

/** Site-wide settings, edited on the "ตั้งค่าเว็บไซต์" page */
export const SITE_SETTING_KEYS = ["company", "growVision", "regionCounts"] as const satisfies readonly SettingKey[];

/** Settings that belong to one page; each has its own sidebar entry at /content/<key> */
export const PAGE_SETTINGS = {
  about: { path: "/about", page: "หน้าเกี่ยวกับเรา", tab: "เนื้อหา" },
  aboutSlides: { path: "/about", page: "หน้าเกี่ยวกับเรา", tab: "สไลด์" },
  timeline: { path: "/about", page: "หน้าเกี่ยวกับเรา", tab: "เส้นทางของบิวตี้อัพ" },
  vipCustomer: { path: "/customers", page: "แบนเนอร์ลูกค้า VIP", tab: "แบนเนอร์" },
} as const satisfies Partial<Record<SettingKey, { path: string; page: string; tab: string }>>;
export type PageSettingKey = keyof typeof PAGE_SETTINGS;
