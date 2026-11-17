// ============================================================
// REPOSITORIO — punto ÚNICO de acceso a los datos del restaurante.
// Hoy: hojas CSV (Google Sheets publicado o .csv del repo).
// Mañana (POS): API / base de datos. Se cambia SOLO este archivo; las vistas no se tocan.
// ============================================================

import { fetchSheetRows } from "./sheets.js";
import { toProductList } from "./products.js";
import { toDailyMenu } from "./daily-menu.js";
import { readCache, writeCache } from "./cache.js";

export const getCarta = (url) => load(url, toProductList);
export const getMenuDelDia = (url) => load(url, toDailyMenu);

// Red primero: lo que el dueño edita se ve al recargar. Sin red: último dato bueno.
async function load(url, parse) {
  const key = `fapoz:${new URL(url || "", location.href).href}`;
  try {
    const data = parse(await fetchSheetRows(url));
    writeCache(key, data);
    return data;
  } catch (error) {
    const cached = readCache(key);
    if (cached === undefined) throw error;
    console.warn("[catalog] sin red, uso el último dato guardado:", error);
    return cached;
  }
}
