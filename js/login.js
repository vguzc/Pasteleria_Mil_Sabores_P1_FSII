const LS_USUARIOS = 'usuarios';
const LS_SESION = 'sesionActiva';
const LS_CORREO_RECORDADO = 'mil_sabores_correo_recordado';

document.addEventListener('DOMContentLoaded', () => {
  sembrarCuentasDemo();
  protegerRutaSiCorresponde();
  configurarToggleClave();
  cargarCorreoRecordado();
  configurarModalCambiarClave();

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
  const botonesToggle = document.querySelectorAll('.btn-toggle-clave');
  if (!botonesToggle.length) return;

  botonesToggle.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target') || (document.getElementById('claveLogin') ? 'claveLogin' : 'clave');
      const claveInput = document.getElementById(targetId);
      if (!claveInput) return;

      const iconoMostrar = btn.querySelector('.icono-ojo-mostrar');
      const iconoOcultar = btn.querySelector('.icono-ojo-ocultar');
      const esPassword = claveInput.type === 'password';

      if (esPassword) {
        claveInput.type = 'text';
        if (iconoMostrar) iconoMostrar.style.display = 'none';
        if (iconoOcultar) iconoOcultar.style.display = 'block';
        btn.setAttribute('aria-label', 'Ocultar contraseña');
        btn.setAttribute('title', 'Ocultar contraseña');
      } else {
        claveInput.type = 'password';
        if (iconoMostrar) iconoMostrar.style.display = 'block';
        if (iconoOcultar) iconoOcultar.style.display = 'none';
        btn.setAttribute('aria-label', 'Mostrar contraseña');
        btn.setAttribute('title', 'Mostrar contraseña');
      }
    });
  });
}

function sembrarCuentasDemo() {
  const usuarios = obtenerUsuarios();
  const cuentasDemo = [
    {
      nombre: 'Administradora General',
      correo: 'admin@duoc.cl',
      clave: 'admin123',
      rol: 'administrador'
    },
    {
      nombre: 'Administrador UC',
      correo: 'admin@duocuc.cl',
      clave: 'admin123',
      rol: 'administrador'
    },
    {
      nombre: 'Vendedor Mostrador',
      correo: 'vendedor@milsabores.cl',
      clave: 'venta123',
      rol: 'vendedor'
    }
  ];

  let modificado = false;
  cuentasDemo.forEach(demo => {
    const idx = usuarios.findIndex(u => (u.correo || '').toLowerCase() === demo.correo.toLowerCase());
    if (idx === -1) {
      usuarios.push(demo);
      modificado = true;
    } else {
      if ((usuarios[idx].rol || '').toLowerCase() !== demo.rol) {
        usuarios[idx].rol = demo.rol;
        modificado = true;
      }
      if (!usuarios[idx].clave) {
        usuarios[idx].clave = demo.clave;
        modificado = true;
      }
    }
  });

  if (modificado) {
    guardarUsuarios(usuarios);
  }
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

  try {
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
    const usuarioExistente = usuarios.find(u => (u.correo || '').toLowerCase() === correo);

    if (!usuarioExistente) {
      marcarError(correoInput, true, 'Esta cuenta no existe.');
      if (mensaje) {
        mostrarMensaje(
          mensaje,
          'El correo electrónico ingresado no se encuentra registrado. Por favor verifica tus datos o regístrate para crear una cuenta.',
          'error'
        );
      } else {
        alert('El correo electrónico ingresado no se encuentra registrado. Por favor regístrate.');
      }
      return;
    }

    if (String(usuarioExistente.clave).trim() !== clave) {
      marcarError(claveInput, true, 'Contraseña incorrecta.');
      if (mensaje) {
        mostrarMensaje(mensaje, 'Contraseña incorrecta. Intenta nuevamente.', 'error');
      } else {
        alert('Contraseña incorrecta.');
      }
      return;
    }

    const usuario = usuarioExistente;
    usuario.rol = (usuario.rol || 'cliente').toLowerCase();

    // Guardar o eliminar el correo recordado
    guardarOEliminarCorreoRecordado(correo);

    iniciarSesion(usuario);

    const destino = destinoSegunRol(usuario.rol);

    if (mensaje) {
      mostrarMensaje(
        mensaje,
        `¡Bienvenido(a)! Sesión iniciada como ${etiquetaRol(usuario.rol)}. Redirigiendo…`,
        'exito'
      );
    }

    setTimeout(() => {
      window.location.href = destino;
    }, 150);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Ocurrió un problema al iniciar sesión. Intenta nuevamente.');
  }
}

