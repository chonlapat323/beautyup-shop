import type { Locale } from "@/i18n";
import type { Region, Salon } from "./types";

export const PROVINCE_EN: Record<string, string> = {
  // Bangkok & Central
  กรุงเทพมหานคร: "Bangkok",
  กำแพงเพชร: "Kamphaeng Phet",
  ชัยนาท: "Chai Nat",
  นครนายก: "Nakhon Nayok",
  นครปฐม: "Nakhon Pathom",
  นครสวรรค์: "Nakhon Sawan",
  นนทบุรี: "Nonthaburi",
  ปทุมธานี: "Pathum Thani",
  พระนครศรีอยุธยา: "Phra Nakhon Si Ayutthaya",
  พิจิตร: "Phichit",
  พิษณุโลก: "Phitsanulok",
  เพชรบูรณ์: "Phetchabun",
  ลพบุรี: "Lop Buri",
  สมุทรปราการ: "Samut Prakan",
  สมุทรสงคราม: "Samut Songkhram",
  สมุทรสาคร: "Samut Sakhon",
  สิงห์บุรี: "Sing Buri",
  สุโขทัย: "Sukhothai",
  สุพรรณบุรี: "Suphan Buri",
  สระบุรี: "Saraburi",
  อ่างทอง: "Ang Thong",
  อุทัยธานี: "Uthai Thani",

  // East
  จันทบุรี: "Chanthaburi",
  ฉะเชิงเทรา: "Chachoengsao",
  ชลบุรี: "Chon Buri",
  ตราด: "Trat",
  ปราจีนบุรี: "Prachin Buri",
  ระยอง: "Rayong",
  สระแก้ว: "Sa Kaeo",

  // West
  กาญจนบุรี: "Kanchanaburi",
  ตาก: "Tak",
  ประจวบคีรีขันธ์: "Prachuap Khiri Khan",
  เพชรบุรี: "Phetchaburi",
  ราชบุรี: "Ratchaburi",

  // North
  เชียงใหม่: "Chiang Mai",
  เชียงราย: "Chiang Rai",
  น่าน: "Nan",
  พะเยา: "Phayao",
  แพร่: "Phrae",
  แม่ฮ่องสอน: "Mae Hong Son",
  ลำปาง: "Lampang",
  ลำพูน: "Lamphun",
  อุตรดิตถ์: "Uttaradit",

  // South
  กระบี่: "Krabi",
  ชุมพร: "Chumphon",
  ตรัง: "Trang",
  นครศรีธรรมราช: "Nakhon Si Thammarat",
  นราธิวาส: "Narathiwat",
  ปัตตานี: "Pattani",
  พังงา: "Phang Nga",
  พัทลุง: "Phatthalung",
  ภูเก็ต: "Phuket",
  ยะลา: "Yala",
  ระนอง: "Ranong",
  สงขลา: "Songkhla",
  สตูล: "Satun",
  สุราษฎร์ธานี: "Surat Thani",

  // Northeast
  กาฬสินธุ์: "Kalasin",
  ขอนแก่น: "Khon Kaen",
  ชัยภูมิ: "Chaiyaphum",
  นครพนม: "Nakhon Phanom",
  นครราชสีมา: "Nakhon Ratchasima",
  บึงกาฬ: "Bueng Kan",
  บุรีรัมย์: "Buri Ram",
  มหาสารคาม: "Maha Sarakham",
  มุกดาหาร: "Mukdahan",
  ยโสธร: "Yasothon",
  ร้อยเอ็ด: "Roi Et",
  เลย: "Loei",
  สกลนคร: "Sakon Nakhon",
  สุรินทร์: "Surin",
  ศรีสะเกษ: "Si Sa Ket",
  หนองคาย: "Nong Khai",
  หนองบัวลำภู: "Nong Bua Lam Phu",
  อุดรธานี: "Udon Thani",
  อุบลราชธานี: "Ubon Ratchathani",
  อำนาจเจริญ: "Amnat Charoen",
};

export const REGION_SALON_COUNTS: Record<Region, number> = {
  BANGKOK_CENTRAL: 0,
  EAST: 0,
  WEST: 0,
  NORTH: 0,
  SOUTH: 0,
  NORTHEAST: 0,
};

export const THAILAND_SALON_DIRECTORY: Salon[] = [];

export function getThailandSalons(_lang: Locale): Salon[] {
  return [];
}
