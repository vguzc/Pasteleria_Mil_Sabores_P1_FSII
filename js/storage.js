/* ==========================================================================
   PASTELERÍA MIL SABORES — js/storage.js
   Módulo de almacenamiento local (localStorage) e inicialización de datos.
   ========================================================================== */

const CLAVE_PRODUCTOS = 'mil_sabores_productos';
const CLAVE_CARRITO = 'mil_sabores_carrito';

/**
 * Catálogo inicial de productos con las 8 categorías exigidas por la pauta.
 */
const PRODUCTOS_INICIALES = [
  // 1. Tortas Cuadradas
  {
    id: 'TC001',
    nombre: 'Torta Tres Leches Cuadrada',
    categoria: 'Tortas Cuadradas',
    precio: 24990,
    stock: 10,
    descripcion: 'Bizcocho esponjoso remojado en combinación de tres leches, cubierto con fino merengue italiano.',
    imagen: 'img/torta-tres-leches-cuadrada.png',
    destacado: true
  },
  {
    id: 'TC002',
    nombre: 'Torta Cuadrada Mil Sabores',
    categoria: 'Tortas Cuadradas',
    precio: 28990,
    stock: 10,
    descripcion: 'La especialidad insignia de nuestro taller. Bizcocho esponjoso remojado en suave almíbar con ron añejo y licor de naranja, intercalado con manjar casero, nueces, crema pastelera y mermelada casera de naranja.',
    imagen: 'img/torta-mil-sabores.png',
    destacado: true
  },

  // 2. Tortas Circulares
  {
    id: 'TC003',
    nombre: 'Torta Amor Manjar Lúcuma Circular',
    categoria: 'Tortas Circulares',
    precio: 26990,
    stock: 8,
    descripcion: 'Capas de hojarasca crujiente rellenadas con manjar artesanal, crema de lúcuma fresca y suave crema pastelera.',
    imagen: 'img/torta-amor-lucuma.png',
    destacado: true
  },
  {
    id: 'TC004',
    nombre: 'Torta de Zanahoria',
    categoria: 'Tortas Circulares',
    precio: 27490,
    stock: 6,
    descripcion: 'Bizcocho húmedo de zanahoria fresca con especia de canela, nueces crocantes y frosting cremoso de queso crema y vainilla.',
    imagen: 'img/torta-zanahoria.png',
    destacado: false
  },

  // 3. Postres Individuales
  {
    id: 'PI001',
    nombre: 'Pie de Limón Individual',
    categoria: 'Postres Individuales',
    precio: 3490,
    stock: 25,
    descripcion: 'Base crocante de galleta mantequilla, crema suave de limón natural y copo de merengue dorado al soplete.',
    imagen: 'img/pie-de-limon.png',
    destacado: false
  },
  {
    id: 'PI002',
    nombre: 'Rollito de Canela',
    categoria: 'Postres Individuales',
    precio: 3490,
    stock: 18,
    descripcion: 'Masa suave y esponjosa enrollada con canela de Ceylán, azúcar rubia y abundante glaseado suave de mantequilla.',
    imagen: 'img/rollito-canela.png',
    destacado: false
  },

  // 4. Productos Sin Azúcar
  {
    id: 'SA001',
    nombre: 'Torta Chocolate Sin Azúcar',
    categoria: 'Productos Sin Azúcar',
    precio: 28990,
    stock: 6,
    descripcion: 'Bizcocho de cacao 70% endulzado con alulosa y stevia, rellenado con ganache de chocolate sin azúcar añadida.',
    imagen: 'img/torta-chocolate-sin-azucar.png',
    destacado: true
  },
  {
    id: 'SA002',
    nombre: 'Pie de Limón Sin Azúcar',
    categoria: 'Productos Sin Azúcar',
    precio: 24990,
    stock: 8,
    descripcion: 'Base crocante de harina de almendras y avena, crema suave de limón natural endulzada con alulosa y copo de merengue dorado sin azúcar.',
    imagen: 'img/pie-de-limon-sin-azucar.png',
    destacado: false
  },

  // 5. Pastelería Tradicional
  {
    id: 'PT001',
    nombre: 'Pack 6 Alfajores Tradicionales',
    categoria: 'Pastelería Tradicional',
    precio: 5990,
    stock: 20,
    descripcion: 'Deliciosos alfajores tradicionales de hojarasca fina rellenados generosamente con abundante manjar casero.',
    imagen: 'img/alfajores-hojarasca.png',
    destacado: false
  },
  {
    id: 'PT002',
    nombre: 'Caja 12 Empolvados Caseros',
    categoria: 'Pastelería Tradicional',
    precio: 6990,
    stock: 15,
    descripcion: 'Esponjosos empolvados chilenos rellenos de manjar casero suave y espolvoreados con azúcar flor finísima.',
    imagen: 'img/empolvados-caseros.png',
    destacado: false
  },
  {
    id: 'PT003',
    nombre: 'Empanada de Pino Tradicional',
    categoria: 'Especial 18',
    precio: 3290,
    stock: 30,
    descripcion: 'Clásica empanada chilena de horno de masa casera, rellena de jugoso pino de vacuno picado a cuchillo, huevo duro, aceituna negra y pasa.',
    imagen: 'img/empanada-pino.png',
    destacado: true
  },
  {
    id: 'PT004',
    nombre: 'Empanada de Queso de Horno',
    categoria: 'Especial 18',
    precio: 2990,
    stock: 25,
    descripcion: 'Masa casera dorada de mantequilla, rellena con abundante queso mantecoso de fundo derretido.',
    imagen: 'img/empanada-queso.png',
    destacado: false
  },

  // 6. Productos Sin Gluten
  {
    id: 'SG001',
    nombre: 'Cheesecake Frutos Rojos Sin Gluten',
    categoria: 'Productos Sin Gluten',
    precio: 27990,
    stock: 5,
    descripcion: 'Cheesecake horneado con base libre de gluten (harina de almendras) y salsa artesanal de frutos del bosque.',
    imagen: 'img/cheesecake-frutos-rojos.png',
    destacado: true
  },
  {
    id: 'SG002',
    nombre: 'Galletas Surtidas Sin Gluten',
    categoria: 'Productos Sin Gluten',
    precio: 8990,
    stock: 15,
    descripcion: 'Variedad artesanal de galletas horneadas libres de gluten (harina de almendras y coco) sabor chispas de chocolate, mantequilla y vainilla.',
    imagen: 'img/galletas-sin-gluten.png',
    destacado: false
  },
  {
    id: 'SG003',
    nombre: 'Empanada de Pino Sin Gluten',
    categoria: 'Especial 18',
    precio: 3690,
    stock: 20,
    descripcion: 'Edición especial Fiestas Patrias. Empanada casera con masa certificada sin gluten, rellena de tradicional pino de vacuno, aceituna y huevo duro.',
    imagen: 'img/empanada-sin-gluten.png',
    destacado: true
  },

  // 7. Productos Vegana
  {
    id: 'PV001',
    nombre: 'Torta Vegana Trufa y Cacao',
    categoria: 'Productos Vegana',
    precio: 29990,
    stock: 7,
    descripcion: 'Elaborada sin productos de origen animal. Bizcocho húmedo de cacao con crema de trufa a base de leche de coco.',
    imagen: 'img/torta-vegana-trufa-cacao.png',
    destacado: false
  },
  {
    id: 'PV002',
    nombre: 'Mousse Zanahoria y Naranja Vegano',
    categoria: 'Productos Vegana',
    precio: 4290,
    stock: 12,
    descripcion: 'Suave mousse 100% vegetal elaborado con leche de almendras, zanahoria, ralladura de naranja orgánica y especias finas.',
    imagen: 'img/mousse-zanahoria-vegano.png',
    destacado: false
  },

  // 8. Tortas Especiales
  {
    id: 'TE001',
    nombre: 'Torta Especial de Primavera',
    categoria: 'Tortas Especiales',
    precio: 34990,
    stock: 6,
    descripcion: 'Edición especial de temporada. Bizcocho ligero de vainilla y maracuyá relleno de mousseline de pistacho, frutos del bosque frescos y flores comestibles de primavera.',
    imagen: 'img/torta-primavera.png',
    destacado: true
  },
  {
    id: 'TE002',
    nombre: 'Torta Personalizada de Bodas y Eventos',
    categoria: 'Tortas Especiales',
    precio: 39990,
    stock: 3,
    descripcion: 'Diseño elegante de dos pisos para celebraciones especiales. Bizcochos a elección decorados con flores comestibles y crema suave de vainilla.',
    imagen: 'img/torta-bodas-eventos.png',
    destacado: false
  }
];

