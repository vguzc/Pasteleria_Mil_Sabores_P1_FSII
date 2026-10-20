import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function CheckoutError() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  const handleRetry = () => {
    navigate('/checkout');
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

  const numeroOrden = orderData?.numeroOrden || '20240705';

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0 p-4 mb-4">
            {/* Encabezado No se pudo realizar el pago (Figura 8 de la pauta) */}
            <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3 text-danger">
              <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-x-circle-fill fs-3"></i>
              </div>
              <div>
                <h3 className="fw-bold mb-0">
                  No se pudo realizar el pago. nro #{numeroOrden}
                </h3>
                <small className="text-muted">Detalle de compra — Transacción rechazada por el emisor bancario</small>
              </div>
            </div>

            {/* Botón grande para volver a intentar (Figura 8) */}
            <div className="text-center my-3">
              <button
                type="button"
                className="btn btn-success btn-lg px-5 py-3 fw-bold text-uppercase shadow"
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-repeat me-2"></i>Volver a realizar el pago
              </button>
            </div>

            {/* Datos del cliente y entrega */}
            <div className="bg-light p-3 rounded mb-4">
              <div className="row g-2 small">
                <div className="col-md-4">
                  <strong>Nombre:</strong> {orderData?.cliente?.nombre || 'pedro'}
                </div>
                <div className="col-md-4">
                  <strong>Apellidos:</strong> {orderData?.cliente?.apellidos || 'hacker'}
                </div>
                <div className="col-md-4">
                  <strong>Correo:</strong> {orderData?.cliente?.correo || 'pedro.hacker20@example.com'}
                </div>

                <div className="col-md-8 mt-2">
                  <strong>Calle:</strong> {orderData?.cliente?.calle || 'Los crisantemos, Edificio Norte'}
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
                  <strong>Indicaciones:</strong> {orderData?.cliente?.indicaciones || 'El martes no estaremos en el depto, pero puede dejárselo con el conserje.'}
                </div>
              </div>
            </div>

            {/* Desglose de productos (Figura 8) */}
            <div className="table-responsive mb-4">
              <table className="table table-sm align-middle">
                <thead className="table-light small">
                  <tr>
                    <th style={{ width: '70px' }}>Imagen</th>
                    <th>Nombre</th>
                    <th className="text-end" style={{ width: '100px' }}>Precio</th>
                    <th className="text-center" style={{ width: '80px' }}>Cantidad</th>
                    <th className="text-end" style={{ width: '110px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData?.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src={item.imagen || '/img/torta-mil-sabores.png'}
                          alt={item.nombre}
                          width="45"
                          height="45"
                          className="rounded object-fit-contain bg-light"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/torta-mil-sabores.png';
                          }}
                        />
                      </td>
                      <td className="small fw-semibold">{item.nombre}</td>
                      <td className="text-end small">{formatPrice(item.precio)}</td>
                      <td className="text-center small">{item.cantidad}</td>
                      <td className="text-end small fw-bold">{formatPrice(item.subtotal || item.precio * item.cantidad)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total fallido */}
            <div className="text-center my-3 py-2 bg-light rounded-3">
              <h4 className="fw-bold mb-0 text-dark">
                Total a pagar: <span className="text-danger">{formatPrice(orderData?.total || 28775)}</span>
              </h4>
            </div>

            <div className="text-center mt-3">
              <Link to="/carrito" className="btn btn-outline-secondary">
                <i className="bi bi-cart me-2"></i>Modificar productos en el carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
