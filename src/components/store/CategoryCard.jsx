import React from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/productos?categoria=${encodeURIComponent(category.nombre)}`}
      className="tarjeta-categoria-baker text-decoration-none"
    >
      <div className="cat-baker-circulo">
        <img
          src={category.imagen || '/img/torta-mil-sabores.png'}
          alt={category.nombre}
          className="cat-baker-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/img/torta-mil-sabores.png';
          }}
        />
      </div>
      <h4 className="cat-baker-titulo">{category.nombre}</h4>
      <p className="cat-baker-desc">{category.descripcion}</p>
      <span className="cat-baker-link">
        Explorar →
      </span>
    </Link>
  );
}
