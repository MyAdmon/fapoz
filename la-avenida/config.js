export const CONFIG = {
  negocio: {
    nombre: "LA AVENIDA",
    subtitulo: "Asadero y Restaurante",
    eslogan: "ASADOS AL CARBÓN",
    textoIzquierda: "Buena Comida / Buenas Historias",
    textoDerecha: ["Aquí se disfruta", "la buena mesa"],
    ubicacion: "Vía Medellín / Kilómetro 2",
    whatsapp: "313 784 3812",
    esloganFooter: "Sabor casero, buena carne y mejores momentos.",
  },

  // 👉 URL CSV publicada de la hoja del menú del día (ver docs/sheet-template.md).
  // Vacía = se usan `precio` y `menu` de abajo. También son el respaldo si la hoja falla.
  csvUrl: "",

  precio: 19000,
  moneda: "COP",
  locale: "es-CO",

  menu: [
    {
      categoria: "SOPA",
      icono: "sopa",
      opciones: "Sopa de albóndigas o frijoles",
    },
    {
      categoria: "ARROZ",
      icono: "arroz",
      opciones: "Arroz con cabellos de Ángel",
    },
    {
      categoria: "ENSALADA",
      icono: "ensalada",
      opciones: "Ensalada",
    },
    {
      categoria: "ACOMPAÑANTE",
      icono: "papas",
      opciones: "Tajada madura o bastones de yuca o papitas",
    },
    {
      categoria: "PROTEÍNAS",
      icono: "carne",
      subtitulo: "Todas a 120 gramos",
      opciones: [
        "Punta de anca",
        "Churrasco",
        "Solomito",
        "Cañón de cerdo",
      ],
    },
    {
      categoria: "JUGOS",
      icono: "jugo",
      opciones: "Maracuyá, borojó, mora, milo, limonada Natural",
    },
  ],
};