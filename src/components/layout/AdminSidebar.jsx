import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar() {
  const { currentUser, logout, isAdmin, isVendedor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark shadow" style={{ width: '260px', minHeight: '100vh' }}>
      <Link to="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <img
          src="/img/logo-icono.png"
          alt="Logo"
          width="36"
          height="36"
          className="rounded-circle me-2 bg-light p-1"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/img/logo.png';
          }}
        />
        <div>
          <span className="fs-5 fw-bold text-warning d-block lh-1">Mil Sabores</span>
          <small className="text-secondary" style={{ fontSize: '0.7rem' }}>
            {isAdmin ? 'Panel de Administración' : 'Panel de Vendedor'}
          </small>
        </div>
      </Link>
      <hr className="border-secondary opacity-50" />

      {/* Info Usuario */}
      <div className="bg-secondary bg-opacity-25 p-2 rounded mb-3 small">
        <div className="text-truncate fw-bold">{currentUser?.nombre} {currentUser?.apellidos}</div>
        <div className="text-muted text-truncate">{currentUser?.correo}</div>
        <span className="badge bg-warning text-dark mt-1 text-uppercase">{currentUser?.rol}</span>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/admin" end className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/ordenes" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            <i className="bi bi-receipt-cutoff me-2"></i>
            Órdenes / Boletas
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/productos" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            <i className="bi bi-box-seam me-2"></i>
            Productos & Stock
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categorias" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            <i className="bi bi-tags me-2"></i>
            Categorías
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin/usuarios" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
              <i className="bi bi-people me-2"></i>
              Usuarios
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/admin/reportes" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            <i className="bi bi-bar-chart-line me-2"></i>
            Reportes
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/perfil" className={({ isActive }) => `nav-link text-white ${isActive ? 'active bg-primary' : ''}`}>
            <i className="bi bi-person-circle me-2"></i>
            Mi Perfil Admin
          </NavLink>
        </li>
      </ul>

      <hr className="border-secondary opacity-50" />
      <div className="d-flex flex-column gap-2">
        <Link to="/" className="btn btn-outline-light btn-sm text-start">
          <i className="bi bi-shop me-2"></i>Ver Tienda Online
        </Link>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm text-start">
          <i className="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
