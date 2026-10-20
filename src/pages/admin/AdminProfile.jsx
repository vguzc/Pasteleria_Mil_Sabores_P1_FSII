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
    <div className="max-w-700">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Mi Perfil Administrativo</h2>
        <p className="text-muted small mb-0">Gestiona tus credenciales de acceso y datos de contacto</p>
      </div>

      {feedback && <AlertMessage message={feedback} type="success" onClose={() => setFeedback('')} />}
      {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

      <div className="card shadow-sm border-0 p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                className="form-control"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-bold">Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                className="form-control"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-8">
              <label className="form-label small fw-bold">Dirección</label>
              <input
                type="text"
                name="direccion"
                className="form-control"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold">Depto / Oficina</label>
              <input
                type="text"
                name="departamento"
                className="form-control"
                value={formData.departamento}
                onChange={handleChange}
              />
            </div>

            <hr className="my-3" />

            <h6 className="fw-bold text-secondary mb-0">Cambiar Contraseña (opcional)</h6>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Nueva Contraseña</label>
              <input
                type="password"
                name="nuevaClave"
                className="form-control"
                placeholder="Dejar en blanco para mantener actual"
                value={formData.nuevaClave}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                name="confirmClave"
                className="form-control"
                placeholder="Repetir nueva contraseña"
                value={formData.confirmClave}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 mt-4 text-end">
              <button type="submit" className="btn btn-primary px-4 shadow-sm">
                <i className="bi bi-save me-2"></i>Actualizar Perfil
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
