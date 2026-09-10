const LS_USUARIOS = 'usuarios';
const LS_SESION = 'sesionActiva';

document.addEventListener('DOMContentLoaded', () => {
  sembrarCuentasDemo();
  protegerRutaSiCorresponde();

  const form = document.getElementById('formLogin');
  if (form) {
    form.addEventListener('submit', manejarEnvioLogin);
  }

  const botonCerrar = document.getElementById('cerrarSesion');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarSesion);
  }

  pintarEstadoSesionEnHeader();
});

function sembrarCuentasDemo() {
  const usuarios = obtenerUsuarios();
  const yaExisten = usuarios.some(u => u.rol === 'administrador');
  if (yaExisten) return;

  usuarios.push(
    {
      nombre: 'Administradora General',
      correo: 'admin@duoc.cl',
      clave: 'admin123',
      rol: 'administrador'
    },
    {
      nombre: 'Vendedor Mostrador',
      correo: 'vendedor@milsabores.cl',
      clave: 'venta123',
      rol: 'vendedor'
    }
  );
  guardarUsuarios(usuarios);
}

function obtenerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(LS_USUARIOS)) || [];
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(LS_USUARIOS, JSON.stringify(usuarios));
}

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(LS_SESION));
  } catch {
    return null;
  }
}

function manejarEnvioLogin(evento) {
  evento.preventDefault();

  const rolSeleccionado = document.querySelector('input[name="rol"]:checked')?.value;
  const correoInput = document.getElementById('correo');
  const claveInput = document.getElementById('clave');
  const mensaje = document.getElementById('mensajeLogin');

  const correo = correoInput.value.trim().toLowerCase();
  const clave = claveInput.value;

  limpiarErrores();
  mensaje.classList.add('oculto');

  let valido = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    marcarError(correoInput, true);
    valido = false;
  }
  if (clave.length < 4) {
    marcarError(claveInput, true);
    valido = false;
  }

  if (!valido) return;

  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.correo.toLowerCase() === correo && u.clave === clave);

  if (!usuario) {
    mostrarMensaje(mensaje, 'Correo o contraseña incorrectos. Intenta nuevamente.', 'error');
    return;
  }

  if (usuario.rol !== rolSeleccionado) {
    mostrarMensaje(
      mensaje,
      `Esta cuenta está registrada como "${etiquetaRol(usuario.rol)}". Selecciona ese rol para continuar.`,
      'error'
    );
    return;
  }

  iniciarSesion(usuario);

  mostrarMensaje(mensaje, 'Sesión iniciada correctamente. Redirigiendo…', 'exito');

  setTimeout(() => {
    window.location.href = destinoSegunRol(usuario.rol);
  }, 700);
}

function iniciarSesion(usuario) {
  const sesion = {
    correo: usuario.correo,
    nombre: usuario.nombre || usuario.correo,
    rol: usuario.rol,
    inicio: new Date().toISOString()
  };
  localStorage.setItem(LS_SESION, JSON.stringify(sesion));
}

function cerrarSesion(evento) {
  if (evento) evento.preventDefault();
  localStorage.removeItem(LS_SESION);
  window.location.href = 'login.html';
}

function destinoSegunRol(rol) {
  switch (rol) {
    case 'administrador': return 'admin-home.html';
    case 'vendedor': return 'admin-home.html';
    default: return 'index.html';
  }
}

function etiquetaRol(rol) {
  const etiquetas = { administrador: 'Administrador', vendedor: 'Vendedor', cliente: 'Cliente' };
  return etiquetas[rol] || rol;
}

/**
 * Bloquea el acceso a páginas del panel administrativo si no hay una
 * sesión activa con el rol adecuado. Se activa automáticamente en
 * cualquier página que incluya data-requiere-rol en el <body>.
 */
function protegerRutaSiCorresponde() {
  const rolesRequeridos = document.body.dataset.requiereRol;
  if (!rolesRequeridos) return;

  const permitidos = rolesRequeridos.split(',').map(r => r.trim());
  const sesion = obtenerSesion();

  if (!sesion || !permitidos.includes(sesion.rol)) {
    window.location.href = 'login.html';
  }
}

function pintarEstadoSesionEnHeader() {
  const sesion = obtenerSesion();
  const marcador = document.getElementById('nombreUsuarioSesion');
  if (marcador && sesion) {
    marcador.textContent = `${sesion.nombre} (${etiquetaRol(sesion.rol)})`;
  }
}

function marcarError(input, esInvalido) {
  const grupo = input.closest('.form-grupo');
  if (!grupo) return;
  grupo.classList.toggle('invalido', esInvalido);
}

function limpiarErrores() {
  document.querySelectorAll('.form-grupo').forEach(g => g.classList.remove('invalido'));
}

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensaje-alerta ${tipo}`;
}
