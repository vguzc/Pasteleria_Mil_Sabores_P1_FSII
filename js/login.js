/* ==========================================================================
   PASTELERÍA MIL SABORES — js/login.js
   Lógica interactiva de inicio de sesión y toggle de contraseña.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const btnToggleClave = document.getElementById('btnToggleClave');
  const claveInput = document.getElementById('claveLogin');
  const iconoMostrar = btnToggleClave ? btnToggleClave.querySelector('.icono-ojo-mostrar') : null;
  const iconoOcultar = btnToggleClave ? btnToggleClave.querySelector('.icono-ojo-ocultar') : null;

  // Toggle de visibilidad de la contraseña
  if (btnToggleClave && claveInput && iconoMostrar && iconoOcultar) {
    btnToggleClave.addEventListener('click', () => {
      const esPassword = claveInput.type === 'password';

      if (esPassword) {
        claveInput.type = 'text';
        iconoMostrar.style.display = 'none';
        iconoOcultar.style.display = 'block';
        btnToggleClave.setAttribute('aria-label', 'Ocultar contraseña');
        btnToggleClave.setAttribute('title', 'Ocultar contraseña');
      } else {
        claveInput.type = 'password';
        iconoMostrar.style.display = 'block';
        iconoOcultar.style.display = 'none';
        btnToggleClave.setAttribute('aria-label', 'Mostrar contraseña');
        btnToggleClave.setAttribute('title', 'Mostrar contraseña');
      }
    });
  }

  // Manejo básico de submit del formulario de login
  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const correo = document.getElementById('correoLogin').value.trim();
      const clave = document.getElementById('claveLogin').value.trim();

      if (!correo || !clave) {
        alert('Por favor completa todos los campos para ingresar.');
        return;
      }

      // Simulación de sesión exitosa
      const usuarioDemo = {
        correo: correo,
        nombre: correo.split('@')[0]
      };

      if (typeof StorageManager !== 'undefined') {
        StorageManager.guardarSesion(usuarioDemo);
      } else {
        localStorage.setItem('usuario_mil_sabores', JSON.stringify(usuarioDemo));
      }

      // Redirección al catálogo/inicio
      window.location.href = 'index.html';
    });
  }
});
