// Lee una hoja CSV (Google Sheets publicado en la web, o un .csv del repo) y devuelve filas crudas.
// Encabezados en minúscula. La normalización vive en el dominio (products.js, daily-menu.js).

import Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm";

export async function fetchSheetRows(csvUrl) {
  if (!csvUrl) throw new Error("Falta la URL de la hoja en config.js");

  // no-store: lo que el dueño edita debe verse al recargar, sin caché del navegador.
  const response = await fetch(csvUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`No se pudo leer la hoja (HTTP ${response.status})`);
  if ((response.headers.get("content-type") || "").includes("text/html")) {
    throw new Error("La URL de la hoja no es CSV: publícala como «Valores separados por comas (.csv)»");
  }

  const { data } = Papa.parse(await response.text(), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase(),
  });
  return data.filter((row) => Object.values(row).some((v) => String(v ?? "").trim()));
}
