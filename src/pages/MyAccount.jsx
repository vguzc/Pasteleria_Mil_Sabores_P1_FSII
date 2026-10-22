import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/db';
import ReceiptModal from '../components/admin/ReceiptModal';

export default function MyAccount() {
  const { currentUser, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const myOrders = orderService.getByUserEmail(currentUser.correo);
    setOrders(myOrders);
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Cálculo de edad para beneficio 50+
  let edad = null;
  let esMayor50 = false;
  if (currentUser.fechaNacimiento) {
    const nacimiento = new Date(currentUser.fechaNacimiento);
    const hoy = new Date();
    edad = hoy.getFullYear() - nacimiento.getFullYear();
    esMayor50 = edad >= 50;
  }

  const esDuoc = currentUser.correo.includes('@duoc') || currentUser.correo.includes('@profesor.duoc.cl');

  const copyToClipboard = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 2000);
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>Mi Cuenta</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
              Perfil de Cliente
            </span>
            <h1 className="seccion-baker-titulo" style={{ fontSize: '2.4rem', textAlign: 'left', margin: 0 }}>
              Mi Cuenta
            </h1>
            <p className="text-muted small mb-0 mt-1">Bienvenido/a, {currentUser.nombre} {currentUser.apellidos}</p>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={logout} style={{ fontSize: '0.82rem' }}>
            <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
          </button>
        </div>

        <div className="row g-4">
          {/* Tarjeta de Datos Personales */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                Datos del Perfil
              </h5>
              <div className="small mb-2">
                <span className="text-muted d-block">Nombre Completo:</span>
                <strong style={{ color: 'var(--color-espresso)' }}>{currentUser.nombre} {currentUser.apellidos}</strong>
              </div>
              <div className="small mb-2">
                <span className="text-muted d-block">Correo Electrónico:</span>
                <strong>{currentUser.correo}</strong>
              </div>
              <div className="small mb-2">
                <span className="text-muted d-block">RUT:</span>
                <span>{currentUser.rut || 'No especificado'}</span>
              </div>
              <div className="small mb-2">
                <span className="text-muted d-block">Dirección de Despacho:</span>
                <span>{currentUser.direccion || 'Sin dirección registrada'} {currentUser.departamento || ''}</span>
                <br />
                <small className="text-muted">{currentUser.comuna}, {currentUser.region}</small>
              </div>
            </div>

            {/* Tarjeta de Beneficios y Cupones */}
            <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                <i className="bi bi-stars me-2" style={{ color: 'var(--color-caramelo)' }}></i>Mis Beneficios Exclusivos
              </h5>

              {esMayor50 && (
                <div className="alert py-2 small mb-3" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)' }}>
                  <i className="bi bi-check-circle-fill me-1" style={{ color: 'var(--color-caramelo)' }}></i>
                  <strong>Beneficio 50+ Activo ({edad} años):</strong> 50% de descuento en tus compras con el cupón:
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <code style={{ fontSize: '1rem', color: 'var(--color-caramelo)', fontWeight: 700 }}>FELICES50</code>
                    <button className="btn btn-sm py-0" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF', fontSize: '0.75rem' }} onClick={() => copyToClipboard('FELICES50')}>
                      {copiedCoupon === 'FELICES50' ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              {esDuoc && (
                <div className="alert py-2 small mb-3" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)' }}>
                  <i className="bi bi-mortarboard-fill me-1" style={{ color: 'var(--color-caramelo)' }}></i>
                  <strong>Convenio Duoc UC Activo:</strong> 10% de descuento con el cupón:
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <code style={{ fontSize: '1rem', color: 'var(--color-caramelo)', fontWeight: 700 }}>DUOC10</code>
                    <button className="btn btn-sm py-0" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF', fontSize: '0.75rem' }} onClick={() => copyToClipboard('DUOC10')}>
                      {copiedCoupon === 'DUOC10' ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 rounded small" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                <span className="d-block fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Beneficio Cumpleaños:</span>
                <span className="text-muted d-block" style={{ fontSize: '0.78rem' }}>
                  Durante la semana de tu cumpleaños, presenta tu carnet en nuestro local o comunícate por WhatsApp para recibir tu torta individual de cortesía.
                </span>
              </div>
            </div>
          </div>

          {/* Historial de Compras Personales */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                <i className="bi bi-clock-history me-2" style={{ color: 'var(--color-caramelo)' }}></i>Historial de Mis Compras ({orders.length})
              </h5>

              {orders.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <i className="bi bi-bag-x fs-2 d-block mb-2" style={{ color: 'var(--color-moca)' }}></i>
                  Aún no has realizado compras con esta cuenta.
                  <div className="mt-3">
                    <Link to="/productos" className="boton boton-primario btn-baker">
                      Ver Catálogo de Productos
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-hover small mb-0">
                    <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }}>
                      <tr>
                        <th style={{ color: 'var(--color-espresso)' }}>N° Orden</th>
                        <th style={{ color: 'var(--color-espresso)' }}>Fecha</th>
                        <th style={{ color: 'var(--color-espresso)' }}>Productos</th>
                        <th className="text-end" style={{ color: 'var(--color-espresso)' }}>Total</th>
                        <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Estado</th>
                        <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Boleta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong style={{ color: 'var(--color-espresso)' }}>#{ord.numeroOrden}</strong></td>
                          <td>{new Date(ord.fecha).toLocaleDateString('es-CL')}</td>
                          <td>
                            {ord.items?.map((it, idx) => (
                              <span key={idx} className="badge me-1" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                                {it.cantidad}x {it.nombre}
                              </span>
                            ))}
                          </td>
                          <td className="text-end fw-bold" style={{ color: 'var(--color-caramelo)' }}>{formatPrice(ord.total)}</td>
                          <td className="text-center">
                            <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>{ord.estado}</span>
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary py-0"
                              onClick={() => setSelectedReceipt(ord)}
                            >
                              <i className="bi bi-receipt me-1"></i>Ver
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Boleta */}
        {selectedReceipt && (
          <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
        )}
      </div>
    </div>
  );
}