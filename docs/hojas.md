# Hojas de Google Sheets (una por restaurante)

Cada restaurante tiene **un** Google Sheet con dos pestañas: `carta` y `menu_del_dia`.
El dueño las edita desde la app **Google Sheets** del celular; la página las lee cada vez que alguien la abre.
Mientras el Sheet no exista, la página lee los CSV de la carpeta del restaurante (mismo formato).

## Montarlo (una vez por restaurante, ~10 min)

1. Abre https://sheets.new y nómbrala `<Restaurante> – Menú`.
2. Renombra `Hoja 1` a `carta`. En **A1**: `=IMPORTDATA("https://myadmon.github.io/fapoz/<restaurante>/carta.csv")`.
   Cuando carguen los datos: **Cmd+A → Cmd+C → Cmd+Shift+V** (pegar solo valores). A1 debe quedar como `id`, no como fórmula.
3. Nueva pestaña `menu_del_dia`, igual con `.../<restaurante>/menu-del-dia.csv`.
   (Requiere que los CSV de la carpeta ya estén publicados con `git push`.)
4. Inmoviliza la fila 1 en ambas (**Ver → Inmovilizar → 1 fila**). Opcional: en `carta`, columna `disponible` → **Insertar → Menú desplegable** con `sí` / `no`.
5. **Compartir** → agrega el correo del dueño como **Editor**.
6. **Archivo → Compartir → Publicar en la web** → pestaña *Vincular*:
   elige `carta` + **Valores separados por comas (.csv)** → **Publicar** → copia la URL.
   Repite eligiendo `menu_del_dia`. Deja activo *"Volver a publicar automáticamente cuando se realicen cambios"*.
7. Pega las URLs en `<restaurante>/config.js` → `hojas.carta` y `hojas.menuDelDia`. Commit + push.
8. Abre la URL del restaurante y revisa ambas pestañas.

> Usa la URL que termina en `output=csv`. Si pegas la de `pubhtml`, la página muestra
> "La URL de la hoja no es CSV".

## Pestaña `carta`

Una fila por plato. El menú sale **en el orden de las filas**.

| Columna | Obligatoria | Descripción |
|---|---|---|
| `id` | | Llave para el futuro POS (ej. `asa-01`). Si se deja vacía, se arma con categoría + nombre. No reutilizar. |
| `categoria` | ✅ | Sección (ej. `ASADOS AL CARBÓN`). Escrita **igual** en todos los platos de la sección. |
| `nombre` | ✅ | Nombre del plato. Fila sin nombre = se ignora. |
| `descripcion` | | Texto corto debajo del nombre. |
| `precio` | | `32000`, `32.000` o `$32.000`. Vacío = no se muestra precio. |
| `disponible` | | Vacío o `sí` = disponible. `no` / `agotado` (o casilla desmarcada) = se muestra "Agotado". |
| `categoria_nota` | | Texto al final de la sección (en cualquier plato de ella). `;` = salto de línea. |

## Pestaña `menu_del_dia`

Una fila por sección del póster, en el orden en que aparece.

| Columna | Descripción |
|---|---|
| `categoria` | Título (ej. `SOPA`). La fila `PRECIO` lleva el valor del menú en `opciones`. |
| `icono` | Opcional: `sopa`, `arroz`, `ensalada`, `papas`, `carne`, `jugo`, `plato`. Vacío = se adivina por el título. |
| `subtitulo` | Opcional (ej. `Todas a 120 gramos`). |
| `opciones` | Texto. Separado con `;` se muestra con viñetas (`Punta de anca; Churrasco`). Las comas se muestran tal cual. |

Sin filas (solo la fila 1 de títulos) = ese día no hay menú del día y la pestaña se oculta.

## Bueno saber

- Google tarda **1 a 5 minutos** en republicar. Después, basta recargar la página.
- No cambiar los títulos de la fila 1: la página busca las columnas por ese nombre.
- Si Google no responde, cada celular muestra el último menú que cargó.
