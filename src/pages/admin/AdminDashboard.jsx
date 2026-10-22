import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, userService, orderService, categoryService } from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalCompras: 0,
    montoCompras: 0,
    totalProductos: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    productosCriticos: 0
  });

  useEffect(() => {
    const orders = orderService.getAll();
    const products = productService.getAll();
    const users = userService.getAll();
    const categories = categoryService.getAll();
    const criticos = productService.getCritical();

    const monto = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    setStats({
      totalCompras: orders.length,
      montoCompras: monto,
      totalProductos: products.length,
      totalUsuarios: users.length,
      totalCategorias: categories.length,
      productosCriticos: criticos.length
    });
  }, []);

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      {/* Encabezado Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted small mb-0">Resumen general de las actividades y métricas del sistema</p>
        </div>
        <div>
          <span className="badge bg-light text-dark border px-3 py-2">
            <i className="bi bi-clock me-1 text-primary"></i>
            Actualizado en tiempo real
          </span>
        </div>
      </div>

      {/* Tarjetas Principales (Figura 9 de la pauta) */}
      <div className="row g-4 mb-4">
        {/* Tarjeta Compras */}
        <div className="col-12 col-md-4">
          <div className="card text-white bg-primary shadow-sm border-0 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase small fw-bold text-white-50">Compras Registradas</span>
              <i className="bi bi-cart-check fs-2"></i>
            </div>
            <h3 className="display-6 fw-bold mb-1">{stats.totalCompras}</h3>
            <div className="small text-white-50">
              Monto total: <strong>{formatPrice(stats.montoCompras)}</strong>
            </div>
          </div>
        </div>

        {/* Tarjeta Productos */}
        <div className="col-12 col-md-4">
          <div className="card text-white bg-success shadow-sm border-0 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase small fw-bold text-white-50">Inventario Productos</span>
              <i className="bi bi-box-seam fs-2"></i>
            </div>
            <h3 className="display-6 fw-bold mb-1">{stats.totalProductos}</h3>
            <div className="small text-white-50">
              {stats.productosCriticos > 0 ? (
                <span className="badge bg-danger">{stats.productosCriticos} con stock crítico</span>
              ) : (
                'Inventario al día'
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta Usuarios */}
        <div className="col-12 col-md-4">
          <div className="card text-dark bg-warning shadow-sm border-0 rounded-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase small fw-bold text-dark-50">Usuarios Registrados</span>
              <i className="bi bi-people fs-2"></i>
            </div>
            <h3 className="display-6 fw-bold mb-1">{stats.totalUsuarios}</h3>
            <div className="small text-dark-50">
              Clientes, vendedores y administradores
            </div>
          </div>
        </div>
      </div>

      {/* Módulos de Acceso Rápido (Figura 9 de la pauta) */}
      <h5 className="fw-bold mb-3 text-secondary">Módulos Administrativos</h5>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
        {/* Módulo Órdenes */}
        <div className="col">
          <Link to="/admin/ordenes" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
            <i className="bi bi-receipt fs-1 text-primary mb-2"></i>
            <h6 className="fw-bold mb-1">Órdenes / Boletas</h6>
            <small className="text-muted">Gestión y seguimiento de boletas emitidas</small>
          </Link>
        </div>

        {/* Módulo Productos */}
        <div className="col">
          <Link to="/admin/productos" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
            <i className="bi bi-box-seam fs-1 text-success mb-2"></i>
            <h6 className="fw-bold mb-1">Productos & CRUD</h6>
            <small className="text-muted">Crear, editar inventario y stock crítico</small>
          </Link>
        </div>

        {/* Módulo Categorías */}
        <div className="col">
          <Link to="/admin/categorias" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
            <i className="bi bi-tags fs-1 text-warning mb-2"></i>
            <h6 className="fw-bold mb-1">Categorías</h6>
            <small className="text-muted">Organizar especialidades y secciones</small>
          </Link>
        </div>

        {/* Módulo Usuarios */}
        {isAdmin ? (
          <div className="col">
            <Link to="/admin/usuarios" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
              <i className="bi bi-people fs-1 text-info mb-2"></i>
              <h6 className="fw-bold mb-1">Usuarios</h6>
              <small className="text-muted">Gestión de cuentas, roles y compras</small>
            </Link>
          </div>
        ) : (
          <div className="col">
            <div className="card h-100 text-muted border-0 shadow-sm p-3 text-center bg-light opacity-75">
              <i className="bi bi-lock-fill fs-1 mb-2"></i>
              <h6 className="fw-bold mb-1">Usuarios</h6>
              <small>Restringido para rol vendedor</small>
            </div>
          </div>
        )}

        {/* Módulo Reportes */}
        <div className="col">
          <Link to="/admin/reportes" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
            <i className="bi bi-bar-chart-line fs-1 text-danger mb-2"></i>
            <h6 className="fw-bold mb-1">Reportes</h6>
            <small className="text-muted">Informes de venta y rendimiento</small>
          </Link>
        </div>

        {/* Módulo Perfil */}
        <div className="col">
          <Link to="/admin/perfil" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
            <i className="bi bi-person-gear fs-1 text-secondary mb-2"></i>
            <h6 className="fw-bold mb-1">Perfil Admin</h6>
            <small className="text-muted">Ajustes y credenciales de acceso</small>
          </Link>
        </div>

        {/* Módulo Tienda */}
        <div className="col">
          <Link to="/" className="card h-100 text-decoration-none text-dark border-0 shadow-sm p-3 text-center transition-all hover-shadow">
            <i className="bi bi-shop fs-1 text-primary mb-2"></i>
            <h6 className="fw-bold mb-1">Tienda Online</h6>
            <small className="text-muted">Vista en tiempo real para clientes</small>
          </Link>
        </div>
      </div>
    </div>
  );
}
