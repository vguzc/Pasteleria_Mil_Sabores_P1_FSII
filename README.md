# Pasteleria Mil Sabores - Evaluacion Parcial N 2 (Fullstack II)
## Frontend Moderno en React 18 + Suite de Pruebas Unitarias con Jasmine y Karma

Repositorio oficial para la **Evaluacion Parcial N 2** de la asignatura **Desarrollo Fullstack II (DSY1104)** de **Duoc UC**.

El proyecto corresponde a la migracion y evolucion integral de la tienda de comercio electronico **Pasteleria Mil Sabores** hacia un frontend modular basado en **React 18 (Vite 5)**, diseno responsivo con **Bootstrap 5**, arquitectura orientada al principio de **Single Responsibility**, persistencia reactiva simulada con LocalStorage (CRUD) y aseguramiento de calidad con **11 pruebas unitarias automatizadas en Jasmine y Karma (11/11 - 100% exito)**.

---

## Inicio Rapido (Instrucciones de Ejecucion)

### 1. Prerrequisitos
- **Node.js**: v18+ (probado en Node.js v24)
- **Navegador**: Google Chrome (requerido para el ejecutor headless de Karma)

### 2. Instalacion de dependencias
```bash
npm install
```

### 3. Levantar el servidor de desarrollo
```bash
npm run dev
# o alternativamente:
npm start
```
La aplicacion estara disponible en `http://localhost:3000/`.

### 4. Ejecutar la suite de pruebas unitarias automatizadas (Karma + Jasmine)
```bash
npm test
```
Ejecuta las 11 pruebas unitarias sobre `ChromeHeadless` y emite el reporte detallado en terminal:
```plaintext
Chrome Headless: Executed 11 of 11 SUCCESS (0.10 secs)
TOTAL: 11 SUCCESS
```

### 5. Compilar para produccion (Build)
```bash
npm run build
```
Genera la version optimizada de distribucion en la carpeta `dist/`.

---

## Cuentas de Acceso de Prueba (Demo)

El sistema incluye credenciales precargadas para facilitar la revision y evaluacion academica:

