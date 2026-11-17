# FAPOZ — guía para Claude

## Producto

Plataforma de **marca blanca** para restaurantes. Meta: POS completo (ventas, inventario, cocina, administración).
Hoy: **fase 1 = menú público por QR** (menú del día + carta), en producción para el restaurante piloto **La Avenida**.
"La Avenida" es solo el piloto: nada en `menu/` ni `shared/` puede depender de ese nombre; lo propio del restaurante va en su carpeta.

## Reglas

- **Push a `main` = producción** para el cliente (GitHub Pages, ~1 min). Verificar antes de hacer push.
- **Repo público** (MyAdmon/fapoz): nunca secretos, tokens ni datos personales. Commits con la identidad local del repo (email noreply de GitHub); no cambiarla.
- Sitio estático: HTML + ES modules + CSS. Sin build, sin npm, sin framework. Dependencias solo por CDN con versión exacta (papaparse 5.4.1, qrcode-generator 1.4.4).
- **Datos solo por `shared/js/catalog.js`**. Las vistas (`menu/`) nunca importan `sheets.js` ni `cache.js`. Cuando llegue la base de datos del POS, se cambia `catalog.js`, no las vistas.
- Dominio puro (`products.js`, `daily-menu.js`): sin DOM ni red, probado con `node --test`. Si cambia cómo se interpreta una hoja, se actualiza `tests/dominio.test.mjs`.
- `Product.id` es la llave del futuro POS: estable, no reutilizar.
- **Restaurante = carpeta en la raíz** (`<slug>/`): `index.html` (plantilla), `config.js`, logo, `carta.csv`, `menu-del-dia.csv`, QR. Su URL es la del QR impreso: **no renombrar ni mover una carpeta de restaurante cuyo QR ya se imprimió**. Slugs reservados: `menu`, `shared`, `docs`, `tests`, `pos`, `admin`, `cocina`.
- Todo texto visible y nombres de columnas en español. Móvil primero: la usan comensales desde el celular.
- La solución más corta que funcione. Nada de abstracciones "para después".

## Datos

- Fuente por restaurante en `config.js → hojas.{carta, menuDelDia}`: URL CSV publicada de Google Sheets o, mientras no exista, el `.csv` de su carpeta.
- Formato de columnas y montaje del Sheet: `docs/hojas.md`. Guía para el dueño: `docs/guia-cliente.md`.
- Red primero (`cache: "no-store"`); sin red, último dato en `localStorage`. Google tarda 1–5 min en republicar.
- Hoja del menú del día vacía = pestaña oculta.

## Comandos

- Servidor local (desde la raíz): `python3 -m http.server 8000` → `http://localhost:8000/<slug>/`
- Tests: `node --test`
- Estado del deploy: `gh api repos/MyAdmon/fapoz/pages/builds/latest --jq .status`

## Verificación visual

El navegador integrado puede rechazar `localhost`; usar Chrome headless (macOS):

```bash
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
# Celular: Chrome headless no baja de ~500 px de ancho, así que se envuelve en un iframe de 390 px.
T="${TMPDIR:-/tmp}"   # o el scratchpad de la sesión
echo '<body style="margin:0"><iframe src="http://127.0.0.1:8000/la-avenida/#carta" width="390" height="2300" style="border:0"></iframe>' > "$T/phone.html"
"$C" --headless=new --window-size=600,2300 --virtual-time-budget=9000 --screenshot=out.png "file://$T/phone.html"
# PDF de la tarjeta QR:
"$C" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf=qr.pdf "http://127.0.0.1:8000/menu/qr.html?r=la-avenida"
```

Por `file://` el sitio no carga (módulos y CORS del Sheet): siempre por http. Vistas: `#dia` y `#carta`.

## Pendientes y roadmap

Ver `README.md`.
