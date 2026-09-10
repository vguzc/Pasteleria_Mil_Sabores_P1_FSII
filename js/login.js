const LS_USUARIOS = 'usuarios';
const LS_SESION = 'sesionActiva';
const LS_CORREO_RECORDADO = 'mil_sabores_correo_recordado';

document.addEventListener('DOMContentLoaded', () => {
  sembrarCuentasDemo();
  protegerRutaSiCorresponde();
  configurarToggleClave();
  cargarCorreoRecordado();

  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', manejarEnvioLogin);
  }

  const botonCerrar = document.getElementById('cerrarSesion');
  if (botonCerrar) {
    botonCerrar.addEventListener('click', cerrarSesion);
  }

  pintarEstadoSesionEnHeader();
});

/**
 * Carga el correo guardado previamente si el usuario seleccionó "Recordarme"
 */
function cargarCorreoRecordado() {
  const correoInput = document.getElementById('correoLogin') || document.getElementById('correo');
  const checkboxRecordar = document.getElementById('recordarSesion');
  if (!correoInput || !checkboxRecordar) return;

  const recordado = localStorage.getItem(LS_CORREO_RECORDADO);
  if (recordado) {
    correoInput.value = recordado;
    checkboxRecordar.checked = true;
  }
}

/**
 * Guarda o elimina el correo recordado según el estado del checkbox
 */
function guardarOEliminarCorreoRecordado(correo) {
  const checkboxRecordar = document.getElementById('recordarSesion');
  if (checkboxRecordar && checkboxRecordar.checked) {
    localStorage.setItem(LS_CORREO_RECORDADO, correo);
  } else {
    localStorage.removeItem(LS_CORREO_RECORDADO);
  }
}

/**
 * Toggle de mostrar / ocultar contraseña
 */
function configurarToggleClave() {
  const btnToggleClave = document.getElementById('btnToggleClave');
  const claveInput = document.getElementById('claveLogin') || document.getElementById('clave');
  if (!btnToggleClave || !claveInput) return;

  const iconoMostrar = btnToggleClave.querySelector('.icono-ojo-mostrar');
  const iconoOcultar = btnToggleClave.querySelector('.icono-ojo-ocultar');

  btnToggleClave.addEventListener('click', () => {
    const esPassword = claveInput.type === 'password';

    if (esPassword) {
      claveInput.type = 'text';
      if (iconoMostrar) iconoMostrar.style.display = 'none';
      if (iconoOcultar) iconoOcultar.style.display = 'block';
      btnToggleClave.setAttribute('aria-label', 'Ocultar contraseña');
      btnToggleClave.setAttribute('title', 'Ocultar contraseña');
    } else {
      claveInput.type = 'password';
      if (iconoMostrar) iconoMostrar.style.display = 'block';
      if (iconoOcultar) iconoOcultar.style.display = 'none';
      btnToggleClave.setAttribute('aria-label', 'Mostrar contraseña');
      btnToggleClave.setAttribute('title', 'Mostrar contraseña');
    }
  });
}

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

  const rolSeleccionado = document.querySelector('input[name="rol"]:checked')?.value || 'cliente';
  const correoInput = document.getElementById('correoLogin') || document.getElementById('correo');
  const claveInput = document.getElementById('claveLogin') || document.getElementById('clave');
  const mensaje = document.getElementById('mensajeLogin');

  if (!correoInput || !claveInput) return;

  const correo = correoInput.value.trim().toLowerCase();
  const clave = claveInput.value.trim();

  limpiarErrores();
  if (mensaje) mensaje.classList.add('oculto');

  let valido = true;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    marcarError(correoInput, true, 'Ingresa un correo electrónico válido (ej: usuario@correo.com).');
    valido = false;
  }
  if (clave.length < 4) {
    marcarError(claveInput, true, 'Ingresa una contraseña válida (mínimo 4 caracteres).');
    valido = false;
  }

  if (!valido) {
    if (mensaje) mostrarMensaje(mensaje, 'Por favor corrige los campos remarcados antes de continuar.', 'error');
    return;
  }

  const usuarios = obtenerUsuarios();
  let usuario = usuarios.find(u => u.correo.toLowerCase() === correo && u.clave === clave);

  // Si no está registrado pero es cliente demo
  if (!usuario && rolSeleccionado === 'cliente') {
    usuario = {
      nombre: correo.split('@')[0],
      correo: correo,
      clave: clave,
      rol: 'cliente'
    };
  }

  if (!usuario) {
    marcarError(correoInput, true);
    marcarError(claveInput, true);
    if (mensaje) mostrarMensaje(mensaje, 'Correo o contraseña incorrectos. Intenta nuevamente.', 'error');
    else alert('Correo o contraseña incorrectos.');
    return;
  }

  if (usuario.rol !== rolSeleccionado) {
    if (mensaje) {
      mostrarMensaje(
        mensaje,
        `Esta cuenta está registrada como "${etiquetaRol(usuario.rol)}". Selecciona ese rol para continuar.`,
        'error'
      );
    } else {
      alert(`Esta cuenta está registrada como ${etiquetaRol(usuario.rol)}.`);
    }
    return;
  }

  // Guardar o eliminar el correo recordado
  guardarOEliminarCorreoRecordado(correo);

  iniciarSesion(usuario);

  if (mensaje) mostrarMensaje(mensaje, '¡Sesión iniciada correctamente! Redirigiendo…', 'exito');

  setTimeout(() => {
    window.location.href = destinoSegunRol(usuario.rol);
  }, 600);
}

function iniciarSesion(usuario) {
  const sesion = {
    correo: usuario.correo,
    nombre: usuario.nombre || usuario.correo,
    rol: usuario.rol,
    inicio: new Date().toISOString()
  };
  localStorage.setItem(LS_SESION, JSON.stringify(sesion));
  if (typeof StorageManager !== 'undefined') {
    StorageManager.guardarSesion(sesion);
  }
}

function cerrarSesion(evento) {
  if (evento) evento.preventDefault();
  localStorage.removeItem(LS_SESION);
  if (typeof StorageManager !== 'undefined') {
    StorageManager.cerrarSesion();
  }
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

function marcarError(input, esInvalido, textoError) {
  const grupo = input.closest('.campo-grupo') || input.closest('.form-grupo');
  if (!grupo) return;
  grupo.classList.toggle('invalido', esInvalido);
  const spanError = grupo.querySelector('.form-error, .error-msg');
  if (spanError && textoError && esInvalido) {
    spanError.textContent = textoError;
  }
}

function limpiarErrores() {
  document.querySelectorAll('.campo-grupo, .form-grupo').forEach(g => g.classList.remove('invalido'));
}

function mostrarMensaje(elemento, texto, tipo) {
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.className = `mensaje-alerta ${tipo}`;
  elemento.classList.remove('oculto');
}
