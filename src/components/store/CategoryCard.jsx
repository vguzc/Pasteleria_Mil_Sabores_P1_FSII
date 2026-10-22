import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/categoria/${encodeURIComponent(category.nombre)}`}
      className="card text-decoration-none text-dark h-100 border-0 shadow-sm category-card transition-all"
    >
      <div className="card-body text-center p-3 d-flex flex-column align-items-center justify-content-center">
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3 overflow-hidden shadow-sm"
          style={{ width: '85px', height: '85px' }}
        >
          <img
            src={category.imagen || '/img/torta-mil-sabores.png'}
            alt={category.nombre}
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/torta-mil-sabores.png';
            }}
          />
        </div>
        <h6 className="card-title fw-bold mb-1">{category.nombre}</h6>
        <p className="card-text text-muted small">{category.descripcion}</p>
        <span className="btn btn-sm btn-outline-primary mt-auto">Ver productos</span>
      </div>
    </Link>
  );
}
