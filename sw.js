// ============ sw.js — Service Worker (makes the app installable + works offline) ============
const CACHE = "smart-edu-v1";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim());
});

// Network-first: always try to load fresh, fall back to cache if the phone is offline
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});