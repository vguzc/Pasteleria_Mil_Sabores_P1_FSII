import React, { useState, useEffect } from 'react';
import { productService, categoryService } from '../../services/db';
import ProductModal from '../../components/admin/ProductModal';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterView, setFilterView] = useState('todos'); // 'todos' | 'criticos' | 'ofertas'
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadData = () => {
    setProducts(productService.getAll());
    setCategories(categoryService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) {
      productService.delete(id);
      loadData();
      showFeedback(`Producto "${nombre}" eliminado correctamente.`);
    }
  };

  const handleSaveProduct = (prodData) => {
    if (editingProduct) {
      productService.update(editingProduct.id, prodData);
      showFeedback(`Producto "${prodData.nombre}" actualizado.`);
    } else {
      productService.create(prodData);
      showFeedback(`Producto "${prodData.nombre}" creado exitosamente.`);
    }
    setModalOpen(false);
    loadData();
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Filtrado
  const displayedProducts = products.filter((p) => {
    if (filterView === 'criticos' && Number(p.stock) > 6) return false;
    if (filterView === 'ofertas' && !p.enOferta) return false;

    const q = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  });

  const criticalCount = products.filter(p => Number(p.stock) <= 6).length;
  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            Inventario & Obrador
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
            Mantenedor de Productos
          </h1>
          <p className="text-muted small mb-0 mt-1">Gestión de recetas, stock crítico y precios con persistencia local</p>
        </div>
        <div>
          <button
            className="boton boton-primario btn-baker"
            onClick={handleOpenNew}
            style={{ fontSize: '0.85rem' }}
          >
            <i className="bi bi-plus-circle me-2"></i>Nuevo Producto
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className="alert alert-dismissible py-2 mb-3 small d-flex align-items-center"
          style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)' }}
        >
          <i className="bi bi-check-circle me-2" style={{ color: 'var(--color-caramelo)' }}></i>
          <span>{feedback}</span>
        </div>
      )}

      {/* Barra de filtros y pestañas */}
      <div className="card border-0 mb-4 p-3 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-5">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: filterView === 'todos' ? 'var(--color-espresso)' : 'transparent',
                  color: filterView === 'todos' ? '#FFFFFF' : 'var(--color-espresso)',
                  border: '1px solid var(--color-espresso)',
                  fontWeight: 600
                }}
                onClick={() => setFilterView('todos')}
              >
                Todos ({products.length})
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: filterView === 'criticos' ? '#B54234' : 'transparent',
                  color: filterView === 'criticos' ? '#FFFFFF' : '#B54234',
                  border: '1px solid #B54234',
                  fontWeight: 600
                }}
                onClick={() => setFilterView('criticos')}
              >
                Stock Crítico ({criticalCount})
              </button>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  backgroundColor: filterView === 'ofertas' ? 'var(--color-caramelo)' : 'transparent',
                  color: filterView === 'ofertas' ? '#FFFFFF' : 'var(--color-caramelo)',
                  border: '1px solid var(--color-caramelo)',
                  fontWeight: 600
                }}
                onClick={() => setFilterView('ofertas')}
              >
                Ofertas
              </button>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 ms-auto">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white" style={{ borderColor: 'var(--color-borde)' }}><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por código, nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: 'var(--color-borde)' }}
              />
              {searchTerm && (
                <button className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos (CRUD) */}
      <div className="card shadow-sm border-0" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }}>
                <tr>
                  <th style={{ width: '60px', color: 'var(--color-espresso)' }}>Imagen</th>
                  <th style={{ width: '90px', color: 'var(--color-espresso)' }}>Código</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Nombre del Producto</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Categoría</th>
                  <th className="text-end" style={{ width: '100px', color: 'var(--color-espresso)' }}>Precio</th>
                  <th className="text-center" style={{ width: '90px', color: 'var(--color-espresso)' }}>Stock</th>
                  <th className="text-center" style={{ width: '90px', color: 'var(--color-espresso)' }}>Estado</th>
                  <th className="text-center" style={{ width: '130px', color: 'var(--color-espresso)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No se encontraron productos que coincidan con los criterios.
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => {
                    const isCritical = Number(p.stock) <= 6;
                    return (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.imagen || '/img/torta-mil-sabores.png'}
                            alt={p.nombre}
                            width="44"
                            height="44"
                            className="rounded object-fit-contain p-1"
                            style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/torta-mil-sabores.png';
                            }}
                          />
                        </td>
                        <td>
                          <code style={{ color: 'var(--color-espresso)' }}>{p.id}</code>
                        </td>
                        <td>
                          <div className="fw-bold" style={{ color: 'var(--color-espresso)' }}>{p.nombre}</div>
                          {p.destacado && (
                            <span className="badge me-1" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF' }}>Destacado</span>
                          )}
                          {p.enOferta && (
                            <span className="badge" style={{ backgroundColor: '#B54234', color: '#FFFFFF' }}>Oferta</span>
                          )}
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                            {p.categoria}
                          </span>
                        </td>
                        <td className="text-end fw-bold" style={{ color: 'var(--color-espresso)' }}>
                          {formatPrice(p.precio)}
                        </td>
                        <td className="text-center">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: isCritical ? '#B54234' : '#2D6A4F',
                              color: '#FFFFFF'
                            }}
                          >
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="text-center">
                          {p.stock > 0 ? (
                            <span className="small fw-semibold" style={{ color: '#2D6A4F' }}>Disponible</span>
                          ) : (
                            <span className="small fw-semibold" style={{ color: '#B54234' }}>Agotado</span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              title="Editar Producto"
                              onClick={() => handleOpenEdit(p)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              title="Eliminar Producto"
                              onClick={() => handleDelete(p.id, p.nombre)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal CRUD Producto */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}