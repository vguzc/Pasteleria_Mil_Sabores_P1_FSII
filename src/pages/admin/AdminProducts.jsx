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
  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Mantenedor de Productos</h2>
          <p className="text-muted small mb-0">Gestión de inventario, stock crítico y precios con persistencia</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleOpenNew}>
            <i className="bi bi-plus-circle me-2"></i>Nuevo Producto
          </button>
        </div>
      </div>

      {feedback && (
        <div className="alert alert-success alert-dismissible py-2 mb-3">
          <i className="bi bi-check-circle me-2"></i>{feedback}
        </div>
      )}

      {/* Barra de filtros y pestañas (Figura 10: Listado, Críticos, etc.) */}
      <div className="card shadow-sm border-0 mb-4 p-3">
        <div className="row g-3 align-items-center">
          <div className="col-md-6 col-lg-4">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm ${filterView === 'todos' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilterView('todos')}
              >
                Todos ({products.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterView === 'criticos' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setFilterView('criticos')}
              >
                Stock Crítico ({criticalCount})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterView === 'ofertas' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
                onClick={() => setFilterView('ofertas')}
              >
                Ofertas
              </button>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 ms-auto">
            <div className="input-group input-group-sm">
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por código, nombre o categoría..."
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
        </div>
      </div>

      {/* Tabla de Productos (CRUD) */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Imagen</th>
                  <th style={{ width: '90px' }}>Código</th>
                  <th>Nombre del Producto</th>
                  <th>Categoría</th>
                  <th className="text-end" style={{ width: '100px' }}>Precio</th>
                  <th className="text-center" style={{ width: '90px' }}>Stock</th>
                  <th className="text-center" style={{ width: '90px' }}>Estado</th>
                  <th className="text-center" style={{ width: '130px' }}>Acciones</th>
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
                      <tr key={p.id} className={isCritical ? 'table-warning' : ''}>
                        <td>
                          <img
                            src={p.imagen || '/img/torta-mil-sabores.png'}
                            alt={p.nombre}
                            width="40"
                            height="40"
                            className="rounded object-fit-contain bg-light p-1"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/img/torta-mil-sabores.png';
                            }}
                          />
                        </td>
                        <td>
                          <code>{p.id}</code>
                        </td>
                        <td>
                          <div className="fw-bold">{p.nombre}</div>
                          {p.destacado && <span className="badge bg-primary me-1">Destacado</span>}
                          {p.enOferta && <span className="badge bg-danger">Oferta</span>}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{p.categoria}</span>
                        </td>
                        <td className="text-end fw-semibold">
                          {formatPrice(p.precio)}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${isCritical ? 'bg-danger' : 'bg-success'}`}>
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="text-center">
                          {p.stock > 0 ? (
                            <span className="text-success small fw-semibold">Disponible</span>
                          ) : (
                            <span className="text-danger small fw-semibold">Agotado</span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              title="Editar Producto"
                              onClick={() => handleOpenEdit(p)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
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