| Rol | Correo Electronico | Contrasena | Vistas y Permisos Habilitados |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@duoc.cl` | `admin123` | **Panel Admin Completo:** Dashboard con metricas, Gestion de Ordenes y Emision de Boleta, Mantenedor CRUD de Productos (control de stock critico), Mantenedor CRUD de Categorias, Mantenedor CRUD de Usuarios con historial de compras, Reportes Financieros y Perfil. |
| **Vendedor** | `vendedor@milsabores.cl` | `venta123` | **Panel Operativo:** Dashboard, Gestion de Ordenes y Boletas, Mantenedor CRUD de Productos y Categorias. (Usuarios restringido). |
| **Cliente Senior (50+)** | `prueba1@gmail.com` | `clave123` | Tienda, Carrito, Checkout con autofill, aplicacion del beneficio Senior (50% OFF con `FELICES50`), Mi Cuenta e Historial de pedidos. |
| **Cliente Duoc UC** | `alumno.ejemplo@duocuc.cl` | `clave123` | Tienda, Carrito, Checkout con autofill, validacion del convenio institucional (10% OFF con `DUOC10`). |
| **Cliente General** | `pedro.hacker20@example.com` | `clave123` | Tienda, Carrito, Checkout asistido y comprobante de boleta electronica. |

---

## Cupones de Descuento y Reglas de Negocio

- **`FELICES50`**: **50% de descuento** en el total de productos. Beneficio oficial de los 50 anos de la pasteleria para clientes mayores de 50 anos.
- **`DUOC10`**: **10% de descuento** exclusivo para la comunidad institucional Duoc UC. Requiere ingresar o contar con una cuenta con dominio institucional oficial (`@duocuc.cl`, `@profesor.duoc.cl` o `@duoc.cl`).
- **Regla de Despacho a Domicilio**:
  - Compras superiores a **$30.000**: Despacho 100% gratuito ($0).
  - Compras entre **$20.000 y $29.999**: Tarifa preferencial con ahorro de $2.000 ($1.990).
  - Compras inferiores a **$20.000**: Tarifa estandar de $3.990.
  - **Retiro en Pasteleria**: Gratuito en sucursales Chicureo, Providencia y Las Condes ($0).

---

## Estructura del Proyecto

```plaintext
Parcial_1/
├── public/
│   └── img/                         (Imagenes de catalogo, monograma MS y branding)
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx           (Boton reutilizable con props y variantes)
│   │   │   └── AlertMessage.jsx     (Renderizado condicional de mensajes y alertas)
│   │   ├── store/
│   │   │   ├── ProductCard.jsx      (Ficha de producto con precio en CLP y stock)
│   │   │   ├── ProductList.jsx      (Lista de productos con filtrado reactivo)
│   │   │   └── CategoryCard.jsx     (Tarjeta de categoria para navegacion visual)
│   │   ├── cart/
│   │   │   ├── QuantitySelector.jsx (Selector numerico controlado de unidades)
│   │   │   └── CartDrawer.jsx       (Carrito lateral deslizable con agendamiento)
│   │   ├── admin/
│   │   │   ├── ProductModal.jsx     (Modal CRUD para Crear/Editar producto)
│   │   │   ├── CategoryModal.jsx    (Modal CRUD para Crear/Editar categoria)
│   │   │   ├── UserModal.jsx        (Modal CRUD para Crear/Editar usuario)
│   │   │   └── ReceiptModal.jsx     (Modal visualizador e impresor de Boleta)
│   │   └── layout/
│   │       ├── Navbar.jsx           (Header con navegacion, buscador y bolsa)
│   │       ├── Footer.jsx           (Pie de pagina institucional)
│   │       └── AdminSidebar.jsx     (Navegacion lateral del panel administrativo)
│   ├── context/
│   │   ├── AuthContext.jsx          (Gestion global de sesion, roles y autenticacion)
│   │   └── CartContext.jsx          (Gestion global de bolsa, totales y cupones)
│   ├── layouts/
│   │   ├── StoreLayout.jsx          (Layout contenedor de la tienda publica)
│   │   └── AdminLayout.jsx          (Layout contenedor y guardia de rutas admin)
│   ├── pages/
│   │   ├── Home.jsx                 (Inicio con hero slider, especialidades e historia)
│   │   ├── Products.jsx             (Catalogo con filtros, orden y paginacion)
│   │   ├── ProductDetail.jsx        (Ficha tecnica, porciones y control de stock)
│   │   ├── Categories.jsx           (Figura 4: Vista que agrupa productos por categoria)
│   │   ├── Offers.jsx               (Seccion especial de ofertas y cupones)
│   │   ├── Cart.jsx                 (Figura 5: Bolsa de compras, agendamiento y cupones)
│   │   ├── Checkout.jsx             (Figura 6: Checkout 2 columnas con Webpay Plus)
│   │   ├── CheckoutSuccess.jsx      (Figura 7: Compra exitosa y emision de boleta PDF)
│   │   ├── CheckoutError.jsx        (Figura 8: Rechazo bancario simulado y reintento)
│   │   ├── Login.jsx                (Inicio de sesion con credenciales demo rapidas)
│   │   ├── Register.jsx             (Registro con validacion RUN Modulo 11)
│   │   ├── MyAccount.jsx            (Perfil, beneficios y compras personales)
│   │   ├── About.jsx                (Historia de 50 anos y record de la pasteleria)
│   │   ├── Blogs.jsx                (Articulos y recetas tradicionales)
│   │   ├── BlogDetail.jsx           (Detalle de receta con video tutorial integrado)
│   │   ├── Contact.jsx              (Formulario de contacto y atencion)
│   │   └── admin/
│   │       ├── AdminDashboard.jsx   (Figura 9: Metricas en tiempo real y stock critico)
│   │       ├── AdminOrders.jsx      (Figura 10: Gestion de pedidos y boleta legal)
│   │       ├── AdminProducts.jsx    (Figura 10: CRUD productos y filtros de estado)
│   │       ├── AdminCategories.jsx  (Figura 10: CRUD categorias del catalogo)
│   │       ├── AdminUsers.jsx       (Figura 10: CRUD usuarios e historial comercial)
│   │       ├── AdminReports.jsx     (Reportes de facturacion y productos lideres)
│   │       └── AdminProfile.jsx     (Ajustes de perfil y clave de administrador)
│   ├── services/
│   │   ├── db.js                    (Capa de persistencia CRUD local y calculo comercial)
│   │   └── chileData.js             (Regiones, comunas y algoritmo RUN Modulo 11)
│   ├── App.jsx                      (Enrutamiento declarativo React Router v6)
│   ├── main.jsx                     (Punto de entrada de la aplicacion)
│   └── index.css                    (Manual de branding y estilos responsivos)
├── test/                            (Suite de 11 Pruebas Unitarias Jasmine + Karma)
│   ├── 1_render_list.spec.jsx       (Prueba 1: Renderizado iterativo de listas en el DOM)
│   ├── 2_render_conditional.spec.jsx(Prueba 2: Renderizado condicional de mensajes)
│   ├── 3_button_props.spec.jsx      (Prueba 3: Transferencia de props y callback click)
│   ├── 4_product_card_props.spec.jsx(Prueba 4: Props complejas y formato moneda CLP)
│   ├── 5_form_state.spec.jsx        (Prueba 5: Manejo de estado en formularios controlados)
│   ├── 6_quantity_selector_state.spec.jsx (Prueba 6: Mutacion interactiva de cantidad)
│   ├── 7_event_add_cart.spec.jsx    (Prueba 7: Simulacion sintetica de evento de click)
│   ├── 8_event_form_submit.spec.jsx (Prueba 8: Simulacion de submit con preventDefault)
│   ├── 9_mock_crud_service.spec.jsx (Prueba 9: Mocks y espias con jasmine.spyOn)
│   └── 10_mock_checkout_totals.spec.jsx (Prueba 10 y 11: Calculo de totales y validacion Duoc)
├── DOCUMENTO_ERS_V2.md              (Especificacion de Requisitos de Software V2)
├── DOCUMENTO_ERS_V2.pdf             (Version imprimible oficial de la ERS V2)
├── DOCUMENTO_COBERTURA_TESTING.md   (Informe tecnico de cobertura de pruebas Karma)
├── DOCUMENTO_COBERTURA_TESTING.pdf  (Version imprimible del informe de testing)
├── karma.conf.cjs                   (Configuracion de Karma runner con ChromeHeadless)
├── vite.config.js                   (Configuracion de Vite para empaquetado)
└── package.json                     (Dependencias y scripts del proyecto)
```

---

## Documentacion Oficial de la Entrega

1. **Especificacion de Requisitos de Software (ERS v2.0):**
   - Archivo Markdown: [`DOCUMENTO_ERS_V2.md`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_ERS_V2.md)
   - Archivo PDF Oficial: [`DOCUMENTO_ERS_V2.pdf`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_ERS_V2.pdf)
   - Archivo HTML: [`DOCUMENTO_ERS_V2.html`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_ERS_V2.html)

2. **Informe Tecnico de Cobertura y Testing Automatizado:**
   - Archivo Markdown: [`DOCUMENTO_COBERTURA_TESTING.md`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_COBERTURA_TESTING.md)
   - Archivo PDF Oficial: [`DOCUMENTO_COBERTURA_TESTING.pdf`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_COBERTURA_TESTING.pdf)
   - Archivo HTML: [`DOCUMENTO_COBERTURA_TESTING.html`](file:///c:/Users/Asus/Proyectos/Parcial_1/DOCUMENTO_COBERTURA_TESTING.html)

---

## Cumplimiento de la Rubrica de Evaluacion Parcial N 2 (Duoc UC)

| Criterio / Indicador | Ponderacion | Descripcion de la Rubrica | Estado de Cumplimiento |
| :--- | :---: | :--- | :---: |
| **IE2.1.1 & IE2.1.3** | **25%** | Arquitectura y estructuracion de la aplicacion en React 18 con Vite, enrutamiento declarativo del lado del cliente (`React Router v6`), separacion modular de tienda publica y panel administrativo, y navegacion fluida sin recargas de pagina. | **100% Cumplido** |
| **IE2.1.2 & IE2.1.4** | **30%** | Diseno de componentes bajo el principio de Responsabilidad Unica (*Single Responsibility*), gestion adecuada de propiedades (`props`), administracion reactiva de estado (`useState`, `useContext`), diseno responsivo con Bootstrap 5 y paleta de marca unificada adaptable a dispositivos moviles y escritorio. | **100% Cumplido** |
| **IE2.2.1 & IE2.2.2** | **27%** | Bateria completa de pruebas unitarias automatizadas desarrolladas con Jasmine y ejecutadas sobre Karma Runner en Chrome Headless, cubriendo renderizado iterativo, render condicional, props simples y complejas, estados locales, eventos sinteticos, mocks de servicios y reglas comerciales. | **100% Cumplido (11/11 SUCCESS)** |
| **IE2.3.1 & IE2.3.2** | **18%** | Documentacion tecnica formal del proceso de testing y de requisitos de software (ERS v2.0), analisis de cobertura, trazabilidad de componentes y preparacion integral para la presentacion y evaluacion del proyecto. | **100% Cumplido** |
