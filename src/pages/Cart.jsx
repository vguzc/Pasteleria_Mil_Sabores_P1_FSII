import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { SUCURSALES_RETIRO } from '../services/db';
import QuantitySelector from '../components/cart/QuantitySelector';
import AlertMessage from '../components/common/AlertMessage';

export default function Cart() {
  const { currentUser } = useAuth();
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

    const res = applyCoupon(code, currentUser?.correo || '');
    if (res.success) {
      setCouponSuccess(`Cupón "${res.coupon.codigo}" aplicado con éxito (-${res.coupon.porcentaje}% de descuento).`);
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
  const isRetiro = scheduling?.modalidad === 'retiro';

  // Barra de progreso de despacho gratis
  const metaGratis = 30000;
  const progresoEnvio = Math.min(100, Math.round((totals.subtotal / metaGratis) * 100));
  const faltaParaGratis = Math.max(0, metaGratis - totals.subtotal);

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '2.5rem 0 6rem 0' }}>
      <div className="contenedor">
        {/* Encabezado limpio de la Bolsa de Compras */}
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2 pt-2">
          <div>
            <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.25rem', color: 'var(--color-caramelo)' }}>
              Tu Selección Artesanal
            </span>
            <h1 className="seccion-baker-titulo" style={{ fontSize: '2.2rem', textAlign: 'left', margin: 0, color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
              Bolsa de Compras
            </h1>
            <p className="text-muted small mb-0 mt-1">
              Revisa tus productos seleccionados, agenda la fecha de entrega y continúa al pago seguro.
            </p>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
              onClick={clearCart}
              style={{ fontSize: '0.8rem', borderRadius: '8px', borderColor: 'var(--color-borde)', color: 'var(--color-texto-secundario)' }}
            >
              <i className="bi bi-trash3"></i>
              <span>Vaciar Bolsa</span>
            </button>
          )}
        </div>

        {/* Alerta de límite de stock en tiempo real */}
        {stockNotice && (
          <div
            className="alert d-flex align-items-center justify-content-between shadow-sm mb-4"
            style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)', borderRadius: '10px' }}
          >
            <div className="d-flex align-items-center gap-2 small">
              <i className="bi bi-exclamation-triangle-fill fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
              <span>{stockNotice.mensaje}</span>
            </div>
            <button type="button" className="btn-close" onClick={clearStockNotice} aria-label="Cerrar"></button>
          </div>
        )}

        {cart.length === 0 ? (
          <div
            className="text-center py-5 px-3 rounded-4 shadow-sm"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', maxWidth: '560px', margin: '3rem auto' }}
          >
            <div style={{ width: '68px', height: '68px', margin: '0 auto 1.25rem', borderRadius: '50%', backgroundColor: '#F3ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-bag-x fs-2"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.45rem', marginBottom: '0.5rem' }}>
              Tu bolsa de compras está vacía
            </h3>
            <p className="text-muted small mb-4" style={{ maxWidth: '380px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
              Explora nuestro catálogo de pastelería tradicional y agrega tus tortas, dulces o postres favoritos.
            </p>
            <Link to="/productos" className="boton boton-primario btn-baker px-4 py-2" style={{ fontSize: '0.9rem' }}>
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* ========================================================================= */}
            {/* COLUMNA IZQUIERDA (68%): PRODUCTOS EN BOLSA, AGENDAMIENTO Y CUPONES       */}
            {/* ========================================================================= */}
            <div className="col-lg-8">
              {/* 1. SECCIÓN: TABLA DE PRODUCTOS EN LA BOLSA */}
              <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '12px' }}>
                <div className="card-header bg-transparent py-3 px-4 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid var(--color-borde)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-bag-check-fill fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                    <h5 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)', fontSize: '1.15rem' }}>
                      1. Productos Seleccionados ({totals.itemsCount || cart.reduce((acc, i) => acc + i.cantidad, 0)} unidades)
                    </h5>
                  </div>
                  <Link to="/productos" className="small text-decoration-none fw-semibold" style={{ color: 'var(--color-caramelo)' }}>
                    + Agregar más tortas
                  </Link>
                </div>

                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead style={{ backgroundColor: 'var(--color-superficie)', borderBottom: '1px solid var(--color-borde)' }}>
                      <tr>
                        <th style={{ width: '72px', color: 'var(--color-texto-secundario)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="ps-4">Pastel</th>
                        <th style={{ color: 'var(--color-texto-secundario)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Descripción</th>
                        <th className="text-end" style={{ width: '100px', color: 'var(--color-texto-secundario)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Precio</th>
                        <th className="text-center" style={{ width: '135px', color: 'var(--color-texto-secundario)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cantidad</th>
                        <th className="text-end" style={{ width: '110px', color: 'var(--color-texto-secundario)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subtotal</th>
                        <th className="text-center pe-4" style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => {
                        const itemStock = typeof item.stock === 'number' ? item.stock : 99;
                        const isMax = item.cantidad >= itemStock;

                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                            <td className="ps-4">
                              <img
                                src={item.imagen || 'img/torta-mil-sabores.png'}
                                alt={item.nombre}
                                width="56"
                                height="56"
                                className="rounded object-fit-contain p-1"
                                style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'img/torta-mil-sabores.png';
                                }}
                              />
                            </td>
                            <td>
                              <strong style={{ color: 'var(--color-espresso)', fontSize: '0.94rem' }}>
                                {item.nombre}
                              </strong>
                              {item.porciones && (
                                <span className="text-muted small d-block" style={{ fontSize: '0.78rem' }}>
                                  Formato: {item.porciones} porciones
                                </span>
                              )}
                              {item.stock <= 5 && (
                                <span className="badge mt-1" style={{ backgroundColor: '#FEF3C7', color: '#92400E', border: '1px solid #FCD34D', fontSize: '0.68rem', fontWeight: 600 }}>
                                  ¡Últimas {item.stock} disponibles!
                                </span>
                              )}
                            </td>
                            <td className="text-end text-muted small" style={{ fontSize: '0.88rem' }}>
                              {formatPrice(item.precio)}
                            </td>
                            <td className="text-center">
                              <div className="d-inline-block">
                                <QuantitySelector
                                  value={item.cantidad}
                                  min={1}
                                  max={itemStock}
                                  size="sm"
                                  onChange={(newQty) => updateQuantity(item.id, newQty)}
                                />
                                {isMax && (
                                  <div className="text-danger mt-1" style={{ fontSize: '0.68rem' }}>
                                    Máx. {itemStock} unid.
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="text-end fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.96rem' }}>
                              {formatPrice(item.subtotal)}
                            </td>
                            <td className="text-center pe-4">
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-muted p-1"
                                onClick={() => removeItem(item.id)}
                                title="Eliminar producto"
                                aria-label={`Eliminar ${item.nombre}`}
                                style={{ transition: 'color 0.15s ease' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-caramelo)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                              >
                                <i className="bi bi-trash3 fs-6"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. SECCIÓN: PROGRAMAR FECHA & MODALIDAD DE ENTREGA */}
              <div className="card shadow-sm border-0 p-4 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '12px' }}>
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: 'var(--color-borde)' }}>
                  <i className="bi bi-calendar2-week-fill fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)', fontSize: '1.15rem' }}>
                    2. Modalidad y Agendamiento de Entrega
                  </h5>
                </div>
                <p className="text-muted small mb-3" style={{ fontSize: '0.82rem' }}>
                  Elaboramos artesanalmente cada pedido el mismo día de la entrega. Selecciona tu preferencia:
                </p>

                {/* 1. Selección de Modalidad */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div
                      className="p-3 h-100 transition"
                      style={{
                        backgroundColor: !isRetiro ? '#FAF4EC' : '#FAF7F2',
                        border: !isRetiro ? '2px solid var(--color-caramelo)' : '1px solid var(--color-borde)',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                      onClick={() => updateScheduling({ modalidad: 'despacho' })}
                    >
                      <div className="form-check mb-1">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="modalidadEntrega"
                          id="cartModoDespacho"
                          checked={!isRetiro}
                          onChange={() => updateScheduling({ modalidad: 'despacho' })}
                        />
                        <label className="form-check-label fw-bold" htmlFor="cartModoDespacho" style={{ color: 'var(--color-espresso)', fontSize: '0.9rem' }}>
                          <i className="bi bi-truck me-1" style={{ color: 'var(--color-caramelo)' }}></i>Despacho a Domicilio
                        </label>
                      </div>
                      <p className="text-muted small mb-0 ps-4" style={{ fontSize: '0.78rem' }}>
                        Despacho refrigerado hasta tu puerta en la Región Metropolitana.
                      </p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div
                      className="p-3 h-100 transition"
                      style={{
                        backgroundColor: isRetiro ? '#FAF4EC' : '#FAF7F2',
                        border: isRetiro ? '2px solid var(--color-caramelo)' : '1px solid var(--color-borde)',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                      onClick={() => updateScheduling({ modalidad: 'retiro' })}
                    >
                      <div className="form-check d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="modalidadEntrega"
                            id="cartModoRetiro"
                            checked={isRetiro}
                            onChange={() => updateScheduling({ modalidad: 'retiro' })}
                          />
                          <label className="form-check-label fw-bold" htmlFor="cartModoRetiro" style={{ color: 'var(--color-espresso)', fontSize: '0.9rem' }}>
                            <i className="bi bi-shop me-1" style={{ color: 'var(--color-caramelo)' }}></i>Retiro en Pastelería
                          </label>
                        </div>
                        <span className="badge" style={{ backgroundColor: 'var(--color-salvia-claro)', color: 'var(--color-exito)', fontSize: '0.75rem', fontWeight: 700 }}>
                          Gratis ($0)
                        </span>
                      </div>
                      <p className="text-muted small mb-0 ps-4" style={{ fontSize: '0.78rem' }}>
                        Retira en Chicureo, Providencia o Las Condes sin costo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-selector de sucursal si modalidad es retiro */}
                {isRetiro && (
                  <div className="mb-3 p-3 rounded-3 border" style={{ backgroundColor: '#FAF4EC', borderColor: 'var(--color-caramelo)' }}>
                    <label className="form-label small fw-bold d-block mb-1" style={{ color: 'var(--color-espresso)', fontSize: '0.82rem' }}>
                      <i className="bi bi-geo-alt-fill me-1" style={{ color: 'var(--color-caramelo)' }}></i>Selecciona la sucursal de retiro:
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedBranchName}
                      onChange={(e) => updateScheduling({ sucursalRetiro: e.target.value })}
                      style={{ borderColor: 'var(--color-borde)' }}
                    >
                      {SUCURSALES_RETIRO.map((branch) => (
                        <option key={branch.id} value={branch.nombre}>
                          {branch.nombre} — {branch.direccion} ({branch.comuna})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Bloque de Fecha, Franja Horaria y Dedicatoria */}
                <div className="p-3 rounded-3 border" style={{ backgroundColor: '#FAF7F2', borderColor: 'var(--color-borde)' }}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.8rem' }}>
                        <i className="bi bi-calendar-event me-1"></i>Fecha de {isRetiro ? 'Retiro' : 'Entrega'}:
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={scheduling?.fecha || todayStr}
                        min={todayStr}
                        onChange={(e) => updateScheduling({ fecha: e.target.value })}
                        style={{ borderColor: 'var(--color-borde)' }}
                      />
                      <div className="d-flex gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          style={{ fontSize: '0.72rem', borderColor: 'var(--color-borde)' }}
                          onClick={() => updateScheduling({ fecha: todayStr })}
                        >
                          Hoy ({todayStr})
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm py-0 px-2"
                          style={{ fontSize: '0.72rem', borderColor: 'var(--color-borde)' }}
                          onClick={() => updateScheduling({ fecha: tomorrowStr })}
                        >
                          Mañana ({tomorrowStr})
                        </button>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.8rem' }}>
                        <i className="bi bi-clock me-1"></i>Franja Horaria Preferente:
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
                        Coordinaremos la entrega con antelación si surge alguna contingencia.
                      </small>
                    </div>

                    <div className="col-12 mt-2">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.8rem' }}>
                        <i className="bi bi-pencil-square me-1"></i>Dedicatoria en Chocolate para la torta (opcional):
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Ej: ¡Feliz Cumpleaños Claudia! Con cariño de toda la familia"
                        value={scheduling?.dedicatoria || ''}
                        onChange={(e) => updateScheduling({ dedicatoria: e.target.value })}
                        style={{ borderColor: 'var(--color-borde)' }}
                      />
                      <small className="text-muted d-block mt-1" style={{ fontSize: '0.72rem' }}>
                        Sin costo adicional en todas nuestras tortas artesanales de celebración.
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SECCIÓN: CUPÓN DE DESCUENTO EN CARRITO */}
              <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '12px' }}>
                <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)', fontSize: '1.15rem' }}>
                  <i className="bi bi-tag-fill me-2" style={{ color: 'var(--color-caramelo)' }}></i>3. ¿Tienes un cupón de descuento?
                </h5>

                {couponError && <AlertMessage message={couponError} type="danger" onClose={() => setCouponError('')} />}
                {couponSuccess && <AlertMessage message={couponSuccess} type="success" onClose={() => setCouponSuccess('')} />}

                {totals.cupon ? (
                  <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}>
                    <div className="small">
                      <strong style={{ color: 'var(--color-espresso)' }}>{totals.cupon.codigo}</strong>: {totals.cupon.nombre} (-{totals.cupon.porcentaje}%)
                      <span className="text-success ms-2 fw-bold">Ahorras {formatPrice(totals.descuento)}</span>
                    </div>
                    <button className="btn btn-outline-danger btn-sm py-0 px-2" onClick={removeCoupon} style={{ fontSize: '0.74rem' }}>
                      Quitar Cupón
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={(e) => handleApplyCoupon(e, inputCoupon)} className="d-flex gap-2" style={{ maxWidth: '420px' }}>
                      <input
                        type="text"
                        className="form-control form-control-sm text-uppercase"
                        placeholder="Ingresa tu cupón"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        style={{ borderColor: 'var(--color-borde)', letterSpacing: '0.5px' }}
                      />
                      <button type="submit" className="boton boton-primario btn-baker py-1 px-3" style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                        Aplicar
                      </button>
                    </form>

                    {/* Nota informativa estándar e-commerce sin botones píldora */}
                    <div className="mt-3 pt-2 border-top text-muted" style={{ borderColor: 'var(--color-borde)', fontSize: '0.74rem', lineHeight: '1.4' }}>
                      <div className="d-flex align-items-start gap-1 mb-1">
                        <i className="bi bi-info-circle flex-shrink-0 mt-0.5" style={{ color: 'var(--color-caramelo)' }}></i>
                        <span>
                          <strong>DUOC10</strong> (-10%): exclusivo para la comunidad Duoc UC (<code>@duocuc.cl</code> / <code>@profesor.duoc.cl</code>).
                        </span>
                      </div>
                      <div className="d-flex align-items-start gap-1">
                        <i className="bi bi-info-circle flex-shrink-0 mt-0.5" style={{ color: 'var(--color-caramelo)' }}></i>
                        <span>
                          <strong>FELICES50</strong> (-50%): beneficio especial por 50 años para clientes de 50 años o más.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* COLUMNA DERECHA (32%): RESUMEN DE COMPRA STICKY Y BOTÓN AL CHECKOUT       */}
            {/* ========================================================================= */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '90px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '12px' }}>
                <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)', fontSize: '1.25rem' }}>
                  Resumen de Compra
                </h5>

                {/* Resumen del Agendamiento */}
                <div className="p-3 rounded mb-3" style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}>
                  <div className="small fw-bold mb-1" style={{ color: 'var(--color-espresso)', fontSize: '0.8rem' }}>
                    <i className="bi bi-clock-history me-1" style={{ color: 'var(--color-caramelo)' }}></i>
                    Entrega Programada:
                  </div>
                  <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                    Modalidad: <strong>{isRetiro ? `Retiro en ${selectedBranchName}` : 'Despacho a Domicilio'}</strong>
                  </div>
                  {scheduling?.fecha && (
                    <div className="small text-muted" style={{ fontSize: '0.78rem' }}>
                      Fecha: <strong>{scheduling.fecha}</strong> ({scheduling.franjaHoraria})
                    </div>
                  )}
                  {scheduling?.dedicatoria && (
                    <div className="small text-muted text-truncate mt-1" style={{ fontSize: '0.75rem' }}>
                      Dedicatoria: <em>"{scheduling.dedicatoria}"</em>
                    </div>
                  )}
                </div>

                {/* Barra de progreso para despacho gratis */}
                {!isRetiro && (
                  <div className="mb-3 p-2 rounded" style={{ backgroundColor: '#FAF4EC', border: '1px solid rgba(213, 185, 154, 0.4)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.72rem' }}>
                      <span className="fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                        {totals.subtotal >= metaGratis ? (
                          <span className="text-success"><i className="bi bi-check-circle-fill me-1"></i>¡Despacho 100% gratis!</span>
                        ) : (
                          <span>Te faltan <strong>{formatPrice(faltaParaGratis)}</strong> para despacho gratis</span>
                        )}
                      </span>
                      <span className="text-muted">{progresoEnvio}%</span>
                    </div>
                    <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(0,0,0,0.06)' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${progresoEnvio}%`,
                          backgroundColor: totals.subtotal >= metaGratis ? 'var(--color-exito)' : 'var(--color-caramelo)'
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Desglose Numérico de Totales */}
                <div className="row g-2 small mb-3" style={{ fontSize: '0.88rem' }}>
                  <div className="col-7 text-muted">Subtotal ({totals.itemsCount} productos):</div>
                  <div className="col-5 text-end fw-semibold text-dark">{formatPrice(totals.subtotal)}</div>

                  {totals.descuento > 0 && (
                    <>
                      <div className="col-7 text-danger fw-bold">Descuento ({totals.cupon?.codigo}):</div>
                      <div className="col-5 text-end text-danger fw-bold">-{formatPrice(totals.descuento)}</div>
                    </>
                  )}

                  <div className="col-7 text-muted">IVA (19% incluido):</div>
                  <div className="col-5 text-end text-muted">{formatPrice(totals.iva)}</div>

                  <div className="col-7 text-muted">Costo de despacho:</div>
                  <div className="col-5 text-end fw-semibold">
                    {isRetiro ? (
                      <span className="badge" style={{ backgroundColor: 'var(--color-salvia-claro)', color: 'var(--color-exito)', fontSize: '0.72rem', fontWeight: 700 }}>Gratis (Retiro)</span>
                    ) : totals.envio === 0 ? (
                      <span className="badge" style={{ backgroundColor: 'var(--color-salvia-claro)', color: 'var(--color-exito)', fontSize: '0.72rem', fontWeight: 700 }}>Gratis</span>
                    ) : totals.subtotal >= 20000 ? (
                      <span>
                        {formatPrice(totals.envio)}
                        <small className="text-success d-block text-end" style={{ fontSize: '0.68rem' }}>Ahorras $2.000</small>
                      </span>
                    ) : (
                      formatPrice(totals.envio)
                    )}
                  </div>

                  {/* Fila del Total a Pagar con tipografía clara y destacada */}
                  <div className="col-12 border-top pt-3 mt-2">
                    <div className="d-flex justify-content-between align-items-baseline">
                      <span className="fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '1.05rem' }}>Total del Pedido:</span>
                      <span className="fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
                        {formatPrice(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón Principal de Continuar al Pago */}
                <button
                  type="button"
                  className="boton boton-primario btn-baker w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleProceedToCheckout}
                  style={{ fontSize: '0.95rem', borderRadius: '10px' }}
                >
                  <i className="bi bi-shield-check fs-5"></i>
                  <span>Continuar al Checkout</span>
                  <i className="bi bi-arrow-right ms-1"></i>
                </button>

                {/* Sellos de Confianza y Seguridad */}
                <div className="mt-3 pt-3 border-top text-center" style={{ borderColor: 'var(--color-borde)' }}>
                  <div className="d-flex justify-content-center align-items-center gap-3 text-muted small" style={{ fontSize: '0.72rem' }}>
                    <span><i className="bi bi-lock-fill me-1" style={{ color: 'var(--color-caramelo)' }}></i>Pago Seguro SSL</span>
                    <span>•</span>
                    <span><i className="bi bi-award-fill me-1" style={{ color: 'var(--color-caramelo)' }}></i>Calidad Artesanal</span>
                  </div>
                  <div className="mt-2">
                    <Link to="/productos" className="small text-muted text-decoration-none" style={{ fontSize: '0.76rem' }}>
                      ← Seguir explorando la pastelería
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
