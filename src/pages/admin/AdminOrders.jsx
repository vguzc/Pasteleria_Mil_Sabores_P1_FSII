import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/db';
import ReceiptModal from '../../components/admin/ReceiptModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    setOrders(orderService.getAll());
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    orderService.updateStatus(orderId, newStatus);
    setOrders(orderService.getAll());
  };

  const filteredOrders = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      o.numeroOrden.toLowerCase().includes(q) ||
      o.cliente?.nombre?.toLowerCase().includes(q) ||
      o.cliente?.apellidos?.toLowerCase().includes(q) ||
      o.cliente?.correo?.toLowerCase().includes(q)
    );
  });

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            Ventas & Comprobantes
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
            Órdenes y Boletas
          </h1>
          <p className="text-muted small mb-0 mt-1">Gestión de compras realizadas, cambio de estado y visualización de boleta oficial</p>
        </div>
        <div style={{ maxWidth: '320px', width: '100%' }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar por N° orden, cliente o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderColor: 'var(--color-borde)', backgroundColor: '#FFFFFF' }}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }}>
                <tr>
                  <th style={{ color: 'var(--color-espresso)' }}>N° Orden</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Fecha</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Cliente</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Despacho</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Total</th>
                  <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Estado</th>
                  <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No se encontraron órdenes registradas.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong style={{ color: 'var(--color-espresso)' }}>#{ord.numeroOrden}</strong>
                      </td>
                      <td>
                        {new Date(ord.fecha).toLocaleDateString('es-CL')}
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {new Date(ord.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold" style={{ color: 'var(--color-espresso)' }}>{ord.cliente?.nombre} {ord.cliente?.apellidos}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{ord.cliente?.correo}</div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '180px' }}>
                          {ord.cliente?.direccion} {ord.cliente?.departamento || ''}
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{ord.cliente?.comuna}</span>
                      </td>
                      <td className="fw-bold" style={{ color: 'var(--color-caramelo)' }}>
                        {formatPrice(ord.total)}
                      </td>
                      <td className="text-center">
                        <select
                          className="form-select form-select-sm py-0 fw-semibold"
                          value={ord.estado}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{ width: '140px', margin: '0 auto', borderColor: 'var(--color-borde)', color: 'var(--color-espresso)' }}
                        >
                          <option value="Pagada">Pagada</option>
                          <option value="En preparación">En preparación</option>
                          <option value="En despacho">En despacho</option>
                          <option value="Entregada">Entregada</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{
                            backgroundColor: '#FAF4EC',
                            border: '1px solid var(--color-caramelo)',
                            color: 'var(--color-espresso)',
                            fontWeight: 600,
                            fontSize: '0.78rem'
                          }}
                          onClick={() => setSelectedReceipt(ord)}
                          title="Mostrar Boleta"
                        >
                          <i className="bi bi-receipt me-1" style={{ color: 'var(--color-caramelo)' }}></i>Mostrar Boleta
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Boleta */}
      {selectedReceipt && (
        <ReceiptModal
          order={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}