function iniciarSesion(usuario) {
  const nombreRaw = usuario.nombre || (usuario.correo ? usuario.correo.split('@')[0] : 'Cliente');
  const nombreFormateado = formatearNombrePropio(nombreRaw);
  const apellidosFormateados = formatearNombrePropio(usuario.apellidos || '');
  const sesion = {
    correo: usuario.correo,
    nombre: nombreFormateado,
    apellidos: apellidosFormateados,
    rol: (usuario.rol || 'cliente').toLowerCase(),
    inicio: new Date().toISOString()
  };
  localStorage.setItem(LS_SESION, JSON.stringify(sesion));
  if (typeof StorageManager !== 'undefined' && StorageManager.guardarSesion) {
    StorageManager.guardarSesion(sesion);
  }
}

function formatearNombrePropio(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(p => p ? p.charAt(0).toUpperCase() + p.slice(1) : '')
    .join(' ');
}

function cerrarSesion(evento) {
  if (evento) evento.preventDefault();
  localStorage.removeItem(LS_SESION);
  if (typeof StorageManager !== 'undefined' && StorageManager.cerrarSesion) {
    StorageManager.cerrarSesion();
  }
  window.location.href = 'index.html';
}

function destinoSegunRol(rol) {
  const rolL = (rol || '').toLowerCase();
  switch (rolL) {
    case 'administrador': return 'admin-home.html';
    case 'vendedor': return 'vendedor-home.html';
    default: return 'index.html';
  }
}

function etiquetaRol(rol) {
  const rolL = (rol || '').toLowerCase();
  const etiquetas = { administrador: 'Administrador', vendedor: 'Vendedor', cliente: 'Cliente' };
  return etiquetas[rolL] || rol;
}

function protegerRutaSiCorresponde() {
  const rolesRequeridos = document.body.dataset.requiereRol;
  if (!rolesRequeridos) return;

  const permitidos = rolesRequeridos.split(',').map(r => r.trim().toLowerCase());
  const sesion = obtenerSesion();

  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  const rolActual = (sesion.rol || '').toLowerCase();
  if (!permitidos.includes(rolActual)) {
    window.location.href = destinoSegunRol(rolActual);
  }
}

