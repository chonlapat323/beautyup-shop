# Site Menu (from current Wix site)

Menu structure of the current Wix site, used to plan the storefront navigation and the Admin Panel.
Features for each menu are **TBD** and will be filled in later.

## Header menu

| # | Menu | Sub-menu |
|---|---|---|
| 1 | หน้าหลัก | – |
| 2 | เกี่ยวกับเรา | – |
| 3 | ลูกค้า | – |
| 4 | ผลิตภัณฑ์ผม | Fanola (ฟาโนลา), Nook (นุก), Sweet. (สวีท) |
| 5 | ร้านบิวตี้อัพ | – |
| 6 | คอร์สเรียน | – |
| 7 | ติดต่อเรา | บิวตี้อัพ ทีม, เทคนิคเชี่ยน, สมัครซาลอน, การชำระเงิน, นโยบายการจำหน่ายและชำระเงิน, แจ้งปัญหา, PP STUDIO |
| 8 | มุมสมาชิก | กิจกรรม, มีเดีย, บทความ |

```
หน้าหลัก
เกี่ยวกับเรา
ลูกค้า
ผลิตภัณฑ์ผม
├─ Fanola (ฟาโนลา)
├─ Nook (นุก)
└─ Sweet. (สวีท)
ร้านบิวตี้อัพ
คอร์สเรียน
ติดต่อเรา
├─ บิวตี้อัพ ทีม
├─ เทคนิคเชี่ยน
├─ สมัครซาลอน
├─ การชำระเงิน
├─ นโยบายการจำหน่ายและชำระเงิน
├─ แจ้งปัญหา
└─ PP STUDIO
มุมสมาชิก
├─ กิจกรรม
├─ มีเดีย
└─ บทความ
```

## Initial notes for the Admin Panel

These are early guesses to confirm when we go through each menu.

- **Menu management:** the `MenuItem` table already supports 2 levels (`parentId`) and ordering (`sortOrder`), so admins can add, edit, reorder and hide menu items without code changes.
- **ผลิตภัณฑ์ผม:** the sub-menus look like **brands** (Fanola, Nook, Sweet.). We may need a `Brand` model separate from `Category`, so products can be filtered by brand and by type.
- **มุมสมาชิก (กิจกรรม / มีเดีย / บทความ):** content pages, so they likely need a CMS module (posts with a type, cover image and publish date).
- **ติดต่อเรา → สมัครซาลอน, แจ้งปัญหา:** forms, so they likely need a form-submission module with an inbox in the admin.
- **ติดต่อเรา → การชำระเงิน, นโยบายฯ:** static pages, so they could be editable pages in the CMS.
- **คอร์สเรียน:** may need course listings and sign-ups or bookings (TBD).
- **ร้านบิวตี้อัพ:** could be a store-location list or the online shop itself (TBD).

## Features per menu

> TBD: to be filled in when we go through each menu in detail.

| Menu | Features | Admin needs |
|---|---|---|
| หน้าหลัก | | |
| เกี่ยวกับเรา | | |
| ลูกค้า | | |
| ผลิตภัณฑ์ผม | | |
| ร้านบิวตี้อัพ | | |
| คอร์สเรียน | | |
| ติดต่อเรา | | |
| มุมสมาชิก | | |
