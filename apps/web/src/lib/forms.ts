import type { FormField } from "@/components/inquiry-form";
import { provinces } from "./mock-data";

export const salonPartnerFields: FormField[] = [
  { name: "name", label: "ชื่อ - สกุล", required: true, half: true, autoComplete: "name" },
  { name: "phone", label: "เบอร์โทรศัพท์", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "อีเมล", type: "email", required: true, half: true, autoComplete: "email" },
  { name: "shopName", label: "ชื่อร้าน", required: true, half: true, autoComplete: "organization" },
  { name: "province", label: "จังหวัด", type: "select", options: provinces, required: true },
  { name: "message", label: "ข้อความ", type: "textarea", required: true },
];

export const contactFields: FormField[] = [
  { name: "name", label: "ชื่อ - สกุล", required: true, half: true, autoComplete: "name" },
  { name: "phone", label: "เบอร์โทรศัพท์", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "อีเมล", type: "email", autoComplete: "email" },
  { name: "message", label: "ข้อความ", type: "textarea", required: true },
];

export const issueFields: FormField[] = [
  { name: "name", label: "ชื่อ - สกุล", required: true, half: true, autoComplete: "name" },
  { name: "phone", label: "เบอร์โทรศัพท์", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "อีเมล", type: "email", autoComplete: "email" },
  { name: "orderRef", label: "เลขที่เอกสาร / ใบสั่งซื้อ (ถ้ามี)" },
  { name: "message", label: "รายละเอียดปัญหา", type: "textarea", required: true },
];

export const ppStudioFields: FormField[] = [
  { name: "name", label: "First Name", required: true, half: true, autoComplete: "given-name" },
  { name: "lastName", label: "Last Name", half: true, autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "message", label: "Message", type: "textarea", required: true },
];
