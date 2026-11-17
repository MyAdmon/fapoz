import { CONFIG } from "./config.js";
import { fetchSheetRows } from "../shared/js/sheets.js";
import { readCache, writeCache } from "../shared/js/cache.js";
import { toNumber } from "../shared/js/products.js";

const { negocio, moneda, locale } = CONFIG;
let { precio, menu } = CONFIG;

const GOLD = "#F5B700";
const CACHE_KEY = "la-avenida:menu:v1";

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadMenu();
  if (data) ({ menu, precio } = data);
  document.getElementById("app").innerHTML = render();
});

/* ---- Datos: hoja del menú del día → último menú cargado → config.js ---- */
async function loadMenu() {
  if (!CONFIG.csvUrl) return null;
  try {
    const data = fromRows(await fetchSheetRows(CONFIG.csvUrl));
    writeCache(CACHE_KEY, data);
    return data;
  } catch (error) {
    console.warn("[la-avenida]", error);
    return readCache(CACHE_KEY, 0);
  }
}

// Filas: categoria | icono | subtitulo | opciones (separadas por ";" = lista).
// Una fila con categoria "PRECIO" lleva el valor en `opciones`.
function fromRows(rows) {
  let price = CONFIG.precio;
  const items = [];
  for (const r of rows) {
    const categoria = String(r.categoria ?? "").trim();
    const opciones = String(r.opciones ?? "").trim();
    if (!categoria) continue;
    if (/^(precio|valor)$/i.test(categoria)) { price = toNumber(opciones) || price; continue; }
    const lista = opciones.split(";").map((o) => o.trim()).filter(Boolean);
    items.push({
      categoria,
      icono: String(r.icono ?? "").trim().toLowerCase(),
      subtitulo: String(r.subtitulo ?? "").trim(),
      opciones: lista.length > 1 ? lista : opciones,
    });
  }
  if (!items.length) throw new Error("La hoja del menú del día está vacía");
  return { menu: items, precio: price };
}

function render() {
  return defs() + cloth() + veg() + `
    <div class="poster">
      ${header()}
      ${title()}
      ${menuList()}
      ${priceRibbon()}
      ${infoBox()}
      ${slogan()}
    </div>`;
}

/* ---- Gradientes compartidos ---- */
function defs() {
  return `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>
    <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFE063"/><stop offset=".5" stop-color="#F5B700"/><stop offset="1" stop-color="#B8860B"/>
    </linearGradient>
    <linearGradient id="fl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFC93C"/><stop offset="1" stop-color="#E08600"/>
    </linearGradient>
  </defs></svg>`;
}

/* ---- Mantel a cuadros ---- */
function cloth() {
  return `
    <div class="cloth cloth--tl" aria-hidden="true"><div class="cloth__pattern"></div></div>
    <div class="cloth cloth--br" aria-hidden="true"><div class="cloth__pattern"></div></div>`;
}

