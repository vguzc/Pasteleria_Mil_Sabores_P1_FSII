import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Tarjeta de Producto (ProductCard)
 * Presentación inspirada en Baker con tipografía Fraunces y botones refinados.
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

  return (
    <article className="tarjeta-producto" data-id={product.id}>
      <div className="tarjeta-imagen-wrapper">
        <span className="badge-categoria">{product.categoria}</span>
        {product.enOferta && (
          <span className="badge-oferta">OFERTA</span>
        )}
        <Link to={`/producto/${product.id}`} className="imagen-contenedor-link d-block h-100 w-100">
          <img
            src={product.imagen || '/img/torta-mil-sabores.png'}
            alt={product.nombre}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/torta-mil-sabores.png';
            }}
          />
        </Link>
      </div>

      <div className="tarjeta-cuerpo">
        <h3 className="tarjeta-titulo">
          <Link to={`/producto/${product.id}`}>{product.nombre}</Link>
        </h3>
        <p className="tarjeta-descripcion">{product.descripcion}</p>
        <div className="tarjeta-footer">
          <span className="tarjeta-precio">{formattedPrice}</span>
          <div className="tarjeta-acciones">
            <Link
              to={`/producto/${product.id}`}
              className="boton boton-secundario btn-card-action"
            >
              Ver detalle
            </Link>
            <button
              type="button"
              className="boton boton-primario btn-card-action btn-agregar-rapido"
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              {agregadoAnim ? 'Agregado' : '+ Agregar'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
