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

  // Google Sheet "La Avenida – Menú", cada pestaña publicada como CSV (docs/hojas.md).
  // carta.csv y menu-del-dia.csv de esta carpeta quedan solo como plantilla inicial.
  hojas: {
    menuDelDia: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQF1AMtXhOEnwm0a8mOoe33wLI2GFKZwLSdDy6a0bBzRSP24tMgDehOlki3Po13cTz27F_2EkfPqDlW/pub?gid=658244081&single=true&output=csv",
    carta: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQF1AMtXhOEnwm0a8mOoe33wLI2GFKZwLSdDy6a0bBzRSP24tMgDehOlki3Po13cTz27F_2EkfPqDlW/pub?gid=0&single=true&output=csv",
  },
};
