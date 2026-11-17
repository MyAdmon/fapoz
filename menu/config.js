import { SITE } from "../shared/config.js";

export const CONFIG = {
  negocio: {
    nombre: "Fapoz",
    eslogan: "Cocina de autor",
    logo: "./img/logo.svg",
    telefono: "",
    whatsapp: "",
    instagram: "",
    direccion: "",
    colorMarca: "", // opcional: sobreescribe --color-brand de tokens.css
  },

  // Heredado de la config de sitio (una sola fuente de verdad)
  moneda: SITE.moneda,
  locale: SITE.locale,
  decimales: SITE.decimales,
  cacheTTL: SITE.dataSource.cacheTTL,

  // Opciones propias del menú
  mostrarBuscador: true,
  mostrarAgotados: false,
  mostrarAlergenos: true,
};

