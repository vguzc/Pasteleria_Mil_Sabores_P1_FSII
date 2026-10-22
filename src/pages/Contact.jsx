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
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Contacto</li>
        </ol>
      </nav>

      <div className="text-center mb-5">
        <span className="badge bg-primary px-3 py-2 text-uppercase mb-2">Estamos para ayudarte</span>
        <h1 className="fw-bold font-serif display-4 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Contáctanos
        </h1>
        <p className="text-muted max-w-600 mx-auto">
          ¿Tienes dudas sobre eventos especiales, tortas personalizadas o el estado de tu despacho? Escríbenos y te responderemos a la brevedad.
        </p>
      </div>

      <div className="row g-5">
        {/* Formulario */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 rounded-4">
            <h4 className="fw-bold font-serif mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Envíanos un Mensaje
            </h4>

            {submitted && (
              <AlertMessage
                message="¡Tu mensaje ha sido enviado con éxito! Nuestro equipo de atención te contactará a la brevedad."
                type="success"
                onClose={() => setSubmitted(false)}
              />
            )}
            {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Ej: Laura Morales"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Correo Electrónico *</label>
                  <input
                    type="email"
                    name="correo"
                    className="form-control"
                    placeholder="laura@correo.cl"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    name="telefono"
                    className="form-control"
                    placeholder="+56 9 8765 4321"
                    value={formData.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Motivo de Contacto</label>
                  <select
                    name="asunto"
                    className="form-select"
                    value={formData.asunto}
                    onChange={handleChange}
                  >
                    <option value="consulta-general">Consulta General</option>
                    <option value="torta-personalizada">Cotización Torta de Bodas/Eventos</option>
                    <option value="estado-despacho">Estado de Despacho</option>
                    <option value="convenio-empresa">Convenio Empresas o Duoc UC</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">Mensaje *</label>
                  <textarea
                    name="mensaje"
                    className="form-control"
                    rows="4"
                    placeholder="Detalla tu consulta o requerimiento especial..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-bold shadow-sm">
                    <i className="bi bi-send-fill me-2"></i>Enviar Consulta
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Canales y Horarios */}
        <div className="col-lg-5">
          <div className="card bg-light border-0 p-4 rounded-4 h-100">
            <h4 className="fw-bold font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Atención Presencial y Canales
            </h4>

            <div className="d-flex gap-3 mb-4">
              <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-geo-alt-fill fs-5"></i>
              </div>
              <div>
                <strong className="d-block">Taller y Casa Matriz</strong>
                <span className="text-muted small">Av. Providencia 1200, Santiago de Chile</span>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <div className="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-telephone-fill fs-5"></i>
              </div>
              <div>
                <strong className="d-block">Teléfono Fijo & WhatsApp</strong>
                <span className="text-muted small">+56 2 2345 6789 / +56 9 9123 4567</span>
              </div>
            </div>

            <div className="d-flex gap-3 mb-4">
              <div className="bg-info text-white rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-envelope-fill fs-5"></i>
              </div>
              <div>
                <strong className="d-block">Consultas por Correo</strong>
                <span className="text-muted small">contacto@milsabores.cl</span>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="bg-warning text-dark rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-clock-fill fs-5"></i>
              </div>
              <div>
                <strong className="d-block">Horario de Horno & Retiro</strong>
                <span className="text-muted small">Lunes a Sábado: 08:30 a 20:30 hrs<br />Domingos y Festivos: 09:30 a 14:30 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
