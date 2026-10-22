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
              ESTAMOS PARA TI
            </span>
            <h1 className="contacto-hero-titulo">
              Conversemos con un Café
            </h1>
            <div className="adorno-baker" style={{ margin: '0.6rem 0 1.2rem 0' }} />
            <p className="contacto-hero-desc">
              ¿Tienes alguna pregunta, pedido especial o simplemente quieres saludarnos? Nos encantará saber de ti. Escríbenos a través del formulario o visítanos en nuestro taller y cafetería.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Sección de Contacto: Franja Entera Borde a Borde */}
      <section className="seccion-contacto-franja-entera">
        <div className="contenedor">
          <div className="franja-contacto-grid">
            {/* Columna Izquierda: Escríbenos */}
            <div className="franja-contacto-col-escribenos">
              <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.35rem' }}>
                Atención al Cliente
              </span>
              <h2 className="franja-contacto-titulo">
                Escríbenos
              </h2>
              <div className="adorno-baker" style={{ margin: '0.6rem 0 1.25rem 0' }} />
              <p className="franja-contacto-bajada">
                ¿Tienes alguna consulta especial, pedido para eventos o dudas sobre tu despacho? Déjanos tu mensaje y nuestro equipo pastelero te responderá a la brevedad.
              </p>

              {submitted && (
                <AlertMessage
                  message="¡Tu mensaje ha sido enviado con éxito! Nuestro equipo pastelero te contactará a la brevedad."
                  type="success"
                  onClose={() => setSubmitted(false)}
                />
              )}
              {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

              <form onSubmit={handleSubmit} className="formulario-contacto-franja">
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

            {/* Columna Derecha: Ven a visitarnos */}
            <div className="franja-contacto-col-visitanos">
              <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.35rem' }}>
                Punto de Encuentro
              </span>
              <h2 className="franja-contacto-titulo">
                Ven a visitarnos
              </h2>
              <div className="adorno-baker" style={{ margin: '0.6rem 0 1.25rem 0' }} />
              <p className="franja-contacto-bajada">
                Te esperamos en nuestro salón y cafetería en el corazón de Providencia para compartir un momento dulce y disfrutar de café de especialidad.
              </p>

              {/* Nuestra cafetería */}
              <div className="contacto-canal-item mb-4">
                <div className="contacto-canal-icono">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="contacto-canal-titulo">
                    Nuestra cafetería
                  </h4>
                  <p className="contacto-canal-texto">
                    Av. Providencia 1200, Santiago
                  </p>
                </div>
              </div>

              {/* Horarios */}
              <div className="contacto-canal-item mb-4">
                <div className="contacto-canal-icono">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="contacto-canal-titulo">
                    Horarios de Atención
                  </h4>
                  <p className="contacto-canal-texto" style={{ lineHeight: 1.5 }}>
                    Lunes a Sábado: 08:30 – 20:30<br />
                    Domingos y Festivos: 09:30 – 18:00
                  </p>
                </div>
              </div>

              {/* Hablemos por WhatsApp */}
              <div className="contacto-canal-item mb-4">
                <div className="contacto-canal-icono">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </div>
                <div className="w-100">
                  <h4 className="contacto-canal-titulo">
                    Hablemos por WhatsApp
                  </h4>
                  <p className="contacto-canal-texto mb-3">
                    Atención personalizada y respuestas rápidas
                  </p>
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
      </section>
    </div>
  );
}