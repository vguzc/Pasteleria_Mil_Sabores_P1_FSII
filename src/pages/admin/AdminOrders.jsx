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

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Órdenes y Boletas</h2>
          <p className="text-muted small mb-0">Gestión de compras realizadas, cambio de estado y visualización de boleta</p>
        </div>
        <div style={{ maxWidth: '300px' }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar por N° orden, cliente o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>N° Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Despacho</th>
                  <th>Total</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
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
                        <strong>#{ord.numeroOrden}</strong>
                      </td>
                      <td>
                        {new Date(ord.fecha).toLocaleDateString('es-CL')}
                        <br />
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {new Date(ord.fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold">{ord.cliente?.nombre} {ord.cliente?.apellidos}</div>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{ord.cliente?.correo}</div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '180px' }}>
                          {ord.cliente?.direccion} {ord.cliente?.departamento || ''}
                        </div>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>{ord.cliente?.comuna}</span>
                      </td>
                      <td className="fw-bold text-primary">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="text-center">
                        <select
                          className={`form-select form-select-sm py-0 ${ord.estado === 'Pagada' ? 'text-primary' : ord.estado === 'Entregada' ? 'text-success' : 'text-warning'}`}
                          value={ord.estado}
                          onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                          style={{ width: '130px', margin: '0 auto' }}
                        >
                          <option value="Pagada">Pagada</option>
                          <option value="En preparación">En preparación</option>
                          <option value="En despacho">En despacho</option>
                          <option value="Entregada">Entregada</option>
                        </select>
                      </td>
                      <td className="text-center">
                        {/* Botón Mostrar Boleta (Figura 10 de la pauta) */}
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm px-2 py-1"
                          onClick={() => setSelectedReceipt(ord)}
                          title="Mostrar Boleta"
                        >
                          <i className="bi bi-receipt me-1"></i>Mostrar Boleta
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

      {/* Modal Mostrar Boleta */}
      {selectedReceipt && (
        <ReceiptModal order={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
}
