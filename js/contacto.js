const LS_MENSAJES = 'mensajesContacto';
const LIMITE_MENSAJE = 500;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  const textarea = document.getElementById('mensaje');
  const contador = document.getElementById('contadorMensaje');

  if (textarea && contador) {
    textarea.setAttribute('maxlength', LIMITE_MENSAJE);
    contador.textContent = textarea.value.length;
    textarea.addEventListener('input', () => {
      contador.textContent = textarea.value.length;
    });
  }

  if (form) {
    form.addEventListener('submit', manejarEnvioContacto);
  }
});

function manejarEnvioContacto(evento) {
  evento.preventDefault();

  const nombre = document.getElementById('nombreContacto');
  const correo = document.getElementById('correoContacto');
  const asunto = document.getElementById('asunto');
  const mensaje = document.getElementById('mensaje');
  const alerta = document.getElementById('mensajeContacto');

  limpiarErrores(['nombre', 'correoContacto', 'asunto', 'mensaje']);
  alerta.classList.add('oculto');

  let valido = true;

  if (nombre.value.trim().length < 3) {
    marcarInvalido('nombre');
    valido = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim())) {
    marcarInvalido('correoContacto');
    valido = false;
  }

  if (!asunto.value) {
    marcarInvalido('asunto');
    valido = false;
  }

  if (mensaje.value.trim().length < 10) {
    marcarInvalido('mensaje');
    valido = false;
  }

  if (!valido) {
    mostrarAlerta(alerta, 'Revisa los campos marcados en rojo antes de enviar.', 'error');
    return;
  }

  guardarMensaje({
    nombre: nombre.value.trim(),
    correo: correo.value.trim(),
    asunto: asunto.value,
    mensaje: mensaje.value.trim(),
    fecha: new Date().toISOString()
  });

  mostrarAlerta(alerta, '¡Gracias! Tu mensaje fue recibido. Te responderemos pronto.', 'exito');
  document.getElementById('formContacto').reset();
  document.getElementById('contadorMensaje').textContent = '0';
}

function guardarMensaje(datos) {
  let mensajes = [];
  try {
    mensajes = JSON.parse(localStorage.getItem(LS_MENSAJES)) || [];
  } catch {
    mensajes = [];
  }
  mensajes.push(datos);
  localStorage.setItem(LS_MENSAJES, JSON.stringify(mensajes));
}

function marcarInvalido(nombreCampo) {
  const grupo = document.querySelector(`[data-campo="${nombreCampo}"]`);
  if (grupo) grupo.classList.add('invalido');
}

function limpiarErrores(campos) {
  campos.forEach(nombreCampo => {
    const grupo = document.querySelector(`[data-campo="${nombreCampo}"]`);
    if (grupo) grupo.classList.remove('invalido');
  });
}

function mostrarAlerta(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `mensaje-alerta ${tipo}`;
}
