// Utilidades de formato reutilizables por todos los módulos.

export function formatPrice(value, { currency = "COP", locale = "es-CO", decimals = 0 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

// Acepta listas separadas por coma o punto y coma (ej. "vegano;picante, sin-gluten")
export function splitList(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value).split(/[,;]/).map((v) => v.trim()).filter(Boolean);
}

export function slugify(str) {
  return String(str ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
