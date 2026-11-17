// ============================================================
// DOMINIO: Menú del día.
// Columnas: categoria | icono (opcional) | subtitulo | opciones
// - "opciones" con ";" se muestran como lista con viñetas.
// - Una fila con categoria PRECIO lleva el valor del menú en "opciones".
// - Sin filas = hoy no hay menú del día (la pestaña se oculta).
// ============================================================

import { toNumber } from "./products.js";

export function toDailyMenu(rows) {
  let precio = null;
  const secciones = [];
  for (const r of rows) {
    const categoria = String(r.categoria ?? "").trim();
    const opciones = String(r.opciones ?? "").trim();
    if (!categoria) continue;
    if (/^(precio|valor)$/i.test(categoria)) {
      precio = toNumber(opciones);
      continue;
    }
    const lista = opciones.split(";").map((o) => o.trim()).filter(Boolean);
    secciones.push({
      categoria,
      icono: String(r.icono ?? "").trim().toLowerCase(),
      subtitulo: String(r.subtitulo ?? "").trim(),
      opciones: lista.length > 1 ? lista : opciones,
    });
  }
  return { secciones, precio };
}
