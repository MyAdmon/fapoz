// Caché simple en localStorage con TTL. Clave por módulo.

export function readCache(key, ttl) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== "number") return null;
    if (ttl && Date.now() - parsed.ts > ttl) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* almacenamiento lleno o bloqueado: se ignora */
  }
}

export function clearCache(key) {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}
