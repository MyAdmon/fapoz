// Último dato bueno en localStorage, por clave. Respaldo cuando no hay red.
// readCache devuelve undefined si no hay nada guardado (null/[] son datos válidos).

export function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).data : undefined;
  } catch {
    return undefined;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* almacenamiento lleno o bloqueado: se ignora */
  }
}