/**
 * Obtiene la lista de productos desde localStorage. Siempre refresca los datos por defecto si han cambiado.
 * @returns {Array} Arreglo de productos.
 */
function obtenerProductos() {
  const VERSION_CATALOGO = 'v26_empanada_sin_gluten';
  const versionActual = localStorage.getItem('mil_sabores_version_catalogo');

  // Si la versión guardada en el navegador es antigua o inexistente, forzar reseteo a los 16 productos oficiales
  if (versionActual !== VERSION_CATALOGO) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    localStorage.setItem('mil_sabores_version_catalogo', VERSION_CATALOGO);
    return PRODUCTOS_INICIALES;
  }

  const datosGuardados = localStorage.getItem(CLAVE_PRODUCTOS);
  if (!datosGuardados) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    return PRODUCTOS_INICIALES;
  }

  try {
    const prods = JSON.parse(datosGuardados);
    return Array.isArray(prods) && prods.length > 0 ? prods : PRODUCTOS_INICIALES;
  } catch (error) {
    console.error('Error al parsear productos de localStorage:', error);
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    return PRODUCTOS_INICIALES;
  }
}

/**
 * Guarda el arreglo de productos en localStorage.
 * @param {Array} productos 
 */
function guardarProductos(productos) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

/**
 * Obtiene el producto por su ID.
 * @param {string} id 
 * @returns {Object|null}
 */
