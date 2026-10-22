import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService, categoryService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('destacados');

  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  useEffect(() => {
    setProducts(productService.getAll());
    setCategories(categoryService.getAll());

    const urlSearch = searchParams.get('buscar');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
    const urlCat = searchParams.get('categoria');
    if (urlCat) {
      setSelectedCategory(urlCat);
    }
  }, [searchParams]);

  // Manejo de cambio de categoría
  const handleCategoryChange = (catName) => {
    setSelectedCategory(catName);
    if (catName === 'Todas') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', catName);
    }
    setSearchParams(searchParams);
  };

  // Filtrado y Ordenamiento
  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'Todas' || prod.categoria.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query ||
      prod.nombre.toLowerCase().includes(query) ||
      prod.descripcion.toLowerCase().includes(query) ||
      prod.categoria.toLowerCase().includes(query);

    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'precio-asc') return a.precio - b.precio;
    if (sortBy === 'precio-desc') return b.precio - a.precio;
    if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
    return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0);
  });

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Encabezado Hero del Catálogo Estilo Baker */}
      <section className="catalogo-baker-header">
        <div className="contenedor">
          <nav aria-label="breadcrumb" className="mb-3">
            <ol className="breadcrumb small justify-content-center mb-2">
              <li className="breadcrumb-item">
                <Link to="/" style={{ color: 'var(--color-espresso)', textDecoration: 'none' }}>Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>
                Catálogo de Productos
              </li>
            </ol>
          </nav>

          <span className="seccion-baker-eyebrow">Repostería Artesanal & Cafetería</span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)' }}>
            Nuestro Catálogo
          </h1>
          <div className="adorno-baker" />
          <p className="seccion-baker-desc" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Descubre nuestras elaboraciones artesanales preparadas cada día con materias primas nobles y recetas tradicionales desde 1976.
          </p>

          {/* 2. Barra de Categorías Horizontal Estilo Baker (media_1792645642426_83a1e297.png) */}
          <nav className="catalogo-filtros-nav" aria-label="Filtro por categorías">
            <button
              type="button"
              className={`btn-filtro-cat ${selectedCategory === 'Todas' ? 'activo' : ''}`}
              onClick={() => handleCategoryChange('Todas')}
            >
              Todas ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn-filtro-cat ${selectedCategory.toLowerCase() === cat.nombre.toLowerCase() ? 'activo' : ''}`}
                  onClick={() => handleCategoryChange(cat.nombre)}
                >
                  {cat.nombre} ({count})
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* 3. Barra de Controles: Búsqueda, Contador y Ordenador */}
      <div className="contenedor" style={{ paddingTop: '2.5rem' }}>
        <div className="catalogo-toolbar">
          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="catalogo-search-input"
              placeholder="Buscar por torta, alfajor, ingrediente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar producto"
            />
            {searchTerm && (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted d-none d-md-inline">
              Mostrando <strong>{filteredProducts.length}</strong> producto{filteredProducts.length !== 1 ? 's' : ''}
            </span>

            <select
              className="catalogo-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Ordenar productos"
            >
              <option value="destacados">Destacados primero</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre">Nombre (A - Z)</option>
            </select>
          </div>
        </div>

        {/* 4. Grilla de Productos */}
        {filteredProducts.length === 0 ? (
          <div
            className="text-center py-5 px-3 rounded-3"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', maxWidth: '580px', margin: '2rem auto' }}
          >
            <div style={{ width: '60px', height: '60px', margin: '0 auto 1rem', borderRadius: '50%', backgroundColor: '#F3ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.45rem' }}>
              No encontramos delicias para esa búsqueda
            </h3>
            <p className="text-muted small mb-4">
              Prueba cambiando la palabra clave o seleccionando otra categoría en el menú superior.
            </p>
            <button
              type="button"
              className="boton boton-primario btn-baker"
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchTerm('');
              }}
            >
              Ver Todas las Delicias
            </button>
          </div>
        ) : (
          <div className="grilla-productos">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}