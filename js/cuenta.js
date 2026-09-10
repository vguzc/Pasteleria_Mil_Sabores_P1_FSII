document.addEventListener('DOMContentLoaded', () => {
  const sesion = obtenerSesion();
  if (!sesion) {
    window.location.href = 'login.html';
    return;
  }

  // Cargar usuario completo desde localStorage si existe
  const usuarios = obtenerUsuarios();
  const usuarioCompleto = usuarios.find(u => (u.correo || '').toLowerCase() === sesion.correo.toLowerCase()) || sesion;

  renderizarDatosUsuario(usuarioCompleto);
  renderizarBeneficioEdad(usuarioCompleto);
  renderizarBeneficioCumpleanios(usuarioCompleto);
  renderizarCuponesDisponibles();
});

/**
 * Renderiza los datos personales en la tarjeta de perfil
 */
function renderizarDatosUsuario(usuario) {
  const avatarInicial = document.getElementById('avatarInicial');
  const lblNombre = document.getElementById('lblNombreUsuario');
  const lblCorreo = document.getElementById('lblCorreoUsuario');
  const lblBadgeRol = document.getElementById('lblBadgeRol');

  const nombreF = formatearNombrePropio(usuario.nombre || '');
  const apellidosF = formatearNombrePropio(usuario.apellidos || '');
  const nombreCompleto = (nombreF + ' ' + apellidosF).trim() || (usuario.correo ? usuario.correo.split('@')[0] : 'Cliente');
  
  if (avatarInicial) avatarInicial.textContent = nombreCompleto.charAt(0).toUpperCase();
  if (lblNombre) lblNombre.textContent = nombreCompleto;
  if (lblCorreo) lblCorreo.textContent = usuario.correo || '';
  if (lblBadgeRol) lblBadgeRol.textContent = `Rol: ${etiquetaRol(usuario.rol)}`;

  document.getElementById('valNombre').textContent = nombreCompleto;
  document.getElementById('valRun').textContent = usuario.run || '19.876.543-K';
  document.getElementById('valCorreo').textContent = usuario.correo || '-';
  document.getElementById('valFechaNac').textContent = usuario.fechaNac ? formatearFecha(usuario.fechaNac) : '15/09/1995';
  document.getElementById('valEdad').textContent = usuario.edad !== undefined && usuario.edad !== null ? `${usuario.edad} años` : '30 años';
  document.getElementById('valDireccion').textContent = usuario.direccion || 'Antonio Varas 666';
  document.getElementById('valComunaRegion').textContent = `${usuario.comuna || 'Providencia'}, ${usuario.region || 'Región Metropolitana'}`;
}

/**
 * Renderiza la tarjeta de beneficios por edad (50 años o más)
 */
