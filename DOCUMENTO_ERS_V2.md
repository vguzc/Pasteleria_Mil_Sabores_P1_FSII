# Especificación de Requisitos de Software (ERS) — Versión 2.0
## Sistema E-Commerce y Gestión Administrativa Web — Pastelería Mil Sabores
**Institución:** Duoc UC — Escuela de Informática y Telecomunicaciones  
**Carrera:** Ingeniería en Informática / Analista Programador Computacional  
**Asignatura:** Desarrollo Fullstack II (DSY1104)  
**Evaluación:** Evaluación Parcial N° 2 (30%)  
**Fecha:** Octubre 2026  
**Versión:** 2.0  

---

## 1. Introducción

### 1.1 Propósito del Documento
El presente documento tiene como objetivo formalizar la Especificación de Requisitos de Software (ERS) para la plataforma web de comercio electrónico y administración de Pastelería Mil Sabores, en el marco de la conmemoración de sus 50 años de trayectoria (1976 – 2026). La especificación establece los lineamientos funcionales, requerimientos no funcionales, estructura de componentes en React 18, esquema de persistencia local reactiva y la batería de pruebas unitarias automatizadas con Jasmine y Karma exigidas en la asignatura Desarrollo Fullstack II (DSY1104).

### 1.2 Alcance del Sistema
El sistema comprende una aplicación web de página única (SPA) modular dividida en dos ámbitos operativos principales:
- **Módulo Público (Tienda Clientes):** Catálogo interactivo de 8 categorías oficiales, ficha técnica de productos, selector de inventario con tope físico, carrito reactivo con cálculo de IVA y despacho, checkout asistido con autocompletado y comunas de Chile, comprobante con boleta electrónica imprimible, gestión de reclamos/contacto y secciones conmemorativas de blog y recetas.
- **Módulo Administrativo y Vendedor:** Dashboard analítico de ventas y órdenes, mantenedor CRUD de catálogo de productos con detección de stock crítico (≤ 6 unidades), mantenedor CRUD de categorías, control de usuarios y roles, reportes financieros y modal tributario para visualización y reimpresión de boletas.

### 1.3 Definiciones y Acrónimos
- **SPA:** Single Page Application. Aplicación web cargada en una sola página con actualización dinámica sin recarga completa.
- **SRP:** Single Responsibility Principle. Principio donde cada componente React encapsula una sola funcionalidad.
- **SKU:** Stock Keeping Unit. Identificador alfanumérico único para control individual de productos en bodega.
- **Módulo 11:** Algoritmo estándar oficial utilizado por el Servicio de Registro Civil e Identificación de Chile para validar el dígito verificador del RUN.

---

## 2. Arquitectura Tecnológica y Estándares

| Componente | Tecnología | Justificación Técnica |
| :--- | :--- | :--- |
| **Frontend SPA** | React 18.3.1 (Vite 5) | Renderizado reactivo con Virtual DOM, arquitectura basada en componentes funcionales y hooks. |
| **Enrutamiento** | React Router DOM 6.26.2 | Enrutamiento declarativo del lado del cliente, layouts encapsulados y guardias de ruta para roles. |
| **Diseño y Grilla** | Bootstrap 5.3.3 + CSS3 | Diseño responsivo adaptable a dispositivos móviles (≥360px), tablets y escritorio. |
| **Persistencia Local** | LocalStorage + Event Bus | Simulación reactiva de base de datos en `src/services/db.js` con sincronización mediante eventos. |
| **Suite de Testing** | Jasmine Core 5.1 + Karma 6.4 | Ejecución de pruebas unitarias sobre Chrome Headless en Windows con cobertura 10/10. |
| **Transpilación** | Webpack 5.94 + Babel Loader 9.1 | Soporte para JSX y sintaxis moderna ES6+ durante la ejecución desatendida de pruebas. |

---

## 3. Requerimientos Funcionales (RF)

### 3.1 Módulo Tienda Pública (Clientes)

- **RF-01: Catálogo y Búsqueda Multicriterio de Productos**
  - *Descripción:* El sistema debe mostrar los productos en una grilla paginada permitiendo filtrado simultáneo por 8 categorías oficiales (Tortas Cuadradas, Tortas Circulares, Postres Individuales, Sin Azúcar, Tradicional, Sin Gluten, Veganos y Especiales), ordenamiento por precio o nombre y búsqueda por texto.
  - *Criterio de Aceptación:* La actualización del catálogo ocurre en menos de 100 ms de forma reactiva sin recarga de página.

- **RF-02: Ficha Técnica Detallada de Producto**
  - *Descripción:* Presenta imagen en alta resolución, nombre, SKU, precio normal y rebajado, descripción organoléptica, porciones recomendadas, stock disponible y selector numérico de unidades acotado al stock físico.
  - *Criterio de Aceptación:* El selector no permite ingresar cantidades superiores al stock disponible en bodega.

