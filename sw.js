const CACHE = 'boonwave-full-v1';
const ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith((async()=>{
    const cached = await caches.match(event.request);
    if(cached) return cached;
    try {
      const response = await fetch(event.request);
      const copy = response.clone();
      caches.open(CACHE).then(c=>c.put(event.request, copy));
      return response;
    } catch {
      if(event.request.mode === 'navigate') return caches.match('./index.html');
      throw new Error('offline');
    }
  })());
});
