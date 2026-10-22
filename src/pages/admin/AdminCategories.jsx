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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Mantenedor de Categorías</h2>
          <p className="text-muted small mb-0">Gestión de familias y agrupaciones de productos</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenNew}>
          <i className="bi bi-plus-circle me-2"></i>Nueva Categoría
        </button>
      </div>

      {feedback && (
        <div className="alert alert-success py-2 mb-3">
          <i className="bi bi-check-circle me-2"></i>{feedback}
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '70px' }}>Icono</th>
                  <th>Nombre de la Categoría</th>
                  <th>Descripción</th>
                  <th className="text-center" style={{ width: '130px' }}>Productos Asignados</th>
                  <th className="text-center" style={{ width: '120px' }}>Acciones</th>
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
                          width="40"
                          height="40"
                          className="rounded object-fit-contain bg-light"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/torta-mil-sabores.png';
                          }}
                        />
                      </td>
                      <td>
                        <strong>{cat.nombre}</strong>
                      </td>
                      <td className="text-muted">
                        {cat.descripcion || 'Sin descripción'}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary rounded-pill">{count} productos</span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            title="Editar Categoría"
                            onClick={() => handleOpenEdit(cat)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
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
