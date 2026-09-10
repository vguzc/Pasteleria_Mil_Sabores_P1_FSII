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

  // 4. Escuchar tecla Enter en inputs de cupón (Drawer y Bolsa)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (document.activeElement && document.activeElement.id === 'inputCuponDrawer') {
        e.preventDefault();
        procesarAplicarCupon('inputCuponDrawer');
      } else if (document.activeElement && document.activeElement.id === 'inputCuponBolsa') {
        e.preventDefault();
        procesarAplicarCupon('inputCuponBolsa');
      }
    }
  });
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
  const cupon = obtenerCuponAplicado();
  const descuentoMonto = cupon ? Math.round(subtotal * (cupon.porcentaje / 100)) : 0;
  const total = Math.max(0, subtotal - descuentoMonto);

  cuerpo.innerHTML = carrito.map(item => {
    const key = item.cartItemId || item.id;
    return `
      <div class="drawer-item">
        <img src="${item.imagen}" alt="${item.nombre}" class="drawer-item-img">
        <div class="drawer-item-detalles">
          <div class="drawer-item-nombre">${item.nombre}</div>
          ${item.mensaje ? `<div style="font-size:0.78rem; color:var(--color-chocolate); font-style:italic; margin-top:0.2rem; background:var(--color-fondo); padding:0.2rem 0.5rem; border-radius:4px; display:inline-block;">Dedicatoria: "${item.mensaje}"</div>` : ''}
          <div class="drawer-item-precio" style="margin-top:0.3rem;">$${item.precio.toLocaleString('es-CL')} c/u</div>
          <div style="margin-top:0.4rem;" class="control-cantidad-lafete">
            <button type="button" onclick="modificarCantidadItem('${key}', -1)">-</button>
            <input type="number" value="${item.cantidad}" readonly>
            <button type="button" onclick="modificarCantidadItem('${key}', 1)">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <strong style="color:var(--color-chocolate); font-size:0.95rem;">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</strong>
          <br>
          <button class="btn-eliminar-link" onclick="eliminarItemCarrito('${key}')" style="margin-top:0.3rem;">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');

  footer.innerHTML = `
    <div style="padding:0.75rem 0; border-bottom:1px dashed rgba(107,68,35,0.2); margin-bottom:0.75rem;">
      <div class="drawer-linea-total">
        <span>Subtotal:</span>
        <span>$${subtotal.toLocaleString('es-CL')}</span>
      </div>
      ${cupon ? `
        <div class="linea-descuento-resumen" style="font-size:0.9rem; margin-top:0.3rem;">
          <span>Descuento (${cupon.codigo}):</span>
          <span>-$${descuentoMonto.toLocaleString('es-CL')}</span>
        </div>
      ` : ''}
      <div class="drawer-linea-total" style="font-size:1.1rem; font-weight:800; color:var(--color-chocolate); margin-top:0.4rem;">
        <span>Total:</span>
        <span>$${total.toLocaleString('es-CL')}</span>
      </div>
    </div>

    <!-- Cupón de Descuento en Drawer -->
    <div style="margin-bottom:0.85rem;">
      ${cupon ? `
        <div class="badge-cupon-aplicado" style="width:100%; justify-content:space-between;">
          <span style="display:inline-flex; align-items:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.35rem;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> <strong>${cupon.codigo}</strong> (${cupon.porcentaje}% OFF)</span>
          <button type="button" onclick="quitarCuponCarrito()" class="btn-quitar-cupon" title="Quitar cupón">✕</button>
        </div>
      ` : `
        <div class="cupon-input-wrapper">
          <input type="text" id="inputCuponDrawer" placeholder="Ingresa tu cupón" class="input-cupon" style="text-transform: uppercase;">
          <button type="button" onclick="procesarAplicarCupon('inputCuponDrawer')" class="boton-aplicar-cupon">Aplicar</button>
        </div>
        <div id="mensajeCuponDrawer" class="mensaje-cupon-feedback"></div>
      `}
    </div>

    <a href="carrito.html" onclick="irAlCarritoPage(event)" class="boton-pill-dark" style="width:100%; text-decoration:none; text-align:center;">
      Proceder al Pago ($${total.toLocaleString('es-CL')})
    </a>
  `;
}

/**
 * Renderiza la vista completa del carrito ("Tu bolsa") con el estilo original definido para Mil Sabores.
 */
function renderizarPaginaCarrito() {
  const carrito = obtenerCarrito();
  const contenedor = document.getElementById('contenedorCarritoPage');
  if (!contenedor) return;

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

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const cupon = obtenerCuponAplicado();
  const descuentoMonto = cupon ? Math.round(subtotal * (cupon.porcentaje / 100)) : 0;
  const total = Math.max(0, subtotal - descuentoMonto);

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
            ${carrito.map(item => {
              const key = item.cartItemId || item.id;
              return `
                <tr>
                  <td class="td-producto">
                    <div class="item-bolsa-info">
                      <div class="item-bolsa-thumb-wrapper">
                        <img src="${item.imagen}" alt="${item.nombre}" class="item-bolsa-thumb">
                      </div>
                      <div class="item-bolsa-detalles">
                        <span class="item-bolsa-nombre">${item.nombre}</span>
                        ${item.mensaje ? `<span style="display:block; font-size:0.83rem; color:var(--color-chocolate); font-style:italic; margin-top:0.25rem; background:var(--color-fondo); padding:0.2rem 0.5rem; border-radius:4px; width:fit-content;">Dedicatoria: "${item.mensaje}"</span>` : ''}
                        <button type="button" class="btn-eliminar-link" onclick="eliminarItemCarrito('${key}')" style="margin-top:0.35rem;">Eliminar</button>
                      </div>
                    </div>
                  </td>
                  <td class="td-precio">
                    $${item.precio.toLocaleString('es-CL')}
                  </td>
                  <td class="td-cantidad">
                    <div class="control-cantidad-lafete">
                      <button type="button" onclick="modificarCantidadItem('${key}', -1)" aria-label="Restar cantidad">-</button>
                      <input type="number" value="${item.cantidad}" readonly>
                      <button type="button" onclick="modificarCantidadItem('${key}', 1)" aria-label="Sumar cantidad">+</button>
                    </div>
                  </td>
                  <td class="td-total">
                    $${(item.precio * item.cantidad).toLocaleString('es-CL')}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <!-- Sección de Cupón de Descuento -->
      <div class="contenedor-cupon-bolsa">
        <div class="cupon-titulo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          Cupón de Descuento
        </div>
        ${cupon ? `
          <div class="badge-cupon-aplicado">
            <span style="display:inline-flex; align-items:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.4rem;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg> Cupón <strong>${cupon.codigo}</strong> (${cupon.porcentaje}% OFF) aplicado con éxito</span>
            <button type="button" onclick="quitarCuponCarrito()" class="btn-quitar-cupon" title="Quitar cupón">✕</button>
          </div>
        ` : `
          <div class="cupon-input-wrapper">
            <input type="text" id="inputCuponBolsa" placeholder="Ingresa tu cupón" class="input-cupon" style="text-transform: uppercase;">
            <button type="button" onclick="procesarAplicarCupon('inputCuponBolsa')" class="boton-aplicar-cupon">Aplicar Cupón</button>
          </div>
          <div id="mensajeCuponBolsa" class="mensaje-cupon-feedback"></div>
        `}
      </div>

      <!-- Sección de Subtotal y Totales al Pie centrada -->
      <div class="bolsa-footer-resumen">
        <div class="subtotal-info-col">
          <h2 class="subtotal-label">Resumen de Compra</h2>
          <p class="subtotal-nota" style="margin-top:0.4rem;">
            ${cupon ? `<span style="color:#2e7d32; font-weight:600; display:inline-flex; align-items:center; gap:0.4rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Descuento del cupón <strong>${cupon.codigo}</strong> (${cupon.porcentaje}% OFF) aplicado.</span>` : 'Descuentos y envíos calculados previo al pago.'}
          </p>
        </div>
        <div class="subtotal-monto-col" style="text-align:right;">
          <div style="font-size:1.05rem; color:#666; margin-bottom:0.2rem;">
            Subtotal: $${subtotal.toLocaleString('es-CL')}
          </div>
          ${cupon ? `
            <div class="linea-descuento-resumen">
              <span>Descuento (${cupon.codigo}):</span>
              <span>-$${descuentoMonto.toLocaleString('es-CL')}</span>
            </div>
          ` : ''}
          <div style="margin-top:0.4rem;">
            <span style="font-size:1rem; font-weight:700; color:var(--color-chocolate);">TOTAL: </span>
            <span class="subtotal-monto">$${total.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>

      <!-- Botón de Pago estilo Marca -->
      <div class="bolsa-acciones-finales">
        <a href="productos.html" class="boton-seguir-comprando">← Seguir comprando</a>
        <button onclick="procesarPagoSimulado()" class="boton-pill-dark btn-proceder-pago">
          Proceder al Pago ($${total.toLocaleString('es-CL')})
        </button>
      </div>
    </div>
  `;
}

/**
 * Modifica la cantidad de un ítem en el carrito (+1 o -1).
 */
function modificarCantidadItem(idOKey, delta) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(item => (item.cartItemId || item.id) === idOKey);
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
 * Elimina un producto por su clave/ID del carrito.
 */
function eliminarItemCarrito(idOKey) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(item => (item.cartItemId || item.id) !== idOKey);
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
 * Dirige al usuario a la página completa de la bolsa (carrito.html).
 */
function irAlCarritoPage(e) {
  if (e) e.preventDefault();
  cerrarDrawerCarrito();
  window.location.href = 'carrito.html';
}

/**
 * Procesa la aplicación de un cupón desde una caja de texto (Bolsa o Drawer).
 * @param {string} inputId ID del input donde el usuario escribió el código.
 */
function procesarAplicarCupon(inputId) {
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;

  const codigo = inputEl.value.trim().toUpperCase();
  const feedbackId = inputId === 'inputCuponBolsa' ? 'mensajeCuponBolsa' : 'mensajeCuponDrawer';

  if (!codigo) return;

  const sesionStr = localStorage.getItem('sesionActiva');
  const sesion = sesionStr ? JSON.parse(sesionStr) : null;
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const usuario = sesion ? (usuarios.find(u => (u.correo || '').toLowerCase() === sesion.correo.toLowerCase()) || sesion) : null;
  const cuponesUsados = usuario ? (usuario.cuponesUsados || []) : [];

  if (cuponesUsados.includes(codigo)) {
    if (feedbackEl) {
      feedbackEl.className = 'mensaje-cupon-feedback mensaje-cupon-error';
      feedbackEl.textContent = `Ya has utilizado el cupón "${codigo}" en una compra anterior.`;
    }
    return;
  }

  const correo = usuario ? (usuario.correo || '').toLowerCase() : '';
  const esDuoc = correo.endsWith('@duocuc.cl') || correo.endsWith('@profesor.duoc.cl') || correo.endsWith('@duoc.cl');

  if (codigo === 'DUOC10' && !esDuoc) {
    if (feedbackEl) {
      feedbackEl.className = 'mensaje-cupon-feedback mensaje-cupon-error';
      feedbackEl.textContent = 'El cupón DUOC10 es exclusivo para convenios institucionales Duoc UC (@duocuc.cl / @profesor.duoc.cl).';
    }
    return;
  }

  if (codigo === 'FELICES50' && usuario && (usuario.edad === undefined || usuario.edad < 50)) {
    if (feedbackEl) {
      feedbackEl.className = 'mensaje-cupon-feedback mensaje-cupon-error';
      feedbackEl.textContent = 'El cupón FELICES50 requiere tener 50 años o más.';
    }
    return;
  }

  if (typeof CUPONES_VALIDOS !== 'undefined' && CUPONES_VALIDOS[codigo]) {
    const infoCupon = CUPONES_VALIDOS[codigo];
    guardarCuponAplicado({
      codigo: codigo,
      porcentaje: infoCupon.porcentaje,
      nombre: infoCupon.nombre
    });

    renderizarPaginaCarrito();
    renderizarDrawerCarrito();
  } else {
    if (feedbackEl) {
      feedbackEl.className = 'mensaje-cupon-feedback mensaje-cupon-error';
      feedbackEl.textContent = 'El cupón ingresado no es válido.';
    }
  }
}

/**
 * Marca un cupón como utilizado en la cuenta del usuario activo para eliminarlo en futuras compras.
 */
function marcarCuponUsadoParaUsuario(codigoCupon) {
  if (!codigoCupon) return;

  try {
    const sesionStr = localStorage.getItem('sesionActiva');
    const sesion = sesionStr ? JSON.parse(sesionStr) : null;
    if (!sesion || !sesion.correo) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => (u.correo || '').toLowerCase() === sesion.correo.toLowerCase());

    if (index !== -1) {
      const cuponesUsados = usuarios[index].cuponesUsados || [];
      if (!cuponesUsados.includes(codigoCupon)) {
        cuponesUsados.push(codigoCupon);
      }
      usuarios[index].cuponesUsados = cuponesUsados;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    sesion.cuponesUsados = sesion.cuponesUsados || [];
    if (!sesion.cuponesUsados.includes(codigoCupon)) {
      sesion.cuponesUsados.push(codigoCupon);
    }
    localStorage.setItem('sesionActiva', JSON.stringify(sesion));
  } catch (err) {
    console.error('Error al marcar cupón usado:', err);
  }
}

/**
 * Elimina el cupón de descuento actualmente aplicado.
 */
function quitarCuponCarrito() {
  guardarCuponAplicado(null);
  renderizarPaginaCarrito();
  renderizarDrawerCarrito();
}

/**
 * Simulación de pago y checkout en la página del carrito.
 */
function procesarPagoSimulado() {
  const carrito = obtenerCarrito();
  if (carrito.length === 0) return;

  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const cupon = obtenerCuponAplicado();
  const descuentoMonto = cupon ? Math.round(subtotal * (cupon.porcentaje / 100)) : 0;
  const total = Math.max(0, subtotal - descuentoMonto);

  let resumenMsg = `¡Gracias por tu compra en Pastelería Mil Sabores!\n\n`;
  resumenMsg += `Resumen del Pedido:\n`;
  resumenMsg += `- Subtotal: $${subtotal.toLocaleString('es-CL')}\n`;
  if (cupon) {
    resumenMsg += `- Cupón ${cupon.codigo}: -$${descuentoMonto.toLocaleString('es-CL')} (${cupon.porcentaje}% OFF)\n`;
    marcarCuponUsadoParaUsuario(cupon.codigo);
  }
  resumenMsg += `- Total Pagado: $${total.toLocaleString('es-CL')}\n\n`;
  resumenMsg += `Tu pedido ha sido procesado exitosamente.`;

  alert(resumenMsg);
  guardarCarrito([]);
  guardarCuponAplicado(null);
  cerrarDrawerCarrito();
  renderizarPaginaCarrito();
  renderizarDrawerCarrito();
}
