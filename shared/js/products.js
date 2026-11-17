// ============================================================
// DOMINIO: Productos de la carta. Lo comparten el menú público y el futuro POS.
// Convierte filas crudas de la hoja en objetos estables.
// Columnas: id (opcional) | categoria | nombre | descripcion | precio | disponible | categoria_nota
// ============================================================

import { slugify } from "./format.js";

export function normalizeProduct(row) {
  const categoria = String(row.categoria ?? "").trim() || "Otros";
  const nombre = String(row.nombre ?? "").trim();
  return {
    // Llave que usará el POS. Si el dueño no la escribe, sale de categoría + nombre.
    id: String(row.id ?? "").trim() || slugify(`${categoria}-${nombre}`),
    categoria,
    nombre,
    descripcion: String(row.descripcion ?? "").trim(),
    precio: toNumber(row.precio), // null = sin precio publicado
    disponible: isAvailable(row.disponible),
    categoriaNota: String(row.categoria_nota ?? "").trim(),
  };
}

export function toProductList(rows) {
  return rows.map(normalizeProduct).filter((p) => p.nombre);
}

// Agrupa respetando el orden de la hoja: mover filas = reordenar el menú.
export function groupByCategory(products) {
  const groups = new Map();
  for (const p of products) {
    if (!groups.has(p.categoria)) groups.set(p.categoria, { categoria: p.categoria, nota: "", items: [] });
    const g = groups.get(p.categoria);
    g.items.push(p);
    g.nota ||= p.categoriaNota;
  }
  return [...groups.values()];
}

// Heurística: entiende "12000", "12.000", "$12.000", "12,50", "19.000,00".
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

// Vacío o "sí" = disponible. "no", "agotado", casilla desmarcada (FALSE) = agotado.
function isAvailable(value) {
  return !["no", "agotado", "false", "falso", "0"].includes(String(value ?? "").trim().toLowerCase());
}
