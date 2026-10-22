import React, { useState, useEffect } from 'react';
import { categoryService, productService } from '../../services/db';
import CategoryModal from '../../components/admin/CategoryModal';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadData = () => {
    setCategories(categoryService.getAll());
    setProducts(productService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setModalOpen(true);
  };

  const handleDelete = (id, nombre) => {
    const associatedProds = products.filter(p => p.categoria.toLowerCase() === nombre.toLowerCase());
    if (associatedProds.length > 0) {
      alert(`No se puede eliminar la categoría "${nombre}" porque tiene ${associatedProds.length} producto(s) asignado(s).`);
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`)) {
      categoryService.delete(id);
      loadData();
      showFeedback(`Categoría "${nombre}" eliminada.`);
    }
  };

  const handleSave = (catData) => {
    if (editingCategory) {
      categoryService.update(editingCategory.id, catData);
      showFeedback(`Categoría "${catData.nombre}" actualizada.`);
    } else {
      categoryService.create(catData);
      showFeedback(`Categoría "${catData.nombre}" creada exitosamente.`);
    }
    setModalOpen(false);
    loadData();
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            Familias & Catálogo
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
            Mantenedor de Categorías
          </h1>
          <p className="text-muted small mb-0 mt-1">Gestión de familias y agrupaciones de productos artesanales</p>
        </div>
        <button
          className="boton boton-primario btn-baker"
          onClick={handleOpenNew}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-plus-circle me-2"></i>Nueva Categoría
        </button>
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

      <div className="card shadow-sm border-0" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }}>
                <tr>
                  <th style={{ width: '70px', color: 'var(--color-espresso)' }}>Icono</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Nombre de la Categoría</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Descripción</th>
                  <th className="text-center" style={{ width: '150px', color: 'var(--color-espresso)' }}>Productos Asignados</th>
                  <th className="text-center" style={{ width: '120px', color: 'var(--color-espresso)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const count = products.filter(p => p.categoria.toLowerCase() === cat.nombre.toLowerCase()).length;
                  return (
                    <tr key={cat.id || cat.nombre}>
                      <td>
                        <img
                          src={cat.imagen || '/img/torta-mil-sabores.png'}
                          alt={cat.nombre}
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
                        <strong style={{ color: 'var(--color-espresso)' }}>{cat.nombre}</strong>
                      </td>
                      <td className="text-muted">
                        {cat.descripcion || 'Sin descripción'}
                      </td>
                      <td className="text-center">
                        <span
                          className="badge rounded-pill"
                          style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)', fontWeight: 600 }}
                        >
                          {count} delicias
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Editar Categoría"
                            onClick={() => handleOpenEdit(cat)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Eliminar Categoría"
                            onClick={() => handleDelete(cat.id, cat.nombre)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}