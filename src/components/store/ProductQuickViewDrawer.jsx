import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductQuickViewDrawer() {
  const { quickViewProduct, closeQuickView, addItem, openDrawer } = useCart();

  const product = quickViewProduct;

  // Configuración de porciones
  const portionConfig = useMemo(() => {
    if (!product) {
      return { options: ['1P', '8P', '20P'], defaultOption: '1P', multipliers: { '1P': 1.0, '8P': 1.0, '20P': 1.65 } };
    }
    const isCake = (product.categoria || '').toLowerCase().includes('torta') ||
                   (product.precio >= 15000);

    if (isCake) {
      return {
        options: ['1P', '8P', '20P'],
        defaultOption: '1P',
        multipliers: {
          '1P': 0.22,
          '8P': 1.0,
          '20P': 1.65
        }
      };
    }

    return {
      options: ['1P', '8P', '20P'],
      defaultOption: '1P',
      multipliers: {
        '1P': 1.0,
        '8P': 2.4,
        '20P': 4.5
      }
    };
  }, [product]);

  const [selectedPorcion, setSelectedPorcion] = useState('1P');

  useEffect(() => {
    if (product) {
      setSelectedPorcion(portionConfig.defaultOption || '1P');
    }
  }, [product, portionConfig]);

  // Cálculo del precio según porción
  const currentPrice = useMemo(() => {
    if (!product || !product.precio) return 0;
    const mult = portionConfig.multipliers[selectedPorcion] || 1.0;
    const raw = product.precio * mult;
    const rounded = Math.round(raw / 100) * 100;
    return rounded > 90 ? rounded - 10 : rounded;
  }, [product, selectedPorcion, portionConfig]);

  const formatPrice = (val) => '$' + Number(val || 0).toLocaleString('es-CL');

  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      ...product,
      id: selectedPorcion === '8P' && (product.categoria || '').toLowerCase().includes('torta')
        ? product.id
        : `${product.id}-${selectedPorcion}`,
      baseId: product.id,
      nombre: product.nombre,
      precio: currentPrice,
      porcion: selectedPorcion,
      imagen: product.imagen,
      categoria: product.categoria
    };

    addItem(itemToAdd, 1, false);
    closeQuickView();
    // Abre automáticamente el carrito rediseñado (Imagen 3)
    openDrawer();
  };

  const isOpen = Boolean(product);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`quickview-backdrop ${isOpen ? 'quickview-backdrop-visible' : ''}`}
        onClick={closeQuickView}
        aria-hidden="true"
      />

      {/* Slide Drawer */}
      <aside
        className={`quickview-drawer ${isOpen ? 'quickview-drawer-open' : ''}`}
        aria-label="Vista previa rápida del producto"
        aria-hidden={!isOpen}
      >
        {product && (
          <div className="quickview-drawer-inner">
            {/* Cabecera con botón cerrar circular blanco estilo Factory Nine */}
            <div className="quickview-image-container">
              <button
                type="button"
                className="quickview-btn-close"
                onClick={closeQuickView}
                aria-label="Cerrar vista previa"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <img
                src={product.imagen || '/img/torta-mil-sabores.png'}
                alt={product.nombre}
                className="quickview-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/torta-mil-sabores.png';
                }}
              />
            </div>

            {/* Contenido / Detalles con Estilo y Paleta Mil Sabores */}
            <div className="quickview-body">
              {product.categoria && (
                <span
                  style={{
                    fontSize: '0.74rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-caramelo)',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    display: 'block'
                  }}
                >
                  {product.categoria}
                </span>
              )}

              <h2 className="quickview-title">
                {product.nombre.toUpperCase()}
              </h2>

              <div className="quickview-price">
                {formatPrice(currentPrice)}
              </div>

              {/* Selector de porciones circular */}
              <div className="quickview-portion-section">
                <span className="quickview-portion-label">Tamaño</span>
                <div className="quickview-portion-pills">
                  {portionConfig.options.map((p) => {
                    const isSelected = selectedPorcion === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`quickview-pill-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedPorcion(p)}
                        aria-pressed={isSelected}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descripción */}
              <div className="quickview-description">
                {product.descripcion || 'Elaborado artesanalmente en nuestro taller con recetas tradicionales e ingredientes seleccionados de primera calidad.'}
              </div>

              {/* Botón Agregar al carro con estética Mil Sabores */}
              <div className="quickview-action">
                <button
                  type="button"
                  className="quickview-btn-add"
                  onClick={handleAddToCart}
                >
                  Agregar al carro
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
