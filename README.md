# FAPOZ

Plataforma de marca blanca para restaurantes. Meta: un **POS completo** (ventas, inventario, cocina, administración).
**Fase actual: menú público por QR** — menú del día + carta en una sola URL, editable desde el celular con Google Sheets.

Restaurante piloto: **La Avenida** (el código no depende de ese nombre; cada restaurante es una carpeta).

- En vivo: https://jeancarlost.github.io/FAPOZ/la-avenida/
- QR imprimible (10 × 15 cm): [`la-avenida/qr-la-avenida.pdf`](la-avenida/qr-la-avenida.pdf)

## Estructura

```
menu/            Vista pública: pestañas "Menú del día" (póster) y "Carta", + qr.html (tarjeta QR)
shared/js/       Dominio y datos — catalog.js es la ÚNICA puerta a los datos
  catalog.js       repositorio: getCarta(), getMenuDelDia()  (red primero, sin red: último dato)
  products.js      Producto de la carta (lo reutilizará el POS)
  daily-menu.js    Menú del día
  sheets.js        lee CSV (Google Sheets publicado o .csv del repo)
  cache.js, format.js
la-avenida/      Un restaurante: index.html, config.js, logo, carta.csv, menu-del-dia.csv, QR
docs/            hojas.md (montar el Google Sheet) · guia-cliente.md (para el dueño)
tests/           node --test
```

Flujo: `QR → /<restaurante>/ → menu/app.js → shared/js/catalog.js → hoja CSV → render`. Sin backend.

## Día a día

- **El dueño** edita en Google Sheets desde el celular ([guía](docs/guia-cliente.md)). Se ve en 1–5 min.
- **Código**: `git push` a `main` = producción en ~1 min (GitHub Pages).

## Local

```bash
python3 -m http.server 8000
```
Abre `http://localhost:8000/la-avenida/` (por `file://` no funciona).

```bash
node --test
```

## Agregar un restaurante

1. Copia `la-avenida/` a `<slug>/` y cambia `config.js` (nombre, `url`, textos, WhatsApp), `logo.jpg`, los CSV y el `<title>`/`og:` de `index.html`.
2. Monta su Google Sheet ([docs/hojas.md](docs/hojas.md)) y pega las 2 URLs en `config.js`.
3. Abre `/menu/qr.html?r=<slug>` → Imprimir → Guardar como PDF (sin márgenes).

## Pendientes

- [ ] Crear el Google Sheet de La Avenida, compartirlo con el dueño y pegar las URLs ([docs/hojas.md](docs/hojas.md)).
- [ ] Confirmar con el cliente: precio de *Nachos con guacamole* (no tiene en el PDF) y "Carne de 270 g" en *Costilla BBQ* y *Pechuga* (la nota dice que solo churrasco, punta, solomito y cañón son 270 g).
- [ ] **Dominio propio antes de imprimir acrílicos**: el QR apunta a `jeancarlost.github.io`; si un día cambia el hosting, los QR impresos se rompen. Con dominio propio, se cambia `url` en `config.js` y se regenera el QR.
- [ ] Imprimir QR.

## Roadmap POS

1. Base de datos (ej. Supabase/Postgres) detrás de `shared/js/catalog.js`. Las vistas no cambian.
2. `admin/`: login del dueño para editar carta y menú del día (reemplaza Google Sheets).
3. `pos/`: pedidos y ventas usando `Product.id`.
4. Inventario (insumos por producto), `cocina/` (comandas) y reportes.
