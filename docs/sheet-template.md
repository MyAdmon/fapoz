# Plantilla del Google Sheet

## Columnas (fila 1, encabezados en minúsculas y con guion bajo)

| Columna | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | texto | ✅ | Único y estable. El POS lo usará para las órdenes. Ej: `pf-01` |
| `categoria` | texto | ✅ | Nombre de la sección. Ej: `Entradas` |
| `categoria_orden` | número | | Orden de la sección (1,2,3…). Igual para toda la categoría. |
| `nombre` | texto | ✅ | Nombre del plato |
| `descripcion` | texto | | Descripción corta |
| `precio` | número | ✅ | Solo dígitos (ej. `12000`). No uses puntos ni símbolos. |
| `precio_promocional` | número | | Si lo llenas, se muestra precio tachado + promo |
| `disponible` | checkbox | ✅ | Inserta como **casilla de verificación** (menú Insertar → Casilla) |
| `imagen_url` | url | | URL completa o ruta del repo (ej. `./img/plato.jpg`) |
| `etiquetas` | texto | | Separadas por `;` o `,`. Ej: `vegano;picante` |
| `alergenos` | texto | | Separados por `;` o `,`. Ej: `gluten;lacteos` |
| `orden` | número | | Orden del plato dentro de su categoría |
| `nombre_en` | texto | | (Opcional) Nombre en inglés |
| `descripcion_en` | texto | | (Opcional) Descripción en inglés |

## Publicar como CSV

1. En el Sheet: **Archivo → Compartir → Publicar en la web**.
2. En la pestaña "Enlaces", selecciona la hoja y elige formato **CSV**.
3. Pulsa **Publicar**. Copia la URL generada (se ve así):
   ```
   https://docs.google.com/spreadsheets/d/e/2PACX.../pub?gid=0&single=true&output=csv
   ```
4. Pega esa URL en `shared/config.js` → `SITE.dataSource.csvUrl`.

> Cada cambio que guardes en el Sheet se refleja al instante (no hace falta republicar).

## Consejos

- Crea una **hoja separada por categoría** solo si es necesario; una sola hoja es más simple.
- Congela la fila 1 (**Ver → Inmovilizar → 1 fila**).
- Usa **Validación de datos** en `categoria` y `etiquetas` para evitar typos (`Limpio` no es `limpio`).
- Las imágenes de Google Drive **no funcionan bien** por CORS. Súbelas al repo (`menu/img/`) o a un CDN gratuito (Cloudinary, ImgBB).
- Para probar rápido: importa `docs/menu-sample.csv` en un Sheet nuevo (Archivo → Importar).

---

# Hoja del menú del día (La Avenida)

Hoja aparte (pestaña nueva en el mismo Sheet o un Sheet propio del restaurante). Cada fila es una sección del póster, **en el orden en que aparece**.

| Columna | Descripción |
|---|---|
| `categoria` | Título de la sección. Ej: `SOPA`. Una fila con `PRECIO` lleva el valor del menú en `opciones`. |
| `icono` | `sopa`, `arroz`, `ensalada`, `papas`, `carne` o `jugo`. Vacío = ícono de sopa. |
| `subtitulo` | (Opcional) Ej: `Todas a 120 gramos` |
| `opciones` | Texto. Separa con `;` para mostrar viñetas (`Punta de anca; Churrasco`). Las comas se muestran tal cual. |

## Ponerla en marcha

1. Importa `docs/la-avenida-sample.csv` en una pestaña nueva (Archivo → Importar → **Insertar nuevas hojas**).
2. **Archivo → Compartir → Publicar en la web** → elige **esa pestaña** y formato **CSV** → Publicar.
3. Pega la URL en `la-avenida/config.js` → `csvUrl` y sube el cambio a GitHub (solo esta vez).

Desde ahí, el menú del día se cambia editando la hoja en el celular. Si la hoja falla, el póster muestra el último menú que cargó; si nunca cargó, usa el `menu` de `config.js`.