/* ---- Decoración vegetal lateral ---- */
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
    <svg class="veg veg--right" width="96" height="230" viewBox="0 0 96 230" aria-hidden="true" style="transform:scaleX(-1)">${cluster}
      <path d="M64 30 q10 -14 22 -16" fill="none" stroke="#9aa0a6" stroke-width="2" opacity=".35"/>
      <path d="M60 44 q12 -10 24 -8" fill="none" stroke="#9aa0a6" stroke-width="2" opacity=".28"/>
    </svg>`;
}

/* ---- HEADER ---- */
function header() {
  return `
    <header class="top">
      <p class="script script--left">Buena<br>Comida<br>Buenas<br>Historias</p>
      <div class="emblem">
        ${emblemArt()}
        <span class="emblem__text">
          <span class="emblem__name">${negocio.nombre}</span>
          <span class="emblem__sub">${negocio.subtitulo}</span>
        </span>
        <span class="emblem__tag">${negocio.eslogan}</span>
      </div>
      <p class="script script--right">Aquí<br>se disfruta<br>la buena<br>mesa</p>
    </header>`;
}

/* ---- Emblema ornamentado (gorro + placa + cinta) ---- */
function emblemArt() {
  return `<svg class="emblem__art" viewBox="0 0 200 150" fill="none" aria-hidden="true">
    <!-- gorro de chef -->
    <g transform="translate(100,12)">
      <circle cx="-9" cy="-2" r="8.5" fill="url(#gg)"/>
      <circle cx="9" cy="-2" r="8.5" fill="url(#gg)"/>
      <circle cx="0" cy="-7" r="9.5" fill="url(#gg)"/>
      <rect x="-12" y="5" width="24" height="9" rx="2.5" fill="#E0A100"/>
      <line x1="-8" y1="9.5" x2="8" y2="9.5" stroke="#8a6400" stroke-width="1"/>
    </g>
    <!-- scrollwork superior -->
    <path d="M66 30 Q100 19 134 30" stroke="url(#gg)" stroke-width="2" fill="none"/>
    <path d="M66 30 q-6 -6 -12 -3 q6 1 8 6 z" fill="#F5B700"/>
    <path d="M134 30 q6 -6 12 -3 q-6 1 -8 6 z" fill="#F5B700"/>
    <!-- placa -->
    <path d="M26 42 Q100 31 174 42 L180 46 L174 78 Q100 90 26 78 L20 46 Z" fill="#160e00" stroke="url(#gg)" stroke-width="2.5"/>
    <path d="M31 47 Q100 37.5 169 47 L173 50 L169 73 Q100 83 31 73 L27 50 Z" fill="none" stroke="#B8860B" stroke-width="1" opacity=".8"/>
    <path d="M20 46 l-8 -4 l0 40 l8 -4 z" fill="#F5B700" opacity=".9"/>
    <path d="M180 46 l8 -4 l0 40 l-8 -4 z" fill="#F5B700" opacity=".9"/>
    <!-- cinta inferior -->
    <path d="M38 106 L162 106 L174 114 L162 122 L38 122 L26 114 Z" fill="#160e00" stroke="url(#gg)" stroke-width="2"/>
    <path d="M44 110 L156 110 L164 114 L156 118 L44 118 L36 114 Z" fill="none" stroke="#B8860B" stroke-width=".8" opacity=".7"/>
    <g stroke="#F5B700" stroke-width="1.6" stroke-linecap="round">
      <line x1="52" y1="108" x2="52" y2="120"/><line x1="50" y1="108" x2="50" y2="113"/><line x1="54" y1="108" x2="54" y2="113"/>
      <line x1="148" y1="108" x2="148" y2="120"/><line x1="146" y1="108" x2="146" y2="113"/><line x1="150" y1="108" x2="150" y2="113"/>
    </g>
  </svg>`;
}

/* ---- Título MENÚ DEL DÍA ---- */
function title() {
  return `
    <section class="title">
      ${flourish("l")}
      ${flourish("r")}
      <h1 class="title__word title__menu">MENÚ</h1>
      <span class="title__word title__day">DEL DÍA</span>
    </section>`;
}

function flourish(side) {
  const flip = side === "r" ? ' style="transform:scaleX(-1)"' : "";
  return `<svg class="title__flourish title__flourish--${side}" viewBox="0 0 60 90" fill="url(#fl)" aria-hidden="true"${flip}>
    <path d="M54 45 q-24 -6 -40 -30 q26 3 40 30 z"/>
    <path d="M52 48 q-26 3 -44 16 q24 6 44 -16 z" opacity=".92"/>
    <path d="M55 43 q-18 3 -24 -20 q18 5 24 20 z" opacity=".85"/>
  </svg>`;
}

/* ---- LISTA DEL MENÚ ---- */
function menuList() {
  const rows = menu.map((item, i) => {
    const inner = Array.isArray(item.opciones)
      ? `<ul class="row__list">${item.opciones.map((o) => `<li>${escHtml(o)}</li>`).join("")}</ul>`
      : `<p class="row__desc">${escHtml(item.opciones)}</p>`;
    const sub = item.subtitulo ? `<p class="row__sub">${escHtml(item.subtitulo)}</p>` : "";
    const sep = i > 0 ? rombos() : "";
    return `${sep}
      <div class="row">
        <div class="row__icon">${categoryIcon(item.icono)}</div>
        <div class="row__bar" aria-hidden="true"></div>
        <div class="row__body">
          <h2 class="row__cat">${escHtml(item.categoria)}</h2>
          ${sub}
          ${inner}
        </div>
      </div>`;
  }).join("");
  return `<div class="menu-list">${rows}</div>`;
}

function rombos() {
  return `<div class="rombos" aria-hidden="true"><span></span><span></span><span></span></div>`;
}

/* ---- ÍCONOS DE CATEGORÍA (line-art dorado) ---- */
function categoryIcon(name) {
  const s = `fill="none" stroke="${GOLD}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    sopa: `<svg viewBox="0 0 64 64" ${s}>
      <path d="M12 30 h40 c0 13 -9 21 -20 21 s-20 -8 -20 -21 z" fill="#F5B700" fill-opacity=".14"/>
      <ellipse cx="32" cy="30" rx="20" ry="4.6"/>
      <path d="M23 22 q3 -5 0 -10" stroke-opacity=".85"/>
      <path d="M32 20 q3 -5 0 -10" stroke-opacity=".85"/>
      <path d="M41 22 q3 -5 0 -10" stroke-opacity=".85"/>
    </svg>`,
    arroz: `<svg viewBox="0 0 64 64" ${s}>
      <path d="M12 32 c0 12 9 20 20 20 s20 -8 20 -20 z" fill="#F5B700" fill-opacity=".14"/>
      <path d="M12 32 q20 9 40 0"/>
      <path d="M18 32 q14 -15 28 0" stroke-opacity=".9"/>
      <path d="M23 32 q9 -10 18 0" stroke-opacity=".7"/>
    </svg>`,
    ensalada: `<svg viewBox="0 0 64 64" ${s}>
      <path d="M12 34 c0 12 9 20 20 20 s20 -8 20 -20 z" fill="#F5B700" fill-opacity=".14"/>
      <path d="M12 34 h40"/>
      <path d="M21 34 q-6 -16 4 -20 q6 6 4 20"/>
      <path d="M39 34 q6 -16 -4 -20 q-6 6 -4 20"/>
      <path d="M30 34 q-3 -18 2 -22 q5 4 2 22"/>
    </svg>`,
    papas: `<svg viewBox="0 0 64 64" ${s}>
      <ellipse cx="22" cy="38" rx="15" ry="9.5" fill="#F5B700" fill-opacity=".14"/>
      <path d="M11 40 q11 7 22 0"/>
      <path d="M40 24 l4 22" stroke-width="3.2"/>
      <path d="M47 24 l3 22" stroke-width="3.2"/>
      <path d="M54 27 l2 19" stroke-width="3.2"/>
      <path d="M38 42 h22" stroke-width="2.6"/>
    </svg>`,
    carne: `<svg viewBox="0 0 64 64" ${s}>
      <ellipse cx="32" cy="41" rx="23" ry="12" fill="#F5B700" fill-opacity=".14"/>
      <ellipse cx="32" cy="41" rx="23" ry="12"/>
      <path d="M18 41 h28" stroke-opacity=".55"/>
      <path d="M22 37 q6 -3 12 0" stroke-opacity=".55"/>
      <path d="M26 24 q3 -5 0 -10" stroke-opacity=".8"/>
      <path d="M38 24 q3 -5 0 -10" stroke-opacity=".8"/>
    </svg>`,
    jugo: `<svg viewBox="0 0 64 64" ${s}>
      <path d="M22 22 l3 30 h14 l3 -30 z" fill="#F5B700" fill-opacity=".12"/>
      <path d="M22 22 h20"/>
      <path d="M30 9 l7 15" stroke-width="2.6"/>
      <circle cx="47" cy="42" r="9.5" fill="#F5B700" fill-opacity=".12"/>
      <path d="M47 32.5 v19 M37.5 42 h19" stroke-width="1"/>
      <path d="M40 35 l14 14 M54 35 l-14 14" stroke-width="1" stroke-opacity=".7"/>
    </svg>`,
  };
  return icons[name] || icons.sopa;
}

/* ---- BANNER DE PRECIO ---- */
function priceRibbon() {
  const f = new Intl.NumberFormat(locale, { style: "currency", currency: moneda, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(precio);
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
          <span class="price-ribbon__value">${f}</span>
        </div>
      </div>
    </div>`;
}

