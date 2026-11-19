# Guía de Preparación para la Presentación Oral
## Evaluación Parcial N° 3 — Situación Evaluativa 2 (60% de la Ponderación)
### Asignatura: DSY1104 - Desarrollo Fullstack II (Duoc UC)

Esta guía contiene las respuestas técnicas recomendadas y el discurso estructurado para responder de forma sobresaliente a cada uno de los 6 indicadores evaluados de manera individual por el docente.

---

### Indicador 1 (IE3.1.2 - 12%): Conexión a Base de Datos, Lógica de Negocio y Modelos de Datos

**¿Qué debes explicar al profesor?**
* **Arquitectura de persistencia**: El backend en Spring Boot se comunica con MySQL (XAMPP) en el puerto `3306` utilizando **Spring Data JPA** e **Hibernate** como motor ORM.
* **Modelos de datos**: Explica las entidades mapeadas con anotaciones `@Entity` y relaciones relacionales:
  * `Usuario` y `Rol`: Relación `@ManyToOne` (un usuario tiene un rol determinado).
  * `Producto` y `Categoria`: Relación `@ManyToOne` con clave foránea `categoria_id`.
  * `Orden` y `DetalleOrden`: Relación `@OneToMany` con cascada (`CascadeType.ALL`), donde cada ítem descuenta el stock disponible del producto correspondiente.
* **Lógica de negocio implementada**:
  * Descuento automático de stock al procesar una orden de compra en `OrdenService.java`.
  * Encriptación irreversible de contraseñas mediante **BCrypt** antes de almacenarlas en la base de datos.
  * Validación de que no existan correos duplicados al registrarse.

---

### Indicador 2 (IE3.2.3 - 12%): API REST con Spring Boot, Operaciones CRUD y Swagger

**¿Qué debes explicar al profesor?**
* **Estructura RESTful**: Se implementaron controladores REST anotados con `@RestController` y `@RequestMapping`:
  * `ProductoController`: Operaciones GET (lectura pública), POST (creación), PUT (edición) y DELETE (eliminación).
  * `CategoriaController`: CRUD completo para la clasificación de repostería.
  * `OrdenController`: Creación y consulta de pedidos.
  * `UsuarioController`: Administración de usuarios con control de privilegios.
* **Documentación con Swagger / OpenAPI**:
  * Se integró la dependencia `springdoc-openapi-starter-webmvc-ui`.
  * Los endpoints están documentados con etiquetas `@Tag`, `@Operation` y esquemas de respuesta.
  * Al ingresar a `http://localhost:8080/swagger-ui.html`, el docente puede ver y probar en vivo cada método HTTP (GET, POST, PUT, DELETE) y probar los endpoints protegidos con el botón *Authorize*.

---

### Indicador 3 (IE3.2.4 - 10%): Integración Efectiva Backend $\leftrightarrow$ Frontend y Flujo de Datos

**¿Qué debes explicar al profesor?**
* **Flujo de comunicación asíncrona**: El frontend en React no accede directamente a la base de datos; consume la API REST a través de `src/services/api.js` utilizando peticiones asíncronas (`fetch`) en formato JSON.
* **Eficiencia y desacoplamiento**:
  * El frontend se enfoca en la renderización y la experiencia de usuario (Single Page Application).
  * El backend centraliza las reglas de negocio, validaciones y la persistencia en MySQL.
* **Configuración CORS**: Se habilitó una política en `SecurityConfig.java` para permitir que el cliente React (`localhost:3000`) envíe peticiones HTTP con cabeceras de autorización (`Authorization: Bearer`) sin bloqueos de navegador.

---

### Indicador 4 (IE3.3.4 - 10%): Autenticación basada en Roles y Tokens JWT en el Backend

**¿Qué debes explicar al profesor?**
* **Arquitectura sin estado (Stateless)**: No se guardan sesiones en la memoria del servidor; cada petición es autenticada de manera independiente mediante un token **JWT (JSON Web Token)** firmado criptográficamente con algoritmo **HMAC-SHA256**.
* **Generación del Token**:
  * Al invocar `POST /api/auth/login`, `AuthService` valida las credenciales con `BCryptPasswordEncoder`.
  * Si coinciden, `JwtTokenProvider` genera el token incluyendo en los *claims* el correo del usuario y sus roles asignados (`ROLE_ADMINISTRADOR`, `ROLE_VENDEDOR`, `ROLE_CLIENTE`).
* **Filtro de seguridad**: En cada petición entrante, `JwtAuthenticationFilter` extrae la cabecera `Authorization: Bearer <token>`, valida su firma y vigencia, y registra la autenticación en el `SecurityContextHolder`. Si el rol no cuenta con privilegios suficientes, el servidor retorna HTTP 403 Forbidden.

---

### Indicador 5 (IE3.3.5 - 8%): Gestión de Sesiones y Persistencia en el Frontend

**¿Qué debes explicar al profesor?**
* **Manejo del estado global**: Se gestiona mediante **React Context API** en `src/context/AuthContext.jsx`.
* **Persistencia ante recargas (F5)**:
  * Al iniciar sesión exitosamente, el token JWT y el perfil se almacenan en el `localStorage` del navegador.
  * Cuando el usuario recarga la página, el hook `useEffect` en `AuthContext` detecta el token existente, consulta el endpoint `/api/auth/me` para verificar su validez y restablece el estado de autenticación de forma instantánea.
* **Cierre de sesión seguro**: La función `logout()` limpia las referencias de sesión en `localStorage` y en el estado de React, invalidando el acceso en la aplicación cliente.

---

### Indicador 6 (IE3.3.6 - 8%): Restricciones de Acceso en el Frontend según Roles

**¿Qué debes explicar al profesor?**
* **Protección de rutas**: Implementada en `src/layouts/AdminLayout.jsx`. Si un usuario no autenticado intenta entrar a `/admin`, es redirigido inmediatamente a `/login`. Si un cliente convencional entra a `/admin`, el sistema lo redirige a su panel `/mi-cuenta`.
* **Granularidad por rol**:
  * **Vendedor**: Puede consultar productos y categorías y gestionar órdenes.
  * **Administrador**: Tiene acceso total, incluyendo el módulo exclusivo `/admin/usuarios` para crear o modificar roles.
* **Seguridad en dos capas**: Explica enfáticamente que la restricción visual en React mejora la experiencia de usuario, pero la **seguridad real está reforzada en el Backend con Spring Security**, garantizando que aunque un usuario malintencionado intente forzar una llamada HTTP directa, el backend rechazará la operación si el token no tiene el rol correspondiente.
