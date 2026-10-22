import React, { useState, useEffect } from 'react';
import { productService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';

export default function Offers() {
  const [offerProducts, setOfferProducts] = useState([]);
  const [couponCopied, setCouponCopied] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const offers = productService.getOffers();
    setOfferProducts(offers);
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FELICES50');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2200);
  };

  return (
    <div className="catalogo-page" style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Hero Banner Promocional Full Width / Borde a Borde como en el Inicio */}
      <section className="ofertas-hero-banner">
        <div className="contenedor">
          <div className="ofertas-hero-contenido">
            <span className="ofertas-hero-eyebrow">
              Edición Limitada • Promociones del Mes
            </span>
            <h1 className="ofertas-hero-titulo">
              Ofertas Especiales del Maestro Pastelero
            </h1>
            <p className="ofertas-hero-desc">
              Disfruta de tus tortas y dulces favoritos con precios rebajados por tiempo limitado. Recuerda que mayores de 50 años acceden a un <strong>50% de descuento</strong> con el cupón oficial.
            </p>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="ofertas-cupon-badge">
                <span>Cupón de Descuento:</span>
                <span className="ofertas-cupon-codigo">FELICES50</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="btn btn-sm btn-outline-light"
                style={{ borderRadius: '20px', padding: '0.45rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {couponCopied ? '¡Cupón Copiado!' : 'Copiar Cupón'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Listado de Productos en Oferta con Grilla Continua */}
      <div className="contenedor" style={{ paddingTop: '3.5rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
              Selección con Descuento
            </span>
            <h2 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
              Productos en Promoción ({offerProducts.length})
            </h2>
          </div>
        </div>

        {offerProducts.length === 0 ? (
          <div className="card text-center p-5 border-0 shadow-sm rounded-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}>
            <p className="text-muted mb-0">No hay productos en oferta activa en este momento. Vuelve a consultar pronto.</p>
          </div>
        ) : (
          <div className="grilla-productos">
            {offerProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}