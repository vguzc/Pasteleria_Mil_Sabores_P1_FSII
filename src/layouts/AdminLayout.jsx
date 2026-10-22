import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/layout/AdminSidebar';

export default function AdminLayout() {
  const { currentUser, isAdmin, isVendedor } = useAuth();
  const location = useLocation();

  // Protección de ruta: Solo administradores y vendedores pueden entrar
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin && !isVendedor) {
    return <Navigate to="/mi-cuenta" replace />;
  }

  // La sección de usuarios es exclusiva para administradores
  if (location.pathname.startsWith('/admin/usuarios') && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: 'var(--color-fondo)' }}>
      {/* Sidebar fijo */}
      <AdminSidebar />

      {/* Contenedor Principal */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Barra superior de administración */}
        <header
          className="py-3 px-4 d-flex justify-content-between align-items-center shadow-sm"
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-borde)'
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted">Panel de Gestión /</span>
            <span className="fw-bold text-capitalize" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
              {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard General'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link
              to="/"
              className="btn btn-sm"
              style={{
                backgroundColor: '#FAF4EC',
                color: 'var(--color-espresso)',
                border: '1px solid var(--color-borde)',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <i className="bi bi-box-arrow-up-right me-1 text-muted"></i>Ir a la Tienda
            </Link>
            <div className="d-flex align-items-center gap-2 border-start ps-3" style={{ borderColor: 'var(--color-borde)' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#F3ECE3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-espresso)',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                {currentUser.nombre.charAt(0)}
              </div>
              <div className="small lh-1">
                <span className="d-block fw-bold" style={{ color: 'var(--color-espresso)' }}>{currentUser.nombre}</span>
                <span
                  className="badge mt-1 text-uppercase"
                  style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF', fontSize: '0.62rem' }}
                >
                  {currentUser.rol}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="p-4 flex-grow-1 overflow-auto" style={{ backgroundColor: 'var(--color-fondo)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}