/* ==========================================================================
   PASTELERÍA MIL SABORES — js/carrito.js
   Lógica del Carrito de Compras: Vista de Página y Carrito Desplegable (Drawer).
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inyectar estructuras del Carrito Desplegable en el DOM si no existen
  inyectarDrawerCarrito();

  // 2. Escuchar clics en botones de carrito (.nav-carrito o a[href="carrito.html"])
  document.querySelectorAll('.nav-carrito, a[href="carrito.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Si la tecla Ctrl o Cmd no está presionada, abrir drawer en lugar de navegar
      if (!e.ctrlKey && !e.metaKey) {
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
      <h3>🛒 Tu Carrito (<span id="drawerContadorItems">0</span>)</h3>
      <button class="btn-cerrar-drawer" onclick="cerrarDrawerCarrito()">&times;</button>
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
  const contador = document.getElementById('drawerContadorItems');
  if (!cuerpo || !footer) return;

  const carrito = obtenerCarrito();
  const totalUnidades = obtenerTotalUnidadesCarrito();

  if (contador) contador.textContent = totalUnidades;

  if (carrito.length === 0) {
    cuerpo.innerHTML = `
      <div class="estado-vacio" style="padding:2.5rem 1rem; margin:auto 0;">
        <span style="font-size: 3rem; display:block; margin-bottom:0.5rem;">🛒</span>
        <h3 style="font-size:1.3rem;">Tu carrito está vacío</h3>
        <p style="font-size:0.9rem; margin-bottom:1rem;">¡Agrega tus tortas y postres favoritos!</p>
        <button onclick="cerrarDrawerCarrito()" class="boton boton-primario" style="font-size:0.85rem; padding:0.6rem 1.2rem;">Ver Catálogo</button>
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
        <div style="margin-top:0.4rem;" class="control-cantidad">
          <button type="button" onclick="modificarCantidadItem('${item.id}', -1)" style="width:30px; height:30px;">-</button>
          <input type="number" value="${item.cantidad}" readonly style="width:36px; height:30px; font-size:0.88rem;">
          <button type="button" onclick="modificarCantidadItem('${item.id}', 1)" style="width:30px; height:30px;">+</button>
        </div>
      </div>
      <div style="text-align:right;">
        <strong style="color:var(--color-chocolate); font-size:0.95rem;">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
        <br>
        <button class="btn-eliminar-item" onclick="eliminarItemCarrito('${item.id}')" style="margin-top:0.3rem;" title="Eliminar">🗑️</button>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="drawer-linea-total">
      <span>Subtotal:</span>
      <span>$${subtotal.toLocaleString('es-CL')}</span>
    </div>
    <button onclick="procesarPagoSimulado()" class="boton boton-primario btn-drawer-checkout">
      💳 Proceder al Pago
    </button>
  `;
}

/**
 * Renderiza la vista completa del carrito en carrito.html.
 */
function renderizarPaginaCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById('contenedorCarritoPage');
  if (!contenedor) return;

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="estado-vacio">
        <span style="font-size: 4rem; display: block; margin-bottom: 0.5rem;">🛒</span>
        <h2>Tu carrito está vacío</h2>
        <p>¡Descubre nuestros deliciosos productos y agrega tus favoritos!</p>
        <a href="productos.html" class="boton boton-primario">Ir al Catálogo de Productos</a>
      </div>
    `;
    return;
  }

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const envio = subtotal > 30000 ? 0 : 2990;
  const total = subtotal + envio;

  contenedor.innerHTML = `
    <div class="layout-carrito">
      <!-- Tabla de Ítems -->
      <div class="tabla-carrito-wrapper">
        <h2 style="font-size:1.4rem; color:var(--color-chocolate); margin-top:0; margin-bottom:1rem;">Artículos seleccionados (${obtenerTotalUnidadesCarrito()})</h2>
        <table class="tabla-carrito">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${carrito.map(item => `
              <tr>
                <td>
                  <div class="item-carrito-info">
                    <img src="${item.imagen}" alt="${item.nombre}" class="item-carrito-thumb">
                    <div>
                      <strong style="color:var(--color-chocolate);">${item.nombre}</strong><br>
                      <small class="texto-secundario">${item.categoria}</small>
                    </div>
                  </div>
                </td>
                <td>$${item.precio.toLocaleString('es-CL')}</td>
                <td>
                  <div class="control-cantidad">
                    <button type="button" onclick="modificarCantidadItem('${item.id}', -1)">-</button>
                    <input type="number" value="${item.cantidad}" readonly>
                    <button type="button" onclick="modificarCantidadItem('${item.id}', 1)">+</button>
                  </div>
                </td>
                <td><strong>$${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong></td>
                <td>
                  <button class="btn-eliminar-item" onclick="eliminarItemCarrito('${item.id}')" title="Eliminar producto">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top:1.5rem; display:flex; justify-content:space-between; align-items:center;">
          <button onclick="vaciarCarritoCompleto()" class="boton boton-secundario" style="font-size:0.85rem;">Vaciar carrito</button>
          <a href="productos.html" class="boton boton-secundario">← Seguir comprando</a>
        </div>
      </div>

      <!-- Resumen del Pedido -->
      <div class="resumen-pedido-card">
        <h2>Resumen del Pedido</h2>
        <div class="linea-resumen">
          <span>Subtotal:</span>
          <span>$${subtotal.toLocaleString('es-CL')}</span>
        </div>
        <div class="linea-resumen">
          <span>Envío estimado:</span>
          <span>${envio === 0 ? '<strong style="color:var(--color-exito);">¡GRATIS!</strong>' : '$' + envio.toLocaleString('es-CL')}</span>
        </div>
        ${envio > 0 ? '<p style="font-size:0.78rem; color:#888; margin-top:-0.3rem;">¡Envío gratis en compras sobre $30.000!</p>' : ''}
        
        <div class="linea-resumen total">
          <span>Total:</span>
          <span>$${total.toLocaleString('es-CL')}</span>
        </div>

        <button onclick="procesarPagoSimulado()" class="boton boton-primario" style="width:100%; padding:0.9rem; font-size:1.1rem; margin-top:1.5rem;">
          💳 Proceder al Pago
        </button>
      </div>
    </div>
  `;
}

/**
 * Modifica la cantidad de un ítem en el carrito (+1 o -1).
 * @param {string} id 
 * @param {number} delta 
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
 * @param {string} id 
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
  if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
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
