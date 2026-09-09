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
  {
    id: 'TC001',
    nombre: 'Torta Tres Leches Cuadrada',
    categoria: 'Tortas Cuadradas',
    precio: 24990,
    stock: 10,
    descripcion: 'Bizcocho esponjoso remojado en combinación de tres leches, cubierto con fino merengue italiano.',
    imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    destacado: true
  },
  {
    id: 'TC002',
    nombre: 'Torta Amor Manjar Lúcuma Circular',
    categoria: 'Tortas Circulares',
    precio: 26990,
    stock: 8,
    descripcion: 'Capas de hojarasca crujiente rellenadas con manjar artesanal, crema de lúcuma fresca y suave crema pastelera.',
    imagen: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80',
    destacado: true
  },
  {
    id: 'PI001',
    nombre: 'Pie de Limón Individual',
    categoria: 'Postres Individuales',
    precio: 3490,
    stock: 25,
    descripcion: 'Base crocante de galleta mantequilla, crema suave de limón natural y copo de merengue dorado al soplete.',
    imagen: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
    destacado: false
  },
  {
    id: 'SA001',
    nombre: 'Torta Chocolate Sin Azúcar',
    categoria: 'Productos Sin Azúcar',
    precio: 28990,
    stock: 6,
    descripcion: 'Bizcocho de cacao 70% endulzado con alulosa y stevia, rellenado con ganache de chocolate sin azúcar añadida.',
    imagen: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    destacado: true
  },
  {
    id: 'PT001',
    nombre: 'Pack 6 Alfajores Tradicionales',
    categoria: 'Pastelería Tradicional',
    precio: 5990,
    stock: 20,
    descripcion: 'Deliciosos alfajores tradicionales de hojarasca fina rellenados generosamente con abundante manjar casero.',
    imagen: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80',
    destacado: false
  },
  {
    id: 'SG001',
    nombre: 'Cheesecake Frutos Rojos Sin Gluten',
    categoria: 'Productos Sin Gluten',
    precio: 27990,
    stock: 5,
    descripcion: 'Cheesecake horneado con base libre de gluten (harina de almendras) y salsa artesanal de frutos del bosque.',
    imagen: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    destacado: true
  },
  {
    id: 'PV001',
    nombre: 'Torta Vegana Trufa y Cacao',
    categoria: 'Productos Vegana',
    precio: 29990,
    stock: 7,
    descripcion: 'Elaborada sin productos de origen animal. Bizcocho húmedo de cacao con crema de trufa a base de leche de coco.',
    imagen: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
    destacado: false
  },
  {
    id: 'TE001',
    nombre: 'Torta Aniversario 50 Años Mil Sabores',
    categoria: 'Tortas Especiales',
    precio: 34990,
    stock: 4,
    descripcion: 'Edición conmemorativa de 50 años. Espectacular torta artesanal de tres pisos decorada con cremas artesanales, flores y frutos rojos.',
    imagen: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
    destacado: true
  }
];

/**
 * Obtiene la lista de productos desde localStorage. Siempre refresca los datos por defecto si han cambiado.
 * @returns {Array} Arreglo de productos.
 */
function obtenerProductos() {
  const datosGuardados = localStorage.getItem(CLAVE_PRODUCTOS);
  if (!datosGuardados) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
    return PRODUCTOS_INICIALES;
  }
  try {
    const prods = JSON.parse(datosGuardados);
    // Actualizar imágenes y descripciones si existen en el catálogo base
    let modificado = false;
    prods.forEach(p => {
      const base = PRODUCTOS_INICIALES.find(b => b.id === p.id);
      if (base) {
        if (p.imagen !== base.imagen || p.descripcion !== base.descripcion) {
          p.imagen = base.imagen;
          p.descripcion = base.descripcion;
          modificado = true;
        }
      }
    });
    if (modificado) {
      localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(prods));
    }
    return prods;
  } catch (error) {
    console.error('Error al parsear productos de localStorage:', error);
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
