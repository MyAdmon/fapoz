// ============================================================
// DOMINIO: Productos. Esta capa la comparte el menú Y el futuro POS.
// Convierte filas crudas del Sheet en objetos tipados y estables.
// ============================================================

import { splitList } from "./format.js";

export function normalizeProduct(row) {
  return {
    id: String(row.id ?? "").trim(),
    categoria: String(row.categoria ?? "").trim() || "Otros",
    categoriaOrden: toNumber(row.categoria_orden) ?? 999,
    nombre: String(row.nombre ?? "").trim(),
    descripcion: String(row.descripcion ?? "").trim(),
    precio: toNumber(row.precio) ?? 0,
    precioPromocional: toNumber(row.precio_promocional),
    disponible: toBool(row.disponible),
    imagenUrl: String(row.imagen_url ?? "").trim(),
    etiquetas: splitList(row.etiquetas),
    alergenos: splitList(row.alergenos),
    orden: toNumber(row.orden) ?? 999,
    nombreEn: String(row.nombre_en ?? "").trim(),
    descripcionEn: String(row.descripcion_en ?? "").trim(),
  };
}

export function toProductList(rows) {
  return rows.map(normalizeProduct).filter((p) => p.nombre && p.id);
}

export function filterAvailable(products) {
  return products.filter((p) => p.disponible);
}

export function groupByCategory(products) {
  const groups = new Map();
  for (const p of products) {
    if (!groups.has(p.categoria)) {
      groups.set(p.categoria, { categoria: p.categoria, orden: p.categoriaOrden, items: [] });
    }
    groups.get(p.categoria).items.push(p);
  }
  const list = [...groups.values()];
  list.sort((a, b) => a.orden - b.orden || a.categoria.localeCompare(b.categoria, "es"));
  for (const g of list) {
    g.items.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, "es"));
  }
  return list;
}

// --- normalizadores ---

// Heurística: entiende "12000", "12.000", "12,50". (También la usa la-avenida/)
export function toNumber(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  let s = String(value).trim().replace(/[^\d.,-]/g, "");
  if (!s) return null;

  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && hasDot) {
    s = s.lastIndexOf(",") > s.lastIndexOf(".")
      ? s.replace(/\./g, "").replace(",", ".")
      : s.replace(/,/g, "");
  } else if (hasComma) {
    const parts = s.split(",");
    s = parts.length === 2 && parts[1].length <= 2 ? s.replace(",", ".") : s.replace(/,/g, "");
  } else if (hasDot) {
    const parts = s.split(".");
    s = parts.length === 2 && parts[1].length <= 2 ? s : s.replace(/\./g, "");
  }

  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function toBool(value) {
  if (value === true) return true;
  if (value === false) return false;
  return ["true", "1", "si", "sí", "yes", "x", "verdadero"].includes(
    String(value ?? "").trim().toLowerCase()
  );
}
