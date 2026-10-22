import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function CheckoutError() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  const handleRetry = () => {
    navigate('/checkout');
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);

  const numeroOrden = orderData?.numeroOrden || '20240705';

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow border-0 p-4 p-md-5 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '12px' }}>
              {/* Encabezado No se pudo realizar el pago */}
              <div className="d-flex align-items-center gap-3 border-bottom pb-4 mb-4" style={{ borderColor: 'var(--color-borde)' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{ width: '52px', height: '52px', backgroundColor: '#B54234' }}
                >
                  <i className="bi bi-x-circle-fill fs-3"></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-0" style={{ fontFamily: 'var(--fuente-titulos)', color: '#B54234', fontSize: '1.8rem' }}>
                    No se pudo procesar el pago #{numeroOrden}
                  </h2>
                  <small className="text-muted">Detalle de compra — Transacción rechazada por la pasarela bancaria</small>
                </div>
              </div>

              {/* Botón para volver a intentar */}
              <div className="text-center my-3">
                <button
                  type="button"
                  className="boton boton-primario btn-baker px-5 py-3 shadow"
                  onClick={handleRetry}
                  style={{ fontSize: '1rem' }}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>Volver a Intentar el Pago
                </button>
              </div>

              {/* Datos del cliente y entrega */}
              <div className="p-4 rounded-3 mb-4" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Datos Registrados</span>
                <div className="row g-2 small">
                  <div className="col-md-4">
                    <strong>Nombre:</strong> {orderData?.cliente?.nombre || 'Pedro'}
                  </div>
                  <div className="col-md-4">
                    <strong>Apellidos:</strong> {orderData?.cliente?.apellidos || 'González'}
                  </div>
                  <div className="col-md-4">
                    <strong>Correo:</strong> {orderData?.cliente?.correo || 'pedro.cliente@example.com'}
                  </div>

                  <div className="col-md-8 mt-2">
                    <strong>Calle:</strong> {orderData?.cliente?.calle || 'Los Crisantemos 450'}
                  </div>
                  <div className="col-md-4 mt-2">
                    <strong>Depto:</strong> {orderData?.cliente?.departamento || 'Depto 603'}
                  </div>

                  <div className="col-md-6 mt-2">
                    <strong>Región:</strong> {orderData?.cliente?.region || 'Región Metropolitana de Santiago'}
                  </div>
                  <div className="col-md-6 mt-2">
                    <strong>Comuna:</strong> {orderData?.cliente?.comuna || 'Cerrillos'}
                  </div>

                  <div className="col-12 mt-2 text-muted">
                    <strong>Indicaciones:</strong> {orderData?.cliente?.indicaciones || 'Dejar en conserjería si no respondo el timbre.'}
                  </div>
                </div>
              </div>

              {/* Desglose de productos */}
              <div className="table-responsive mb-4">
                <table className="table table-sm align-middle">
                  <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }} className="small">
                    <tr>
                      <th style={{ width: '70px', color: 'var(--color-espresso)' }}>Imagen</th>
                      <th style={{ color: 'var(--color-espresso)' }}>Nombre</th>
                      <th className="text-end" style={{ width: '100px', color: 'var(--color-espresso)' }}>Precio</th>
                      <th className="text-center" style={{ width: '80px', color: 'var(--color-espresso)' }}>Cantidad</th>
                      <th className="text-end" style={{ width: '110px', color: 'var(--color-espresso)' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData?.items?.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                        <td>
                          <img
                            src={item.imagen || '/img/torta-mil-sabores.png'}
                            alt={item.nombre}
                            width="48"
                            height="48"
                            className="rounded object-fit-contain"
                            style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/torta-mil-sabores.png';
                            }}
                          />
                        </td>
                        <td className="small fw-semibold" style={{ color: 'var(--color-espresso)' }}>{item.nombre}</td>
                        <td className="text-end small">{formatPrice(item.precio)}</td>
                        <td className="text-center small">{item.cantidad}</td>
                        <td className="text-end small fw-bold" style={{ color: 'var(--color-espresso)' }}>{formatPrice(item.subtotal || item.precio * item.cantidad)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total fallido */}
              <div className="text-center my-3 py-3 rounded-3" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}>
                <h4 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                  Total a pagar: <span style={{ color: '#B54234' }}>{formatPrice(orderData?.total || 28775)}</span>
                </h4>
              </div>

              <div className="text-center mt-4">
                <Link to="/carrito" className="boton boton-secundario btn-baker">
                  ← Modificar productos en la bolsa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}