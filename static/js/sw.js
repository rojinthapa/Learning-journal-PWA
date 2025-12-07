// static/js/sw.js
// Service Worker for Lab 7 PWA - FIXED (Dynamic Caching)

const CACHE_NAME = 'journal-pwa-v4'; // Incremented version
const STATIC_ASSETS = [
  '/',
  '/journal',
  '/projects',
  '/about',
  '/static/css/style.css',
  '/static/js/script.js',
  '/static/js/storage.js',
  '/static/js/browser.js',
  '/static/js/thirdparty.js',
  '/static/js/json-handler.js',
  '/static/images/app.jpeg',
  '/static/images/home.png',
  '/manifest.json'
];

// 1. INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 2. ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// 3. FETCH (The Important Part)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRATEGY: Network First + Dynamic Caching
  // (For HTML pages and the API)
  if (event.request.headers.get('accept').includes('text/html') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 1. Network Succeeded
          // 2. Clone the response (streams can only be read once)
          const responseToCache = response.clone();

          // 3. Update the Cache with the new data
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          // 4. Return original response to user
          return response;
        })
        .catch(() => {
          // Network Failed? Return the cached version we saved earlier
          return caches.match(event.request);
        })
    );
  }
  // STRATEGY: Cache First
  // (For CSS, JS, Images - load fast from cache)
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
