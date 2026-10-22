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
  const [viewMode, setViewMode] = useState('secciones'); // 'secciones' (agrupado por categoría) | 'grilla' (continua)

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

  const handleResetFilters = () => {
    setSelectedCategory('Todas');
    setSearchTerm('');
    searchParams.delete('categoria');
    searchParams.delete('buscar');
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

  const isFiltered = selectedCategory !== 'Todas' || searchTerm.trim() !== '';
  const showSections = viewMode === 'secciones' && !isFiltered;

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Encabezado Hero del Catálogo Estilo Baker (Limpio, sin botones apilados) */}
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
        </div>
      </section>

      {/* 2. Barra Unificada de Controles, Búsqueda y Ordenamiento */}
      <div className="contenedor" style={{ paddingTop: '2rem' }}>
        <div className="catalogo-toolbar-baker">
          {/* Buscador Baker */}
          <div className="catalogo-buscador-wrap">
            <svg className="catalogo-icon-search" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="catalogo-search-input"
              placeholder="Buscar por torta, alfajor, sabor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar producto"
            />
            {searchTerm && (
              <button
                type="button"
                className="catalogo-btn-clear"
                onClick={() => setSearchTerm('')}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>

          {/* Acciones y Selectores */}
          <div className="catalogo-toolbar-actions">
            {/* Selector de Categoría Dropdown */}
            <div className="catalogo-select-group">
              <label htmlFor="catalogo-cat-select" className="catalogo-select-label">Categoría:</label>
              <select
                id="catalogo-cat-select"
                className="catalogo-select-control"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                aria-label="Filtrar por categoría"
              >
                <option value="Todas">Todas las Delicias ({products.length})</option>
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
                  return (
                    <option key={cat.id} value={cat.nombre}>
                      {cat.nombre} ({count})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Selector de Ordenamiento */}
            <div className="catalogo-select-group">
              <label htmlFor="catalogo-sort-select" className="catalogo-select-label">Ordenar:</label>
              <select
                id="catalogo-sort-select"
                className="catalogo-select-control"
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

            {/* Selector de Vista (Por Secciones vs Grilla Continua) */}
            {!isFiltered && (
              <div className="catalogo-view-toggle" role="group" aria-label="Modo de visualización">
                <button
                  type="button"
                  className={`btn-view-toggle ${viewMode === 'secciones' ? 'activo' : ''}`}
                  onClick={() => setViewMode('secciones')}
                  title="Vista organizada por categorías"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                  <span className="d-none d-lg-inline ms-1">Por Secciones</span>
                </button>
                <button
                  type="button"
                  className={`btn-view-toggle ${viewMode === 'grilla' ? 'activo' : ''}`}
                  onClick={() => setViewMode('grilla')}
                  title="Vista grilla continua"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  <span className="d-none d-lg-inline ms-1">Grilla Continua</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Barra de Navegación Rápida de Categorías (Pills de 1 sola fila con scroll suave) */}
        <div className="catalogo-pills-bar-wrap">
          <div className="catalogo-pills-bar">
            <button
              type="button"
              className={`btn-quick-pill ${selectedCategory === 'Todas' ? 'activo' : ''}`}
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
                  className={`btn-quick-pill ${selectedCategory.toLowerCase() === cat.nombre.toLowerCase() ? 'activo' : ''}`}
                  onClick={() => handleCategoryChange(cat.nombre)}
                >
                  {cat.nombre} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Filtros Activos (si se está filtrando o buscando) */}
        {isFiltered && (
          <div className="catalogo-active-filters mb-4">
            <span className="small text-muted me-2">Filtros activos:</span>
            {selectedCategory !== 'Todas' && (
              <span className="badge-filtro-activo">
                Categoría: {selectedCategory}
                <button type="button" onClick={() => handleCategoryChange('Todas')} aria-label="Quitar filtro de categoría">✕</button>
              </span>
            )}
            {searchTerm.trim() && (
              <span className="badge-filtro-activo">
                Búsqueda: &ldquo;{searchTerm}&rdquo;
                <button type="button" onClick={() => setSearchTerm('')} aria-label="Quitar búsqueda">✕</button>
              </span>
            )}
            <button
              type="button"
              className="btn btn-sm btn-link text-decoration-none ms-2"
              style={{ color: 'var(--color-caramelo)', fontWeight: 600, fontSize: '0.82rem' }}
              onClick={handleResetFilters}
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}

        {/* 5. Contenido Principal: Grilla vacía, Secciones agrupadas o Grilla continua */}
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
              onClick={handleResetFilters}
            >
              Ver Todas las Delicias
            </button>
          </div>
        ) : showSections ? (
          /* MODO SECCIONES AGRUPADAS POR CATEGORÍA */
          <div className="catalogo-secciones-container">
            {categories.map((cat) => {
              const prodsInCat = filteredProducts.filter(
                p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()
              );
              if (prodsInCat.length === 0) return null;

              return (
                <section key={cat.id} className="catalogo-seccion-categoria">
                  <div className="catalogo-seccion-header">
                    <div>
                      <span className="seccion-baker-eyebrow mb-1 d-block" style={{ fontSize: '0.74rem' }}>
                        Especialidad Artesanal
                      </span>
                      <h2 className="catalogo-seccion-titulo">
                        {cat.nombre}
                      </h2>
                      {cat.descripcion && (
                        <p className="catalogo-seccion-desc mb-0 mt-1">
                          {cat.descripcion}
                        </p>
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                      <span className="catalogo-badge-count">
                        {prodsInCat.length} {prodsInCat.length === 1 ? 'delicia' : 'delicias'}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-link p-0 text-decoration-none catalogo-link-ver-cat"
                        onClick={() => handleCategoryChange(cat.nombre)}
                      >
                        Ver sólo {cat.nombre} &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="grilla-productos mt-3">
                    {prodsInCat.map((prod) => (
                      <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          /* MODO GRILLA CONTINUA (Filtrada o completa) */
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="small text-muted">
                Mostrando <strong>{filteredProducts.length}</strong> producto{filteredProducts.length !== 1 ? 's' : ''}
                {selectedCategory !== 'Todas' && ` en ${selectedCategory}`}
              </span>
              {selectedCategory !== 'Todas' && (
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-decoration-none"
                  style={{ color: 'var(--color-caramelo)', fontWeight: 600, fontSize: '0.85rem' }}
                  onClick={() => handleCategoryChange('Todas')}
                >
                  &larr; Volver a todas las categorías
                </button>
              )}
            </div>
            <div className="grilla-productos">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
