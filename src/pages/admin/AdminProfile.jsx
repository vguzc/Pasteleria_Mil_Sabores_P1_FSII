import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AlertMessage from '../../components/common/AlertMessage';

export default function AdminProfile() {
  const { currentUser, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    nombre: currentUser?.nombre || '',
    apellidos: currentUser?.apellidos || '',
    correo: currentUser?.correo || '',
    direccion: currentUser?.direccion || '',
    departamento: currentUser?.departamento || '',
    nuevaClave: '',
    confirmClave: ''
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setFeedback('');

    if (formData.nuevaClave && formData.nuevaClave !== formData.confirmClave) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    const updates = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      correo: formData.correo,
      direccion: formData.direccion,
      departamento: formData.departamento
    };

    if (formData.nuevaClave) {
      updates.clave = formData.nuevaClave;
    }

    updateUser(updates);
    setFeedback('¡Perfil administrativo actualizado con éxito!');
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      <div className="mb-4">
        <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
          Seguridad & Credenciales
        </span>
        <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
          Mi Perfil Administrativo
        </h1>
        <p className="text-muted small mb-0 mt-1">Gestiona tus credenciales de acceso y datos de contacto oficiales</p>
      </div>

      {feedback && <AlertMessage message={feedback} type="success" onClose={() => setFeedback('')} />}
      {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

      <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Apellidos</label>
              <input
                type="text"
                name="apellidos"
                className="form-control"
                value={formData.apellidos}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                className="form-control"
                value={formData.correo}
                onChange={handleChange}
                required
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <div className="col-md-8">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Dirección</label>
              <input
                type="text"
                name="direccion"
                className="form-control"
                value={formData.direccion}
                onChange={handleChange}
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Depto / Oficina</label>
              <input
                type="text"
                name="departamento"
                className="form-control"
                value={formData.departamento}
                onChange={handleChange}
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <hr className="my-3" style={{ borderColor: 'var(--color-borde)' }} />

            <h6 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
              Cambiar Contraseña (opcional)
            </h6>

            <div className="col-md-6">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Nueva Contraseña</label>
              <input
                type="password"
                name="nuevaClave"
                className="form-control"
                placeholder="Dejar en blanco para mantener actual"
                value={formData.nuevaClave}
                onChange={handleChange}
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmClave"
                className="form-control"
                placeholder="Repetir nueva contraseña"
                value={formData.confirmClave}
                onChange={handleChange}
                style={{ borderColor: 'var(--color-borde)' }}
              />
            </div>

            <div className="col-12 mt-4 text-end">
              <button type="submit" className="boton boton-primario btn-baker">
                <i className="bi bi-save me-2"></i>Actualizar Perfil
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}