function obtenerProductoPorId(id) {
  const productos = obtenerProductos();
  return productos.find(p => p.id === id) || null;
}

/**
 * Obtiene el carrito actual desde localStorage.
 * @returns {Array}
 */
function obtenerCarrito() {
  const datosGuardados = localStorage.getItem(CLAVE_CARRITO);
  if (!datosGuardados) return [];
  try {
    return JSON.parse(datosGuardados);
  } catch (error) {
    console.error('Error al parsear carrito de localStorage:', error);
    return [];
  }
}

/**
 * Guarda la lista del carrito en localStorage.
 * @param {Array} carrito 
 */
function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

/**
 * Calcula la cantidad total de unidades en el carrito.
 * @returns {number}
 */
function obtenerTotalUnidadesCarrito() {
  const carrito = obtenerCarrito();
  return carrito.reduce((acum, item) => acum + item.cantidad, 0);
}

/**
 * Actualiza el contador/badge visual del carrito en el header de cualquier página.
 */
function actualizarBadgeCarrito() {
  const badges = document.querySelectorAll('.badge-carrito');
  const total = obtenerTotalUnidadesCarrito();
  badges.forEach(b => {
    b.textContent = total;
    b.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

// Inicializar de inmediato al cargar el script
document.addEventListener('DOMContentLoaded', () => {
  obtenerProductos();
  actualizarBadgeCarrito();
});

/* ==========================================================================
   MÓDULO DE CUPONES DE DESCUENTO
   ========================================================================== */
const CLAVE_CUPON = 'mil_sabores_cupon';

/**
 * Cupones de descuento oficiales disponibles en el sitio.
 */
const CUPONES_VALIDOS = {
  'FELICES50': { porcentaje: 10, nombre: 'Aniversario 50 Años (10% OFF)' },
  'DUOC10': { porcentaje: 10, nombre: 'Convenio Duoc UC (10% OFF)' },
  'ESPECIAL18': { porcentaje: 15, nombre: 'Especial 18 de Septiembre (15% OFF)' },
  'FIESTAS18': { porcentaje: 15, nombre: 'Especial 18 de Septiembre (15% OFF)' },
  'MILSABORES20': { porcentaje: 20, nombre: 'Super Descuento Mil Sabores (20% OFF)' }
};

/**
 * Obtiene el cupón activo desde localStorage.
 * @returns {Object|null}
 */
function obtenerCuponAplicado() {
  try {
    const data = localStorage.getItem(CLAVE_CUPON);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Guarda o elimina el cupón aplicado.
 * @param {Object|null} cupon 
 */
function guardarCuponAplicado(cupon) {
  if (cupon) {
    localStorage.setItem(CLAVE_CUPON, JSON.stringify(cupon));
  } else {
    localStorage.removeItem(CLAVE_CUPON);
  }
}
