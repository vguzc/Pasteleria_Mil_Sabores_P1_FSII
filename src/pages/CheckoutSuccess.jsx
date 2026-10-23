import React, { useState, useEffect } from 'react';
import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/db';
import BoletaOficial from '../components/common/BoletaOficial';

export default function CheckoutSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [emailSentAlert, setEmailSentAlert] = useState(false);
  const [vista, setVista] = useState('resumen'); // 'resumen' | 'boleta'

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

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val || 0);

  if (!order) {
    return (
      <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '60vh', padding: '5rem 1rem' }} className="text-center">
        <div className="card p-5 border-0 shadow-sm mx-auto" style={{ maxWidth: '500px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
          <h4 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>No se encontró la información del pedido</h4>
          <p className="text-muted small">Puede haber expirado la sesión o el número de orden no existe.</p>
          <div>
            <Link to="/" className="boton boton-primario btn-baker">Volver a la tienda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Vista de Pantalla (Oculta al imprimir o generar PDF) */}
      <div
        className="checkout-success-pantalla"
        style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}
      >
        <div className="contenedor">
          {/* Alerta de envío de correo */}
          {emailSentAlert && (
            <div
              className="alert d-flex align-items-center justify-content-between shadow-sm mb-4"
              style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)', borderRadius: '8px' }}
            >
              <div>
                <i className="bi bi-envelope-check-fill me-2 fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                ¡Boleta oficial y comprobante enviados exitosamente al correo <strong>{order.cliente?.correo}</strong>!
              </div>
              <button className="btn-close" onClick={() => setEmailSentAlert(false)}></button>
            </div>
          )}

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div
                className="card shadow border-0 p-4 p-md-5 mb-4"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '12px' }}
              >
                {/* Encabezado Compra Exitosa */}
                <div
                  className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom pb-4 mb-4 gap-3"
                  style={{ borderColor: 'var(--color-borde)' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{ width: '52px', height: '52px', backgroundColor: '#2D6A4F' }}
                    >
                      <i className="bi bi-check-lg fs-3"></i>
                    </div>
                    <div>
                      <h2 className="fw-bold mb-0" style={{ fontFamily: 'var(--fuente-titulos)', color: '#2D6A4F', fontSize: '1.8rem' }}>
                        ¡Compra realizada con éxito! #{order.numeroOrden}
                      </h2>
                      <small className="text-muted">¡Gracias por preferir Pastelería Mil Sabores! Estamos horneando tu pedido.</small>
                    </div>
                  </div>
                  <div className="text-md-end">
                    <span className="badge" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                      Código orden: ORDER{order.numeroOrden}
                    </span>
                  </div>
                </div>

                {/* Selector de Vista: Resumen vs Boleta Oficial */}
                <div className="d-flex justify-content-center gap-2 mb-4 d-print-none">
                  <button
                    type="button"
                    className={`btn btn-sm ${vista === 'resumen' ? 'btn-baker' : 'btn-outline-secondary'}`}
                    style={{
                      borderRadius: '20px',
                      padding: '0.4rem 1.2rem',
                      fontWeight: 600,
                      backgroundColor: vista === 'resumen' ? 'var(--color-espresso)' : 'transparent',
                      color: vista === 'resumen' ? '#FFFFFF' : 'var(--color-espresso)',
                      borderColor: 'var(--color-espresso)'
                    }}
                    onClick={() => setVista('resumen')}
                  >
                    <i className="bi bi-card-checklist me-1"></i>Resumen del Pedido
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${vista === 'boleta' ? 'btn-baker' : 'btn-outline-secondary'}`}
                    style={{
                      borderRadius: '20px',
                      padding: '0.4rem 1.2rem',
                      fontWeight: 600,
                      backgroundColor: vista === 'boleta' ? 'var(--color-espresso)' : 'transparent',
                      color: vista === 'boleta' ? '#FFFFFF' : 'var(--color-espresso)',
                      borderColor: 'var(--color-espresso)'
                    }}
                    onClick={() => setVista('boleta')}
                  >
                    <i className="bi bi-receipt me-1"></i>Vista Boleta Oficial SII
                  </button>
                </div>

                {/* Contenido según la pestaña seleccionada */}
                {vista === 'boleta' ? (
                  <div className="mb-4">
                    <BoletaOficial order={order} />
                  </div>
                ) : (
                  <>
                    {/* Información del cliente */}
                    <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                      <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Datos del Comprobante</span>
                      <h5 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
                        Información del Cliente
                      </h5>

                      <div className="row g-3">
                        <div className="col-md-4">
                          <span className="text-muted small d-block">Nombre</span>
                          <strong className="text-dark">{order.cliente?.nombre || '-'}</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted small d-block">Apellidos</span>
                          <strong className="text-dark">{order.cliente?.apellidos || '-'}</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted small d-block">Correo Electrónico</span>
                          <strong className="text-dark">{order.cliente?.correo || '-'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Programación de Entrega o Retiro */}
                    <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                      <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Coordinación Pastelera</span>
                      <h5 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
                        {order.agendamiento?.modalidad === 'retiro' ? 'Retiro en Pastelería Mil Sabores' : 'Despacho Programado a Domicilio'}
                      </h5>
                      <div className="row g-3 small">
                        <div className="col-md-4">
                          <span className="text-muted d-block">Modalidad:</span>
                          <strong>{order.agendamiento?.modalidad === 'retiro' ? 'Retiro en Taller (Av. Providencia 1200)' : 'Despacho a Domicilio'}</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted d-block">Fecha Programada:</span>
                          <strong>{order.agendamiento?.fecha || new Date(order.fecha).toLocaleDateString('es-CL')}</strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted d-block">Bloque Horario:</span>
                          <strong className="text-capitalize">
                            {order.agendamiento?.franjaHoraria === 'manana'
                              ? 'Mañana (10:00 - 13:00 hrs)'
                              : order.agendamiento?.franjaHoraria === 'atardecer'
                                ? 'Atardecer (18:00 - 20:30 hrs)'
                                : 'Tarde (14:00 - 18:00 hrs)'}
                          </strong>
                        </div>
                        {order.agendamiento?.dedicatoria && (
                          <div className="col-12 mt-2 pt-2 border-top" style={{ borderColor: 'var(--color-borde)' }}>
                            <span className="text-muted d-block">Dedicatoria en Placa de Chocolate / Nota:</span>
                            <em className="text-dark">"{order.agendamiento.dedicatoria}"</em>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dirección de entrega */}
                    <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                      <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
                        {order.agendamiento?.modalidad === 'retiro' ? 'Retiro en Taller' : 'Despacho a Domicilio'}
                      </span>
                      <h5 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
                        {order.agendamiento?.modalidad === 'retiro' ? 'Punto de Retiro Seleccionado' : 'Dirección de Entrega'}
                      </h5>
                      <div className="row g-3">
                        <div className="col-md-8">
                          <span className="text-muted small d-block">
                            {order.agendamiento?.modalidad === 'retiro' ? 'Punto de Retiro' : 'Calle y Número'}
                          </span>
                          <strong className="text-dark">
                            {order.agendamiento?.modalidad === 'retiro' ? 'Av. Providencia 1200 (Metro Manuel Montt)' : (order.cliente?.direccion || '-')}
                          </strong>
                        </div>
                        <div className="col-md-4">
                          <span className="text-muted small d-block">Depto / Casa</span>
                          <span className="text-dark">{order.cliente?.departamento || '-'}</span>
                        </div>
                        <div className="col-md-6">
                          <span className="text-muted small d-block">Región</span>
                          <span className="text-dark">{order.cliente?.region || 'Región Metropolitana de Santiago'}</span>
                        </div>
                        <div className="col-md-6">
                          <span className="text-muted small d-block">Comuna</span>
                          <span className="text-dark">{order.agendamiento?.modalidad === 'retiro' ? 'Providencia' : (order.cliente?.comuna || '-')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lista de productos comprados */}
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
                          {order.items?.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                              <td>
                                <img
                                  src={item.imagen || 'img/torta-mil-sabores.png'}
                                  alt={item.nombre}
                                  width="48"
                                  height="48"
                                  className="rounded object-fit-contain"
                                  style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'img/torta-mil-sabores.png';
                                  }}
                                />
                              </td>
                              <td className="small fw-semibold" style={{ color: 'var(--color-espresso)' }}>{item.nombre}</td>
                              <td className="text-end small">{formatPrice(item.precio)}</td>
                              <td className="text-center small">{item.cantidad}</td>
                              <td className="text-end small fw-bold" style={{ color: 'var(--color-caramelo)' }}>
                                {formatPrice(item.subtotal || item.precio * item.cantidad)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Total pagado */}
                    <div className="text-center my-3 py-3 rounded-3" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}>
                      <h4 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                        Total pagado con éxito: <span style={{ color: 'var(--color-caramelo)' }}>{formatPrice(order.total)}</span>
                      </h4>
                    </div>
                  </>
                )}

                {/* Acciones */}
                <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-3 border-top d-print-none" style={{ borderColor: 'var(--color-borde)' }}>
                  <button
                    type="button"
                    className="boton boton-primario btn-baker"
                    onClick={handlePrint}
                  >
                    <i className="bi bi-file-earmark-pdf me-2"></i>Imprimir Boleta en PDF
                  </button>
                  <button
                    type="button"
                    className="boton boton-secundario btn-baker"
                    onClick={handleSendEmail}
                  >
                    <i className="bi bi-envelope me-2"></i>Enviar Boleta por Email
                  </button>
                  <Link to="/" className="boton boton-secundario btn-baker">
                    <i className="bi bi-house me-2"></i>Volver al Inicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bloque Exclusivo de Impresión / Guardar en PDF */}
      <div className="boleta-print-only">
        <BoletaOficial order={order} />
      </div>
    </>
  );
}