- **RF-03: Vista Especializada de Categorías**
  - *Descripción:* Renderiza una grilla superior de tarjetas con las categorías oficiales y un contenedor inferior dinámico que lista los productos de la categoría seleccionada al hacer clic.
  - *Criterio de Aceptación:* Coincidencia estructural con la Figura 4 de la pauta de evaluación Duoc UC.

- **RF-04: Sección de Ofertas Especiales**
  - *Descripción:* Filtra automáticamente los productos marcados con indicador promocional activo o precio anterior tachado, exhibiendo el porcentaje de ahorro.
  - *Criterio de Aceptación:* Muestra únicamente productos con `enOferta === true`.

- **RF-05: Carrito de Compras Dinámico y Validación de Cupones**
  - *Descripción:* Administración de ítems en carrito con modificación de cantidades y remoción. Cálculo automático de Subtotal, Descuento, IVA (19% incluido) y Costo de Envío ($3.990 estándar o $0 si la compra supera $30.000). Validación de cupones institucionales: `FELICES50` (50% OFF mayores de 50 años), `DUOC10` (10% OFF comunidad Duoc UC) y `ESPECIAL18` (15% OFF).
  - *Criterio de Aceptación:* Coincidencia matemática exacta y persistencia del carrito en LocalStorage.

- **RF-06: Checkout Asistido con Autocompletado**
  - *Descripción:* Formulario de despacho con selección en cascada de Regiones y Comunas de Chile. Si el usuario cuenta con sesión iniciada, todos los campos de cliente y dirección se completan automáticamente. Integra switch para simular pago aprobado vs rechazo bancario.
  - *Criterio de Aceptación:* Autocompletado transparente de datos de perfil e integridad referencial del pedido.

