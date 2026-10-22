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

  const loadStats = () => {
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
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('storage-updated', loadStats);
    return () => window.removeEventListener('storage-updated', loadStats);
  }, []);

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      {/* Encabezado Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            Panel de Control General
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: '2.2rem', textAlign: 'left', margin: 0 }}>
            Dashboard del Maestro Pastelero
          </h1>
          <p className="text-muted small mb-0 mt-1">Resumen en vivo de inventario, ventas y actividad del sistema.</p>
        </div>
        <div>
          <span
            className="badge px-3 py-2"
            style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)', fontSize: '0.78rem' }}
          >
            <i className="bi bi-clock me-2" style={{ color: 'var(--color-caramelo)' }}></i>
            Actualizado en tiempo real
          </span>
        </div>
      </div>

      {/* Tarjetas Principales de Métricas (Cozy Palette) */}
      <div className="row g-4 mb-5">
        {/* Tarjeta 1: Compras Totales (Espresso Intenso) */}
        <div className="col-12 col-md-4">
          <div
            className="card shadow-sm border-0 rounded-3 p-4 h-100"
            style={{
              backgroundColor: 'var(--color-espresso)',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(44, 30, 22, 0.12)'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase small fw-bold" style={{ color: 'var(--color-caramelo)', letterSpacing: '0.12em', fontSize: '0.72rem' }}>
                Total Boletas Emitidas
              </span>
              <i className="bi bi-receipt fs-3" style={{ color: 'var(--color-caramelo)' }}></i>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="display-6 fw-bold mb-0 text-white" style={{ fontFamily: 'var(--fuente-texto)' }}>
                {stats.totalCompras}
              </h3>
              <span className="small" style={{ color: '#EADFD2' }}>boletas registradas</span>
            </div>
            <div className="small mt-auto" style={{ color: '#D2C4B5' }}>
              Monto total facturado: <strong className="text-white">{formatPrice(stats.montoCompras)}</strong>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Inventario (Caramelo Toffee) */}
        <div className="col-12 col-md-4">
          <div
            className="card shadow-sm border-0 rounded-3 p-4 h-100"
            style={{
              backgroundColor: 'var(--color-caramelo)',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(196, 136, 75, 0.2)'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase small fw-bold" style={{ color: '#FFFFFF', letterSpacing: '0.12em', fontSize: '0.72rem', opacity: 0.9 }}>
                Inventario de Productos
              </span>
              <i className="bi bi-box-seam fs-3 text-white"></i>
            </div>
            <h3 className="display-6 fw-bold mb-1" style={{ fontFamily: 'var(--fuente-titulos)' }}>
              {stats.totalProductos}
            </h3>
            <div className="small mt-auto">
              {stats.productosCriticos > 0 ? (
                <span className="badge bg-danger text-white">
                  {stats.productosCriticos} con stock crítico
                </span>
              ) : (
                <span className="badge bg-white text-dark">Inventario al día</span>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Usuarios (Crema / Moca Suave) */}
        <div className="col-12 col-md-4">
          <div
            className="card shadow-sm rounded-3 p-4 h-100"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              color: 'var(--color-espresso)',
              boxShadow: '0 4px 16px rgba(44, 30, 22, 0.04)'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-uppercase small fw-bold" style={{ color: 'var(--color-moca)', letterSpacing: '0.12em', fontSize: '0.72rem' }}>
                Usuarios Registrados
              </span>
              <i className="bi bi-people fs-3" style={{ color: 'var(--color-caramelo)' }}></i>
            </div>
            <h3 className="display-6 fw-bold mb-1" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
              {stats.totalUsuarios}
            </h3>
            <div className="small text-muted mt-auto">
              Clientes, vendedores y administradores
            </div>
          </div>
        </div>
      </div>

      {/* Módulos de Acceso Rápido */}
      <div className="mb-3">
        <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.4rem' }}>
          Módulos Administrativos
        </h3>
        <p className="text-muted small">Accede a las herramientas de gestión pastelera:</p>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
        {/* Módulo Órdenes */}
        <div className="col">
          <Link
            to="/admin/ordenes"
            className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              borderRadius: '8px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-receipt fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Órdenes & Boletas</h6>
            <small className="text-muted d-block mb-2">Gestión y seguimiento de boletas emitidas</small>
            <span className="badge mt-auto" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)', fontSize: '0.75rem', fontWeight: 600 }}>
              {stats.totalCompras} boletas registradas
            </span>
          </Link>
        </div>

        {/* Módulo Productos */}
        <div className="col">
          <Link
            to="/admin/productos"
            className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              borderRadius: '8px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-box-seam fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Productos & Stock</h6>
            <small className="text-muted">Crear, editar recetas y alertar stock</small>
          </Link>
        </div>

        {/* Módulo Categorías */}
        <div className="col">
          <Link
            to="/admin/categorias"
            className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              borderRadius: '8px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-tags fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Categorías</h6>
            <small className="text-muted">Organizar líneas y secciones</small>
          </Link>
        </div>

        {/* Módulo Usuarios */}
        {isAdmin ? (
          <div className="col">
            <Link
              to="/admin/usuarios"
              className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-borde)',
                borderRadius: '8px',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
            >
              <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
                <i className="bi bi-people fs-4"></i>
              </div>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Usuarios</h6>
              <small className="text-muted">Roles, cuentas de clientes y personal</small>
            </Link>
          </div>
        ) : (
          <div className="col">
            <div
              className="card h-100 border-0 shadow-sm p-4 text-center opacity-75"
              style={{ backgroundColor: '#F3ECE3', borderRadius: '8px' }}
            >
              <i className="bi bi-lock-fill fs-2 mb-2 text-muted"></i>
              <h6 className="fw-bold mb-1 text-muted">Usuarios</h6>
              <small className="text-muted">Restringido para rol vendedor</small>
            </div>
          </div>
        )}

        {/* Módulo Reportes */}
        <div className="col">
          <Link
            to="/admin/reportes"
            className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              borderRadius: '8px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-bar-chart-line fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Reportes & Ventas</h6>
            <small className="text-muted">Gráficos de ventas y rendimiento</small>
          </Link>
        </div>

        {/* Módulo Perfil */}
        <div className="col">
          <Link
            to="/admin/perfil"
            className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              borderRadius: '8px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-person-gear fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Perfil Admin</h6>
            <small className="text-muted">Ajustes y credenciales de acceso</small>
          </Link>
        </div>

        {/* Módulo Tienda Online */}
        <div className="col">
          <Link
            to="/"
            className="card h-100 text-decoration-none border-0 shadow-sm p-4 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-borde)',
              borderRadius: '8px',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
          >
            <div style={{ width: '48px', height: '48px', margin: '0 auto 0.85rem', borderRadius: '50%', backgroundColor: '#FAF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-caramelo)' }}>
              <i className="bi bi-shop fs-4"></i>
            </div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>Tienda Online</h6>
            <small className="text-muted">Vista en tiempo real para clientes</small>
          </Link>
        </div>
      </div>
    </div>
  );
}