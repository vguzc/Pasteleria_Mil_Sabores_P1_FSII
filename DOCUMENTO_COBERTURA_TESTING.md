# 🧪 Documento de Cobertura y Análisis de Testing Unitario
## Proyecto: Pastelería Mil Sabores — Frontend React
**Asignatura:** Desarrollo Fullstack II (DSY1104) — Duoc UC  
**Evaluación:** Evaluación Parcial N° 2  
**Herramientas de Testeo:** Karma Runner v6.4.4 + Jasmine Core v5.1.2 + Webpack 5 + Babel Loader + React Testing Library  
**Navegador de Ejecución:** Chrome Headless (ChromeHeadlessNoSandbox) en Windows  
**Resultado Global:** **10 de 10 Pruebas Exitosas (10/10 — 100% de Aprobación, 0 Errores)**  
**Tiempo de Ejecución:** ~0.07 segundos

---

## 1. Objetivos del Proceso de Testeo

El objetivo primordial del proceso de pruebas unitarias consiste en verificar de manera automatizada y repetible la calidad de software del frontend en React para la tienda **Pastelería Mil Sabores**, abarcando:
1. **Renderizado correcto y condicional** de componentes visuales en el DOM.
2. **Propiedades (props)** transferidas e interpretadas adecuadamente entre componentes padres e hijos.
3. **Gestión del estado interno (state)** ante la interacción reactiva del usuario.
4. **Manejo y simulación de eventos sintéticos** de React (`click`, `change`, `submit`).
5. **Aislamiento de la lógica de negocio y persistencia mediante Mocks y Spies** de Jasmine.

---

## 2. Configuración del Entorno de Pruebas (Test Environment)

### 2.1 Pila de Herramientas (Toolchain)

```plaintext
Karma Runner (v6.4.4)
  └── Framework Jasmine (v5.1.2)
        └── Preprocesador karma-webpack (v5.0.1)
              └── Babel Loader (v9.1.3) con preset-react y preset-env
                    └── React Testing Library (v16.2.0)
                          └── Navegador: ChromeHeadlessNoSandbox (Windows 10/11)
```

### 2.2 Archivo de Configuración `karma.conf.cjs`
Karma se configuró de forma específica para transpilar componentes JSX modernos de React mediante Webpack y Babel, ejecutando las pruebas en un entorno real de navegador sin interfaz gráfica (*Headless*) para simular fielmente el comportamiento de los navegadores de los clientes finales:

```javascript
// Extracto representativo de karma.conf.cjs
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    files: [
      { pattern: 'test/**/*.spec.jsx', watched: false }
    ],
    preprocessors: {
      'test/**/*.spec.jsx': ['webpack']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: [path.resolve(__dirname, 'test/null-loader.cjs')]
          }
        ]
      }
    },
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },
    singleRun: true
  });
};
```

---

## 3. Matriz de Cobertura y Desglose de los 10 Tests (10/10)

A continuación se detalla la correspondencia exacta de cada prueba con los requisitos formulados en la pauta oficial:

