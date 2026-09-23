const CACHE_NAME = 'quran-indopak-202609240102';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './asset/font-indopak.woff2',
  './asset/data-quran.json',
  './manifest.json',
  './asset/icon-192.png',
  './asset/icon-512.png'
];

async function preCacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(ASSETS_TO_CACHE);
}

async function clearOldCaches() {
  const cacheKeys = await caches.keys();
  return Promise.all(
    cacheKeys
      .filter(function(key) {
        return key !== CACHE_NAME;
      })
      .map(function(key) {
        return caches.delete(key);
      })
  );
}

async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return fetch(request);
}

self.addEventListener('install', function(event) {
  event.waitUntil(preCacheAssets());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clearOldCaches());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(cacheFirstStrategy(event.request));
});
