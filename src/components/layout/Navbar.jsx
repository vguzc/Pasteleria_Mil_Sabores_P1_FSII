import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { currentUser, logout, isAdmin, isVendedor } = useAuth();
  const { totals } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?buscar=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(totals.total);

  return (
    <header className="sticky-top shadow-sm bg-white border-bottom">
      {/* Barra superior con avisos */}
      <div className="bg-primary text-white py-1 small">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-award-fill text-warning me-1"></i>
            <span>50 Años de Tradición y Repostería Chilena (1976 - 2026)</span>
          </div>
          <div className="d-none d-md-flex gap-3">
            <span><i className="bi bi-truck me-1"></i>Envío Gratis sobre $30.000</span>
            <span><i className="bi bi-tag-fill me-1"></i>Cupón: <strong>FELICES50</strong> (50% OFF)</span>
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-2">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img
              src="/img/logo-icono.png"
              alt="Pastelería Mil Sabores"
              width="44"
              height="44"
              className="rounded-circle shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/logo.png';
              }}
            />
            <div>
              <span className="fw-bold fs-4 d-block lh-1 text-primary" style={{ fontFamily: 'Playfair Display, serif' }}>
                Mil Sabores
              </span>
              <small className="text-muted d-block" style={{ fontSize: '0.68rem', letterSpacing: '1px' }}>
                PASTELERÍA ARTESANAL
              </small>
            </div>
          </Link>

          {/* Buscador central */}
          <form onSubmit={handleSearch} className="d-none d-lg-flex mx-auto" style={{ maxWidth: '380px', width: '100%' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar tortas, postres, empanadas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar productos"
              />
              <button className="btn btn-outline-primary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Acciones de usuario y carrito */}
          <div className="d-flex align-items-center gap-2 order-lg-3">
            {/* Botón Carrito */}
            <Link to="/carrito" className="btn btn-success d-flex align-items-center gap-2 shadow-sm">
              <i className="bi bi-cart3 fs-5"></i>
              <span className="d-none d-sm-inline fw-semibold">Carrito</span>
              <span className="badge bg-white text-dark rounded-pill">
                {totals.itemsCount}
              </span>
              <span className="d-none d-md-inline small fw-bold">
                {formattedTotal}
              </span>
            </Link>

            {/* Menú Usuario */}
            {currentUser ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5 text-primary"></i>
                  <span className="d-none d-sm-inline small fw-bold">{currentUser.nombre}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li className="dropdown-header">
                    <strong>{currentUser.nombre} {currentUser.apellidos}</strong>
                    <br />
                    <span className="badge bg-info text-dark">{currentUser.rol}</span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/mi-cuenta">
                      <i className="bi bi-person-gear me-2"></i>Mi Cuenta y Cupones
                    </Link>
                  </li>
                  {(isAdmin || isVendedor) && (
                    <li>
                      <Link className="dropdown-item fw-bold text-primary" to="/admin">
                        <i className="bi bi-speedometer2 me-2"></i>Panel de Administración
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-1">
                <Link to="/login" className="btn btn-outline-primary btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-primary btn-sm d-none d-sm-inline-block">
                  Crear Cuenta
                </Link>
              </div>
            )}

            {/* Hamburguesa Mobile */}
            <button
              className="navbar-toggler ms-1"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContenido"
              aria-controls="navbarContenido"
              aria-expanded="false"
              aria-label="Abrir navegación"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Links del Navbar */}
          <div className="collapse navbar-collapse order-lg-2" id="navbarContenido">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-2 mt-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>Inicio</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/productos">Catálogo</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categorias">Categorías</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/ofertas">
                  <span className="badge bg-danger me-1">Hot</span>Ofertas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/blogs">Blog</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
              </li>
            </ul>

            {/* Buscador móvil */}
            <form onSubmit={handleSearch} className="d-lg-none mt-2">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-primary" type="submit">Buscar</button>
              </div>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
}
