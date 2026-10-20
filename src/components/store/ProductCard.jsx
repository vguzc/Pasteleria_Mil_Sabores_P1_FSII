import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

/**
 * Componente ProductCard: Presenta un producto con su foto, categoría, precio en CLP y acciones.
 * Principio Single Responsibility: Maneja la visualización de un ítem individual y su feedback de agregado.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setAgregadoAnim(true);
      setTimeout(() => setAgregadoAnim(false), 1200);
    }
  };

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(product.precio);

  const formattedOldPrice = product.precioAnterior
    ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(product.precioAnterior)
    : null;

  return (
    <div className="card h-100 shadow-sm border-0 product-card transition-all">
      <div className="position-relative overflow-hidden bg-light text-center p-3" style={{ height: '220px' }}>
        {product.enOferta && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-2 px-2 py-1 shadow-sm">
            <i className="bi bi-tag-fill me-1"></i>OFERTA
          </span>
        )}
        <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2 px-2 py-1 shadow-sm">
          {product.categoria}
        </span>
        <Link to={`/producto/${product.id}`} className="d-block h-100 w-100">
          <img
            src={product.imagen || '/img/torta-mil-sabores.png'}
            alt={product.nombre}
            className="img-fluid h-100 object-fit-contain transition-transform"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/torta-mil-sabores.png';
            }}
          />
        </Link>
      </div>
      <div className="card-body d-flex flex-column justify-content-between p-3">
        <div>
          <h5 className="card-title text-truncate-2 mb-2" title={product.nombre}>
            <Link to={`/producto/${product.id}`} className="text-decoration-none text-dark fw-bold">
              {product.nombre}
            </Link>
          </h5>
          <p className="card-text text-muted small text-truncate-2 mb-3">
            {product.descripcion}
          </p>
        </div>

        <div>
          <div className="d-flex align-items-baseline mb-2">
            <span className="fs-5 fw-bold text-primary">{formattedPrice}</span>
            {formattedOldPrice && (
              <span className="ms-2 text-decoration-line-through text-muted small">
                {formattedOldPrice}
              </span>
            )}
            <span className="ms-auto small text-muted">
              Stock: <strong className={product.stock <= 5 ? 'text-danger' : 'text-success'}>{product.stock}</strong>
            </span>
          </div>

          <div className="d-flex gap-2">
            <Link
              to={`/producto/${product.id}`}
              className="btn btn-outline-secondary btn-sm flex-grow-1"
            >
              Ver detalle
            </Link>
            <Button
              variant={agregadoAnim ? 'success' : 'primary'}
              size="sm"
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className="flex-grow-1"
              icon={agregadoAnim ? 'bi bi-check-lg' : 'bi bi-cart-plus'}
            >
              {agregadoAnim ? '¡Listo!' : '+ Agregar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
