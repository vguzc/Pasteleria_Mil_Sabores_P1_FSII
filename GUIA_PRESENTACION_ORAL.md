# 🎤 Guía Maestra para la Presentación y Defensa Oral
## Evaluación Parcial N° 2 — DSY1104 Desarrollo Fullstack II
**Ponderación:** 60% de la Evaluación Parcial 2 (Tiempo: 15 minutos de exposición + 5 minutos de preguntas abiertas)  
**Proyecto:** Pastelería Mil Sabores (Frontend React 18 + Testing Jasmine/Karma)

---

## ⏱️ Estructura Cronometrada de los 15 Minutos

```plaintext
[00:00 - 03:00] Bloque 1: Arquitectura y Diseño Frontend en React (IE2.1.3 - 15%)
[03:00 - 08:00] Bloque 2: Demostración Funcional, Componentes, Props, State y Bootstrap (IE2.1.4 - 20%)
[08:00 - 12:00] Bloque 3: Demostración de las 10 Pruebas Unitarias en Jasmine y Karma (IE2.2.2 - 15%)
[12:00 - 15:00] Bloque 4: Pipeline de Testeo, Mocks, Spies y Calidad de Código (IE2.3.2 - 10%)
[15:00 - 20:00] Ronda de Preguntas Abiertas de la Comisión Evaluadora
```

---

## 📋 Guion Detallado por Bloques

### 🗣️ Bloque 1 (Minutos 0 a 3): Arquitectura y Modernidad Frontend
- **Saludo y Contexto:** "Estimado docente y comisión: Hoy presentamos la modernización de la plataforma para **Pastelería Mil Sabores** en sus 50 años. Migramos desde una versión HTML/CSS estática hacia una **Single Page Application (SPA)** de alto rendimiento utilizando **React 18**, empaquetada con **Vite 5** y estructurada modularmente."
- **Puntos Clave a Destacar:**
  - **Enrutamiento del Cliente:** Uso de `react-router-dom` v6 con layouts dedicados (`StoreLayout` para clientes y `AdminLayout` para gestión).
  - **Single Responsibility Principle (SRP):** Cada componente tiene una única responsabilidad: `ProductCard` (presentación y feedback), `QuantitySelector` (control numérico), `AlertMessage` (renderizado condicional), `Button` (variantes de acción).
  - **Persistencia Reactiva en JavaScript:** Implementación del servicio `src/services/db.js` que emula una base de datos con operaciones CRUD completas y persistencia en `localStorage`, emitiendo eventos (`storage-updated`, `cart-updated`, `auth-changed`) para mantener la UI sincronizada en tiempo real.

---

### 🗣️ Bloque 2 (Minutos 3 a 8): Demostración en Vivo del Sistema
*(Abrir la aplicación corriendo en `http://localhost:3000`)*

1. **Flujo de Navegación de la Tienda:**
   - **Home:** Banner de 50 años, acceso directo al catálogo y carrusel de categorías.
   - **Categorías (Figura 4):** Mostrar la vista `/categorias` con las tarjetas superiores y cómo al hacer clic se filtran los productos dinámicamente en el contenedor inferior.
   - **Ficha de Producto (`/producto/:id`):** Mostrar el selector de cantidad controlado (`QuantitySelector`) y el feedback visual al hacer clic en "+ Agregar".
   - **Carrito (`/carrito`, Figura 5):** Mostrar la tabla, eliminación de ítems y la aplicación del cupón `FELICES50` (50% de descuento automático) o `DUOC10`.
   - **Checkout y Autocompletado (Figura 6):**
     - Mostrar el resumen con fotos y badge "Total a pagar".
     - **¡Demostración Clave!:** Iniciar sesión con `prueba1@gmail.com` / `clave123`. Al volver al checkout, mostrar cómo **Nombre, Apellidos, Correo, Calle, Depto, Región y Comuna se autocompletan de forma 100% automática**.
     - Simular pago aprobado -> Lleva a **Compra Exitosa (Figura 7)** con N° de orden `#20240705`, botón "Imprimir boleta en PDF" (`window.print()`) y "Enviar boleta por email".
     - Activar el switch "Forzar error de pago" -> Lleva a **Pago con Error (Figura 8)** con botón destacado "VOLVER A REALIZAR EL PAGO".

2. **Panel de Administración (Figuras 9 y 10):**
   - Iniciar sesión con `admin@duoc.cl` / `admin123`.
   - **Dashboard (Figura 9):** Mostrar las tarjetas métricas (Compras, Productos, Usuarios) y los accesos rápidos.
   - **Órdenes y Boletas:** Mostrar el botón **"Mostrar Boleta"** que abre el modal con la boleta electrónica legal y el desglose de IVA.
   - **Mantenedor de Productos (CRUD):** Mostrar la pestaña de **Stock Crítico (≤ 6 un.)**, crear un nuevo producto y editar uno existente.
   - **Mantenedor de Usuarios:** Mostrar el botón para ver el **Historial de Compras** específico de cada cliente.

3. **Responsividad con Bootstrap 5:**
   - Abrir la consola de desarrollo (F12) y activar la vista móvil (iPhone / Pixel). Mostrar cómo la barra de navegación se convierte en menú colapsable (hamburguesa) y las grillas pasan fluidamente de 4 a 2 y 1 columna.

---

### 🗣️ Bloque 3 (Minutos 8 a 12): Demostración de las 10 Pruebas Unitarias
*(Abrir la terminal y ejecutar `npm test`)*