function renderizarBeneficioEdad(usuario) {
  const contenedor = document.getElementById('contenedorBeneficioEdad');
  if (!contenedor) return;

  const edad = usuario.edad !== undefined && usuario.edad !== null ? usuario.edad : 52;
  const califica50 = edad >= 50;
  const cuponesUsados = usuario.cuponesUsados || [];
  const yaUsoCupon50 = cuponesUsados.includes('FELICES50');

  const iconoCheckSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  const iconoInfoSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

  if (yaUsoCupon50) {
    contenedor.innerHTML = `
      <div style="background: #F5F5F5; border: 1px solid #E0E0E0; border-radius: 12px; padding: 1.25rem;">
        <span class="badge-beneficio warning" style="background: #EEEEEE; color: #616161; border-color: #CCCCCC; margin-bottom: 0.75rem;">
          ${iconoCheckSVG} Beneficio utilizado
        </span>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #616161; line-height: 1.5;">
          Ya has canjeado y utilizado el beneficio del 50% de descuento (código <strong>FELICES50</strong>) en una compra anterior.
        </p>
      </div>
    `;
    return;
  }

  if (califica50) {
    contenedor.innerHTML = `
      <div style="background: #E8F5E9; border: 1px solid #A5D6A7; border-radius: 12px; padding: 1.25rem;">
        <span class="badge-beneficio exito" style="margin-bottom: 0.75rem;">${iconoCheckSVG} 50% de Descuento Activo</span>
        <p style="margin: 0.5rem 0 1rem 0; font-size: 0.95rem; color: #1B5E20; line-height: 1.5;">
          ¡Felicidades! Por tener <strong>${edad} años</strong> (50 años o más), tienes acceso al descuento especial del 50% de nuestro 50° Aniversario.
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
          <span class="codigo-cupon-badge">FELICES50</span>
          <button class="boton boton-primario" onclick="aplicarCuponEnCuenta('FELICES50')" style="padding: 0.45rem 1rem; font-size: 0.88rem;">
            Aplicar al Carrito
          </button>
        </div>
      </div>
    `;
  } else {
    contenedor.innerHTML = `
      <div style="background: #FFF8E1; border: 1px solid #FFE082; border-radius: 12px; padding: 1.25rem;">
        <span class="badge-beneficio warning" style="margin-bottom: 0.75rem;">${iconoInfoSVG} Promoción 50° Aniversario (50+ años)</span>
        <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; color: #E65100; line-height: 1.5;">
          Tienes <strong>${edad} años</strong>. El descuento especial del 50% (código FELICES50) aplica para clientes de 50 años o más.
        </p>
      </div>
    `;
  }
}

/**
 * Calcula si la fecha actual está en la semana del cumpleaños del usuario
 */
function esSemanaCumpleanios(fechaNacStr, simularDemo = false) {
  if (simularDemo) return true;
  if (!fechaNacStr) return true; // Si no hay fecha cargada, permitir demo

  const hoy = new Date();
  const partes = fechaNacStr.split('-');
  if (partes.length < 3) return true;

  const mesCumple = parseInt(partes[1], 10) - 1; // 0-indexed
  const diaCumple = parseInt(partes[2], 10);

  const cumpleEsteAno = new Date(hoy.getFullYear(), mesCumple, diaCumple);

  const inicioSemana = new Date(cumpleEsteAno);
  inicioSemana.setDate(cumpleEsteAno.getDate() - 3);

  const finSemana = new Date(cumpleEsteAno);
  finSemana.setDate(cumpleEsteAno.getDate() + 3);

  return hoy >= inicioSemana && hoy <= finSemana;
}

let modoSimuladoCumple = false;

/**
 * Verifica si un correo pertenece al convenio institucional Duoc UC
 */
function esDominioDuoc(correo) {
  if (!correo) return false;
  const c = correo.toLowerCase();
  return c.endsWith('@duocuc.cl') || c.endsWith('@profesor.duoc.cl') || c.endsWith('@duoc.cl');
}

/**
 * Renderiza el beneficio de Torta Gratis por Cumpleaños
 */
