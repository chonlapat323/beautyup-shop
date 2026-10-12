// Mock content taken from the current Wix site (beautyup-enterprise.com).
// Items marked MOCK are placeholders and must be replaced with real data.
import type {
  Ambassador,
  Brand,
  CompanyInfo,
  Course,
  HeroSlide,
  MenuItem,
  Post,
  Product,
  Salon,
  TeamMember,
  Video,
} from "./types";

export const menu: MenuItem[] = [
  { label: "หน้าหลัก", href: "/" },
  { label: "เกี่ยวกับเรา", href: "/about" },
  {
    label: "ลูกค้า",
    href: "/customers",
    children: [
      { label: "แบรนด์แอมบาสเดอร์", href: "/customers" },
      { label: "ค้นหาซาลอน", href: "/customers/salons" },
    ],
  },
  {
    label: "ผลิตภัณฑ์ผม",
    href: "/products",
    children: [
      { label: "Fanola (ฟาโนลา)", href: "/products/fanola" },
      { label: "Nook (นุก)", href: "/products/nook" },
      { label: "Sweet. (สวีท)", href: "/products/sweet-professional" },
    ],
  },
  { label: "ร้านบิวตี้อัพ", href: "/shop" },
  { label: "คอร์สเรียน", href: "/courses" },
  {
    label: "ติดต่อเรา",
    href: "/contact",
    children: [
      { label: "บิวตี้อัพ ทีม", href: "/contact/team" },
      { label: "เทคนิคเชี่ยน", href: "/contact/team#technician" },
      { label: "สมัครซาลอน", href: "/contact/salon-partner" },
      { label: "การชำระเงิน", href: "/contact/payment" },
      { label: "นโยบายการจำหน่ายและชำระเงิน", href: "/policy" },
      { label: "แจ้งปัญหา", href: "/contact/report" },
      { label: "PP STUDIO", href: "/pp-studio" },
    ],
  },
  {
    label: "มุมสมาชิก",
    href: "/members",
    children: [
      { label: "กิจกรรม", href: "/members/activities" },
      { label: "มีเดีย", href: "/members/media" },
      { label: "บทความ", href: "/members/articles" },
    ],
  },
];

export const company: CompanyInfo = {
  name: "บริษัท บิวตี้อัพ เอ็นเตอร์ไพร์ส จำกัด",
  nameEn: "BeautyUp Enterprise Co., Ltd.",
  address: "14/3-4 ถนนสุเรนทร์ ตำบลสบตุ๋ย อำเภอเมือง จังหวัดลำปาง 52100",
  phones: ["054-218-016", "054-221-360"],
  email: "beautyup.enterprise@gmail.com",
  taxId: "0135558007001",
  mapUrl: "https://maps.google.com/?q=BeautyUp+Enterprise+Lampang",
  facebookGroup: "https://www.facebook.com/groups/582427686617116",
  departments: [
    { name: "ฝ่ายการเงินและบัญชี", phone: "063-779-2433" },
    { name: "ฝ่ายกฎหมาย", phone: "063-779-2433" },
  ],
  // MOCK: replace with the real bank accounts
  bankAccounts: [
    { bank: "ธนาคารกสิกรไทย", accountName: "บจก. บิวตี้อัพ เอ็นเตอร์ไพร์ส", accountNo: "xxx-x-xxxxx-x" },
    { bank: "ธนาคารไทยพาณิชย์", accountName: "บจก. บิวตี้อัพ เอ็นเตอร์ไพร์ส", accountNo: "xxx-x-xxxxx-x" },
  ],
};

// MOCK: add transparent product cut-outs via imageUrl
export const heroSlides: HeroSlide[] = [
  { brandSlug: "fanola", brand: "Fanola", product: "No Yellow Shampoo", caption: "แชมพูม่วงอันดับหนึ่งของช่างผม", href: "/products/fanola", tint: "#6d4c9f" },
  { brandSlug: "nook", brand: "Nook", product: "Magic Arganoil", caption: "Eco-conscious beauty จากอิตาลี", href: "/products/nook", tint: "#5f7d5a" },
  { brandSlug: "sweet-professional", brand: "Sweet Professional", product: "The First Shampoo", caption: "ทรีตเมนต์ยืดผมจากบราซิล", href: "/products/sweet-professional", tint: "#b08a4e" },
];

