const CACHE_NAME = "smc-v6"; // 🔥 version change (v5 → v6)

const BASE = "/SANTHOSHI-MATHA-CONSULTANCY/";

const urlsToCache = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "icon-192.png",
  BASE + "icon-512.png"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activate immediately
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            return caches.delete(k); // delete old cache
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (🔥 UPDATED LOGIC)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // update cache with latest version
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response; // return fresh response
      })
      .catch(() => {
        // fallback to cache if offline
        return caches.match(event.request);
      })
  );
});
