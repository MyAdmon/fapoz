// Carta del restaurante (diseño crema con barras negras/doradas, como la carta en PDF del piloto).
// Productos de la hoja "carta", en el orden de la hoja.

import { escapeHtml as esc, formatPrice } from "../shared/js/format.js";
import { groupByCategory } from "../shared/js/products.js";
import { brand, infoBox } from "./dia.js";

export function renderCarta(config, products) {
  const money = { currency: config.moneda, locale: config.locale };
  const groups = groupByCategory(products);
  return `
    <div class="carta">
      <div class="carta__brand">${brand(config)}</div>
      <h1 class="carta__title">Carta</h1>
      ${groups.length
        ? groups.map((g) => section(g, money)).join("")
        : `<p class="carta__empty">Estamos actualizando la carta. Escríbenos por WhatsApp.</p>`}
      ${infoBox(config)}
    </div>`;
}

function section(group, money) {
  const nota = group.nota
    ? `<p class="cat__note">${group.nota.split(";").map((l) => esc(l.trim())).join("<br>")}</p>`
    : "";
  return `
    <section class="cat">
      <h2 class="cat__bar">${esc(group.categoria)}</h2>
      ${group.items.map((p) => dish(p, money)).join("")}
      ${nota}
    </section>`;
}

function dish(p, money) {
  const price = p.disponible ? formatPrice(p.precio, money) : "Agotado";
  return `
    <article class="dish${p.disponible ? "" : " is-out"}" data-id="${esc(p.id)}">
      <div class="dish__head">
        <h3 class="dish__name">${esc(p.nombre)}</h3>
        ${price ? `<span class="dish__price">${price}</span>` : ""}
      </div>
      ${p.descripcion ? `<p class="dish__desc">${esc(p.descripcion)}</p>` : ""}
    </article>`;
}
