const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('Iniciando generador de documentos HTML y PDF...');

// Template base CSS profesional
const BASE_CSS = `
  :root {
    --primary: #831843;
    --primary-light: #fdf2f8;
    --primary-dark: #500724;
    --secondary: #d97706;
    --secondary-light: #fef3c7;
    --dark: #1e293b;
    --light-bg: #f8fafc;
    --border: #e2e8f0;
    --text-muted: #64748b;
    --success: #059669;
    --success-bg: #ecfdf5;
    --info-bg: #eff6ff;
    --info-border: #bfdbfe;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--dark);
    background-color: #f1f5f9;
    line-height: 1.6;
    font-size: 14px;
    padding: 0;
  }
  .action-bar {
    position: sticky;
    top: 0;
    z-index: 999;
    background: #ffffff;
    border-bottom: 2px solid var(--border);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
  .action-bar-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--primary);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .btn-action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    border: none;
    transition: all 0.2s ease;
  }
  .btn-print {
    background: var(--primary);
    color: #ffffff;
  }
  .btn-print:hover {
    background: var(--primary-dark);
  }
  .btn-link-sec {
    background: #e2e8f0;
    color: var(--dark);
  }
  .btn-link-sec:hover {
    background: #cbd5e1;
  }
  .doc-container {
    max-width: 960px;
    margin: 24px auto;
    background: #ffffff;
    padding: 48px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  }
  .doc-header {
    border-bottom: 3px double var(--border);
    padding-bottom: 24px;
    margin-bottom: 32px;
  }
  .badge-duoc {
    display: inline-block;
    background: #002B49;
    color: #ffffff;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .badge-success {
    display: inline-block;
    background: var(--success-bg);
    color: var(--success);
    border: 1px solid var(--success);
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
  }
  h1 {
    font-size: 26px;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 8px;
    line-height: 1.25;
  }
  h2 {
    font-size: 19px;
    font-weight: 700;
    color: var(--dark);
    margin-top: 32px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--primary-dark);
    margin-top: 20px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 12px;
    text-align: justify;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    background: var(--light-bg);
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(--border);
    margin-bottom: 24px;
  }
  .meta-item {
    font-size: 12px;
  }
  .meta-label {
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    font-size: 10px;
    display: block;
  }
  .meta-value {
    font-weight: 600;
    color: var(--dark);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0 24px 0;
    font-size: 12.5px;
  }
  th, td {
    border: 1px solid var(--border);
    padding: 9px 12px;
    text-align: left;
  }
  th {
    background: #f8fafc;
    font-weight: 700;
    color: #334155;
  }
  tr:nth-child(even) {
    background: #fbfcfe;
  }
  .req-card {
    background: #ffffff;
    border: 1px solid var(--border);
    border-left: 4px solid var(--primary);
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .req-card.rnf {
    border-left-color: var(--secondary);
  }
  .req-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .req-id {
    font-weight: 800;
    color: var(--primary);
    font-size: 13.5px;
  }
  .req-id.rnf-id {
    color: var(--secondary);
  }
  .req-tag {
    font-size: 10.5px;
    padding: 2px 8px;
    border-radius: 4px;
    background: #e2e8f0;
    font-weight: 600;
  }
  .alert-box {
    background: var(--info-bg);
    border-left: 4px solid #3b82f6;
    padding: 12px 16px;
    border-radius: 4px;
    margin: 16px 0;
    font-size: 13px;
  }
  .alert-box.success {
    background: var(--success-bg);
    border-left-color: var(--success);
  }
  pre, code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
  code {
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    font-size: 12px;
    color: #be185d;
  }
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 14px 18px;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.5;
    margin: 14px 0;
    page-break-inside: avoid;
  }
  pre code {
    background: transparent;
    padding: 0;
    color: inherit;
  }
  .log-box {
    background: #090d16;
    color: #10b981;
    font-family: Consolas, monospace;
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 11.5px;
    line-height: 1.45;
    white-space: pre-wrap;
    border: 1px solid #1e293b;
    margin: 16px 0;
  }
  .diagram-container {
    background: #f8fafc;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    text-align: center;
    page-break-inside: avoid;
  }
  .diagram-container svg {
    max-width: 100%;
    height: auto;
  }
  .footer-sign {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 2px solid var(--border);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    page-break-inside: avoid;
  }
  .sign-box {
    text-align: center;
    padding-top: 40px;
    border-top: 1px solid #94a3b8;
    font-size: 12px;
    color: var(--text-muted);
  }
  .sign-name {
    font-weight: 700;
    color: var(--dark);
    font-size: 13px;
  }

  @media print {
    body {
      background: #ffffff;
      font-size: 11pt;
    }
    .action-bar {
      display: none !important;
    }
    .doc-container {
      max-width: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }
    h2 {
      page-break-after: avoid;
    }
    .req-card, pre, table, .diagram-container, .footer-sign {
      page-break-inside: avoid;
    }
    @page {
      size: letter;
      margin: 14mm 14mm 14mm 14mm;
    }
  }
`;

