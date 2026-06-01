const CACHE_NAME = "treinox-ai-cache-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install event: cache all static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching static resources");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event: clean up older caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deleting obsolete cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event: cache-first with network fallback for local assets, network-first for external/dynamic assets
self.addEventListener("fetch", (event) => {
  // Only intercept HTTP/HTTPS requests
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith("http")) {
    return;
  }

  // Strategy: Cache First for static, local assets; Network First for external resources
  const isLocalAsset = event.request.url.startsWith(self.location.origin);

  if (isLocalAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Cache the newly fetched asset dynamically
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If offline and not in cache
          console.log("[Service Worker] Offline fetch failed for local asset:", event.request.url);
        });
      })
    );
  } else {
    // Network first for external resources (like remote GIFs/Videos, Google Fonts)
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            console.log("[Service Worker] Offline fetch failed for external asset:", event.request.url);
          });
        })
    );
  }
});
