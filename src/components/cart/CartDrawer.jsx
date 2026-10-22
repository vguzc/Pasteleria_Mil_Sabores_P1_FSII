import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    totals,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeDrawer();
    navigate('/carrito');
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setInputCoupon('');
    }
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val || 0);

  return (
    <>
      {/* Backdrop oscuro translúcido */}
      <div
        className={`backdrop-carrito ${isDrawerOpen ? 'backdrop-abierto' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      ></div>

      {/* Panel Desplegable (Slide Drawer) */}
      <aside
        id="drawerCarrito"
        className={`drawer-carrito ${isDrawerOpen ? 'drawer-abierto' : ''}`}
        aria-label="Carrito de compras desplegable"
      >
        {/* Cabecera del Drawer */}
        <div className="drawer-header">
          <div>
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-caramelo)', fontWeight: 700, display: 'block' }}>
              Tu Selección
            </span>
            <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', margin: 0, fontSize: '1.75rem' }}>
              Bolsa de Compra
            </h3>
          </div>
          <button
            type="button"
            className="btn-cerrar-drawer"
            onClick={closeDrawer}
            aria-label="Cerrar bolsa"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Cuerpo con ítems */}
        <div className="drawer-cuerpo">
          {cart.length === 0 ? (
            <div className="bolsa-vacia-container text-center py-5 px-3">
              <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', borderRadius: '50%', backgroundColor: '#F3ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-moca)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
              <h4 className="bolsa-vacia-titulo" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.4rem' }}>Tu bolsa está vacía</h4>
              <p className="bolsa-vacia-subtitulo text-muted small mb-4">
                Descubre nuestras especialidades recién horneadas y añádelas con un solo clic:
              </p>

              <Link
                to="/categoria/Tortas%20Circulares"
                className="tarjeta-categoria-sugerida"
                onClick={closeDrawer}
              >
                <img src="/img/torta-amor-lucuma.png" alt="Tortas" className="cat-sugerida-thumb" />
                <span className="cat-sugerida-nombre">Tortas Circulares</span>
                <span className="cat-sugerida-flecha">→</span>
              </Link>

              <Link
                to="/categoria/Pastelería%20Tradicional"
                className="tarjeta-categoria-sugerida"
                onClick={closeDrawer}
              >
                <img src="/img/alfajores-hojarasca.png" alt="Pastelería Tradicional" className="cat-sugerida-thumb" />
                <span className="cat-sugerida-nombre">Pastelería Tradicional</span>
                <span className="cat-sugerida-flecha">→</span>
              </Link>

              <Link
                to="/categoria/Sin%20Gluten"
                className="tarjeta-categoria-sugerida"
                onClick={closeDrawer}
              >
                <img src="/img/cheesecake-frutos-rojos.png" alt="Línea Sin Gluten" className="cat-sugerida-thumb" />
                <span className="cat-sugerida-nombre">Línea Sin Gluten</span>
                <span className="cat-sugerida-flecha">→</span>
              </Link>
            </div>
          ) : (
            <div className="drawer-items-lista">
              {cart.map((item) => (
                <div key={item.id} className="drawer-item d-flex gap-3 align-items-center mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--color-borde)' }}>
                  <img
                    src={item.imagen || '/img/torta-mil-sabores.png'}
                    alt={item.nombre}
                    width="65"
                    height="65"
                    className="rounded object-fit-contain p-1"
                    style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/torta-mil-sabores.png';
                    }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <Link
                      to={`/producto/${item.id}`}
                      className="d-block fw-bold text-truncate small mb-1"
                      style={{ color: 'var(--color-espresso)', textDecoration: 'none' }}
                      onClick={closeDrawer}
                    >
                      {item.nombre}
                    </Link>
                    <div className="small fw-bold" style={{ color: 'var(--color-caramelo)' }}>
                      {formatPrice(item.precio)}
                    </div>
                    {/* Control de cantidad */}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <div className="input-group input-group-sm" style={{ width: '90px' }}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-2 py-0"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span className="input-group-text bg-white px-2 py-0 small fw-bold">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary px-2 py-0"
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 ms-auto small text-decoration-none"
                        onClick={() => removeItem(item.id)}
                        title="Eliminar de la bolsa"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer del Drawer con resumen y checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer p-3 border-top" style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--color-borde)' }}>
            {/* Cupón rápido */}
            {totals.cupon ? (
              <div className="d-flex justify-content-between align-items-center p-2 mb-2 rounded small" style={{ backgroundColor: '#F5EFEB', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                <span>Cupón activo: <strong>{totals.cupon.codigo}</strong> (-{formatPrice(totals.descuento)})</span>
                <button type="button" className="btn-close btn-close-sm" onClick={removeCoupon} aria-label="Quitar cupón"></button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="d-flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Cupón (ej: FELICES50)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  style={{ borderColor: 'var(--color-borde)' }}
                />
                <button
                  type="submit"
                  className="btn btn-sm text-nowrap"
                  style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF', fontWeight: 600 }}
                >
                  Aplicar
                </button>
              </form>
            )}
            {couponError && <div className="text-danger small mb-2">{couponError}</div>}

            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Subtotal:</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            {totals.descuento > 0 && (
              <div className="d-flex justify-content-between small text-danger fw-bold mb-1">
                <span>Descuento ({totals.cupon?.codigo}):</span>
                <span>-{formatPrice(totals.descuento)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fs-5 fw-bold mb-3" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-texto)' }}>
              <span>Total a pagar:</span>
              <span style={{ color: 'var(--color-caramelo)' }}>{formatPrice(totals.total)}</span>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                className="boton boton-primario w-100"
                onClick={handleCheckout}
              >
                Comprar / Ir a Pagar
              </button>
              <button
                type="button"
                className="boton boton-secundario w-100"
                onClick={handleViewCart}
              >
                Ver bolsa completa
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