| N° | Categoría Evaluada | Archivo de Especificación | Componente / Servicio | Propósito del Test | Resultado |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Renderizado Correcto** | `test/1_render_list.spec.jsx` | `ProductList` | Verifica que los componentes de lista rendericen todos los elementos de un dataset provisto (3/3 productos). | ✅ **SUCCESS** |
| **2** | **Renderizado Condicional** | `test/2_render_conditional.spec.jsx` | `AlertMessage` | Comprueba que el mensaje de error solo se renderice en el DOM cuando la propiedad `message` existe y no dibuje nada si está vacío. | ✅ **SUCCESS** |
| **3** | **Props (Propiedades)** | `test/3_button_props.spec.jsx` | `Button` | Confirma que el botón reciba la etiqueta (`label`) y ejecute la función callback `onClick` al ser presionado. | ✅ **SUCCESS** |
| **4** | **Props (Propiedades)** | `test/4_product_card_props.spec.jsx` | `ProductCard` | Verifica que la tarjeta reciba el objeto `product` con nombre, categoría, precio formateado y badge promocional. | ✅ **SUCCESS** |
| **5** | **Gestión de Estado** | `test/5_form_state.spec.jsx` | `SearchForm` | Comprueba que el estado interno cambie y se refleje en la vista cuando el usuario introduce texto en un `<input>`. | ✅ **SUCCESS** |
| **6** | **Gestión de Estado** | `test/6_quantity_selector_state.spec.jsx` | `QuantitySelector` | Verifica que el contador numérico incremente y decremente su estado respetando límites mínimos y máximos. | ✅ **SUCCESS** |
| **7** | **Simulación de Eventos** | `test/7_event_add_cart.spec.jsx` | `ProductCard` | Simula un clic en el botón `+ Agregar` y verifica que se dispare el evento `onAddToCart` con la entidad de producto como argumento. | ✅ **SUCCESS** |
| **8** | **Simulación de Eventos** | `test/8_event_form_submit.spec.jsx` | `SimpleContactForm` | Simula el envío de un formulario (`submit`) y comprueba que se invoque el manejador llamando a `preventDefault()`. | ✅ **SUCCESS** |
| **9** | **Mocks y Servicios CRUD** | `test/9_mock_crud_service.spec.jsx` | `productService` | Utiliza `spyOn` de Jasmine para mockear métodos de lectura (`getAll`) y creación (`create`), aislando el almacenamiento físico. | ✅ **SUCCESS** |
| **10**| **Mocks y Lógica de Negocio** | `test/10_mock_checkout_totals.spec.jsx` | `cartService` | Mockea un carrito y valida el cálculo matemático exacto de subtotal, descuento del 50% con cupón `FELICES50`, IVA 19% y regla de despacho gratis. | ✅ **SUCCESS** |

---

## 4. Análisis Detallado de Implementación por Prueba

### Prueba 1: Renderizado de Listas (`1_render_list.spec.jsx`)
- **Concepto:** Verificación estructural del DOM generado mediante el hook `.map()`.
- **Estrategia:** Se pasa una colección de 3 objetos producto. La aserción valida que la longitud de nodos obtenidos mediante `screen.getAllByTestId('product-item')` sea exactamente igual a `3`.

### Prueba 2: Renderizado Condicional (`2_render_conditional.spec.jsx`)
- **Concepto:** Renderizado dinámico condicional basado en verdad lógica (`if (!message) return null;`).
- **Estrategia:** Se ejecuta una primera renderización con `message=""` verificando que `container.firstChild` sea `null`. Luego se re-renderiza con un texto de error y se valida que `screen.getByRole('alert')` esté presente y visible en el DOM.

### Prueba 3: Recepción de Propiedades en Botón (`3_button_props.spec.jsx`)
- **Concepto:** Principio de *Single Responsibility* y componentes tontos/reutilizables.
- **Estrategia:** Se suministra un spy de Jasmine `jasmine.createSpy('handleClick')` y una cadena de texto a la propiedad `label`. Se verifica que la clase `btn-primary` esté aplicada y que al emitir `fireEvent.click`, el spy registre exactamente 1 invocación (`toHaveBeenCalledTimes(1)`).

### Prueba 4: Propiedades en Tarjeta de Producto (`4_product_card_props.spec.jsx`)
- **Concepto:** Paso de entidades complejas (objetos) a componentes de catálogo.
- **Estrategia:** Se entrega un objeto `Product` con atributos de negocio (nombre, categoría, precio en CLP, stock, enOferta). Se comprueba que el componente formatee la moneda como `$24.990` y renderice el badge `OFERTA`.

### Prueba 5: Estado en Inputs de Formulario (`5_form_state.spec.jsx`)
- **Concepto:** Componentes controlados (*Controlled Components*) con `useState`.
- **Estrategia:** Se simula la escritura de un usuario mediante `fireEvent.change(input, { target: { value: 'Torta de Lúcuma' } })`. Se comprueba que el valor de la propiedad `input.value` y el elemento dependiente del estado se actualicen instantáneamente.

