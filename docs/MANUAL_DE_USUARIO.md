# Manual de Usuario
## Pastelería Mil Sabores — Plataforma Web de Comercio Electrónico
### Asignatura: DSY1104 - Desarrollo Fullstack II (Duoc UC)

---

## 1. Introducción
El presente manual describe el funcionamiento integral de la plataforma de comercio electrónico de **Pastelería Mil Sabores**, orientada a la venta online de productos de repostería artesanal, gestión de pedidos y administración interna.

---

## 2. Cuentas de Acceso Preconfiguradas (Credenciales de Prueba)

Para probar todos los roles y permisos del sistema, se encuentran disponibles las siguientes credenciales:

| Rol | Correo Electrónico | Contraseña | Vistas y Funcionalidades Disponibles |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@duoc.cl` | `admin123` | Control total: Catálogo, Categorías, Pedidos, Usuarios y Reportes. |
| **Vendedor** | `vendedor@milsabores.cl` | `venta123` | Gestión operativa: Catálogo de productos, Categorías y Pedidos. |
| **Cliente** | `pedro.hacker20@example.com` | `clave123` | Compra, Carrito, Historial de pedidos y Mi Cuenta. |

---

## 3. Módulos de la Tienda Online (Cliente)

### 3.1 Página de Inicio (Home)
Presenta el slider promocional artesanal, las categorías destacadas, productos en oferta y llamada a la acción para el Club Mil Sabores.
> *[INSERTAR CAPTURA DE PANTALLA: Página de inicio con carrusel y catálogo]*

### 3.2 Catálogo de Productos y Filtros
Permite explorar todos los productos de la tienda, filtrar por categoría (Tortas Cuadradas, Circulares, Sin Azúcar, etc.), ordenar por precio y buscar por nombre en tiempo real.
> *[INSERTAR CAPTURA DE PANTALLA: Vista del catálogo de productos con filtros]*

### 3.3 Detalle del Producto
Muestra la fotografía de alta calidad, precio regular, precio con descuento (si aplica), descripción artesanal, selector de porciones y botón para agregar al carrito de compras.
> *[INSERTAR CAPTURA DE PANTALLA: Ficha de detalle de un producto]*

### 3.4 Carrito de Compras y Agendamiento
* **Drawer lateral y vista completa del carrito**: Modificación de cantidades, cálculo de subtotal, IVA (19%) y total.
* **Agendamiento**: Selección de fecha de entrega y horario preferente.
* **Modalidad de retiro o despacho**: Selección entre sucursales de retiro (Chicureo, Providencia, Las Condes) o despacho a domicilio con autocompletado de regiones y comunas de Chile.
> *[INSERTAR CAPTURA DE PANTALLA: Vista del carrito de compras con opciones de entrega]*

### 3.5 Proceso de Checkout y Boleta Oficial
Paso final de confirmación de compra con selección de método de pago (Webpay Plus, Transferencia, Débito). Al confirmar, se genera la orden en la base de datos MySQL y se emite la **Boleta Oficial Electrónica** con desglose de impuestos y número de orden único.
> *[INSERTAR CAPTURA DE PANTALLA: Pantalla de confirmación y Boleta Oficial con número de orden]*

---

## 4. Módulo de Autenticación y Cuentas

### 4.1 Inicio de Sesión (Login)
Permite a los usuarios identificarse con su correo y contraseña. El sistema consulta al backend en Spring Boot y almacena el token JWT correspondiente.
* Los usuarios administradores o vendedores son redirigidos automáticamente al **Panel de Gestión**.
* Los clientes son dirigidos a **Mi Cuenta**.
> *[INSERTAR CAPTURA DE PANTALLA: Formulario de inicio de sesión]*

### 4.2 Registro de Nuevos Clientes
Formulario completo con validación de formato de correo, contraseña mínima de 6 caracteres y **validación matemática de RUT chileno (Módulo 11)**. Al registrarse, el cliente queda autenticado inmediatamente.
> *[INSERTAR CAPTURA DE PANTALLA: Formulario de registro con validaciones]*

### 4.3 Mi Cuenta
Área privada del cliente donde puede visualizar su información de contacto, dirección de despacho predeterminada y el historial detallado de pedidos realizados.
> *[INSERTAR CAPTURA DE PANTALLA: Panel de Mi Cuenta del cliente]*

---

## 5. Panel de Gestión Administrativo (`/admin`)

El acceso a este módulo está estrictamente protegido por roles tanto en el frontend como en el backend.

### 5.1 Dashboard General
Muestra métricas operativas clave: total de ventas recaudadas, número de pedidos realizados, cantidad de productos activos en catálogo y usuarios registrados.
> *[INSERTAR CAPTURA DE PANTALLA: Dashboard administrativo con tarjetas de métricas]*

### 5.2 Gestión de Productos (CRUD)
Permite a Administradores y Vendedores:
* Listar todos los productos con indicador de stock.
* Crear nuevos productos con asignación de categoría, precio, stock y estado de oferta.
* Editar precios o modificar datos.
* Eliminar productos (restringido únicamente al Administrador).
> *[INSERTAR CAPTURA DE PANTALLA: Tabla de productos y modal de creación/edición]*

### 5.3 Gestión de Categorías (CRUD)
Administración de las familias de productos de la pastelería. Permite agregar nuevas categorías y editar existentes.
> *[INSERTAR CAPTURA DE PANTALLA: Gestión de categorías]*

### 5.4 Gestión de Órdenes y Ventas
Listado de todas las compras procesadas en la tienda, con detalle del cliente, fecha, total pagado, método de entrega y estado de la orden.
> *[INSERTAR CAPTURA DE PANTALLA: Listado de órdenes de compra]*

### 5.5 Administración de Usuarios (Exclusivo Administrador)
Permite revisar las cuentas registradas, modificar sus roles (`ROLE_CLIENTE`, `ROLE_VENDEDOR`, `ROLE_ADMINISTRADOR`) o dar de baja accesos.
> *[INSERTAR CAPTURA DE PANTALLA: Tabla de usuarios con botones de cambio de rol]*

---

## 6. Documentación de la API REST en Swagger UI

Para explorar y probar interactivamente los servicios REST del backend:
1. Asegurarse de tener el backend en ejecución en el puerto 8080.
2. Ingresar desde cualquier navegador a:
   ```plaintext
   http://localhost:8080/swagger-ui.html
   ```
3. Utilizar el botón **Authorize** para ingresar el token JWT obtenido desde `/api/auth/login` y probar peticiones protegidas.
> *[INSERTAR CAPTURA DE PANTALLA: Interfaz interactiva de Swagger UI]*
