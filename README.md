# FAPOZ

Monorepo del sistema de restaurante. Cada carpeta es un **módulo** independiente que comparte la capa `shared/`.

> ⚠️ **No renombres ni muevas `menu/` ni `la-avenida/`**: la URL de cada carpeta es la que va impresa en los QR.

**En vivo** (GitHub Pages, se publica solo al hacer `git push` a `main`):
- La Avenida: https://jeancarlost.github.io/FAPOZ/la-avenida/
- Menú: https://jeancarlost.github.io/FAPOZ/menu/

| Módulo | Estado | Descripción |
|---|---|---|
| `menu/` | ✅ listo (con datos de ejemplo) | Menú digital por QR (SPA sin backend) |
| `la-avenida/` | ✅ listo | Póster "Menú del día" de La Avenida. Lee su propia hoja de Google Sheets (respaldo en `la-avenida/config.js`) |
| `pos/` | 🔜 planeado | Punto de venta / facturación |
| `cocina/` | 🔜 planeado | Pantalla de comandas |
| `admin/` | 🔜 planeado | Panel de administración |

---

## 🧭 Arquitectura (leer antes de tocar nada)

El sistema sigue una idea simple:

> **Los datos son un dominio compartido. Cada módulo es una "vista" sobre ese dominio.**

```
                 ┌──────────────────────────────┐
                 │   shared/  (dominio común)    │
                 │                               │
                 │  config.js    fuente de datos │
                 │  js/catalog.js  ──────────────┼──► única puerta a los productos
                 │  js/products.js  (Product)    │
                 │  js/{format,cache,sheets}.js  │
                 │  styles/  tokens + base       │
                 └──────────────┬───────────────┘
                                │  getProducts()
                ┌───────────────┴───────────────┐
                │                               │
          ┌─────▼─────┐                   ┌─────▼─────┐
          │  menu/    │                   │  pos/     │   (futuro)
          │  (vista)  │                   │  (vista)  │
          └───────────┘                   └───────────┘
```

### ¿Por qué existe `shared/js/catalog.js`?

Es un **repositorio**: el punto **único** de acceso a los productos. El menú nunca importa `sheets.js`, `cache.js` ni conoce la URL del Sheet. Solo llama:

```js
const products = await getProducts({ onlyAvailable: true });
```

**El motivo:** hoy el menú solo **lee** datos. Mañana el POS necesitará **escribir** (crear órdenes, facturas). Si el menú accediera directo a la fuente, ese cambio obligaría a tocar el menú. Al aislar el acceso en `catalog.js`, cuando llegue el POS **solo se modifica ese archivo** y el menú queda intacto.

### Las 3 reglas que mantienen el POS como algo "aditivo"

1. **`id` estable en el Sheet.** Es la llave que el POS usará para las órdenes. Nunca lo reutilices ni lo cambies.
2. **El dominio (`products.js`) no cambia.** `Product` es el mismo objeto para el menú y para el POS.
3. **Ningún módulo accede a los datos por fuera de `catalog.js`.** Los módulos son vistas; no dueños de la fuente.

Si respetas esto, arrancar el POS será **agregar** carpetas (`pos/`, `shared/js/orders.js`), no reescribir el proyecto.

---

## Cómo funciona el módulo `menu`

```
Cliente escanea QR → GitHub Pages (SPA) → getProducts() → CSV publicado del Sheet → render
```

- **Datos**: Google Sheets publicado como CSV (editable desde el celular). Sin backend, sin cuotas de API.
- **Diseño**: 100% código, en `shared/styles/tokens.css` + `menu/menu.css`.
- **El QR es permanente**: apunta a una URL fija. Cambiar datos o diseño no lo invalida.

---

## Puesta en marcha

1. **Crea el Sheet** siguiendo `docs/sheet-template.md` (o importa `docs/menu-sample.csv`).
2. **Publícalo como CSV** (Archivo → Compartir → Publicar en la web → formato CSV).
3. **Configura la fuente de datos** en `shared/config.js` → `SITE.dataSource.csvUrl`.
4. Ajusta la marca en `menu/config.js` (`negocio.nombre`, `eslogan`, `logo`).
5. **Sube el repo a GitHub** y activa **Settings → Pages → Deploy from a branch → main / root**.
6. Tu menú queda en: `https://<usuario>.github.io/FAPOZ/menu/` (ya hecho: ver **En vivo** arriba).
7. **Genera el QR** apuntando a esa URL (QR Code Monkey, gratis, sin vencimiento). Imprímelo en acrílicos de mínimo 4×4 cm.

### Probar en local

Necesita un servidor (por los ES Modules y el service worker):

```bash
cd FAPOZ
python3 -m http.server
# abre http://localhost:8000/menu/
```

---

## Administración diaria

Desde la app **Google Sheets** en tu celular:

- **Cambiar precio** → edita la columna `precio`.
- **Agotar un plato** → desmarca `disponible`.
- **Agregar plato** → nueva fila al final con su `id` y datos.

Los cambios se ven al instante. El menú cachea 5 minutos; el botón ↻ fuerza la recarga. Sin internet muestra el último menú que cargó.

### Menú del día de La Avenida

Se edita desde Google Sheets en el celular, en su propia hoja (formato y puesta en marcha en `docs/sheet-template.md`). Mientras `csvUrl` esté vacío en `la-avenida/config.js`, se usan `menu` y `precio` de ese archivo. Probar en `http://localhost:8000/la-avenida/`.

---

## Pendientes

- [x] **Control de versiones**: repo en https://github.com/JeanCarlosT/FAPOZ con GitHub Pages activo.
- [ ] **Sheet real**: el Sheet publicado tiene los datos de ejemplo y 3 filas corridas una columna (`post-01`, `beb-01`, `beb-03`). Corregirlas o reimportar `docs/menu-sample.csv` (ya corregido) y cargar el menú real.
- [ ] **Hoja de La Avenida**: el código ya la lee; falta crearla, publicarla y pegar la URL en `la-avenida/config.js` → `csvUrl` (ver `docs/sheet-template.md`).
- [ ] **QR**: generar e imprimir apuntando a la URL **En vivo** de cada módulo.
- [ ] **Íconos PWA en PNG** (192 y 512 px): iOS no usa SVG como `apple-touch-icon`.
- [ ] `la-avenida/sw.js` nunca se registra (bien para un menú diario: evita mostrar el menú de ayer). Borrarlo si no se va a usar.

---

## Personalización de diseño

| Quiero cambiar… | Archivo |
|---|---|
| Colores, tipografía, espaciado | `shared/styles/tokens.css` |
| Layout de tarjetas, hero, nav | `menu/menu.css` |
| Comportamiento (buscador, agotados, alérgenos) | `menu/config.js` |
| Fuente de datos, moneda, locale | `shared/config.js` |

---

## PWA

El menú es instalable y funciona offline (service worker en `menu/sw.js`). Si cambias código y quieres forzar la actualización en clientes que ya lo visitaron, sube la `VERSION` en `sw.js`.

---

## Roadmap (integración con el POS)

1. **`shared/js/orders.js`** — nuevo repositorio para órdenes/facturas (aditivo).
2. **`shared/js/catalog.js`** — se extiende con escritura o se cambia el backend (ej. Supabase) sin tocar los módulos.
3. **`pos/`** — carrito y facturación; reutiliza `getProducts()` y `products.js`.
4. Las tarjetas del menú ya exponen `data-id`, listas para un botón "Agregar al pedido".
5. **`cocina/`** y **`admin/`** — consumen el mismo dominio.

> Al llegar el POS, la carpeta `menu/` **no se toca**.