export const videos: Video[] = [
  { title: "20 YEARS OF FANOLA - Official Campaign" },
  { title: "Treatment SOS Keratinization" },
  { title: "FANOLA NO-YELLOW SHAMPOO" },
  { title: "Fanola No Yellow Incredible Foam" },
];

export const brands: Brand[] = [
  {
    slug: "fanola",
    type: "SALON",
    name: "Fanola",
    nameTh: "ฟาโนลา",
    country: "อิตาลี",
    tagline: "ปลดปล่อยความคิดสร้างสรรค์และความเป็นที่สุดของคุณ!",
    description: "ผลิตภัณฑ์นำเข้าจากอิตาลีสำหรับร้านเสริมสวยและช่างผมมืออาชีพ",
    highlights: ["Fashion precision", "Creative thinking", "ปกป้องและฟื้นฟู", "หนังศีรษะสุขภาพดี", "Vegan"],
    website: "https://www.fanola.it/fa_en/",
    socials: { facebook: "#", instagram: "#", tiktok: "#", youtube: "https://www.youtube.com/@FanolaOfficial" },
  },
  {
    slug: "nook",
    type: "SALON",
    name: "Nook",
    nameTh: "นุก",
    country: "อิตาลี",
    tagline: "Eco-conscious beauty",
    description: "แรงบันดาลใจจากความเรียบง่าย ความสวยงาม ความกลมกลืนและสมดุลของธรรมชาติ",
    highlights: ["Eco-conscious", "Natural balance", "Salon professional"],
    website: "http://nookcosmetics.it/company/?lang=en",
    socials: { facebook: "#", instagram: "#", tiktok: "#", youtube: "#" },
  },
  {
    slug: "sweet-professional",
    type: "SALON",
    name: "Sweet Professional",
    nameTh: "สวีท โพรเฟสชันนัล",
    country: "บราซิล",
    tagline: "More than a brand",
    description: "ไลฟ์สไตล์ใหม่ เป็นมากกว่าแบรนด์ โอกาสไล่ตามความฝันของคุณในจักรวาลแห่งความงาม",
    highlights: ["ทรีตเมนต์ยืดผม", "Brazilian technology", "Lifestyle brand"],
    website: "https://sweethairprofessional.com/",
    socials: { facebook: "#", instagram: "#", tiktok: "#", youtube: "#" },
  },
  ...[
    "La Prairie",
    "La Mer",
    "Clarins",
    "Jo Malone",
    "Kiehl's",
    "Givenchy",
    "Guerlain",
    "Jung Saem Mool",
    "Laura Mercier",
    "Dior",
    "Sulwhasoo",
    "Estée Lauder",
    "Tom Ford",
    "Sisley",
  ].map(
    (name): Brand => ({
      slug: name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      type: "COUNTER",
      name,
    }),
  ),
];

