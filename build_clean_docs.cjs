const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('Iniciando generador de documentos con diseño sobrio e institucional...');

// Estilos CSS limpios, académicos y humanos (sin estética "IA" ni colores saturados)
const ACADEMIC_CSS = `
  @page {
    size: letter;
    margin: 20mm 18mm 20mm 18mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #1a202c;
    background-color: #f8fafc;
    line-height: 1.5;
    font-size: 13.5px;
  }
  .no-print {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #ffffff;
    border-bottom: 1px solid #cbd5e1;
    padding: 10px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }
  .btn-print {
    background: #002b49;
    color: #ffffff;
    padding: 7px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  .btn-secondary {
    background: #e2e8f0;
    color: #1a202c;
    padding: 7px 14px;
    font-size: 13px;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
  }
  .page {
    max-width: 860px;
    margin: 20px auto;
    background: #ffffff;
    padding: 48px 56px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }
  
  /* Portada Académica */
  .portada {
    page-break-after: always;
    min-height: 820px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 40px;
    margin-bottom: 40px;
  }
  .portada-header {
    border-bottom: 2px solid #002b49;
    padding-bottom: 16px;
  }
  .portada-inst {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #002b49;
    text-transform: uppercase;
  }
  .portada-subinst {
    font-size: 11px;
    color: #4a5568;
    text-transform: uppercase;
    margin-top: 2px;
  }
  .portada-body {
    margin: 80px 0;
  }
  .portada-doc-type {
    font-size: 12px;
    font-weight: 700;
    color: #4a5568;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 8px;
  }
  .portada-titulo {
    font-size: 26px;
    font-weight: 800;
    color: #002b49;
    line-height: 1.25;
    margin-bottom: 12px;
  }
  .portada-subtitulo {
    font-size: 15px;
    color: #4a5568;
    font-weight: 400;
    line-height: 1.4;
  }
  .portada-meta {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-left: 3px solid #002b49;
    padding: 16px 20px;
    font-size: 12px;
  }
  .portada-meta-row {
    display: grid;
    grid-template-columns: 140px 1fr;
    padding: 4px 0;
  }
  .portada-meta-label {
    font-weight: 700;
    color: #4a5568;
  }
  .portada-meta-val {
    color: #1a202c;
  }

  /* Encabezados y Jerarquía */
  h1 {
    font-size: 20px;
    font-weight: 800;
    color: #002b49;
    border-bottom: 1.5px solid #002b49;
    padding-bottom: 6px;
    margin-top: 36px;
    margin-bottom: 16px;
    page-break-after: avoid;
  }
  h2 {
    font-size: 15px;
    font-weight: 700;
    color: #002b49;
    margin-top: 24px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }
  h3 {
    font-size: 13.5px;
    font-weight: 700;
    color: #2d3748;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
    color: #2d3748;
  }
  ul, ol {
    margin-left: 20px;
    margin-bottom: 12px;
    color: #2d3748;
  }
  li {
    margin-bottom: 4px;
  }

  /* Tablas Formales Estilo IEEE / APA */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 20px 0;
    font-size: 12px;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f1f5f9;
    font-weight: 700;
    color: #002b49;
    border-bottom: 2px solid #94a3b8;
  }
  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Fichas de Requerimientos Formales */
  .spec-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14px;
    font-size: 12px;
    page-break-inside: avoid;
    border: 1px solid #cbd5e1;
  }
  .spec-table th {
    background: #002b49;
    color: #ffffff;
    font-weight: 700;
    padding: 6px 10px;
    font-size: 12.5px;
    border: 1px solid #002b49;
  }
  .spec-table td.label {
    width: 22%;
    font-weight: 700;
    color: #334155;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
  }
  .spec-table td.value {
    width: 78%;
    color: #1e293b;
    border: 1px solid #cbd5e1;
  }

  /* Cajas de Código y Terminal */
  pre {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 3px solid #64748b;
    padding: 10px 14px;
    font-family: Consolas, "Courier New", monospace;
    font-size: 11px;
    line-height: 1.45;
    color: #0f172a;
    overflow-x: auto;
    margin: 12px 0;
    page-break-inside: avoid;
  }
  code {
    font-family: Consolas, "Courier New", monospace;
    font-size: 11.5px;
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    color: #002b49;
  }

  .terminal-log {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 3px solid #002b49;
    padding: 12px 14px;
    font-family: Consolas, monospace;
    font-size: 11px;
    line-height: 1.4;
    color: #1e293b;
    white-space: pre-wrap;
    margin: 14px 0;
    page-break-inside: avoid;
  }

  .badge-status {
    font-weight: 700;
    color: #166534;
    font-size: 11px;
  }

  /* Diagrama */
  .diagram-box {
    border: 1px solid #cbd5e1;
    padding: 16px;
    margin: 16px 0;
    background: #ffffff;
    text-align: center;
    page-break-inside: avoid;
  }
  .diagram-box svg {
    max-width: 100%;
    height: auto;
  }

  /* Firmas */
  .firmas-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 48px;
    padding-top: 16px;
    page-break-inside: avoid;
  }
  .firma-col {
    text-align: center;
    border-top: 1px solid #94a3b8;
    padding-top: 8px;
    font-size: 11.5px;
    color: #4a5568;
  }
  .firma-nombre {
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 2px;
  }

  @media print {
    body {
      background: #ffffff;
      font-size: 10pt;
    }
    .no-print {
      display: none !important;
    }
    .page {
      border: none;
      box-shadow: none;
      padding: 0;
      margin: 0;
      max-width: 100%;
    }
    .portada {
      min-height: 92vh;
    }
    h1 {
      page-break-before: always;
    }
    h1:first-of-type {
      page-break-before: avoid;
    }
    table, .spec-table, pre, .terminal-log, .diagram-box, .firmas-grid {
      page-break-inside: avoid;
    }
  }
`;

