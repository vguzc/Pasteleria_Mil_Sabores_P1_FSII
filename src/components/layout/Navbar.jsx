import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { currentUser, logout, isAdmin, isVendedor } = useAuth();
  const { totals, openDrawer } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleCartClick = (e) => {
    e.preventDefault();
    openDrawer();
  };

  return (
    <header className="encabezado">
      <div className="contenedor">
        {/* 1. Logo a la Izquierda: Monograma MS + Identidad Oficial de Cafetería */}
        <Link to="/" className="logo" aria-label="Mil Sabores Cafetería - Inicio">
          <img src="/img/logo-ms.png" alt="Mil Sabores" className="logo-icono-ms" />
          <div className="logo-textos">
            <span className="logo-marca">Mil Sabores</span>
            <span className="logo-submarca">Cafetería &bull; Buen Café, Mil Momentos</span>
          </div>
        </Link>

        {/* 2. Navegación Central Estilo Baker */}
        <nav className={`navegacion ${mobileMenuOpen ? 'navegacion-abierta' : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/productos"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/categorias"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Categorías
          </NavLink>
          <NavLink
            to="/ofertas"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Ofertas
          </NavLink>
          <NavLink
            to="/nosotros"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Nosotros
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Blog & Recetas
          </NavLink>
          <NavLink
            to="/contacto"
            className={({ isActive }) => (isActive ? 'activo' : '')}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contacto
          </NavLink>
        </nav>

        {/* 3. Acciones a la Derecha: Usuario + Carrito */}
        <div className="nav-acciones">
          {/* Usuario con Dropdown */}
          <div className="position-relative">
            {currentUser ? (
              <button
                type="button"
                className="nav-icono-link"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Menú de usuario"
                title={`Sesión iniciada: ${currentUser.nombre}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            ) : (
              <Link to="/login" className="nav-icono-link" aria-label="Iniciar sesión" title="Iniciar sesión">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            )}

            {currentUser && dropdownOpen && (
              <div
                className="card shadow position-absolute end-0 mt-2 p-2"
                style={{ width: '220px', zIndex: 1100, backgroundColor: '#FFFFFF', borderColor: 'var(--color-borde)' }}
              >
                <div className="small fw-bold border-bottom pb-2 mb-2 px-2" style={{ color: 'var(--color-espresso)' }}>
                  {currentUser.nombre} {currentUser.apellidos}
                  <span className="badge ms-1" style={{ backgroundColor: 'var(--color-rosa)', color: 'var(--color-espresso)' }}>
                    {currentUser.rol}
                  </span>
                </div>
                <Link
                  to="/mi-cuenta"
                  className="dropdown-item px-2 py-1 small rounded text-decoration-none"
                  style={{ color: 'var(--color-texto)' }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="bi bi-person me-2"></i>Mi Cuenta
                </Link>
                {(isAdmin || isVendedor) && (
                  <Link
                    to="/admin"
                    className="dropdown-item px-2 py-1 small rounded text-decoration-none fw-bold"
                    style={{ color: 'var(--color-espresso)' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <i className="bi bi-speedometer2 me-2"></i>Panel Administrativo
                  </Link>
                )}
                <hr className="my-1" />
                <button
                  type="button"
                  className="btn btn-link text-danger text-start p-1 small text-decoration-none"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </div>
            )}
          </div>

          {/* Carrito con Slide Drawer */}
          <button
            type="button"
            className="nav-icono-link nav-carrito"
            onClick={handleCartClick}
            aria-label="Abrir carrito de compras"
            title="Abrir bolsa"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totals.itemsCount > 0 && (
              <span className="badge-carrito">
                {totals.itemsCount}
              </span>
            )}
          </button>

          {/* Menú hamburguesa mobile */}
          <button
            type="button"
            className="menu-toggle d-lg-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
