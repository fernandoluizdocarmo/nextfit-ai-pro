// sw.js - treinox.ai Service Worker
// v7: Updated cache with modern design CSS (neon colors, responsive)

const CACHE_NAME = "treinox-ai-cache-v10";

// All static assets that must be pre-cached on install
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "/style-enhancements.css",
  "/style-modern.css",
  "/style-mobile-fix.css",
  "/app.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// Fallback responses for missing assets
const FALLBACK_CACHE = "fallback-cache-v1";

// ─── Install: pre-cache all static assets ─────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Pre-caching static assets...");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log("[SW] Pre-cache complete. Activating immediately.");
        return self.skipWaiting(); // activate right away, no waiting for old SW
      })
  );
});

// ─── Activate: remove old caches ──────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log("[SW] Deleting old cache:", name);
              return caches.delete(name);
            })
        )
      )
      .then(() => {
        console.log("[SW] Activated. Claiming all clients.");
        return self.clients.claim(); // take control of all open tabs immediately
      })
  );
});

// ─── Fetch: Cache-First for local assets, Network-First for external ──────────
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith("http")) return;

  const isLocalAsset = url.origin === self.location.origin;

  if (isLocalAsset) {
    // ── Cache-First strategy for own assets ────────────────────────────────
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache immediately
          return cachedResponse;
        }

        // Not in cache — try network
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed (server sleeping) — try to serve index.html as fallback
            console.warn("[SW] Offline + no cache for:", event.request.url, "— serving index.html fallback.");
            return caches.match("/") || caches.match("/index.html");
          });
      })
    );
  } else {
    // ── Network-First for external resources (Fonts, GIFs, etc.) ──────────
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache for external resources
          return caches.match(event.request, { ignoreSearch: true });
        })
    );
  }
});
