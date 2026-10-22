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

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Reportes y Estadísticas de Venta</h2>
        <p className="text-muted small mb-0">Análisis comercial, rendimiento financiero y rotación de productos</p>
      </div>

      {/* Tarjetas financieras */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <span className="text-muted small text-uppercase fw-bold">Facturación Total Bruta</span>
            <h3 className="fw-bold text-primary mt-2">{formatPrice(totalVentas)}</h3>
            <small className="text-muted">{orders.length} pedidos procesados</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <span className="text-muted small text-uppercase fw-bold">Descuentos y Cupones Aplicados</span>
            <h3 className="fw-bold text-danger mt-2">{formatPrice(totalDescuentos)}</h3>
            <small className="text-muted">Ahorro para clientes y convenios</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 bg-light">
            <span className="text-muted small text-uppercase fw-bold">IVA Débito Fiscal (19%)</span>
            <h3 className="fw-bold text-success mt-2">{formatPrice(totalIva)}</h3>
            <small className="text-muted">Impuestos tributarios calculados</small>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Productos más vendidos */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              <i className="bi bi-trophy text-warning me-2"></i>Ranking de Productos Más Vendidos
            </h5>
            {topProducts.length === 0 ? (
              <p className="text-muted small">No hay suficientes datos de venta registrados.</p>
            ) : (
              <div className="list-group list-group-flush small">
                {topProducts.map((p, idx) => (
                  <div key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                    <div>
                      <span className="badge bg-secondary me-2">#{idx + 1}</span>
                      <strong>{p.nombre}</strong>
                    </div>
                    <span className="badge bg-primary rounded-pill">{p.cantidad} unid.</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado del Inventario */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h5 className="fw-bold mb-3 border-bottom pb-2">
              <i className="bi bi-pie-chart text-info me-2"></i>Estado del Inventario
            </h5>
            <div className="d-flex justify-content-between py-2 border-bottom small">
              <span>Total de Productos en Catálogo:</span>
              <strong>{products.length}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom small">
              <span>Productos con Stock Crítico (≤ 6 un.):</span>
              <strong className="text-danger">{products.filter(p => Number(p.stock) <= 6).length}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 border-bottom small">
              <span>Productos en Promoción / Oferta:</span>
              <strong className="text-warning">{products.filter(p => p.enOferta).length}</strong>
            </div>
            <div className="d-flex justify-content-between py-2 small">
              <span>Unidades Físicas Totales en Taller:</span>
              <strong>{products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0)} un.</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
