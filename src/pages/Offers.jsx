import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';

export default function Offers() {
  const [offerProducts, setOfferProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const offers = productService.getOffers();
    setOfferProducts(offers);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>Ofertas Especiales</li>
          </ol>
        </nav>

        {/* Banner promocional estilo Baker con fotografía */}
        <div
          className="p-5 mb-5 rounded-3 position-relative overflow-hidden shadow-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(32, 22, 16, 0.92) 0%, rgba(44, 30, 22, 0.85) 100%), url(/img/slider/slide-4-cookies.jpg) center/cover no-repeat',
            color: '#FFFFFF',
            border: '1px solid var(--color-borde)'
          }}
        >
          <div className="position-relative z-1" style={{ maxWidth: '680px' }}>
            <span className="seccion-baker-eyebrow d-block mb-2" style={{ color: 'var(--color-caramelo)' }}>
              Edición Limitada • Promociones del Mes
            </span>
            <h1 className="seccion-baker-titulo text-white mb-3" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)' }}>
              Ofertas Especiales del Obrador
            </h1>
            <p className="lead mb-4" style={{ color: '#E2D7CC', fontSize: '1rem', lineHeight: 1.7 }}>
              Disfruta de tus tortas y dulces favoritos con precios rebajados por tiempo limitado. Recuerda que mayores de 50 años acceden a un <strong>50% de descuento</strong> con el cupón <code>FELICES50</code>.
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Selección con Descuento</span>
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