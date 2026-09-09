/* ==========================================================================
   PASTELERÍA MIL SABORES — js/carrito.js
   Lógica del Carrito de Compras: modificación, resumen de pago y checkout.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const contenedorCarrito = document.getElementById('contenedorCarritoPage');
  if (contenedorCarrito) {
    renderizarPaginaCarrito();
  }
});

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

  // Calcular subtotal
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
}

/**
 * Vacía el carrito completo.
 */
function vaciarCarritoCompleto() {
  if (confirm('¿Estás seguro de que deseas vaciar tu carrito?')) {
    guardarCarrito([]);
    renderizarPaginaCarrito();
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
  renderizarPaginaCarrito();
}