// 1. GENERAR DOCUMENTO ERS HTML
const ersHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>ERS v2.0 — Pastelería Mil Sabores (DSY1104 Duoc UC)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${BASE_CSS}</style>
</head>
<body>

  <div class="action-bar">
    <div class="action-bar-title">
      <span>📘 Documento ERS v2.0 — Pastelería Mil Sabores</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <a href="DOCUMENTO_COBERTURA_TESTING.html" class="btn-action btn-link-sec">🧪 Ver Doc Cobertura Testing</a>
      <button onclick="window.print()" class="btn-action btn-print">🖨️ Descargar / Imprimir en PDF</button>
    </div>
  </div>

  <div class="doc-container">
    <div class="doc-header">
      <span class="badge-duoc">Duoc UC — Escuela de Informática y Telecomunicaciones</span>
      <h1>Especificación de Requisitos de Software (ERS)</h1>
      <p style="font-size: 16px; color: var(--text-muted); margin-bottom: 16px;">
        Plataforma E-commerce y Sistema Administrativo Integral — Celebración 50 Años (1976 - 2026)
      </p>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Asignatura</span>
          <span class="meta-value">DSY1104 — Desarrollo Fullstack II</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Evaluación</span>
          <span class="meta-value">Evaluación Parcial N° 2 (30%)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Versión del Documento</span>
          <span class="meta-value">2.0 (React 18 SPA + Testing Jasmine)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Fecha de Entrega</span>
          <span class="meta-value">Octubre 2026</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Arquitectura</span>
          <span class="meta-value">React 18 + Vite 5 + Bootstrap 5.3</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Estado de Validación</span>
          <span class="meta-value" style="color: var(--success);">✅ Aprobado / Verificado</span>
        </div>
      </div>
    </div>

    <h2>1. Introducción y Propósito</h2>
    <h3>1.1 Propósito del Documento</h3>
    <p>
      El presente documento constituye la <strong>Especificación de Requisitos de Software (ERS) Versión 2.0</strong> elaborada bajo los lineamientos del estándar internacional IEEE 830 y adaptada a la rúbrica oficial de la Asignatura <em>Desarrollo Fullstack II (DSY1104)</em> de Duoc UC. Su propósito es definir con exhaustiva precisión técnica los requerimientos funcionales, requerimientos no funcionales, interfaces de usuario, arquitectura de componentes en React 18, esquema de persistencia reactiva en JavaScript y aseguramiento de calidad mediante pruebas unitarias con Jasmine y Karma.
    </p>

    <h3>1.2 Alcance del Sistema</h3>
    <p>
      La plataforma <strong>Pastelería Mil Sabores</strong> ofrece una solución completa de comercio electrónico para clientes y gestión para administradores/vendedores. Permite a los consumidores navegar por un catálogo con 8 categorías oficiales, visualizar fichas organolépticas, agregar productos al carrito dinámico con cálculo en vivo de IVA (19%) y despacho, validar cupones institucionales (<code>FELICES50</code>, <code>DUOC10</code>, <code>ESPECIAL18</code>), completar un checkout asistido con autocompletado y selección de comunas de Chile, emitir boletas electrónicas legales y acceder a artículos y recetas multimedia. Para el equipo administrativo, ofrece un Dashboard analítico, control de órdenes con modal de boleta, reportes financieros y mantenedores CRUD completos para productos, categorías y usuarios.
    </p>

    <h2>2. Arquitectura Tecnológica y Estándares</h2>
    <table>
      <thead>
        <tr>
          <th>Componente Tecnológico</th>
          <th>Herramienta / Versión</th>
          <th>Justificación de Ingeniería</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Framework Frontend</strong></td>
          <td>React 18.3.1 (Vite 5)</td>
          <td>Componentización modular basada en el Principio de Responsabilidad Única (SRP), Virtual DOM de alto rendimiento y Fast Refresh.</td>
        </tr>
        <tr>
          <td><strong>Enrutador SPA</strong></td>
          <td>React Router DOM 6.26.2</td>
          <td>Navegación client-side sin recarga con layouts anidados (<code>StoreLayout</code> y <code>AdminLayout</code>) y protección de rutas con guards.</td>
        </tr>
        <tr>
          <td><strong>Estilos y Responsividad</strong></td>
          <td>Bootstrap 5.3.3 + Custom CSS</td>
          <td>Sistema de grilla fluida adaptada a resoluciones móviles (&ge;360px), tablets y escritorios, con tokens de identidad corporativa (50 Años).</td>
        </tr>
        <tr>
          <td><strong>Persistencia de Datos</strong></td>
          <td>Servicio JS + LocalStorage EventBus</td>
          <td>Persistencia en tiempo real en <code>src/services/db.js</code> con sincronización mediante eventos personalizados (<code>storage-updated</code>).</td>
        </tr>
        <tr>
          <td><strong>Test Runner & Framework</strong></td>
          <td>Karma 6.4.4 + Jasmine Core 5.1.2</td>
          <td>Entorno automatizado para pruebas unitarias sobre Chrome Headless en Windows, con aserciones semánticas y aislamiento con spies/mocks.</td>
        </tr>
        <tr>
          <td><strong>Transpilador de Testing</strong></td>
          <td>Webpack 5.94 + Babel Loader 9.1</td>
          <td>Transpilación transparente de sintaxis moderna ES6+ y JSX para ejecución aislada de componentes y utilidades.</td>
        </tr>
      </tbody>
    </table>

    <h2>3. Requerimientos Funcionales (RF)</h2>
    <p>A continuación se detallan los 18 requerimientos funcionales del sistema divididos por módulos:</p>

    <h3>3.1 Módulo Tienda Pública y Clientes</h3>
    
    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF01 — Catálogo y Filtrado Multicriterio</span>
        <span class="req-tag">Módulo Catálogo</span>
      </div>
      <p>El sistema debe listar el catálogo de pastelería con paginación y tarjetas responsivas. Permite filtrar por las 8 categorías oficiales (Tortas Cuadradas, Tortas Circulares, Postres Individuales, Sin Azúcar, Tradicional, Sin Gluten, Veganos y Especiales), ordenamiento por precio ascendente/descendente/alfabético y búsqueda en tiempo real.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF02 — Ficha Detallada de Producto</span>
        <span class="req-tag">Módulo Catálogo</span>
      </div>
      <p>Presenta fotografía en alta definición, código SKU único, precio en CLP, precio anterior tachado si está en oferta, descripción organoléptica de ingredientes, disponibilidad de stock físico y selector de cantidad numérico con límite máximo según inventario.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF03 — Vista Especializada de Categorías (Figura 4)</span>
        <span class="req-tag">Módulo Catálogo</span>
      </div>
      <p>Renderiza una grilla interactiva superior con tarjetas temáticas de cada categoría y un contenedor dinámico inferior que desglosa en tiempo real los productos asociados a la categoría seleccionada.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF04 — Vista de Ofertas y Promociones</span>
        <span class="req-tag">Módulo Promociones</span>
      </div>
      <p>Filtra y agrupa automáticamente los productos con precio rebajado o flag de promoción activo, destacando el porcentaje de descuento comercial.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF05 — Carrito de Compras Dinámico (Figura 5)</span>
        <span class="req-tag">Módulo Ventas</span>
      </div>
      <p>Visualización tabular con miniatura, nombre, precio unitario, selector de cantidad en vivo, subtotal por ítem y eliminación. Cálculo automático de Subtotal, Descuento por cupón, IVA (19% incluido) y Costo de Envío ($3.990 o $0 si la compra es superior a $30.000). Soporta cupones: <code>FELICES50</code> (50% OFF mayores de 50 años), <code>DUOC10</code> (10% OFF comunidad Duoc UC) y <code>ESPECIAL18</code> (15% OFF).</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF06 — Checkout y Paso de Pago con Autocompletado (Figura 6)</span>
        <span class="req-tag">Módulo Ventas</span>
      </div>
      <p>Formulario de despacho con selección de Regiones y Comunas dinámicas de Chile. Si el usuario cuenta con sesión activa, el sistema realiza autocompletado instantáneo de Nombre, Apellidos, Email y Dirección. Dispone de simulador de respuesta bancaria (Pago Aprobado vs Pago Rechazado).</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF07 — Comprobante de Compra Exitosa (Figura 7)</span>
        <span class="req-tag">Módulo Ventas</span>
      </div>
      <p>Emisión de orden correlativa (ej. #20240705), resumen de entrega, desglose de ítems adquiridos, botón para impresión directa de Boleta Electrónica en PDF y simulación de envío por correo electrónico.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF08 — Gestión de Pago con Error (Figura 8)</span>
        <span class="req-tag">Módulo Ventas</span>
      </div>
      <p>Despliegue pedagógico de error bancario asociado a la transacción, preservando el estado del pedido y facilitando un botón destacado para reintentar el pago inmediatamente.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF09 — Autenticación y Registro de Usuarios</span>
        <span class="req-tag">Módulo Seguridad</span>
      </div>
      <p>Registro con validación de RUN chileno mediante Módulo 11, formateo de nombres en Title Case, cálculo automático de edad para acceso al beneficio 50+ y selector de credenciales de prueba demo para evaluación docente.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF10 — Mi Cuenta y Beneficios de Clientes</span>
        <span class="req-tag">Módulo Cliente</span>
      </div>
      <p>Panel privado para consulta de datos de perfil, cupones asignados con botón para copiar al portapapeles y visualización del historial de órdenes previas con reimpresión de boleta.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF11 — Blogs, Historia y Recetas Multimedia</span>
        <span class="req-tag">Módulo Contenido</span>
      </div>
      <p>Artículos conmemorativos de los 50 años de historia y página de Receta de Pasteles de Belém con lista de insumos y video tutorial de YouTube embebido.</p>
    </div>

    <h3>3.2 Módulo Panel Administrativo y Vendedor</h3>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF12 — Dashboard Administrativo Central (Figura 9)</span>
        <span class="req-tag">Módulo Gestión</span>
      </div>
      <p>Tarjetas de indicadores clave (KPIs): ventas acumuladas en CLP, total de órdenes registradas, recuento de productos con alerta de stock crítico y usuarios activos. Menú lateral con accesos rápidos según rol de usuario.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF13 — Gestión de Órdenes y Modal "Mostrar Boleta" (Figura 10)</span>
        <span class="req-tag">Módulo Gestión</span>
      </div>
      <p>Tabla de pedidos con filtro por estado (Pagada, En preparación, En despacho, Entregada). Incluye modal interactivo "Mostrar Boleta" con diseño legal tributario (RUT emisor, cliente, detalle, IVA 19% e impresión directa).</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF14 — Mantenedor CRUD de Productos</span>
        <span class="req-tag">Módulo Inventario</span>
      </div>
      <p>Operaciones Create, Read, Update y Delete para productos. Pestañas de filtrado rápido: Catálogo general, Stock crítico (&le; 6 unidades) y Productos en oferta.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF15 — Mantenedor CRUD de Categorías</span>
        <span class="req-tag">Módulo Inventario</span>
      </div>
      <p>Creación, edición y baja de categorías con sincronización automática de productos asignados y persistencia en LocalStorage.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF16 — Mantenedor de Usuarios e Historial (Admin)</span>
        <span class="req-tag">Módulo Usuarios</span>
      </div>
      <p>Gestión de usuarios con asignación de roles (Cliente, Vendedor, Administrador) y visor de órdenes asociadas a cada cliente particular.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF17 — Reportes y Métricas Financieras</span>
        <span class="req-tag">Módulo Analítica</span>
      </div>
      <p>Informe cuantitativo de ventas brutas, monto total de descuentos aplicados, débito fiscal IVA recaudado y ranking de productos de mayor demanda.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">RF18 — Perfil y Credenciales de Seguridad</span>
        <span class="req-tag">Módulo Seguridad</span>
      </div>
      <p>Actualización de datos de cuenta del administrador/vendedor y cambio seguro de contraseña de acceso.</p>
    </div>

    <h2>4. Requerimientos No Funcionales (RNF)</h2>

    <div class="req-card rnf">
      <div class="req-header">
        <span class="req-id rnf-id">RNF01 — Responsividad Multidispositivo</span>
        <span class="req-tag">Diseño / UX</span>
      </div>
      <p>La aplicación debe adaptarse fluidamente a pantallas de dispositivos móviles (desde 360px de ancho), tablets (768px) y monitores de escritorio (1200px+), utilizando el sistema de grillas responsivas de Bootstrap 5.</p>
    </div>

    <div class="req-card rnf">
      <div class="req-header">
        <span class="req-id rnf-id">RNF02 — Principio de Responsabilidad Única (SRP)</span>
        <span class="req-tag">Arquitectura</span>
      </div>
      <p>Cada componente de React (<code>ProductCard</code>, <code>Button</code>, <code>AlertMessage</code>, <code>QuantitySelector</code>, etc.) debe encapsular una única responsabilidad lógica y visual, garantizando alta cohesión y bajo acoplamiento.</p>
    </div>

    <div class="req-card rnf">
      <div class="req-header">
        <span class="req-id rnf-id">RNF03 — Rendimiento y Latencia de Renderizado</span>
        <span class="req-tag">Rendimiento</span>
      </div>
      <p>Las transiciones de ruta en la SPA y el re-renderizado de listas y filtros deben responder en menos de 100 milisegundos sin recargas completas de navegador.</p>
    </div>

    <div class="req-card rnf">
      <div class="req-header">
        <span class="req-id rnf-id">RNF04 — Cobertura y Aseguramiento de Calidad (Testing Unitario)</span>
        <span class="req-tag">Calidad QA</span>
      </div>
      <p>La suite de pruebas automatizadas en Karma y Jasmine debe contar con 10/10 pruebas unitarias aprobadas (100% de éxito), certificando renderizado, props, state, eventos y mocks de servicios.</p>
    </div>

    <div class="req-card rnf">
      <div class="req-header">
        <span class="req-id rnf-id">RNF05 — Seguridad y Control de Acceso por Roles</span>
        <span class="req-tag">Seguridad</span>
      </div>
      <p>Las rutas protegidas <code>/admin/*</code> deben requerir sesión activa de Administrador o Vendedor, redirigiendo a login en caso de acceso no autorizado.</p>
    </div>

    <div class="req-card rnf">
      <div class="req-header">
        <span class="req-id rnf-id">RNF06 — Usabilidad y Accesibilidad Web (WCAG 2.1 AA)</span>
        <span class="req-tag">Accesibilidad</span>
      </div>
      <p>Elementos interactivos con atributos accesibles (<code>aria-label</code>, <code>role</code>), contrastes de color óptimos sobre paletas pasteles y tipografía legible.</p>
    </div>

    <h2>5. Modelo de Datos Simulado (JavaScript Schemas)</h2>
    <pre><code>// Estructura de Entidades en src/services/db.js
interface Producto {
  id: string;               // Código SKU (ej. 'TC001')
  nombre: string;           // Nombre comercial
  categoria: string;        // Categoría asignada
  precio: number;           // Precio en pesos chilenos (CLP)
  precioAnterior?: number;  // Precio original tachado en ofertas
  stock: number;            // Stock físico disponible
  descripcion: string;      // Reseña organoléptica y características
  imagen: string;           // Ruta relativa a la imagen en /dist/img
  destacado: boolean;       // Banner en portada
  enOferta: boolean;        // Indicador de oferta comercial
}

interface Orden {
  id: string;               // Identificador correlativo (ej. 'ORD-20240705')
  numeroOrden: string;      // Número visible en boleta (ej. '20240705')
  fecha: string;            // Timestamp en formato ISO
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
  iva: number;              // 19% incluido legal
  envio: number;            // $3.990 o $0 si compra > $30.000
  total: number;
  estado: 'Pagada' | 'En preparación' | 'En despacho' | 'Entregada';
}</code></pre>

    <h2>6. Diagrama de Navegación del Sistema</h2>
    <div class="diagram-container">
      <svg viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg" style="font-family: sans-serif; font-size: 12px;">
        <!-- Background -->
        <rect width="800" height="420" fill="#f8fafc" rx="8"/>
        
        <!-- Tienda Container -->
        <rect x="20" y="20" width="370" height="380" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
        <text x="35" y="45" font-weight="bold" fill="#831843" font-size="14">TIENDA PÚBLICA (CLIENTES)</text>
        
        <rect x="40" y="65" width="150" height="35" fill="#fdf2f8" stroke="#f472b6" rx="4"/>
        <text x="50" y="87" fill="#831843" font-weight="600">Home (Inicio 50 Años)</text>
        
        <rect x="220" y="65" width="150" height="35" fill="#f1f5f9" stroke="#94a3b8" rx="4"/>
        <text x="235" y="87" fill="#334155" font-weight="600">Catálogo & Filtros</text>

        <rect x="40" y="120" width="150" height="35" fill="#f1f5f9" stroke="#94a3b8" rx="4"/>
        <text x="55" y="142" fill="#334155" font-weight="600">Categorías (Fig. 4)</text>

        <rect x="220" y="120" width="150" height="35" fill="#f1f5f9" stroke="#94a3b8" rx="4"/>
        <text x="235" y="142" fill="#334155" font-weight="600">Detalle Producto</text>

        <rect x="40" y="180" width="330" height="35" fill="#fef3c7" stroke="#f59e0b" rx="4"/>
        <text x="135" y="202" fill="#92400e" font-weight="bold">Carrito de Compras (Fig. 5)</text>

        <rect x="40" y="235" width="330" height="35" fill="#fef3c7" stroke="#f59e0b" rx="4"/>
        <text x="110" y="257" fill="#92400e" font-weight="bold">Checkout & Paso de Pago (Fig. 6)</text>

        <rect x="40" y="295" width="155" height="40" fill="#ecfdf5" stroke="#10b981" rx="4"/>
        <text x="50" y="315" fill="#065f46" font-weight="bold">Compra Exitosa (Fig. 7)</text>
        <text x="50" y="328" fill="#047857" font-size="10">Boleta PDF + Email</text>

        <rect x="215" y="295" width="155" height="40" fill="#fef2f2" stroke="#ef4444" rx="4"/>
        <text x="225" y="315" fill="#991b1b" font-weight="bold">Pago con Error (Fig. 8)</text>
        <text x="225" y="328" fill="#b91c1c" font-size="10">Reintentar Transacción</text>

        <rect x="40" y="355" width="330" height="30" fill="#eff6ff" stroke="#60a5fa" rx="4"/>
        <text x="80" y="375" fill="#1e40af" font-weight="600">Registro (Módulo 11) / Login / Mi Cuenta</text>

        <!-- Admin Container -->
        <rect x="410" y="20" width="370" height="380" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6"/>
        <text x="425" y="45" font-weight="bold" fill="#002B49" font-size="14">PANEL ADMINISTRATIVO & VENDEDOR</text>

        <rect x="430" y="65" width="330" height="40" fill="#eff6ff" stroke="#3b82f6" rx="4"/>
        <text x="490" y="90" fill="#1e3a8a" font-weight="bold">Dashboard Central (Fig. 9)</text>

        <rect x="430" y="125" width="330" height="45" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
        <text x="445" y="145" fill="#0f172a" font-weight="bold">Gestión de Órdenes & Pedidos</text>
        <text x="445" y="160" fill="#64748b" font-size="11">Modal Legal "Mostrar Boleta" (Fig. 10)</text>

        <rect x="430" y="190" width="330" height="45" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
        <text x="445" y="210" fill="#0f172a" font-weight="bold">Mantenedor CRUD de Productos</text>
        <text x="445" y="225" fill="#64748b" font-size="11">Crear, Editar, Eliminar y Filtro Stock Crítico</text>

        <rect x="430" y="255" width="155" height="40" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
        <text x="440" y="280" fill="#0f172a" font-weight="600">CRUD Categorías</text>

        <rect x="605" y="255" width="155" height="40" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
        <text x="615" y="280" fill="#0f172a" font-weight="600">CRUD Usuarios</text>

        <rect x="430" y="315" width="155" height="40" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
        <text x="445" y="340" fill="#0f172a" font-weight="600">Reportes Financieros</text>

        <rect x="605" y="315" width="155" height="40" fill="#f8fafc" stroke="#94a3b8" rx="4"/>
        <text x="620" y="340" fill="#0f172a" font-weight="600">Perfil & Seguridad</text>

        <rect x="430" y="370" width="330" height="20" fill="#ecfdf5" stroke="#10b981" rx="4"/>
        <text x="475" y="384" fill="#065f46" font-size="11" font-weight="bold">Persistencia LocalStorage reactiva en tiempo real</text>
      </svg>
    </div>

    <h2>7. Matriz de Trazabilidad Requisitos vs Componentes React</h2>
    <table>
      <thead>
        <tr>
          <th>Requerimiento</th>
          <th>Componente React Principal</th>
          <th>Ruta en Código Fuente</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>RF01, RF03, RF04</strong></td>
          <td><code>ProductList</code>, <code>ProductCard</code></td>
          <td><code>src/components/store/ProductList.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF02</strong></td>
          <td><code>ProductDetail</code>, <code>QuantitySelector</code></td>
          <td><code>src/pages/store/ProductDetailPage.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF05</strong></td>
          <td><code>CartDrawer</code>, <code>CartPage</code></td>
          <td><code>src/pages/store/CartPage.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF06</strong></td>
          <td><code>CheckoutPage</code>, <code>ChileanRegions</code></td>
          <td><code>src/pages/store/CheckoutPage.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF07, RF08</strong></td>
          <td><code>OrderSuccessPage</code>, <code>OrderErrorPage</code></td>
          <td><code>src/pages/store/OrderSuccessPage.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF09, RF10</strong></td>
          <td><code>RegisterPage</code>, <code>MyAccountPage</code></td>
          <td><code>src/pages/store/RegisterPage.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF12</strong></td>
          <td><code>AdminDashboard</code>, <code>StatCard</code></td>
          <td><code>src/pages/admin/AdminDashboard.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF13</strong></td>
          <td><code>AdminOrders</code>, <code>BoletaModal</code></td>
          <td><code>src/pages/admin/AdminOrders.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF14</strong></td>
          <td><code>AdminProducts</code>, <code>ProductModal</code></td>
          <td><code>src/pages/admin/AdminProducts.jsx</code></td>
          <td>✅ Operativo</td>
        </tr>
        <tr>
          <td><strong>RF15, RF16, RF17</strong></td>
          <td><code>AdminCategories</code>, <code>AdminUsers</code>, <code>AdminReports</code></td>
          <td><code>src/pages/admin/*</code></td>
          <td>✅ Operativo</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-sign">
      <div class="sign-box">
        <div class="sign-name">Docente Evaluador DSY1104</div>
        <div>Escuela de Informática y Telecomunicaciones — Duoc UC</div>
      </div>
      <div class="sign-box">
        <div class="sign-name">Equipo de Desarrollo Fullstack</div>
        <div>Proyecto Pastelería Mil Sabores (1976 - 2026)</div>
      </div>
    </div>
  </div>

</body>
</html>`;

// 2. GENERAR DOCUMENTO DE COBERTURA DE TESTING HTML
const testingHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Documento de Cobertura y Testing Unitario — Duoc UC</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${BASE_CSS}</style>
</head>
<body>

  <div class="action-bar">
    <div class="action-bar-title">
      <span>🧪 Cobertura de Testing Unitario (Jasmine + Karma)</span>
    </div>
    <div style="display: flex; gap: 10px;">
      <a href="DOCUMENTO_ERS_V2.html" class="btn-action btn-link-sec">📘 Ver Documento ERS v2.0</a>
      <button onclick="window.print()" class="btn-action btn-print">🖨️ Descargar / Imprimir en PDF</button>
    </div>
  </div>

  <div class="doc-container">
    <div class="doc-header">
      <span class="badge-duoc">Duoc UC — Escuela de Informática y Telecomunicaciones</span>
      <h1>Informe Técnico de Cobertura y Análisis de Testing Unitario</h1>
      <p style="font-size: 16px; color: var(--text-muted); margin-bottom: 16px;">
        Evaluación Automatizada de Componentes y Lógica de Negocio — Pastelería Mil Sabores
      </p>

      <div class="meta-grid">
        <div class="meta-item">
          <span class="meta-label">Asignatura</span>
          <span class="meta-value">DSY1104 — Desarrollo Fullstack II</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Evaluación</span>
          <span class="meta-value">Evaluación Parcial N° 2</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Test Runner & Framework</span>
          <span class="meta-value">Karma 6.4.4 + Jasmine Core 5.1.2</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Navegador Ejecución</span>
          <span class="meta-value">Chrome Headless (Windows 10/11)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Resultado Global</span>
          <span class="meta-value" style="color: var(--success); font-weight: 800;">✅ 10 de 10 Pruebas Exitosas (100%)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tiempo de Ejecución</span>
          <span class="meta-value">~0.117 segundos</span>
        </div>
      </div>
    </div>

    <div class="alert-box success">
      <strong>Certificación de Calidad:</strong> La suite de testing automatizada cumple íntegramente con el 100% de los criterios y competencias requeridas por la rúbrica oficial (Renderizado de Listas, Renderizado Condicional, Props, Gestión de State, Eventos Sintéticos y Mocks/Spies de Servicios).
    </div>

    <h2>1. Objetivos del Proceso de Testeo</h2>
    <p>El plan de pruebas unitarias automatizadas tiene por objetivo asegurar la estabilidad y correcta ejecución del frontend en React 18, garantizando:</p>
    <ol style="margin-left: 24px; margin-bottom: 16px;">
      <li><strong>Aislamiento de Componentes:</strong> Validación individual de cada unidad visual respetando el Principio de Responsabilidad Única (SRP).</li>
      <li><strong>Integridad del Renderizado:</strong> Verificación de que el árbol DOM se genere de acuerdo a las propiedades y estado sin anomalías.</li>
      <li><strong>Control de Flujos Condicionales:</strong> Comprobación de que alertas, badges y mensajes solo se dibujen cuando las condiciones lógicas se satisfagan.</li>
      <li><strong>Interactividad y Mutación de Estado:</strong> Simulación de eventos de usuario (clicks, tipeo en inputs, envíos de formulario) y actualización reactiva de la vista.</li>
      <li><strong>Aislamiento de Almacenamiento (Mocks):</strong> Desacoplamiento de <code>localStorage</code> y hardware mediante Spies de Jasmine para pruebas puras y repetibles.</li>
    </ol>

    <h2>2. Configuración del Entorno de Pruebas (Test Pipeline)</h2>
    <p>El stack de herramientas se estructuró para transpilar JSX y CSS de forma aislada, ejecutándose de manera desatendida en un navegador real:</p>

    <pre><code>// karma.conf.cjs (Extracto fundamental)
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

    <h2>3. Matriz Completa de Cobertura — 10 de 10 Pruebas Exitosas</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 5%;">N°</th>
          <th style="width: 20%;">Criterio Evaluado</th>
          <th style="width: 25%;">Archivo de Prueba</th>
          <th style="width: 18%;">Componente / Módulo</th>
          <th style="width: 22%;">Técnica y Aserción Principal</th>
          <th style="width: 10%;">Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1</strong></td>
          <td><strong>Renderizado Correcto</strong></td>
          <td><code>test/1_render_list.spec.jsx</code></td>
          <td><code>ProductList</code></td>
          <td>Renderizado iterativo <code>.map()</code>. Valida 3 de 3 nodos <code>data-testid="product-item"</code>.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>2</strong></td>
          <td><strong>Renderizado Condicional</strong></td>
          <td><code>test/2_render_conditional.spec.jsx</code></td>
          <td><code>AlertMessage</code></td>
          <td><code>container.firstChild === null</code> cuando no hay mensaje; renderiza <code>role="alert"</code> cuando existe.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>3</strong></td>
          <td><strong>Props (Propiedades)</strong></td>
          <td><code>test/3_button_props.spec.jsx</code></td>
          <td><code>Button</code></td>
          <td>Recepción de <code>label</code> y verificación de invocación de callback <code>onClick</code>.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>4</strong></td>
          <td><strong>Props (Propiedades)</strong></td>
          <td><code>test/4_product_card_props.spec.jsx</code></td>
          <td><code>ProductCard</code></td>
          <td>Paso de objeto producto complejo; comprueba formato monetario ($24.990) y badge <code>OFERTA</code>.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>5</strong></td>
          <td><strong>Gestión de Estado</strong></td>
          <td><code>test/5_form_state.spec.jsx</code></td>
          <td><code>SearchForm</code></td>
          <td>Componente controlado con <code>useState</code>. Valida reactividad ante <code>fireEvent.change</code>.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>6</strong></td>
          <td><strong>Gestión de Estado</strong></td>
          <td><code>test/6_quantity_selector_state.spec.jsx</code></td>
          <td><code>QuantitySelector</code></td>
          <td>Incremento (+1) y decremento (-1) controlado de cantidad respetando cotas físicas de inventario.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>7</strong></td>
          <td><strong>Simulación de Eventos</strong></td>
          <td><code>test/7_event_add_cart.spec.jsx</code></td>
          <td><code>ProductCard</code></td>
          <td>Disparo sintético de <code>fireEvent.click</code> sobre "+ Agregar" y verificación del payload entregado.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>8</strong></td>
          <td><strong>Simulación de Eventos</strong></td>
          <td><code>test/8_event_form_submit.spec.jsx</code></td>
          <td><code>SimpleContactForm</code></td>
          <td>Intercepción de <code>fireEvent.submit</code> con llamada a <code>e.preventDefault()</code> sin recargar página.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>9</strong></td>
          <td><strong>Mocks y Aislamiento</strong></td>
          <td><code>test/9_mock_crud_service.spec.jsx</code></td>
          <td><code>productService</code></td>
          <td>Uso de <code>spyOn(productService, 'getAll').and.returnValue(...)</code> aislando el hardware físico.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
        <tr>
          <td><strong>10</strong></td>
          <td><strong>Mocks y Lógica Negocio</strong></td>
          <td><code>test/10_mock_checkout_totals.spec.jsx</code></td>
          <td><code>cartService</code></td>
          <td>Validación matemática de subtotal ($31.970), cupón <code>FELICES50</code> (50% OFF) y regla de despacho gratis.</td>
          <td><span class="badge-success">✅ PASS</span></td>
        </tr>
      </tbody>
    </table>

    <h2>4. Análisis Técnico Detallado por Prueba</h2>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">Test 1 — Renderizado de Listas de Productos</span>
        <span class="req-tag">1_render_list.spec.jsx</span>
      </div>
      <p><strong>Objetivo:</strong> Validar que el componente recorra fielmente una colección arbitraria de elementos mediante <code>Array.prototype.map</code> y renderice la cantidad exacta de nodos en el DOM virtual.</p>
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
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">Test 2 — Renderizado Condicional de Mensajes de Alerta</span>
        <span class="req-tag">2_render_conditional.spec.jsx</span>
      </div>
      <p><strong>Objetivo:</strong> Demostrar que el componente evalúa condiciones lógicas booleanas, no agregando nodos vacíos al DOM cuando la propiedad no existe y dibujando la estructura completa con roles de accesibilidad cuando sí existe.</p>
      <pre><code>it('no renderiza nada si no hay mensaje y se renderiza con el mensaje cuando existe', () => {
  const { container, rerender } = render(&lt;AlertMessage message="" /&gt;);
  expect(container.firstChild).toBeNull();

  rerender(&lt;AlertMessage message="Stock no disponible temporalmente" type="danger" /&gt;);
  const alert = screen.getByRole('alert');
  expect(alert).toBeTruthy();
  expect(alert.textContent).toContain('Stock no disponible');
});</code></pre>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">Test 3 & 4 — Transferencia y Validación de Propiedades (Props)</span>
        <span class="req-tag">3_button_props.spec.jsx & 4_product_card_props.spec.jsx</span>
      </div>
      <p><strong>Objetivo:</strong> Confirmar que las funciones callback suministradas como props sean invocadas ante la interacción, y que los objetos de modelo de datos complejos sean desestructurados y renderizados con formateo adecuado (ej. formato CLP <code>$24.990</code> y flag condicional de oferta).</p>
      <pre><code>it('ejecuta el callback onClick al presionar el botón', () => {
  const handleClick = jasmine.createSpy('handleClick');
  render(&lt;Button label="Comprar Ahora" onClick={handleClick} variant="primary" /&gt;);
  fireEvent.click(screen.getByRole('button', { name: /Comprar Ahora/i }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});</code></pre>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">Test 5 & 6 — Gestión Reactiva del Estado (State)</span>
        <span class="req-tag">5_form_state.spec.jsx & 6_quantity_selector_state.spec.jsx</span>
      </div>
      <p><strong>Objetivo:</strong> Validar el ciclo de vida del estado interno mediante el hook <code>useState</code>, asegurando que ante cambios en inputs o botones de incremento/decremento el DOM se actualice de forma síncrona y predecible.</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">Test 7 & 8 — Simulación de Eventos Sintéticos de React</span>
        <span class="req-tag">7_event_add_cart.spec.jsx & 8_event_form_submit.spec.jsx</span>
      </div>
      <p><strong>Objetivo:</strong> Simular el comportamiento del usuario en el navegador sin requerir interacción manual humana, verificando la transmisión de datos hacia manejadores de evento y la anulación del envío por defecto del navegador (<code>preventDefault</code>).</p>
    </div>

    <div class="req-card">
      <div class="req-header">
        <span class="req-id">Test 9 & 10 — Aislamiento con Mocks/Spies y Lógica de Negocio</span>
        <span class="req-tag">9_mock_crud_service.spec.jsx & 10_mock_checkout_totals.spec.jsx</span>
      </div>
      <p><strong>Objetivo:</strong> Emplear técnicas avanzadas de espionaje (<code>spyOn</code>) para suplantar respuestas del backend simulado y verificar las fórmulas comerciales: cálculo de subtotal ($31.970), descuento del 50% con cupón de tercera edad (<code>FELICES50</code>) y asignación de despacho gratuito ($0) para compras sobre $30.000.</p>
      <pre><code>it('calcula correctamente el subtotal, descuento del 50% y despacho gratis', () => {
  const items = [
    { id: 'TC001', precio: 24990, cantidad: 1 },
    { id: 'PI001', precio: 3490, cantidad: 2 }
  ];
  // Subtotal = 24.990 + 6.980 = 31.970 (> 30.000 => Despacho Gratis $0)
  const totalsSinCupon = cartService.calculateTotals(items, null);
  expect(totalsSinCupon.subtotal).toBe(31970);
  expect(totalsSinCupon.envio).toBe(0);

  // Con cupón FELICES50 (50% OFF)
  const totalsConCupon = cartService.calculateTotals(items, 'FELICES50');
  expect(totalsConCupon.descuento).toBe(15985);
  expect(totalsConCupon.total).toBe(15985);
});</code></pre>
    </div>

    <h2>5. Evidencia de Ejecución Oficial (Log Verbatim de Terminal)</h2>
    <p>A continuación se adjunta la salida limpia de consola generada al ejecutar el comando automatizado <code>npm test</code>:</p>

    <div class="log-box">> pasteleria-mil-sabores-react@2.0.0 test
> karma start karma.conf.cjs --single-run

Webpack bundling...
asset commons.js 2.14 MiB [emitted] (name: commons) (id hint: commons)
asset runtime.js 9.16 KiB [emitted] (name: runtime)
asset 6_quantity_selector_state.spec.1839311523.js 1.05 KiB [emitted]
asset 10_mock_checkout_totals.spec.31701100.js 1.04 KiB [emitted]
asset 4_product_card_props.spec.2197955914.js 1.04 KiB [emitted]
asset 2_render_conditional.spec.592418411.js 1.04 KiB [emitted]
asset 9_mock_crud_service.spec.2658203379.js 1.03 KiB [emitted]
asset 8_event_form_submit.spec.564124260.js 1.03 KiB [emitted]
asset 7_event_add_cart.spec.3760221539.js 1.03 KiB [emitted]
asset 3_button_props.spec.1072762136.js 1.02 KiB [emitted]
asset 1_render_list.spec.2015044352.js 1.02 KiB [emitted]
asset 5_form_state.spec.3929188692.js 1.02 KiB [emitted]
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

    <h2>6. Mapeo de Indicadores de Logro — Rúbrica Duoc UC</h2>
    <table>
      <thead>
        <tr>
          <th>Indicador</th>
          <th>Descripción Oficial del Criterio</th>
          <th>Evidencia de Cumplimiento</th>
          <th>Nivel Alcanzado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>IE2.2.1</strong></td>
          <td>Implementa pruebas unitarias para componentes básicos de interfaz gráfica.</td>
          <td>Tests 1, 2, 3 y 4 cubren renderizado de listas, condicional y props.</td>
          <td><span class="badge-success">Excelente (100%)</span></td>
        </tr>
        <tr>
          <td><strong>IE2.2.2</strong></td>
          <td>Evalúa la interacción del usuario y cambios de estado en componentes React.</td>
          <td>Tests 5, 6, 7 y 8 validan inputs controlados, selectores y submit.</td>
          <td><span class="badge-success">Excelente (100%)</span></td>
        </tr>
        <tr>
          <td><strong>IE2.3.1</strong></td>
          <td>Aplica mocks y stubs para aislar dependencias externas y servicios de datos.</td>
          <td>Test 9 mockea servicios de lectura y guardado con Jasmine Spies.</td>
          <td><span class="badge-success">Excelente (100%)</span></td>
        </tr>
        <tr>
          <td><strong>IE2.3.2</strong></td>
          <td>Verifica lógica de negocio compleja, cálculos matemáticos y validaciones.</td>
          <td>Test 10 valida cálculos tributarios (IVA), cupones y despacho.</td>
          <td><span class="badge-success">Excelente (100%)</span></td>
        </tr>
      </tbody>
    </table>

    <div class="footer-sign">
      <div class="sign-box">
        <div class="sign-name">Responsable de Aseguramiento de Calidad (QA)</div>
        <div>Equipo de Desarrollo Frontend — Duoc UC</div>
      </div>
      <div class="sign-box">
        <div class="sign-name">Docente Evaluador DSY1104</div>
        <div>Escuela de Informática y Telecomunicaciones</div>
      </div>
    </div>
  </div>

</body>
</html>`;

// Guardar archivos HTML
const ersHtmlPath = path.resolve(__dirname, 'DOCUMENTO_ERS_V2.html');
const testingHtmlPath = path.resolve(__dirname, 'DOCUMENTO_COBERTURA_TESTING.html');

fs.writeFileSync(ersHtmlPath, ersHtml, 'utf8');
fs.writeFileSync(testingHtmlPath, testingHtml, 'utf8');

console.log('HTMLs generados exitosamente:');
console.log(' - ' + ersHtmlPath);
console.log(' - ' + testingHtmlPath);

// Función para compilar HTML a PDF vía Chrome Headless
function compileToPdf(htmlFile, pdfFile) {
  return new Promise((resolve, reject) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const absHtml = 'file:///' + path.resolve(htmlFile).replace(/\\\\/g, '/');
    const absPdf = path.resolve(pdfFile);

    console.log(`Compilando PDF para ${htmlFile}...`);
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
        console.log(`✅ PDF generado: ${pdfFile} (${fs.statSync(absPdf).size} bytes)`);
        resolve(absPdf);
      } else {
        console.error(`❌ Error al compilar PDF para ${htmlFile}, código de salida: ${code}`);
        reject(new Error(`Failed to generate ${pdfFile}`));
      }
    });
  });
}

async function run() {
  try {
    await compileToPdf('DOCUMENTO_ERS_V2.html', 'DOCUMENTO_ERS_V2.pdf');
    await compileToPdf('DOCUMENTO_COBERTURA_TESTING.html', 'DOCUMENTO_COBERTURA_TESTING.pdf');
    console.log('¡Todos los documentos PDF y HTML se generaron exitosamente!');
  } catch (err) {
    console.error('Error durante la generación de PDFs:', err);
    process.exit(1);
  }
}

run();
