const LS_USUARIOS = 'usuarios';

document.addEventListener('DOMContentLoaded', () => {
  try { pintarNombreSesionAdmin(); } catch (e) { console.error(e); }
  try { aplicarRestriccionesRolAdmin(); } catch (e) { console.error(e); }

  if (document.getElementById('cuerpoTablaProductos')) {
    try { inicializarMantenedorProductos(); } catch (e) { console.error(e); }
  }
  if (document.getElementById('cuerpoTablaUsuarios')) {
    try { inicializarMantenedorUsuarios(); } catch (e) { console.error(e); }
  }

  const botonesCerrar = document.querySelectorAll('#cerrarSesionAdmin, #cerrarSesion');
  botonesCerrar.forEach(btn => {
    if (typeof cerrarSesion === 'function') {
      btn.addEventListener('click', cerrarSesion);
    }
  });
});

function pintarNombreSesionAdmin() {
  const marcador = document.getElementById('rolActualAdmin');
  if (!marcador) return;
  try {
    const sesion = JSON.parse(localStorage.getItem('sesionActiva'));
    if (sesion) {
      const nombre = typeof formatearNombrePropio === 'function' 
        ? formatearNombrePropio(sesion.nombre || sesion.correo || 'Usuario') 
        : (sesion.nombre || 'Usuario');
      const rolLabel = typeof etiquetaRol === 'function' 
        ? etiquetaRol(sesion.rol) 
        : (sesion.rol || '');
      marcador.textContent = `${nombre} — ${rolLabel}`;
    }
  } catch { /* sin sesión, se maneja por login.js */ }
}

function aplicarRestriccionesRolAdmin() {
  const sesion = typeof obtenerSesion === 'function' ? obtenerSesion() : null;
  if (!sesion) return;

  const esVendedor = (sesion.rol || '').toLowerCase() === 'vendedor';

  if (esVendedor) {
    // 1. Cambiar el subtítulo del logo en el header de 'Panel Admin' a 'Panel Vendedor' y su enlace
    const logoSubtexto = document.querySelector('.logo-subtexto');
    if (logoSubtexto) {
      logoSubtexto.textContent = 'Panel Vendedor';
    }
    const logoLink = document.querySelector('a.logo[href="admin-home.html"]');
    if (logoLink) {
      logoLink.href = 'vendedor-home.html';
    }

    // 2. Cambiar el título y enlace de Resumen en la barra lateral a 'Panel Vendedor'
    const rolActualSidebar = document.querySelector('.admin-sidebar .rol-actual');
    if (rolActualSidebar) {
      rolActualSidebar.textContent = 'Panel Vendedor';
    }
    const linkResumen = document.querySelector('.admin-sidebar nav a[href="admin-home.html"]');
    if (linkResumen) {
      linkResumen.href = 'vendedor-home.html';
    }

    // 3. Cambiar el título del documento (browser tab)
    if (document.title.includes('Panel Admin') || document.title.includes('Panel de Administración')) {
      document.title = document.title.replace(/Panel Admin|Panel de Administración/g, 'Panel Vendedor');
    }

    // 4. Eliminar por completo la opción de gestión de usuarios del menú lateral (sidebar)
    const linkUsuarios = document.querySelector('.admin-sidebar nav a[href="admin-usuarios.html"]');
    if (linkUsuarios) {
      linkUsuarios.remove();
    }

    // 5. Eliminar por completo la tarjeta de gestión de usuarios del panel principal
    const tarjetaUsuarios = document.querySelector('a[href="admin-usuarios.html"]')?.closest('div');
    if (tarjetaUsuarios) {
      tarjetaUsuarios.remove();
    }

    // 6. Ajustar la descripción en admin-home.html si existe
    const descripcionHome = document.querySelector('.admin-contenido p.texto-secundario');
    if (descripcionHome && descripcionHome.textContent.includes('usuarios')) {
      descripcionHome.textContent = 'Administra el inventario de productos y configuraciones de la pastelería.';
    }
  }
}

