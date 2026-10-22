import React, { useState } from 'react';
import AlertMessage from '../components/common/AlertMessage';
import { validarTelefonoChileno } from '../services/chileData';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    asunto: 'consulta-general',
    mensaje: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [telefonoTocado, setTelefonoTocado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim() || !emailRegex.test(formData.correo.trim())) {
      setError('Por favor ingresa un correo electrónico válido (ej: usuario@ejemplo.cl).');
      return;
    }

    setTelefonoTocado(true);
    if (!formData.telefono.trim()) {
      setError('Por favor ingresa un número de teléfono o WhatsApp de contacto.');
      return;
    }

    if (!validarTelefonoChileno(formData.telefono)) {
      setError('Por favor ingresa un número de teléfono válido (ej: +56 9 8765 4321 o 987654321, 9 dígitos locales).');
      return;
    }

    if (!formData.mensaje.trim()) {
      setError('Por favor ingresa el mensaje o detalle de tu consulta.');
      return;
    }

    setSubmitted(true);
    setFormData({ nombre: '', correo: '', telefono: '', asunto: 'consulta-general', mensaje: '' });
    setTelefonoTocado(false);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh' }}>
      {/* 1. Hero Banner de Contacto Full Width con la Fotografía Oficial de la Cafetería */}
      <section className="contacto-hero-banner">
        <div className="contenedor">
          <div className="contacto-hero-contenido">
            <span className="contacto-hero-eyebrow">
              Estamos Para Atenderte
            </span>
            <h1 className="contacto-hero-titulo">
              Contáctanos
            </h1>
            <div className="adorno-baker" style={{ margin: '0.6rem 0 1.2rem 0' }} />
            <p className="contacto-hero-desc">
              ¿Tienes dudas sobre pedidos especiales, tortas de celebración o el estado de tu despacho? Escríbenos o visítanos en nuestro taller y nuestro equipo te responderá con prontitud.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Sección de Contacto: Franja Entera Borde a Borde ("Conversemos con un café") */}
      <section className="seccion-contacto-franja-entera">
        <div className="contenedor">
          {/* Encabezado Centrado Estilo Baker */}
          <div className="text-center mb-5">
            <span
              className="d-block mb-2 text-uppercase fw-bold"
              style={{
                fontFamily: 'var(--fuente-texto)',
                fontSize: '0.8rem',
                letterSpacing: '0.16em',
                color: 'var(--color-caramelo)'
              }}
            >
              ESTAMOS PARA TI
            </span>
            <h2
              style={{
                fontFamily: 'var(--fuente-titulos)',
                color: 'var(--color-espresso)',
                fontSize: 'clamp(2.1rem, 3.8vw, 3rem)',
                fontWeight: 700,
                margin: '0 0 0.85rem 0'
              }}
            >
              Conversemos con un café
            </h2>
            <p
              className="mx-auto"
              style={{
                maxWidth: '680px',
                fontSize: '1.02rem',
                lineHeight: 1.6,
                color: 'var(--color-texto-secundario)'
              }}
            >
              ¿Tienes alguna pregunta, pedido especial o simplemente quieres saludarnos? Nos encantará saber de ti.
            </p>
          </div>

          {/* Dos Tarjetas Blancas Principales */}
          <div className="row g-4 justify-content-center">
            {/* Tarjeta 1: Escríbenos */}
            <div className="col-lg-6">
              <div className="tarjeta-contacto-blanca">
                <h3 className="tarjeta-contacto-titulo">
                  Escríbenos
                </h3>

                {submitted && (
                  <AlertMessage
                    message="¡Tu mensaje ha sido enviado con éxito! Nuestro equipo pastelero te contactará a la brevedad."
                    type="success"
                    onClose={() => setSubmitted(false)}
                  />
                )}
                {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                      Tu nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="¿Cómo te llamas?"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--color-borde)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      className="form-control"
                      placeholder="tu@correo.cl"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--color-borde)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      className={`form-control ${telefonoTocado ? (validarTelefonoChileno(formData.telefono) ? 'is-valid' : 'is-invalid') : ''}`}
                      placeholder="+56 9 8765 4321"
                      value={formData.telefono}
                      onChange={handleChange}
                      onBlur={() => setTelefonoTocado(true)}
                      required
                      style={{ borderColor: 'var(--color-borde)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}
                    />
                    {telefonoTocado && formData.telefono && !validarTelefonoChileno(formData.telefono) && (
                      <small className="text-danger d-block mt-1" style={{ fontSize: '0.74rem' }}>
                        Número no válido. Debe tener 9 dígitos locales (ej: +56 9 8765 4321 o 987654321).
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                      ¿En qué podemos ayudarte?
                    </label>
                    <select
                      name="asunto"
                      className="form-select"
                      value={formData.asunto}
                      onChange={handleChange}
                      style={{ borderColor: 'var(--color-borde)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}
                    >
                      <option value="consulta-general">Selecciona un motivo</option>
                      <option value="torta-personalizada">Cotización Torta de Bodas/Eventos</option>
                      <option value="estado-despacho">Estado de Despacho</option>
                      <option value="convenio-empresa">Convenio Empresas o Duoc UC</option>
                      <option value="otro">Otro requerimiento</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                      Tu mensaje
                    </label>
                    <textarea
                      name="mensaje"
                      className="form-control"
                      rows="4"
                      placeholder="Cuéntanos qué necesitas..."
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--color-borde)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}
                    ></textarea>
                  </div>

                  <button type="submit" className="boton-enviar-contacto">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span>Enviar mensaje</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Tarjeta 2: Ven a visitarnos */}
            <div className="col-lg-6">
              <div className="tarjeta-contacto-blanca">
                <h3 className="tarjeta-contacto-titulo">
                  Ven a visitarnos
                </h3>

                {/* Nuestra cafetería */}
                <div className="d-flex gap-3 align-items-start mb-4">
                  <div style={{ color: 'var(--color-caramelo)', marginTop: '2px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-espresso)', margin: '0 0 0.15rem 0' }}>
                      Nuestra cafetería
                    </h4>
                    <p style={{ color: 'var(--color-texto-secundario)', margin: 0, fontSize: '0.92rem' }}>
                      Av. Providencia 1200, Santiago
                    </p>
                  </div>
                </div>

                {/* Horarios */}
                <div className="d-flex gap-3 align-items-start mb-4">
                  <div style={{ color: 'var(--color-caramelo)', marginTop: '2px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-espresso)', margin: '0 0 0.15rem 0' }}>
                      Horarios
                    </h4>
                    <p style={{ color: 'var(--color-texto-secundario)', margin: 0, fontSize: '0.92rem', lineHeight: 1.45 }}>
                      Lun–Sáb: 08:30–20:30<br />
                      Dom: 09:30–18:00
                    </p>
                  </div>
                </div>

                {/* Hablemos por WhatsApp */}
                <div className="mb-4">
                  <div className="d-flex gap-3 align-items-start mb-2">
                    <div style={{ color: 'var(--color-caramelo)', marginTop: '2px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-espresso)', margin: '0 0 0.15rem 0' }}>
                        Hablemos por WhatsApp
                      </h4>
                      <p style={{ color: 'var(--color-texto-secundario)', margin: 0, fontSize: '0.92rem' }}>
                        Atención rápida y personalizada
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/56991234567?text=Hola%20Pastelería%20Mil%20Sabores,%20quisiera%20hacer%20una%20consulta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-visita"
                  >
                    <span>Escribir por WhatsApp</span>
                    <span>↗</span>
                  </a>
                </div>

                {/* Espacio para mapa de ubicación */}
                <div className="caja-mapa-placeholder mt-auto">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                    <line x1="8" y1="2" x2="8" y2="18"></line>
                    <line x1="16" y1="6" x2="16" y2="22"></line>
                  </svg>
                  <span>Espacio para mapa de ubicación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}