import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/db';

export default function CheckoutSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  useEffect(() => {
    if (!order && orderId) {
      const found = orderService.getById(orderId);
      if (found) {
        setOrder(found);
      }
    }
  }, [order, orderId]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSentAlert(true);
    setTimeout(() => setEmailSentAlert(false), 3500);
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm max-w-500 mx-auto">
          <h4>No se encontró la información del pedido</h4>
          <p className="text-muted small">Puede haber expirado la sesión o el número de orden no existe.</p>
          <div>
            <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Alerta de envío de correo */}
      {emailSentAlert && (
        <div className="alert alert-success d-flex align-items-center justify-content-between shadow-sm mb-4">
          <div>
            <i className="bi bi-envelope-check-fill me-2 fs-5"></i>
            ¡Boleta y comprobante de compra enviados exitosamente al correo <strong>{order.cliente?.correo}</strong>!
          </div>
          <button className="btn-close" onClick={() => setEmailSentAlert(false)}></button>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0 p-4 mb-4 printable-area">
            {/* Encabezado Compra Exitosa (Figura 7 de la pauta) */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-check-lg fs-3"></i>
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-success">
                    Se ha realizado la compra. nro #{order.numeroOrden}
                  </h3>
                  <small className="text-muted">¡Gracias por preferir Pastelería Mil Sabores!</small>
                </div>
              </div>
              <div className="text-md-end mt-2 mt-md-0">
                <span className="badge bg-light text-muted border">Código orden: ORDER{order.numeroOrden}</span>
              </div>
            </div>

            {/* Información del cliente */}
            <div className="mb-4">
              <h6 className="fw-bold text-secondary mb-1">Información del cliente</h6>
              <small className="text-muted d-block mb-3">Comprobante de compra y despacho</small>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small text-muted mb-0">Nombre</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.nombre || ''} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted mb-0">Apellidos</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.apellidos || ''} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted mb-0">Correo</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.correo || ''} readOnly />
                </div>
              </div>
            </div>

            {/* Dirección de entrega */}
            <div className="mb-4">
              <h6 className="fw-bold text-secondary mb-1">Dirección de entrega de los productos</h6>
              <div className="row g-3 mt-1">
                <div className="col-md-8">
                  <label className="form-label small text-muted mb-0">Calle</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.direccion || ''} readOnly />
                </div>
                <div className="col-md-4">
                  <label className="form-label small text-muted mb-0">Departamento (opcional)</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.departamento || ''} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted mb-0">Región</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.region || ''} readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label small text-muted mb-0">Comuna</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.comuna || ''} readOnly />
                </div>
                <div className="col-12">
                  <label className="form-label small text-muted mb-0">Indicaciones para la entrega (opcional)</label>
                  <input type="text" className="form-control form-control-sm bg-light" value={order.cliente?.indicaciones || 'Sin indicaciones especiales'} readOnly />
                </div>
              </div>
            </div>

            {/* Lista de productos comprados (Figura 7) */}
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
                  {order.items?.map((item, idx) => (
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

            {/* Total pagado */}
            <div className="text-center my-3 py-2 bg-light rounded-3">
              <h4 className="fw-bold mb-0 text-dark">
                Total pagado: <span className="text-primary">{formatPrice(order.total)}</span>
              </h4>
            </div>

            {/* Acciones: Imprimir boleta en PDF / Enviar boleta por email (Figura 7 de la pauta) */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-3 pt-3 border-top d-print-none">
              <button
                type="button"
                className="btn btn-danger px-4 shadow-sm"
                onClick={handlePrint}
              >
                <i className="bi bi-file-earmark-pdf me-2"></i>Imprimir boleta en PDF
              </button>
              <button
                type="button"
                className="btn btn-outline-primary px-4 shadow-sm"
                onClick={handleSendEmail}
              >
                <i className="bi bi-envelope me-2"></i>Enviar boleta por email
              </button>
              <Link to="/" className="btn btn-secondary px-4">
                <i className="bi bi-house me-2"></i>Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
