import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/common/AlertMessage';

export default function Login() {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(correo, clave);
    if (res.success) {
      if (res.user.rol === 'administrador' || res.user.rol === 'vendedor') {
        navigate('/admin');
      } else {
        navigate(from === '/' ? '/mi-cuenta' : from);
      }
    } else {
      setError(res.message);
    }
  };

  const setDemoCredentials = (email, pass) => {
    setCorreo(email);
    setClave(pass);
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="text-center mb-4">
              <img
                src="/img/logo-icono.png"
                alt="Logo Mil Sabores"
                width="64"
                height="64"
                className="rounded-circle shadow-sm mb-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logo.png';
                }}
              />
              <h2 className="fw-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                Iniciar Sesión
              </h2>
              <p className="text-muted small">Ingresa con tus credenciales de usuario o cuentas de prueba</p>
            </div>

            {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Correo Electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="ejemplo@correo.cl"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="••••••••"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4 small">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
                  <label className="form-check-label text-muted" htmlFor="rememberMe">Recordarme</label>
                </div>
                <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => setError('Para recuperar tu clave contacta a soporte@milsabores.cl')}>
                  ¿Olvidaste tu contraseña?
                </span>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm fw-bold">
                <i className="bi bi-box-arrow-in-right me-2"></i>Entrar
              </button>
            </form>

            {/* Accesos Demo Rápidos (según rúbrica y pauta del docente) */}
            <div className="mt-4 pt-3 border-top">
              <span className="small text-muted d-block text-center mb-2 fw-semibold">
                Cuentas de Prueba para Evaluación:
              </span>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark text-start d-flex justify-content-between align-items-center"
                  onClick={() => setDemoCredentials('admin@duoc.cl', 'admin123')}
                >
                  <span><i className="bi bi-shield-lock-fill text-danger me-2"></i>Admin: <code>admin@duoc.cl</code></span>
                  <span className="badge bg-danger">Panel Total</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark text-start d-flex justify-content-between align-items-center"
                  onClick={() => setDemoCredentials('vendedor@milsabores.cl', 'venta123')}
                >
                  <span><i className="bi bi-person-badge-fill text-warning me-2"></i>Vendedor: <code>vendedor@milsabores.cl</code></span>
                  <span className="badge bg-warning text-dark">Productos</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-dark text-start d-flex justify-content-between align-items-center"
                  onClick={() => setDemoCredentials('prueba1@gmail.com', 'clave123')}
                >
                  <span><i className="bi bi-person-fill text-primary me-2"></i>Cliente: <code>prueba1@gmail.com</code></span>
                  <span className="badge bg-primary">50% Beneficio</span>
                </button>
              </div>
            </div>

            <div className="text-center mt-4 small">
              <span className="text-muted">¿No tienes cuenta? </span>
              <Link to="/registro" className="fw-bold text-primary text-decoration-none">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
