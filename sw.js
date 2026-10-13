// sw.js — Service Worker สำหรับ KraiMaiJayMeeReung
//
// หน้าที่: แคชเฉพาะ "เปลือกแอป" (index.html, manifest.json, cat.jpg, ไลบรารีจาก CDN
// ที่ใช้ตอนเปิดแอป) เพื่อให้:
//   1. กด "Add to Home Screen" แล้วเปิดเหมือนแอปจริงได้ (เงื่อนไขหนึ่งของ PWA)
//   2. เปิดแอปครั้งถัดไปเร็วขึ้น (โหลดจากแคชก่อน ไม่ต้องรอโหลดใหม่ทั้งหมด)
//
// ⚠️ ข้อมูลบิล/เพื่อน/ยอดเงินทั้งหมดยังคงดึงสดจาก Firebase Firestore ผ่าน SDK เสมอ
// (ไม่ได้ผ่าน fetch ของหน้านี้) service worker ตัวนี้จึง "ไม่แคชข้อมูลเงิน" เด็ดขาด
// ไม่ต้องกลัวเห็นยอดเก่าค้างเพราะแคช

// เวอร์ชันแคช: ไม่ต้องเปลี่ยนแล้วเวลาแก้ index.html (หน้าแอปโหลดจากเน็ตก่อนเสมอ)
// เปลี่ยนเฉพาะตอนแก้ไฟล์นี้เอง หรืออยากล้างแคชไลบรารีทั้งหมด
const CACHE_NAME = 'kraimaijay-shell-v10';

// ปรับรายชื่อไฟล์ตรงนี้ให้ตรงกับไฟล์จริงที่คุณ deploy คู่กับ index.html
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './cat.jpg',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // ใช้ addAll แบบ "ยอมพลาดได้บางไฟล์" ไม่งั้นถ้า CDN ไฟล์ใดไฟล์หนึ่งโหลดไม่ทัน
      // ตอน install จะทำให้ install ทั้งหมดล้มเหลวไปด้วย
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => console.warn('SW: cache failed for', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // ไม่ยุ่งกับ request ไปหา Firebase/Firestore/Google APIs เด็ดขาด ปล่อยให้วิ่งผ่านเน็ตตามปกติ
  // เพื่อให้ข้อมูลเงินสดใหม่เสมอ ไม่มีการแคชทับ
  if (
    req.url.includes('firestore.googleapis.com') ||
    req.url.includes('firebaseio.com') ||
    req.url.includes('googleapis.com') ||
    req.url.includes('identitytoolkit')
  ) {
    return; // ไม่เรียก event.respondWith -> browser จัดการ fetch ตามปกติ
  }

  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // ไฟล์ของแอปเอง (index.html, manifest, รูป): โหลดจากเน็ตก่อนเสมอ เพื่อให้เห็นเวอร์ชันล่าสุดทันที
  // ใช้แคชเฉพาะตอนออฟไลน์
  if (sameOrigin) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // ไลบรารีจาก CDN (React, Tailwind, ฟอนต์): ใช้แคชก่อนให้เปิดเร็ว แล้วอัปเดตเงียบๆ เบื้องหลัง
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes && (networkRes.ok || networkRes.type === 'opaque')) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
