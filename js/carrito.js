/* ==========================================================================
   PASTELERÍA MIL SABORES — js/carrito.js
   Lógica del Carrito de Compras: Vista de Página ("Tu bolsa") y Drawer Desplegable.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inyectar estructuras del Carrito Desplegable en el DOM si no existen
  inyectarDrawerCarrito();

  // 2. Escuchar clics en botones de carrito (.nav-carrito o a[href="carrito.html"])
  document.querySelectorAll('.nav-carrito, a[href="carrito.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Si la tecla Ctrl o Cmd no está presionada y NO estamos ya en carrito.html, abrir drawer
      if (!e.ctrlKey && !e.metaKey && !window.location.pathname.endsWith('carrito.html')) {
        e.preventDefault();
        abrirDrawerCarrito();
      }
    });
  });

  // 3. Renderizar página del carrito si estamos en carrito.html
  const contenedorCarrito = document.getElementById('contenedorCarritoPage');
  if (contenedorCarrito) {
    renderizarPaginaCarrito();
  }
});

/**
 * Inyecta el HTML del Backdrop y Drawer del Carrito dinámicamente en el body.
 */
function inyectarDrawerCarrito() {
  if (document.getElementById('drawerCarrito')) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'backdropCarrito';
  backdrop.className = 'backdrop-carrito';
  backdrop.onclick = cerrarDrawerCarrito;

  const drawer = document.createElement('aside');
  drawer.id = 'drawerCarrito';
  drawer.className = 'drawer-carrito';
  drawer.innerHTML = `
    <div class="drawer-header">
      <h3>Tu bolsa</h3>
      <button class="btn-cerrar-drawer" onclick="cerrarDrawerCarrito()" aria-label="Cerrar bolsa">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div id="drawerCuerpoItems" class="drawer-cuerpo"></div>
    <div id="drawerFooterSummary" class="drawer-footer"></div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);
  renderizarDrawerCarrito();
}

/**
 * Abre el panel desplegable del carrito con animación.
 */
function abrirDrawerCarrito() {
  const backdrop = document.getElementById('backdropCarrito');
  const drawer = document.getElementById('drawerCarrito');
  if (backdrop && drawer) {
    renderizarDrawerCarrito();
    backdrop.classList.add('backdrop-abierto');
    drawer.classList.add('drawer-abierto');
  }
}

/**
 * Cierra el panel desplegable del carrito.
 */
function cerrarDrawerCarrito() {
  const backdrop = document.getElementById('backdropCarrito');
  const drawer = document.getElementById('drawerCarrito');
  if (backdrop && drawer) {
    backdrop.classList.remove('backdrop-abierto');
    drawer.classList.remove('drawer-abierto');
  }
}

/**
 * Renderiza el contenido interno del Carrito Desplegable.
 */
function renderizarDrawerCarrito() {
  const cuerpo = document.getElementById('drawerCuerpoItems');
  const footer = document.getElementById('drawerFooterSummary');
  if (!cuerpo || !footer) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    cuerpo.innerHTML = `
      <div class="bolsa-vacia-container">
        <h4 class="bolsa-vacia-titulo">Tu bolsa está vacía.</h4>
        <p class="bolsa-vacia-subtitulo">
          ¿No sabes por dónde comenzar?<br>
          Prueba con estas categorías:
        </p>

        <a href="productos.html?cat=Tortas+Circulares" class="tarjeta-categoria-sugerida" onclick="cerrarDrawerCarrito()">
          <img src="img/torta-amor-lucuma.png" alt="Tortas" class="cat-sugerida-thumb">
          <span class="cat-sugerida-nombre">Tortas</span>
          <span class="cat-sugerida-flecha">↗</span>
        </a>

        <a href="productos.html?cat=Postres+Individuales" class="tarjeta-categoria-sugerida" onclick="cerrarDrawerCarrito()">
          <img src="img/pie-de-limon.png" alt="Postres" class="cat-sugerida-thumb">
          <span class="cat-sugerida-nombre">Postres</span>
          <span class="cat-sugerida-flecha">↗</span>
        </a>

        <a href="productos.html?cat=Pastelería+Tradicional" class="tarjeta-categoria-sugerida" onclick="cerrarDrawerCarrito()">
          <img src="img/alfajores-hojarasca.png" alt="Alfajores" class="cat-sugerida-thumb">
          <span class="cat-sugerida-nombre">Alfajores</span>
          <span class="cat-sugerida-flecha">↗</span>
        </a>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  cuerpo.innerHTML = carrito.map(item => `
    <div class="drawer-item">
      <img src="${item.imagen}" alt="${item.nombre}" class="drawer-item-img">
      <div class="drawer-item-detalles">
        <div class="drawer-item-nombre">${item.nombre}</div>
        <div class="drawer-item-precio">$${item.precio.toLocaleString('es-CL')} c/u</div>
        <div style="margin-top:0.4rem;" class="control-cantidad-lafete">
          <button type="button" onclick="modificarCantidadItem('${item.id}', -1)">-</button>
          <input type="number" value="${item.cantidad}" readonly>
          <button type="button" onclick="modificarCantidadItem('${item.id}', 1)">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <strong style="color:var(--color-chocolate); font-size:0.95rem;">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
        <br>
        <button class="btn-eliminar-link" onclick="eliminarItemCarrito('${item.id}')" style="margin-top:0.3rem;">Eliminar</button>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="drawer-linea-total">
      <span>Subtotal:</span>
      <span>$${subtotal.toLocaleString('es-CL')}</span>
    </div>
    <button onclick="procesarPagoSimulado()" class="boton-pill-dark" style="width:100%;">
      Proceder al Pago
    </button>
  `;
}

/**
 * Renderiza la vista completa del carrito ("Tu bolsa") con el estilo original definido para Mil Sabores.
 */
function renderizarPaginaCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById('contenedorCarritoPage');
  const barraWrapper = document.getElementById('barraDespachoWrapper');
  if (!contenedor) return;

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const metaEnvioGratis = 30000;
  const faltante = metaEnvioGratis - subtotal;
  const porcentaje = Math.min(100, Math.round((subtotal / metaEnvioGratis) * 100));

  // Renderizar la barra de envío express gratis
  if (barraWrapper) {
    if (carrito.length === 0) {
      barraWrapper.innerHTML = '';
    } else {
      const textoDespacho = subtotal >= metaEnvioGratis
        ? '¡Felicidades! Tienes <strong>despacho express gratis</strong>.'
        : `Agrega <strong>$${faltante.toLocaleString('es-CL')}</strong> y obtén <strong>despacho express gratis</strong>.`;

      barraWrapper.innerHTML = `
        <p class="texto-despacho-express">${textoDespacho}</p>
        <div class="track-barra-despacho">
          <div class="fill-barra-despacho" style="width: ${porcentaje}%;"></div>
        </div>
      `;
    }
  }

  // Si el carrito está vacío: Tarjeta vacía con tipografía oficial de marca y texto ajustado
  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="tarjeta-bolsa-vacia">
        <div class="bolsa-vacia-texto">
          <h2 class="bolsa-vacia-titulo">Tu bolsa está vacía</h2>
          <p class="bolsa-vacia-subtitulo">Descubre nuestras preparaciones artesanales y llena tu bolsa de sabor.</p>
        </div>
        <div class="bolsa-vacia-btn-wrapper">
          <a href="productos.html" class="boton-pill-dark">Ver catálogo</a>
        </div>
      </div>
    `;
    return;
  }

  // Si el carrito tiene productos: Tabla elegante centrada en tarjeta
  contenedor.innerHTML = `
    <div class="tarjeta-bolsa-llena">
      <div class="tabla-bolsa-wrapper">
        <table class="tabla-bolsa">
          <thead>
            <tr>
              <th class="th-producto">Producto</th>
              <th class="th-precio">Precio</th>
              <th class="th-cantidad">Cantidad</th>
              <th class="th-total">Total</th>
            </tr>
          </thead>
          <tbody>
            ${carrito.map(item => `
              <tr>
                <td class="td-producto">
                  <div class="item-bolsa-info">
                    <div class="item-bolsa-thumb-wrapper">
                      <img src="${item.imagen}" alt="${item.nombre}" class="item-bolsa-thumb">
                    </div>
                    <div class="item-bolsa-detalles">
                      <span class="item-bolsa-nombre">${item.nombre}</span>
                      <button type="button" class="btn-eliminar-link" onclick="eliminarItemCarrito('${item.id}')">Eliminar</button>
                    </div>
                  </div>
                </td>
                <td class="td-precio">
                  $${item.precio.toLocaleString('es-CL')}
                </td>
                <td class="td-cantidad">
                  <div class="control-cantidad-lafete">
                    <button type="button" onclick="modificarCantidadItem('${item.id}', -1)" aria-label="Restar cantidad">-</button>
                    <input type="number" value="${item.cantidad}" readonly>
                    <button type="button" onclick="modificarCantidadItem('${item.id}', 1)" aria-label="Sumar cantidad">+</button>
                  </div>
                </td>
                <td class="td-total">
                  $${(item.precio * item.cantidad).toLocaleString('es-CL')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Sección de Subtotal al Pie centrada -->
      <div class="bolsa-footer-resumen">
        <div class="subtotal-info-col">
          <h2 class="subtotal-label">Subtotal</h2>
          <p class="subtotal-nota">Descuentos y envíos calculados previo al pago.</p>
        </div>
        <div class="subtotal-monto-col">
          <span class="subtotal-monto">$${subtotal.toLocaleString('es-CL')}</span>
        </div>
      </div>

      <!-- Botón de Pago estilo Marca -->
      <div class="bolsa-acciones-finales">
        <a href="productos.html" class="boton-seguir-comprando">← Seguir comprando</a>
        <button onclick="procesarPagoSimulado()" class="boton-pill-dark btn-proceder-pago">
          Proceder al Pago
        </button>
      </div>
    </div>
  `;
}

/**
 * Modifica la cantidad de un ítem en el carrito (+1 o -1).
 */
function modificarCantidadItem(id, delta) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === id);
  if (index >= 0) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    guardarCarrito(carrito);
    renderizarPaginaCarrito();
    renderizarDrawerCarrito();
  }
}

/**
 * Elimina un producto por su ID del carrito.
 */
function eliminarItemCarrito(id) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito(carrito);
  renderizarPaginaCarrito();
  renderizarDrawerCarrito();
}

/**
 * Vacía el carrito completo.
 */
function vaciarCarritoCompleto() {
  if (confirm('¿Estás seguro de que deseas vaciar tu bolsa?')) {
    guardarCarrito([]);
    renderizarPaginaCarrito();
    renderizarDrawerCarrito();
  }
}

/**
 * Simulación de pago y checkout.
 */
function procesarPagoSimulado() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;

  alert('🎉 ¡Gracias por tu compra en Pastelería Mil Sabores!\n\nTu pedido ha sido procesado exitosamente.');
  guardarCarrito([]);
  cerrarDrawerCarrito();
  renderizarPaginaCarrito();
  renderizarDrawerCarrito();
}
