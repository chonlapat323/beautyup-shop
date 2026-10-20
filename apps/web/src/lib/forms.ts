import type { FormField } from "@/components/inquiry-form";
import { provinces } from "./provinces";

// `label` is a key of dict.form.fields so forms render in the page language.

export const salonPartnerFields: FormField[] = [
  { name: "name", label: "name", required: true, half: true, autoComplete: "name" },
  { name: "phone", label: "phone", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "email", type: "email", required: true, half: true, autoComplete: "email" },
  { name: "shopName", label: "shopName", required: true, half: true, autoComplete: "organization" },
  { name: "province", label: "province", type: "select", options: provinces, required: true },
  { name: "message", label: "message", type: "textarea", required: true },
];

export const contactFields: FormField[] = [
  { name: "name", label: "name", required: true, half: true, autoComplete: "name" },
  { name: "phone", label: "phone", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "email", type: "email", autoComplete: "email" },
  { name: "message", label: "message", type: "textarea", required: true },
];

export const issueFields: FormField[] = [
  { name: "name", label: "name", required: true, half: true, autoComplete: "name" },
  { name: "phone", label: "phone", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "email", type: "email", autoComplete: "email" },
  { name: "orderRef", label: "orderRef" },
  { name: "message", label: "issue", type: "textarea", required: true },
];
