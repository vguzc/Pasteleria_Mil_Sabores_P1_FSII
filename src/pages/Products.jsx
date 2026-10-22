import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService, categoryService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('destacados');

  const [searchParams] = useSearchParams();
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
    <div className="container py-4">
      {/* Encabezado y Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><a href="/">Inicio</a></li>
          <li className="breadcrumb-item active" aria-current="page">Catálogo de Productos</li>
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="fw-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            Catálogo de Pastelería y Repostería
          </h1>
          <p className="text-muted small mb-0">
            Mostrando {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} artesanal{filteredProducts.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Ordenador */}
        <div className="d-flex align-items-center gap-2">
          <label className="text-muted small text-nowrap">Ordenar por:</label>
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="destacados">Destacados primero</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre">Nombre (A - Z)</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        {/* Barra lateral de filtros */}
        <div className="col-lg-3">
          <div className="card shadow-sm border-0 p-3 sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <i className="bi bi-funnel me-2 text-primary"></i>Filtros
            </h5>

            {/* Búsqueda */}
            <div className="mb-4">
              <label className="form-label small fw-bold">Buscar por palabra</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Lúcuma, Chocolate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Categorías */}
            <div className="mb-3">
              <label className="form-label small fw-bold">Categorías</label>
              <div className="list-group list-group-flush small">
                <button
                  type="button"
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-2 py-1 rounded ${selectedCategory === 'Todas' ? 'active text-white' : ''}`}
                  onClick={() => setSelectedCategory('Todas')}
                >
                  <span>Todas las categorías</span>
                  <span className="badge bg-secondary rounded-pill">{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-2 py-1 rounded ${selectedCategory.toLowerCase() === cat.nombre.toLowerCase() ? 'active text-white' : ''}`}
                      onClick={() => setSelectedCategory(cat.nombre)}
                    >
                      <span className="text-truncate">{cat.nombre}</span>
                      <span className="badge bg-secondary rounded-pill">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botón reset filtros */}
            {(selectedCategory !== 'Todas' || searchTerm) && (
              <button
                className="btn btn-outline-danger btn-sm w-100 mt-2"
                onClick={() => {
                  setSelectedCategory('Todas');
                  setSearchTerm('');
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>Limpiar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Grilla de Productos */}
        <div className="col-lg-9">
          {filteredProducts.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm">
              <i className="bi bi-search fs-1 text-muted mb-3"></i>
              <h4>No se encontraron productos</h4>
              <p className="text-muted small">
                Intenta ajustar los filtros de búsqueda o seleccionar otra categoría.
              </p>
              <div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { setSelectedCategory('Todas'); setSearchTerm(''); }}
                >
                  Restablecer catálogo
                </button>
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="col">
                  <ProductCard product={prod} onAddToCart={addItem} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
