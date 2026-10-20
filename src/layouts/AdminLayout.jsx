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
    <div className="d-flex bg-light min-vh-100">
      {/* Sidebar fijo */}
      <AdminSidebar />

      {/* Contenedor Principal */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* Barra superior de administración */}
        <header className="bg-white border-bottom py-2 px-4 d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small">Panel de Gestión /</span>
            <span className="fw-semibold text-dark text-capitalize">
              {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-box-arrow-up-right me-1"></i>Ir a la Tienda
            </Link>
            <div className="d-flex align-items-center gap-2 border-start ps-3">
              <i className="bi bi-person-circle fs-4 text-primary"></i>
              <div className="small">
                <span className="d-block fw-bold lh-1">{currentUser.nombre}</span>
                <span className="badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.65rem' }}>
                  {currentUser.rol}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
