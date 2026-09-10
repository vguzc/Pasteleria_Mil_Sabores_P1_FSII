const LS_PRODUCTOS = 'productos';
const LS_USUARIOS = 'usuarios';

document.addEventListener('DOMContentLoaded', () => {
  pintarNombreSesionAdmin();

  if (document.getElementById('cuerpoTablaProductos')) {
    inicializarMantenedorProductos();
  }
  if (document.getElementById('cuerpoTablaUsuarios')) {
    inicializarMantenedorUsuarios();
  }

  const botonCerrar = document.getElementById('cerrarSesionAdmin');
  if (botonCerrar && typeof cerrarSesion === 'function') {
    botonCerrar.addEventListener('click', cerrarSesion);
  }
});

function pintarNombreSesionAdmin() {
  const marcador = document.getElementById('rolActualAdmin');
  if (!marcador) return;
  try {
    const sesion = JSON.parse(localStorage.getItem('sesionActiva'));
    if (sesion) {
      marcador.textContent = `${sesion.nombre} — ${sesion.rol}`;
    }
  } catch { /* sin sesión, se maneja por login.js */ }
}

/* ==========================================================================
   MANTENEDOR DE PRODUCTOS
   Nota: el arreglo base de productos lo puebla Vicho Guzmán en productos.js
   (módulo Tienda). Aquí solo se gestiona la persistencia CRUD sobre
   localStorage["productos"], sembrando datos de ejemplo si está vacío.
   ========================================================================== */

function inicializarMantenedorProductos() {
  sembrarProductosDemo();
  renderizarTablaProductos();

  document.getElementById('btnNuevoProducto')?.addEventListener('click', () => abrirModalProducto(null));
  document.getElementById('formProducto')?.addEventListener('submit', guardarProducto);
  document.getElementById('cerrarModalProducto')?.addEventListener('click', cerrarModalProducto);
  document.getElementById('buscarProducto')?.addEventListener('input', renderizarTablaProductos);
}

function sembrarProductosDemo() {
  const existentes = obtenerProductos();
  if (existentes.length > 0) return;

  guardarProductos([
    { codigo: 'TC001', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Chocolate', precio: 45000, stock: 12 },
    { codigo: 'TT001', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Vainilla', precio: 40000, stock: 8 },
    { codigo: 'PI001', categoria: 'Postres Individuales', nombre: 'Mousse de Chocolate', precio: 5000, stock: 30 },
    { codigo: 'PSA001', categoria: 'Productos Sin Azúcar', nombre: 'Torta Sin Azúcar de Naranja', precio: 48000, stock: 5 },
    { codigo: 'PG001', categoria: 'Productos Sin Gluten', nombre: 'Brownie Sin Gluten', precio: 4000, stock: 0 }
  ]);
}

function obtenerProductos() {
  try { return JSON.parse(localStorage.getItem(LS_PRODUCTOS)) || []; }
  catch { return []; }
}

function guardarProductos(lista) {
  localStorage.setItem(LS_PRODUCTOS, JSON.stringify(lista));
}

function renderizarTablaProductos() {
  const cuerpo = document.getElementById('cuerpoTablaProductos');
  const filtro = (document.getElementById('buscarProducto')?.value || '').toLowerCase().trim();
  const productos = obtenerProductos().filter(p =>
    p.nombre.toLowerCase().includes(filtro) || p.codigo.toLowerCase().includes(filtro)
  );

  if (productos.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="6" class="tabla-vacia">No hay productos que coincidan con la búsqueda.</td></tr>`;
    return;
  }

  cuerpo.innerHTML = productos.map(p => `
    <tr>
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
      <td>${etiquetaStock(p.stock)}</td>
      <td class="acciones-fila">
        <button class="boton-icono" title="Editar" onclick="abrirModalProducto('${p.codigo}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="boton-icono eliminar" title="Eliminar" onclick="eliminarProducto('${p.codigo}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    </tr>
  `).join('');
}

function etiquetaStock(stock) {
  if (stock <= 0) return `<span class="etiqueta-stock agotado">Agotado</span>`;
  if (stock <= 5) return `<span class="etiqueta-stock bajo">Stock bajo (${stock})</span>`;
  return `<span class="etiqueta-stock ok">${stock} unidades</span>`;
}

function abrirModalProducto(codigo) {
  const modal = document.getElementById('modalProducto');
  const form = document.getElementById('formProducto');
  form.reset();
  limpiarErroresFormulario(form);

  if (codigo) {
    const producto = obtenerProductos().find(p => p.codigo === codigo);
    if (producto) {
      form.codigo.value = producto.codigo;
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
  document.getElementById('modalProducto').classList.remove('activo');
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
  const indiceExistente = productos.findIndex(p => p.codigo === codigo);
  const registro = { codigo, nombre, categoria, precio, stock };

  if (indiceExistente >= 0) {
    productos[indiceExistente] = registro;
  } else {
    productos.push(registro);
  }

  guardarProductos(productos);
  cerrarModalProducto();
  renderizarTablaProductos();
}

function eliminarProducto(codigo) {
  if (!confirm(`¿Eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) return;
  const productos = obtenerProductos().filter(p => p.codigo !== codigo);
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
