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
            🛒 Agregar al Carrito
          </button>
          <a href="productos.html" class="boton boton-secundario" style="padding:0.85rem 1.5rem;">Seguir comprando</a>
        </div>
      </div>
    </div>
  `;

  // Event listener del botón agregar
  document.getElementById('btnAgregarDetalle').addEventListener('click', () => {
    const inputCant = document.getElementById('cantidadDetalle');
    const cantidad = parseInt(inputCant.value) || 1;
    agregarProductoAlCarrito(producto, cantidad);
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
    agregarProductoAlCarrito(producto, 1);
  }
}

/**
 * Función central para añadir producto al carrito en localStorage con alerta visual.
 * @param {Object} producto 
 * @param {number} cantidad 
 */
function agregarProductoAlCarrito(producto, cantidad) {
  let carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === producto.id);

  if (index >= 0) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
  mostrarNotificacion(`¡${producto.nombre} añadido al carrito!`);
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
