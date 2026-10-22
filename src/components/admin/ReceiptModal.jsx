import React from 'react';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedTotal = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.total);
  const formattedSubtotal = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.subtotal);
  const formattedIva = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.iva);
  const formattedEnvio = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.envio);
  const formattedDescuento = order.descuento ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.descuento) : null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(32, 22, 16, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div className="modal-header text-white" style={{ backgroundColor: '#201610', borderBottom: '1px solid var(--color-borde)' }}>
            <h5 className="modal-title" style={{ fontFamily: 'var(--fuente-titulos)' }}>
              <i className="bi bi-receipt me-2" style={{ color: 'var(--color-caramelo)' }}></i>
              Boleta Electrónica Oficial #{order.numeroOrden}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body p-4" id="boleta-imprimible" style={{ backgroundColor: '#FAF7F2' }}>
            <div className="d-flex justify-content-between border-bottom pb-3 mb-3" style={{ borderColor: 'var(--color-borde)' }}>
              <div>
                <h4 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                  Pastelería Mil Sabores SpA
                </h4>
                <small className="text-muted d-block">R.U.T.: 76.543.210-K</small>
                <small className="text-muted d-block">Giro: Pastelería, Panadería y Repostería Fina de Tradición</small>
                <small className="text-muted d-block">Av. Providencia 1200, Santiago de Chile</small>
              </div>
              <div className="text-end">
                <span className="badge mb-1 text-uppercase" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>{order.estado}</span>
                <div className="small text-muted">Fecha: {new Date(order.fecha).toLocaleDateString('es-CL')}</div>
                <div className="small text-muted">Hora: {new Date(order.fecha).toLocaleTimeString('es-CL')}</div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="p-3 rounded mb-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}>
              <h6 className="fw-bold border-bottom pb-1 mb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                Información del Cliente
              </h6>
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

            {/* Agendamiento y Coordinación */}
            {order.agendamiento && (
              <div className="p-3 rounded mb-3" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}>
                <h6 className="fw-bold border-bottom pb-1 mb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                  Entrega Programada ({order.agendamiento.modalidad === 'retiro' ? 'Retiro en Pastelería' : 'Despacho a Domicilio'})
                </h6>
                <div className="row g-2 small">
                  <div className="col-sm-6">
                    <strong>Fecha:</strong> {order.agendamiento.fecha || 'Inmediato'}
                  </div>
                  <div className="col-sm-6">
                    <strong>Horario:</strong> {order.agendamiento.franjaHoraria === 'manana' ? 'Mañana (10:00 - 13:00 hrs)' : order.agendamiento.franjaHoraria === 'atardecer' ? 'Atardecer (18:00 - 20:30 hrs)' : 'Tarde (14:00 - 18:00 hrs)'}
                  </div>
                  {order.agendamiento.dedicatoria && (
                    <div className="col-12 mt-1">
                      <strong>Dedicatoria en Chocolate / Nota:</strong> <em>"{order.agendamiento.dedicatoria}"</em>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Detalle de Productos */}
            <div className="table-responsive">
              <table className="table table-sm align-middle mb-3 bg-white rounded shadow-sm">
                <thead style={{ backgroundColor: '#F5EFEB' }}>
                  <tr>
                    <th style={{ color: 'var(--color-espresso)' }}>Producto</th>
                    <th className="text-center" style={{ width: '80px', color: 'var(--color-espresso)' }}>Cant.</th>
                    <th className="text-end" style={{ width: '120px', color: 'var(--color-espresso)' }}>P. Unitario</th>
                    <th className="text-end" style={{ width: '120px', color: 'var(--color-espresso)' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="fw-semibold" style={{ color: 'var(--color-espresso)' }}>{item.nombre}</div>
                      </td>
                      <td className="text-center">{item.cantidad}</td>
                      <td className="text-end">
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(item.precio)}
                      </td>
                      <td className="text-end fw-bold" style={{ color: 'var(--color-espresso)' }}>
                        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(item.subtotal || item.precio * item.cantidad)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumen Totales */}
            <div className="row justify-content-end">
              <div className="col-sm-6 col-md-5">
                <ul className="list-group list-group-flush small bg-white rounded p-3 shadow-sm border" style={{ borderColor: 'var(--color-borde)' }}>
                  <li className="list-group-item d-flex justify-content-between px-0 border-0">
                    <span>Subtotal:</span>
                    <strong>{formattedSubtotal}</strong>
                  </li>
                  {order.descuento > 0 && (
                    <li className="list-group-item d-flex justify-content-between px-0 text-danger border-0">
                      <span>Descuento ({order.cupon || 'Promoción'}):</span>
                      <strong>-{formattedDescuento}</strong>
                    </li>
                  )}
                  <li className="list-group-item d-flex justify-content-between px-0 border-0">
                    <span>IVA (19% incluido):</span>
                    <span>{formattedIva}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 border-0">
                    <span>Costo de Despacho:</span>
                    <span>{order.envio === 0 ? <span className="text-success fw-bold">Gratis</span> : formattedEnvio}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 fs-5 fw-bold border-top mt-1 pt-2" style={{ color: 'var(--color-espresso)' }}>
                    <span>Total Pagado:</span>
                    <span style={{ color: 'var(--color-caramelo)' }}>{formattedTotal}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-borde)' }}>
            <button type="button" className="boton boton-secundario btn-baker" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="boton boton-primario btn-baker" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>Imprimir Boleta (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}