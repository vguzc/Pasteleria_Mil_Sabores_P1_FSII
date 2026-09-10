/* ==========================================================================
   PASTELERÍA MIL SABORES — js/productos.js
   Lógica para el Catálogo de Productos y Vista Detalle de Producto.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en la página del Catálogo
  const contenedorGrilla = document.getElementById('grillaProductos');
  if (contenedorGrilla) {
    inicializarCatalogo(contenedorGrilla);
  }

  // Verificar si estamos en la página de Detalle de Producto
  const contenedorDetalle = document.getElementById('contenedorDetalleProducto');
  if (contenedorDetalle) {
    inicializarDetalleProducto(contenedorDetalle);
  }
});

/**
 * Inicializa el catálogo con filtros, búsqueda y renderizado dinámico.
 * @param {HTMLElement} grilla 
 */
function inicializarCatalogo(grilla) {
  const inputBusqueda = document.getElementById('inputBusqueda');
  const selectCategoria = document.getElementById('selectCategoria');
  const selectOrden = document.getElementById('selectOrden');
  const contadorResultados = document.getElementById('contadorResultados');

  let todosLosProductos = obtenerProductos();

  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam && selectCategoria) {
    const opciones = Array.from(selectCategoria.options).map(o => o.value);
    const coincidencia = opciones.find(o => o.toLowerCase().includes(catParam.toLowerCase()));
    if (coincidencia) {
      selectCategoria.value = coincidencia;
    }
  }

  function filtrarYRenderizar() {
    let resultado = [...todosLosProductos];

    // 1. Filtrar por término de búsqueda (nombre o categoría)
    if (inputBusqueda && inputBusqueda.value.trim() !== '') {
      const termino = inputBusqueda.value.toLowerCase().trim();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(termino) || 
        p.categoria.toLowerCase().includes(termino) ||
        p.id.toLowerCase().includes(termino)
      );
    }

    // 2. Filtrar por categoría seleccionada
    if (selectCategoria && selectCategoria.value !== '') {
      const cat = selectCategoria.value;
      resultado = resultado.filter(p => p.categoria === cat);
    }

    // 3. Ordenar por precio
    if (selectOrden && selectOrden.value !== '') {
      const orden = selectOrden.value;
      if (orden === 'precio-asc') {
        resultado.sort((a, b) => a.precio - b.precio);
      } else if (orden === 'precio-desc') {
        resultado.sort((a, b) => b.precio - a.precio);
      } else if (orden === 'nombre-asc') {
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
      }
    }

    // Actualizar contador
    if (contadorResultados) {
      contadorResultados.textContent = `${resultado.length} producto(s) encontrado(s)`;
    }

    // Renderizar tarjetas
    renderizarGrilla(grilla, resultado);
  }

  // Event Listeners para filtros dinámicos
  if (inputBusqueda) inputBusqueda.addEventListener('input', filtrarYRenderizar);
  if (selectCategoria) selectCategoria.addEventListener('change', filtrarYRenderizar);
  if (selectOrden) selectOrden.addEventListener('change', filtrarYRenderizar);

  // Render inicial
  filtrarYRenderizar();
}

/**
 * Renderiza el arreglo de productos en la grilla HTML.
 * @param {HTMLElement} grilla 
 * @param {Array} productos 
 */
