import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/cart/QuantitySelector';
import AlertMessage from '../components/common/AlertMessage';

export default function Cart() {
  const { cart, totals, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon, couponCode } = useCart();
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

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Carrito de Compras</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="font-pacifico mb-0" style={{ color: 'var(--color-chocolate)' }}>
          Carrito de Compras
        </h1>
        {cart.length > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
            <i className="bi bi-trash3 me-1"></i>Vaciar Carrito
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="card text-center p-5 border-0 shadow-sm">
          <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
          <h4>Tu carrito de compras está vacío</h4>
          <p className="text-muted small">
            Explora nuestro catálogo y agrega tus tortas y postres favoritos.
          </p>
          <div>
            <Link to="/productos" className="btn btn-primary px-4">
              <i className="bi bi-shop me-2"></i>Ir al Catálogo
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Tabla de Productos del Carrito (Figura 5 de la pauta) */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead className="table-light small text-uppercase">
                      <tr>
                        <th style={{ width: '80px' }}>Imagen</th>
                        <th>Nombre</th>
                        <th className="text-end" style={{ width: '110px' }}>Precio</th>
                        <th className="text-center" style={{ width: '130px' }}>Cantidad</th>
                        <th className="text-end" style={{ width: '110px' }}>Subtotal</th>
                        <th className="text-center" style={{ width: '70px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              src={item.imagen || '/img/torta-mil-sabores.png'}
                              alt={item.nombre}
                              width="60"
                              height="60"
                              className="rounded object-fit-contain p-1"
                              style={{ backgroundColor: '#F7EFE4' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/img/torta-mil-sabores.png';
                              }}
                            />
                          </td>
                          <td>
                            <Link to={`/producto/${item.id}`} className="text-decoration-none fw-bold small" style={{ color: 'var(--color-chocolate)' }}>
                              {item.nombre}
                            </Link>
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
                          <td className="text-end fw-bold small precio-chocolate">
                            {formatPrice(item.subtotal)}
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm py-0 px-2"
                              title="Eliminar producto"
                              onClick={() => removeItem(item.id)}
                            >
                              <i className="bi bi-x-lg"></i>
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
            <div className="card shadow-sm border-0 p-3">
              <h6 className="fw-bold mb-2" style={{ color: 'var(--color-chocolate)' }}>
                <i className="bi bi-tag-fill me-2" style={{ color: 'var(--color-chocolate)' }}></i>¿Tienes un cupón de descuento?
              </h6>
              {couponError && <AlertMessage message={couponError} type="danger" onClose={() => setCouponError('')} />}
              {couponSuccess && <AlertMessage message={couponSuccess} type="success" onClose={() => setCouponSuccess('')} />}

              {totals.cupon ? (
                <div className="d-flex align-items-center justify-content-between p-2 rounded border" style={{ backgroundColor: 'rgba(255, 192, 203, 0.35)', borderColor: 'var(--color-rosa)' }}>
                  <div className="small">
                    <strong>{totals.cupon.codigo}</strong>: {totals.cupon.nombre}
                  </div>
                  <button className="btn btn-outline-danger btn-sm py-0" onClick={removeCoupon}>
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej: FELICES50, DUOC10, ESPECIAL18"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-sm text-nowrap">
                    Aplicar Cupón
                  </button>
                </form>
              )}
              <div className="mt-2 small text-muted">
                Cupones disponibles: <code>FELICES50</code> (50% OFF) | <code>DUOC10</code> (10% OFF) | <code>ESPECIAL18</code> (15% OFF)
              </div>
            </div>
          </div>

          {/* Resumen del Pedido (Figura 5) */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-3 sticky-top" style={{ top: '90px' }}>
              <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-chocolate)' }}>
                Resumen de Compra
              </h5>

              <ul className="list-group list-group-flush mb-3 small">
                <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                  <span className="text-muted">Subtotal ({totals.itemsCount} productos):</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </li>

                {totals.descuento > 0 && (
                  <li className="list-group-item d-flex justify-content-between px-0 text-danger fw-bold bg-transparent">
                    <span>Descuento aplicado:</span>
                    <span>-{formatPrice(totals.descuento)}</span>
                  </li>
                )}

                <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                  <span className="text-muted">IVA (19% incluido):</span>
                  <span>{formatPrice(totals.iva)}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between px-0 bg-transparent">
                  <span className="text-muted">Costo de Despacho:</span>
                  <span>
                    {totals.envio === 0 ? (
                      <span className="badge" style={{ backgroundColor: 'var(--color-exito)', color: '#FFFFFF' }}>Gratis</span>
                    ) : (
                      formatPrice(totals.envio)
                    )}
                  </span>
                </li>

                <li className="list-group-item d-flex justify-content-between px-0 fs-5 fw-bold border-top pt-2 bg-transparent">
                  <span>Total:</span>
                  <span className="precio-chocolate">{formatPrice(totals.total)}</span>
                </li>
              </ul>

              <button
                type="button"
                className="btn btn-primary btn-lg w-100 shadow-sm"
                onClick={handleProceedToCheckout}
              >
                <i className="bi bi-credit-card me-2"></i>Comprar ahora
              </button>

              <div className="text-center mt-3">
                <Link to="/productos" className="small text-muted text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
