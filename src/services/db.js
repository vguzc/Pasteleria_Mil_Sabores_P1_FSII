/**
 * PASTELERÍA MIL SABORES — src/services/db.js
 * Fuente de datos simulada en JavaScript (Base de Datos simulada con persistencia en localStorage)
 * Implementa operaciones CRUD completas para Productos, Categorías, Usuarios, Órdenes y Carrito.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'mil_sabores_react_productos',
  CATEGORIES: 'mil_sabores_react_categorias',
  USERS: 'mil_sabores_react_usuarios',
  ORDERS: 'mil_sabores_react_ordenes',
  CART: 'mil_sabores_react_carrito',
  ACTIVE_USER: 'mil_sabores_react_sesion'
};

// -------------------------------------------------------------
// CATÁLOGO INICIAL (Semilla oficial)
// -------------------------------------------------------------
export const INITIAL_PRODUCTS = [
  // 1. Tortas Cuadradas
  {
    id: 'TC001',
    nombre: 'Torta Tres Leches Cuadrada',
    categoria: 'Tortas Cuadradas',
    precio: 24990,
    precioAnterior: 28990,
    stock: 10,
    descripcion: 'Bizcocho esponjoso remojado en combinación de tres leches, cubierto con fino merengue italiano.',
    imagen: '/img/torta-tres-leches-cuadrada.png',
    destacado: true,
    enOferta: true
  },
  {
    id: 'TC002',
    nombre: 'Torta Cuadrada Mil Sabores',
    categoria: 'Tortas Cuadradas',
    precio: 28990,
    precioAnterior: null,
    stock: 10,
    descripcion: 'La especialidad insignia de nuestro taller. Bizcocho esponjoso remojado en almíbar de ron añejo y licor de naranja con manjar casero, nueces y crema pastelera.',
    imagen: '/img/torta-mil-sabores.png',
    destacado: true,
    enOferta: false
  },
  // 2. Tortas Circulares
  {
    id: 'TC003',
    nombre: 'Torta Amor Manjar Lúcuma Circular',
    categoria: 'Tortas Circulares',
    precio: 26990,
    precioAnterior: 31990,
    stock: 8,
    descripcion: 'Capas de hojarasca crujiente rellenadas con manjar artesanal, crema de lúcuma fresca y suave crema pastelera.',
    imagen: '/img/torta-amor-lucuma.png',
    destacado: true,
    enOferta: true
  },
  {
    id: 'TC004',
    nombre: 'Torta de Zanahoria',
    categoria: 'Tortas Circulares',
    precio: 27490,
    precioAnterior: null,
    stock: 6,
    descripcion: 'Bizcocho húmedo de zanahoria fresca con especia de canela, nueces crocantes y frosting cremoso de queso crema y vainilla.',
    imagen: '/img/torta-zanahoria.png',
    destacado: false,
    enOferta: false
  },
  // 3. Postres Individuales
  {
    id: 'PI001',
    nombre: 'Pie de Limón Individual',
    categoria: 'Postres Individuales',
    precio: 3490,
    precioAnterior: 4200,
    stock: 25,
    descripcion: 'Base crocante de galleta mantequilla, crema suave de limón natural y copo de merengue dorado al soplete.',
    imagen: '/img/pie-de-limon.png',
    destacado: false,
    enOferta: true
  },
  {
    id: 'PI002',
    nombre: 'Rollito de Canela',
    categoria: 'Postres Individuales',
    precio: 3490,
    precioAnterior: null,
    stock: 18,
    descripcion: 'Masa suave y esponjosa enrollada con canela de Ceylán, azúcar rubia y abundante glaseado suave de mantequilla.',
    imagen: '/img/rollito-canela.png',
    destacado: false,
    enOferta: false
  },
  // 4. Productos Sin Azúcar
  {
    id: 'SA001',
    nombre: 'Torta Chocolate Sin Azúcar',
    categoria: 'Productos Sin Azúcar',
    precio: 28990,
    precioAnterior: 32990,
    stock: 4, // Stock crítico <= 6
    descripcion: 'Bizcocho de cacao 70% endulzado con alulosa y stevia, rellenado con ganache de chocolate sin azúcar añadida.',
    imagen: '/img/torta-chocolate-sin-azucar.png',
    destacado: true,
    enOferta: true
  },
  {
    id: 'SA002',
    nombre: 'Pie de Limón Sin Azúcar',
    categoria: 'Productos Sin Azúcar',
    precio: 24990,
    precioAnterior: null,
    stock: 8,
    descripcion: 'Base crocante de harina de almendras y avena, crema suave de limón natural endulzada con alulosa.',
    imagen: '/img/pie-de-limon-sin-azucar.png',
    destacado: false,
    enOferta: false
  },
  // 5. Pastelería Tradicional
  {
    id: 'PT001',
    nombre: 'Pack 6 Alfajores Tradicionales',
    categoria: 'Pastelería Tradicional',
    precio: 5990,
    precioAnterior: 6990,
    stock: 20,
    descripcion: 'Deliciosos alfajores tradicionales de hojarasca fina rellenados generosamente con abundante manjar casero.',
    imagen: '/img/alfajores-hojarasca.png',
    destacado: false,
    enOferta: true
  },
  {
    id: 'PT002',
    nombre: 'Caja 12 Empolvados Caseros',
    categoria: 'Pastelería Tradicional',
    precio: 6990,
    precioAnterior: null,
    stock: 15,
    descripcion: 'Esponjosos empolvados chilenos rellenos de manjar casero suave y espolvoreados con azúcar flor finísima.',
    imagen: '/img/empolvados-caseros.png',
    destacado: false,
    enOferta: false
  },
  {
    id: 'PT005',
    nombre: 'Strudel de Manzana Tradicional',
    categoria: 'Pastelería Tradicional',
    precio: 4990,
    precioAnterior: 5990,
    stock: 5, // Crítico <= 6
    descripcion: 'Tradicional strudel artesanal hojaldrado relleno de manzanas horneadas, canela de Ceylán, nueces y pasas al ron.',
    imagen: '/img/strudel-manzana.png',
    destacado: true,
    enOferta: true
  },
  // 6. Productos Sin Gluten
  {
    id: 'SG001',
    nombre: 'Cheesecake Frutos Rojos Sin Gluten',
    categoria: 'Productos Sin Gluten',
    precio: 27990,
    precioAnterior: null,
    stock: 5, // Crítico <= 6
    descripcion: 'Cheesecake horneado con base libre de gluten (harina de almendras) y salsa artesanal de frutos del bosque.',
    imagen: '/img/cheesecake-frutos-rojos.png',
    destacado: true,
    enOferta: false
  },
  {
    id: 'SG002',
    nombre: 'Galletas Surtidas Sin Gluten',
    categoria: 'Productos Sin Gluten',
    precio: 8990,
    precioAnterior: null,
    stock: 15,
    descripcion: 'Variedad artesanal de galletas horneadas libres de gluten con chispas de chocolate belga y mantequilla.',
    imagen: '/img/galletas-sin-gluten.png',
    destacado: false,
    enOferta: false
  },
  // 7. Productos Veganos
  {
    id: 'PV001',
    nombre: 'Torta Vegana Trufa y Cacao',
    categoria: 'Productos Veganos',
    precio: 29990,
    precioAnterior: 34990,
    stock: 3, // Crítico <= 6
    descripcion: 'Elaborada sin ingredientes animales. Bizcocho húmedo de cacao con crema de trufa a base de leche de coco.',
    imagen: '/img/torta-vegana-trufa-cacao.png',
    destacado: false,
    enOferta: true
  },
  {
    id: 'PV002',
    nombre: 'Mousse Zanahoria y Naranja Vegano',
    categoria: 'Productos Veganos',
    precio: 4290,
    precioAnterior: null,
    stock: 12,
    descripcion: 'Suave mousse 100% vegetal elaborado con leche de almendras, zanahoria y ralladura de naranja orgánica.',
    imagen: '/img/mousse-zanahoria-vegano.png',
    destacado: false,
    enOferta: false
  },
  // 8. Tortas Especiales
  {
    id: 'TE001',
    nombre: 'Torta Especial de Primavera',
    categoria: 'Tortas Especiales',
    precio: 34990,
    precioAnterior: null,
    stock: 6, // Crítico <= 6
    descripcion: 'Bizcocho ligero de vainilla y maracuyá relleno de mousseline de pistacho, frutos del bosque y flores comestibles.',
    imagen: '/img/torta-primavera.png',
    destacado: true,
    enOferta: false
  },
  {
    id: 'TE002',
    nombre: 'Torta Personalizada de Bodas y Eventos',
    categoria: 'Tortas Especiales',
    precio: 39990,
    precioAnterior: null,
    stock: 3, // Crítico <= 6
    descripcion: 'Diseño elegante de dos pisos para celebraciones memorables. Decorada a mano con flores comestibles.',
    imagen: '/img/torta-bodas-eventos.png',
    destacado: false,
    enOferta: false
  },
  // 9. Pastelería Tradicional & Salada
  {
    id: 'PT003',
    nombre: 'Empanada de Pino Tradicional',
    categoria: 'Pastelería Tradicional',
    precio: 3290,
    precioAnterior: 3790,
    stock: 30,
    descripcion: 'Clásica empanada chilena de horno, rellena de jugoso pino de vacuno picado a cuchillo, huevo duro y aceituna.',
    imagen: '/img/empanada-pino.png',
    destacado: true,
    enOferta: true
  },
  {
    id: 'PT004',
    nombre: 'Empanada de Queso de Horno',
    categoria: 'Pastelería Tradicional',
    precio: 2990,
    precioAnterior: null,
    stock: 25,
    descripcion: 'Masa casera dorada de mantequilla, rellena con abundante queso mantecoso de fundo derretido.',
    imagen: '/img/empanada-queso.png',
    destacado: false,
    enOferta: false
  },
  {
    id: 'SG003',
    nombre: 'Empanada de Pino Sin Gluten',
    categoria: 'Productos Sin Gluten',
    precio: 3690,
    precioAnterior: 4190,
    stock: 20,
    descripcion: 'Edición artesanal libre de gluten con tradicional pino de vacuno y aceituna.',
    imagen: '/img/empanada-sin-gluten.png',
    destacado: true,
    enOferta: true
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', nombre: 'Tortas Cuadradas', descripcion: 'Formatos clásicos familiares para compartir y celebrar', imagen: '/img/torta-tres-leches-cuadrada.png' },
  { id: 'cat-2', nombre: 'Tortas Circulares', descripcion: 'Redondas tradicionales, decoradas con esmero artesanal', imagen: '/img/torta-amor-lucuma.png' },
  { id: 'cat-3', nombre: 'Postres Individuales', descripcion: 'Porciones justas para el antojo dulce del día', imagen: '/img/pie-de-limon.png' },
  { id: 'cat-4', nombre: 'Productos Sin Azúcar', descripcion: 'Endulzados con alulosa natural, ideales para cuidarse', imagen: '/img/torta-chocolate-sin-azucar.png' },
  { id: 'cat-5', nombre: 'Pastelería Tradicional', descripcion: 'Chilenitos, empolvados, alfajores y strudel de receta centenaria', imagen: '/img/alfajores-hojarasca.png' },
  { id: 'cat-6', nombre: 'Productos Sin Gluten', descripcion: '100% libres de gluten con certificación y sabor inigualable', imagen: '/img/cheesecake-frutos-rojos.png' },
  { id: 'cat-7', nombre: 'Productos Veganos', descripcion: 'Sin ingredientes de origen animal, suaves y deliciosos', imagen: '/img/torta-vegana-trufa-cacao.png' },
  { id: 'cat-8', nombre: 'Tortas Especiales', descripcion: 'Creaciones únicas para bodas, aniversarios y grandes eventos', imagen: '/img/torta-primavera.png' }
];

export const INITIAL_USERS = [
  {
    id: 'USR001',
    nombre: 'Administrador',
    apellidos: 'Duoc UC',
    correo: 'admin@duoc.cl',
    clave: 'admin123',
    rol: 'administrador',
    rut: '12.345.678-5',
    fechaNacimiento: '1985-05-15',
    direccion: 'Av. Providencia 1200',
    departamento: 'Oficina 402',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Providencia'
  },
  {
    id: 'USR002',
    nombre: 'Carlos',
    apellidos: 'Vendedor Mil Sabores',
    correo: 'vendedor@milsabores.cl',
    clave: 'venta123',
    rol: 'vendedor',
    rut: '15.678.901-2',
    fechaNacimiento: '1990-08-20',
    direccion: 'Apoquindo 4500',
    departamento: 'Local 12',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Las Condes'
  },
  {
    id: 'USR003',
    nombre: 'Pedro',
    apellidos: 'Hacker',
    correo: 'pedro.hacker20@example.com',
    clave: 'clave123',
    rol: 'cliente',
    rut: '19.456.789-K',
    fechaNacimiento: '1998-11-04',
    direccion: 'Los Crisantemos, Edificio Norte',
    departamento: 'Depto 603',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'
  },
  {
    id: 'USR004',
    nombre: 'Camila',
    apellidos: 'González',
    correo: 'prueba1@gmail.com',
    clave: 'clave123',
    rol: 'cliente',
    rut: '18.123.456-7',
    fechaNacimiento: '1970-02-14', // 50+ para beneficio automático
    direccion: 'Los Leones 890',
    departamento: 'Depto 304',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Providencia',
    indicaciones: 'Dejar en conserjería si no atiendo el timbre.'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-20240705',
    numeroOrden: '20240705',
    fecha: '2026-10-18T14:32:00.000Z',
    cliente: {
      nombre: 'Pedro',
      apellidos: 'Hacker',
      correo: 'pedro.hacker20@example.com',
      direccion: 'Los Crisantemos, Edificio Norte',
      departamento: 'Depto 603',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Cerrillos',
      indicaciones: 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'
    },
    items: [
      { id: 'TC001', nombre: 'Torta Tres Leches Cuadrada', precio: 24990, cantidad: 1, subtotal: 24990, imagen: '/img/torta-tres-leches-cuadrada.png' },
      { id: 'PI001', nombre: 'Pie de Limón Individual', precio: 3490, cantidad: 1, subtotal: 3490, imagen: '/img/pie-de-limon.png' }
    ],
    subtotal: 28480,
    descuento: 0,
    cupon: null,
    iva: 5411,
    envio: 0, // Despacho gratis > 30000 o promocional
    total: 28480,
    estado: 'Pagada'
  },
  {
    id: 'ORD-20240704',
    numeroOrden: '20240704',
    fecha: '2026-10-17T11:15:00.000Z',
    cliente: {
      nombre: 'Camila',
      apellidos: 'González',
      correo: 'prueba1@gmail.com',
      direccion: 'Los Leones 890',
      departamento: 'Depto 304',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Providencia',
      indicaciones: 'Timbre 304'
    },
    items: [
      { id: 'TC003', nombre: 'Torta Amor Manjar Lúcuma Circular', precio: 26990, cantidad: 1, subtotal: 26990, imagen: '/img/torta-amor-lucuma.png' }
    ],
    subtotal: 26990,
    descuento: 2699,
    cupon: 'DUOC10',
    iva: 4615,
    envio: 3990,
    total: 28281,
    estado: 'Entregada'
  }
];

export const VALID_COUPONS = {
  'FELICES50': { codigo: 'FELICES50', porcentaje: 50, nombre: 'Especial 50 Años (50% OFF)' },
  'DUOC10': { codigo: 'DUOC10', porcentaje: 10, nombre: 'Convenio Duoc UC (10% OFF)' },
  'ESPECIAL18': { codigo: 'ESPECIAL18', porcentaje: 15, nombre: 'Especial Fiestas Patrias (15% OFF)' }
};

// -------------------------------------------------------------
// HELPERS LOCALSTORAGE
// -------------------------------------------------------------
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error leyendo ${key} de localStorage:`, err);
    return fallback;
  }
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage-updated'));
  } catch (err) {
    console.error(`Error guardando ${key} en localStorage:`, err);
  }
}

// -------------------------------------------------------------
// OPERACIONES CRUD — PRODUCTOS
// -------------------------------------------------------------
export const productService = {
  getAll() {
    const list = readStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return list.map(p => {
      if (p.categoria === 'Especial 18') {
        return {
          ...p,
          categoria: p.id === 'SG003' ? 'Productos Sin Gluten' : 'Pastelería Tradicional'
        };
      }
      return p;
    });
  },

  getById(id) {
    const list = this.getAll();
    return list.find(p => p.id === id) || null;
  },

  getByCategory(categoria) {
    const list = this.getAll();
    if (!categoria || categoria === 'Todas') return list;
    return list.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
  },

  getOffers() {
    const list = this.getAll();
    return list.filter(p => p.enOferta === true || (p.precioAnterior && p.precioAnterior > p.precio));
  },

  getCritical() {
    const list = this.getAll();
    return list.filter(p => Number(p.stock) <= 6);
  },

  create(productData) {
    const list = this.getAll();
    const newProduct = {
      ...productData,
      id: productData.id || `PROD-${Date.now().toString().slice(-5)}`,
      precio: Number(productData.precio) || 0,
      stock: Number(productData.stock) || 0,
      destacado: Boolean(productData.destacado),
      enOferta: Boolean(productData.enOferta),
      imagen: productData.imagen || '/img/torta-mil-sabores.png'
    };
    list.unshift(newProduct);
    writeStorage(STORAGE_KEYS.PRODUCTS, list);
    return newProduct;
  },

  update(id, updatedFields) {
    const list = this.getAll();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updatedFields,
      precio: updatedFields.precio !== undefined ? Number(updatedFields.precio) : list[index].precio,
      stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : list[index].stock
    };
    writeStorage(STORAGE_KEYS.PRODUCTS, list);
    return list[index];
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(p => p.id !== id);
    writeStorage(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },

  resetDefaults() {
    writeStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
};

// -------------------------------------------------------------
// OPERACIONES CRUD — CATEGORÍAS
// -------------------------------------------------------------
export const categoryService = {
  getAll() {
    const list = readStorage(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    return list.filter(c => c && c.nombre !== 'Especial 18' && c.id !== 'cat-9');
  },

  create(categoryData) {
    const list = this.getAll();
    const newCat = {
      id: `CAT-${Date.now().toString().slice(-4)}`,
      nombre: categoryData.nombre,
      descripcion: categoryData.descripcion || '',
      imagen: categoryData.imagen || '/img/torta-mil-sabores.png'
    };
    list.push(newCat);
    writeStorage(STORAGE_KEYS.CATEGORIES, list);
    return newCat;
  },

  update(id, updatedFields) {
    const list = this.getAll();
    const index = list.findIndex(c => c.id === id || c.nombre === id);
    if (index === -1) return null;

    const oldName = list[index].nombre;
    list[index] = { ...list[index], ...updatedFields };
    writeStorage(STORAGE_KEYS.CATEGORIES, list);

    // Actualizar productos asociados si cambia el nombre
    if (updatedFields.nombre && updatedFields.nombre !== oldName) {
      const prods = productService.getAll();
      const updatedProds = prods.map(p => p.categoria === oldName ? { ...p, categoria: updatedFields.nombre } : p);
      writeStorage(STORAGE_KEYS.PRODUCTS, updatedProds);
    }
    return list[index];
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(c => c.id !== id && c.nombre !== id);
    writeStorage(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  }
};

// -------------------------------------------------------------
// OPERACIONES CRUD — USUARIOS & AUTENTICACIÓN
// -------------------------------------------------------------
export const userService = {
  getAll() {
    return readStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getById(id) {
    const list = this.getAll();
    return list.find(u => u.id === id || u.correo === id) || null;
  },

  create(userData) {
    const list = this.getAll();
    const newUser = {
      ...userData,
      id: userData.id || `USR-${Date.now().toString().slice(-5)}`,
      rol: userData.rol || 'cliente'
    };
    list.push(newUser);
    writeStorage(STORAGE_KEYS.USERS, list);
    return newUser;
  },

  update(id, updatedFields) {
    const list = this.getAll();
    const index = list.findIndex(u => u.id === id || u.correo === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updatedFields };
    writeStorage(STORAGE_KEYS.USERS, list);

    // Si es el usuario activo, actualizar sesión también
    const activeUser = this.getActiveUser();
    if (activeUser && (activeUser.id === id || activeUser.correo === id)) {
      this.setActiveUser(list[index]);
    }
    return list[index];
  },

  delete(id) {
    const list = this.getAll();
    const filtered = list.filter(u => u.id !== id && u.correo !== id);
    writeStorage(STORAGE_KEYS.USERS, filtered);
    return true;
  },

  authenticate(correo, clave) {
    const list = this.getAll();
    const user = list.find(u => u.correo.toLowerCase() === correo.trim().toLowerCase() && u.clave === clave);
    if (user) {
      this.setActiveUser(user);
      return user;
    }
    return null;
  },

  getActiveUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setActiveUser(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
    window.dispatchEvent(new Event('auth-changed'));
  },

  logout() {
    this.setActiveUser(null);
  }
};

// -------------------------------------------------------------
// OPERACIONES CRUD — ÓRDENES / BOLETAS
// -------------------------------------------------------------
export const orderService = {
  getAll() {
    return readStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  getById(id) {
    const list = this.getAll();
    return list.find(o => o.id === id || o.numeroOrden === id) || null;
  },

  getByUserEmail(email) {
    const list = this.getAll();
    return list.filter(o => o.cliente && o.cliente.correo && o.cliente.correo.toLowerCase() === email.toLowerCase());
  },

  create(orderData) {
    const list = this.getAll();
    const numeroOrden = (20240700 + list.length + 1).toString();
    const newOrder = {
      id: `ORD-${numeroOrden}`,
      numeroOrden: numeroOrden,
      fecha: new Date().toISOString(),
      estado: 'Pagada',
      ...orderData
    };

    // Descontar stock de productos comprados
    const products = productService.getAll();
    newOrder.items.forEach(item => {
      const p = products.find(prod => prod.id === item.id);
      if (p) {
        p.stock = Math.max(0, p.stock - item.cantidad);
      }
    });
    writeStorage(STORAGE_KEYS.PRODUCTS, products);

    list.unshift(newOrder);
    writeStorage(STORAGE_KEYS.ORDERS, list);
    return newOrder;
  },

  updateStatus(id, newStatus) {
    const list = this.getAll();
    const index = list.findIndex(o => o.id === id || o.numeroOrden === id);
    if (index === -1) return null;

    list[index].estado = newStatus;
    writeStorage(STORAGE_KEYS.ORDERS, list);
    return list[index];
  }
};

// -------------------------------------------------------------
// OPERACIONES — CARRITO & CÁLCULOS
// -------------------------------------------------------------
export const cartService = {
  getCart() {
    return readStorage(STORAGE_KEYS.CART, []);
  },

  saveCart(cart) {
    writeStorage(STORAGE_KEYS.CART, cart);
    window.dispatchEvent(new Event('cart-updated'));
  },

  addItem(product, quantity = 1) {
    const cart = this.getCart();
    const index = cart.findIndex(item => item.id === product.id);

    if (index > -1) {
      cart[index].cantidad += quantity;
      cart[index].subtotal = cart[index].cantidad * cart[index].precio;
    } else {
      cart.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: quantity,
        subtotal: product.precio * quantity,
        imagen: product.imagen
      });
    }
    this.saveCart(cart);
    return cart;
  },

  updateQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    } else {
      const item = cart.find(i => i.id === productId);
      if (item) {
        item.cantidad = quantity;
        item.subtotal = item.precio * quantity;
      }
    }
    this.saveCart(cart);
    return cart;
  },

  removeItem(productId) {
    const cart = this.getCart().filter(i => i.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  clear() {
    this.saveCart([]);
  },

  calculateTotals(cart, couponCode = null) {
    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
    let descuento = 0;
    let cuponAplicado = null;
    if (couponCode && VALID_COUPONS[couponCode.toUpperCase()]) {
      cuponAplicado = VALID_COUPONS[couponCode.toUpperCase()];
      descuento = Math.round(subtotal * (cuponAplicado.porcentaje / 100));
    }

    const baseImponible = Math.max(0, subtotal - descuento);
    const iva = Math.round(baseImponible * 0.19);
    // Despacho gratis si subtotal > $30.000, si no tarifa plana $3.990 (si hay items)
    const envio = cart.length === 0 ? 0 : (subtotal >= 30000 ? 0 : 3990);
    const total = baseImponible + envio;

    return {
      subtotal,
      descuento,
      cupon: cuponAplicado,
      iva,
      envio,
      total,
      itemsCount: cart.reduce((acc, item) => acc + item.cantidad, 0)
    };
  }
};
