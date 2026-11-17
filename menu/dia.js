// Póster "Menú del día" (diseño negro/dorado). Textos y logo vienen de config.js del restaurante;
// las secciones y el precio, de la hoja menu_del_dia.

import { escapeHtml as esc, formatPrice } from "../shared/js/format.js";

const GOLD = "#F5B700";

export function renderDia(config, { secciones, precio }) {
  return `${defs()}${veg()}
    <div class="poster">
      ${header(config)}
      ${title()}
      <div class="menu-list">${secciones.map(row).join(rombos())}</div>
      ${precio != null ? priceRibbon(config, precio) : ""}
      ${infoBox(config)}
      ${config.esloganFooter ? `<p class="slogan">${esc(config.esloganFooter)}</p>` : ""}
    </div>`;
}

/* ---- Marca: logo del restaurante o, si no hay, su nombre ---- */
export function brand(config) {
  return config.logo
    ? `<img class="brand" src="${esc(config.logo)}" alt="${esc(config.nombre)}" />`
    : `<p class="brand brand--text">${esc(config.nombre)}</p>`;
}

/* ---- Ubicación + domicilio por WhatsApp (también se usa en la carta) ---- */
export function infoBox(config) {
  const digits = String(config.whatsapp || "").replace(/\D/g, "");
  // ponytail: indicativo 57 (Colombia) fijo; agregar `pais` en config con el primer restaurante fuera de CO.
  const wa = digits.length === 10 ? `57${digits}` : digits;
  const msg = encodeURIComponent(`Hola ${config.nombre}, quiero hacer un pedido a domicilio`);
  const ubic = [].concat(config.ubicacion || []).map(esc).join("<br>");
  if (!ubic && !wa) return "";
  return `
    <div class="info-wrap">
      <div class="info-box">
        ${ubic ? `<div class="info-item">${pinIcon()}<span class="info-item__text">${ubic}</span></div>` : ""}
        ${ubic && wa ? `<div class="info-sep" aria-hidden="true"></div>` : ""}
        ${wa ? `<a class="info-item" href="https://wa.me/${wa}?text=${msg}" target="_blank" rel="noopener">
          ${motoIcon()}
          <span class="info-item__text"><strong>Domicilio</strong><br>${waIcon()} ${esc(config.whatsapp)}</span>
        </a>` : ""}
      </div>
    </div>`;
}

/* ---- Partes del póster ---- */
function header(config) {
  const lines = (arr) => [].concat(arr || []).map(esc).join("<br>");
  return `
    <header class="top">
      <p class="script script--left">${lines(config.textoIzquierda)}</p>
      ${brand(config)}
      <p class="script script--right">${lines(config.textoDerecha)}</p>
    </header>`;
}

function title() {
  return `
    <section class="title">
      ${flourish("l")}${flourish("r")}
      <h1 class="title__word title__menu">MENÚ</h1>
      <span class="title__word title__day">DEL DÍA</span>
    </section>`;
}

function flourish(side) {
  return `<svg class="title__flourish title__flourish--${side}" viewBox="0 0 60 90" fill="url(#fl)" aria-hidden="true">
    <path d="M54 45 q-24 -6 -40 -30 q26 3 40 30 z"/>
    <path d="M52 48 q-26 3 -44 16 q24 6 44 -16 z" opacity=".92"/>
    <path d="M55 43 q-18 3 -24 -20 q18 5 24 20 z" opacity=".85"/>
  </svg>`;
}

function row(item) {
  const body = Array.isArray(item.opciones)
    ? `<ul class="row__list">${item.opciones.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>`
    : `<p class="row__desc">${esc(item.opciones)}</p>`;
  return `
    <div class="row">
      <div class="row__icon">${iconFor(item)}</div>
      <div class="row__bar" aria-hidden="true"></div>
      <div class="row__body">
        <h2 class="row__cat">${esc(item.categoria)}</h2>
        ${item.subtitulo ? `<p class="row__sub">${esc(item.subtitulo)}</p>` : ""}
        ${body}
      </div>
    </div>`;
}

function rombos() {
  return `<div class="rombos" aria-hidden="true"><span></span><span></span><span></span></div>`;
}