- **Explicación frente a la comisión:**
  "Para asegurar la calidad del código, configuramos **Karma** como test runner junto con **Jasmine** como framework de aserciones. Todas las pruebas corren en **Chrome Headless** y abarcan los 5 ejes requeridos por la pauta docente:"
  1. **Pruebas 1 y 2 (Renderizado):**
     - `1_render_list.spec.jsx`: Verifica que una lista mapee exactamente todos los elementos de un array.
     - `2_render_conditional.spec.jsx`: Verifica que `AlertMessage` solo exista en el DOM si hay un error real y desaparezca cuando el estado sea nulo.
  2. **Pruebas 3 y 4 (Props):**
     - `3_button_props.spec.jsx`: Valida la recepción de la etiqueta y el evento `onClick`.
     - `4_product_card_props.spec.jsx`: Valida la inyección de la entidad `Product` y el formateo de moneda en pesos chilenos (`$24.990`).
  3. **Pruebas 5 y 6 (State):**
     - `5_form_state.spec.jsx`: Comprueba que los inputs controlados actualicen su estado interno ante eventos `onChange`.
     - `6_quantity_selector_state.spec.jsx`: Comprueba el control del contador numérico ante clics de incremento y decremento.
  4. **Pruebas 7 y 8 (Eventos):**
     - `7_event_add_cart.spec.jsx`: Simula el clic del usuario en "+ Agregar" y comprueba que se llame al callback con el producto seleccionado.
     - `8_event_form_submit.spec.jsx`: Simula el envío de un formulario asegurando que se ejecute `preventDefault()`.
  5. **Pruebas 9 y 10 (Mocks y Lógica de Negocio):**
     - `9_mock_crud_service.spec.jsx`: Aísla el acceso a almacenamiento físico mediante `spyOn(productService, 'getAll')`.
     - `10_mock_checkout_totals.spec.jsx`: Valida el cálculo matemático del 50% de descuento con `FELICES50`, cálculo de IVA (19%) y envío gratuito.

- **Resultado en Vivo:** Mostrar la salida de Karma en la terminal: **`TOTAL: 10 SUCCESS (0.07 secs) — 0 FAILED`**.

---

### 🗣️ Bloque 4 (Minutos 12 a 15): Arquitectura del Pipeline y Mocks
- **Detallar la configuración técnica:**
  - Cómo `karma-webpack` y `babel-loader` transforman el código JSX moderno antes de entregarlo a Chrome Headless.
  - El uso de `null-loader` para descartar hojas de estilo CSS durante las pruebas unitarias y acelerar la ejecución a menos de una décima de segundo.
  - El rol de los spies de Jasmine (`jasmine.createSpy`) para verificar llamadas a funciones sin acoplamiento a servicios externos.

---

## ❓ Preguntas Frecuentes de la Comisión Evaluadora y Respuestas Sugeridas

#### Pregunta 1: "¿Por qué decidieron utilizar React en lugar de mantener JavaScript Vanilla?"
> **Respuesta:** "React nos permite trabajar con un **Virtual DOM**, lo que optimiza enormemente el rendimiento en aplicaciones dinámicas como un e-commerce. Además, la arquitectura basada en componentes reutilizables nos permite cumplir estrictamente con el principio de **Responsabilidad Única**, facilitando el mantenimiento y permitiendo testear cada pieza de interfaz de forma aislada mediante pruebas unitarias."

#### Pregunta 2: "¿Cómo gestionan el estado global y la persistencia en tiempo real?"
> **Respuesta:** "Utilizamos la **API Context de React** (`AuthContext` y `CartContext`) combinada con hooks personalizados (`useAuth`, `useCart`). Para la persistencia, creamos un servicio centralizado en `src/services/db.js` que interactúa con `localStorage` y emite eventos sintéticos (`storage-updated`, `cart-updated`, `auth-changed`) para garantizar que cualquier cambio realizado en un componente o mantenedor administrativo se refleje inmediatamente en toda la interfaz sin necesidad de recargar la página."

#### Pregunta 3: "¿Cómo aseguraron que el diseño fuera responsivo en diferentes pantallas?"
> **Respuesta:** "Integramos el sistema de grillas responsivas de **Bootstrap 5** (`row-cols-1 row-cols-sm-2 row-cols-lg-4`, clases flexbox y utilidades de espaciado). Implementamos un menú colapsable para smartphones, tablas con envoltorio `table-responsive` para que no se desborden en pantallas pequeñas y tarjetas de producto que adaptan su layout automáticamente desde 360px hasta monitores 4K."

#### Pregunta 4: "¿Cuál es la ventaja de usar Jasmine y Karma en lugar de probar manualmente en el navegador?"
> **Respuesta:** "Las pruebas manuales son propensas a errores humanos y toman mucho tiempo. **Karma** ejecuta las pruebas en un navegador real sin cabeza (**Chrome Headless**), permitiendo simular eventos de usuario y verificar el renderizado real del DOM. **Jasmine** nos proporciona aserciones descriptivas y un sistema de **Mocks y Spies** que permite aislar la lógica de negocio de la base de datos física, garantizando pruebas reproducibles en tan solo 0.07 segundos."

#### Pregunta 5: "¿Cómo se implementó el autocompletado en el checkout solicitado en la pauta?"
> **Respuesta:** "En el componente `Checkout.jsx`, conectamos un hook `useEffect` al estado `currentUser` provisto por `AuthContext`. Si el usuario tiene una sesión activa, el efecto asigna automáticamente su nombre, apellidos, correo, dirección registrada, región y comuna al formulario. Si el cliente no ha iniciado sesión, el formulario queda en blanco para ingreso manual y se muestra una alerta invitándolo a identificarse."
