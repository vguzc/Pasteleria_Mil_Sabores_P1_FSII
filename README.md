# 🎂 Pastelería Mil Sabores - Evaluación Formativa 1 (Fullstack II)

¡Bienvenidos al repositorio oficial del proyecto **Pastelería Mil Sabores**! Este sitio web e-commerce ha sido diseñado y desarrollado como parte de la Evaluación Formativa 1 de la asignatura **Fullstack II**.

---

## 📋 Descripción del Proyecto

El proyecto consiste en una plataforma web interactiva para una pastelería tradicional ("Mil Sabores") que celebra su 50° aniversario. La aplicación incluye catálogo de productos, carrito de compras con cálculo de totales y descuentos, autenticación multi-rol, panel de administración (CRUD), blogs institucionales y formularios validados.

---

## 📁 Paso 2.1: Estructura de Archivos del Proyecto

Asegúrense de crear todas las páginas exigidas en la pauta:

```plaintext
📁 pasteleria-mil-sabores/
├── index.html                  (Home principal)
├── productos.html              (Catálogo con filtros)
├── detalle-producto.html       (Personalización y botón agregar)
├── carrito.html                (Resumen del carrito)
├── registro.html               (Registro + Reglas de descuento)
├── login.html                  (Inicio de sesión)
├── nosotros.html               (Historia 50 aniversario / Guinness 1995)
├── blogs.html                  (Noticias y recetas Duoc)
├── detalle-blog-1.html         (Detalle noticia 1)
├── detalle-blog-2.html         (Detalle noticia 2)
├── contacto.html               (Formulario de contacto)
├── admin-home.html             (Panel de administración)
├── admin-productos.html        (Mantenedor de productos)
├── admin-usuarios.html         (Mantenedor de usuarios)
├── 📁 css/
│   ├── styles.css              (Variables, paleta #FFF5E1, #FFC0CB, #8B4513 y fuentes Lato/Pacifico)
│   ├── tienda.css              (Estilos de catálogo, productos y carrito)
│   ├── formularios.css         (Estilos de registro, login y contacto)
│   └── admin.css               (Estilos del panel administrativo)
└── 📁 js/
    ├── storage.js              (Persistencia localStorage)
    ├── regiones-comunas.js     (Arreglo JS de regiones/comunas)
    ├── registro.js             (Validaciones RUN, correo, edad y descuentos)
    ├── login.js                (Autenticación y roles Admin/Vendedor/Cliente)
    ├── productos.js            (Arreglo dinámico de tortas/postres)
    ├── carrito.js              (Lógica de agregar, eliminar y calcular total)
    ├── contacto.js             (Validación de formulario de contacto)
    └── admin.js                (Lógica CRUD para mantenedores)
```

---

## 🎨 Guía de Estilo y Diseño

- **Paleta de Colores**:
  - `Fondo Principal / Crema`: `#FFF5E1`
  - `Secundario / Rosado Pastel`: `#FFC0CB`
  - `Acento / Café Chocolate`: `#8B4513`
- **Tipografías**:
  - `Títulos y Encabezados`: Google Fonts - **Pacifico**
  - `Cuerpo de Texto y Formularios`: Google Fonts - **Lato**

---

## 👥 Organización del Trabajo en Equipo y Ramas (GitFlow)

El repositorio está estructurado en ramas de funcionalidades (*feature branches*) para que cada integrante del equipo trabaje de manera independiente en su respectivo módulo:

| Rama | Responsabilidad / Módulo Asignado |
| :--- | :--- |
| `main` | Rama de producción y versión final evaluada. |
| `develop` | Rama principal de integración para el equipo de desarrollo. |
| `feature/catalogo-carrito` | Desarrollo de `productos.html`, `detalle-producto.html`, `carrito.html`, `css/tienda.css`, `js/productos.js` y `js/carrito.js`. |
| `feature/login-admin` | Desarrollo de `login.html`, `admin-home.html`, `admin-productos.html`, `admin-usuarios.html`, `css/admin.css`, `js/login.js` y `js/admin.js`. |
| `feature/registro-descuentos` | Desarrollo de `registro.html`, `nosotros.html`, `blogs.html`, `detalle-blog-*.html`, `contacto.html`, `css/formularios.css`, `js/registro.js`, `js/regiones-comunas.js` y `js/contacto.js`. |

---

## 🛠️ Instrucciones de Trabajo para Integrantes del Grupo

### 1. Clonar el Repositorio
```bash
git clone https://github.com/vguzc/Formativa_1_Fullstack_II.git
cd Formativa_1_Fullstack_II
```

### 2. Cambiar a tu Rama Asignada
```bash
git checkout feature/<nombre-de-tu-rama>
```
*Ejemplo:* `git checkout feature/catalogo-carrito`

### 3. Sincronizar Cambios de `develop` Antes de Trabajar
```bash
git pull origin develop
```

### 4. Guardar y Subir tus Avances
```bash
git add .
git commit -m "feat: agrega avances en módulo asignado"
git push origin feature/<nombre-de-tu-rama>
```

### 5. Integración (Pull Request)
Al completar una funcionalidad en tu rama, crea un **Pull Request (PR)** hacia la rama `develop` para que el grupo revise e integre los cambios antes de fusionar a `main`.

---
¡Mucho éxito al equipo en el desarrollo de la Evaluación Formativa 1! 🎂🧁✨
