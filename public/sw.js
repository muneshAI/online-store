self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('nepal-store-generator-v1').then((cache) => cache.addAll(['/']))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});
