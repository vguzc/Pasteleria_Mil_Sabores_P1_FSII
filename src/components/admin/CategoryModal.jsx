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
      setImagen('img/torta-mil-sabores.png');
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
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(32, 22, 16, 0.65)', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <form onSubmit={handleSubmit}>
            <div className="modal-header text-white" style={{ backgroundColor: '#201610', borderBottom: '1px solid var(--color-borde)' }}>
              <h5 className="modal-title" style={{ fontFamily: 'var(--fuente-titulos)' }}>
                {category ? 'Editar Categoría' : 'Nueva Categoría Pastelera'}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Cerrar"></button>
            </div>
            <div className="modal-body p-4" style={{ backgroundColor: '#FAF7F2' }}>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Nombre de la Categoría *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Tortas de Hojarasca"
                  required
                  style={{ borderColor: 'var(--color-borde)' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Descripción</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve reseña sobre esta categoría de repostería..."
                  style={{ borderColor: 'var(--color-borde)' }}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>Imagen de Muestra (Ruta / URL)</label>
                <input
                  type="text"
                  className="form-control"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  placeholder="img/torta-mil-sabores.png"
                  style={{ borderColor: 'var(--color-borde)' }}
                />
              </div>
            </div>
            <div className="modal-footer" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-borde)' }}>
              <button type="button" className="boton boton-secundario btn-baker" onClick={onClose}>Cancelar</button>
              <button type="submit" className="boton boton-primario btn-baker">Guardar Categoría</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}