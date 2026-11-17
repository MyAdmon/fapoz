// Acceso a datos desde un Google Sheet publicado como CSV.
// Es genérico: devuelve filas crudas (strings). La normalización vive en products.js
// para que el POS pueda reutilizar exactamente la misma fuente de datos.

import Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm";

export async function fetchSheetRows(csvUrl) {
  if (!csvUrl || /PEGA_TU_URL/i.test(csvUrl)) {
    throw new Error("Falta configurar la URL CSV publicada en shared/config.js");
  }

  const response = await fetch(csvUrl, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`No se pudo leer la hoja (HTTP ${response.status})`);
  }

  const text = await response.text();
  const { data } = Papa.parse(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim().toLowerCase(),
  });

  return (data || []).filter(
    (row) => row && Object.values(row).some((v) => String(v).trim() !== "")
  );
}
