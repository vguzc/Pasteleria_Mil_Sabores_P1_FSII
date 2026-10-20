import React, { useState, useEffect } from 'react';

export default function ProductModal({ product, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: '',
    precio: '',
    precioAnterior: '',
    stock: '',
    descripcion: '',
    imagen: '',
    destacado: false,
    enOferta: false
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || '',
        nombre: product.nombre || '',
        categoria: product.categoria || (categories[0]?.nombre || ''),
        precio: product.precio !== undefined ? product.precio : '',
        precioAnterior: product.precioAnterior || '',
        stock: product.stock !== undefined ? product.stock : '',
        descripcion: product.descripcion || '',
        imagen: product.imagen || '',
        destacado: Boolean(product.destacado),
        enOferta: Boolean(product.enOferta)
      });
    } else {
      setFormData({
        id: '',
        nombre: '',
        categoria: categories[0]?.nombre || 'Tortas Cuadradas',
        precio: '',
        precioAnterior: '',
        stock: '10',
        descripcion: '',
        imagen: '/img/torta-mil-sabores.png',
        destacado: false,
        enOferta: false
      });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    if (!formData.precio || Number(formData.precio) <= 0) {
      setError('El precio debe ser un número mayor a 0.');
      return;
    }
    if (formData.stock === '' || Number(formData.stock) < 0) {
      setError('El stock no puede ser negativo.');
      return;
    }

    onSave({
      ...formData,
      precio: Number(formData.precio),
      precioAnterior: formData.precioAnterior ? Number(formData.precioAnterior) : null,
      stock: Number(formData.stock)
    });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">
                <i className={`bi ${product ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
                {product ? 'Editar Producto' : 'Nuevo Producto'}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Código / ID</label>
                  <input
                    type="text"
                    name="id"
                    className="form-control"
                    placeholder="Ej: TC005 (Autogenerado si vacío)"
                    value={formData.id}
                    onChange={handleChange}
                    disabled={!!product}
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label small fw-bold">Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Ej: Torta Selva Negra"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Categoría *</label>
                  <select
                    name="categoria"
                    className="form-select"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Precio ($ CLP) *</label>
                  <input
                    type="number"
                    name="precio"
                    className="form-control"
                    placeholder="25990"
                    min="100"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold">Stock Disponible *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    placeholder="10"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Precio Anterior (Opcional tachado)</label>
                  <input
                    type="number"
                    name="precioAnterior"
                    className="form-control"
                    placeholder="Ej: 29990"
                    min="0"
                    value={formData.precioAnterior}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Ruta / URL de Imagen</label>
                  <input
                    type="text"
                    name="imagen"
                    className="form-control"
                    placeholder="/img/torta-mil-sabores.png"
                    value={formData.imagen}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold">Descripción del Producto</label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    rows="3"
                    placeholder="Detalles sobre ingredientes, textura y presentación..."
                    value={formData.descripcion}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-12 d-flex gap-4">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkDestacado"
                      name="destacado"
                      checked={formData.destacado}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="checkDestacado">Destacar en Inicio</label>
                  </div>

                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="checkOferta"
                      name="enOferta"
                      checked={formData.enOferta}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="checkOferta">Mostrar en Sección Ofertas</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-save me-1"></i>Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
