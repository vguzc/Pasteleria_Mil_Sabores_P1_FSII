import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/db';

export default function AdminSidebar() {
  const { currentUser, logout, isAdmin } = useAuth();
  const [orderCount, setOrderCount] = useState(() => {
    try {
      return orderService.getAll().length;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        setOrderCount(orderService.getAll().length);
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage-updated', handleUpdate);
    return () => window.removeEventListener('storage-updated', handleUpdate);
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `d-flex align-items-center gap-2 px-3 py-2 rounded text-decoration-none transition ${
      isActive
        ? 'fw-bold'
        : 'text-white-50'
    }`;

  const getActiveStyle = (isActive) => ({
    backgroundColor: isActive ? 'var(--color-caramelo)' : 'transparent',
    color: isActive ? '#FFFFFF' : '#D2C4B5',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.88rem'
  });

  return (
    <aside
      className="d-flex flex-column flex-shrink-0 p-3 shadow"
      style={{
        width: '265px',
        minHeight: '100vh',
        backgroundColor: '#201610',
        borderRight: '1px solid rgba(196, 136, 75, 0.25)',
        color: '#EADFD2'
      }}
    >
      {/* 1. Header con Monograma MS Caramelo */}
      <Link to="/" className="d-flex align-items-center gap-2 mb-3 text-decoration-none" title="Volver al inicio de la tienda">
        <img
          src="/img/logo-ms-caramelo.png"
          alt="Mil Sabores"
          height="42"
          className="object-fit-contain"
        />
        <div>
          <span
            className="d-block fw-bold lh-1"
            style={{ fontFamily: 'var(--fuente-titulos)', color: '#FFFFFF', fontSize: '1.25rem' }}
          >
            Mil Sabores
          </span>
          <small style={{ color: 'var(--color-caramelo)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
            {isAdmin ? 'Panel Administrador' : 'Panel de Vendedor'}
          </small>
        </div>
      </Link>

      <hr style={{ borderColor: 'rgba(255, 255, 255, 0.12)', margin: '0.5rem 0 1rem 0' }} />

      {/* 2. Tarjeta Resumen Usuario */}
      <div
        className="p-3 rounded mb-3 small"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <div className="text-truncate fw-bold text-white">{currentUser?.nombre} {currentUser?.apellidos}</div>
        <div className="text-truncate text-white-50" style={{ fontSize: '0.78rem' }}>{currentUser?.correo}</div>
        <span
          className="badge mt-2 text-uppercase"
          style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF', fontSize: '0.68rem', letterSpacing: '0.08em' }}
        >
          {currentUser?.rol}
        </span>
      </div>

      {/* 3. Navegación Principal */}
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        <li className="nav-item">
          <NavLink to="/admin" end style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/ordenes" style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-receipt-cutoff"></i>
              <span>Órdenes / Boletas</span>
            </div>
            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                padding: '0.2rem 0.5rem'
              }}
              title={`${orderCount} boletas registradas`}
            >
              {orderCount}
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/productos" style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-box-seam"></i>
            <span>Productos & Stock</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categorias" style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-tags"></i>
            <span>Categorías</span>
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin/usuarios" style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center gap-2">
              <i className="bi bi-people"></i>
              <span>Usuarios</span>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/admin/reportes" style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-bar-chart-line"></i>
            <span>Reportes & Ventas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/perfil" style={({ isActive }) => getActiveStyle(isActive)} className="px-3 py-2 rounded text-decoration-none d-flex align-items-center gap-2">
            <i className="bi bi-person-gear"></i>
            <span>Mi Perfil Admin</span>
          </NavLink>
        </li>
      </ul>

      <hr style={{ borderColor: 'rgba(255, 255, 255, 0.12)', margin: '1rem 0' }} />

      {/* 4. Acciones Inferiores */}
      <div className="d-flex flex-column gap-2">
        <Link
          to="/"
          className="btn btn-sm text-start d-flex align-items-center gap-2"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#EADFD2',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <i className="bi bi-shop"></i>
          <span>Ver Tienda Online</span>
        </Link>
        <button
          onClick={handleLogout}
          type="button"
          className="btn btn-sm btn-outline-danger text-start d-flex align-items-center gap-2"
        >
          <i className="bi bi-box-arrow-left"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}