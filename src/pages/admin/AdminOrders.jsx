import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/db';
import ReceiptModal from '../../components/admin/ReceiptModal';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const loadOrders = () => {
    setOrders(orderService.getAll());
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage-updated', loadOrders);
    return () => window.removeEventListener('storage-updated', loadOrders);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    orderService.updateStatus(orderId, newStatus);
    loadOrders();
  };

  // Métricas y conteos de boletas
  const totalCount = orders.length;
  const pagadasCount = orders.filter((o) => o.estado === 'Pagada').length;
  const prepCount = orders.filter((o) => o.estado === 'En preparación').length;
  const despCount = orders.filter((o) => o.estado === 'En despacho').length;
  const entregadasCount = orders.filter((o) => o.estado === 'Entregada').length;
  const totalMonto = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  // Filtrado por texto y por estado
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'todos' && o.estado !== statusFilter) {
      return false;
    }
    const q = searchTerm.toLowerCase();
    return (
      o.numeroOrden.toLowerCase().includes(q) ||
      o.cliente?.nombre?.toLowerCase().includes(q) ||
      o.cliente?.apellidos?.toLowerCase().includes(q) ||
      o.cliente?.correo?.toLowerCase().includes(q)
    );
  });

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div>
      {/* Encabezado con contador total de boletas */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            Ventas & Comprobantes
          </span>
          <div className="d-flex align-items-center gap-3">
            <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
              Órdenes y Boletas
            </h1>
            <span
              className="badge px-3 py-2 rounded-pill"
              style={{
                backgroundColor: 'var(--color-caramelo)',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {totalCount} boletas registradas
            </span>
          </div>
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

      {/* Tarjetas KPI de Boletas */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100" style={{ backgroundColor: 'var(--color-espresso)', color: '#FFFFFF', borderRadius: '8px' }}>
            <span className="text-uppercase small fw-bold" style={{ color: 'var(--color-caramelo)', fontSize: '0.68rem', letterSpacing: '0.1em' }}>
              Total Boletas
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ fontFamily: 'var(--fuente-titulos)' }}>
              {totalCount}
            </h3>
            <small style={{ color: '#D2C4B5', fontSize: '0.74rem' }}>
              Monto: {formatPrice(totalMonto)}
            </small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <span className="text-uppercase small fw-bold text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
              Pagadas / Nuevas
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ fontFamily: 'var(--fuente-titulos)', color: '#2D6A4F' }}>
              {pagadasCount}
            </h3>
            <small className="text-muted" style={{ fontSize: '0.74rem' }}>Listas para cocina</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <span className="text-uppercase small fw-bold text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
              En Ruta / Taller
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-caramelo)' }}>
              {prepCount + despCount}
            </h3>
            <small className="text-muted" style={{ fontSize: '0.74rem' }}>{prepCount} prep. / {despCount} desp.</small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0 p-3 h-100" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
            <span className="text-uppercase small fw-bold text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
              Entregadas
            </span>
            <h3 className="fw-bold mb-0 mt-1" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
              {entregadasCount}
            </h3>
            <small className="text-muted" style={{ fontSize: '0.74rem' }}>Completadas con éxito</small>
          </div>
        </div>
      </div>

      {/* Pestañas de filtrado por estado y conteos */}
      <div className="card border-0 mb-3 p-2 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${statusFilter === 'todos' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter('todos')}
            >
              Todas ({totalCount})
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'Pagada' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter('Pagada')}
            >
              Pagadas ({pagadasCount})
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'En preparación' ? 'btn-warning text-dark' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter('En preparación')}
            >
              En preparación ({prepCount})
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'En despacho' ? 'btn-info text-dark' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter('En despacho')}
            >
              En despacho ({despCount})
            </button>
            <button
              type="button"
              className={`btn ${statusFilter === 'Entregada' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setStatusFilter('Entregada')}
            >
              Entregadas ({entregadasCount})
            </button>
          </div>

          <span className="small text-muted">
            Mostrando <strong>{filteredOrders.length}</strong> de <strong>{totalCount}</strong> boletas
          </span>
        </div>
      </div>

      {/* Tabla de Boletas */}
      <div className="card shadow-sm border-0" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }}>
                <tr>
                  <th style={{ color: 'var(--color-espresso)' }}>N° Orden / Boleta</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Fecha</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Cliente</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Modalidad & Entrega</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Total Boleta</th>
                  <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Estado</th>
                  <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No se encontraron boletas u órdenes para el criterio seleccionado.
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
                          {ord.agendamiento?.modalidad === 'retiro' ? (
                            <span className="badge me-1" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF', fontSize: '0.68rem' }}>Retiro en Taller</span>
                          ) : (
                            `${ord.cliente?.direccion || ''} ${ord.cliente?.departamento || ''}`
                          )}
                        </div>
                        <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                          {ord.agendamiento?.fecha ? `Prog: ${ord.agendamiento.fecha} (${ord.agendamiento.franjaHoraria})` : ord.cliente?.comuna}
                        </span>
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