export const products: Product[] = [
  { slug: "skin-caviar-harmony-lextrait", name: "Skin Caviar Harmony L'Extrait", brandSlug: "la-prairie", price: 30500, salePrice: 21350, badges: ["New"] },
  { slug: "la-prairie-caviar-set", name: "La Prairie Caviar Set", brandSlug: "la-prairie", price: 78000, salePrice: 54600 },
  { slug: "no-red-set-100ml", name: "No Red Set 100ml (Shampoo & Mask)", brandSlug: "fanola", price: 1080, badges: ["New"] },
  { slug: "no-red-mask-350ml", name: "No Red Mask 350ml", brandSlug: "fanola", price: 1390, badges: ["New"] },
  { slug: "no-red-mask-1000ml", name: "No Red Mask 1,000ml", brandSlug: "fanola", price: 2590, badges: ["New"] },
  { slug: "no-red-shampoo-350ml", name: "No Red Shampoo 350ml", brandSlug: "fanola", price: 1168, badges: ["New"] },
  { slug: "blue-foam-no-orange-250ml", name: "Blue Foam No Orange 250ml", brandSlug: "fanola", price: 2250, badges: ["New"] },
  { slug: "no-orange-mask-350ml", name: "No Orange Mask 350ml", brandSlug: "fanola", price: 1390, badges: ["Hot"] },
  { slug: "no-orange-mask-1000ml", name: "No Orange Mask 1,000ml", brandSlug: "fanola", price: 2590, badges: ["Hot"] },
  { slug: "no-orange-shampoo-350ml", name: "No Orange Shampoo 350ml", brandSlug: "fanola", price: 1168, badges: ["Hot"] },
  { slug: "no-orange-shampoo-1000ml", name: "No Orange Shampoo 1,000ml", brandSlug: "fanola", price: 1950, badges: ["Hot"] },
  { slug: "nutri-care-shampoo-1000ml", name: "Nutri Care Shampoo 1,000ml", brandSlug: "fanola", price: 1850, badges: ["Soft hair"] },
  { slug: "shield-protective-mist-100ml", name: "Shield Protective Mist 100ml", brandSlug: "fanola", price: 1590 },
  { slug: "2-phase-potion-leave-in-150ml", name: "2-Phase Potion Leave In Conditioner 150ml", brandSlug: "fanola", price: 1290 },
  { slug: "thermo-protective-cream-150ml", name: "Thermo-Protective Cream 150ml", brandSlug: "fanola", price: 1650 },
];

// MOCK: photos and socials to be filled in
export const ambassadors: Ambassador[] = [
  { name: "CHERRY", title: "Cherry Hair Style Founder", socials: { instagram: "#", facebook: "#", tiktok: "#", youtube: "#" } },
  { name: "TEMEE", title: "Chick Hair Salon Founder", socials: { instagram: "#", facebook: "#", tiktok: "#", youtube: "#" } },
  { name: "NOK", title: "Shampoo Salon Founder", socials: { instagram: "#", facebook: "#", tiktok: "#", youtube: "#" } },
  { name: "AUM", title: "The T-Cut Salon Expert", socials: { instagram: "#", facebook: "#", tiktok: "#", youtube: "#" } },
];

export const regionLabels: Record<Salon["region"], string> = {
  BANGKOK_CENTRAL: "กรุงเทพฯ และภาคกลาง",
  EAST: "ภาคตะวันออก",
  WEST: "ภาคตะวันตก",
  NORTH: "ภาคเหนือ",
  SOUTH: "ภาคใต้",
  NORTHEAST: "ภาคตะวันออกเฉียงเหนือ",
};

// Counts shown on the current site, until the real salon list is migrated
export const regionCounts: Record<Salon["region"], number> = {
  BANGKOK_CENTRAL: 391,
  EAST: 24,
  WEST: 16,
  NORTH: 66,
  SOUTH: 89,
  NORTHEAST: 46,
};

// MOCK: sample salons
export const salons: Salon[] = [
  { name: "ร้านตัวอย่าง สยาม", region: "BANGKOK_CENTRAL", province: "กรุงเทพมหานคร", phone: "02-000-0000" },
  { name: "ร้านตัวอย่าง อารีย์", region: "BANGKOK_CENTRAL", province: "กรุงเทพมหานคร", phone: "02-000-0000" },
  { name: "ร้านตัวอย่าง นนทบุรี", region: "BANGKOK_CENTRAL", province: "นนทบุรี", phone: "02-000-0000" },
  { name: "ร้านตัวอย่าง ชลบุรี", region: "EAST", province: "ชลบุรี", phone: "038-000-000" },
  { name: "ร้านตัวอย่าง ราชบุรี", region: "WEST", province: "ราชบุรี", phone: "032-000-000" },
  { name: "ร้านตัวอย่าง ลำปาง", region: "NORTH", province: "ลำปาง", phone: "054-000-000" },
  { name: "ร้านตัวอย่าง เชียงใหม่", region: "NORTH", province: "เชียงใหม่", phone: "053-000-000" },
  { name: "ร้านตัวอย่าง ภูเก็ต", region: "SOUTH", province: "ภูเก็ต", phone: "076-000-000" },
  { name: "ร้านตัวอย่าง หาดใหญ่", region: "SOUTH", province: "สงขลา", phone: "074-000-000" },
  { name: "ร้านตัวอย่าง ขอนแก่น", region: "NORTHEAST", province: "ขอนแก่น", phone: "043-000-000" },
];

