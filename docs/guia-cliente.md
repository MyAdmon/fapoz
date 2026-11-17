# Cómo actualizar tu menú desde el celular

Tu menú vive en un archivo de **Google Sheets** (lo encuentras en la app *Google Sheets*, con tu cuenta de Google).
Lo que cambies ahí aparece en el QR en **1 a 5 minutos**. No hay que guardar nada: se guarda solo.

## Menú del día (pestaña `menu_del_dia`)

- **Cambiar un plato** (sopa, arroz, jugos…): toca la celda de la columna **opciones** y escribe.
- **Varias opciones con viñetas** (como las proteínas): sepáralas con punto y coma.
  Ejemplo: `Punta de anca; Churrasco; Solomito`
- **Cambiar el precio**: fila **PRECIO**, columna **opciones** → `19000`.
- **Agregar una sección** (ej. POSTRE): fila nueva con el nombre en **categoria** y el texto en **opciones**.
- **Un día sin menú del día**: borra las filas de abajo y deja solo la primera (los títulos). La pestaña desaparece del QR.

## Carta (pestaña `carta`)

- **Cambiar un precio**: columna **precio**, solo el número → `32000`.
- **Plato agotado**: en **disponible** escribe `no`. Sale "Agotado". Cuando vuelva, escribe `sí`.
- **Plato nuevo**: inserta una fila debajo de su sección y escribe la **categoria** igual que las demás
  (mismas mayúsculas y tildes), el **nombre**, la **descripcion** y el **precio**. La columna **id** puedes dejarla vacía.
- **Quitar un plato**: borra la fila.
- **Cambiar el orden**: el menú sale en el mismo orden de las filas.

## No toques

- La **fila 1** (los títulos de las columnas).

## ¿No ves el cambio?

Espera unos minutos y recarga la página (desliza hacia abajo en el celular).
