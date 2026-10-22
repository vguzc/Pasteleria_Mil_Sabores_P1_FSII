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
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Ofertas Especiales</li>
        </ol>
      </nav>

      {/* Banner promocional con colores oficiales */}
      <div
        className="p-5 mb-5 rounded-4 position-relative overflow-hidden shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #8B4513 0%, #6B3410 60%, #FFC0CB 100%)',
          color: '#FFFFFF'
        }}
      >
        <div className="position-relative z-1" style={{ maxWidth: '650px' }}>
          <span className="badge px-3 py-2 text-uppercase fw-bold mb-3" style={{ backgroundColor: 'var(--color-rosa)', color: 'var(--color-chocolate)' }}>
            Descuentos Imperdibles
          </span>
          <h1 className="display-5 font-pacifico mb-3 text-white">
            Aprovecha Nuestras Ofertas del Mes
          </h1>
          <p className="lead mb-4" style={{ color: '#FFF5E1' }}>
            Disfruta de tus tortas y especialidades favoritas con precios rebajados por tiempo limitado. ¡No olvides ingresar el cupón <strong>FELICES50</strong> para 50% de descuento en tu compra si tienes 50+ años!
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="font-pacifico mb-0" style={{ color: 'var(--color-chocolate)' }}>
          Productos en Promoción ({offerProducts.length})
        </h2>
      </div>

      {offerProducts.length === 0 ? (
        <div className="card text-center p-5 border-0 shadow-sm">
          No hay productos en oferta activa en este momento. Vuelve a consultar pronto.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {offerProducts.map((prod) => (
            <div key={prod.id} className="col">
              <ProductCard product={prod} onAddToCart={addItem} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
