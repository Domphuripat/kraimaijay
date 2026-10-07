# 👊 KraiMaiJayMeeReung (ใครไม่จ่ายมีเรื่อง)

> **Split, Loan & Settle** — เว็บแอปพลิเคชันสำหรับหารค่าใช้จ่าย บันทึกหนี้/การยืมเงิน และติดตามยอดคงเหลืออัตโนมัติ ออกแบบมาเพื่อกลุ่มเพื่อนที่สั่งอาหารและเดินทางร่วมกันบ่อยๆ

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deployed%20with-GitHub%20Pages-brightgreen)](https://domphuripat.github.io/kraimaijay/)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-orange)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20(Standalone)-blue)](https://react.dev/)

---

## ✨ Features เด่น

- 🍕 **Bill Splitting หลากรูปแบบ**:
  - **Delivery / Food**: หารค่าอาหารตามจริง พร้อมรองรับ Tax (Inclusive / Add-on), Service Charge, ส่วนลด และค่าส่ง/ค่าแพ็กเกจ
  - **Ride (Grab / Bolt)**: หารค่าเดินทาง ค่าทางด่วน พร้อมระบบปัดเศษสตางค์ (Distribute หรือ Payer Absorbs)
  - **Loan (ยืมเงิน)**: บันทึกยืมเงินสด/โอนเงินตรงแบบ 1:1
- ⚡ **Smart FIFO Auto Net-Off**:
  - เมื่อเพื่อนจ่ายค่าบิลให้เรา ระบบจะวิ่งไปหักล้างบิลเก่าที่เพื่อนเคยค้างเราให้อัตโนมัติแบบ FIFO (First-In, First-Out)
  - บันทึกประวัติและสร้าง traceability tag ไม่ให้เกิดยอดตัดซ้ำซ้อน
- 📸 **Client-side OCR Scanner**:
  - รองรับการสแกนใบเสร็จ Grab, 7-Eleven, Aeon ด้วย Tesseract.js ทำงานบน Browser 100% ฟรีและปลอดภัย
  - หมุนภาพ (Rotation Canvas Pre-processing) และมีโหมดแปะข้อความดิบ (Raw Text Parser)
- 📊 **Ledger & Individual Statements**:
  - ดู Statement ยอดรวมของเพื่อนแต่ละคนแบบละเอียด
  - ปุ่มส่งออกเป็นภาพ (PNG), เอกสาร (PDF) หรือคัดลอกข้อความสรุปยอดสำหรับส่งเข้าแชท WhatsApp / LINE / Instagram
- 📈 **Monthly Analytics & Daily Calendar**:
  - ดูสัดส่วนค่าใช้จ่ายรายเดือน (Food vs Ride) และยอดส่วนตัวในแต่ละวันผ่าน Interactive Calendar
- 🔒 **Admin & Multi-role Access**:
  - เพื่อนทุกคนสามารถเปิดดูยอดรวม (View-Only) ได้ทันทีโดยไม่ต้องล็อกอิน
  - ฟังก์ชันจัดการบิลและยอดเงินจะถูกป้องกันด้วย Google Authentication (Admin Role) และ PIN Guard

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Single-Page App (SPA) ด้วย React 18 (Standalone UMD) + Babel in-browser
- **Styling**: Tailwind CSS CDN พร้อมระบบ Dark Mode และ Custom Palette
- **Backend & Database**: Firebase Authentication & Cloud Firestore (Real-time snapshots)
- **Utilities**:
  - **Tesseract.js**: Client-side OCR
  - **html2canvas & jsPDF**: Client-side Receipt & Statement Exporting

---

## 🚀 การติดตั้งและรันใช้งาน (Local Development)

โปรเจกต์นี้ถูกออกแบบเป็น **Single File Web Application** จึงไม่ต้องติดตั้ง `npm install` หรือ build tools ให้ยุ่งยาก:

1. **Clone Repository**:
   ```bash
   git clone [https://github.com/Domphuripat/kraimaijay.git](https://github.com/Domphuripat/kraimaijay.git)
   cd kraimaijay