function renderizarGrilla(grilla, productos) {
  if (productos.length === 0) {
    grilla.innerHTML = `
      <div class="estado-vacio" style="grid-column: 1 / -1;">
        <span style="font-size: 3rem;">🎂</span>
        <h3>No encontramos productos</h3>
        <p class="texto-secundario">Intenta cambiar los filtros de búsqueda o seleccionar otra categoría.</p>
      </div>
    `;
    return;
  }

  grilla.innerHTML = productos.map(p => `
    <article class="tarjeta-producto" data-id="${p.id}">
      <div class="tarjeta-imagen-wrapper">
        <span class="badge-categoria">${p.categoria}</span>
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'">
      </div>
      <div class="tarjeta-cuerpo">
        <h3 class="tarjeta-titulo">${p.nombre}</h3>
        <p class="tarjeta-descripcion">${p.descripcion}</p>
        <div class="tarjeta-footer">
          <span class="tarjeta-precio">$${p.precio.toLocaleString('es-CL')}</span>
          <div class="tarjeta-acciones">
            <a href="detalle-producto.html?id=${p.id}" class="boton boton-secundario" style="padding:0.4rem 0.75rem; font-size:0.85rem;">Ver detalle</a>
            <button class="boton boton-primario btn-agregar-rapido" onclick="agregarAlCarritoRapido('${p.id}')" style="padding:0.4rem 0.75rem; font-size:0.85rem;">+ Agregar</button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

/**
 * Carga la vista de detalle de producto según el ID pasado en la URL (?id=...)
 * @param {HTMLElement} contenedor 
 */
function inicializarDetalleProducto(contenedor) {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get('id');

  if (!idProducto) {
    contenedor.innerHTML = `<p class="estado-vacio">No se especificó un producto. <a href="productos.html">Volver al catálogo</a></p>`;
    return;
  }

  const producto = obtenerProductoPorId(idProducto);
  if (!producto) {
    contenedor.innerHTML = `<p class="estado-vacio">El producto solicitado no existe. <a href="productos.html">Volver al catálogo</a></p>`;
    return;
  }

  // Actualizar título de la página
  document.title = `${producto.nombre} | Pastelería Mil Sabores`;

  contenedor.innerHTML = `
    <div class="contenedor-detalle">
      <div class="detalle-galeria">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="detalle-info">
        <span class="badge-categoria" style="position:static; display:inline-block; width:fit-content; margin-bottom:0.75rem;">${producto.categoria}</span>
        <h1 class="detalle-titulo">${producto.nombre}</h1>
        <div class="detalle-precio">$${producto.precio.toLocaleString('es-CL')}</div>
        <p class="detalle-descripcion">${producto.descripcion}</p>
        
        <p style="font-size:0.9rem; color: #666; margin-bottom:1.5rem;">
          <strong>Código:</strong> ${producto.id} | 
          <strong>Stock disponible:</strong> ${producto.stock} unidades
        </p>

        <!-- Campo de Personalización de Mensaje Especial -->
        <div class="campo-grupo" style="margin-bottom: 1.5rem; background: var(--color-fondo); padding: 1.1rem; border-radius: 12px; border: 1px solid var(--color-borde);">
          <label for="mensajePersonalizado" style="font-weight:700; color: var(--color-chocolate); display: block; margin-bottom: 0.4rem; font-size: 0.92rem;">
            Mensaje especial en la torta (Opcional):
          </label>
          <input type="text" id="mensajePersonalizado" placeholder="Ej: ¡Feliz Cumpleaños Pedro!" maxlength="60" style="width:100%; padding: 0.65rem 0.85rem; border: 1.5px solid var(--color-borde); border-radius: 8px; font-family: var(--fuente-texto); font-size: 0.95rem; background: #ffffff;">
          <small style="color: #777; font-size: 0.8rem; margin-top: 0.35rem; display: block;">Escribe una dedicatoria que colocaremos con glaseado artesanal o placa de chocolate.</small>
        </div>

        <div class="selector-cantidad-wrapper">
          <label for="cantidadDetalle" style="font-weight:bold;">Cantidad:</label>
          <div class="control-cantidad">
            <button type="button" onclick="cambiarCantidadDetalle(-1)">-</button>
            <input type="number" id="cantidadDetalle" value="1" min="1" max="${producto.stock}" readonly>
            <button type="button" onclick="cambiarCantidadDetalle(1)">+</button>
          </div>
        </div>

        <div style="display:flex; gap:1rem; flex-wrap:wrap;">
          <button id="btnAgregarDetalle" class="boton boton-primario" style="flex:1; padding:0.85rem 1.5rem; font-size:1rem;">
            Agregar al Carrito
          </button>
          <a href="productos.html" class="boton boton-secundario" style="padding:0.85rem 1.5rem;">Seguir comprando</a>
        </div>

        <!-- Botones para compartir en redes sociales con logos SVG -->
        <div class="compartir-producto" style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px dashed var(--color-borde); display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
          <span style="font-size: 0.88rem; font-weight: 700; color: var(--color-chocolate); margin-right: 0.25rem;">Compartir:</span>
          <button type="button" onclick="compartirWhatsApp('${producto.nombre}')" class="boton-social" aria-label="Compartir en WhatsApp" title="Compartir en WhatsApp" style="background: #25D366; color: #ffffff; border: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </button>
          <button type="button" onclick="compartirFacebook()" class="boton-social" aria-label="Compartir en Facebook" title="Compartir en Facebook" style="background: #1877F2; color: #ffffff; border: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </button>
          <button type="button" onclick="compartirInstagram()" class="boton-social" aria-label="Compartir en Instagram" title="Compartir en Instagram" style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: #ffffff; border: none; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </button>
          <button type="button" onclick="copiarEnlaceProducto()" class="boton-social" aria-label="Copiar enlace" title="Copiar enlace" style="background: var(--color-fondo); color: var(--color-chocolate); border: 1px solid var(--color-borde); width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Event listener del botón agregar
  document.getElementById('btnAgregarDetalle').addEventListener('click', () => {
    const inputCant = document.getElementById('cantidadDetalle');
    const cantidad = parseInt(inputCant.value) || 1;
    const inputMsg = document.getElementById('mensajePersonalizado');
    const mensaje = inputMsg ? inputMsg.value.trim() : '';
    agregarProductoAlCarrito(producto, cantidad, mensaje);
  });
}

/**
 * Incrementa o decrementa la cantidad en el selector de detalle.
 * @param {number} delta 
 */
function cambiarCantidadDetalle(delta) {
  const input = document.getElementById('cantidadDetalle');
  if (!input) return;
  let val = parseInt(input.value) || 1;
  const min = parseInt(input.min) || 1;
  const max = parseInt(input.max) || 99;
  val += delta;
  if (val >= min && val <= max) {
    input.value = val;
  }
}

/**
 * Agrega un producto directamente desde el botón rápido de la tarjeta.
 * @param {string} id 
 */
function agregarAlCarritoRapido(id) {
  const producto = obtenerProductoPorId(id);
  if (producto) {
    agregarProductoAlCarrito(producto, 1, '');
  }
}

/**
 * Función central para añadir producto al carrito en localStorage con mensaje personalizado.
 * @param {Object} producto 
 * @param {number} cantidad 
 * @param {string} mensaje
 */
function agregarProductoAlCarrito(producto, cantidad, mensaje = '') {
  let carrito = obtenerCarrito();
  const mensajeLimpio = (mensaje || '').trim();
  const cartItemId = mensajeLimpio ? `${producto.id}_${mensajeLimpio}` : producto.id;
  const index = carrito.findIndex(item => (item.cartItemId || item.id) === cartItemId);

  if (index >= 0) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({
      cartItemId: cartItemId,
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      cantidad: cantidad,
      mensaje: mensajeLimpio
    });
  }

  guardarCarrito(carrito);

  if (typeof abrirDrawerCarrito === 'function') {
    abrirDrawerCarrito();
  } else {
    mostrarNotificacion(`¡${producto.nombre} añadido al carrito!`);
  }
}

function compartirWhatsApp(nombreProducto) {
  const url = encodeURIComponent(window.location.href);
  const texto = encodeURIComponent(`¡Mira esta delicia en Pastelería Mil Sabores! ${nombreProducto}: `);
  window.open(`https://api.whatsapp.com/send?text=${texto}${url}`, '_blank');
}

function compartirFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function compartirInstagram() {
  window.open(`https://www.instagram.com`, '_blank');
}

function copiarEnlaceProducto() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    mostrarNotificacion('¡Enlace copiado al portapapeles!');
  }).catch(() => {
    mostrarNotificacion('Enlace listo para compartir.');
  });
}

/**
 * Muestra un mensaje flotante de notificación.
 * @param {string} mensaje 
 */
function mostrarNotificacion(mensaje) {
  let notif = document.getElementById('notificacionFlotante');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificacionFlotante';
    notif.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-chocolate);
      color: #fff;
      padding: 0.85rem 1.5rem;
      border-radius: var(--radio-borde);
      box-shadow: var(--sombra-media);
      z-index: 9999;
      font-weight: bold;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(notif);
  }
  notif.textContent = mensaje;
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.opacity = '0';
  }, 2500);
}
