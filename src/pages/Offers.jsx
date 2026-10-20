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

      {/* Banner promocional */}
      <div className="p-5 mb-5 rounded-4 bg-danger text-white position-relative overflow-hidden shadow">
        <div className="position-relative z-1" style={{ maxWidth: '650px' }}>
          <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-3">
            Descuentos Imperdibles
          </span>
          <h1 className="display-5 fw-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Aprovecha Nuestras Ofertas del Mes
          </h1>
          <p className="lead mb-4">
            Disfruta de tus tortas y especialidades favoritas con precios rebajados por tiempo limitado. ¡No olvides ingresar el cupón <strong>FELICES50</strong> para 50% de descuento en tu primera compra si tienes 50+ años!
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold font-serif mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>
          Productos en Promoción ({offerProducts.length})
        </h2>
      </div>

      {offerProducts.length === 0 ? (
        <div className="alert alert-info text-center p-5">
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
