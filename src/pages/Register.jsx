import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { REGIONES_Y_COMUNAS, validarRutChileno } from '../services/chileData';
import AlertMessage from '../components/common/AlertMessage';

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    clave: '',
    confirmClave: '',
    rut: '',
    fechaNacimiento: '',
    direccion: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Santiago'
  });

  const [error, setError] = useState('');
  const [rutValido, setRutValido] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const comunasDisponibles = REGIONES_Y_COMUNAS.find(r => r.region === formData.region)?.comunas || [];

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre' || name === 'apellidos') {
      setFormData(prev => ({ ...prev, [name]: toTitleCase(value) }));
    } else if (name === 'rut') {
      setFormData(prev => ({ ...prev, rut: value }));
      if (value.trim().length >= 8) {
        setRutValido(validarRutChileno(value));
      } else {
        setRutValido(null);
      }
    } else if (name === 'region') {
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
    setError('');

    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.correo.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    if (formData.rut && !validarRutChileno(formData.rut)) {
      setError('El RUT ingresado no es válido (verificación Módulo 11).');
      return;
    }

    if (formData.clave.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.clave !== formData.confirmClave) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Verificar si el correo ya existe
    const existing = userService.getById(formData.correo);
    if (existing) {
      setError('Ya existe una cuenta registrada con este correo electrónico.');
      return;
    }

    // Crear usuario
    const newUser = userService.create({
      nombre: formData.nombre.trim(),
      apellidos: formData.apellidos.trim(),
      correo: formData.correo.trim().toLowerCase(),
      clave: formData.clave,
      rol: 'cliente',
      rut: formData.rut.trim(),
      fechaNacimiento: formData.fechaNacimiento,
      direccion: formData.direccion.trim(),
      departamento: formData.departamento.trim(),
      region: formData.region,
      comuna: formData.comuna
    });

    // Iniciar sesión automática
    login(newUser.correo, newUser.clave);
    navigate('/mi-cuenta');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Crear Cuenta en Mil Sabores
              </h2>
              <p className="text-muted small">Únete a nuestra comunidad y accede a beneficios exclusivos, cupones y seguimiento de pedidos</p>
            </div>

            {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Ej: Juan"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    className="form-control"
                    placeholder="Ej: Pérez González"
                    value={formData.apellidos}
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
                    placeholder="tu.nombre@correo.cl"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">RUT Chileno (con guión y DV) *</label>
                  <div className="input-group">
                    <input
                      type="text"
                      name="rut"
                      className={`form-control ${rutValido === true ? 'is-valid' : rutValido === false ? 'is-invalid' : ''}`}
                      placeholder="12.345.678-9"
                      value={formData.rut}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {rutValido === false && <small className="text-danger">RUT no válido</small>}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    className="form-control"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                  />
                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Si tienes 50 años o más se activará automáticamente tu 50% de descuento.
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Dirección / Calle *</label>
                  <input
                    type="text"
                    name="direccion"
                    className="form-control"
                    placeholder="Av. Providencia 1200"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Departamento / Casa</label>
                  <input
                    type="text"
                    name="departamento"
                    className="form-control"
                    placeholder="Depto 402"
                    value={formData.departamento}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Región *</label>
                  <select
                    name="region"
                    className="form-select"
                    value={formData.region}
                    onChange={handleChange}
                    required
                  >
                    {REGIONES_Y_COMUNAS.map((r, i) => (
                      <option key={i} value={r.region}>{r.region}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold">Comuna *</label>
                  <select
                    name="comuna"
                    className="form-select"
                    value={formData.comuna}
                    onChange={handleChange}
                    required
                  >
                    {comunasDisponibles.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Contraseña *</label>
                  <input
                    type="password"
                    name="clave"
                    className="form-control"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.clave}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Confirmar Contraseña *</label>
                  <input
                    type="password"
                    name="confirmClave"
                    className="form-control"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmClave}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 mt-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="terms" required />
                    <label className="form-check-label small text-muted" htmlFor="terms">
                      Acepto los términos y condiciones del servicio y las políticas de despacho refrigerado de Pastelería Mil Sabores.
                    </label>
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <button type="submit" className="btn btn-primary w-100 py-3 fw-bold shadow-sm">
                    <i className="bi bi-person-check-fill me-2"></i>Registrar mi Cuenta
                  </button>
                </div>
              </div>
            </form>

            <div className="text-center mt-4 small">
              <span className="text-muted">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="fw-bold text-primary text-decoration-none">
                Inicia sesión aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