- **RF-07: Comprobante de Compra y Emisión de Boleta Electrónica**
  - *Descripción:* Genera la confirmación con correlativo único (ej. #20240705), tabla de productos, totales y botón para imprimir Boleta Electrónica en PDF optimizada para impresión física.
  - *Criterio de Aceptación:* La vista de impresión omite barras de navegación y adapta la boleta a formato estándar.

- **RF-08: Gestión de Pago Bancario Rechazado**
  - *Descripción:* Despliega notificación descriptiva de error en la transacción financiera, preservando los datos del carrito e incluyendo botón para reintentar el pago.
  - *Criterio de Aceptación:* Coincidencia visual con la Figura 8 de la pauta Duoc UC.

- **RF-09: Registro de Usuarios con Algoritmo Módulo 11**
  - *Descripción:* Formulario de registro con validación matemática estricta de RUN chileno (Módulo 11), formateo automático de nombres en Title Case y cálculo de edad para asignación automática del cupón Senior 50+.
  - *Criterio de Aceptación:* Rechazo de RUNs inválidos antes de persistir la cuenta de usuario.

- **RF-10: Panel Privado del Cliente (Mi Cuenta)**
  - *Descripción:* Visualización de datos de perfil, historial de órdenes previas con reimpresión de boleta y catálogo de cupones personales disponibles.
  - *Criterio de Aceptación:* Acceso restringido únicamente al titular de la sesión activa.

- **RF-11: Secciones Multimedia (Blog y Recetas)**
  - *Descripción:* Publicación de artículos conmemorativos de los 50 años y receta de Pasteles de Belém con lista de ingredientes y video tutorial embebido de YouTube.
  - *Criterio de Aceptación:* Reproducción responsiva del reproductor en todos los anchos de pantalla.

### 3.2 Módulo Administrativo y de Gestión

- **RF-12: Dashboard Administrativo Central**
  - *Descripción:* Tablero de control con métricas en tiempo real: compras totales en CLP, recuento de productos en inventario con alerta de stock crítico (≤ 6 unidades) y número de usuarios activos.
  - *Criterio de Aceptación:* Coincidencia funcional con la Figura 9 de la pauta.

- **RF-13: Control de Órdenes y Modal Tributario de Boleta**
  - *Descripción:* Tabla de pedidos con filtro por estado (Pagada, En preparación, En despacho, Entregada). Incluye modal "Mostrar Boleta" con diseño legal tributario (RUT emisor, desglose de ítems, IVA 19% e impresión).
  - *Criterio de Aceptación:* Coincidencia con la Figura 10 de la pauta.

- **RF-14: Mantenedor CRUD de Catálogo de Productos**
  - *Descripción:* Operaciones de creación, listado con buscador, edición en modal y eliminación física de productos con sincronización inmediata en LocalStorage. Pestañas de filtrado para productos críticos y en oferta.
  - *Criterio de Aceptación:* Los cambios impactan el catálogo público en tiempo real sin reiniciar la aplicación.

- **RF-15: Mantenedor CRUD de Categorías**
  - *Descripción:* Administración de categorías del catálogo con actualización en cascada de los productos vinculados.
  - *Criterio de Aceptación:* Persistencia estructurada en la entidad de categorías.

- **RF-16: Mantenedor de Usuarios e Historial Comercial**
  - *Descripción:* Gestión de cuentas con asignación de roles (Cliente, Vendedor, Administrador) y visor detallado de pedidos históricos por usuario.
  - *Criterio de Aceptación:* Acceso exclusivo para rol Administrador.

- **RF-17: Reportes Financieros y de Gestión**
  - *Descripción:* Informe consolidado de facturación bruta, total de descuentos concedidos, recaudación de IVA fiscal y ranking de productos de mayor demanda.
  - *Criterio de Aceptación:* Cálculos matemáticos derivados automáticamente del registro de órdenes pagadas.

- **RF-18: Perfil Administrativo y Seguridad**
  - *Descripción:* Módulo para actualización de datos personales y cambio autenticado de contraseña administrativa.
  - *Criterio de Aceptación:* Validación de coincidencia de clave previa antes de actualizar la persistencia.

---

## 4. Requerimientos No Funcionales (RNF)

| Código | Requerimiento | Descripción Técnica | Métrica |
| :--- | :--- | :--- | :--- |
| **RNF-01** | Responsividad Multidispositivo | Adaptación fluida a dispositivos móviles (≥360px), tablets (768px) y escritorios (1200px+). | 100% de vistas adaptadas |
| **RNF-02** | Responsabilidad Única (SRP) | Cada componente React encapsula una sola responsabilidad lógica y visual. | Cohesión alta, acoplamiento bajo |
| **RNF-03** | Rendimiento y Latencia | Transición de rutas y filtrado reactivo del catálogo en tiempo imperceptible. | < 100 milisegundos |
| **RNF-04** | Aseguramiento de Calidad | Batería de pruebas automatizadas con Jasmine y Karma sobre Chrome Headless. | 10 de 10 tests aprobados |
| **RNF-05** | Seguridad de Accesos | Rutas administrativas protegidas mediante guardias de sesión en React Router. | Bloqueo no autorizado 100% |
| **RNF-06** | Accesibilidad Web | Uso de etiquetas semánticas y contraste conforme a lineamientos WCAG 2.1 nivel AA. | Contraste ≥ 4.5:1 |

---

## 5. Modelo de Datos Lógico (JavaScript Schema)

```typescript
interface Producto {
  id: string;               // Identificador alfanumérico SKU (ej: 'TC001')
  nombre: string;           // Nombre comercial del producto
  categoria: string;        // Categoría oficial asignada
  precio: number;           // Precio unitario en CLP (IVA incluido)
  precioAnterior?: number;  // Precio original tachado en ofertas
  stock: number;            // Stock físico disponible en inventario
  descripcion: string;      // Reseña organoléptica y porciones
  imagen: string;           // Ruta relativa al archivo de imagen
  destacado: boolean;       // Banner promocional en página de inicio
  enOferta: boolean;        // Inclusión en catálogo de ofertas
}

interface Orden {
  id: string;               // Identificador interno correlativo (ej: 'ORD-20240705')
  numeroOrden: string;      // Número visible en boleta electrónica (ej: '20240705')
  fecha: string;            // Timestamp en formato estándar ISO
  cliente: {
    nombre: string;
    apellidos: string;
    correo: string;
    direccion: string;
    region: string;
    comuna: string;
    indicaciones?: string;
  };
  items: Array<{
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;
    imagen: string;
  }>;
  subtotal: number;
  descuento: number;
  cupon: string | null;
  iva: number;              // Débito fiscal 19% incluido legal
  envio: number;            // Costo de despacho ($3.990 o $0 si subtotal > $30.000)
  total: number;            // Total final facturado en CLP
  estado: 'Pagada' | 'En preparación' | 'En despacho' | 'Entregada';
}
```

---

## 6. Matriz de Trazabilidad Requisitos vs Componentes

| Requerimiento | Componente React | Archivo Fuente | Estado |
| :--- | :--- | :--- | :--- |
| **RF-01, RF-03, RF-04** | `ProductList`, `ProductCard` | `src/components/store/ProductList.jsx` | Implementado |
| **RF-02** | `ProductDetailPage`, `QuantitySelector` | `src/pages/store/ProductDetailPage.jsx` | Implementado |
| **RF-05** | `CartPage`, `CartDrawer` | `src/pages/store/CartPage.jsx` | Implementado |
| **RF-06** | `CheckoutPage` | `src/pages/store/CheckoutPage.jsx` | Implementado |
| **RF-07, RF-08** | `OrderSuccessPage`, `OrderErrorPage` | `src/pages/store/OrderSuccessPage.jsx` | Implementado |
| **RF-09, RF-10** | `RegisterPage`, `MyAccountPage` | `src/pages/store/RegisterPage.jsx` | Implementado |
| **RF-12** | `AdminDashboard`, `StatCard` | `src/pages/admin/AdminDashboard.jsx` | Implementado |
| **RF-13** | `AdminOrders`, `BoletaModal` | `src/pages/admin/AdminOrders.jsx` | Implementado |
| **RF-14** | `AdminProducts`, `ProductModal` | `src/pages/admin/AdminProducts.jsx` | Implementado |
| **RF-15, RF-16, RF-17** | `AdminCategories`, `AdminUsers`, `AdminReports` | `src/pages/admin/*` | Implementado |
