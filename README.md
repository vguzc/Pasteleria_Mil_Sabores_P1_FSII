# 🎂 Pastelería Mil Sabores — Evaluación Formativa 1 (Fullstack II)

¡Bienvenidos al repositorio oficial del proyecto **Pastelería Mil Sabores**! Este sitio web e-commerce ha sido diseñado y desarrollado como parte de la Evaluación Formativa 1 de la asignatura **Fullstack II** de **Duoc UC**.

---

## 📋 Descripción General

**Pastelería Mil Sabores** es una plataforma web e-commerce desarrollada con **HTML5, Vanilla CSS3 y JavaScript (ES6+)**, inspirada en la celebración de los 50 años de trayectoria de la pastelería artesanal chilena.

El sistema cuenta con un catálogo de productos divididos en 8 categorías oficiales, un carrito de compras dinámico con cálculo de impuestos y descuentos automáticos, un sistema de autenticación multi-rol (Cliente, Vendedor y Administrador), paneles de gestión administrativa (CRUD), perfil del usuario autenticado y una sección de blog con recetas en video.

---

## ✨ Características y Funcionalidades Principales

### 🛒 1. Catálogo de Productos y Carrito de Compras
- **8 Categorías Oficiales**: *Tortas Cuadradas, Tortas Circulares, Postres Individuales, Productos Sin Azúcar, Pastelería Tradicional, Productos Sin Gluten, Productos Veganos y Tortas Especiales*.
- **Carrito Dinámico**: Agregado directo desde el catálogo o vista de detalle, modificación de cantidades y eliminación de ítems.
- **Cálculo en Tiempo Real**: Subtotal, aplicación de cupones de descuento, cálculo de IVA (19%) y costo de envío (despacho gratis en compras superiores a $30.000 o $3.990 tarifa plana).

### 🏷️ 2. Sistema de Cupones y Beneficios Exclusivos
- **Beneficio por Edad (50+)**: 50% de descuento para clientes de 50 años o más o mediante el cupón `FELICES50`.
- **Convenio Duoc UC**: 10% de descuento automático o cupón `DUOC10` para correos de dominio institucional (`@duocuc.cl` / `@profesor.duoc.cl`).
- **Especial Fiestas Patrias**: Cupón `ESPECIAL18` con 15% de descuento.
- **Torta Gratis de Cumpleaños**: Regalo de cumpleaños reclamable para la comunidad Duoc UC durante su semana de cumpleaños.
- **Control de Uso de Cupones**: Los cupones se pueden utilizar **una sola vez por cuenta** y se eliminan automáticamente del perfil del usuario tras finalizar la compra.

### 👤 3. Autenticación y Control de Accesos Multi-Rol
- **Cliente**: Registro con validación estricta de RUN chileno (Módulo 11), fecha de nacimiento, regiones y comunas dinámicas, y formato automático en mayúsculas para nombres propios (Title Case).
- **Vendedor**: Acceso al **Panel Vendedor** (`admin-home.html`). Gestión habilitada exclusivamente para el mantenedor de productos (`admin-productos.html`). La sección de usuarios se encuentra completamente restringida y oculta del DOM.
- **Administrador**: Acceso completo al **Panel Admin** con gestión total del mantenedor de productos (`admin-productos.html`) y mantenedor de usuarios (`admin-usuarios.html`).
- **Protección de Rutas**: Control de acceso según el rol guardado en la sesión. Redirección automática a la vista autorizada si se intenta acceder a una ruta no permitida por URL.

### 📊 4. Mantenedores Administrativos (CRUD)
- **Mantenedor de Productos**: Permite buscar por código o nombre, crear nuevos productos, editar precios/stock y eliminar productos del inventario con actualización directa en `localStorage`. Incluye prevención de autocompletado y auto-recuperación ante datos corruptos.
- **Mantenedor de Usuarios**: Permite buscar, crear, editar y eliminar cuentas de clientes, vendedores y administradores.

### 📖 5. Blog, Recetas y Medios Integrados
- Sección de artículos de repostería y noticias institucionales.
- **Receta de Pasteles de Belém**: Guía completa de preparación con ingredientes desglosados y **video tutorial integrado de YouTube** (`receta-pasteles-belem.html`).
- Estilos destacados y centrados para títulos de categorías en publicaciones.

### 👤 6. Mi Cuenta (`mi-cuenta.html`)
- Muestra la información del usuario autenticado, resumen de sus beneficios de edad y convenio Duoc UC, cupones disponibles para copiar e ingresar en el carrito y estado de beneficios utilizados.

---

## 🔑 Cuentas de Prueba (Demo)

