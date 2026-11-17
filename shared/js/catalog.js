// ============================================================
// REPOSITORIO DE CATÁLOGO — punto ÚNICO de acceso a los productos.
// El menú (y mañana el POS) NO saben de dónde vienen los datos:
// solo llaman a getProducts(). Cuando exista backend de escritura,
// se cambia SOLO este archivo. Nada más.
// ============================================================

import { SITE } from "../config.js";
import { fetchSheetRows } from "./sheets.js";
import { toProductList, filterAvailable } from "./products.js";
import { readCache, writeCache, clearCache } from "./cache.js";

const CACHE_KEY = "fapoz:catalog:v1";

export async function getProducts({
  force = false,
  ttl = SITE.dataSource.cacheTTL,
  onlyAvailable = false,
} = {}) {
  let products = force ? null : readCache(CACHE_KEY, ttl);

  if (!products) {
    try {
      const rows = await fetchSheetRows(SITE.dataSource.csvUrl);
      products = toProductList(rows);
      writeCache(CACHE_KEY, products);
    } catch (error) {
      // Sin red: mostrar el último catálogo conocido aunque esté vencido.
      products = readCache(CACHE_KEY, 0);
      if (!products) throw error;
    }
  }

  return onlyAvailable ? filterAvailable(products) : products;
}

export function invalidateCatalog() {
  clearCache(CACHE_KEY);
}
