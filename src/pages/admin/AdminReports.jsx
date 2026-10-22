import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../../services/db';

export default function AdminReports() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setOrders(orderService.getAll());
    setProducts(productService.getAll());
  }, []);

  const totalVentas = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalDescuentos = orders.reduce((acc, o) => acc + (o.descuento || 0), 0);
  const totalIva = orders.reduce((acc, o) => acc + (o.iva || 0), 0);

  // Conteo de ventas por producto
  const productSalesMap = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      productSalesMap[item.nombre] = (productSalesMap[item.nombre] || 0) + item.cantidad;
    });
  });

  const topProducts = Object.entries(productSalesMap)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad);

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      <div className="mb-4">
        <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
          Analítica Comercial & Rendimiento
        </span>
        <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
          Reportes y Estadísticas de Venta
        </h1>
        <p className="text-muted small mb-0 mt-1">Análisis comercial, rendimiento financiero y rotación de productos artesanales</p>
      </div>

      {/* Tarjetas financieras */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <span className="small text-uppercase fw-bold" style={{ color: 'var(--color-caramelo)', letterSpacing: '0.12em', fontSize: '0.72rem' }}>
              Facturación Total Bruta
            </span>
            <h3 className="fw-bold mt-2 mb-1" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
              {formatPrice(totalVentas)}
            </h3>
            <small className="text-muted">{orders.length} pedidos procesados</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <span className="small text-uppercase fw-bold" style={{ color: 'var(--color-moca)', letterSpacing: '0.12em', fontSize: '0.72rem' }}>
              Descuentos y Cupones Aplicados
            </span>
            <h3 className="fw-bold mt-2 mb-1" style={{ fontFamily: 'var(--fuente-titulos)', color: '#B54234' }}>
              {formatPrice(totalDescuentos)}
            </h3>
            <small className="text-muted">Ahorro para clientes y convenios</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <span className="small text-uppercase fw-bold" style={{ color: 'var(--color-moca)', letterSpacing: '0.12em', fontSize: '0.72rem' }}>
              IVA Débito Fiscal (19%)
            </span>
            <h3 className="fw-bold mt-2 mb-1" style={{ fontFamily: 'var(--fuente-titulos)', color: '#2D6A4F' }}>
              {formatPrice(totalIva)}
            </h3>
            <small className="text-muted">Impuestos tributarios calculados</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Productos más vendidos */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 h-100" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
              <i className="bi bi-trophy me-2" style={{ color: 'var(--color-caramelo)' }}></i>Ranking de Productos Más Vendidos
            </h5>
            {topProducts.length === 0 ? (
              <p className="text-muted small">No hay suficientes datos de venta registrados.</p>
            ) : (
              <div className="list-group list-group-flush small">
                {topProducts.map((p, idx) => (
                  <div key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-bottom" style={{ borderColor: 'var(--color-borde)' }}>
                    <div>
                      <span className="badge me-2" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                        #{idx + 1}
                      </span>
                      <strong style={{ color: 'var(--color-espresso)' }}>{p.nombre}</strong>
                    </div>
                    <span className="badge rounded-pill" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF' }}>
                      {p.cantidad} unid.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado del Inventario */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 h-100" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <h5 className="fw-bold mb-3 border-bottom pb-2" style={{ color: 'var(--color-espresso)', fontFamily: 'var(--fuente-titulos)' }}>
              <i className="bi bi-pie-chart me-2" style={{ color: 'var(--color-caramelo)' }}></i>Estado del Inventario
            </h5>
            <div className="d-flex justify-content-between py-2 border-bottom small" style={{ borderColor: 'var(--color-borde)' }}>
              <span>Total de Productos en Catálogo:</span>
              <strong style={{ color: 'var(--color-espresso)' }}>{products.length}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom small" style={{ borderColor: 'var(--color-borde)' }}>
              <span>Productos con Stock Crítico (≤ 6 un.):</span>
              <strong style={{ color: '#B54234' }}>{products.filter(p => Number(p.stock) <= 6).length}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom small" style={{ borderColor: 'var(--color-borde)' }}>
              <span>Productos en Oferta Especial:</span>
              <strong style={{ color: 'var(--color-caramelo)' }}>{products.filter(p => p.enOferta).length}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 small">
              <span>Productos Destacados en Portada:</span>
              <strong style={{ color: 'var(--color-espresso)' }}>{products.filter(p => p.destacado).length}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}