/* ==========================================================================
   MANTENEDOR DE PRODUCTOS
   ========================================================================== */

function inicializarMantenedorProductos() {
  const inputBusqueda = document.getElementById('buscarProducto');
  if (inputBusqueda) inputBusqueda.value = '';

  renderizarTablaProductos();

  document.getElementById('btnNuevoProducto')?.addEventListener('click', () => abrirModalProducto(null));
  document.getElementById('formProducto')?.addEventListener('submit', guardarProducto);
  document.getElementById('cerrarModalProducto')?.addEventListener('click', cerrarModalProducto);
  inputBusqueda?.addEventListener('input', renderizarTablaProductos);
}

function renderizarTablaProductos() {
  const cuerpo = document.getElementById('cuerpoTablaProductos');
  if (!cuerpo) return;

  const inputBusqueda = document.getElementById('buscarProducto');
  const filtro = (inputBusqueda?.value || '').toLowerCase().trim();
  let listaRaw = [];
  try {
    listaRaw = typeof obtenerProductos === 'function' ? obtenerProductos() : [];
  } catch (e) {
    console.error('Error al obtener productos:', e);
    listaRaw = [];
  }

  // Si la lista está vacía y no hay filtro activo, restablecer productos iniciales de respaldo
  if ((!Array.isArray(listaRaw) || listaRaw.length === 0) && filtro === '') {
    if (typeof PRODUCTOS_INICIALES !== 'undefined' && Array.isArray(PRODUCTOS_INICIALES)) {
      listaRaw = PRODUCTOS_INICIALES;
      if (typeof guardarProductos === 'function') guardarProductos(PRODUCTOS_INICIALES);
    }
  }

  let productos = listaRaw.filter(p => {
    if (!p || typeof p !== 'object') return false;
    const cod = String(p.id || p.codigo || '').toLowerCase();
    const nom = String(p.nombre || '').toLowerCase();
    const cat = String(p.categoria || '').toLowerCase();
    return nom.includes(filtro) || cod.includes(filtro) || cat.includes(filtro);
  });

  if (productos.length === 0 && filtro === '' && typeof PRODUCTOS_INICIALES !== 'undefined') {
    productos = PRODUCTOS_INICIALES;
    if (typeof guardarProductos === 'function') guardarProductos(PRODUCTOS_INICIALES);
  }

  if (productos.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="6" class="tabla-vacia">No hay productos que coincidan con la búsqueda.</td></tr>`;
    return;
  }

  cuerpo.innerHTML = productos.map(p => {
    const cod = p.id || p.codigo || 'S/C';
    const nom = p.nombre || 'Sin nombre';
    const cat = p.categoria || 'Sin categoría';
    const prec = Number(p.precio) || 0;
    const stk = Number(p.stock) || 0;

    return `
      <tr>
        <td><strong>${cod}</strong></td>
        <td>${nom}</td>
        <td>${cat}</td>
        <td>$${prec.toLocaleString('es-CL')}</td>
        <td>${etiquetaStock(stk)}</td>
        <td class="acciones-fila">
          <button class="boton-icono" title="Editar" onclick="abrirModalProducto('${cod}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button class="boton-icono eliminar" title="Eliminar" onclick="eliminarProducto('${cod}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function etiquetaStock(stock) {
  if (stock <= 0) return `<span class="etiqueta-stock agotado">Agotado</span>`;
  if (stock <= 5) return `<span class="etiqueta-stock bajo">Stock bajo (${stock})</span>`;
  return `<span class="etiqueta-stock ok">${stock} unidades</span>`;
}

function abrirModalProducto(codigo) {
  const modal = document.getElementById('modalProducto');
  const form = document.getElementById('formProducto');
  if (!modal || !form) return;
  form.reset();
  limpiarErroresFormulario(form);

  if (codigo) {
    const producto = obtenerProductos().find(p => (p.id || p.codigo) === codigo);
    if (producto) {
      form.codigo.value = producto.id || producto.codigo;
      form.codigo.readOnly = true;
      form.nombre.value = producto.nombre;
      form.categoria.value = producto.categoria;
      form.precio.value = producto.precio;
      form.stock.value = producto.stock;
      document.getElementById('tituloModalProducto').textContent = 'Editar producto';
    }
  } else {
    form.codigo.readOnly = false;
    document.getElementById('tituloModalProducto').textContent = 'Nuevo producto';
  }

  modal.classList.add('activo');
}

function cerrarModalProducto() {
  document.getElementById('modalProducto')?.classList.remove('activo');
}

function guardarProducto(evento) {
  evento.preventDefault();
  const form = evento.target;
  limpiarErroresFormulario(form);

  const codigo = form.codigo.value.trim().toUpperCase();
  const nombre = form.nombre.value.trim();
  const categoria = form.categoria.value;
  const precio = Number(form.precio.value);
  const stock = Number(form.stock.value);

  let valido = true;

  if (!/^[A-Z]{2,5}\d{2,4}$/.test(codigo)) {
    marcarCampoInvalido(form.codigo, 'Formato esperado: letras + números, ej. TC001.');
    valido = false;
  }
  if (nombre.length < 3) {
    marcarCampoInvalido(form.nombre, 'El nombre debe tener al menos 3 caracteres.');
    valido = false;
  }
  if (!categoria) {
    marcarCampoInvalido(form.categoria, 'Selecciona una categoría.');
    valido = false;
  }
  if (!(precio > 0)) {
    marcarCampoInvalido(form.precio, 'El precio debe ser mayor a 0.');
    valido = false;
  }
  if (!(stock >= 0)) {
    marcarCampoInvalido(form.stock, 'El stock no puede ser negativo.');
    valido = false;
  }

  if (!valido) return;

  const productos = obtenerProductos();
  const indiceExistente = productos.findIndex(p => (p.id || p.codigo) === codigo);

  if (indiceExistente >= 0) {
    productos[indiceExistente].nombre = nombre;
    productos[indiceExistente].categoria = categoria;
    productos[indiceExistente].precio = precio;
    productos[indiceExistente].stock = stock;
  } else {
    productos.push({
      id: codigo,
      codigo: codigo,
      nombre: nombre,
      categoria: categoria,
      precio: precio,
      stock: stock,
      descripcion: nombre,
      imagen: 'img/torta-tres-leches-cuadrada.png',
      destacado: false
    });
  }

  guardarProductos(productos);
  cerrarModalProducto();
  renderizarTablaProductos();
}

function eliminarProducto(codigo) {
  if (!confirm(`¿Eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) return;
  const productos = obtenerProductos().filter(p => (p.id || p.codigo) !== codigo);
  guardarProductos(productos);
  renderizarTablaProductos();
}

function inicializarMantenedorUsuarios() {
  renderizarTablaUsuarios();

  document.getElementById('btnNuevoUsuario')?.addEventListener('click', () => abrirModalUsuario(null));
  document.getElementById('formUsuario')?.addEventListener('submit', guardarUsuarioAdmin);
  document.getElementById('cerrarModalUsuario')?.addEventListener('click', cerrarModalUsuario);
  document.getElementById('buscarUsuario')?.addEventListener('input', renderizarTablaUsuarios);
}

function obtenerUsuariosAdmin() {
  try { return JSON.parse(localStorage.getItem(LS_USUARIOS)) || []; }
  catch { return []; }
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(LS_USUARIOS, JSON.stringify(lista));
}

function renderizarTablaUsuarios() {
  const cuerpo = document.getElementById('cuerpoTablaUsuarios');
  const filtro = (document.getElementById('buscarUsuario')?.value || '').toLowerCase().trim();
  const usuarios = obtenerUsuariosAdmin().filter(u =>
    u.nombre?.toLowerCase().includes(filtro) || u.correo.toLowerCase().includes(filtro)
  );

  if (usuarios.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="5" class="tabla-vacia">No hay usuarios que coincidan con la búsqueda.</td></tr>`;
    return;
  }

  cuerpo.innerHTML = usuarios.map((u, indice) => `
    <tr>
      <td>${u.nombre || '—'}</td>
      <td>${u.correo}</td>
      <td>${u.run || '—'}</td>
      <td>${capitalizar(u.rol)}</td>
      <td class="acciones-fila">
        <button class="boton-icono" title="Editar" onclick="abrirModalUsuario(${indice})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="boton-icono eliminar" title="Eliminar" onclick="eliminarUsuario(${indice})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function capitalizar(texto) {
  if (!texto) return '—';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function abrirModalUsuario(indice) {
  const modal = document.getElementById('modalUsuario');
  const form = document.getElementById('formUsuario');
  form.reset();
  limpiarErroresFormulario(form);
  form.dataset.indiceEdicion = '';

  if (indice !== null) {
    const usuario = obtenerUsuariosAdmin()[indice];
    if (usuario) {
      form.nombre.value = usuario.nombre || '';
      form.correo.value = usuario.correo;
      form.run.value = usuario.run || '';
      form.rol.value = usuario.rol;
      form.dataset.indiceEdicion = String(indice);
      document.getElementById('tituloModalUsuario').textContent = 'Editar usuario';
    }
  } else {
    document.getElementById('tituloModalUsuario').textContent = 'Nuevo usuario';
  }

  modal.classList.add('activo');
}

function cerrarModalUsuario() {
  document.getElementById('modalUsuario').classList.remove('activo');
}

function guardarUsuarioAdmin(evento) {
  evento.preventDefault();
  const form = evento.target;
  limpiarErroresFormulario(form);

  const nombre = form.nombre.value.trim();
  const correo = form.correo.value.trim().toLowerCase();
  const run = form.run.value.trim().toUpperCase();
  const rol = form.rol.value;

  let valido = true;

  if (nombre.length < 3) {
    marcarCampoInvalido(form.nombre, 'Ingresa el nombre completo.');
    valido = false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    marcarCampoInvalido(form.correo, 'Ingresa un correo válido.');
    valido = false;
  }
  if (run && !/^[0-9K]{7,9}$/.test(run)) {
    marcarCampoInvalido(form.run, 'RUN sin puntos ni guion (7-9 caracteres).');
    valido = false;
  }
  if (!rol) {
    marcarCampoInvalido(form.rol, 'Selecciona un rol.');
    valido = false;
  }

  if (!valido) return;

  const usuarios = obtenerUsuariosAdmin();
  const indiceEdicion = form.dataset.indiceEdicion;
  const registro = {
    ...(indiceEdicion !== '' ? usuarios[Number(indiceEdicion)] : {}),
    nombre, correo, run, rol
  };

  if (indiceEdicion !== '') {
    usuarios[Number(indiceEdicion)] = registro;
  } else {
    if (!registro.clave) registro.clave = 'temporal123';
    usuarios.push(registro);
  }

  guardarUsuariosAdmin(usuarios);
  cerrarModalUsuario();
  renderizarTablaUsuarios();
}

function eliminarUsuario(indice) {
  const usuarios = obtenerUsuariosAdmin();
  const usuario = usuarios[indice];
  if (!usuario) return;
  if (!confirm(`¿Eliminar al usuario ${usuario.correo}?`)) return;
  usuarios.splice(indice, 1);
  guardarUsuariosAdmin(usuarios);
  renderizarTablaUsuarios();
}

function marcarCampoInvalido(input, textoError) {
  const grupo = input.closest('.form-grupo');
  if (!grupo) return;
  grupo.classList.add('invalido');
  const spanError = grupo.querySelector('.form-error');
  if (spanError && textoError) spanError.textContent = textoError;
}

function limpiarErroresFormulario(form) {
  form.querySelectorAll('.form-grupo').forEach(g => g.classList.remove('invalido'));
}
