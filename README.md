# Pastelería Mil Sabores

Tienda web desarrollada para la asignatura **Desarrollo Fullstack II (DSY1104)** de Duoc UC. Incluye catálogo, carrito, compra simulada y un panel de administración para gestionar productos, categorías, usuarios y pedidos.

[Ver demo en GitHub Pages](https://vguzc.github.io/Pasteleria_Mil_Sabores_P1_FSII/)

## Estado de la integración

| Área | Implementación actual |
| --- | --- |
| Frontend | React 18, Vite, React Router y Bootstrap 5. |
| Inicio de sesión y registro | El frontend intenta usar la API de Spring Boot con JWT y puede operar con datos locales. El registro también guarda una copia en el navegador. |
| Catálogo, pedidos y mantenedores | Las pantallas actuales usan `localStorage`. Los cambios quedan en el navegador donde se realizan. |
| API REST | Spring Boot, Spring Security, Spring Data JPA y MySQL. Swagger permite probar los endpoints de autenticación, productos, categorías, usuarios y órdenes. |
| Demo pública | GitHub Pages publica el frontend. El backend se ejecuta por separado y el cliente HTTP apunta a `localhost:8080`. |

## Ejecución local

### 1. Preparar la base de datos

Inicia MySQL o MariaDB. Si usas XAMPP, puedes importar [pasteleria_mil_sabores.sql](database/pasteleria_mil_sabores.sql) desde phpMyAdmin. El script crea la base `pasteleria_mil_sabores_db` y carga datos de ejemplo.

**Usa una base de desarrollo.** El script elimina y vuelve a crear las tablas existentes de esa base. Si tu servidor usa otro puerto o credenciales, ajusta la conexión en [application.properties](backend/src/main/resources/application.properties).

### 2. Iniciar el backend

Con **Java 21** y **Maven** instalados, ejecuta desde la raíz del repositorio:

```bash
cd backend
mvn spring-boot:run
```

La API escucha en `http://localhost:8080/api`. Puedes explorar los endpoints en [Swagger UI](http://localhost:8080/swagger-ui.html).

### 3. Iniciar el frontend

En otra terminal, desde la raíz del repositorio, ejecuta con **Node.js 18 o superior**:

```bash
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Si quieres explorar solo la demo local del frontend, puedes comenzar directamente por este paso.

## Cuentas demo del frontend

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Administrador | `admin@duoc.cl` | `admin123` |
| Vendedor | `vendedor@milsabores.cl` | `venta123` |
| Cliente general | `pedro.hacker20@example.com` | `clave123` |
| Cliente mayor de 50 años | `prueba1@gmail.com` | `clave123` |
| Cliente Duoc UC | `alumno.ejemplo@duocuc.cl` | `clave123` |

## Pruebas y compilación

```bash
npm test
npm run build
```

La suite del frontend contiene 11 casos con Jasmine y Karma y requiere Google Chrome. Cubre componentes de React, eventos, estado, servicios simulados y cálculos del carrito. El [resultado de pruebas registrado](resultado-testing.txt) corresponde a la ejecución guardada en el repositorio. La compilación de Vite genera el sitio en `dist/`.

## Estructura y documentación

| Ruta | Contenido |
| --- | --- |
| [src/](src/) | Pantallas, componentes, estado y servicios del frontend. |
| [backend/](backend/) | API REST y acceso a la base de datos. |
| [database/](database/) | Script de creación y carga inicial de MySQL. |
| [test/](test/) | Pruebas unitarias del frontend. |
| [docs/](docs/) | [Documento de integración](docs/DOCUMENTO_INTEGRACION.md), [manual de usuario](docs/MANUAL_DE_USUARIO.md) y [guía de presentación](docs/GUIA_DEFENSA_PRESENTACION.md). |
