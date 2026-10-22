import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AlertMessage from '../components/common/AlertMessage';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.mensaje.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    setError('');
    setSubmitted(true);
    setFormData({ nombre: '', correo: '', telefono: '', asunto: 'consulta-general', mensaje: '' });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>Contacto</li>
          </ol>
        </nav>

        <div className="text-center mb-5">
          <span className="seccion-baker-eyebrow">
            Estamos Para Atenderte
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: 'clamp(2.3rem, 4vw, 3.2rem)' }}>
            Contáctanos
          </h1>
          <div className="adorno-baker" />
          <p className="seccion-baker-desc" style={{ maxWidth: '640px', margin: '0 auto' }}>
            ¿Tienes dudas sobre pedidos especiales, tortas de matrimonio o el estado de tu despacho? Escríbenos y nuestro equipo te responderá con prontitud.
          </p>
        </div>

        <div className="row g-5">
          {/* Formulario */}
          <div className="col-lg-7">
            <div
              className="card shadow-sm border-0 p-4 p-md-5 rounded-3"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}
            >
              <h3 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.6rem' }}>
                Envíanos un Mensaje
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
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Nombre Completo *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="Ej: Laura Morales"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--color-borde)' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Correo Electrónico *</label>
                    <input
                      type="email"
                      name="correo"
                      className="form-control"
                      placeholder="laura@correo.cl"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--color-borde)' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      name="telefono"
                      className="form-control"
                      placeholder="+56 9 8765 4321"
                      value={formData.telefono}
                      onChange={handleChange}
                      style={{ borderColor: 'var(--color-borde)' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Motivo de Contacto</label>
                    <select
                      name="asunto"
                      className="form-select"
                      value={formData.asunto}
                      onChange={handleChange}
                      style={{ borderColor: 'var(--color-borde)' }}
                    >
                      <option value="consulta-general">Consulta General</option>
                      <option value="torta-personalizada">Cotización Torta de Bodas/Eventos</option>
                      <option value="estado-despacho">Estado de Despacho</option>
                      <option value="convenio-empresa">Convenio Empresas o Duoc UC</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Mensaje *</label>
                    <textarea
                      name="mensaje"
                      className="form-control"
                      rows="4"
                      placeholder="Detalla tu consulta o requerimiento especial..."
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      style={{ borderColor: 'var(--color-borde)' }}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="boton boton-primario btn-baker px-4 py-2">
                      <i className="bi bi-send-fill me-2"></i>Enviar Consulta
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Canales y Horarios */}
          <div className="col-lg-5">
            <div
              className="card border-0 p-4 p-md-5 rounded-3 h-100 shadow-sm"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}
            >
              <h3 className="fw-bold mb-4" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.5rem' }}>
                Atención Presencial y Canales
              </h3>

              <div className="d-flex gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#FAF4EC', color: 'var(--color-caramelo)' }}
                >
                  <i className="bi bi-geo-alt-fill fs-5"></i>
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--color-espresso)' }}>Taller y Casa Matriz</strong>
                  <span className="text-muted small">Av. Providencia 1200, Santiago de Chile</span>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#FAF4EC', color: 'var(--color-caramelo)' }}
                >
                  <i className="bi bi-telephone-fill fs-5"></i>
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--color-espresso)' }}>Teléfono Fijo & WhatsApp</strong>
                  <span className="text-muted small">+56 2 2345 6789 / +56 9 9123 4567</span>
                </div>
              </div>

              <div className="d-flex gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#FAF4EC', color: 'var(--color-caramelo)' }}
                >
                  <i className="bi bi-envelope-fill fs-5"></i>
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--color-espresso)' }}>Consultas por Correo</strong>
                  <span className="text-muted small">contacto@milsabores.cl</span>
                </div>
              </div>

              <div className="d-flex gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '48px', height: '48px', backgroundColor: '#FAF4EC', color: 'var(--color-caramelo)' }}
                >
                  <i className="bi bi-clock-fill fs-5"></i>
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--color-espresso)' }}>Horario de Horno & Retiro</strong>
                  <span className="text-muted small">Lunes a Sábado: 08:30 a 20:30 hrs<br />Domingos y Festivos: 09:30 a 14:30 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}