Para facilitar la evaluación y revisión del proyecto, el sistema incluye cuentas demo pre-cargadas que se inicializan en `localStorage`:

| Rol | Correo Electrónico | Contraseña | Acceso / Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@duoc.cl` | `admin123` | Panel Admin (Gestión de Productos + Usuarios) |
| **Administrador** | `admin@duocuc.cl` | `admin123` | Panel Admin (Gestión de Productos + Usuarios) |
| **Vendedor** | `vendedor@milsabores.cl` | `venta123` | Panel Vendedor (Gestión de Productos únicamente) |
| **Cliente** | `prueba1@gmail.com` | `clave123` | Tienda, Carrito, Mi Cuenta y Beneficios |

---

## 📁 Estructura de Archivos del Proyecto

```plaintext
📁 Formativa_1_Fullstack_II/
├── index.html                  (Página de Inicio / Especialidades y Banner)
├── productos.html              (Catálogo general con filtros por categoría)
├── detalle-producto.html       (Ficha detallada del producto)
├── carrito.html                (Resumen de compra, cupones e IVA)
├── registro.html               (Registro de usuario con validaciones)
├── login.html                  (Inicio de sesión con credenciales demo)
├── mi-cuenta.html              (Perfil del usuario, cupones y regalo de cumpleaños)
├── nosotros.html               (Historia 50 Aniversario y Registro Guinness)
├── blogs.html                  (Grilla de noticias y recetas)
├── receta-pasteles-belem.html (Receta detallada de Pasteles de Belém con video YouTube)
├── detalle-blog-1.html         (Detalle receta manjar casero)
├── detalle-blog-2.html         (Detalle noticia 50° Aniversario)
├── contacto.html               (Formulario de contacto validado)
├── admin-home.html             (Panel de Administración / Vendedor)
├── admin-productos.html        (Mantenedor CRUD de Productos)
├── admin-usuarios.html         (Mantenedor CRUD de Usuarios - Solo Admin)
├── 📁 css/
├── │   ├── styles.css          (Sistema de diseño principal, tokens y variables)
├── │   ├── tienda.css          (Estilos de catálogo, fichas y carrito)
├── │   ├── formularios.css     (Estilos de registro, login y contacto)
├── │   └── admin.css           (Estilos del panel administrativo y mantenedores)
└── 📁 js/
    ├── storage.js              (Persistencia e inicialización en localStorage)
    ├── regiones-comunas.js     (Diccionario dinámico de Regiones y Comunas de Chile)
    ├── registro.js             (Validación de RUN Módulo 11, fecha y Title Case)
    ├── login.js                (Lógica de autenticación, sesión y protección de rutas)
    ├── cuenta.js               (Gestión del perfil del usuario y beneficios)
    ├── productos.js            (Renderizado del catálogo y detalle de productos)
    ├── carrito.js              (Lógica del carrito, cálculo de totales y cupones)
    ├── contacto.js             (Validación de formulario de contacto)
    └── admin.js                (Lógica CRUD para los mantenedores)
```

---

## 🎨 Paleta de Colores y Estilo Visual

- **Chocolate (Acento / Cabeceras)**: `#5D4037`
- **Crema (Fondo Principal)**: `#FFF5E1`
- **Rosa Pastel (Detalles y Botones)**: `#F8BBD0`
- **Tipografías**:
  - Encabezados y Títulos: **Pacifico** (Google Fonts).
  - Cuerpo de Texto y Tablas: **Lato** (Google Fonts).
- **Aesthetic**: Diseño minimalista, elegante, iconos limpios en SVG, libre de emojis para mantener una estética profesional.

---

## 👥 Organización del Trabajo y Ramas (GitFlow)

| Rama | Responsabilidad / Módulo Asignado |
| :--- | :--- |
| `main` | Rama de producción y versión final evaluada. |
| `develop` | Rama principal de integración. |
| `feature/catalogo-carrito` | Desarrollo de catálogo, detalle de producto, carrito, beneficios de cupones, autenticación de vendedor/admin, mantenedores y recetas en video. |
| `feature/login-admin` | Desarrollo del sistema de autenticación, panel administrativo y mantenedores. |
| `feature/registro-descuentos` | Desarrollo de formularios de registro, contacto, noticias y lógica de descuentos. |

---

## 🛠️ Instrucciones para Ejecutar Localmente

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/vguzc/Formativa_1_Fullstack_II.git
   cd Formativa_1_Fullstack_II
   ```

2. **Abrir en el navegador**:
   - Abre `index.html` directamente en tu navegador preferido o utiliza una extensión como *Live Server* en VS Code.

---

© 2026 Pastelería Mil Sabores — Evaluado para la asignatura **Fullstack II** (Duoc UC).
