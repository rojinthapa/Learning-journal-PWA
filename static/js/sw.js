// static/js/sw.js
// Service Worker for Lab 7 PWA

const CACHE_NAME = 'journal-pwa-v10';
const STATIC_ASSETS = [
  '/',
  '/journal',
  '/projects',
  '/about',
  '/game',
  '/static/css/style.css',
  '/static/js/script.js',
  '/static/js/storage.js',
  '/static/js/browser.js',
  '/static/js/thirdparty.js',
  '/static/js/json-handler.js',
  '/static/js/game.js', // <--- CHANGED: New script name
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

// 3. FETCH
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.headers.get('accept').includes('text/html') || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
