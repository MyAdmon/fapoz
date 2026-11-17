const VERSION = "v1.0.0";
const SHELL = `fapoz-shell-${VERSION}`;
const RUNTIME = `fapoz-runtime-${VERSION}`;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./menu.css",
  "./menu.js",
  "./config.js",
  "./manifest.webmanifest",
  "./img/logo.svg",
  "../shared/config.js",
  "../shared/styles/tokens.css",
  "../shared/styles/base.css",
  "../shared/js/catalog.js",
  "../shared/js/sheets.js",
  "../shared/js/cache.js",
  "../shared/js/format.js",
  "../shared/js/products.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.allSettled(SHELL_ASSETS.map((a) => cache.add(a)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Datos del Sheet: los maneja shared/js/catalog.js con TTL (no interceptar)
  if (/docs\.google\.com|googleusercontent\.com/.test(url.hostname)) return;

  // Navegación: red primero, fallback al shell (offline)
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try { return await fetch(request); }
      catch { return (await caches.match(request)) || (await caches.match("./index.html")); }
    })());
    return;
  }

  // Recursos del propio sitio: stale-while-revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, SHELL));
    return;
  }

  // Terceros (fuentes, imágenes): cache-first
  event.respondWith(cacheFirst(request, RUNTIME));
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res && res.status === 200 && res.type !== "opaque") cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res && (res.status === 200 || res.type === "opaque")) cache.put(request, res.clone());
    return res;
  } catch {
    return Response.error();
  }
}
