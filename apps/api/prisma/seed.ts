// Seeds the database with the current site content (from the Wix site) and a first admin.
// Safe to re-run: content is upserted by slug/key; tables without slugs are only
// filled when empty.
//   pnpm --filter @beautyup/api db:seed
import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const L = (th: string, en = '') => ({ th, en });
const lines = (...pairs: [string, string][]) => L(pairs.map((p) => p[0]).join('\n'), pairs.map((p) => p[1]).join('\n'));

async function main() {
  await seedAdmin();
  await seedSettings();
  const brandIds = await seedBrands();
  await seedProducts(brandIds);
  await syncHeroSlides();
  await fillIfEmpty('video', videos);
  await fillIfEmpty('ambassador', ambassadors);
  await fillIfEmpty('salon', salons);
  await fillIfEmpty('teamMember', team);
  await seedMenu();
  for (const c of courses) await prisma.course.upsert({ where: { slug: c.slug }, create: c, update: {} });
  for (const p of posts) await prisma.post.upsert({ where: { slug: p.slug }, create: p, update: {} });
  for (const p of pages) await prisma.page.upsert({ where: { slug: p.slug }, create: p, update: {} });
  console.log('Seed complete.');
}

/* ---------------------------------------------------------------- admin */

async function seedAdmin() {
  if (await prisma.user.count()) return;
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@beautyup.local').toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || randomBytes(9).toString('base64url');
  await prisma.user.create({
    data: { email, name: 'Administrator', role: 'ADMIN', passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`\nCreated admin account\n  email:    ${email}\n  password: ${password}\n  (change it after the first login)\n`);
}

/* ------------------------------------------------------------- settings */

async function seedSettings() {
  const settings: Record<string, unknown> = {
    company: {
      name: L('บริษัท บิวตี้อัพ เอ็นเตอร์ไพร์ส จำกัด', 'BeautyUp Enterprise Co., Ltd.'),
      address: L(
        '14/3-4 ถนนสุเรนทร์ ตำบลสบตุ๋ย อำเภอเมือง จังหวัดลำปาง 52100',
        '14/3-4 Surain Road, Sop Tui, Mueang Lampang, Lampang 52100, Thailand',
      ),
      phones: ['054-218-016', '054-221-360'],
      email: 'beautyup.enterprise@gmail.com',
      taxId: '0135558007001',
      mapUrl: 'https://maps.google.com/?q=BeautyUp+Enterprise+Lampang',
      facebookGroup: 'https://www.facebook.com/groups/582427686617116',
      departments: [
        { name: L('ฝ่ายการเงินและบัญชี', 'Finance & Accounting'), phone: '063-779-2433' },
        { name: L('ฝ่ายกฎหมาย', 'Legal'), phone: '063-779-2433' },
      ],
      // MOCK: replace with the real bank accounts in Admin > Settings
      bankAccounts: [
        { bank: L('ธนาคารกสิกรไทย', 'Kasikornbank'), accountName: L('บจก. บิวตี้อัพ เอ็นเตอร์ไพร์ส', 'BeautyUp Enterprise Co., Ltd.'), accountNo: 'xxx-x-xxxxx-x' },
        { bank: L('ธนาคารไทยพาณิชย์', 'Siam Commercial Bank'), accountName: L('บจก. บิวตี้อัพ เอ็นเตอร์ไพร์ส', 'BeautyUp Enterprise Co., Ltd.'), accountNo: 'xxx-x-xxxxx-x' },
      ],
    },
    about: {
      eyebrow: L('เกี่ยวกับเรา', 'About Us'),
      headline: L('บริษัท บิวตี้อัพ เอ็นเตอร์ไพร์ส จำกัด (ประเทศไทย)', 'BeautyUp Enterprise Co., Ltd. (Thailand)'),
      lead: L(
        'ก่อตั้งโดย คุณเอมี่ ภรภัทร โสธนไพศาล เมื่อพ.ศ. 2556\nหนึ่งในศูนย์ค้าส่งชั้นนำของลำปางและภาคเหนือ สถานที่ที่ดีที่สุดสำหรับทุกสิ่งเพื่อความงาม\nเรามีสินค้าสำหรับร้านทำผม ร้านเสริมสวย และสินค้าเคาน์เตอร์แบรนด์ น้ำหอม เครื่องสำอางค์ ครีมบำรุง ให้คุณเลือกมากมาย\nสัมผัสประสบการณ์ช็อปปิ้งที่ยอดเยี่ยมด้วยคุณภาพชั้นนำ ในราคาที่ไม่มีใครเทียบได้\nลูกค้าที่แวะมา บิวตี้อัพ ต่างประทับใจในผลิตภัณฑ์ความงามที่หลากหลายของเรา',
        'Founded by Amy Phorlaphat Sothanarphisarn in 2013.\nOne of the leading wholesale beauty distributors in Lampang and Northern Thailand.\nWe offer a comprehensive selection of professional salon products and premium counter brands, fragrances, and skincare.\nExperience superior quality at unmatched wholesale value.',
      ),
      welcomeText: L('เราหวังว่าจะได้ต้อนรับและบริการคุณ...บิวตี้อัพ', 'We look forward to welcoming and serving you... BeautyUp'),
      founderName: L('เอมี่ ภรภัทร โสธนไพศาล', 'Amy Phorlaphat Sothanarphisarn'),
      founderRole: L('CEO & Founder Beauty Up Enterprise Co., Ltd.', 'CEO & Founder Beauty Up Enterprise Co., Ltd.'),
      founderPhoto: '',
      education: L(
        '- โรงเรียนบุญวาทย์วิทยาลัย, เทศบาลนครลำปาง\n- BBA. มหาวิทยาลัยเชียงใหม่\n- MBA. มหาวิทยาลัยโยนก',
        '- Bunyawat Witthayalai School, Lampang\n- B.B.A., Chiang Mai University\n- M.B.A., Yonok University',
      ),
      socials: {
        facebook: 'https://www.facebook.com/pholaphat.sothanarphisarn',
        instagram: 'https://www.instagram.com/pholraphatamy/',
        tiktok: 'https://www.tiktok.com/@pholraphatamysoth',
        youtube: 'https://www.youtube.com/@FanolaOfficial',
      },
      links: [
        { label: L('สินค้าบิวตี้', 'Beauty Products'), href: '/shop' },
        { label: L('สินค้าซาลอน', 'Salon Products'), href: '/products' },
        { label: L('ลูกค้า', 'Customers'), href: '/customers' },
        { label: L('ทีมงาน', 'Our Team'), href: '/contact/team' },
        { label: L('ท่องเที่ยว & ดูงาน', 'Travel & Study Tour'), href: 'https://www.facebook.com/pholaphat.sothanarphisarn' },
        { label: L('คอร์สเรียน & ทริป', 'Courses & Trips'), href: '/courses' },
        { label: L('มีเดีย', 'Media'), href: '/members/media' },
        { label: L('บทความ', 'Articles'), href: '/members/articles' },
        { label: L('โปรโมทร้านทำผมฟรี (กลุ่มชี้เป้าร้านทำผม)', 'Free Salon Promotion'), href: 'https://www.facebook.com/groups/582427686617116' },
      ],
    },
    aboutSlides: [],
    salonHairSlides: {
      heroEyebrow: L('Professional Salon Products', 'Professional Salon Products'),
      heroHeadline: L('เรามอบสิ่งที่ดีที่สุดเพื่อลูกค้าของคุณ', 'Delivering the best for your clients'),
      heroLead: L(
        'ผลิตภัณฑ์ซาลอนมืออาชีพ นำเข้าจากอิตาลีและบราซิล สำหรับร้านเสริมสวยและช่างผมมืออาชีพ',
        'Professional salon-grade products imported from Italy and Brazil, tailored for discerning salons and master stylists.',
      ),
      eyebrow: L('Salon Hair Showcase', 'Salon Hair Showcase'),
      title: L('ผลิตภัณฑ์ซาลอนมืออาชีพ', 'Professional Salon Products'),
      description: L('แรงบันดาลใจและสูตรสีผมระดับซาลอนชั้นนำจากอิตาลีและระดับสากล', 'Inspiration and hair formula by leading master salons'),
      items: [
        {
          imageUrl: '/cards/fanola-1.jpg',
          title: L('Balayage Ash Blonde', 'Balayage Ash Blonde'),
          formula: 'BLEACH & 3% (ORO 20G/20G)',
          description: L('No Yellow Care Protection', 'No Yellow Care Protection'),
          href: '/products/fanola?category=no-yellow-care',
        },
        {
          imageUrl: '/slides/1.jpg',
          title: L('Pure Ice Blonde', 'Pure Ice Blonde'),
          formula: 'VIOLET BLEACH 9 TONES',
          description: L('Anti-Yellow Neutralizing', 'Anti-Yellow Neutralizing'),
          href: '/products/fanola?category=no-yellow-care',
        },
        {
          imageUrl: '/cards/fanola-2.jpg',
          title: L('Cool Smokey Brunette', 'Cool Smokey Brunette'),
          formula: 'BLACK 3% + NO RED MASK',
          description: L('Cool Neutralizing Tone', 'Cool Neutralizing Tone'),
          href: '/products/fanola?category=no-red',
        },
        {
          imageUrl: '/slides/3.jpg',
          title: L('Platinum Silver Balayage', 'Platinum Silver Balayage'),
          formula: 'BLEACH & 6% + SHAMPOO',
          description: L('Extra Violet Pigments', 'Extra Violet Pigments'),
          href: '/products/fanola?category=no-yellow-care',
        },
        {
          imageUrl: '/cards/fanola-3.jpg',
          title: L('Warm Honey Caramel', 'Warm Honey Caramel'),
          formula: 'CHESTNUT BLEACH + 3%',
          description: L('Deep Conditioning Care', 'Deep Conditioning Care'),
          href: '/products/fanola?category=nutri-care',
        },
        {
          imageUrl: '/cards/fanola-4.jpg',
          title: L('Warm Brown Copper', 'Warm Brown Copper'),
          formula: 'WARM BROWN + 3%',
          description: L('Color Keratin Protection', 'Color Keratin Protection'),
          href: '/products/fanola?category=no-orange',
        },
        {
          imageUrl: '/slides/4.jpg',
          title: L('Luxury Gloss Waves', 'Luxury Gloss Waves'),
          formula: 'ORO THERAPY 24K',
          description: L('Argan Oil & Keratin Infusion', 'Argan Oil & Keratin Infusion'),
          href: '/products/fanola?category=oro-therapy',
        },
      ],
    },
    timeline: [
      { year: '2556', text: L('ก่อตั้ง ร้านบิวตี้อัพ จำหน่ายเครื่องสำอางค์เคาน์เตอร์แบรนด์', 'BeautyUp store founded, selling counter-brand cosmetics (2013)') },
      { year: '2557', text: L('จดทะเบียน บริษัท บิวตี้อัพ เอ็นเตอร์ไพร์ส จำกัด นำเข้า Nook (นุ๊ก) ผลิตภัณฑ์ซาลอนจากอิตาลี', 'Registered BeautyUp Enterprise Co., Ltd.; imported Nook salon products from Italy (2014)') },
      { year: '2558', text: L('นำเข้า Fanola (ฟาโนลา) ผลิตภัณฑ์ซาลอนจากอิตาลี', 'Imported Fanola salon products from Italy (2015)') },
      { year: '2565', text: L('นำเข้า Heona (ฮีโอนา) ผลิตภัณฑ์ซาลอนจากเกาหลี และ Sweet Professional (สวีท โพรเฟสชันนัล) ผลิตภัณฑ์ซาลอนจากบราซิล', 'Imported Heona (Korea) and Sweet Professional (Brazil) (2022)') },
    ],
    // Counts from the current site until the full salon list is imported
    regionCounts: { BANGKOK_CENTRAL: 391, EAST: 24, WEST: 16, NORTH: 66, SOUTH: 89, NORTHEAST: 46 },
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({ where: { key }, create: { key, value: value as object }, update: {} });
  }
}

/* --------------------------------------------------------------- brands */

async function seedBrands() {
  const salon = [
    {
      slug: 'fanola', name: 'Fanola', localName: L('ฟาโนลา', 'Fanola'), country: L('อิตาลี', 'Italy'),
      tagline: L('ปลดปล่อยความคิดสร้างสรรค์และความเป็นที่สุดของคุณ!', 'Unleash your creativity and be your very best!'),
      description: L('ผลิตภัณฑ์นำเข้าจากอิตาลีสำหรับร้านเสริมสวยและช่างผมมืออาชีพ', 'Imported from Italy for salons and professional hairdressers'),
      highlights: [L('Fashion precision', 'Fashion precision'), L('Creative thinking', 'Creative thinking'), L('ปกป้องและฟื้นฟู', 'Protect & restore'), L('หนังศีรษะสุขภาพดี', 'Healthy scalp'), L('Vegan', 'Vegan')],
      features: [
        {
          title: L('ผลิตภัณฑ์ดูแลผม', 'Hair Care Products'),
          description: L(
            'การดูแลผมที่มีประสิทธิภาพตั้งแต่เส้นผมรากผมและหนังศีรษะช่วยให้ผมแข็งแรงนุ่มสลวยเงางามมีน้ำหนัก สุขภาพดีตั้งแต่ภายใน ป้องกันการสร้างเม็ดสีแฝง (เหลือง ส้ม แดง) ที่เกิดขึ้นใหม่ตลอดเวลา ผลิตภัณฑ์ฟาโนลามีกลิ่นหอมหรูหราด้วยแรงบันดาลใจจากน้ำหอมชั้นดี ปกป้องเส้นผมจากมลภาวะแสงแดดสารเคมีและความร้อน ทำให้เส้นผมสีสันสวยงามอยู่ทนนานเป็นพิเศษเหมือนออกจากซาลอนทุกวัน',
            'Effective hair care from root to tip and scalp, enhancing strength, silky smoothness, shine, and inner vitality. Prevents unwanted undertones (yellow, orange, red) while shielding hair from heat and pollution.',
          ),
          href: '#fanola-hair-care',
          imageUrl: '',
        },
        {
          title: L('ผลิตภัณฑ์ทำสีผม', 'Hair Color Products'),
          description: L(
            'การทำสีผมที่มีความแตกต่าง มีรายละเอียดสูง เอกลักษณ์โดดเด่น ตอบโจทย์ความคิดสร้างสรรค์ สีทำผม 5 คอลเลคชั่น การทำงานของสีรวดเร็ว เม็ดสีติดแน่นทนนาน ไม่ติดแดงติดส้ม มีสารป้องกันเม็ดสีเหลืองแฝงในเส้นผม ช่วยให้ทำสีได้สวย ตรงใจ สีย้อมผมที่ให้ความเงางามมีระดับปราศจากกลิ่นฉุนไม่พึงประสงค์ ปราศจากแอมโมเนียและสารก่อมะเร็ง มีส่วนผสมพิเศษ อาทิ ทองคำ 24k เคราติน อาร์แกนออยล์',
            'Exceptional hair color with 5 distinctive collections. Fast-acting, rich, long-lasting pigments without brassiness. Ammonia-free, enriched with 24k gold, keratin, and argan oil.',
          ),
          href: '#fanola-salon',
          imageUrl: '',
        },
        {
          title: L('ผลิตภัณฑ์ฟอกสีผม', 'Hair Bleaching Products'),
          description: L(
            'การฟอกสีผม ด้วยความเข้าใจในสภาพเส้นผมและความต้องการที่แตกต่างกัน รองรับการฟอกผมทุกสภาพทุกสไตล์ ด้วยผลิตภัณฑ์ฟอกผม 8 แบบ ตั้งแต่การยกระดับ 9 ระดับ รวดเร็วให้ความสว่างสดใส, ครีมฟอกที่ให้ความนวลกลมกลืน และอ่อนโยนแม้กับเส้นผมอ่อนแอเส้นเล็ก, ผงฟอกแม่ม่วง/แม่น้ำเงิน/แม่เขียว กำจัดเม็ดสีเหลือง/ส้ม/แดง อย่างตรงจุด ทนุถนอมเส้นผมและเพิ่มความชุ่มชื้น ผมไม่แห้ง ผมเงางาม สุขภาพดี',
            'Advanced lightening with 8 formulas lifting up to 9 levels. Gentle bleaching cream for fragile hair, specialized violet/blue/green toning bleaches to neutralize yellow/orange/red undertones.',
          ),
          href: '#fanola-salon',
          imageUrl: '',
        },
        {
          title: L('ผลิตภัณฑ์ยืดดัดผม', 'Perm & Straightening'),
          description: L(
            'การดัดผม ยืดผมด้วยน้ำยาที่มีส่วนผสมพิเศษ อาทิ โปรตีนอัลมอนด์ สูตรปราศจากแอมโมเนีย อ่อนโยนต่อเส้นผม ปลอดภัยต่อสุขภาพในระยะยาว น้ำยาดัดผมกลิ่นอ่อนโยน กลิ่นไม่ฉุน ขั้นตอนการทำงานไม่ยุ่งยาก น้ำยาดัดเย็น และ น้ำยาดัด/ยืดดิจิตอล สามารถดัดผมอ่อนแอและผมแข็งแรงได้อย่างมีประสิทธิภาพ ให้ผลลัพธ์คือ ผมสวยลอนเด้งกระชับ อยู่ทรงนานและผมมีสุขภาพดีเงางาม',
            'Ammonia-free straightening and perming enriched with almond protein. Gentle scent, easy application for cold and digital perm, leaving hair bouncy, resilient, and full of natural shine.',
          ),
          href: '#fanola-salon',
          imageUrl: '',
        },
      ],
      series: [
        { name: 'No yellow Care', href: '#fanola-salon' },
        { name: 'After colour', href: '#fanola-salon' },
        { name: 'Frequent', href: '#fanola-salon' },
        { name: 'Scrub Gel', href: '#fanola-salon' },
        { name: 'Rebalance Purity', href: '#fanola-salon' },
        { name: 'NO MORE', href: '#fanola-salon' },
        { name: 'FIBER FIX', href: '#fanola-salon' },
      ],
      logoUrl: '/brands/fanola.png',
      website: 'https://www.fanola.it/fa_en/',
      socials: { youtube: 'https://www.youtube.com/@FanolaOfficial' },
    },
    {
      slug: 'nook', name: 'Nook', localName: L('นุก', 'Nook'), country: L('อิตาลี', 'Italy'),
      tagline: L('Eco-conscious beauty', 'Eco-conscious beauty'),
      description: L('แรงบันดาลใจจากความเรียบง่าย ความสวยงาม ความกลมกลืนและสมดุลของธรรมชาติ', 'Inspired by the simplicity, beauty, harmony and balance of nature'),
      highlights: [L('Eco-conscious', 'Eco-conscious'), L('Natural balance', 'Natural balance'), L('Salon professional', 'Salon professional')],
      logoUrl: '/brands/nook.jpg',
      website: 'http://nookcosmetics.it/company/?lang=en',
      socials: {},
    },
    {
      slug: 'sweet-professional', name: 'Sweet Professional', localName: L('สวีท โพรเฟสชันนัล', 'Sweet Professional'), country: L('บราซิล', 'Brazil'),
      tagline: L('More than a brand', 'More than a brand'),
      description: L('ไลฟ์สไตล์ใหม่ เป็นมากกว่าแบรนด์ โอกาสไล่ตามความฝันของคุณในจักรวาลแห่งความงาม', 'A new lifestyle and more than a brand: a chance to chase your dreams in the beauty universe'),
      highlights: [L('ทรีตเมนต์ยืดผม', 'Straightening treatments'), L('Brazilian technology', 'Brazilian technology'), L('Lifestyle brand', 'Lifestyle brand')],
      logoUrl: '/brands/sweet.jpg',
      website: 'https://sweethairprofessional.com/',
      socials: {},
    },
  ];
  const counter = ['La Prairie', 'La Mer', 'Clarins', 'Jo Malone', "Kiehl's", 'Givenchy', 'Guerlain', 'Jung Saem Mool', 'Laura Mercier', 'Dior', 'Sulwhasoo', 'Estée Lauder', 'Tom Ford', 'Sisley'];

  const ids: Record<string, string> = {};
  let order = 0;
  for (const b of salon) {
    const row = await prisma.brand.upsert({
      where: { slug: b.slug },
      create: { ...b, type: 'SALON', sortOrder: order++ },
      update: { logoUrl: b.logoUrl },
    });
    ids[b.slug] = row.id;
  }
  for (const name of counter) {
    const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const empty = L('', '');
    const row = await prisma.brand.upsert({
      where: { slug },
      create: { slug, name, type: 'COUNTER', localName: empty, country: empty, tagline: empty, description: empty, sortOrder: order++ },
      update: {},
    });
    ids[slug] = row.id;
  }
  return ids;
}

/* ------------------------------------------------------------- products */

async function seedProducts(brand: Record<string, string>) {
  const items: [string, string, string, string, number, number | null, string[]][] = [
    ['skin-caviar-harmony-lextrait', "Skin Caviar Harmony L'Extrait", 'la-prairie', '', 30500, 21350, ['New']],
    ['la-prairie-caviar-set', 'La Prairie Caviar Set', 'la-prairie', '', 78000, 54600, []],
    ['no-red-set-100ml', 'No Red Set 100ml (Shampoo & Mask)', 'fanola', 'Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)', 1080, null, ['New']],
    ['no-red-mask-350ml', 'No Red Mask 350ml', 'fanola', 'Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)', 1390, null, ['New']],
    ['no-red-mask-1000ml', 'No Red Mask 1,000ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 2590, null, ['New']],
    ['no-red-shampoo-350ml', 'No Red Shampoo 350ml', 'fanola', 'Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)', 1168, null, ['New']],
    ['blue-foam-no-orange-250ml', 'Blue Foam No Orange 250ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 2250, null, ['New']],
    ['no-orange-mask-350ml', 'No Orange Mask 350ml', 'fanola', 'Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)', 1390, null, ['Hot']],
    ['no-orange-mask-1000ml', 'No Orange Mask 1,000ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 2590, null, ['Hot']],
    ['no-orange-shampoo-350ml', 'No Orange Shampoo 350ml', 'fanola', 'Fanola Hair Care (ผลิตภัณฑ์การดูแลผม)', 1168, null, ['Hot']],
    ['no-orange-shampoo-1000ml', 'No Orange Shampoo 1,000ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 1950, null, ['Hot']],
    ['nutri-care-shampoo-1000ml', 'Nutri Care Shampoo 1,000ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 1850, null, ['Soft hair']],
    ['shield-protective-mist-100ml', 'Shield Protective Mist 100ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 1590, null, []],
    ['2-phase-potion-leave-in-150ml', '2-Phase Potion Leave In Conditioner 150ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 1290, null, []],
    ['thermo-protective-cream-150ml', 'Thermo-Protective Cream 150ml', 'fanola', 'Fanola Salon (ผลิตภัณฑ์บริการในซาลอน)', 1650, null, []],
  ];
  let order = 0;
  for (const [slug, name, b, category, price, salePrice, badges] of items) {
    await prisma.product.upsert({
      where: { slug },
      create: { slug, name: L(name, name), description: L('', ''), brandId: brand[b], category, price, salePrice, badges, sortOrder: order++ },
      update: { category, price },
    });
  }
}

/* ---------------------------------------------------------- other lists */

async function syncHeroSlides() {
  const all15Slides = [
    { product: L('BeautyUp Official Salon Partner', 'BeautyUp Official Salon Partner'), caption: L('ศูนย์รวมผลิตภัณฑ์ซาลอนมืออาชีพ', 'Professional Salon & Beauty Products'), href: '/products', imageUrl: '/slides/1.jpg', sortOrder: 0, isActive: true },
    { product: L('Beauty Promotion 2', 'Beauty Promotion 2'), caption: L('โปรโมชันสุดคุ้มเพื่อช่างผมมืออาชีพ', 'Exclusive Salon Deals'), href: '/products', imageUrl: '/slides/2.jpg', sortOrder: 1, isActive: true },
    { product: L('Nook Eco-Conscious Beauty', 'Nook Eco-Conscious Beauty'), caption: L('ผลิตภัณฑ์ดูแลเส้นผมธรรมชาติจากอิตาลี', 'Nature-inspired salon care from Italy'), href: '/products/nook', imageUrl: '/slides/3.jpg', sortOrder: 2, isActive: true },
    { product: L('Sweet Professional Hair Treatment', 'Sweet Professional Hair Treatment'), caption: L('นวัตกรรมยืดผมระดับสากลจากบราซิล', 'Global Hair Transformation'), href: '/products/sweet-professional', imageUrl: '/slides/4.jpg', sortOrder: 3, isActive: true },
    { product: L('BeautyUp Hair Product 5', 'BeautyUp Hair Product 5'), caption: L('ผลิตภัณฑ์บำรุงและฟื้นฟูเส้นผมล้ำลึก', 'Deep Hair Nourishment'), href: '/products', imageUrl: '/slides/5.jpg', sortOrder: 4, isActive: true },
    { product: L('BeautyUp Professional Care 6', 'BeautyUp Professional Care 6'), caption: L('มาตรฐานการดูแลเส้นผมระดับซาลอนชั้นนำ', 'Professional Salon Standard'), href: '/products', imageUrl: '/slides/6.jpg', sortOrder: 5, isActive: true },
    { product: L('Salon Inspiration 7', 'Salon Inspiration 7'), caption: L('สร้างสรรค์ผลงานช่างผมมืออาชีพ', 'Creative Styling Solutions'), href: '/products', imageUrl: '/slides/7.jpg', sortOrder: 6, isActive: true },
    { product: L('BeautyUp Essential 8', 'BeautyUp Essential 8'), caption: L('ผลิตภัณฑ์จำเป็นสำหรับร้านซาลอน', 'Essential Salon Care'), href: '/products', imageUrl: '/slides/8.jpg', sortOrder: 7, isActive: true },
    { product: L('La Prairie Caviar Collection', 'La Prairie Caviar Collection'), caption: L('ศาสตร์แห่งการชะลอวัยชั้นเลิศจากสวิตเซอร์แลนด์', 'The Swiss Luxury Skincare'), href: '/shop', imageUrl: '/slides/10 La Prairie.jpg', sortOrder: 8, isActive: true },
    { product: L('BeautyUp Showcase 10', 'BeautyUp Showcase 10'), caption: L('คอลเลกชันสินค้าคุณภาพยอดนิยม', 'Featured Collection'), href: '/shop', imageUrl: '/slides/10.png', sortOrder: 9, isActive: true },
    { product: L('BeautyUp Premium 11', 'BeautyUp Premium 11'), caption: L('ผลิตภัณฑ์ระดับพรีเมียม', 'Premium Beauty Line'), href: '/products', imageUrl: '/slides/11.png', sortOrder: 10, isActive: true },
    { product: L('BeautyUp Trend 12', 'BeautyUp Trend 12'), caption: L('อัปเดตเทรนด์ความงามใหม่ล่าสุด', 'Latest Beauty Trends'), href: '/products', imageUrl: '/slides/12.jpg', sortOrder: 11, isActive: true },
    { product: L('BeautyUp Special 13', 'BeautyUp Special 13'), caption: L('สิทธิประโยชน์สำหรับสมาชิกและซาลอน', 'Member Exclusive'), href: '/contact/salon-partner', imageUrl: '/slides/13.jpg', sortOrder: 12, isActive: true },
    { product: L('Salon Partner Community 14', 'Salon Partner Community 14'), caption: L('ร่วมเป็นพันธมิตรซาลอนกับบิวตี้อัพทั่วประเทศ', 'Grow your vision with BeautyUp'), href: '/contact/salon-partner', imageUrl: '/slides/14.jpg', sortOrder: 13, isActive: true },
    { product: L('BeautyUp Academy 15', 'BeautyUp Academy 15'), caption: L('คอร์สเรียนและพัฒนาทักษะช่างผม', 'Professional Hairdressing Academy'), href: '/courses', imageUrl: '/slides/15.jpg', sortOrder: 14, isActive: true },
  ];

  await prisma.heroSlide.deleteMany();
  for (const s of all15Slides) {
    await prisma.heroSlide.create({ data: s });
  }
}

const videos = [
  { title: L('20 YEARS OF FANOLA - Official Campaign', '20 YEARS OF FANOLA - Official Campaign'), youtubeUrl: 'https://www.youtube.com/@FanolaOfficial', sortOrder: 0 },
  { title: L('Treatment SOS Keratinization', 'Treatment SOS Keratinization'), youtubeUrl: 'https://www.youtube.com/@FanolaOfficial', sortOrder: 1 },
  { title: L('FANOLA NO-YELLOW SHAMPOO', 'FANOLA NO-YELLOW SHAMPOO'), youtubeUrl: 'https://www.youtube.com/@FanolaOfficial', sortOrder: 2 },
  { title: L('Fanola No Yellow Incredible Foam', 'Fanola No Yellow Incredible Foam'), youtubeUrl: 'https://www.youtube.com/@FanolaOfficial', sortOrder: 3 },
];

const ambassadors = [
  { name: 'CHERRY', title: L('Cherry Hair Style Founder', 'Cherry Hair Style Founder'), sortOrder: 0 },
  { name: 'TEMEE', title: L('Chick Hair Salon Founder', 'Chick Hair Salon Founder'), sortOrder: 1 },
  { name: 'NOK', title: L('Shampoo Salon Founder', 'Shampoo Salon Founder'), sortOrder: 2 },
  { name: 'AUM', title: L('The T-Cut Salon Expert', 'The T-Cut Salon Expert'), sortOrder: 3 },
];

// MOCK: sample salons until the real list is imported
const salons = [
  { name: 'ร้านตัวอย่าง สยาม', region: 'BANGKOK_CENTRAL', province: 'กรุงเทพมหานคร', phone: '02-000-0000' },
  { name: 'ร้านตัวอย่าง นนทบุรี', region: 'BANGKOK_CENTRAL', province: 'นนทบุรี', phone: '02-000-0000' },
  { name: 'ร้านตัวอย่าง ชลบุรี', region: 'EAST', province: 'ชลบุรี', phone: '038-000-000' },
  { name: 'ร้านตัวอย่าง ราชบุรี', region: 'WEST', province: 'ราชบุรี', phone: '032-000-000' },
  { name: 'ร้านตัวอย่าง ลำปาง', region: 'NORTH', province: 'ลำปาง', phone: '054-000-000' },
  { name: 'ร้านตัวอย่าง เชียงใหม่', region: 'NORTH', province: 'เชียงใหม่', phone: '053-000-000' },
  { name: 'ร้านตัวอย่าง ภูเก็ต', region: 'SOUTH', province: 'ภูเก็ต', phone: '076-000-000' },
  { name: 'ร้านตัวอย่าง ขอนแก่น', region: 'NORTHEAST', province: 'ขอนแก่น', phone: '043-000-000' },
] as const;

// MOCK: placeholder team members
const team = [
  { name: L('พนักงานขาย 1', 'Sales Rep 1'), position: L('ผู้แทนขาย ภาคเหนือ', 'Sales, North'), department: 'SALES', phone: '08x-xxx-xxxx', lineId: '@beautyup', sortOrder: 0 },
  { name: L('พนักงานขาย 2', 'Sales Rep 2'), position: L('ผู้แทนขาย กรุงเทพฯ', 'Sales, Bangkok'), department: 'SALES', phone: '08x-xxx-xxxx', lineId: '@beautyup', sortOrder: 1 },
  { name: L('เทคนิคเชี่ยน 1', 'Technician 1'), position: L('Fanola Technician', 'Fanola Technician'), department: 'TECHNICIAN', phone: '08x-xxx-xxxx', sortOrder: 2 },
  { name: L('เทคนิคเชี่ยน 2', 'Technician 2'), position: L('Sweet Technician', 'Sweet Technician'), department: 'TECHNICIAN', phone: '08x-xxx-xxxx', sortOrder: 3 },
] as const;

const courses = [
  {
    slug: 'europe-study-tour',
    title: L('เรียนทำผมเทคนิคขั้นสูง ดูงานยุโรป 6 ประเทศ 14 วัน', 'Advanced hair techniques & study tour: 6 European countries, 14 days'),
    priceText: L('1xx,xxx ฿', '1xx,xxx THB'),
    duration: L('17 วัน', '17 days'),
    summary: L('เรียนเทคนิคขั้นสูงพร้อมดูงานโรงงานผู้ผลิตในยุโรป นำทีมโดยคุณเอมี่', 'Advanced techniques plus factory visits in Europe, led by Amy'),
    content: lines(
      ['เรียนรู้เทคนิคการตัด ทำสี ดัด และยืดผมขั้นสูงจากผู้เชี่ยวชาญระดับสากล', 'Learn advanced cutting, colouring, perming and straightening from international experts'],
      ['ดูงานโรงงานและแบรนด์ผู้ผลิตผลิตภัณฑ์ซาลอนในยุโรป', 'Visit salon product manufacturers and brands in Europe'],
      ['สร้างเครือข่ายกับช่างผมมืออาชีพจากทั่วโลก', 'Network with professional hairdressers from around the world'],
    ),
    sortOrder: 0,
  },
  {
    slug: 'private-advanced-class',
    title: L('เรียนทำผมเทคนิคขั้นสูง ตัวต่อตัวและกลุ่มย่อย (1-5 ท่าน)', 'Advanced hair techniques: private & small group (1-5 people)'),
    priceText: L('49,900 ฿', '49,900 THB'),
    duration: L('3 วัน', '3 days'),
    summary: L('เรียนแบบตัวต่อตัวหรือกลุ่มเล็ก เน้นเทคนิคที่สร้างรายได้สูงจากลูกค้า VIP', 'One-to-one or small-group training focused on high-earning techniques for VIP clients'),
    content: lines(
      ['ออกแบบหลักสูตรตามระดับและเป้าหมายของผู้เรียน', 'Curriculum tailored to your level and goals'],
      ['ฝึกปฏิบัติจริงกับนางแบบ พร้อมผู้สอนดูแลใกล้ชิด', 'Hands-on practice with models and close mentoring'],
      ['แก้ปัญหาเส้นผมที่พบบ่อยในร้าน และเทคนิคการให้คำปรึกษาลูกค้า', 'Fix common hair problems and learn client consultation'],
    ),
    sortOrder: 1,
  },
];

// MOCK: sample posts
const posts = [
  { slug: 'cosmoprof-bologna', type: 'ACTIVITY', title: L('ทีมบิวตี้อัพร่วมงาน COSMOPROF Bologna', 'BeautyUp at COSMOPROF Bologna'), excerpt: L('อัปเดตเทรนด์ผลิตภัณฑ์ความงามและเทคนิคใหม่จากงานแสดงสินค้าความงามที่ใหญ่ที่สุดในโลก', "Trends and new techniques from the world's largest beauty trade show"), body: L('เนื้อหาตัวอย่าง (mock) สำหรับกิจกรรม', 'Sample content (mock) for this activity'), publishedAt: new Date('2026-03-20') },
  { slug: 'fanola-workshop-lampang', type: 'ACTIVITY', title: L('Fanola Workshop ลำปาง', 'Fanola Workshop Lampang'), excerpt: L('เวิร์กช็อปเทคนิคการใช้ No Yellow สำหรับช่างผมภาคเหนือ', 'No Yellow techniques workshop for hairdressers in the North'), body: L('เนื้อหาตัวอย่าง (mock) สำหรับกิจกรรม', 'Sample content (mock) for this activity'), publishedAt: new Date('2026-05-02') },
  { slug: '20-years-of-fanola', type: 'MEDIA', title: L('20 Years of Fanola - Official Campaign', '20 Years of Fanola - Official Campaign'), excerpt: L('ฉลอง 20 ปีของ Fanola กับแคมเปญระดับโลก', "Celebrating Fanola's 20 years with a global campaign"), body: L('เนื้อหาตัวอย่าง (mock) สำหรับมีเดีย', 'Sample content (mock) for media'), publishedAt: new Date('2026-01-15') },
  { slug: 'how-to-use-purple-shampoo', type: 'ARTICLE', title: L('แชมพูม่วงใช้อย่างไรให้ผมไม่เหลือง', 'How to use purple shampoo to stop brassy tones'), excerpt: L('เคล็ดลับการใช้ No Yellow Shampoo ให้ได้สีผมเทาหม่นสวยนานขึ้น', 'Tips for longer-lasting ash tones with No Yellow Shampoo'), body: lines(['แชมพูม่วงช่วยลบเม็ดสีเหลืองที่เกิดขึ้นหลังการฟอกผม', 'Purple shampoo neutralises the yellow tones left after bleaching'], ['ควรใช้ 1-2 ครั้งต่อสัปดาห์ และทิ้งไว้ 3-5 นาทีก่อนล้างออก', 'Use it 1-2 times a week and leave it on for 3-5 minutes before rinsing']), publishedAt: new Date('2026-06-10') },
  { slug: 'brazilian-straightening', type: 'ARTICLE', title: L('ยืดผมสไตล์บราซิลต่างจากยืดทั่วไปอย่างไร', 'How Brazilian straightening differs from regular straightening'), excerpt: L('ทำความรู้จักทรีตเมนต์ยืดผมจาก Sweet Professional', 'Meet the straightening treatments from Sweet Professional'), body: L('เนื้อหาตัวอย่าง (mock) สำหรับบทความ', 'Sample content (mock) for this article'), publishedAt: new Date('2026-07-22') },
] as const;

// MOCK: replace with the real policy text in Admin > Pages
const pages = [
  {
    slug: 'policy',
    title: L('นโยบายทางธุรกิจสำหรับการจัดจำหน่ายและการจัดเก็บข้อมูล', 'Business policy for distribution and data storage'),
    body: lines(
      ['## การจัดจำหน่าย', '## Distribution'],
      ['เนื้อหานโยบายการจัดจำหน่าย (รอข้อมูลจริงจากเว็บเดิม)', 'Distribution policy (to be copied from the current site)'],
      ['## การชำระเงิน', '## Payment'],
      ['เนื้อหานโยบายการชำระเงิน (รอข้อมูลจริงจากเว็บเดิม)', 'Payment policy (to be copied from the current site)'],
      ['## การจัดเก็บข้อมูลส่วนบุคคล', '## Personal data'],
      ['เนื้อหานโยบายการจัดเก็บข้อมูล (รอข้อมูลจริงจากเว็บเดิม)', 'Data storage policy (to be copied from the current site)'],
    ),
  },
];

/* ----------------------------------------------------------------- menu */

async function seedMenu() {
  if (await prisma.menuItem.count()) return;
  const tree: [ReturnType<typeof L>, string, [ReturnType<typeof L>, string][]?][] = [
    [L('หน้าหลัก', 'Home'), '/'],
    [L('เกี่ยวกับเรา', 'About'), '/about'],
    [L('ลูกค้า', 'Customers'), '/customers', [[L('แบรนด์แอมบาสเดอร์', 'Brand ambassadors'), '/customers'], [L('ค้นหาซาลอน', 'Find a salon'), '/customers/salons']]],
    [L('ผลิตภัณฑ์ผม', 'Hair products'), '/products', [[L('Fanola (ฟาโนลา)', 'Fanola'), '/products/fanola'], [L('Nook (นุก)', 'Nook'), '/products/nook'], [L('Sweet. (สวีท)', 'Sweet Professional'), '/products/sweet-professional']]],
    [L('ร้านบิวตี้อัพ', 'BeautyUp shop'), '/shop'],
    [L('คอร์สเรียน', 'Courses'), '/courses'],
    [L('ติดต่อเรา', 'Contact'), '/contact', [
      [L('บิวตี้อัพ ทีม', 'BeautyUp team'), '/contact/team'],
      [L('เทคนิคเชี่ยน', 'Technicians'), '/contact/team#technician'],
      [L('สมัครซาลอน', 'Salon partner sign-up'), '/contact/salon-partner'],
      [L('การชำระเงิน', 'Payment'), '/contact/payment'],
      [L('นโยบายการจำหน่ายและชำระเงิน', 'Sales & payment policy'), '/policy'],
      [L('แจ้งปัญหา', 'Report an issue'), '/contact/report'],
    ]],
    [L('มุมสมาชิก', 'Members'), '/members', [[L('กิจกรรม', 'Activities'), '/members/activities'], [L('มีเดีย', 'Media'), '/members/media'], [L('บทความ', 'Articles'), '/members/articles']]],
  ];
  for (const [i, [label, href, children]] of tree.entries()) {
    const parent = await prisma.menuItem.create({ data: { label, href, sortOrder: i } });
    for (const [j, [cl, ch]] of (children ?? []).entries()) {
      await prisma.menuItem.create({ data: { label: cl, href: ch, parentId: parent.id, sortOrder: j } });
    }
  }
}

/* ---------------------------------------------------------------- utils */

async function fillIfEmpty(model: 'heroSlide' | 'video' | 'ambassador' | 'salon' | 'teamMember', rows: readonly object[]) {
  const delegate = prisma[model] as unknown as { count(): Promise<number>; createMany(a: { data: readonly object[] }): Promise<unknown> };
  if (await delegate.count()) return;
  await delegate.createMany({ data: rows });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