function priceRibbon(config, precio) {
  const valor = formatPrice(precio, { currency: config.moneda, locale: config.locale });
  return `
    <div class="price-wrap">
      <div class="price-ribbon">
        <div class="price-ribbon__inner">
          <svg class="price-ribbon__icon" viewBox="0 0 48 48" aria-hidden="true">
            <ellipse cx="19" cy="33" rx="13" ry="7.5" fill="#FFD233" stroke="#8a6400" stroke-width="1.4"/>
            <ellipse cx="19" cy="27" rx="13" ry="7.5" fill="#FFE063" stroke="#8a6400" stroke-width="1.4"/>
            <ellipse cx="19" cy="21" rx="13" ry="7.5" fill="#FFD233" stroke="#8a6400" stroke-width="1.4"/>
            <ellipse cx="34" cy="30" rx="9" ry="5.5" fill="#FFE063" stroke="#8a6400" stroke-width="1.4"/>
            <ellipse cx="34" cy="25" rx="9" ry="5.5" fill="#FFD233" stroke="#8a6400" stroke-width="1.4"/>
          </svg>
          <span class="price-ribbon__label">Valor:</span>
          <span class="price-ribbon__value">${valor}</span>
        </div>
      </div>
    </div>`;
}

/* ---- Decoración ---- */
function defs() {
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFC93C"/><stop offset="1" stop-color="#E08600"/>
    </linearGradient>
  </defs></svg>`;
}

function veg() {
  const cluster = `
    <path d="M30 150 q26 -34 16 -78" fill="none" stroke="#3e7d1f" stroke-width="2.5"/>
    <ellipse cx="40" cy="112" rx="15" ry="7" fill="#4CAF50" opacity=".85" transform="rotate(-35 40 112)"/>
    <ellipse cx="34" cy="80" rx="15" ry="7" fill="#4CAF50" opacity=".85" transform="rotate(-60 34 80)"/>
    <ellipse cx="26" cy="52" rx="13" ry="6" fill="#5cbf3a" opacity=".85" transform="rotate(-80 26 52)"/>
    <circle cx="52" cy="176" r="20" fill="#C0392B"/>
    <circle cx="46" cy="169" r="6" fill="#e05545" opacity=".8"/>
    <circle cx="70" cy="196" r="10" fill="#b02f22"/>
    <circle cx="24" cy="200" r="9" fill="#c0392b"/>
    <circle cx="44" cy="212" r="7" fill="#e05545"/>`;
  return `
    <svg class="veg veg--left" width="96" height="230" viewBox="0 0 96 230" aria-hidden="true">${cluster}</svg>
    <svg class="veg veg--right" width="96" height="230" viewBox="0 0 96 230" aria-hidden="true" style="transform:scaleX(-1)">${cluster}</svg>`;
}

/* ---- Íconos de sección (line-art dorado). Si la hoja no trae "icono", se adivina por el nombre. ---- */
const GUESS = [
  [/sopa|crema|caldo|sancocho/i, "sopa"],
  [/arroz/i, "arroz"],
  [/ensalada/i, "ensalada"],
  [/acompa|papa|yuca|tajada|patac/i, "papas"],
  [/prote|carne|pollo|cerdo|\bres\b|pescado|asado/i, "carne"],
  [/jugo|bebida|refresco|limonada/i, "jugo"],
];

function iconFor(item) {
  const name = ICONS[item.icono] ? item.icono : GUESS.find(([re]) => re.test(item.categoria))?.[1];
  return ICONS[name] || ICONS.plato;
}

const S = `fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
const ICONS = {
  sopa: `<svg viewBox="0 0 64 64" ${S}>
    <path d="M12 30 h40 c0 13 -9 21 -20 21 s-20 -8 -20 -21 z" fill="${GOLD}" fill-opacity=".14"/>
    <ellipse cx="32" cy="30" rx="20" ry="4.6"/>
    <path d="M23 22 q3 -5 0 -10"/><path d="M32 20 q3 -5 0 -10"/><path d="M41 22 q3 -5 0 -10"/>
  </svg>`,
  arroz: `<svg viewBox="0 0 64 64" ${S}>
    <path d="M12 32 c0 12 9 20 20 20 s20 -8 20 -20 z" fill="${GOLD}" fill-opacity=".14"/>
    <path d="M12 32 q20 9 40 0"/><path d="M18 32 q14 -15 28 0"/><path d="M23 32 q9 -10 18 0" stroke-opacity=".7"/>
  </svg>`,
  ensalada: `<svg viewBox="0 0 64 64" ${S}>
    <path d="M12 34 c0 12 9 20 20 20 s20 -8 20 -20 z" fill="${GOLD}" fill-opacity=".14"/>
    <path d="M12 34 h40"/><path d="M21 34 q-6 -16 4 -20 q6 6 4 20"/>
    <path d="M39 34 q6 -16 -4 -20 q-6 6 -4 20"/><path d="M30 34 q-3 -18 2 -22 q5 4 2 22"/>
  </svg>`,
  papas: `<svg viewBox="0 0 64 64" ${S}>
    <ellipse cx="22" cy="38" rx="15" ry="9.5" fill="${GOLD}" fill-opacity=".14"/>
    <path d="M11 40 q11 7 22 0"/>
    <path d="M40 24 l4 22" stroke-width="3.2"/><path d="M47 24 l3 22" stroke-width="3.2"/>
    <path d="M54 27 l2 19" stroke-width="3.2"/><path d="M38 42 h22" stroke-width="2.6"/>
  </svg>`,
  carne: `<svg viewBox="0 0 64 64" ${S}>
    <ellipse cx="32" cy="41" rx="23" ry="12" fill="${GOLD}" fill-opacity=".14"/>
    <ellipse cx="32" cy="41" rx="23" ry="12"/>
    <path d="M18 41 h28" stroke-opacity=".55"/><path d="M22 37 q6 -3 12 0" stroke-opacity=".55"/>
    <path d="M26 24 q3 -5 0 -10"/><path d="M38 24 q3 -5 0 -10"/>
  </svg>`,
  jugo: `<svg viewBox="0 0 64 64" ${S}>
    <path d="M22 22 l3 30 h14 l3 -30 z" fill="${GOLD}" fill-opacity=".12"/>
    <path d="M22 22 h20"/><path d="M30 9 l7 15" stroke-width="2.6"/>
    <circle cx="47" cy="42" r="9.5" fill="${GOLD}" fill-opacity=".12"/>
    <path d="M47 32.5 v19 M37.5 42 h19" stroke-width="1"/>
  </svg>`,
  plato: `<svg viewBox="0 0 64 64" ${S}>
    <circle cx="32" cy="34" r="15" fill="${GOLD}" fill-opacity=".12"/><circle cx="32" cy="34" r="15"/>
    <path d="M10 14 v10 q0 4 3 4 q3 0 3 -4 v-10 M13 28 v24"/>
    <path d="M54 14 q-6 4 -6 15 h6 v23"/>
  </svg>`,
};

function pinIcon() {
  return `<svg viewBox="0 0 34 40" aria-hidden="true"><path d="M17 3 a10.5 10.5 0 0 0 -10.5 10.5 c0 7 10.5 17 10.5 17 s10.5 -10 10.5 -17 A10.5 10.5 0 0 0 17 3 z" fill="${GOLD}"/><circle cx="17" cy="13.5" r="4" fill="#000"/></svg>`;
}

function motoIcon() {
  return `<svg viewBox="0 0 46 34" fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="25" r="6"/><circle cx="35" cy="25" r="6"/><path d="M11 25 l7 -12 h8 l5 12"/><path d="M18 13 h11"/><path d="M31 13 l4 6"/></svg>`;
}

function waIcon() {
  return `<svg class="wa-icon" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="#25D366"/><path d="M25 20.4c-.5 1.4-2.2 2.3-3.9 2.3-3 0-7-2.8-8.9-6.5-1.1-2.1-.9-4 .3-5.1.6-.5 1.5-.5 2 0l1.5 1.9c.4.5.3 1.1 0 1.6l-.7 1c.8 1.5 2.1 2.8 3.6 3.6l1-.7c.5-.3 1.1-.3 1.6.1l1.9 1.5c.6.5.6 1.4.1 1.9z" fill="#fff"/></svg>`;
}
