import { CONFIG } from "./config.js";
import { formatPrice, slugify } from "../shared/js/format.js";
import { groupByCategory } from "../shared/js/products.js";
import { getProducts, invalidateCatalog } from "../shared/js/catalog.js";

const priceOpts = { currency: CONFIG.moneda, locale: CONFIG.locale, decimals: CONFIG.decimales };

const state = { groups: [], query: "", searchIndex: new Map() };
let observer = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  applyBranding();
  wireUI();
  registerServiceWorker();
  renderSkeleton();

  try {
    const products = await loadProducts();
    setGroups(products);
    renderMenu();
    setStatus(`Actualizado a las ${timeNow()}`);
  } catch (error) {
    console.error("[menu]", error);
    renderError(error);
  }
}

// ---------- Datos ----------

async function loadProducts({ force = false } = {}) {
  return getProducts({
    force,
    ttl: CONFIG.cacheTTL,
    onlyAvailable: !CONFIG.mostrarAgotados,
  });
}

function setGroups(products) {
  state.groups = groupByCategory(products);
  state.searchIndex = new Map();
  for (const g of state.groups) {
    for (const p of g.items) {
      state.searchIndex.set(
        p.id,
        [p.nombre, p.descripcion, p.categoria, p.etiquetas.join(" ")].join(" ").toLowerCase()
      );
    }
  }
}

// ---------- Render ----------

function renderMenu() {
  const menu = document.getElementById("menu");
  const q = state.query.trim().toLowerCase();

  const groups = state.groups
    .map((g) => ({ ...g, items: q ? g.items.filter((p) => state.searchIndex.get(p.id)?.includes(q)) : g.items }))
    .filter((g) => g.items.length);

  if (!groups.length) {
    renderEmpty(q);
  } else {
    menu.innerHTML = groups.map(renderSection).join("");
    renderCategoryNav(groups);
    observeSections();
  }
}

function renderSection(group) {
  return `
    <section class="cat" id="cat-${slugify(group.categoria)}" data-cat="${escapeAttr(group.categoria)}">
      <h2 class="cat__title">${escapeHtml(group.categoria)}</h2>
      <div class="cat__grid">
        ${group.items.map(renderCard).join("")}
      </div>
    </section>`;
}

function renderCard(p) {
  const price = p.precioPromocional != null
    ? `<span class="price--old">${formatPrice(p.precio, priceOpts)}</span>
       <span class="price--promo">${formatPrice(p.precioPromocional, priceOpts)}</span>`
    : `<span class="price">${formatPrice(p.precio, priceOpts)}</span>`;

  const tags = p.etiquetas
    .map((t) => `<span class="tag tag--${slugify(t)}">${escapeHtml(t)}</span>`)
    .join("");

  const allergens = CONFIG.mostrarAlergenos && p.alergenos.length
    ? `<p class="card__allergens">Alérgenos: ${p.alergenos.map(escapeHtml).join(", ")}</p>`
    : "";

  const media = p.imagenUrl
    ? `<img class="card__img" src="${escapeAttr(p.imagenUrl)}" alt="${escapeAttr(p.nombre)}" loading="lazy" decoding="async" />`
    : `<div class="card__img card__img--ph" aria-hidden="true"></div>`;

  return `
    <article class="card${p.disponible ? "" : " is-disabled"}" data-id="${escapeAttr(p.id)}">
      <div class="card__media">${media}</div>
      <div class="card__body">
        <header class="card__head">
          <h3 class="card__name">${escapeHtml(p.nombre)}</h3>
          <div class="card__price">${price}</div>
        </header>
        ${p.descripcion ? `<p class="card__desc">${escapeHtml(p.descripcion)}</p>` : ""}
        ${tags ? `<div class="card__tags">${tags}</div>` : ""}
        ${allergens}
      </div>
    </article>`;
}

function renderCategoryNav(groups) {
  const nav = document.getElementById("catnav");
  nav.innerHTML = groups
    .map((g) => `<a class="chip" href="#cat-${slugify(g.categoria)}" data-cat="${escapeAttr(g.categoria)}">${escapeHtml(g.categoria)}</a>`)
    .join("");
}

