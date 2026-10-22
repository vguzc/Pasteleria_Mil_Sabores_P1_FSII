import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/db';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/cart/QuantitySelector';
import Button from '../components/common/Button';
import ProductCard from '../components/store/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [addedAlert, setAddedAlert] = useState(false);
  const { cart, addItem, openDrawer } = useCart();

  const itemInCart = product ? (cart || []).find(item => item.id === product.id) : null;
  const inCartQty = itemInCart ? itemInCart.cantidad : 0;
  const productStock = product && typeof product.stock === 'number' ? product.stock : 99;
  const availableStock = Math.max(0, productStock - inCartQty);
  const isMaxInCart = inCartQty >= productStock && productStock > 0;
  const isOutOfStock = productStock <= 0;

  useEffect(() => {
    const found = productService.getById(id);
    if (found) {
      setProduct(found);
      setQuantity(1);
      // Productos relacionados de la misma categoría
      const rel = productService.getByCategory(found.categoria).filter(p => p.id !== found.id);
      setRelated(rel.slice(0, 3));
    } else {
      navigate('/productos');
    }
  }, [id, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2500);
  };

  const formattedPrice = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(product.precio);
  const formattedOldPrice = product.precioAnterior
    ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(product.precioAnterior)
    : null;

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 5rem 0' }}>
      <div className="contenedor">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/productos" style={{ color: 'var(--color-espresso)' }}>Catálogo</Link></li>
            <li className="breadcrumb-item"><Link to={`/productos?categoria=${encodeURIComponent(product.categoria)}`} style={{ color: 'var(--color-espresso)' }}>{product.categoria}</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>{product.nombre}</li>
          </ol>
        </nav>

        {addedAlert && (
          <div
            className="alert d-flex align-items-center justify-content-between shadow-sm mb-4"
            style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)', borderRadius: '8px' }}
          >
            <div>
              <i className="bi bi-check-circle-fill me-2 fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
              ¡Se agregaron <strong>{quantity}</strong> unidad(es) de <strong>{product.nombre}</strong> a tu bolsa!
            </div>
            <button
              type="button"
              className="btn btn-sm"
              style={{ backgroundColor: 'var(--color-espresso)', color: '#FFFFFF', fontWeight: 600 }}
              onClick={openDrawer}
            >
              Ver Bolsa Desplegable
            </button>
          </div>
        )}

        <div className="row g-5 align-items-center">
          {/* Imagen Principal */}
          <div className="col-lg-6">
            <div
              className="card border-0 shadow-sm p-4 text-center"
              style={{ backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px solid var(--color-borde)' }}
            >
              <img
                src={product.imagen || '/img/torta-mil-sabores.png'}
                alt={product.nombre}
                className="img-fluid mx-auto"
                style={{ maxHeight: '420px', objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(44, 30, 22, 0.08))' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/torta-mil-sabores.png';
                }}
              />
            </div>
          </div>

          {/* Ficha técnica y compra */}
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <div className="mb-2">
              <span className="tarjeta-baker-categoria d-inline-block me-3">{product.categoria}</span>
              {product.enOferta && <span className="badge-oferta-baker d-inline-block position-static">OFERTA ESPECIAL</span>}
              <span className="badge ms-2" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                Código: {product.id}
              </span>
            </div>

            <h1 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: 'clamp(2rem, 3.2vw, 2.75rem)' }}>
              {product.nombre}
            </h1>

            <div className="d-flex align-items-baseline gap-3 mb-3">
              <span className="display-6 fw-bold" style={{ color: 'var(--color-caramelo)', fontFamily: 'var(--fuente-texto)' }}>
                {formattedPrice}
              </span>
              {formattedOldPrice && (
                <span className="text-decoration-line-through text-muted fs-5">
                  {formattedOldPrice}
                </span>
              )}
            </div>

            <p className="text-muted mb-4 small" style={{ lineHeight: 1.7 }}>
              {product.descripcion}
            </p>

            <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-muted">Disponibilidad Pastelera:</span>
                <strong style={{ color: isOutOfStock || isMaxInCart ? '#B54234' : productStock <= 5 ? '#B54234' : '#2D6A4F' }}>
                  {isOutOfStock
                    ? 'Agotado temporalmente'
                    : isMaxInCart
                      ? `Stock máximo alcanzado (${productStock} unid. en bolsa)`
                      : inCartQty > 0
                        ? `${availableStock} unidades disponibles (${inCartQty} en tu bolsa)`
                        : `${productStock} unidades frescas listas para retiro o despacho`}
                </strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="small text-muted">Tiempo de Elaboración & Despacho:</span>
                <span className="small fw-semibold" style={{ color: 'var(--color-espresso)' }}>Mismo día o fecha agendada</span>
              </div>
            </div>

            {/* Selector de cantidad y botones */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <div>
                <label className="form-label small fw-bold d-block mb-1" style={{ color: 'var(--color-espresso)' }}>Cantidad:</label>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={Math.max(1, availableStock)}
                />
              </div>
              <div className="flex-grow-1 align-self-end">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 btn-baker"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isMaxInCart || availableStock <= 0}
                  icon={isMaxInCart ? 'bi bi-lock' : 'bi bi-bag-plus'}
                >
                  {isOutOfStock
                    ? 'Agotado'
                    : isMaxInCart
                      ? 'Stock Máximo en Carrito'
                      : 'Agregar a la Bolsa'}
                </Button>
              </div>
            </div>

            <div className="d-flex gap-4 border-top pt-3 small text-muted" style={{ borderColor: 'var(--color-borde)' }}>
              <div><i className="bi bi-shield-check me-1" style={{ color: 'var(--color-caramelo)' }}></i>Pago 100% Seguro</div>
              <div><i className="bi bi-truck me-1" style={{ color: 'var(--color-caramelo)' }}></i>Cadena de Frío Garantizada</div>
              <div><i className="bi bi-clock me-1" style={{ color: 'var(--color-caramelo)' }}></i>Horneado Diario</div>
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {related.length > 0 && (
          <section className="mt-5 pt-5 border-top" style={{ borderColor: 'var(--color-borde)' }}>
            <div className="text-center mb-4">
              <span className="seccion-baker-eyebrow">Complementos Ideales</span>
              <h3 className="seccion-baker-titulo" style={{ fontSize: '2rem' }}>
                También te podría gustar
              </h3>
              <div className="adorno-baker" />
            </div>
            <div className="grilla-productos">
              {related.map((relProd) => (
                <ProductCard key={relProd.id} product={relProd} onAddToCart={addItem} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}