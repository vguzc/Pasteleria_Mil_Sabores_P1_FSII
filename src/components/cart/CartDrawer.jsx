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
          <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-chocolate)' }}>Tu bolsa</h3>
          <button
            type="button"
            className="btn-cerrar-drawer"
            onClick={closeDrawer}
            aria-label="Cerrar bolsa"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Cuerpo con ítems */}
        <div className="drawer-cuerpo">
          {cart.length === 0 ? (
            <div className="bolsa-vacia-container">
              <h4 className="bolsa-vacia-titulo">Tu bolsa está vacía.</h4>
              <p className="bolsa-vacia-subtitulo">
                ¿No sabes por dónde comenzar?<br />
                Prueba con nuestras especialidades:
              </p>

              <Link
                to="/categoria/Tortas%20Circulares"
                className="tarjeta-categoria-sugerida"
                onClick={closeDrawer}
              >
                <img src="/img/torta-amor-lucuma.png" alt="Tortas" className="cat-sugerida-thumb" />
                <span className="cat-sugerida-nombre">Tortas</span>
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
                to="/categoria/Especial%2018"
                className="tarjeta-categoria-sugerida"
                onClick={closeDrawer}
              >
                <img src="/img/empanada-pino.png" alt="Especial 18" className="cat-sugerida-thumb" />
                <span className="cat-sugerida-nombre">Especial Fiestas Patrias</span>
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
                    width="60"
                    height="60"
                    className="rounded object-fit-contain p-1"
                    style={{ backgroundColor: '#F7EFE4', border: '1px solid var(--color-borde)' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/torta-mil-sabores.png';
                    }}
                  />
                  <div className="flex-grow-1 min-w-0">
                    <Link
                      to={`/producto/${item.id}`}
                      className="d-block fw-bold text-truncate small mb-1"
                      style={{ color: 'var(--color-chocolate)' }}
                      onClick={closeDrawer}
                    >
                      {item.nombre}
                    </Link>
                    <div className="small fw-semibold" style={{ color: 'var(--color-chocolate)' }}>
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
                        title="Eliminar"
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
              <div className="d-flex justify-content-between align-items-center p-2 mb-2 rounded small" style={{ backgroundColor: 'rgba(255, 192, 203, 0.4)', color: 'var(--color-chocolate)' }}>
                <span>Cupón: <strong>{totals.cupon.codigo}</strong> (-{formatPrice(totals.descuento)})</span>
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
                />
                <button type="submit" className="btn btn-outline-primary btn-sm text-nowrap">
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
            <div className="d-flex justify-content-between fs-5 fw-bold mb-3" style={{ color: 'var(--color-chocolate)' }}>
              <span>Total a pagar:</span>
              <span>{formatPrice(totals.total)}</span>
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
