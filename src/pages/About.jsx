import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Nuestra Historia</li>
        </ol>
      </nav>

      {/* Hero Nosotros */}
      <div className="text-center mb-5">
        <span className="badge bg-warning text-dark px-3 py-2 text-uppercase fw-bold mb-2">
          50 Años de Historia (1976 - 2026)
        </span>
        <h1 className="fw-bold font-serif display-4 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
          La Pasión por la Repostería Artesanal
        </h1>
        <p className="lead text-muted max-w-700 mx-auto">
          Desde un pequeño taller en Providencia hasta convertirnos en un referente de la pastelería chilena tradicional, conservando siempre recetas familiares y el toque de manjar casero.
        </p>
      </div>

      <div className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="fw-bold font-serif mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            Nuestros Orígenes y Tradición Familiar
          </h2>
          <p className="text-muted">
            En 1976 nació <strong>Pastelería Mil Sabores</strong> como una iniciativa familiar orientada a rescatar las recetas de nuestras abuelas: bizcochos remojados con licores nobles, merengues dorados al horno de piedra y las tradicionales hojarascas finas.
          </p>
          <p className="text-muted">
            A lo largo de las décadas, hemos perfeccionado nuestro proceso para incorporar nuevas líneas de productos sin perder la esencia: repostería sin azúcar añadida (con alulosa y stevia), opciones 100% libres de gluten certificadas y especialidades veganas.
          </p>
          <div className="p-3 bg-light rounded-3 border-start border-primary border-4 mb-3">
            <p className="fst-italic mb-0 small">
              "El secreto de una gran torta no es solo la técnica, sino la generosidad con la que se preparan el manjar y las frutas frescas."
            </p>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <img
            src="/img/torta-aniversario.png"
            alt="50 Aniversario Mil Sabores"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxHeight: '380px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/torta-mil-sabores.png';
            }}
          />
        </div>
      </div>

      {/* Hito Récord Guinness */}
      <div className="bg-light p-4 p-md-5 rounded-4 border mb-5">
        <div className="row align-items-center g-4">
          <div className="col-md-3 text-center">
            <i className="bi bi-trophy-fill text-warning" style={{ fontSize: '4.5rem' }}></i>
          </div>
          <div className="col-md-9">
            <h3 className="fw-bold font-serif mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              El Gran Hito: Récord Guinness 1995
            </h3>
            <p className="text-muted mb-0">
              En el año 1995, nuestro equipo de maestros pasteleros elaboró la torta de milhojas más grande de Sudamérica: más de 500 metros lineales rellenos con manjar artesanal de campo, congregando a miles de familias en una jornada solidaria que marcó la historia de la gastronomía nacional.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/productos" className="btn btn-primary btn-lg shadow-sm">
          <i className="bi bi-cart3 me-2"></i>Conoce Nuestros Productos
        </Link>
      </div>
    </div>
  );
}