export const courses: Course[] = [
  {
    slug: "europe-study-tour",
    title: "เรียนทำผมเทคนิคขั้นสูง ดูงานยุโรป 6 ประเทศ 14 วัน",
    priceText: "1xx,xxx ฿",
    duration: "17 วัน",
    summary: "เรียนเทคนิคขั้นสูงพร้อมดูงานโรงงานผู้ผลิตในยุโรป นำทีมโดยคุณเอมี่",
    content: [
      "เรียนรู้เทคนิคการตัด ทำสี ดัด และยืดผมขั้นสูงจากผู้เชี่ยวชาญระดับสากล",
      "ดูงานโรงงานและแบรนด์ผู้ผลิตผลิตภัณฑ์ซาลอนในยุโรป",
      "สร้างเครือข่ายกับช่างผมมืออาชีพจากทั่วโลก",
    ],
  },
  {
    slug: "private-advanced-class",
    title: "เรียนทำผมเทคนิคขั้นสูง ตัวต่อตัวและกลุ่มย่อย (1-5 ท่าน)",
    priceText: "49,900 ฿",
    duration: "3 วัน",
    summary: "เรียนแบบตัวต่อตัวหรือกลุ่มเล็ก เน้นเทคนิคที่สร้างรายได้สูงจากลูกค้า VIP",
    content: [
      "ออกแบบหลักสูตรตามระดับและเป้าหมายของผู้เรียน",
      "ฝึกปฏิบัติจริงกับนางแบบ พร้อมผู้สอนดูแลใกล้ชิด",
      "แก้ปัญหาเส้นผมที่พบบ่อยในร้าน และเทคนิคการให้คำปรึกษาลูกค้า",
    ],
  },
];

// MOCK: sample posts
export const posts: Post[] = [
  {
    slug: "cosmoprof-bologna",
    type: "ACTIVITY",
    title: "ทีมบิวตี้อัพร่วมงาน COSMOPROF Bologna",
    excerpt: "อัปเดตเทรนด์ผลิตภัณฑ์ความงามและเทคนิคใหม่จากงานแสดงสินค้าความงามที่ใหญ่ที่สุดในโลก",
    body: ["เนื้อหาตัวอย่าง (mock) สำหรับกิจกรรม"],
    publishedAt: "2026-03-20",
  },
  {
    slug: "fanola-workshop-lampang",
    type: "ACTIVITY",
    title: "Fanola Workshop ลำปาง",
    excerpt: "เวิร์กช็อปเทคนิคการใช้ No Yellow สำหรับช่างผมภาคเหนือ",
    body: ["เนื้อหาตัวอย่าง (mock) สำหรับกิจกรรม"],
    publishedAt: "2026-05-02",
  },
  {
    slug: "20-years-of-fanola",
    type: "MEDIA",
    title: "20 Years of Fanola - Official Campaign",
    excerpt: "ฉลอง 20 ปีของ Fanola กับแคมเปญระดับโลก",
    body: ["เนื้อหาตัวอย่าง (mock) สำหรับมีเดีย"],
    publishedAt: "2026-01-15",
  },
  {
    slug: "how-to-use-purple-shampoo",
    type: "ARTICLE",
    title: "แชมพูม่วงใช้อย่างไรให้ผมไม่เหลือง",
    excerpt: "เคล็ดลับการใช้ No Yellow Shampoo ให้ได้สีผมเทาหม่นสวยนานขึ้น",
    body: [
      "แชมพูม่วงช่วยลบเม็ดสีเหลืองที่เกิดขึ้นหลังการฟอกผม",
      "ควรใช้ 1-2 ครั้งต่อสัปดาห์ และทิ้งไว้ 3-5 นาทีก่อนล้างออก",
    ],
    publishedAt: "2026-06-10",
  },
  {
    slug: "brazilian-straightening",
    type: "ARTICLE",
    title: "ยืดผมสไตล์บราซิลต่างจากยืดทั่วไปอย่างไร",
    excerpt: "ทำความรู้จักทรีตเมนต์ยืดผมจาก Sweet Professional",
    body: ["เนื้อหาตัวอย่าง (mock) สำหรับบทความ"],
    publishedAt: "2026-07-22",
  },
];

