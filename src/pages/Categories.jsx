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
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/categorias" style={{ color: 'var(--color-espresso)' }}>Categorías</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>{activeCategory || 'Secciones'}</li>
          </ol>
        </nav>

        <div className="text-center mb-5">
          <span className="seccion-baker-eyebrow">
            Familias & Especialidades
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3rem)' }}>
            Nuestras Categorías
          </h1>
          <div className="adorno-baker" />
          <p className="seccion-baker-desc" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Explora cada una de nuestras líneas de pastelería fina, elaboradas a mano con materias primas nobles y recetas de tradición.
          </p>
        </div>

        {/* Grid de selector de categorías */}
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-3 mb-5">
          {categories.map((cat) => {
            const isSelected = cat.nombre.toLowerCase() === activeCategory.toLowerCase();
            return (
              <div key={cat.id} className="col">
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat.nombre)}
                  className={`card w-100 text-center p-3 transition-all h-100 text-decoration-none ${isSelected ? 'shadow' : ''}`}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--color-espresso)' : '#FFFFFF',
                    borderColor: isSelected ? 'var(--color-espresso)' : 'var(--color-borde)',
                    borderRadius: '8px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div
                    className="rounded-circle mx-auto mb-2 overflow-hidden shadow-sm"
                    style={{ width: '68px', height: '68px', border: '2px solid var(--color-borde)', backgroundColor: '#FAF7F2' }}
                  >
                    <img
                      src={cat.imagen || 'img/torta-mil-sabores.png'}
                      alt={cat.nombre}
                      className="w-100 h-100 object-fit-contain p-1"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'img/torta-mil-sabores.png';
                      }}
                    />
                  </div>
                  <div className="fw-bold small" style={{ color: isSelected ? '#FFFFFF' : 'var(--color-espresso)', fontSize: '0.82rem' }}>
                    {cat.nombre}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Sección de la categoría activa */}
        <div className="border-top pt-5" style={{ borderColor: 'var(--color-borde)' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <div>
              <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Línea Seleccionada</span>
              <h2 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
                {activeCategory}
              </h2>
              {currentCatObj && (
                <p className="text-muted small mb-0 mt-1">{currentCatObj.descripcion}</p>
              )}
            </div>
            <span className="badge px-3 py-2" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)', fontSize: '0.8rem' }}>
              {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm rounded-3" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}>
              <p className="text-muted mb-0">No hay productos registrados en esta categoría por el momento.</p>
            </div>
          ) : (
            <div className="grilla-productos">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}