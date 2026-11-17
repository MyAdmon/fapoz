// Datos fijos del restaurante. Lo que cambia seguido (platos, precios, menú del día)
// NO va aquí: vive en las hojas (ver docs/hojas.md).
export default {
  nombre: "La Avenida",
  // URL pública = la que va en el QR. Si cambia el dominio, cambia aquí y se regenera el QR.
  url: "https://myadmon.github.io/fapoz/la-avenida/",
  logo: "./logo.jpg",

  textoIzquierda: ["Buena", "Comida", "Buenas", "Historias"],
  textoDerecha: ["Aquí", "se disfruta", "la buena", "mesa"],
  ubicacion: ["Vía Medellín", "Kilómetro 2"],
  whatsapp: "313 784 3812",
  esloganFooter: "Sabor casero, buena carne y mejores momentos.",

  moneda: "COP",
  locale: "es-CO",

  // 👉 Cuando exista el Google Sheet, reemplaza cada una por la URL CSV publicada
  //    de su pestaña (docs/hojas.md). Mientras tanto se leen los CSV de esta carpeta.
  hojas: {
    menuDelDia: "./menu-del-dia.csv",
    carta: "./carta.csv",
  },
};