function pintarEstadoSesionEnHeader() {
  const sesion = obtenerSesion();
  const navAcciones = document.querySelector('.nav-acciones');
  if (!navAcciones) return;

  let userElement = navAcciones.querySelector('.contenedor-usuario-header, a[href="login.html"], a.nav-icono-usuario, a.nav-icono-link:not(.nav-carrito)');
  if (!userElement) return;

  if (sesion && sesion.nombre) {
    const primerNombre = formatearNombrePropio(sesion.nombre.trim().split(' ')[0]);
    const rolL = (sesion.rol || '').toLowerCase();
    const esAdmin = rolL === 'administrador';
    const esVendedor = rolL === 'vendedor';
    const urlPanel = esVendedor ? 'vendedor-home.html' : 'admin-home.html';
    const textoPanel = esVendedor ? 'Panel Vendedor' : (esAdmin ? 'Panel Admin' : '');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div class="contenedor-usuario-header" id="contenedorUsuarioHeader">
        <button type="button" class="btn-usuario-header" id="btnDropdownUsuario" aria-expanded="false" aria-haspopup="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Bienvenido/a ${primerNombre}</span>
          <svg class="icono-flecha" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="menu-desplegable-usuario" id="menuDesplegableUsuario" role="menu">
          <a href="mi-cuenta.html" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mi Cuenta
          </a>
          ${(esAdmin || esVendedor) ? `
          <a href="${urlPanel}" role="menuitem">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            ${textoPanel}
          </a>
          ` : ''}
          <div class="separador-menu"></div>
          <a href="#" id="btnCerrarSesionDropdown" role="menuitem" style="color: var(--color-error, #D32F2F);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </a>
        </div>
      </div>
    `.trim();

    const nuevoContenedor = tempDiv.firstElementChild;
    userElement.replaceWith(nuevoContenedor);

    const btnDropdown = nuevoContenedor.querySelector('#btnDropdownUsuario');
    const btnCerrar = nuevoContenedor.querySelector('#btnCerrarSesionDropdown');

    if (btnDropdown) {
      btnDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        const esActivo = nuevoContenedor.classList.toggle('activo');
        btnDropdown.setAttribute('aria-expanded', esActivo ? 'true' : 'false');
      });
    }

    if (btnCerrar) {
      btnCerrar.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion(e);
      });
    }

    document.addEventListener('click', (e) => {
      if (!nuevoContenedor.contains(e.target)) {
        nuevoContenedor.classList.remove('activo');
        if (btnDropdown) btnDropdown.setAttribute('aria-expanded', 'false');
      }
    });

  } else {
    if (userElement.classList.contains('contenedor-usuario-header')) {
      const aStandard = document.createElement('a');
      aStandard.href = 'login.html';
      aStandard.className = 'nav-icono-link';
      aStandard.setAttribute('aria-label', 'Iniciar sesión');
      aStandard.setAttribute('title', 'Iniciar sesión');
      aStandard.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      `;
      userElement.replaceWith(aStandard);
    }
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

/**
  * Configura la apertura, validación y actualización de contraseña en el modal de recuperación
  */
function configurarModalCambiarClave() {
  const btnOlvidaste = document.getElementById('btnOlvidasteClave');
  const modal = document.getElementById('modalCambiarClave');
  const btnCerrar = document.getElementById('btnCerrarModalClave');
  const btnCancelar = document.getElementById('btnCancelarCambiarClave');
  const formCambiarClave = document.getElementById('formCambiarClave');
  const correoInput = document.getElementById('correoLogin') || document.getElementById('correo');

  if (!modal) return;

  const abrirModal = (e) => {
    if (e) e.preventDefault();
    limpiarErrores();
    const mensaje = document.getElementById('mensajeRecuperar');
    if (mensaje) mensaje.classList.add('oculto');
    if (formCambiarClave) formCambiarClave.reset();

    const correoRecuperar = document.getElementById('correoRecuperar');
    if (correoRecuperar && correoInput && correoInput.value) {
      correoRecuperar.value = correoInput.value.trim();
    }

    modal.classList.add('activo');
  };

  const cerrarModal = () => {
    modal.classList.remove('activo');
  };

  if (btnOlvidaste) btnOlvidaste.addEventListener('click', abrirModal);
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  if (formCambiarClave) {
    formCambiarClave.addEventListener('submit', (e) => {
      e.preventDefault();

      const correoRec = document.getElementById('correoRecuperar');
      const nuevaClave = document.getElementById('nuevaClave');
      const confirmarNuevaClave = document.getElementById('confirmarNuevaClave');
      const mensaje = document.getElementById('mensajeRecuperar');

      if (!correoRec || !nuevaClave || !confirmarNuevaClave) return;

      const correo = correoRec.value.trim().toLowerCase();
      const clave = nuevaClave.value.trim();
      const claveConf = confirmarNuevaClave.value.trim();

      limpiarErrores();
      if (mensaje) mensaje.classList.add('oculto');

      let valido = true;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        marcarError(correoRec, true, 'Ingresa un correo electrónico válido.');
        valido = false;
      }

      if (clave.length < 4) {
        marcarError(nuevaClave, true, 'La contraseña debe tener al menos 4 caracteres.');
        valido = false;
      }

      if (clave !== claveConf) {
        marcarError(confirmarNuevaClave, true, 'Las contraseñas no coinciden.');
        valido = false;
      }

      if (!valido) return;

      const usuarios = obtenerUsuarios();
      const indice = usuarios.findIndex(u => (u.correo || '').toLowerCase() === correo);

      if (indice >= 0) {
        usuarios[indice].clave = clave;
        guardarUsuarios(usuarios);

        if (mensaje) {
          mostrarMensaje(mensaje, '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con tu nueva clave.', 'exito');
        }

        if (correoInput) {
          correoInput.value = correo;
        }

        setTimeout(() => {
          cerrarModal();
          const claveInput = document.getElementById('claveLogin') || document.getElementById('clave');
          if (claveInput) claveInput.focus();
        }, 1300);

      } else {
        marcarError(correoRec, true, 'Esta cuenta no existe.');
        if (mensaje) {
          mostrarMensaje(mensaje, 'No encontramos una cuenta registrada con este correo. Por favor verifica los datos o regístrate para crear una cuenta.', 'error');
        }
      }
    });
  }
}