function observeSections() {
  observer?.disconnect();
  const nav = document.getElementById("catnav");
  const links = new Map([...nav.querySelectorAll(".chip")].map((a) => [a.dataset.cat, a]));

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      links.forEach((a) => a.classList.remove("is-active"));
      const link = links.get(visible.target.dataset.cat);
      if (!link) return;
      link.classList.add("is-active");

      const target = link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2;
      nav.scrollTo({ left: target, behavior: "smooth" });
    },
    { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] }
  );

  document.querySelectorAll(".cat").forEach((s) => observer.observe(s));
}

// ---------- Estados ----------

function renderSkeleton() {
  document.getElementById("menu").innerHTML = Array.from({ length: 2 }, () => `
    <div class="skeleton">
      <div class="skeleton__title"></div>
      <div class="skeleton__card"></div>
      <div class="skeleton__card"></div>
    </div>`).join("");
  document.getElementById("catnav").innerHTML = "";
}

function renderEmpty(q) {
  document.getElementById("menu").innerHTML = `
    <div class="state">
      <p class="state__title">${q ? "Sin resultados" : "Menú no disponible"}</p>
      <p>${q ? `No encontramos platos para “${escapeHtml(q)}”.` : "Vuelve a intentarlo en unos minutos."}</p>
      ${q ? `<div class="state__actions"><button class="button" data-clear-search>Ver todo el menú</button></div>` : ""}
    </div>`;
  document.getElementById("catnav").innerHTML = "";
  document.querySelector("[data-clear-search]")?.addEventListener("click", () => {
    const search = document.getElementById("search");
    if (search) search.value = "";
    state.query = "";
    renderMenu();
  });
}

function renderError(error) {
  document.getElementById("menu").innerHTML = `
    <div class="state">
      <p class="state__title">No pudimos cargar el menú</p>
      <p>${escapeHtml(error?.message || "Error inesperado.")}</p>
      <div class="state__actions"><button class="button" id="retry">Reintentar</button></div>
    </div>`;
  document.getElementById("catnav").innerHTML = "";
  document.getElementById("retry")?.addEventListener("click", () => refresh());
}

// ---------- UI / utilidades ----------

function wireUI() {
  const search = document.getElementById("search");
  if (search && CONFIG.mostrarBuscador) {
    let timer;
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.query = search.value; renderMenu(); }, 150);
    });
  } else if (search) {
    document.getElementById("search-wrap")?.remove();
  }
  document.getElementById("refresh")?.addEventListener("click", () => refresh(true));
}

async function refresh(showToastFlag = false) {
  invalidateCatalog();
  renderSkeleton();
  try {
    const products = await loadProducts({ force: true });
    setGroups(products);
    renderMenu();
    setStatus(`Actualizado a las ${timeNow()}`);
    if (showToastFlag) toast("Menú actualizado");
  } catch (error) {
    console.error("[menu]", error);
    renderError(error);
    if (showToastFlag) toast("No se pudo actualizar");
  }
}

function applyBranding() {
  const { negocio } = CONFIG;
  document.title = `${negocio.nombre} · Menú`;
  setText("brand-name", negocio.nombre);
  setText("brand-slogan", negocio.eslogan || "");

  const logo = document.getElementById("brand-logo");
  if (logo && negocio.logo) { logo.src = negocio.logo; logo.alt = negocio.nombre; }

  if (negocio.colorMarca) {
    document.documentElement.style.setProperty("--color-brand", negocio.colorMarca);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", negocio.colorMarca);
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((err) => console.warn("[sw]", err));
    });
  }
}

let toastTimer;
function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
}

function setStatus(text) { setText("status", text); }
function timeNow() { return new Date().toLocaleTimeString(CONFIG.locale, { hour: "2-digit", minute: "2-digit" }); }
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
function escapeAttr(value) { return escapeHtml(value); }
