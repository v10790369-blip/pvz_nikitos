// Минимальный service worker для PWA
const CACHE = 'pvz-v1';

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
    // Пропускаем не-GET запросы
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then((cached) => {
            if (cached) return cached;
            return fetch(e.request).then((response) => {
                // Кэшируем только успешные ответы с нашего origin
                if (response.ok && e.request.url.startsWith(self.location.origin)) {
                    const clone = response.clone();
                    caches.open(CACHE).then((c) => c.put(e.request, clone));
                }
                return response;
            }).catch(() => caches.match(e.request));
        })
    );
});