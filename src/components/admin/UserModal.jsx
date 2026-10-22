import React, { useState, useEffect } from 'react';
import { REGIONES_Y_COMUNAS } from '../../services/chileData';

export default function UserModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    clave: '',
    rol: 'cliente',
    rut: '',
    fechaNacimiento: '',
    direccion: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Santiago'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        correo: user.correo || '',
        clave: user.clave || '',
        rol: user.rol || 'cliente',
        rut: user.rut || '',
        fechaNacimiento: user.fechaNacimiento || '',
        direccion: user.direccion || '',
        departamento: user.departamento || '',
        region: user.region || 'Región Metropolitana de Santiago',
        comuna: user.comuna || 'Santiago'
      });
    }
  }, [user]);

  const comunasDisponibles = REGIONES_Y_COMUNAS.find(r => r.region === formData.region)?.comunas || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'region') {
      const reg = REGIONES_Y_COMUNAS.find(r => r.region === value);
      setFormData(prev => ({
        ...prev,
        region: value,
        comuna: reg?.comunas[0] || ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.correo.trim()) {
      setError('El nombre y correo son obligatorios.');
      return;
    }
    if (!formData.clave || formData.clave.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(32, 22, 16, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header text-white" style={{ backgroundColor: '#201610', borderBottom: '1px solid var(--color-borde)' }}>
              <h5 className="modal-title" style={{ fontFamily: 'var(--fuente-titulos)' }}>
                {user ? 'Editar Cuenta de Usuario' : 'Registrar Nueva Cuenta'}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body p-4" style={{ backgroundColor: '#FAF7F2' }}>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Nombre *</label>
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
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Apellidos *</label>
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

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Correo Electrónico *</label>
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

                <div className="col-md-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Contraseña *</label>
                  <input
                    type="password"
                    name="clave"
                    className="form-control"
                    value={formData.clave}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Rol en el Sistema *</label>
                  <select
                    name="rol"
                    className="form-select"
                    value={formData.rol}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>RUT Chileno</label>
                  <input
                    type="text"
                    name="rut"
                    className="form-control"
                    placeholder="12.345.678-9"
                    value={formData.rut}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    className="form-control"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Dirección / Calle</label>
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
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Depto / Casa</label>
                  <input
                    type="text"
                    name="departamento"
                    className="form-control"
                    value={formData.departamento}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Región</label>
                  <select
                    name="region"
                    className="form-select"
                    value={formData.region}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  >
                    {REGIONES_Y_COMUNAS.map((r, i) => (
                      <option key={i} value={r.region}>{r.region}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Comuna</label>
                  <select
                    name="comuna"
                    className="form-select"
                    value={formData.comuna}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  >
                    {comunasDisponibles.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-borde)' }}>
              <button type="button" className="boton boton-secundario btn-baker" onClick={onClose}>Cancelar</button>
              <button type="submit" className="boton boton-primario btn-baker">Guardar Usuario</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}