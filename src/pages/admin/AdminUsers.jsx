import React, { useState, useEffect } from 'react';
import { userService, orderService } from '../../services/db';
import UserModal from '../../components/admin/UserModal';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [historyUser, setHistoryUser] = useState(null); // Para ver historial de compras
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

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Mantenedor de Usuarios</h2>
          <p className="text-muted small mb-0">Gestión de cuentas de clientes, vendedores y administradores</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenNew}>
          <i className="bi bi-person-plus me-2"></i>Nuevo Usuario
        </button>
      </div>

      {feedback && (
        <div className="alert alert-success py-2 mb-3">
          <i className="bi bi-check-circle me-2"></i>{feedback}
        </div>
      )}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>RUT</th>
                  <th>Ubicación</th>
                  <th className="text-center">Rol</th>
                  <th className="text-center" style={{ width: '180px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const userOrders = orders.filter(o => o.cliente?.correo?.toLowerCase() === u.correo.toLowerCase());
                  return (
                    <tr key={u.id || u.correo}>
                      <td>
                        <div className="fw-bold">{u.nombre} {u.apellidos}</div>
                        <span className="text-muted" style={{ fontSize: '0.72rem' }}>ID: {u.id}</span>
                      </td>
                      <td>{u.correo}</td>
                      <td>{u.rut || <span className="text-muted">N/A</span>}</td>
                      <td>
                        <div>{u.comuna || 'Sin comuna'}</div>
                        <small className="text-muted">{u.region || ''}</small>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${u.rol === 'administrador' ? 'bg-danger' : u.rol === 'vendedor' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          {/* Botón Historial de Compras (Figura 10 de la pauta) */}
                          <button
                            type="button"
                            className="btn btn-outline-info"
                            title="Historial de Compras"
                            onClick={() => setHistoryUser(u)}
                          >
                            <i className="bi bi-bag-check me-1"></i>{userOrders.length}
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            title="Editar Usuario"
                            onClick={() => handleOpenEdit(u)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
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

      {/* Modal Historial de Compras del Usuario (Figura 10) */}
      {historyUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow border-0">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  <i className="bi bi-clock-history me-2"></i>Historial de Compras: {historyUser.nombre} {historyUser.apellidos}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setHistoryUser(null)}></button>
              </div>
              <div className="modal-body p-4">
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
                    <table className="table table-sm align-middle small">
                      <thead className="table-light">
                        <tr>
                          <th>N° Orden</th>
                          <th>Fecha</th>
                          <th>Productos</th>
                          <th className="text-end">Total</th>
                          <th className="text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td><strong>#{ord.numeroOrden}</strong></td>
                            <td>{new Date(ord.fecha).toLocaleDateString('es-CL')}</td>
                            <td>
                              {ord.items?.map((it, idx) => (
                                <span key={idx} className="badge bg-light text-dark border me-1">
                                  {it.cantidad}x {it.nombre}
                                </span>
                              ))}
                            </td>
                            <td className="text-end fw-bold text-primary">{formatPrice(ord.total)}</td>
                            <td className="text-center"><span className="badge bg-success">{ord.estado}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setHistoryUser(null)}>Cerrar</button>
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
