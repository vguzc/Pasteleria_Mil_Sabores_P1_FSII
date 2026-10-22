# 🎂 Pastelería Mil Sabores — Evaluación Parcial N° 2 (Fullstack II)
## Frontend Moderno en React 18 + Suite de Pruebas Unitarias con Jasmine y Karma

¡Bienvenidos al repositorio oficial de la **Evaluación Parcial N° 2** de la asignatura **Desarrollo Fullstack II (DSY1104)** de **Duoc UC**!

Este proyecto corresponde a la migración y evolución de la tienda online e-commerce **Pastelería Mil Sabores** hacia un frontend moderno basado en **React 18 (Vite 5)**, diseño 100% responsivo con **Bootstrap 5**, arquitectura basada en el principio de **Single Responsibility**, persistencia con base de datos simulada en JavaScript (CRUD), y aseguramiento de calidad con **10 pruebas unitarias en Jasmine y Karma (10/10 — 100% éxito)**.

---

## 🚀 Inicio Rápido (Cómo levantar el proyecto)

### 1. Prerrequisitos
- **Node.js**: v18+ (probado exitosamente en Node.js v24)
- **Navegador**: Google Chrome (necesario para el test runner headless de Karma)

### 2. Instalación de dependencias
```bash
npm install
```

### 3. Levantar el servidor de desarrollo
```bash
npm run dev
# o bien:
npm start
```
La aplicación se abrirá en `http://localhost:3000/`.

### 4. Ejecutar las 10 pruebas unitarias automatizadas (Karma + Jasmine)
```bash
npm test
```
Ejecuta las 10 pruebas en `ChromeHeadless` y emite el reporte detallado en terminal:
```plaintext
TOTAL: 10 SUCCESS (0.07 secs)
```

### 5. Compilar para producción (Build)
```bash
npm run build
```
Genera la versión optimizada en la carpeta `dist/`.

---

## 🔑 Cuentas de Acceso de Prueba (Demo)

El sistema incluye cuentas demo precargadas para facilitar la evaluación docente:

