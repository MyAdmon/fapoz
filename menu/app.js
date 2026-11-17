// ============================================================
// Vista pública del restaurante: Menú del día + Carta en UNA sola URL (= un solo QR).
// Cada restaurante es una carpeta (ej. la-avenida/) con index.html + config.js
// que llama a start(config). Los datos llegan SOLO por shared/js/catalog.js.
// ============================================================

import { getCarta, getMenuDelDia } from "../shared/js/catalog.js";
import { escapeHtml as esc } from "../shared/js/format.js";
import { renderDia } from "./dia.js";
import { renderCarta } from "./carta.js";

export async function start(config) {
  const app = document.getElementById("app");
  app.innerHTML = `<p class="loading">Cargando menú…</p>`;

  const [dia, carta] = await Promise.allSettled([
    getMenuDelDia(config.hojas.menuDelDia),
    getCarta(config.hojas.carta),
  ]);

  // Pestañas en orden. El menú del día se oculta si hoy la hoja está vacía.
  const views = new Map();
  if (dia.status === "rejected" || dia.value.secciones.length) {
    views.set("dia", ["Menú del día", () => (dia.status === "fulfilled" ? renderDia(config, dia.value) : renderError(dia.reason))]);
  }
  views.set("carta", ["Carta", () => (carta.status === "fulfilled" ? renderCarta(config, carta.value) : renderError(carta.reason))]);

  const nav = views.size > 1
    ? `<nav class="tabs" aria-label="Secciones">${[...views]
        .map(([id, [label]]) => `<a href="#${id}" data-view="${id}">${label}</a>`)
        .join("")}</nav>`
    : "";
  app.innerHTML = `${nav}<main id="view"></main>`;

  const show = () => {
    const hash = location.hash.slice(1);
    const id = views.has(hash) ? hash : views.keys().next().value;
    for (const a of app.querySelectorAll(".tabs a")) {
      if (a.dataset.view === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
    document.getElementById("view").innerHTML = views.get(id)[1]();
  };

  addEventListener("hashchange", () => { show(); scrollTo(0, 0); });
  show();
}

function renderError(error) {
  console.error("[menu]", error);
  // TypeError = fallo de red del navegador ("Failed to fetch"); los demás son mensajes nuestros en español.
  const msg = error instanceof TypeError || !error?.message ? "Revisa tu conexión e inténtalo de nuevo." : error.message;
  return `
    <div class="state">
      <p class="state__title">No pudimos cargar el menú</p>
      <p>${esc(msg)}</p>
      <button class="state__btn" type="button" onclick="location.reload()">Reintentar</button>
    </div>`;
}
