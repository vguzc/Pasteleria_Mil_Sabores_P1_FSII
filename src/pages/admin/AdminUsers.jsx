import React, { useState, useEffect } from 'react';
import { userService, orderService } from '../../services/db';
import UserModal from '../../components/admin/UserModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [historyUser, setHistoryUser] = useState(null);
  const [feedback, setFeedback] = useState('');

  const loadData = () => {
    setUsers(userService.getAll());
    setOrders(orderService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`)) {
      userService.delete(id);
      loadData();
      showFeedback(`Usuario "${nombre}" eliminado.`);
    }
  };

  const handleSave = (userData) => {
    if (editingUser) {
      userService.update(editingUser.id, userData);
      showFeedback(`Usuario "${userData.nombre}" actualizado.`);
    } else {
      userService.create(userData);
      showFeedback(`Usuario "${userData.nombre}" registrado exitosamente.`);
    }
    setModalOpen(false);
    loadData();
  };

  const showFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            Comunidad & Cuentas
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: 0 }}>
            Mantenedor de Usuarios
          </h1>
          <p className="text-muted small mb-0 mt-1">Gestión de cuentas de clientes, vendedores y administradores del equipo pastelero</p>
        </div>
        <button
          className="boton boton-primario btn-baker"
          onClick={handleOpenNew}
          style={{ fontSize: '0.85rem' }}
        >
          <i className="bi bi-person-plus me-2"></i>Nuevo Usuario
        </button>
      </div>

      {feedback && (
        <div
          className="alert alert-dismissible py-2 mb-3 small d-flex align-items-center"
          style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)', color: 'var(--color-espresso)' }}
        >
          <i className="bi bi-check-circle me-2" style={{ color: 'var(--color-caramelo)' }}></i>
          <span>{feedback}</span>
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }}>
                <tr>
                  <th style={{ color: 'var(--color-espresso)' }}>Usuario</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Correo</th>
                  <th style={{ color: 'var(--color-espresso)' }}>RUT</th>
                  <th style={{ color: 'var(--color-espresso)' }}>Ubicación</th>
                  <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Rol</th>
                  <th className="text-center" style={{ width: '180px', color: 'var(--color-espresso)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const userOrders = orders.filter(o => o.cliente?.correo?.toLowerCase() === u.correo.toLowerCase());
                  return (
                    <tr key={u.id || u.correo}>
                      <td>
                        <div className="fw-bold" style={{ color: 'var(--color-espresso)' }}>{u.nombre} {u.apellidos}</div>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>ID: {u.id}</span>
                      </td>
                      <td>{u.correo}</td>
                      <td>{u.rut || <span className="text-muted">N/A</span>}</td>
                      <td>
                        <div>{u.comuna || 'Sin comuna'}</div>
                        <small className="text-muted">{u.region || ''}</small>
                      </td>
                      <td className="text-center">
                        <span
                          className="badge text-uppercase"
                          style={{
                            backgroundColor: u.rol === 'administrador' ? '#201610' : u.rol === 'vendedor' ? 'var(--color-caramelo)' : '#FAF4EC',
                            color: u.rol === 'cliente' ? 'var(--color-espresso)' : '#FFFFFF',
                            border: u.rol === 'cliente' ? '1px solid var(--color-borde)' : 'none',
                            fontSize: '0.68rem',
                            letterSpacing: '0.08em'
                          }}
                        >
                          {u.rol}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Historial de Compras"
                            onClick={() => setHistoryUser(u)}
                          >
                            <i className="bi bi-bag-check me-1" style={{ color: 'var(--color-caramelo)' }}></i>{userOrders.length}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            title="Editar Usuario"
                            onClick={() => handleOpenEdit(u)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            title="Eliminar Usuario"
                            onClick={() => handleDelete(u.id, u.nombre)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Historial de Compras del Usuario */}
      {historyUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(32, 22, 16, 0.6)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
              <div className="modal-header text-white" style={{ backgroundColor: '#201610', borderBottom: '1px solid var(--color-borde)' }}>
                <h5 className="modal-title" style={{ fontFamily: 'var(--fuente-titulos)' }}>
                  <i className="bi bi-clock-history me-2" style={{ color: 'var(--color-caramelo)' }}></i>
                  Historial de Compras: {historyUser.nombre} {historyUser.apellidos}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setHistoryUser(null)}></button>
              </div>
              <div className="modal-body p-4" style={{ backgroundColor: '#FAF7F2' }}>
                {(() => {
                  const userOrders = orders.filter(o => o.cliente?.correo?.toLowerCase() === historyUser.correo.toLowerCase());
                  if (userOrders.length === 0) {
                    return (
                      <div className="text-center py-4 text-muted">
                        Este usuario no registra compras en la tienda online.
                      </div>
                    );
                  }
                  return (
                    <table className="table table-sm align-middle small bg-white rounded shadow-sm">
                      <thead style={{ backgroundColor: '#F5EFEB' }}>
                        <tr>
                          <th style={{ color: 'var(--color-espresso)' }}>N° Orden</th>
                          <th style={{ color: 'var(--color-espresso)' }}>Fecha</th>
                          <th style={{ color: 'var(--color-espresso)' }}>Productos</th>
                          <th className="text-end" style={{ color: 'var(--color-espresso)' }}>Total</th>
                          <th className="text-center" style={{ color: 'var(--color-espresso)' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td><strong style={{ color: 'var(--color-espresso)' }}>#{ord.numeroOrden}</strong></td>
                            <td>{new Date(ord.fecha).toLocaleDateString('es-CL')}</td>
                            <td>
                              {ord.items?.map((it, idx) => (
                                <span key={idx} className="badge me-1" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)' }}>
                                  {it.cantidad}x {it.nombre}
                                </span>
                              ))}
                            </td>
                            <td className="text-end fw-bold" style={{ color: 'var(--color-caramelo)' }}>{formatPrice(ord.total)}</td>
                            <td className="text-center">
                              <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF' }}>{ord.estado}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
              <div className="modal-footer" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-borde)' }}>
                <button type="button" className="boton boton-secundario btn-baker" onClick={() => setHistoryUser(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal CRUD Usuario */}
      {modalOpen && (
        <UserModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}