/* ---- CAJA DE INFORMACIÓN ---- */
function infoBox() {
  const wa = String(negocio.whatsapp).replace(/\s/g, "");
  return `
    <div class="info-wrap">
      <div class="info-box">
        <div class="info-item">
          ${pinIcon()}
          <span class="info-item__text">${negocio.ubicacion.replace(" / ", "<br>")}</span>
        </div>
        <div class="info-sep" aria-hidden="true"></div>
        <a class="info-item" href="https://wa.me/57${wa}" target="_blank" rel="noopener">
          ${motoIcon()}
          <span class="info-item__text"><strong>Domicilio</strong><br>${waIcon()} ${negocio.whatsapp}</span>
        </a>
      </div>
    </div>`;
}

function pinIcon() {
  return `<svg viewBox="0 0 34 40" aria-hidden="true"><path d="M17 3 a10.5 10.5 0 0 0 -10.5 10.5 c0 7 10.5 17 10.5 17 s10.5 -10 10.5 -17 A10.5 10.5 0 0 0 17 3 z" fill="#F5B700"/><circle cx="17" cy="13.5" r="4" fill="#000"/></svg>`;
}

function motoIcon() {
  return `<svg viewBox="0 0 46 34" fill="none" stroke="#F5B700" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="25" r="6"/><circle cx="35" cy="25" r="6"/><path d="M11 25 l7 -12 h8 l5 12"/><path d="M18 13 h11"/><path d="M31 13 l4 6"/></svg>`;
}

function waIcon() {
  return `<svg style="display:inline-block;vertical-align:-4px;width:18px;height:18px" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="#25D366"/><path d="M25 20.4c-.5 1.4-2.2 2.3-3.9 2.3-3 0-7-2.8-8.9-6.5-1.1-2.1-.9-4 .3-5.1.6-.5 1.5-.5 2 0l1.5 1.9c.4.5.3 1.1 0 1.6l-.7 1c.8 1.5 2.1 2.8 3.6 3.6l1-.7c.5-.3 1.1-.3 1.6.1l1.9 1.5c.6.5.6 1.4.1 1.9z" fill="#fff"/></svg>`;
}

/* ---- SLOGAN ---- */
function slogan() {
  return `<p class="slogan">${negocio.esloganFooter}</p>`;
}

/* ---- util ---- */
function escHtml(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}