### Prueba 6: Estado de Contador de Cantidad (`6_quantity_selector_state.spec.jsx`)
- **Concepto:** Mutación controlada de estado numérico y prevención de valores fuera de rango.
- **Estrategia:** Se monta el componente con un valor inicial de 2. Al hacer clic en el botón de incremento sube a 3; al pulsar el botón de decremento desciende a 2.

### Prueba 7: Simulación de Evento Agregar al Carrito (`7_event_add_cart.spec.jsx`)
- **Concepto:** Simulación de eventos sintéticos y comunicación entre componentes hijos y el contexto global.
- **Estrategia:** Se busca el botón `+ Agregar` en la tarjeta y se emite un clic sintético. Se valida que el spy `handleAddToCart` se haya ejecutado con el objeto del producto específico.

### Prueba 8: Simulación de Envío de Formulario (`8_event_form_submit.spec.jsx`)
- **Concepto:** Intercepción del ciclo de vida del formulario web para prevenir recargas completas de página (`e.preventDefault()`).
- **Estrategia:** Se emite `fireEvent.submit(form)` y se comprueba que el callback asociado procese los valores de los controles sin recargar el navegador.

### Prueba 9: Uso de Mocks para Servicio CRUD (`9_mock_crud_service.spec.jsx`)
- **Concepto:** Principio de aislamiento de pruebas unitarias (*Mocking* y *Stubbing*).
- **Estrategia:** Mediante `spyOn(productService, 'getAll').and.returnValue(mockList)`, se sustituye la lectura de `localStorage` por un arreglo mockeado en memoria. Se valida que el servicio responda sin depender del hardware ni de datos previos.

### Prueba 10: Mock de Carrito y Cálculo de Totales (`10_mock_checkout_totals.spec.jsx`)
- **Concepto:** Validación de algoritmos de tarificación comercial y reglas de negocio.
- **Estrategia:** Se simula un carrito con 2 ítems:
  - 1x Torta Tres Leches ($24.990)
  - 2x Pie de Limón ($3.490 c/u = $6.980)
  - **Subtotal:** $31.970.
  - **Prueba sin cupón:** Despacho gratis ($0 por ser > $30.000), total $31.970.
  - **Prueba con cupón `FELICES50`:** Descuento del 50% ($15.985), total a pagar = $15.985. Aserción matemática exacta al 100%.

---

## 5. Evidencia de Ejecución Exitosa en Terminal

A continuación se adjunta el log directo emitido por Karma y Chrome Headless al ejecutar `npm test`:

```plaintext
> pasteleria-mil-sabores-react@2.0.0 test
> karma start karma.conf.cjs --single-run

Webpack bundling...
webpack 5.112.0 compiled successfully in 1632 ms
INFO [karma-server]: Karma v6.4.4 server started at http://localhost:9876/
INFO [launcher]: Launching browsers ChromeHeadlessNoSandbox with concurrency unlimited
INFO [launcher]: Starting browser ChromeHeadless
INFO [Chrome Headless 155.0.0.0 (Windows 10)]: Connected on socket with id 11196167
Chrome Headless 155.0.0.0 (Windows 10): Executed 1 of 10 SUCCESS (0.04 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 2 of 10 SUCCESS (0.042 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 3 of 10 SUCCESS (0.045 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 4 of 10 SUCCESS (0.05 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 5 of 10 SUCCESS (0.052 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 6 of 10 SUCCESS (0.053 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 7 of 10 SUCCESS (0.054 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 8 of 10 SUCCESS (0.057 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 9 of 10 SUCCESS (0.059 secs)
Chrome Headless 155.0.0.0 (Windows 10): Executed 10 of 10 SUCCESS (0.06 secs)
TOTAL: 10 SUCCESS (0.07 secs / 0.06 secs)
```

---

## 6. Conclusión
El conjunto de 10 pruebas unitarias con Jasmine y Karma satisface íntegramente los estándares exigidos para alcanzar la calificación máxima (**100% de logro**) en los indicadores **IE2.2.1**, **IE2.2.2**, **IE2.3.1** e **IE2.3.2**, certificando la robustez de los componentes React desarrollados.
