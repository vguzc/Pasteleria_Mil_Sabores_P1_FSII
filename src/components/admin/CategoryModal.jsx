import React, { useState, useEffect } from 'react';

export default function CategoryModal({ category, onSave, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setNombre(category.nombre || '');
      setDescripcion(category.descripcion || '');
      setImagen(category.imagen || '');
    } else {
      setNombre('');
      setDescripcion('');
      setImagen('/img/torta-mil-sabores.png');
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }
    onSave({ nombre: nombre.trim(), descripcion: descripcion.trim(), imagen: imagen.trim() });
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-dark text-white">
              <h5 className="modal-title">
                {category ? 'Editar Categoría' : 'Nueva Categoría'}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="mb-3">
                <label className="form-label small fw-bold">Nombre de la Categoría *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Tortas de Cuchuflí"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Descripción</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve reseña sobre esta categoría..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Imagen de Muestra (Ruta / URL)</label>
                <input
                  type="text"
                  className="form-control"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="/img/torta-mil-sabores.png"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Guardar Categoría</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