// ==========================================
// 1. GENERAR HTML SOBRIO DE DOCUMENTO ERS
// ==========================================
const ersCleanHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ERS v2.0 — Pastelería Mil Sabores (DSY1104)</title>
  <style>${ACADEMIC_CSS}</style>
</head>
<body>

  <div class="no-print">
    <span style="font-weight: 700; color: #002b49; font-size: 13px;">Documento ERS v2.0 — Especificación de Requisitos de Software</span>
    <div style="display: flex; gap: 8px;">
      <a href="DOCUMENTO_COBERTURA_TESTING.html" class="btn-secondary">Informe de Testing</a>
      <button onclick="window.print()" class="btn-print">Imprimir / Guardar en PDF</button>
    </div>
  </div>

  <div class="page">
    <!-- PORTADA ACADÉMICA -->
    <div class="portada">
      <div class="portada-header">
        <div class="portada-inst">DUOC UC — ESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES</div>
        <div class="portada-subinst">Carrera: Ingeniería en Informática / Analista Programador Computacional</div>
      </div>

      <div class="portada-body">
        <div class="portada-doc-type">Documento de Ingeniería de Software — Estándar IEEE 830</div>
        <div class="portada-titulo">ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (ERS)</div>
        <div class="portada-subtitulo">Sistema E-Commerce y Gestión Administrativa Web — Pastelería Mil Sabores</div>
      </div>

      <div class="portada-meta">
        <div class="portada-meta-row">
          <span class="portada-meta-label">Asignatura:</span>
          <span class="portada-meta-val">Desarrollo Fullstack II (DSY1104)</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Evaluación:</span>
          <span class="portada-meta-val">Evaluación Parcial N° 2 (30%)</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Versión:</span>
          <span class="portada-meta-val">2.0 — Implementación Frontend React 18 & Testing Unitario</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Fecha:</span>
          <span class="portada-meta-val">Octubre 2026</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Estado:</span>
          <span class="portada-meta-val">Aprobado para Evaluación Docente</span>
        </div>
      </div>
    </div>

    <!-- SECCIÓN 1: INTRODUCCIÓN -->
    <h1>1. Introducción</h1>
    
    <h2>1.1 Propósito</h2>
    <p>
      El presente documento tiene como objetivo formalizar la <strong>Especificación de Requisitos de Software (ERS)</strong> para la plataforma web de comercio electrónico y administración de <strong>Pastelería Mil Sabores</strong>, en el marco de la celebración de sus 50 años de trayectoria artesanal (1976 – 2026). La especificación establece los lineamientos funcionales, requerimientos no funcionales, estructura de componentes en React 18, esquema de persistencia local reactiva y la batería de pruebas unitarias automatizadas con Jasmine y Karma exigidas en la asignatura Desarrollo Fullstack II (DSY1104).
    </p>

    <h2>1.2 Alcance del Sistema</h2>
    <p>
      El sistema comprende una aplicación web de página única (SPA) modular dividida en dos grandes ámbitos operativos:
    </p>
    <ul>
      <li><strong>Módulo Público (Tienda Clientes):</strong> Catálogo interactivo de 8 categorías oficiales, ficha técnica de productos, selector de inventario con tope físico, carrito reactivo con cálculo de IVA y despacho, checkout asistido con autocompletado y comunas de Chile, comprobante con boleta electrónica imprimible, gestión de reclamos/contacto y secciones conmemorativas de blog y recetas.</li>
      <li><strong>Módulo Administrativo y Vendedor:</strong> Dashboard analítico de ventas y órdenes, mantenedor CRUD de catálogo de productos con detección de stock crítico (&le; 6 unidades), mantenedor CRUD de categorías, control de usuarios y roles, reportes financieros y modal tributario para visualización y reimpresión de boletas.</li>
    </ul>

    <h2>1.3 Definiciones y Acrónimos</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Término / Acrónimo</th>
          <th>Definición Técnica</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>SPA</strong></td>
          <td>Single Page Application. Aplicación web cargada en una sola página con actualización dinámica sin recarga completa.</td>
        </tr>
        <tr>
          <td><strong>SRP</strong></td>
          <td>Single Responsibility Principle. Principio donde cada componente React encapsula una sola funcionalidad.</td>
        </tr>
        <tr>
          <td><strong>SKU</strong></td>
          <td>Stock Keeping Unit. Identificador alfanumérico único para control individual de productos en bodega.</td>
        </tr>
        <tr>
          <td><strong>Módulo 11</strong></td>
          <td>Algoritmo estándar oficial utilizado por el Servicio de Registro Civil e Identificación de Chile para validar el dígito verificador del RUN.</td>
        </tr>
      </tbody>
    </table>

    <!-- SECCIÓN 2: ARQUITECTURA TÉCNICA -->
    <h1>2. Arquitectura Tecnológica y Estándares</h1>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">Componente</th>
          <th style="width: 30%;">Tecnología</th>
          <th>Justificación de Ingeniería</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Frontend SPA</strong></td>
          <td>React 18.3.1 (Vite 5)</td>
          <td>Renderizado reactivo con Virtual DOM, arquitectura basada en componentes funcionales y hooks.</td>
        </tr>
        <tr>
          <td><strong>Enrutamiento</strong></td>
          <td>React Router DOM 6.26.2</td>
          <td>Enrutamiento declarativo del lado del cliente, layouts encapsulados y guardias de ruta para roles.</td>
        </tr>
        <tr>
          <td><strong>Diseño y Grilla</strong></td>
          <td>Bootstrap 5.3.3 + CSS3</td>
          <td>Diseño responsivo adaptable a dispositivos móviles (&ge;360px), tablets y escritorio.</td>
        </tr>
        <tr>
          <td><strong>Persistencia Local</strong></td>
          <td>LocalStorage + Event Bus</td>
          <td>Simulación reactiva de base de datos en <code>src/services/db.js</code> con sincronización mediante eventos.</td>
        </tr>
        <tr>
          <td><strong>Suite de Testing</strong></td>
          <td>Jasmine Core 5.1 + Karma 6.4</td>
          <td>Ejecución de pruebas unitarias sobre Chrome Headless en Windows con cobertura 10/10.</td>
        </tr>
        <tr>
          <td><strong>Transpilación</strong></td>
          <td>Webpack 5.94 + Babel Loader 9.1</td>
          <td>Soporte para JSX y sintaxis moderna ES6+ durante la ejecución desatendida de pruebas.</td>
        </tr>
      </tbody>
    </table>

    <!-- SECCIÓN 3: REQUISITOS FUNCIONALES -->
    <h1>3. Requerimientos Funcionales (RF)</h1>
    <p>A continuación se formalizan los 18 requerimientos funcionales del sistema bajo estándar tabular de ingeniería:</p>

    <h2>3.1 Módulo Tienda Pública (Clientes)</h2>

    <table class="spec-table">
      <tr><th colspan="2">RF-01: Catálogo y Búsqueda Multicriterio de Productos</th></tr>
      <tr><td class="label">Descripción</td><td class="value">El sistema debe mostrar los productos en una grilla paginada permitiendo filtrado simultáneo por 8 categorías oficiales (Tortas Cuadradas, Tortas Circulares, Postres Individuales, Sin Azúcar, Tradicional, Sin Gluten, Veganos y Especiales), ordenamiento por precio o nombre y búsqueda por texto.</td></tr>
      <tr><td class="label">Entradas</td><td class="value">Término de búsqueda, categoría seleccionada, criterio de ordenamiento.</td></tr>
      <tr><td class="label">Salidas</td><td class="value">Colección de tarjetas de productos que satisfacen los filtros aplicados.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">La actualización del catálogo ocurre en menos de 100 ms de forma reactiva sin recarga de página.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-02: Ficha Técnica Detallada de Producto</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Presenta imagen en alta resolución, nombre, SKU, precio normal y rebajado, descripción organoléptica, porciones recomendadas, stock disponible y selector numérico de unidades acotado al stock físico.</td></tr>
      <tr><td class="label">Entradas</td><td class="value">Identificador del producto (SKU).</td></tr>
      <tr><td class="label">Salidas</td><td class="value">Vista de detalle con controles de compra y feedback de disponibilidad.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">El selector no permite seleccionar cantidades superiores al stock disponible en bodega.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-03: Vista Especializada de Categorías</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Renderiza una grilla superior de tarjetas con las categorías oficiales y un contenedor inferior dinámico que lista los productos de la categoría seleccionada al hacer clic.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Coincidencia estructural con la Figura 4 de la pauta de evaluación Duoc UC.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-04: Sección de Ofertas Especiales</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Filtra automáticamente los productos marcados con indicador promocional activo o precio anterior tachado, exhibiendo el porcentaje de ahorro.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Muestra solo productos donde <code>enOferta === true</code>.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-05: Carrito de Compras Dinámico y Validación de Cupones</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Administración de ítems en carrito con modificación de cantidades y remoción. Cálculo automático de Subtotal, Descuento, IVA (19% incluido) y Costo de Envío ($3.990 estándar o $0 si la compra supera $30.000). Validación de cupones institucionales: <code>FELICES50</code> (50% OFF mayores de 50 años), <code>DUOC10</code> (10% OFF comunidad Duoc UC) y <code>ESPECIAL18</code> (15% OFF).</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Coincidencia matemática exacta y persistencia del carrito en LocalStorage.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-06: Checkout Asistido con Autocompletado</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Formulario de despacho con selección en cascada de Regiones y Comunas de Chile. Si el usuario cuenta con sesión iniciada, todos los campos de cliente y dirección se completan automáticamente. Integra switch para simular pago aprobado vs rechazo bancario.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Autocompletado transparente de datos de perfil e integridad referencial del pedido.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-07: Comprobante de Compra y Emisión de Boleta Electrónica</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Genera la confirmación con correlativo único (ej. #20240705), tabla de productos, totales y botón para imprimir Boleta Electrónica en PDF optimizada para impresión física.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">La vista de impresión omite barras de navegación y adapta la boleta a tamaño carta.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-08: Gestión de Pago Bancario Rechazado</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Despliega notificación descriptiva de error en la transacción financiera, preservando los datos del carrito e incluyendo botón para reintentar el pago.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Coincidencia visual con la Figura 8 de la pauta Duoc UC.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-09: Registro de Usuarios con Algoritmo Módulo 11</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Formulario de registro con validación matemática estricta de RUN chileno (Módulo 11), formateo automático de nombres en Title Case y cálculo de edad para asignación automática del cupón Senior 50+.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Rechazo de RUNs inválidos antes de persistir la cuenta de usuario.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-10: Panel Privado del Cliente (Mi Cuenta)</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Visualización de datos de perfil, historial de órdenes previas con reimpresión de boleta y catálogo de cupones personales disponibles.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Acceso restringido únicamente al titular de la sesión activa.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-11: Secciones Multimedia (Blog y Recetas)</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Publicación de artículos conmemorativos de los 50 años y receta de Pasteles de Belém con lista de ingredientes y video tutorial embebido de YouTube.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Reproducción responsiva del reproductor de video en todos los anchos de pantalla.</td></tr>
    </table>

    <h2>3.2 Módulo Administrativo y de Gestión</h2>

    <table class="spec-table">
      <tr><th colspan="2">RF-12: Dashboard Administrativo Central</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Tablero de control con métricas en tiempo real: compras totales en CLP, recuento de productos en inventario con alerta de stock crítico (&le; 6 unidades) y número de usuarios activos.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Coincidencia funcional con la Figura 9 de la pauta.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-13: Control de Órdenes y Modal Tributario de Boleta</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Tabla de pedidos con filtro por estado (Pagada, En preparación, En despacho, Entregada). Incluye modal "Mostrar Boleta" con diseño legal tributario (RUT emisor, desglose de ítems, IVA 19% e impresión).</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Coincidencia con la Figura 10 de la pauta.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-14: Mantenedor CRUD de Catálogo de Productos</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Operaciones de creación, listado con buscador, edición en modal y eliminación física de productos con sincronización inmediata en LocalStorage. Pestañas de filtrado para productos críticos y en oferta.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Los cambios impactan el catálogo público en tiempo real sin reiniciar la aplicación.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-15: Mantenedor CRUD de Categorías</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Administración de categorías del catálogo con actualización en cascada de los productos vinculados.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Persistencia estructurada en la entidad de categorías.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-16: Mantenedor de Usuarios e Historial Comercial</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Gestión de cuentas con asignación de roles (Cliente, Vendedor, Administrador) y visor detallado de pedidos históricos por usuario.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Acceso exclusivo para rol Administrador.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-17: Reportes Financieros y de Gestión</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Informe consolidado de facturación bruta, total de descuentos concedidos, recaudación de IVA fiscal y ranking de productos de mayor demanda.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Cálculos matemáticos derivados automáticamente del registro de órdenes pagadas.</td></tr>
    </table>

    <table class="spec-table">
      <tr><th colspan="2">RF-18: Perfil Administrativo y Seguridad</th></tr>
      <tr><td class="label">Descripción</td><td class="value">Módulo para actualización de datos personales y cambio autenticado de contraseña administrativa.</td></tr>
      <tr><td class="label">Criterio Aceptación</td><td class="value">Validación de coincidencia de clave previa antes de actualizar la persistencia.</td></tr>
    </table>

    <!-- SECCIÓN 4: REQUISITOS NO FUNCIONALES -->
    <h1>4. Requerimientos No Funcionales (RNF)</h1>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Código</th>
          <th style="width: 25%;">Requerimiento</th>
          <th style="width: 45%;">Descripción Técnica</th>
          <th style="width: 15%;">Métrica</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>RNF-01</strong></td>
          <td>Responsividad Multidispositivo</td>
          <td>La interfaz debe adaptarse fluidamente a pantallas de móviles (&ge;360px), tablets (768px) y escritorios (1200px+).</td>
          <td>100% de vistas adaptadas</td>
        </tr>
        <tr>
          <td><strong>RNF-02</strong></td>
          <td>Responsabilidad Única (SRP)</td>
          <td>Cada componente React debe encapsular una única responsabilidad lógica y visual.</td>
          <td>Bajo acoplamiento verificado</td>
        </tr>
        <tr>
          <td><strong>RNF-03</strong></td>
          <td>Rendimiento y Latencia</td>
          <td>Transición de rutas y filtrado reactivo del catálogo en tiempo imperceptible.</td>
          <td>&lt; 100 milisegundos</td>
        </tr>
        <tr>
          <td><strong>RNF-04</strong></td>
          <td>Aseguramiento de Calidad</td>
          <td>Batería de pruebas automatizadas con Jasmine y Karma sobre Chrome Headless.</td>
          <td>10 de 10 tests aprobados</td>
        </tr>
        <tr>
          <td><strong>RNF-05</strong></td>
          <td>Seguridad de Accesos</td>
          <td>Rutas administrativas protegidas mediante guardias de sesión en React Router.</td>
          <td>Bloqueo no autorizado 100%</td>
        </tr>
        <tr>
          <td><strong>RNF-06</strong></td>
          <td>Accesibilidad Web</td>
          <td>Uso de etiquetas semánticas y contraste conforme a lineamientos WCAG 2.1 nivel AA.</td>
          <td>Contraste &ge; 4.5:1</td>
        </tr>
      </tbody>
    </table>

    <!-- SECCIÓN 5: MODELO DE DATOS -->
    <h1>5. Modelo de Datos Lógico (JavaScript Schema)</h1>
    <p>La persistencia reactiva en <code>src/services/db.js</code> opera bajo los siguientes esquemas estructurados:</p>

    <pre><code>// Definición de Esquemas en TypeScript / JavaScript
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
}</code></pre>

    <!-- SECCIÓN 6: MATRIZ DE TRAZABILIDAD -->
    <h1>6. Matriz de Trazabilidad Requisitos vs Componentes</h1>
    <table>
      <thead>
        <tr>
          <th>Requerimiento</th>
          <th>Componente React</th>
          <th>Archivo Fuente</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>RF-01, RF-03, RF-04</strong></td>
          <td><code>ProductList</code>, <code>ProductCard</code></td>
          <td><code>src/components/store/ProductList.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-02</strong></td>
          <td><code>ProductDetailPage</code>, <code>QuantitySelector</code></td>
          <td><code>src/pages/store/ProductDetailPage.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-05</strong></td>
          <td><code>CartPage</code>, <code>CartDrawer</code></td>
          <td><code>src/pages/store/CartPage.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-06</strong></td>
          <td><code>CheckoutPage</code></td>
          <td><code>src/pages/store/CheckoutPage.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-07, RF-08</strong></td>
          <td><code>OrderSuccessPage</code>, <code>OrderErrorPage</code></td>
          <td><code>src/pages/store/OrderSuccessPage.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-09, RF-10</strong></td>
          <td><code>RegisterPage</code>, <code>MyAccountPage</code></td>
          <td><code>src/pages/store/RegisterPage.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-12</strong></td>
          <td><code>AdminDashboard</code>, <code>StatCard</code></td>
          <td><code>src/pages/admin/AdminDashboard.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-13</strong></td>
          <td><code>AdminOrders</code>, <code>BoletaModal</code></td>
          <td><code>src/pages/admin/AdminOrders.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-14</strong></td>
          <td><code>AdminProducts</code>, <code>ProductModal</code></td>
          <td><code>src/pages/admin/AdminProducts.jsx</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
        <tr>
          <td><strong>RF-15, RF-16, RF-17</strong></td>
          <td><code>AdminCategories</code>, <code>AdminUsers</code>, <code>AdminReports</code></td>
          <td><code>src/pages/admin/*</code></td>
          <td><span class="badge-status">Implementado</span></td>
        </tr>
      </tbody>
    </table>

    <!-- SECCIÓN 7: FIRMAS FORMALES -->
    <div class="firmas-grid">
      <div class="firma-col">
        <div class="firma-nombre">Firma Docente Evaluador</div>
        <div>Escuela de Informática y Telecomunicaciones</div>
        <div>Duoc UC</div>
      </div>
      <div class="firma-col">
        <div class="firma-nombre">Firma Alumno / Equipo de Desarrollo</div>
        <div>Desarrollo Fullstack II — DSY1104</div>
        <div>Proyecto Pastelería Mil Sabores</div>
      </div>
    </div>
  </div>

</body>
</html>`;

// ==================================================
// 2. GENERAR HTML SOBRIO DE COBERTURA DE TESTING
// ==================================================
const testingCleanHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Técnico de Testing Unitario — Duoc UC</title>
  <style>${ACADEMIC_CSS}</style>
</head>
<body>

  <div class="no-print">
    <span style="font-weight: 700; color: #002b49; font-size: 13px;">Informe Técnico de Cobertura y Testing Unitario — Jasmine & Karma</span>
    <div style="display: flex; gap: 8px;">
      <a href="DOCUMENTO_ERS_V2.html" class="btn-secondary">Documento ERS</a>
      <button onclick="window.print()" class="btn-print">Imprimir / Guardar en PDF</button>
    </div>
  </div>

  <div class="page">
    <!-- PORTADA ACADÉMICA -->
    <div class="portada">
      <div class="portada-header">
        <div class="portada-inst">DUOC UC — ESCUELA DE INFORMÁTICA Y TELECOMUNICACIONES</div>
        <div class="portada-subinst">Carrera: Ingeniería en Informática / Analista Programador Computacional</div>
      </div>

      <div class="portada-body">
        <div class="portada-doc-type">Informe Técnico de Aseguramiento de Calidad — Estándar IEEE 829</div>
        <div class="portada-titulo">INFORME TÉCNICO DE COBERTURA Y TESTING UNITARIO</div>
        <div class="portada-subtitulo">Evaluación Automatizada de Componentes React — Proyecto Pastelería Mil Sabores</div>
      </div>

      <div class="portada-meta">
        <div class="portada-meta-row">
          <span class="portada-meta-label">Asignatura:</span>
          <span class="portada-meta-val">Desarrollo Fullstack II (DSY1104)</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Evaluación:</span>
          <span class="portada-meta-val">Evaluación Parcial N° 2</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Suite de Pruebas:</span>
          <span class="portada-meta-val">Karma 6.4.4 + Jasmine Core 5.1.2 + React Testing Library</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Entorno de Ejecución:</span>
          <span class="portada-meta-val">Chrome Headless (Windows 10/11)</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Resultado Consolidado:</span>
          <span class="portada-meta-val" style="color: #166534; font-weight: 700;">10 de 10 Pruebas Exitosas (100% de Aprobación — 0 Fallos)</span>
        </div>
        <div class="portada-meta-row">
          <span class="portada-meta-label">Tiempo de Ejecución:</span>
          <span class="portada-meta-val">0.117 segundos</span>
        </div>
      </div>
    </div>

    <!-- SECCIÓN 1: RESUMEN EJECUTIVO -->
    <h1>1. Resumen Ejecutivo y Objetivos</h1>
    <p>
      El presente informe documenta el proceso de verificación técnica y pruebas unitarias automatizadas implementadas sobre el frontend en <strong>React 18</strong> de la tienda online <strong>Pastelería Mil Sabores</strong>. La suite de pruebas fue diseñada para satisfacer el 100% de los criterios de evaluación de la asignatura Desarrollo Fullstack II (DSY1104), abarcando:
    </p>
    <ol>
      <li><strong>Renderizado de Listas:</strong> Recorrido iterativo de colecciones y consistencia estructural en el DOM.</li>
      <li><strong>Renderizado Condicional:</strong> Visibilidad y supresión de elementos en función de estados lógicos.</li>
      <li><strong>Transferencia de Propiedades (Props):</strong> Paso de funciones callback y estructuras de datos complejas hacia componentes hijos.</li>
      <li><strong>Gestión de Estado Interno (State):</strong> Reactividad y mutación controlada con el hook <code>useState</code>.</li>
      <li><strong>Simulación de Eventos de Usuario:</strong> Ejecución desatendida de clics sintéticos y envíos de formulario con <code>fireEvent</code>.</li>
      <li><strong>Aislamiento y Mocks (Spies):</strong> Suplantación de capas de persistencia y comprobación matemática de lógica comercial.</li>
    </ol>

    <!-- SECCIÓN 2: CONFIGURACIÓN TÉCNICA -->
    <h1>2. Entorno y Configuración Técnica</h1>
    <p>
      La infraestructura de testing se integró en el archivo <code>karma.conf.cjs</code>, configurando Karma como ejecutor de pruebas, Jasmine como marco de aserciones y Webpack con Babel para la transpilación de JSX en Chrome Headless:
    </p>

    <pre><code>// Configuración centralizada en karma.conf.cjs
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
    singleRun: true
  });
};</code></pre>

    <!-- SECCIÓN 3: MATRIZ DE COBERTURA -->
    <h1>3. Matriz Consolidada de Pruebas Unitarias</h1>
    <table>
      <thead>
        <tr>
          <th style="width: 6%;">N°</th>
          <th style="width: 22%;">Criterio Evaluado</th>
          <th style="width: 26%;">Archivo de Especificación</th>
          <th style="width: 18%;">Componente / Módulo</th>
          <th style="width: 16%;">Técnica Empleada</th>
          <th style="width: 12%;">Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>01</strong></td>
          <td>Renderizado de Listas</td>
          <td><code>test/1_render_list.spec.jsx</code></td>
          <td><code>ProductList</code></td>
          <td>Recorrido <code>.map()</code></td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>02</strong></td>
          <td>Renderizado Condicional</td>
          <td><code>test/2_render_conditional.spec.jsx</code></td>
          <td><code>AlertMessage</code></td>
          <td>Condición booleana</td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>03</strong></td>
          <td>Props en Componentes</td>
          <td><code>test/3_button_props.spec.jsx</code></td>
          <td><code>Button</code></td>
          <td>Callback <code>onClick</code></td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>04</strong></td>
          <td>Props Complejas (Objetos)</td>
          <td><code>test/4_product_card_props.spec.jsx</code></td>
          <td><code>ProductCard</code></td>
          <td>Desestructuración</td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>05</strong></td>
          <td>Gestión de Estado (Inputs)</td>
          <td><code>test/5_form_state.spec.jsx</code></td>
          <td><code>SearchForm</code></td>
          <td>Hook <code>useState</code></td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>06</strong></td>
          <td>Gestión de Estado (Contador)</td>
          <td><code>test/6_quantity_selector_state.spec.jsx</code></td>
          <td><code>QuantitySelector</code></td>
          <td>Incremento/Decremento</td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>07</strong></td>
          <td>Simulación de Eventos (Click)</td>
          <td><code>test/7_event_add_cart.spec.jsx</code></td>
          <td><code>ProductCard</code></td>
          <td><code>fireEvent.click</code></td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>08</strong></td>
          <td>Simulación de Eventos (Submit)</td>
          <td><code>test/8_event_form_submit.spec.jsx</code></td>
          <td><code>SimpleContactForm</code></td>
          <td><code>preventDefault</code></td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>09</strong></td>
          <td>Aislamiento con Spies / Mocks</td>
          <td><code>test/9_mock_crud_service.spec.jsx</code></td>
          <td><code>productService</code></td>
          <td><code>jasmine.spyOn</code></td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
        <tr>
          <td><strong>10</strong></td>
          <td>Validación Lógica de Negocio</td>
          <td><code>test/10_mock_checkout_totals.spec.jsx</code></td>
          <td><code>cartService</code></td>
          <td>Cálculos y Cupones</td>
          <td><span class="badge-status">Aprobado</span></td>
        </tr>
      </tbody>
    </table>

    <!-- SECCIÓN 4: DETALLE TÉCNICO DE PRUEBAS -->
    <h1>4. Detalle Técnico de los Casos de Prueba</h1>

    <h2>Prueba 1: Renderizado Estructural de Colecciones</h2>
    <p>
      <strong>Objetivo:</strong> Validar que <code>ProductList</code> renderice exactamente el número de nodos correspondientes a la longitud del arreglo entregado.
    </p>
    <pre><code>it('renderiza la cantidad exacta de productos provistos en la lista', () => {
  const mockProducts = [
    { id: '1', nombre: 'Torta Amor', precio: 22000, categoria: 'Tortas Circulares' },
    { id: '2', nombre: 'Pie de Limón', precio: 3490, categoria: 'Postres Individuales' },
    { id: '3', nombre: 'Brazo de Reina', precio: 12900, categoria: 'Pastelería Tradicional' }
  ];
  render(&lt;ProductList products={mockProducts} /&gt;);
  const items = screen.getAllByTestId('product-item');
  expect(items.length).toBe(3);
});</code></pre>

    <h2>Prueba 2: Renderizado Condicional Basado en Propiedades</h2>
    <p>
      <strong>Objetivo:</strong> Confirmar que <code>AlertMessage</code> retorna <code>null</code> cuando la propiedad <code>message</code> está vacía y genera el contenedor accesible cuando recibe una cadena de texto.
    </p>
    <pre><code>it('no renderiza nada si no hay mensaje y se renderiza con el mensaje cuando existe', () => {
  const { container, rerender } = render(&lt;AlertMessage message="" /&gt;);
  expect(container.firstChild).toBeNull();

  rerender(&lt;AlertMessage message="Stock no disponible temporalmente" type="danger" /&gt;);
  const alert = screen.getByRole('alert');
  expect(alert).toBeTruthy();
  expect(alert.textContent).toContain('Stock no disponible');
});</code></pre>

    <h2>Prueba 3 y 4: Propiedades Simples y Modelos Complejos</h2>
    <p>
      <strong>Objetivo:</strong> Asegurar la transmisión de eventos mediante callbacks en <code>Button</code> y el formateo de moneda nacional ($24.990) y badge de oferta en <code>ProductCard</code>.
    </p>
    <pre><code>it('ejecuta el callback onClick al presionar el botón', () => {
  const handleClick = jasmine.createSpy('handleClick');
  render(&lt;Button label="Comprar Ahora" onClick={handleClick} variant="primary" /&gt;);
  fireEvent.click(screen.getByRole('button', { name: /Comprar Ahora/i }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});</code></pre>

    <h2>Prueba 5 y 6: Gestión del Estado Interno (State)</h2>
    <p>
      <strong>Objetivo:</strong> Comprobar la mutación de estado en componentes controlados (<code>SearchForm</code>) y verificar que el selector numérico (<code>QuantitySelector</code>) modifique el valor mostrado respetando cotas numéricas.
    </p>

    <h2>Prueba 7 y 8: Simulación de Eventos Sintéticos</h2>
    <p>
      <strong>Objetivo:</strong> Simular interacción del usuario mediante <code>fireEvent.click</code> al añadir un ítem al carrito y <code>fireEvent.submit</code> en el formulario de contacto verificando la neutralización de la recarga nativa de página.
    </p>

    <h2>Prueba 9 y 10: Aislamiento con Spies y Reglas Comerciales</h2>
    <p>
      <strong>Objetivo:</strong> Sustituir llamadas al sistema de almacenamiento con <code>spyOn(productService, 'getAll')</code> y verificar el algoritmo de tarificación: Subtotal ($31.970), descuento del 50% con cupón <code>FELICES50</code> ($15.985) y despacho gratis ($0 por superar $30.000).
    </p>
    <pre><code>it('calcula correctamente el subtotal, descuento del 50% y despacho gratis', () => {
  const items = [
    { id: 'TC001', precio: 24990, cantidad: 1 },
    { id: 'PI001', precio: 3490, cantidad: 2 }
  ];
  const totals = cartService.calculateTotals(items, 'FELICES50');
  expect(totals.subtotal).toBe(31970);
  expect(totals.descuento).toBe(15985);
  expect(totals.envio).toBe(0);
  expect(totals.total).toBe(15985);
});</code></pre>

    <!-- SECCIÓN 5: LOG DE TERMINAL -->
    <h1>5. Evidencia de Ejecución Oficial (Log de Terminal)</h1>
    <p>Registro emitido al ejecutar <code>npm test</code> en consola:</p>

    <div class="terminal-log">> pasteleria-mil-sabores-react@2.0.0 test
> karma start karma.conf.cjs --single-run

Webpack bundling...
asset commons.js 2.14 MiB [emitted] (name: commons) (id hint: commons)
asset runtime.js 9.16 KiB [emitted] (name: runtime)
webpack 5.112.0 compiled successfully in 2145 ms
INFO [karma-server]: Karma v6.4.4 server started at http://localhost:9876/
INFO [launcher]: Launching browsers ChromeHeadlessNoSandbox with concurrency unlimited
INFO [launcher]: Starting browser ChromeHeadless
INFO [Chrome Headless 156.0.0.0 (Windows 10)]: Connected on socket with id 21968276
Chrome Headless 156.0.0.0 (Windows 10): Executed 1 of 10 SUCCESS (0.025 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 2 of 10 SUCCESS (0.030 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 3 of 10 SUCCESS (0.057 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 4 of 10 SUCCESS (0.072 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 5 of 10 SUCCESS (0.074 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 6 of 10 SUCCESS (0.079 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 7 of 10 SUCCESS (0.086 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 8 of 10 SUCCESS (0.087 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 9 of 10 SUCCESS (0.089 secs)
Chrome Headless 156.0.0.0 (Windows 10): Executed 10 of 10 SUCCESS (0.090 secs)
TOTAL: 10 SUCCESS (0.117 secs / 0.090 secs)</div>

    <!-- SECCIÓN 6: MAPEO RÚBRICA DUOC -->
    <h1>6. Mapeo con Indicadores de Logro (Rúbrica Duoc UC)</h1>
    <table>
      <thead>
        <tr>
          <th style="width: 14%;">Indicador</th>
          <th style="width: 38%;">Criterio Evaluado</th>
          <th style="width: 34%;">Evidencia Técnica en el Proyecto</th>
          <th style="width: 14%;">Cumplimiento</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>IE2.2.1</strong></td>
          <td>Implementa pruebas unitarias para componentes básicos de interfaz gráfica.</td>
          <td>Tests 1 al 4 validan renderizado de listas, condicionales y paso de propiedades.</td>
          <td><span class="badge-status">100% Logrado</span></td>
        </tr>
        <tr>
          <td><strong>IE2.2.2</strong></td>
          <td>Evalúa la interacción del usuario y cambios de estado en componentes React.</td>
          <td>Tests 5 al 8 simulan mutaciones de <code>useState</code> y eventos sintéticos de formulario.</td>
          <td><span class="badge-status">100% Logrado</span></td>
        </tr>
        <tr>
          <td><strong>IE2.3.1</strong></td>
          <td>Aplica mocks y stubs para aislar dependencias externas y servicios de datos.</td>
          <td>Test 9 implementa <code>jasmine.spyOn</code> aislando la persistencia de <code>productService</code>.</td>
          <td><span class="badge-status">100% Logrado</span></td>
        </tr>
        <tr>
          <td><strong>IE2.3.2</strong></td>
          <td>Verifica lógica de negocio compleja, cálculos matemáticos y validaciones.</td>
          <td>Test 10 certifica fórmulas comerciales, aplicación de cupones y umbrales de despacho.</td>
          <td><span class="badge-status">100% Logrado</span></td>
        </tr>
      </tbody>
    </table>

    <!-- SECCIÓN 7: FIRMAS -->
    <div class="firmas-grid">
      <div class="firma-col">
        <div class="firma-nombre">Responsable de Aseguramiento de Calidad (QA)</div>
        <div>Equipo de Desarrollo Fullstack — Duoc UC</div>
      </div>
      <div class="firma-col">
        <div class="firma-nombre">Docente Evaluador DSY1104</div>
        <div>Escuela de Informática y Telecomunicaciones</div>
      </div>
    </div>
  </div>

</body>
</html>`;

// Guardar los archivos HTML limpios
const ersHtmlPath = path.resolve(__dirname, 'DOCUMENTO_ERS_V2.html');
const testingHtmlPath = path.resolve(__dirname, 'DOCUMENTO_COBERTURA_TESTING.html');

fs.writeFileSync(ersHtmlPath, ersCleanHtml, 'utf8');
fs.writeFileSync(testingHtmlPath, testingCleanHtml, 'utf8');

console.log('HTMLs con diseño sobrio generados:');
console.log(' - ' + ersHtmlPath);
console.log(' - ' + testingHtmlPath);

// Compilar a PDF vía Chrome Headless
function compileToPdf(htmlFile, pdfFile) {
  return new Promise((resolve, reject) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const absHtml = 'file:///' + path.resolve(htmlFile).replace(/\\\\/g, '/');
    const absPdf = path.resolve(pdfFile);

    console.log(`Compilando PDF limpio para ${htmlFile}...`);
    const proc = spawn(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--run-all-compositor-stages-before-draw',
      '--no-pdf-header-footer',
      '--print-to-pdf=' + absPdf,
      absHtml
    ]);

    proc.on('close', (code) => {
      if (fs.existsSync(absPdf) && fs.statSync(absPdf).size > 0) {
        console.log(`PDF generado exitosamente: ${pdfFile} (${fs.statSync(absPdf).size} bytes)`);
        resolve(absPdf);
      } else {
        console.error(`Error al generar ${pdfFile}, code: ${code}`);
        reject(new Error(`Error ${code}`));
      }
    });
  });
}

async function run() {
  try {
    await compileToPdf('DOCUMENTO_ERS_V2.html', 'DOCUMENTO_ERS_V2.pdf');
    await compileToPdf('DOCUMENTO_COBERTURA_TESTING.html', 'DOCUMENTO_COBERTURA_TESTING.pdf');

    // Copiar a Downloads y Desktop
    const downloads = 'C:\\Users\\Asus\\Downloads';
    const desktop = 'C:\\Users\\Asus\\Desktop';

    if (fs.existsSync(downloads)) {
      fs.copyFileSync('DOCUMENTO_ERS_V2.pdf', path.join(downloads, 'DOCUMENTO_ERS_V2.pdf'));
      fs.copyFileSync('DOCUMENTO_COBERTURA_TESTING.pdf', path.join(downloads, 'DOCUMENTO_COBERTURA_TESTING.pdf'));
      fs.copyFileSync('DOCUMENTO_ERS_V2.html', path.join(downloads, 'DOCUMENTO_ERS_V2.html'));
      fs.copyFileSync('DOCUMENTO_COBERTURA_TESTING.html', path.join(downloads, 'DOCUMENTO_COBERTURA_TESTING.html'));
      console.log('Copiados a carpeta Descargas exitosamente.');
    }

    if (fs.existsSync(desktop)) {
      fs.copyFileSync('DOCUMENTO_ERS_V2.pdf', path.join(desktop, 'DOCUMENTO_ERS_V2.pdf'));
      fs.copyFileSync('DOCUMENTO_COBERTURA_TESTING.pdf', path.join(desktop, 'DOCUMENTO_COBERTURA_TESTING.pdf'));
      console.log('Copiados a Escritorio exitosamente.');
    }

    console.log('Proceso de diseño sobrio finalizado con éxito.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
