import React from 'react';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedTotal = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total);
  const formattedSubtotal = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.subtotal);
  const formattedIva = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.iva);
  const formattedEnvio = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.envio);
  const formattedDescuento = order.descuento ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.descuento) : null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="bi bi-receipt me-2"></i>Boleta Electrónica #{order.numeroOrden}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body p-4" id="boleta-imprimible">
            <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
              <div>
                <h4 className="fw-bold mb-0 text-primary">Pastelería Mil Sabores SpA</h4>
                <small className="text-muted d-block">R.U.T.: 76.543.210-K</small>
                <small className="text-muted d-block">Giro: Pastelería, Panadería y Repostería Fina</small>
                <small className="text-muted d-block">Av. Providencia 1200, Santiago</small>
              </div>
              <div className="text-end">
                <span className="badge bg-success fs-6 mb-1">{order.estado}</span>
                <div className="small text-muted">Fecha: {new Date(order.fecha).toLocaleDateString('es-CL')}</div>
                <div className="small text-muted">Hora: {new Date(order.fecha).toLocaleTimeString('es-CL')}</div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="bg-light p-3 rounded mb-3">
              <h6 className="fw-bold text-dark border-bottom pb-1 mb-2">Información del Cliente</h6>
              <div className="row g-2 small">
                <div className="col-sm-6">
                  <strong>Nombre:</strong> {order.cliente?.nombre} {order.cliente?.apellidos}
                </div>
                <div className="col-sm-6">
                  <strong>Email:</strong> {order.cliente?.correo}
                </div>
                <div className="col-sm-6">
                  <strong>Dirección:</strong> {order.cliente?.direccion} {order.cliente?.departamento || ''}
                </div>
                <div className="col-sm-6">
                  <strong>Comuna / Región:</strong> {order.cliente?.comuna}, {order.cliente?.region}
                </div>
                {order.cliente?.indicaciones && (
                  <div className="col-12 text-muted">
                    <strong>Indicaciones:</strong> {order.cliente.indicaciones}
                  </div>
                )}
              </div>
            </div>

            {/* Detalle de Productos */}
            <table className="table table-sm table-bordered align-middle mb-3">
              <thead className="table-light">
                <tr>
                  <th>Producto</th>
                  <th className="text-center" style={{ width: '80px' }}>Cant.</th>
                  <th className="text-end" style={{ width: '110px' }}>P. Unitario</th>
                  <th className="text-end" style={{ width: '110px' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="fw-semibold">{item.nombre}</div>
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.precio)}
                    </td>
                    <td className="text-end fw-bold">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.subtotal || item.precio * item.cantidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Resumen Totales */}
            <div className="row justify-content-end">
              <div className="col-sm-6 col-md-5">
                <ul className="list-group list-group-flush small">
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Subtotal:</span>
                    <strong>{formattedSubtotal}</strong>
                  </li>
                  {order.descuento > 0 && (
                    <li className="list-group-item d-flex justify-content-between px-0 text-danger">
                      <span>Descuento ({order.cupon || 'Promoción'}):</span>
                      <strong>-{formattedDescuento}</strong>
                    </li>
                  )}
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>IVA (19% incluido):</span>
                    <span>{formattedIva}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span>Costo de Despacho:</span>
                    <span>{order.envio === 0 ? <span className="text-success fw-bold">Gratis</span> : formattedEnvio}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 fs-5 fw-bold border-top">
                    <span>Total Pagado:</span>
                    <span className="text-primary">{formattedTotal}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>Imprimir Boleta (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