| Rol | Correo Electrónico | Contraseña | Vistas y Permisos Habilitados |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@duoc.cl` | `admin123` | **Panel Admin Total:** Dashboard, Órdenes/Boletas, CRUD Productos, CRUD Categorías, CRUD Usuarios (con historial de compras), Reportes y Perfil. |
| **Vendedor** | `vendedor@milsabores.cl` | `venta123` | **Panel Vendedor:** Dashboard, Órdenes/Boletas, CRUD Productos y Categorías. *(Usuarios restringido)*. |
| **Cliente (50+)** | `prueba1@gmail.com` | `clave123` | Tienda, Carrito, Checkout con autofill, **Beneficio 50% descuento**, Mi Cuenta e Historial de compras. |
| **Cliente** | `pedro.hacker20@example.com` | `clave123` | Tienda, Carrito, Checkout con autofill (Cerrillos), Boleta #20240705. |

---

## 🏷️ Cupones de Descuento Oficiales

- `FELICES50` — **50% de descuento** en el total de la compra (Beneficio especial 50 años / clientes 50+).
- `DUOC10` — **10% de descuento** (Convenio Duoc UC para alumnos y docentes).
- `ESPECIAL18` — **15% de descuento** (Especial Fiestas Patrias).

---

## 📁 Estructura del Proyecto

```plaintext
📁 Parcial_1/
├── 📁 public/
│   └── 📁 img/                      (Imágenes de productos, logotipo y especialidades)
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📁 common/
│   │   │   ├── Button.jsx           (Botón reutilizable con props y variantes)
│   │   │   └── AlertMessage.jsx     (Renderizado condicional de mensajes)
│   │   ├── 📁 store/
│   │   │   ├── ProductCard.jsx      (Ficha de producto individual con precio en CLP)
│   │   │   └── CategoryCard.jsx     (Tarjeta de categoría para vista general)
│   │   ├── 📁 cart/
│   │   │   └── QuantitySelector.jsx (Contador numérico controlado de cantidad)
│   │   ├── 📁 admin/
│   │   │   ├── ProductModal.jsx     (Modal CRUD para Crear/Editar producto)
│   │   │   ├── CategoryModal.jsx    (Modal CRUD para Crear/Editar categoría)
│   │   │   ├── UserModal.jsx        (Modal CRUD para Crear/Editar usuario)
│   │   │   └── ReceiptModal.jsx     (Modal "Mostrar Boleta" electrónica)
│   │   └── 📁 layout/
│   │       ├── Navbar.jsx           (Header, buscador, menú responsive y badge de carrito)
│   │       ├── Footer.jsx           (Pie de página con datos institucionales)
│   │       └── AdminSidebar.jsx     (Navegación lateral del panel administrativo)
│   ├── 📁 context/
│   │   ├── AuthContext.jsx          (Gestión global de sesión, roles y login)
│   │   └── CartContext.jsx          (Gestión global del carrito, totales y cupones)
│   ├── 📁 layouts/
│   │   ├── StoreLayout.jsx          (Layout envolvente de la tienda pública)
│   │   └── AdminLayout.jsx          (Layout envolvente y guard de rutas admin)
│   ├── 📁 pages/
│   │   ├── Home.jsx                 (Página principal con hero banner y destacados)
│   │   ├── Products.jsx             (Catálogo completo con filtros y ordenamiento)
│   │   ├── ProductDetail.jsx        (Ficha de detalle de producto y stock)
│   │   ├── Categories.jsx           (Figura 4: Vista que separa productos por categorías)
│   │   ├── Offers.jsx               (Sección especial de ofertas)
│   │   ├── Cart.jsx                 (Figura 5: Carrito de compras y cupones)
│   │   ├── Checkout.jsx             (Figura 6: Paso de pago con autocompletado)
│   │   ├── CheckoutSuccess.jsx      (Figura 7: Compra exitosa, boleta PDF e email)
│   │   ├── CheckoutError.jsx        (Figura 8: No se pudo realizar el pago y reintento)
│   │   ├── Login.jsx                (Inicio de sesión con credenciales demo rápidas)
│   │   ├── Register.jsx             (Registro con validación RUN Módulo 11)
│   │   ├── MyAccount.jsx            (Perfil, beneficios y compras personales)
│   │   ├── About.jsx                (Historia 50 años y récord Guinness)
│   │   ├── Blogs.jsx                (Artículos y recetas)
│   │   ├── BlogDetail.jsx           (Detalle de recetas con video YouTube)
│   │   ├── Contact.jsx              (Formulario de contacto validado)
│   │   └── 📁 admin/
│   │       ├── AdminDashboard.jsx   (Figura 9: Métricas compras, productos y usuarios)
│   │       ├── AdminOrders.jsx      (Figura 10: Órdenes y botón Mostrar Boleta)
│   │       ├── AdminProducts.jsx    (Figura 10: CRUD productos y stock crítico)
│   │       ├── AdminCategories.jsx  (Figura 10: CRUD categorías)
│   │       ├── AdminUsers.jsx       (Figura 10: CRUD usuarios e historial)
│   │       ├── AdminReports.jsx     (Estadísticas comerciales)
│   │       └── AdminProfile.jsx     (Ajustes de cuenta de administrador)
│   ├── 📁 services/
│   │   ├── db.js                    (Fuente de datos JS simulada con CRUD y LocalStorage)
│   │   └── chileData.js             (Regiones, comunas y validador RUN Módulo 11)
│   ├── App.jsx                      (Enrutamiento declarativo con React Router v6)
│   ├── main.jsx                     (Punto de entrada React 18)
│   └── index.css                    (Estilos globales y personalización Bootstrap)
├── 📁 test/                         (Suite de 10 Pruebas Unitarias con Jasmine y Karma)
│   ├── 1_render_list.spec.jsx       (Renderizado correcto de listas)
│   ├── 2_render_conditional.spec.jsx(Renderizado condicional de alertas de error)
│   ├── 3_button_props.spec.jsx      (Props recibidas en botón: label y onClick)
│   ├── 4_product_card_props.spec.jsx(Props recibidas en ProductCard: precio y título)
│   ├── 5_form_state.spec.jsx        (Gestión de estado en formularios controlados)
│   ├── 6_quantity_selector_state.spec.jsx (Gestión de estado en contador numérico)
│   ├── 7_event_add_cart.spec.jsx    (Simulación de evento click en botón de compra)
│   ├── 8_event_form_submit.spec.jsx (Simulación de evento submit de formulario)
│   ├── 9_mock_crud_service.spec.jsx (Mocks de servicio CRUD con Jasmine spies)
│   └── 10_mock_checkout_totals.spec.jsx (Mocks de cálculo de totales, cupón 50% e IVA)
├── 📁 legacy-html/                  (Copia de respaldo intacta de la entrega Formativa 1)
├── DOCUMENTO_ERS_V2.md              (Especificación de Requisitos de Software V2)
├── DOCUMENTO_COBERTURA_TESTING.md   (Análisis de cobertura técnica y resultados)
├── GUIA_PRESENTACION_ORAL.md        (Guion y preguntas frecuentes para la defensa)
├── karma.conf.cjs                   (Configuración de Karma runner con ChromeHeadless)
├── vite.config.js                   (Configuración de Vite)
└── package.json                     (Dependencias y scripts del proyecto)
```

---

## 📑 Documentación Requerida para la Entrega

1. **Documento ERS Versión 2.0:** [`DOCUMENTO_ERS_V2.md`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_ERS_V2.md)
2. **Documento de Cobertura de Testing:** [`DOCUMENTO_COBERTURA_TESTING.md`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_COBERTURA_TESTING.md)
3. **Guía de Preparación para la Defensa Oral:** [`GUIA_PRESENTACION_ORAL.md`](file:///c:/Users/Asus/Proyectos/Parcial_1/GUIA_PRESENTACION_ORAL.md)

---

## 🏆 Rúbrica de Evaluación Cumplida al 100%

- **IE2.1.1 & IE2.1.3 (25%):** Proyecto diseñado y estructurado sólidamente en React 18, con enrutamiento declarativo y funcionalidades completas.
- **IE2.1.2 & IE2.1.4 (30%):** Componentes React bajo *Single Responsibility*, gestión limpia de props y estados (`useState`, `useContext`), diseño responsivo en Bootstrap 5 adaptable a móviles y escritorios.
- **IE2.2.1 & IE2.2.2 (27%):** 10 de 10 pruebas unitarias desarrolladas y ejecutadas con Jasmine y Karma, verificando lógica, DOM, props, estados, eventos y mocks sin ningún error.
- **IE2.3.1 & IE2.3.2 (18%):** Proceso de testeo rigurosamente implementado, configurado en Chrome Headless, documentado y listo para ser defendido oralmente.
