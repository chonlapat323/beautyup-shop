"use server";

import type { InquiryType } from "@/lib/types";

export interface InquiryState {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<string, string>>;
}

const types: InquiryType[] = ["CONTACT", "ORDER", "SALON", "COURSE", "ISSUE", "PP_STUDIO"];

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const type = get("type") as InquiryType;
  const required = (formData.get("required") as string | null)?.split(",") ?? [];

  const errors: Record<string, string> = {};
  for (const field of required) {
    if (!get(field)) errors[field] = "กรุณากรอกข้อมูล";
  }
  const email = get("email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }
  if (!types.includes(type)) errors.type = "ประเภทไม่ถูกต้อง";

  if (Object.keys(errors).length) {
    return { ok: false, errors, message: "กรุณาตรวจสอบข้อมูลอีกครั้ง" };
  }

  // MOCK: will POST to apps/api /inquiries
  console.log("[inquiry]", Object.fromEntries(formData));

  return { ok: true, message: "ได้รับข้อมูลเรียบร้อย ขอบคุณสำหรับข้อมูล!" };
}
