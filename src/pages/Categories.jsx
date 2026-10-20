import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService, productService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';

export default function Categories() {
  const { categoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const allCats = categoryService.getAll();
    setCategories(allCats);

    if (categoryName) {
      setActiveCategory(decodeURIComponent(categoryName));
    } else if (allCats.length > 0) {
      setActiveCategory(allCats[0].nombre);
    }
  }, [categoryName]);

  useEffect(() => {
    if (activeCategory) {
      const prods = productService.getByCategory(activeCategory);
      setProducts(prods);
    }
  }, [activeCategory]);

  const currentCatObj = categories.find(c => c.nombre.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/categorias">Categorías</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{activeCategory || 'Secciones'}</li>
        </ol>
      </nav>

      <div className="text-center mb-5">
        <span className="badge bg-warning text-dark px-3 py-2 text-uppercase mb-2">Especialidades</span>
        <h1 className="fw-bold font-serif display-5 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Categorías de Pastelería
        </h1>
        <p className="text-muted">
          Selecciona una categoría para explorar nuestra repostería artesanal preparada con dedicación.
        </p>
      </div>

      {/* Grid superior de categorías (Figura 4 de la pauta) */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3 mb-5">
        {categories.map((cat) => {
          const isSelected = cat.nombre.toLowerCase() === activeCategory.toLowerCase();
          return (
            <div key={cat.id} className="col">
              <button
                type="button"
                onClick={() => setActiveCategory(cat.nombre)}
                className={`card w-100 text-center p-3 border-0 shadow-sm transition-all h-100 text-decoration-none ${isSelected ? 'bg-primary text-white shadow' : 'bg-light text-dark'}`}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="rounded-circle mx-auto mb-2 overflow-hidden bg-white shadow-sm"
                  style={{ width: '65px', height: '65px' }}
                >
                  <img
                    src={cat.imagen || '/img/torta-mil-sabores.png'}
                    alt={cat.nombre}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/torta-mil-sabores.png';
                    }}
                  />
                </div>
                <div className={`fw-bold small ${isSelected ? 'text-white' : 'text-dark'}`}>
                  {cat.nombre}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Sección de la categoría activa (Figura 4) */}
      <div className="border-top pt-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <div>
            <h2 className="fw-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
              {activeCategory}
            </h2>
            {currentCatObj && (
              <p className="text-muted small mb-0">{currentCatObj.descripcion}</p>
            )}
          </div>
          <span className="badge bg-secondary fs-6 mt-2 mt-md-0">
            {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="alert alert-info text-center p-4">
            No hay productos registrados en esta categoría por el momento.
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map((prod) => (
              <div key={prod.id} className="col">
                <ProductCard product={prod} onAddToCart={addItem} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
