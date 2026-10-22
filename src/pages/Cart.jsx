import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SUCURSALES_RETIRO } from '../services/db';
import QuantitySelector from '../components/cart/QuantitySelector';
import AlertMessage from '../components/common/AlertMessage';

export default function Cart() {
  const {
    cart,
    totals,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    scheduling,
    updateScheduling,
    stockNotice,
    clearStockNotice
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  // Fechas de referencia para el agendamiento
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const handleApplyCoupon = (e, codeToApply) => {
    if (e && e.preventDefault) e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = (typeof codeToApply === 'string' ? codeToApply : inputCoupon).trim();
    if (!code) return;

    const res = applyCoupon(code);
    if (res.success) {
      setCouponSuccess(`¡Cupón "${res.coupon.codigo}" aplicado con éxito! (${res.coupon.porcentaje}% de descuento)`);
      setInputCoupon('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);

  const selectedBranchName = scheduling?.sucursalRetiro || 'Mil Sabores Chicureo';

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Hero Editorial de la Bolsa de Compras (Mismo estilo que Catálogo, Contacto y Nosotros) */}
      <section className="catalogo-hero-banner mb-4">
        <div className="contenedor">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.35rem' }}>
                Tu Selección Artesanal
              </span>
              <h1 className="catalogo-hero-titulo" style={{ margin: '0.2rem 0 0.7rem 0' }}>
                Bolsa de Compras
              </h1>
              <div className="adorno-baker" style={{ margin: '0.5rem 0 1rem 0' }} />
              <p className="catalogo-hero-desc" style={{ marginBottom: 0 }}>
                Revisa tus productos seleccionados, ajusta las porciones y programa tu fecha de entrega antes de pasar al pago seguro.
              </p>
            </div>
            {cart.length > 0 && (
              <div>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearCart}
                  style={{ fontSize: '0.82rem' }}
                >
                  <i className="bi bi-trash3 me-1"></i>Vaciar Bolsa
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="contenedor">
        {/* Alerta de límite de stock en tiempo real */}
        {stockNotice && (
          <div
            className="alert d-flex align-items-center justify-content-between shadow-sm mb-4"
            style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)', borderRadius: '8px' }}
          >
            <div>
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
              {stockNotice.mensaje}
            </div>
            <button type="button" className="btn-close" onClick={clearStockNotice} aria-label="Cerrar"></button>
          </div>
        )}

        {cart.length === 0 ? (
          <div
            className="text-center py-5 px-3 rounded-3"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', maxWidth: '580px', margin: '2rem auto' }}
          >
            <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', borderRadius: '50%', backgroundColor: '#F3ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-moca)' }}>
              <i className="bi bi-bag-x fs-2"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.5rem' }}>
              Tu bolsa de compras está vacía
            </h3>
            <p className="text-muted small mb-4">
              Explora nuestro catálogo de pastelería artesanal y añade tus tortas y dulces favoritos.
            </p>
            <Link to="/productos" className="boton boton-primario btn-baker">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Columna Izquierda: Tabla de Productos, Agendamiento y Cupones */}
            <div className="col-lg-8">
              {/* Tabla de Productos del Carrito */}
              <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }} className="small">
                        <tr>
                          <th style={{ width: '80px', color: 'var(--color-espresso)' }}>Imagen</th>
                          <th style={{ color: 'var(--color-espresso)' }}>Producto</th>
                          <th className="text-end" style={{ width: '110px', color: 'var(--color-espresso)' }}>Precio</th>
                          <th className="text-center" style={{ width: '140px', color: 'var(--color-espresso)' }}>Cantidad</th>
                          <th className="text-end" style={{ width: '110px', color: 'var(--color-espresso)' }}>Subtotal</th>
                          <th className="text-center" style={{ width: '70px', color: 'var(--color-espresso)' }}>Quitar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => {
                          const itemStock = typeof item.stock === 'number' ? item.stock : 99;
                          const isMax = item.cantidad >= itemStock;

                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                              <td>
                                <img
                                  src={item.imagen || '/img/torta-mil-sabores.png'}
                                  alt={item.nombre}
                                  width="64"
                                  height="64"
                                  className="rounded object-fit-contain p-1"
                                  style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/img/torta-mil-sabores.png';
                                  }}
                                />
                              </td>
                              <td>
                                <strong style={{ color: 'var(--color-espresso)', fontSize: '0.92rem' }}>
                                  {item.nombre}
                                </strong>
                                {item.porciones && (
                                  <span className="text-muted small d-block" style={{ fontSize: '0.78rem' }}>
                                    Formato: {item.porciones} porciones
                                  </span>
                                )}
                                {item.stock <= 5 && (
                                  <span className="badge bg-warning text-dark mt-1" style={{ fontSize: '0.7rem' }}>
                                    ¡Solo quedan {item.stock} en taller!
                                  </span>
                                )}
                              </td>
                              <td className="text-end small">{formatPrice(item.precio)}</td>
                              <td className="text-center">
                                <div className="d-inline-block">
                                  <QuantitySelector
                                    quantity={item.cantidad}
                                    min={1}
                                    max={itemStock}
                                    onChange={(newQty) => updateQuantity(item.id, newQty)}
                                  />
                                  {isMax && (
                                    <div className="text-danger mt-1" style={{ fontSize: '0.7rem' }}>
                                      Máximo alcanzado ({itemStock})
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="text-end fw-bold" style={{ color: 'var(--color-caramelo)' }}>
                                {formatPrice(item.subtotal)}
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-outline-danger btn-sm border-0"
                                  onClick={() => removeItem(item.id)}
                                  title="Eliminar producto"
                                  aria-label={`Eliminar ${item.nombre}`}
                                >
                                  <i className="bi bi-trash3"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* SECCIÓN: Programar / Agendar Pedido */}
              <div className="card shadow-sm border-0 p-4 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-calendar2-week-fill fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                    Programar Fecha & Horario de Entrega
                  </h5>
                </div>
                <p className="text-muted small mb-4">
                  Elaboramos nuestros productos diariamente de forma artesanal. Elige el día, el bloque horario y si deseas recibirlo a domicilio o retirarlo en nuestras pastelerías.
                </p>

                {/* 1. Selección de Modalidad */}
                <div className="mb-4">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                    1. Modalidad de Entrega:
                  </label>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div
                        className={`p-3 rounded-3 border h-100 cursor-pointer ${scheduling?.modalidad === 'despacho' ? 'border-2' : ''}`}
                        style={{
                          backgroundColor: scheduling?.modalidad === 'despacho' ? '#FAF4EC' : '#FAF7F2',
                          borderColor: scheduling?.modalidad === 'despacho' ? 'var(--color-caramelo)' : 'var(--color-borde)',
                          cursor: 'pointer'
                        }}
                        onClick={() => updateScheduling({ modalidad: 'despacho' })}
                      >
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="modalidadEntrega"
                            id="modoDespacho"
                            checked={scheduling?.modalidad === 'despacho'}
                            onChange={() => updateScheduling({ modalidad: 'despacho' })}
                          />
                          <label className="form-check-label fw-bold d-block" htmlFor="modoDespacho" style={{ color: 'var(--color-espresso)' }}>
                            Despacho a Domicilio
                          </label>
                        </div>
                        <p className="text-muted small mt-2 mb-0" style={{ fontSize: '0.78rem' }}>
                          Llevamos tu pedido con cadena de frío garantizada hasta la puerta de tu hogar.
                        </p>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div
                        className={`p-3 rounded-3 border h-100 cursor-pointer ${scheduling?.modalidad === 'retiro' ? 'border-2' : ''}`}
                        style={{
                          backgroundColor: scheduling?.modalidad === 'retiro' ? '#FAF4EC' : '#FAF7F2',
                          borderColor: scheduling?.modalidad === 'retiro' ? 'var(--color-caramelo)' : 'var(--color-borde)',
                          cursor: 'pointer'
                        }}
                        onClick={() => updateScheduling({ modalidad: 'retiro' })}
                      >
                        <div className="form-check d-flex justify-content-between align-items-center">
                          <div>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="modalidadEntrega"
                              id="modoRetiro"
                              checked={scheduling?.modalidad === 'retiro'}
                              onChange={() => updateScheduling({ modalidad: 'retiro' })}
                            />
                            <label className="form-check-label fw-bold" htmlFor="modoRetiro" style={{ color: 'var(--color-espresso)' }}>
                              Retiro en Sucursal
                            </label>
                          </div>
                          <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>
                            Gratis ($0)
                          </span>
                        </div>
                        <p className="text-muted small mt-2 mb-0" style={{ fontSize: '0.78rem' }}>
                          Disponible en Chicureo, Providencia o Las Condes sin costo de envío.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-selector de sucursal si modalidad es retiro */}
                {scheduling?.modalidad === 'retiro' && (
                  <div className="mb-4 p-3 rounded-3 border" style={{ backgroundColor: '#FAF4EC', borderColor: 'var(--color-caramelo)' }}>
                    <label className="form-label small fw-bold d-block mb-2" style={{ color: 'var(--color-espresso)' }}>
                      Elige la sucursal de retiro:
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedBranchName}
                      onChange={(e) => updateScheduling({ sucursalRetiro: e.target.value })}
                      style={{ borderColor: 'var(--color-borde)' }}
                    >
                      {SUCURSALES_RETIRO.map((branch) => (
                        <option key={branch.id} value={branch.nombre}>
                          {branch.nombre} — {branch.direccion}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 2. Selección de Fecha y Franja Horaria */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                      2. Fecha de Entrega / Retiro:
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={scheduling?.fecha || ''}
                      min={todayStr}
                      onChange={(e) => updateScheduling({ fecha: e.target.value })}
                      style={{ borderColor: 'var(--color-borde)' }}
                    />
                    <div className="d-flex gap-2 mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => updateScheduling({ fecha: todayStr })}
                      >
                        Hoy ({todayStr})
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm py-0 px-2"
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => updateScheduling({ fecha: tomorrowStr })}
                      >
                        Mañana ({tomorrowStr})
                      </button>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                      3. Franja Horaria Preferente:
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={scheduling?.franjaHoraria || 'tarde'}
                      onChange={(e) => updateScheduling({ franjaHoraria: e.target.value })}
                      style={{ borderColor: 'var(--color-borde)' }}
                    >
                      <option value="manana">Mañana (10:00 - 13:00 hrs)</option>
                      <option value="tarde">Tarde (14:00 - 18:00 hrs)</option>
                      <option value="atardecer">Atardecer (18:00 - 20:30 hrs)</option>
                    </select>
                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>
                      Coordinaremos contigo si hay alguna contingencia en la ruta.
                    </small>
                  </div>
                </div>

                {/* 3. Dedicatoria o Notas del Pedido */}
                <div>
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                    4. Dedicatoria en Placa de Chocolate o Instrucciones Especiales:
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    rows="2"
                    placeholder="Ej: Escribir con chocolate '¡Feliz Cumpleaños Claudia!' o instrucciones de entrega para conserjería."
                    value={scheduling?.dedicatoria || ''}
                    onChange={(e) => updateScheduling({ dedicatoria: e.target.value })}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                  <small className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>
                    Sin costo adicional en todas nuestras tortas de celebración.
                  </small>
                </div>
              </div>

              {/* Cupones de descuento */}
              <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <h6 className="fw-bold mb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                  <i className="bi bi-tag-fill me-2" style={{ color: 'var(--color-caramelo)' }}></i>¿Tienes un cupón de aniversario o descuento?
                </h6>
                {couponError && <AlertMessage message={couponError} type="danger" onClose={() => setCouponError('')} />}
                {couponSuccess && <AlertMessage message={couponSuccess} type="success" onClose={() => setCouponSuccess('')} />}

                {totals.cupon ? (
                  <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}>
                    <div className="small">
                      <strong style={{ color: 'var(--color-espresso)' }}>{totals.cupon.codigo}</strong>: {totals.cupon.nombre} (-{totals.cupon.porcentaje}%)
                    </div>
                    <button className="btn btn-outline-danger btn-sm py-0" onClick={removeCoupon}>
                      Quitar Cupón
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={(e) => handleApplyCoupon(e, inputCoupon)} className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej: FELICES50, DUOC10"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        style={{ borderColor: 'var(--color-borde)', maxWidth: '280px' }}
                      />
                      <button type="submit" className="boton boton-primario btn-baker" style={{ padding: '0.45rem 1.1rem', fontSize: '0.82rem' }}>
                        Aplicar Cupón
                      </button>
                    </form>

                    <div className="mt-3 pt-2 border-top d-flex align-items-center gap-2 flex-wrap" style={{ borderColor: 'var(--color-borde)' }}>
                      <span className="text-muted" style={{ fontSize: '0.74rem' }}>Cupones oficiales:</span>
                      <button
                        type="button"
                        className="cupon-chip"
                        onClick={(e) => handleApplyCoupon(e, 'FELICES50')}
                      >
                        FELICES50 (-50%)
                      </button>
                      <button
                        type="button"
                        className="cupon-chip"
                        onClick={(e) => handleApplyCoupon(e, 'DUOC10')}
                      >
                        DUOC10 (-10%)
                      </button>
                      <button
                        type="button"
                        className="cupon-chip"
                        onClick={(e) => handleApplyCoupon(e, 'ESPECIAL18')}
                      >
                        ESPECIAL18 (-15%)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                  Resumen de Compra
                </h5>

                {/* Resumen del Agendamiento */}
                <div className="p-3 rounded mb-3" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                  <div className="small fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>
                    <i className="bi bi-clock-history me-1" style={{ color: 'var(--color-caramelo)' }}></i>
                    Entrega Programada:
                  </div>
                  <div className="small text-muted">
                    Modalidad: <strong>{scheduling?.modalidad === 'retiro' ? `Retiro en ${selectedBranchName}` : 'Despacho a Domicilio'}</strong>
                  </div>
                  {scheduling?.fecha && (
                    <div className="small text-muted">
                      Fecha: <strong>{scheduling.fecha}</strong> ({scheduling.franjaHoraria})
                    </div>
                  )}
                  {scheduling?.dedicatoria && (
                    <div className="small text-muted text-truncate mt-1">
                      Dedicatoria: <em>"{scheduling.dedicatoria}"</em>
                    </div>
                  )}
                </div>

                <ul className="list-group list-group-flush mb-3 small">
                  <li className="list-group-item d-flex justify-content-between px-0 bg-transparent border-0">
                    <span className="text-muted">Subtotal ({totals.itemsCount} productos):</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </li>

                  {totals.descuento > 0 && (
                    <li className="list-group-item d-flex justify-content-between px-0 text-danger fw-bold bg-transparent border-0">
                      <span>Descuento cupón ({totals.cupon?.codigo}):</span>
                      <span>-{formatPrice(totals.descuento)}</span>
                    </li>
                  )}

                  <li className="list-group-item d-flex justify-content-between px-0 bg-transparent border-0">
                    <span className="text-muted">IVA (19% incluido):</span>
                    <span>{formatPrice(totals.iva)}</span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between px-0 bg-transparent border-0">
                    <span className="text-muted">Costo de Despacho:</span>
                    <span>
                      {scheduling?.modalidad === 'retiro' ? (
                        <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>Gratis (Retiro)</span>
                      ) : totals.envio === 0 ? (
                        <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>Gratis</span>
                      ) : totals.subtotal >= 20000 ? (
                        <span>
                          {formatPrice(totals.envio)}
                          <small className="text-success d-block text-end" style={{ fontSize: '0.7rem' }}>Ahorras $2.000</small>
                        </span>
                      ) : (
                        formatPrice(totals.envio)
                      )}
                    </span>
                  </li>

                  <li className="list-group-item d-flex justify-content-between px-0 fs-5 fw-bold border-top pt-3 bg-transparent" style={{ color: 'var(--color-espresso)' }}>
                    <span>Total a Pagar:</span>
                    <span style={{ color: 'var(--color-caramelo)' }}>{formatPrice(totals.total)}</span>
                  </li>
                </ul>

                <button
                  type="button"
                  className="boton boton-primario btn-baker w-100"
                  onClick={handleProceedToCheckout}
                  style={{ padding: '0.85rem 1.25rem' }}
                >
                  <i className="bi bi-credit-card me-2"></i>Continuar al Pago Seguro
                </button>

                <div className="text-center mt-3">
                  <Link to="/productos" className="small text-muted text-decoration-none">
                    ← Seguir explorando el catálogo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
