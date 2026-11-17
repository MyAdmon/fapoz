// Corre con: node --test   (desde la raíz del repo)
// Cubre lo que interpreta las hojas que edita el dueño (precios, disponibilidad, menú del día).
import { test } from "node:test";
import assert from "node:assert/strict";
import { toNumber, normalizeProduct, groupByCategory } from "../shared/js/products.js";
import { toDailyMenu } from "../shared/js/daily-menu.js";

test("toNumber entiende formatos de precio colombianos", () => {
  assert.equal(toNumber("12000"), 12000);
  assert.equal(toNumber("12.000"), 12000);
  assert.equal(toNumber("$21.000"), 21000);
  assert.equal(toNumber("19.000,00"), 19000);
  assert.equal(toNumber("1.250.000"), 1250000);
  assert.equal(toNumber(""), null);
  assert.equal(toNumber("a convenir"), null);
});

test("producto: id automático, sin precio y agotado", () => {
  const p = normalizeProduct({ categoria: "ASADOS AL CARBÓN", nombre: "Cañón de cerdo", precio: "", disponible: "No" });
  assert.equal(p.id, "asados-al-carbon-canon-de-cerdo");
  assert.equal(p.precio, null);
  assert.equal(p.disponible, false);
  assert.equal(normalizeProduct({ nombre: "x", disponible: "" }).disponible, true);
  assert.equal(normalizeProduct({ nombre: "x", disponible: "TRUE" }).disponible, true);
  assert.equal(normalizeProduct({ nombre: "x", disponible: "FALSE" }).disponible, false);
});

test("carta: categorías en orden de la hoja con su nota", () => {
  const groups = groupByCategory([
    normalizeProduct({ categoria: "B", nombre: "b1" }),
    normalizeProduct({ categoria: "A", nombre: "a1", categoria_nota: "nota A" }),
    normalizeProduct({ categoria: "B", nombre: "b2" }),
  ]);
  assert.deepEqual(groups.map((g) => g.categoria), ["B", "A"]);
  assert.deepEqual(groups[0].items.map((p) => p.nombre), ["b1", "b2"]);
  assert.equal(groups[1].nota, "nota A");
});

test("menú del día: lista con ;, comas intactas, fila PRECIO, hoja vacía", () => {
  const { secciones, precio } = toDailyMenu([
    { categoria: "PROTEÍNAS", subtitulo: "120 g", opciones: "Res; Cerdo" },
    { categoria: "JUGOS", opciones: "Mora, lulo" },
    { categoria: "Precio", opciones: "$19.000" },
    { categoria: "", opciones: "fila basura" },
  ]);
  assert.deepEqual(secciones[0].opciones, ["Res", "Cerdo"]);
  assert.equal(secciones[1].opciones, "Mora, lulo");
  assert.equal(secciones.length, 2);
  assert.equal(precio, 19000);
  assert.deepEqual(toDailyMenu([]), { secciones: [], precio: null });
});
