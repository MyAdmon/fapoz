// ============================================================
// Configuración a nivel de SITIO: lo que comparten TODOS los módulos.
// La fuente de datos es única para el sistema entero (menú hoy, POS mañana).
// ============================================================

export const SITE = {
  dataSource: {
    // 👉 Pega aquí la URL CSV publicada de tu Google Sheet (ver docs/sheet-template.md)
    csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRarHbG6AIaGybA-EczDpo17eKckkedw4_6FR5jojboWay7cwurmcjbCmsBfkPT4kBeePTbSJeminGr/pub?output=csv",
    cacheTTL: 5 * 60 * 1000, // 5 minutos
  },
  moneda: "COP",
  locale: "es-CO",
  decimales: 0,
};
