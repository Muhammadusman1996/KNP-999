const CACHE = 'knp999-v3-account-redirect-fix';
const FILES = [
  './',
  './index.html',
  './admin.html',
  './account.html',
  './manifest.webmanifest'
];

// Activate the updated worker immediately.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(FILES);
    await self.skipWaiting();
  })());
});

// Remove old caches so stale files such as the placeholder Firebase config
// cannot continue to be served.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Always fetch firebase-config.js from the live site; never serve it from
// the service-worker cache.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  if (url.origin === self.location.origin && url.pathname.endsWith('/firebase-config.js')) {
    event.respondWith(fetch(new Request(event.request, { cache: 'no-store' })));
    return;
  }

  event.respondWith((async () => {
    // Always try the live HTML page first so login fixes are not hidden
    // behind an older cached account.html or index.html.
    if (event.request.mode === 'navigate') {
      try {
        const fresh = await fetch(new Request(event.request, { cache: 'no-store' }));
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          cache.put(event.request, fresh.clone());
        }
        return fresh;
      } catch (error) {
        const cachedPage = await caches.match(event.request);
        if (cachedPage) return cachedPage;
        throw error;
      }
    }

    const cached = await caches.match(event.request);
    if (cached) return cached;
    return fetch(event.request);
  })());
});
