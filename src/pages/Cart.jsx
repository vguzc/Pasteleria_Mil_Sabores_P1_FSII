import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/cart/QuantitySelector';
import AlertMessage from '../components/common/AlertMessage';

export default function Cart() {
  const { cart, totals, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon } = useCart();
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon);
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

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>Bolsa de Compras</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
              Tu Selección
            </span>
            <h1 className="seccion-baker-titulo" style={{ fontSize: '2.4rem', textAlign: 'left', margin: 0 }}>
              Bolsa de Compras
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={clearCart}
              style={{ fontSize: '0.8rem' }}
            >
              <i className="bi bi-trash3 me-1"></i>Vaciar Bolsa
            </button>
          )}
        </div>

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
            {/* Tabla de Productos del Carrito */}
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }} className="small">
                        <tr>
                          <th style={{ width: '80px', color: 'var(--color-espresso)' }}>Imagen</th>
                          <th style={{ color: 'var(--color-espresso)' }}>Producto</th>
                          <th className="text-end" style={{ width: '110px', color: 'var(--color-espresso)' }}>Precio</th>
                          <th className="text-center" style={{ width: '130px', color: 'var(--color-espresso)' }}>Cantidad</th>
                          <th className="text-end" style={{ width: '110px', color: 'var(--color-espresso)' }}>Subtotal</th>
                          <th className="text-center" style={{ width: '70px', color: 'var(--color-espresso)' }}>Quitar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
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
                              <Link to={`/producto/${item.id}`} className="text-decoration-none fw-bold small d-block" style={{ color: 'var(--color-espresso)' }}>
                                {item.nombre}
                              </Link>
                              <span className="small text-muted">{item.categoria}</span>
                            </td>
                            <td className="text-end small">
                              {formatPrice(item.precio)}
                            </td>
                            <td className="text-center">
                              <QuantitySelector
                                value={item.cantidad}
                                onChange={(val) => updateQuantity(item.id, val)}
                                size="sm"
                              />
                            </td>
                            <td className="text-end fw-bold small" style={{ color: 'var(--color-caramelo)' }}>
                              {formatPrice(item.subtotal)}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger py-0 px-2"
                                title="Eliminar producto"
                                onClick={() => removeItem(item.id)}
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
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
                )}
                <div className="mt-2 small text-muted">
                  Cupones oficiales: <code style={{ color: 'var(--color-caramelo)' }}>FELICES50</code> (50% OFF para mayores de 50) | <code style={{ color: 'var(--color-caramelo)' }}>DUOC10</code> (10% OFF Convenio Duoc UC)
                </div>
              </div>
            </div>

            {/* Resumen del Pedido */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '100px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
                  Resumen de Compra
                </h5>

                <ul className="list-group list-group-flush mb-3 small">
                  <li className="list-group-item d-flex justify-content-between px-0 bg-transparent border-0">
                    <span className="text-muted">Subtotal ({totals.itemsCount} productos):</span>
                    <span>{formatPrice(totals.subtotal)}</span>
                  </li>

                  {totals.descuento > 0 && (
                    <li className="list-group-item d-flex justify-content-between px-0 text-danger fw-bold bg-transparent border-0">
                      <span>Descuento cupón:</span>
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
                      {totals.envio === 0 ? (
                        <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>Gratis</span>
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
                  <i className="bi bi-credit-card me-2"></i>Ir a Pagar
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