// MOCK: placeholder team members
export const team: TeamMember[] = [
  { name: "พนักงานขาย 1", position: "ผู้แทนขาย ภาคเหนือ", department: "SALES", phone: "08x-xxx-xxxx", lineId: "@beautyup" },
  { name: "พนักงานขาย 2", position: "ผู้แทนขาย กรุงเทพฯ", department: "SALES", phone: "08x-xxx-xxxx", lineId: "@beautyup" },
  { name: "พนักงานขาย 3", position: "ผู้แทนขาย ภาคใต้", department: "SALES", phone: "08x-xxx-xxxx", lineId: "@beautyup" },
  { name: "เทคนิคเชี่ยน 1", position: "Fanola Technician", department: "TECHNICIAN", phone: "08x-xxx-xxxx" },
  { name: "เทคนิคเชี่ยน 2", position: "Sweet Technician", department: "TECHNICIAN", phone: "08x-xxx-xxxx" },
];

export const timeline = [
  { year: "2556", text: "ก่อตั้งร้านบิวตี้อัพ" },
  { year: "2557", text: "จดทะเบียนบริษัท และนำเข้าผลิตภัณฑ์ Nook จากอิตาลี" },
  { year: "2558", text: "นำเข้าผลิตภัณฑ์ Fanola จากอิตาลี" },
  { year: "2565", text: "เพิ่มไลน์ Heona จากเกาหลี และ Sweet Professional จากบราซิล" },
];

export const ppStudioServices = [
  { title: "Video Shooting", text: "ถ่ายวีดิโอ งานพิธี งานประชุมสัมมนา การสัมภาษณ์ กิจกรรม งานเปิดตัว ถ่ายทอดสดและการตัดต่อ" },
  { title: "Mood & Tone", text: "ถ่ายภาพสินค้า ผลิตภัณฑ์ จัดพร็อพ วางคอนเซ็ปท์ให้เข้ากับสินค้า เพื่อเพิ่มมูลค่าให้กับสินค้า" },
  { title: "Video Editing", text: "ตัดต่อวีดิโอ การสัมภาษณ์ โฆษณา การประชาสัมพันธ์ และการรณรงค์ต่าง ๆ" },
  { title: "Real estate photo editing", text: "ตกแต่งภาพ บ้าน อาคาร สถานที่ ในเชิงพาณิชย์" },
  { title: "Packshot", text: "ถ่ายภาพสินค้า ผลิตภัณฑ์ งานแคตตาล็อกและงานกราฟิก ด้วยกล้อง DSLR และการจัดแสงในสตูดิโอ" },
  { title: "Event & Travel", text: "จัดกิจกรรม งานสัมมนา ทริปท่องเที่ยวทั้งในและต่างประเทศ" },
];

export const provinces = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา",
  "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
  "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน",
  "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา",
  "พะเยา", "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต",
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี",
  "ลพบุรี", "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี",
  "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี",
  "อุบลราชธานี",
];
