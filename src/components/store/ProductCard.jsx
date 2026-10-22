import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Tarjeta de Producto (ProductCard)
 * Inspirado en el diseño minimalista de Factory Nine:
 * - Fotografía 1:1 sobre fondo neutro cálido
 * - Tipografía limpia, alineada estrictamente a la izquierda
 * - Selector interactivo de porciones (1P, 8P, 20P) en círculos modernos
 * - Precio prominente y botón "+ Agregar" de alta usabilidad
 */
export default function ProductCard({ product, onAddToCart }) {
  const [agregadoAnim, setAgregadoAnim] = useState(false);
  const [porcion, setPorcion] = useState('1P');

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

  // Opciones de formato/porción estilo Factory Nine
  const getPortions = () => {
    const cat = (product.categoria || '').toLowerCase();
    if (cat.includes('individual') || cat.includes('tradicional')) {
      return ['1P', '4P', '8P'];
    }
    return ['1P', '8P', '20P'];
  };

  const porciones = getPortions();

  return (
    <article className="tarjeta-producto-baker" data-id={product.id}>
      {/* 1. Fotografía Cuadrada Estilo Factory Nine */}
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

        <Link
          to={`/producto/${product.id}`}
          className="tarjeta-baker-img-link w-100 h-100 d-flex align-items-center justify-content-center"
          title={`Ver detalle de ${product.nombre}`}
        >
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

      {/* 2. Cuerpo Alineado a la Izquierda (Estilo Factory Nine) */}
      <div className="tarjeta-baker-cuerpo">
        {/* Categoría Eyebrow */}
        <span className="tarjeta-baker-categoria">
          {product.categoria}
        </span>

        {/* Título en Negrita */}
        <h3 className="tarjeta-baker-titulo">
          <Link to={`/producto/${product.id}`}>{product.nombre}</Link>
        </h3>

        {/* Precio Prominente */}
        <div className="tarjeta-baker-precio-wrap">
          <span className="tarjeta-baker-precio">{formattedPrice}</span>
        </div>

        {/* Breve descripción */}
        {product.descripcion && (
          <p className="tarjeta-baker-descripcion">{product.descripcion}</p>
        )}

        {/* 3. Fila de Acciones: Selectores de Porciones Círculos + Botón + Agregar */}
        <div className="tarjeta-baker-acciones">
          <div className="card-fn-porciones" aria-label="Seleccionar porción o formato">
            {porciones.map((p) => (
              <button
                key={p}
                type="button"
                className={`btn-fn-circulo ${porcion === p ? 'activo' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPorcion(p);
                }}
                title={`Formato ${p}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`btn-baker-agregar ${agregadoAnim ? 'agregado' : ''}`}
            onClick={handleAdd}
            disabled={product.stock <= 0}
          >
            {agregadoAnim ? '¡Agregado!' : '+ Agregar'}
          </button>
        </div>
      </div>
    </article>
  );
}
