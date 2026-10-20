import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          {/* Columna Marca & 50 años */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src="/img/logo-icono.png"
                alt="Pastelería Mil Sabores"
                width="40"
                height="40"
                className="rounded-circle bg-white p-1"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/logo.png';
                }}
              />
              <span className="fs-4 fw-bold text-warning" style={{ fontFamily: 'Playfair Display, serif' }}>
                Pastelería Mil Sabores
              </span>
            </div>
            <p className="text-secondary small">
              Celebrando 50 años de tradición artesanal chilena (1976 - 2026). Elaboramos cada torta y pastel con ingredientes frescos de la más alta calidad y recetas familiares tradicionales.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-warning text-dark px-3 py-2">
                <i className="bi bi-award me-1"></i>Récord Torta Más Grande 1995
              </span>
            </div>
          </div>

          {/* Columna Navegación Rápida */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase fw-bold text-warning mb-3">Navegación</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/" className="text-secondary text-decoration-none">Inicio</Link></li>
              <li className="mb-2"><Link to="/productos" className="text-secondary text-decoration-none">Catálogo Completo</Link></li>
              <li className="mb-2"><Link to="/categorias" className="text-secondary text-decoration-none">Categorías</Link></li>
              <li className="mb-2"><Link to="/ofertas" className="text-secondary text-decoration-none">Ofertas del Mes</Link></li>
              <li className="mb-2"><Link to="/nosotros" className="text-secondary text-decoration-none">Nuestra Historia</Link></li>
              <li className="mb-2"><Link to="/blogs" className="text-secondary text-decoration-none">Blog y Recetas</Link></li>
            </ul>
          </div>

          {/* Columna Categorías Populares */}
          <div className="col-6 col-md-3">
            <h6 className="text-uppercase fw-bold text-warning mb-3">Especialidades</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/categoria/Tortas%20Cuadradas" className="text-secondary text-decoration-none">Tortas Cuadradas</Link></li>
              <li className="mb-2"><Link to="/categoria/Tortas%20Circulares" className="text-secondary text-decoration-none">Tortas Circulares</Link></li>
              <li className="mb-2"><Link to="/categoria/Productos%20Sin%20Azúcar" className="text-secondary text-decoration-none">Línea Sin Azúcar</Link></li>
              <li className="mb-2"><Link to="/categoria/Productos%20Sin%20Gluten" className="text-secondary text-decoration-none">Línea Sin Gluten</Link></li>
              <li className="mb-2"><Link to="/categoria/Productos%20Veganos" className="text-secondary text-decoration-none">Línea Vegana</Link></li>
              <li className="mb-2"><Link to="/categoria/Especial%2018" className="text-secondary text-decoration-none">Especial Fiestas Patrias</Link></li>
            </ul>
          </div>

          {/* Columna Contacto y Horarios */}
          <div className="col-12 col-md-3">
            <h6 className="text-uppercase fw-bold text-warning mb-3">Casa Matriz</h6>
            <p className="text-secondary small mb-2">
              <i className="bi bi-geo-alt-fill text-danger me-2"></i>Av. Providencia 1200, Santiago
            </p>
            <p className="text-secondary small mb-2">
              <i className="bi bi-telephone-fill text-success me-2"></i>+56 2 2345 6789
            </p>
            <p className="text-secondary small mb-2">
              <i className="bi bi-envelope-fill text-info me-2"></i>contacto@milsabores.cl
            </p>
            <p className="text-secondary small mb-0">
              <i className="bi bi-clock-fill text-warning me-2"></i>Lunes a Sábado: 08:30 - 20:30 hrs
            </p>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Pastelería Mil Sabores SpA. Todos los derechos reservados.
          </p>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Evaluación Parcial N° 2 — DSY1104 Fullstack II</span>
            <Link to="/login" className="text-secondary text-decoration-none">Acceso Administrativo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