function renderizarBeneficioCumpleanios(usuario) {
  const contenedor = document.getElementById('contenedorBeneficioCumple');
  if (!contenedor) return;

  const esDuoc = esDominioDuoc(usuario.correo);
  const esSemana = esSemanaCumpleanios(usuario.fechaNac, modoSimuladoCumple);
  const iconoRegaloSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -3px; margin-right: 4px;"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`;
  const iconoCalendarSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;

  if (!esDuoc && !modoSimuladoCumple) {
    contenedor.innerHTML = `
      <div style="background: #ffffff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <p style="margin: 0 0 0.5rem 0; font-size: 0.95rem; color: #555; line-height: 1.6;">
          El beneficio de <strong>Torta Gratis de Cumpleaños</strong> es exclusivo para clientes registrados con correo institucional <strong>Convenio Duoc UC</strong> (@duocuc.cl o @profesor.duoc.cl).
        </p>
        <button class="boton boton-secundario" onclick="toggleSimularCumple()" style="font-size: 0.82rem; padding: 0.35rem 0.75rem; margin-top: 0.5rem;">
          ${iconoCalendarSVG} Simular Beneficio Cumpleaños (Modo Demo)
        </button>
      </div>
    `;
    return;
  }

  if (esSemana) {
    contenedor.innerHTML = `
      <div style="background: #ffffff; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(194, 24, 91, 0.08);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <span class="badge-beneficio exito" style="background: #FCE4EC; color: #C2185B; border-color: #F8BBD0; font-size: 0.95rem;">
              ${iconoCalendarSVG} ¡Es tu Semana de Cumpleaños!
            </span>
            <p style="margin: 0.75rem 0 0 0; font-size: 1rem; color: #880E4F; font-weight: 600;">
              Por ser parte de la familia Mil Sabores y convenio Duoc UC, tienes disponible una Torta de Cumpleaños Gratis esta semana.
            </p>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <button class="boton boton-primario" onclick="agregarTortaGratisAlCarrito()" style="background: #C2185B; border-color: #880E4F; padding: 0.65rem 1.4rem; font-size: 0.95rem;">
            ${iconoRegaloSVG} Añadir Torta Gratis al Carrito
          </button>
          <button class="boton boton-secundario" onclick="toggleSimularCumple()" style="font-size: 0.82rem; opacity: 0.8;">
            ${modoSimuladoCumple ? 'Desactivar Modo Demo' : 'Simulación Activa'}
          </button>
        </div>
      </div>
    `;
  } else {
    contenedor.innerHTML = `
      <div style="background: #ffffff; border-radius: 12px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
        <p style="margin: 0 0 1rem 0; font-size: 0.95rem; color: #444; line-height: 1.6;">
          Tu torta gratis de cumpleaños estará disponible para añadir al carrito durante la <strong>semana de tu cumpleaños</strong>.
        </p>
        <button class="boton boton-secundario" onclick="toggleSimularCumple()" style="font-size: 0.85rem; padding: 0.45rem 0.9rem;">
          ${iconoCalendarSVG} Simular Semana de Cumpleaños (Probar Beneficio)
        </button>
      </div>
    `;
  }
}

function toggleSimularCumple() {
  modoSimuladoCumple = !modoSimuladoCumple;
  const sesion = obtenerSesion();
  const usuarios = obtenerUsuarios();
  const usuarioCompleto = usuarios.find(u => (u.correo || '').toLowerCase() === sesion.correo.toLowerCase()) || sesion;
  renderizarBeneficioCumpleanios(usuarioCompleto);
}

/**
 * Añade la torta gratis de cumpleaños al carrito ($0)
 */
function agregarTortaGratisAlCarrito() {
  const carrito = obtenerCarrito();
  
  const idRegalo = 'TC002'; // Torta Cuadrada Mil Sabores
  const existeInCarrito = carrito.find(item => item.id === idRegalo && item.esRegalo);

  if (existeInCarrito) {
    alert('Tu Torta Gratis de Cumpleaños ya se encuentra en el carrito de compras.');
    window.location.href = 'carrito.html';
    return;
  }

  // Agregar torta gratis $0
  carrito.push({
    id: idRegalo,
    nombre: 'Torta Gratis de Cumpleaños (Regalo Mil Sabores)',
    precio: 0,
    precioOriginal: 28990,
    cantidad: 1,
    imagen: 'img/torta-mil-sabores.png',
    esRegalo: true
  });

  guardarCarrito(carrito);
  alert('Se ha añadido la Torta Gratis de Cumpleaños ($0) a tu carrito de compras.');
  window.location.href = 'carrito.html';
}

/**
 * Renderiza la grilla de cupones oficiales disponibles excluyendo los ya usados o no aplicables
 */
