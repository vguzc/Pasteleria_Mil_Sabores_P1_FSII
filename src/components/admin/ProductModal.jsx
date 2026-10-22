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
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(32, 22, 16, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header text-white" style={{ backgroundColor: '#201610', borderBottom: '1px solid var(--color-borde)' }}>
              <h5 className="modal-title" style={{ fontFamily: 'var(--fuente-titulos)' }}>
                <i className={`bi ${product ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{ color: 'var(--color-caramelo)' }}></i>
                {product ? 'Editar Receta / Producto' : 'Nueva Receta / Producto'}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body p-4" style={{ backgroundColor: '#FAF7F2' }}>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Código / ID</label>
                  <input
                    type="text"
                    name="id"
                    className="form-control"
                    placeholder="Ej: TC005 (Autogenerado)"
                    value={formData.id}
                    onChange={handleChange}
                    disabled={!!product}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Nombre del Producto *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    placeholder="Ej: Torta Selva Negra Tradicional"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Categoría *</label>
                  <select
                    name="categoria"
                    className="form-select"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--color-borde)' }}
                  >
                    {categories.map((cat, i) => (
                      <option key={i} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Precio ($ CLP) *</label>
                  <input
                    type="number"
                    name="precio"
                    className="form-control"
                    placeholder="25990"
                    min="100"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Stock Disponible *</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    placeholder="10"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Precio Anterior (Opcional tachado)</label>
                  <input
                    type="number"
                    name="precioAnterior"
                    className="form-control"
                    placeholder="Ej: 29990"
                    min="0"
                    value={formData.precioAnterior}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Ruta / URL de Imagen</label>
                  <input
                    type="text"
                    name="imagen"
                    className="form-control"
                    placeholder="/img/torta-mil-sabores.png"
                    value={formData.imagen}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Descripción del Producto</label>
                  <textarea
                    name="descripcion"
                    className="form-control"
                    rows="3"
                    placeholder="Detalles sobre ingredientes, textura y presentación..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    style={{ borderColor: 'var(--color-borde)' }}
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
                    <label className="form-check-label small fw-semibold" htmlFor="checkDestacado">Destacar en Inicio</label>
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
                    <label className="form-check-label small fw-semibold" htmlFor="checkOferta">Mostrar en Sección Ofertas</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-borde)' }}>
              <button type="button" className="boton boton-secundario btn-baker" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="boton boton-primario btn-baker">
                <i className="bi bi-save me-1"></i>Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
