import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/**
 * Componente Tarjeta de Producto (ProductCard)
 * Inspirado en el diseño minimalista de Factory Nine:
 * - Fotografía 1:1 sobre fondo neutro cálido
 * - Tipografía limpia, alineada estrictamente a la izquierda
 * - Selector interactivo de porciones (1P, 8P, 20P) con actualización dinámica de precio
 * - Control y reflejo de stock en tiempo real
 * - Precio prominente y botón "+ Agregar" de alta usabilidad
 */
export default function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  const { cart, openQuickView } = useCart();
  const itemInCart = (cart || []).find((item) => item.id === product.id);
  const inCartQty = itemInCart ? itemInCart.cantidad : 0;
  const productStock = typeof product.stock === 'number' ? product.stock : 99;
  const isOutOfStock = productStock <= 0;
  const isMaxInCart = inCartQty >= productStock && productStock > 0;
  const remainingStock = Math.max(0, productStock - inCartQty);

  // Configuración de porciones según el tipo de producto
  const portionConfig = useMemo(() => {
    const isCake = (product.categoria || '').toLowerCase().includes('torta') ||
                   (product.precio >= 15000);

    if (isCake) {
      return {
        options: ['1P', '8P', '20P'],
        defaultOption: '8P',
        multipliers: {
          '1P': 0.22, // Porción individual / trozo de torta
          '8P': 1.0,  // Formato mediano estándar (precio base)
          '20P': 1.65 // Formato grande de celebración
        }
      };
    }

    return {
      options: ['1P', '4P', '8P'],
      defaultOption: '1P',
      multipliers: {
        '1P': 1.0,  // Porción individual (precio base)
        '4P': 3.6,  // Caja pack 4
        '8P': 6.8   // Caja pack 8 familiar
      }
    };
  }, [product.categoria, product.precio]);

  const [porcion, setPorcion] = useState(portionConfig.defaultOption);
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  // Cálculo del precio según la porción activa
  const currentPrice = useMemo(() => {
    if (!product.precio) return 0;
    if (porcion === portionConfig.defaultOption) return product.precio;

    const mult = portionConfig.multipliers[porcion] || 1.0;
    const raw = product.precio * mult;
    const rounded = Math.round(raw / 100) * 100;
    return rounded > 90 ? rounded - 10 : rounded;
  }, [product.precio, porcion, portionConfig]);

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(currentPrice);

  const handleAdd = (e) => {
    if (e) e.stopPropagation();
    if (isOutOfStock || isMaxInCart) return;

    if (onAddToCart) {
      // Si la porción es la por defecto, pasamos el objeto original (invariante para tests)
      // Si el usuario seleccionó otra porción, enviamos el producto con su precio y formato calculados
      const itemToAdd = porcion === portionConfig.defaultOption
        ? product
        : {
            ...product,
            precio: currentPrice,
            nombre: `${product.nombre} (${porcion})`,
            porcion
          };

      onAddToCart(itemToAdd);
      setAgregadoAnim(true);
      setTimeout(() => setAgregadoAnim(false), 1400);
    }
  };

  const buttonLabel = isOutOfStock
    ? 'Agotado'
    : isMaxInCart
      ? 'Stock Máximo en Carro'
      : agregadoAnim
        ? '¡Agregado al Carro!'
        : '+ AGREGAR AL CARRO';

  return (
    <article className="tarjeta-producto-baker" data-id={product.id}>
      {/* 1. Fotografía Cuadrada Estilo Factory Nine */}
      <div className="tarjeta-baker-img-wrap">
        {isOutOfStock ? (
          <span className="badge-oferta-baker" style={{ backgroundColor: '#4A3B32' }}>AGOTADO</span>
        ) : product.enOferta ? (
          <span className="badge-oferta-baker">OFERTA</span>
        ) : product.destacado ? (
          <span className="badge-marca-mas-vendido">MÁS VENDIDO</span>
        ) : productStock <= 5 && productStock > 0 ? (
          <span className="badge-oferta-baker" style={{ backgroundColor: '#8B4513' }}>ÚLTIMAS {productStock} UNID.</span>
        ) : product.categoria && product.categoria.toLowerCase().includes('gluten') ? (
          <span className="badge-marca-sin-gluten">SIN GLUTEN</span>
        ) : product.categoria && product.categoria.toLowerCase().includes('vegano') ? (
          <span className="badge-marca-vegano">VEGANO</span>
        ) : null}

        <Link
          to={`/producto/${product.id}`}
          className="tarjeta-baker-img-link"
          title={`Ver detalle de ${product.nombre}`}
          onClick={(e) => {
            if (openQuickView) {
              e.preventDefault();
              openQuickView(product);
            }
          }}
        >
          <img
            src={product.imagen || 'img/torta-mil-sabores.png'}
            alt={product.nombre}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'img/torta-mil-sabores.png';
            }}
          />
        </Link>

        {/* Botón flotante Factory Nine: se desliza sobre la imagen al hacer hover */}
        <button
          type="button"
          className={`btn-fn-agregar-overlay ${agregadoAnim ? 'agregado' : ''}`}
          onClick={handleAdd}
          disabled={isOutOfStock || isMaxInCart}
          title={isOutOfStock ? 'Producto agotado' : isMaxInCart ? 'Has alcanzado el stock disponible' : `Agregar ${product.nombre} (${porcion}) al carro`}
        >
          {buttonLabel}
        </button>
      </div>

      {/* 2. Cuerpo Alineado a la Izquierda Estilo Factory Nine */}
      <div className="tarjeta-baker-cuerpo">
        {/* Categoría Eyebrow */}
        <span className="tarjeta-baker-categoria">
          {product.categoria}
        </span>

        {/* Título en Negrita */}
        <h3 className="tarjeta-baker-titulo">
          <Link
            to={`/producto/${product.id}`}
            onClick={(e) => {
              if (openQuickView) {
                e.preventDefault();
                openQuickView(product);
              }
            }}
          >
            {product.nombre}
          </Link>
        </h3>

        {/* Precio Prominente Dinámico directamente bajo el título */}
        <div className="tarjeta-baker-precio-wrap d-flex justify-content-between align-items-baseline">
          <span className="tarjeta-baker-precio">{formattedPrice}</span>
          {inCartQty > 0 && (
            <span className="small text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-caramelo)' }}>
              {inCartQty} en bolsa
            </span>
          )}
        </div>

        {/* Estado de stock en tiempo real */}
        <div className="tarjeta-baker-stock-info my-1">
          {isOutOfStock ? (
            <span className="small text-danger fw-semibold" style={{ fontSize: '0.75rem' }}>
              Sin stock disponible
            </span>
          ) : isMaxInCart ? (
            <span className="small text-muted fw-semibold" style={{ fontSize: '0.75rem', color: '#B54234' }}>
              Stock máximo alcanzado ({inCartQty}/{productStock})
            </span>
          ) : productStock <= 5 ? (
            <span className="small text-warning-emphasis fw-semibold" style={{ fontSize: '0.75rem', color: '#B54234' }}>
              Solo {productStock} disponibles
            </span>
          ) : inCartQty > 0 ? (
            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
              Disponibles: {remainingStock}
            </span>
          ) : null}
        </div>

        {/* Breve descripción en tono sutil */}
        {product.descripcion && (
          <p className="tarjeta-baker-descripcion">{product.descripcion}</p>
        )}

        {/* 3. Selector Circular de Porciones Factory Nine (1P, 8P, 20P) */}
        <div className="card-fn-porciones" aria-label="Seleccionar porción o formato">
          {portionConfig.options.map((p) => (
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
      </div>
    </article>
  );
}