function renderizarCuponesDisponibles() {
  const grid = document.getElementById('gridCuponesCuenta');
  if (!grid) return;

  const sesion = obtenerSesion();
  const usuarios = obtenerUsuarios();
  const usuario = sesion ? (usuarios.find(u => (u.correo || '').toLowerCase() === sesion.correo.toLowerCase()) || sesion) : {};
  const cuponesUsados = usuario.cuponesUsados || [];
  const esDuoc = esDominioDuoc(usuario.correo);
  const edad = usuario.edad !== undefined && usuario.edad !== null ? usuario.edad : 30;

  const cuponesBase = [
    { codigo: 'FELICES50', desc: '50% de Descuento por 50 años o más.', descCorta: '50% OFF Aniversario 50 Años', requiereEdad: 50 },
    { codigo: 'DUOC10', desc: '10% de Descuento Convenio Alumnos y Docentes Duoc UC.', descCorta: '10% OFF Convenio Duoc UC', requiereDuoc: true },
    { codigo: 'ESPECIAL18', desc: '15% de Descuento Especial 18 de Septiembre.', descCorta: '15% OFF Especial 18' }
  ];

  // Filtrar cupones disponibles: se eliminan si ya fueron usados o si el usuario no cumple el requisito (Duoc / Edad)
  const cuponesDisponibles = cuponesBase.filter(c => {
    if (cuponesUsados.includes(c.codigo)) return false;
    if (c.requiereDuoc && !esDuoc) return false;
    if (c.requiereEdad && edad < c.requiereEdad) return false;
    return true;
  });

  const iconoCopiarSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  const iconoCarritoSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin-right: 4px;"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`;

  if (cuponesDisponibles.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; background: #FFF9F3; border: 1px dashed var(--color-chocolate-claro); border-radius: 12px; padding: 1.5rem; text-align: center;">
        <p style="margin: 0; color: var(--color-texto); font-size: 0.95rem; font-weight: 500;">
          No tienes cupones disponibles en este momento. ${cuponesUsados.length > 0 ? 'Tus cupones canjeados ya fueron procesados en compras anteriores.' : ''}
        </p>
      </div>
    `;
    return;
  }

  grid.innerHTML = cuponesDisponibles.map(c => `
    <div class="tarjeta-cupon-item">
      <div>
        <span class="codigo-cupon-badge">${c.codigo}</span>
        <h4 style="margin: 0.6rem 0 0.25rem 0; font-size: 1rem; color: var(--color-chocolate);">${c.descCorta}</h4>
        <p style="margin: 0; font-size: 0.85rem; color: var(--color-texto); opacity: 0.85; line-height: 1.4;">${c.desc}</p>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
        <button class="boton boton-secundario" onclick="copiarCodigo('${c.codigo}')" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
          ${iconoCopiarSVG} Copiar
        </button>
        <button class="boton boton-primario" onclick="aplicarCuponEnCuenta('${c.codigo}')" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
          ${iconoCarritoSVG} Aplicar
        </button>
      </div>
    </div>
  `).join('');
}

function copiarCodigo(codigo) {
  navigator.clipboard.writeText(codigo).then(() => {
    alert(`¡Código ${codigo} copiado al portapapeles!`);
  }).catch(() => {
    alert(`Código de cupón: ${codigo}`);
  });
}

function aplicarCuponEnCuenta(codigo) {
  const sesion = obtenerSesion();
  const usuarios = obtenerUsuarios();
  const usuario = sesion ? (usuarios.find(u => (u.correo || '').toLowerCase() === sesion.correo.toLowerCase()) || sesion) : {};
  const cuponesUsados = usuario.cuponesUsados || [];

  if (cuponesUsados.includes(codigo)) {
    alert(`El beneficio "${codigo}" ya fue utilizado en una compra anterior.`);
    return;
  }

  if (typeof CUPONES_VALIDOS !== 'undefined' && CUPONES_VALIDOS[codigo]) {
    guardarCuponAplicado({
      codigo: codigo,
      porcentaje: CUPONES_VALIDOS[codigo].porcentaje,
      nombre: CUPONES_VALIDOS[codigo].nombre
    });
    alert(`¡Cupón ${codigo} aplicado correctamente a tu carrito de compras!`);
    window.location.href = 'carrito.html';
  } else {
    alert(`Cupón ${codigo} no disponible.`);
  }
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const partes = fechaStr.split('-');
  if (partes.length < 3) return fechaStr;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
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
