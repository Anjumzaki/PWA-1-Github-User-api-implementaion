var cacheName = 'shell-content';
var filesToCache = [
  'styles.css',
  'index.js',
  '/index.html',
  '/',
];


self.addEventListener('install', function (e) {
  console.log("Service Worker installed succesfully");
  e.waitUntil(
      caches.open(cacheName).then(function (cache) {
          console.log("Service Worker caches succesfully");
          return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  e.respondWith(caches.match(e.request).then(function(cache){
      
      return cache || fetch(e.request);
  }));
});