# Site Menu & Page Inventory (from current Wix site)

Source: https://www.beautyup-enterprise.com (reviewed 2026-10-12).
Used to plan the new storefront navigation and the Admin Panel.

> Content was read from the public pages only. Anything behind login (มุมสมาชิก) and
> anything rendered only by scripts may be missing. Items marked **❓** need confirmation.

## Header menu

| # | Menu | Sub-menu | Current URL |
|---|---|---|---|
| 1 | หน้าหลัก | – | `/` |
| 2 | เกี่ยวกับเรา | – | `/about-fanola-heona-thailand-by-beautyup` |
| 3 | ลูกค้า | ค้นหาซาลอน | `/brandambassador` |
| 4 | ผลิตภัณฑ์ผม | Fanola (ฟาโนลา), Nook (นุก), Sweet. (สวีท) | `/fanola-heona-sweet-thailand` |
| 5 | ร้านบิวตี้อัพ | – | `/shop-laprairie-lamer-clarins-tomford-jomalone` |
| 6 | คอร์สเรียน | – | `/courses-1` |
| 7 | ติดต่อเรา | บิวตี้อัพ ทีม, เทคนิคเชี่ยน, สมัครซาลอน, การชำระเงิน, นโยบายการจำหน่ายและชำระเงิน, แจ้งปัญหา | `/fanola-heona-nook-sweet-thailand-team` |
| 8 | มุมสมาชิก | กิจกรรม, มีเดีย, บทความ | `/members` |

Header also has a **search** icon and a **เข้าสู่ระบบ (login)** button.

Other URLs seen in links (keep for 301 redirects):
`/team-contact`, `/order-salon-partner`, `/fanola-thailand`, `/nook-thailand`, `/sweet-professional`,
`/media`, `/blog`, `/policy`, finding-salon page.

## Pages

### 1. หน้าหลัก `/`
- Hero slider (Fanola, No Yellow shampoo, COSMOPROF)
- Video gallery (YouTube): 20 Years of Fanola, Treatment SOS, No-Yellow Shampoo, Incredible Foam
- Welcome + CEO quote (Amy) + quick links: ทีมงาน, เกี่ยวกับเรา, สมัครซาลอน, แบรนด์แอมบาสเดอร์, คลาสเรียน & ดูงานต่างประเทศ
- "ผลิตภัณฑ์นำเข้าของเรา": 3 brand cards (Fanola 🇮🇹, Nook 🇮🇹, Sweet Professional 🇧🇷)
- "BeautyUp Essential Product": product grid with brand filter, price/sale price, badges (New / Hot / Soft hair), quick view, pagination
- CTA: ลูกค้า, สั่งสินค้า, ทีมบิวตี้อัพ, Facebook group "โปรโมทร้านทำผมฟรี"

### 2. เกี่ยวกับเรา
- Company intro (founded 2556, wholesale center for Lampang and the North)
- Large image gallery (50+ images)
- Founder profile (Amy Phorlaphat): education, **company timeline** (2556 → 2565), social links
- Links to courses, media, blog

### 3. ลูกค้า (Brand Ambassador) `/brandambassador`
- Hero "Our VIP Customer" + quote
- **Ambassador cards**: name, salon, photo, IG/FB/TikTok/YouTube (CHERRY, TEMEE, NOK, AUM, "YOU")
- **Salon directory** by region with counts: กรุงเทพ/กลาง 391, ตะวันออก 24, ตะวันตก 16, เหนือ 66, ใต้ 89, อีสาน 46, linking to the **ค้นหาซาลอน** page

### 4. ผลิตภัณฑ์ผม
- Hero "เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ" + product slider
- One section per **brand** (Fanola, Nook, Sweet): description, social links, buttons **ชมสินค้า** and **แคตตาล็อก** (catalog file ❓)
- Each brand has its own page (`/fanola-thailand`, `/nook-thailand`, `/sweet-professional`)
- No prices or cart on this page; it works as a catalog

