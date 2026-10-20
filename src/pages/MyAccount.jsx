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

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Mi Cuenta</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Mi Cuenta
          </h1>
          <p className="text-muted small mb-0">Bienvenido/a, {currentUser.nombre} {currentUser.apellidos}</p>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={logout}>
          <i className="bi bi-box-arrow-right me-1"></i>Cerrar Sesión
        </button>
      </div>

      <div className="row g-4">
        {/* Tarjeta de Datos Personales */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-3 mb-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Datos del Perfil</h5>
            <div className="small mb-2">
              <span className="text-muted d-block">Nombre Completo:</span>
              <strong>{currentUser.nombre} {currentUser.apellidos}</strong>
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
          <div className="card shadow-sm border-0 p-3">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              <i className="bi bi-stars text-warning me-2"></i>Mis Beneficios Exclusivos
            </h5>

            {esMayor50 && (
              <div className="alert alert-success py-2 small mb-3">
                <i className="bi bi-check-circle-fill me-1"></i>
                <strong>Beneficio 50+ Activo ({edad} años):</strong> 50% de descuento en tus compras con el cupón:
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <code>FELICES50</code>
                  <button className="btn btn-sm btn-outline-success py-0" onClick={() => copyToClipboard('FELICES50')}>
                    {copiedCoupon === 'FELICES50' ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            {esDuoc && (
              <div className="alert alert-primary py-2 small mb-3">
                <i className="bi bi-mortarboard-fill me-1"></i>
                <strong>Convenio Duoc UC Activo:</strong> 10% de descuento automático con el cupón:
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <code>DUOC10</code>
                  <button className="btn btn-sm btn-outline-primary py-0" onClick={() => copyToClipboard('DUOC10')}>
                    {copiedCoupon === 'DUOC10' ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            <div className="p-2 bg-light rounded small mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <span>Especial Fiestas Patrias (15% OFF):</span>
                <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => copyToClipboard('ESPECIAL18')}>
                  {copiedCoupon === 'ESPECIAL18' ? '¡Copiado!' : 'ESPECIAL18'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Compras Personales */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              <i className="bi bi-clock-history me-2 text-primary"></i>Historial de Mis Compras ({orders.length})
            </h5>

            {orders.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <i className="bi bi-bag-x fs-2 d-block mb-2"></i>
                Aún no has realizado compras con esta cuenta.
                <div className="mt-2">
                  <Link to="/productos" className="btn btn-primary btn-sm">Ver Productos</Link>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle table-hover small">
                  <thead className="table-light">
                    <tr>
                      <th>N° Orden</th>
                      <th>Fecha</th>
                      <th>Productos</th>
                      <th className="text-end">Total</th>
                      <th className="text-center">Estado</th>
                      <th className="text-center">Boleta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td><strong>#{ord.numeroOrden}</strong></td>
                        <td>{new Date(ord.fecha).toLocaleDateString('es-CL')}</td>
                        <td>
                          {ord.items?.map((it, idx) => (
                            <span key={idx} className="badge bg-light text-dark border me-1">
                              {it.cantidad}x {it.nombre}
                            </span>
                          ))}
                        </td>
                        <td className="text-end fw-bold text-primary">{formatPrice(ord.total)}</td>
                        <td className="text-center">
                          <span className="badge bg-success">{ord.estado}</span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm py-0"
                            onClick={() => setSelectedReceipt(ord)}
                          >
                            <i className="bi bi-receipt"></i> Ver
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
  );
}
