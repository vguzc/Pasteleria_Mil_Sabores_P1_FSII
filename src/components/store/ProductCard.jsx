import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Tarjeta de Producto (ProductCard)
 * Presentación inspirada en Baker (Qode Interactive) con tipografía refinada,
 * fotografía limpia aislada, categoría eyebrow, estrellas de valoración y botón elegante.
 */
export default function ProductCard({ product, onAddToCart }) {
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      setAgregadoAnim(true);
      setTimeout(() => setAgregadoAnim(false), 1400);
    }
  };

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(product.precio);

  return (
    <article className="tarjeta-producto-baker" data-id={product.id}>
      {/* 1. Contenedor de Imagen Limpio */}
      <div className="tarjeta-baker-img-wrap">
        {product.enOferta ? (
          <span className="badge-oferta-baker">OFERTA</span>
        ) : product.destacado ? (
          <span className="badge-marca-mas-vendido">MÁS VENDIDO</span>
        ) : product.categoria && product.categoria.toLowerCase().includes('gluten') ? (
          <span className="badge-marca-sin-gluten">SIN GLUTEN</span>
        ) : product.categoria && product.categoria.toLowerCase().includes('vegano') ? (
          <span className="badge-marca-vegano">VEGANO</span>
        ) : null}
        <Link to={`/producto/${product.id}`} className="tarjeta-baker-img-link" title={`Ver detalle de ${product.nombre}`}>
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

      {/* 2. Cuerpo con Tipografía Baker */}
      <div className="tarjeta-baker-cuerpo">
        {/* Categoría Eyebrow */}
        <span className="tarjeta-baker-categoria">
          {product.categoria}
        </span>

        {/* Título en Mayúsculas con Espaciado Fino */}
        <h3 className="tarjeta-baker-titulo">
          <Link to={`/producto/${product.id}`}>{product.nombre}</Link>
        </h3>

        {/* Estrellas de Calidad */}
        <div className="tarjeta-baker-estrellas" aria-label="Calificación 5 de 5 estrellas">
          <span>★★★★★</span>
        </div>

        {/* Breve descripción */}
        {product.descripcion && (
          <p className="tarjeta-baker-descripcion">{product.descripcion}</p>
        )}

        {/* Precio Prominente */}
        <div className="tarjeta-baker-precio-wrap">
          <span className="tarjeta-baker-precio">{formattedPrice}</span>
        </div>

        {/* Botón de Acción Principal (+ Agregar) y Enlace de Detalle */}
        <div className="tarjeta-baker-acciones">
          <button
            type="button"
            className={`btn-baker-agregar ${agregadoAnim ? 'agregado' : ''}`}
            onClick={handleAdd}
            disabled={product.stock <= 0}
          >
            {agregadoAnim ? '¡Agregado!' : '+ Agregar'}
          </button>
          <Link
            to={`/producto/${product.id}`}
            className="tarjeta-baker-detalle-link"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
