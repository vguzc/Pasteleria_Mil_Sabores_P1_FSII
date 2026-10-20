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
  const { addItem } = useCart();

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

  const formattedPrice = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.precio);
  const formattedOldPrice = product.precioAnterior
    ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.precioAnterior)
    : null;

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Catálogo</Link></li>
          <li className="breadcrumb-item"><Link to={`/categoria/${encodeURIComponent(product.categoria)}`}>{product.categoria}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.nombre}</li>
        </ol>
      </nav>

      {addedAlert && (
        <div className="alert alert-success d-flex align-items-center justify-content-between shadow-sm mb-4">
          <div>
            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
            ¡Se agregaron <strong>{quantity}</strong> unidad(es) de <strong>{product.nombre}</strong> al carrito!
          </div>
          <Link to="/carrito" className="btn btn-sm btn-success">
            Ver Carrito e Ir a Pagar
          </Link>
        </div>
      )}

      <div className="row g-5">
        {/* Imagen Principal */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4 bg-light text-center rounded-4">
            <img
              src={product.imagen || '/img/torta-mil-sabores.png'}
              alt={product.nombre}
              className="img-fluid mx-auto rounded-3"
              style={{ maxHeight: '420px', objectFit: 'contain' }}
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
            <span className="badge bg-warning text-dark me-2">{product.categoria}</span>
            {product.enOferta && <span className="badge bg-danger">OFERTA ESPECIAL</span>}
            <span className="badge bg-secondary ms-2">Código: {product.id}</span>
          </div>

          <h1 className="fw-bold display-6 font-serif mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            {product.nombre}
          </h1>

          <div className="d-flex align-items-baseline gap-3 mb-3">
            <span className="display-6 fw-bold text-primary">{formattedPrice}</span>
            {formattedOldPrice && (
              <span className="text-decoration-line-through text-muted fs-5">
                {formattedOldPrice}
              </span>
            )}
          </div>

          <p className="lead text-muted mb-4 small">
            {product.descripcion}
          </p>

          <div className="p-3 bg-light rounded-3 mb-4 border">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small text-muted">Disponibilidad en Taller:</span>
              <strong className={product.stock <= 5 ? 'text-danger' : 'text-success'}>
                {product.stock > 0 ? `${product.stock} unidades en stock` : 'Agotado'}
              </strong>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-muted">Tiempo de Despacho:</span>
              <span className="small fw-semibold">24 a 48 hrs hábiles</span>
            </div>
          </div>

          {/* Selector de cantidad y botones */}
          <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
            <div>
              <label className="form-label small fw-bold d-block mb-1">Cantidad:</label>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={Math.max(1, product.stock)}
              />
            </div>
            <div className="flex-grow-1 align-self-end">
              <Button
                variant="primary"
                size="lg"
                className="w-100 shadow-sm"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                icon="bi bi-cart-plus-fill"
              >
                Agregar al Carrito
              </Button>
            </div>
          </div>

          <div className="d-flex gap-4 border-top pt-3 small text-muted">
            <div><i className="bi bi-shield-check text-success me-1"></i>Pago 100% Seguro</div>
            <div><i className="bi bi-truck text-primary me-1"></i>Cadena de Frío Garantizada</div>
            <div><i className="bi bi-heart-fill text-danger me-1"></i>Receta Artesanal Chilena</div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {related.length > 0 && (
        <section className="mt-5 pt-5 border-top">
          <h3 className="fw-bold font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            También te podría gustar
          </h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {related.map((relProd) => (
              <div key={relProd.id} className="col">
                <ProductCard product={relProd} onAddToCart={addItem} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