### 5. ร้านบิวตี้อัพ (Counter brands)
- "Our Counter Brand": 14 luxury brand logos (La Prairie, La Mer, Clarins, Jo Malone, Kiehl's, Givenchy, Guerlain, Jung Saem Mool, Laura Mercier, Dior, Sulwhasoo, Estée Lauder, Tom Ford, Sisley)
- CEO image slider
- Product grid: brand filter, price range filter, sale price, badges, quick view
- Has some **test products** (`Jo Malone Test ฿99,999`) that should not be migrated
- Display only. To buy, customers contact the shop (see Decisions)

### 6. คอร์สเรียน
- Hero + course description
- **Course cards**: title, price, duration, short description, "อ่านต่อ" link
  - เรียนทำผมเทคนิคขั้นสูง ดูงานยุโรป 6 ประเทศ (1xx,xxx ฿, 17 วัน)
  - เรียนทำผมเทคนิคขั้นสูง ตัวต่อตัว/กลุ่มย่อย 1–5 ท่าน (49,900 ฿, 3 วัน)
- Gallery "บรรยากาศ การเรียน การสอน การดูงาน" (22 images)
- No online booking. To sign up, people contact the shop (see Decisions)

### 7. ติดต่อเรา
- Quick buttons: สมัครซาลอน, เลขบัญชีโอนเงิน, ติดต่อทีมงาน, แจ้งปัญหา
- Company info: address, phones, email, Google Map, Tax ID
- Department contacts (การเงิน/บัญชี, กฎหมาย)
- **Contact form** with a success message
- Inquiry topics (product, promotion, course schedule, study trips, jobs)
- Sub-pages: บิวตี้อัพ ทีม, เทคนิคเชี่ยน, สมัครซาลอน (`/order-salon-partner`), การชำระเงิน, นโยบายฯ (`/policy`), แจ้งปัญหา

#### สมัครซาลอน `/order-salon-partner`
One form for **"สั่งสินค้า & สมัครร้านซาลอน & ลงทะเบียนเรียน"**:
"กรุณากรอกรายละเอียดและกดปุ่มส่ง เราจะติดต่อกลับท่านโดยเร็วที่สุด"

| Field | Type | Required |
|---|---|---|
| ชื่อ - สกุล | text | ✔ |
| เบอร์โทรศัพท์ | text | ✔ |
| อีเมล | email | ✔ |
| ชื่อร้าน | text | ✔ |
| จังหวัด | dropdown (77 provinces) | ✔ |
| ข้อความ | textarea | ✔ |

Submit "ส่ง" → "ได้รับข้อมูลเรียบร้อย ขอบคุณสำหรับข้อมูล !"

### 8. มุมสมาชิก
- Members can log in, but login gives no extra benefits yet (we only store member data)
- Sub-pages: กิจกรรม, มีเดีย (`/media`), บทความ (`/blog`)

### Shared footer (every page)
Nav links, brand logos (Nook, Fanola, Sweet), company address, phones, email, policy link,
©2565 บริษัท บิวตี้อัพ เอ็นเตอร์ไพร์ส จำกัด. "Grow Your Vision" CTA block appears on many pages.

## Proposed Admin Panel modules

| Module | Covers | Main data |
|---|---|---|
| **Menu** | Header and footer nav | `MenuItem` (2 levels, ordering, show/hide) ✅ already in schema |
| **Banners / Sliders** | Hero sliders on every page | Banner (page, image, link, order) |
| **Brands** | Fanola, Nook, Sweet, and 14 counter brands | Brand (name, logo, country, description, socials, catalog file, type: salon/counter) |
| **Products** | Product grids, filters, quick view | Product + Variant + Images; add `brandId`, `badges`, `compareAtPrice` |
| **Ambassadors** | ลูกค้า page cards | Ambassador (name, salon, photo, socials, order) |
| **Salon directory** | ค้นหาซาลอน, region counts | Salon (name, region, province, address, map, phone) |
| **Courses** | คอร์สเรียน | Course (title, price text, duration, content, gallery). Sign-ups come in through Inquiry |
| **Content (CMS)** | บทความ, กิจกรรม, มีเดีย, เกี่ยวกับเรา, นโยบาย, การชำระเงิน | Post (type: article/activity/media, cover, body, publishedAt) + Page (slug, body) |
| **Videos / Galleries** | Video gallery, image galleries | Gallery, GalleryItem (image or YouTube URL) |
| **Team** | บิวตี้อัพ ทีม, เทคนิคเชี่ยน, department contacts | TeamMember (name, role, department, phone, LINE, photo) |
| **Inquiries inbox** | ติดต่อเรา, สั่งสินค้า, สมัครซาลอน, ลงทะเบียนเรียน, แจ้งปัญหา | Inquiry (type, status NEW/IN_PROGRESS/DONE, contact fields, staff note) |
| **Site settings** | Footer info, bank accounts, socials | Settings (key/value) |
| **Members / Users** | Login, member list, admin roles | `User` + roles (CUSTOMER / STAFF / ADMIN) |

## Decisions (2026-10-12)

1. **No online selling yet.** Products are display only, with price and quick view. To buy, customers contact the shop
   ("สั่งสินค้า" sends an Inquiry with type ORDER, or they call/LINE). No cart, checkout or Order tables for now.
2. **Members:** login stores member data only. No member prices or member-only content yet.
3. **Courses:** no online booking. Sign-up is a contact or Inquiry with type COURSE.
4. **Salon application:** done through the `/order-salon-partner` form (Inquiry with type SALON). Staff review it and
   add the salon to the directory.

## Open questions

- **เทคนิคเชี่ยน / บิวตี้อัพ ทีม:** same content as the team list, or separate pages?
- **Salon directory data:** where is the current list (Wix CMS)? We need it for migration.
- **Search:** products only, or the whole site?
- **Notifications:** when a new Inquiry arrives, notify staff by email or LINE?
