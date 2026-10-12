export const inquiryTypeLabels: Record<string, string> = {
  CONTACT: "ติดต่อเรา",
  ORDER: "สั่งสินค้า",
  SALON: "สมัครซาลอน",
  COURSE: "ลงทะเบียนเรียน",
  ISSUE: "แจ้งปัญหา",
  PP_STUDIO: "PP STUDIO",
};

export const inquiryStatusLabels: Record<string, string> = {
  NEW: "ใหม่",
  IN_PROGRESS: "กำลังดำเนินการ",
  DONE: "เสร็จแล้ว",
};

export const statusStyle: Record<string, string> = {
  NEW: "bg-brand-soft text-brand",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  DONE: "bg-emerald-50 text-emerald-700",
};

export interface Inquiry {
  id: string;
  type: string;
  status: string;
  name: string;
  phone: string;
  email: string;
  shopName: string;
  province: string;
  message: string;
  data: Record<string, unknown>;
  note: string;
  createdAt: string;
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
