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
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '4rem 1rem 6rem 1rem' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div
              className="card shadow-lg border-0 p-4 p-md-5"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid var(--color-borde)',
                boxShadow: '0 8px 30px rgba(44, 30, 22, 0.08)'
              }}
            >
              <div className="text-center mb-4">
                <Link to="/" aria-label="Ir al inicio">
                  <img
                    src="img/logo-ms.png"
                    alt="Logo Mil Sabores"
                    width="68"
                    height="68"
                    className="mb-2 object-fit-contain"
                  />
                </Link>
                <span className="seccion-baker-eyebrow d-block mt-2">Pastelería & Café</span>
                <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', margin: '0.2rem 0' }}>
                  Iniciar Sesión
                </h1>
                <p className="text-muted small">Ingresa con tus credenciales de usuario o cuentas de prueba</p>
              </div>

              {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Correo Electrónico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white" style={{ borderColor: 'var(--color-borde)' }}>
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="ejemplo@correo.cl"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      style={{ borderColor: 'var(--color-borde)' }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white" style={{ borderColor: 'var(--color-borde)' }}>
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      placeholder="••••••••"
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      required
                      style={{ borderColor: 'var(--color-borde)' }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                      style={{ borderColor: 'var(--color-borde)' }}
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
                  <span
                    style={{ cursor: 'pointer', color: 'var(--color-caramelo)', fontWeight: 600 }}
                    onClick={() => setError('Para recuperar tu clave contacta a soporte@milsabores.cl')}
                  >
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>

                <button type="submit" className="boton boton-primario btn-baker w-100 py-3 shadow-sm">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Entrar a Mi Cuenta
                </button>
              </form>

              {/* Accesos Demo Rápidos */}
              <div className="mt-4 pt-3 border-top" style={{ borderColor: 'var(--color-borde)' }}>
                <span className="small text-muted d-block text-center mb-2 fw-semibold">
                  Cuentas de Acceso Rápido para Evaluación:
                </span>
                <div className="d-flex flex-column gap-2">
                  <button
                    type="button"
                    className="btn btn-sm text-start d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)', color: 'var(--color-espresso)' }}
                    onClick={() => setDemoCredentials('admin@duoc.cl', 'admin123')}
                  >
                    <span><i className="bi bi-shield-lock-fill me-2" style={{ color: '#B54234' }}></i>Admin: <code>admin@duoc.cl</code></span>
                    <span className="badge" style={{ backgroundColor: '#B54234', color: '#FFFFFF' }}>Panel Total</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm text-start d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)', color: 'var(--color-espresso)' }}
                    onClick={() => setDemoCredentials('vendedor@milsabores.cl', 'venta123')}
                  >
                    <span><i className="bi bi-person-badge-fill me-2" style={{ color: 'var(--color-caramelo)' }}></i>Vendedor: <code>vendedor@milsabores.cl</code></span>
                    <span className="badge" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF' }}>Inventario</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm text-start d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)', color: 'var(--color-espresso)' }}
                    onClick={() => setDemoCredentials('prueba1@gmail.com', 'clave123')}
                  >
                    <span><i className="bi bi-person-fill me-2" style={{ color: 'var(--color-moca)' }}></i>Cliente: <code>prueba1@gmail.com</code></span>
                    <span className="badge" style={{ backgroundColor: 'var(--color-espresso)', color: '#FFFFFF' }}>50% Beneficio</span>
                  </button>
                </div>
              </div>

              <div className="text-center mt-4 small">
                <span className="text-muted">¿Aún no tienes cuenta? </span>
                <Link to="/registro" className="fw-bold text-decoration-none" style={{ color: 'var(--color-caramelo)' }}>
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}