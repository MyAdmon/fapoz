const V = "v2";
const SHELL = `la-avenida-${V}`;

const ASSETS = [
  "./", "./index.html", "./menu.css", "./menu.js",
  "./config.js", "./manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    await Promise.allSettled(ASSETS.map((a) => c.add(a)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.endsWith(V)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    e.respondWith((async () => {
      try { return await fetch(request); }
      catch { return (await caches.match(request)) || (await caches.match("./index.html")); }
    })());
    return;
  }

  if (url.origin === self.location.origin) {
    e.respondWith(staleWhileRevalidate(request, SHELL));
    return;
  }

  e.respondWith(cacheFirst(request, SHELL));
});

async function staleWhileRevalidate(req, name) {
  const c = await caches.open(name);
  const cached = await c.match(req);
  const net = fetch(req).then((r) => {
    if (r && r.status === 200 && r.type !== "opaque") c.put(req, r.clone());
    return r;
  }).catch(() => cached);
  return cached || net;
}

async function cacheFirst(req, name) {
  const c = await caches.open(name);
  const cached = await c.match(req);
  if (cached) return cached;
  try {
    const r = await fetch(req);
    if (r && (r.status === 200 || r.type === "opaque")) c.put(req, r.clone());
    return r;
  } catch { return Response.error(); }
}