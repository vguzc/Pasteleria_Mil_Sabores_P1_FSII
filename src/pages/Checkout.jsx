import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/db';
import { REGIONES_Y_COMUNAS } from '../services/chileData';
import AlertMessage from '../components/common/AlertMessage';

export default function Checkout() {
  const { cart, totals, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Cerrillos',
    indicaciones: ''
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-completar datos si el usuario ha iniciado sesión (Requisito explícito de la pauta)
  useEffect(() => {
    if (currentUser) {
      setFormData({
        nombre: currentUser.nombre || '',
        apellidos: currentUser.apellidos || '',
        correo: currentUser.correo || '',
        calle: currentUser.direccion || '',
        departamento: currentUser.departamento || '',
        region: currentUser.region || 'Región Metropolitana de Santiago',
        comuna: currentUser.comuna || 'Cerrillos',
        indicaciones: currentUser.indicaciones || ''
      });
    }
  }, [currentUser]);

  // Actualizar lista de comunas según la región seleccionada
  useEffect(() => {
    const reg = REGIONES_Y_COMUNAS.find(r => r.region === formData.region);
    if (reg) {
      setComunasDisponibles(reg.comunas);
      if (!reg.comunas.includes(formData.comuna)) {
        setFormData(prev => ({ ...prev, comuna: reg.comunas[0] || '' }));
      }
    }
  }, [formData.region]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    const reg = REGIONES_Y_COMUNAS.find(r => r.region === newRegion);
    setFormData(prev => ({
      ...prev,
      region: newRegion,
      comuna: reg ? reg.comunas[0] : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.correo.trim()) {
      setError('Por favor completa todos los campos de información del cliente.');
      return;
    }

    if (!formData.calle.trim() || !formData.region || !formData.comuna) {
      setError('Por favor completa la dirección de entrega obligatoria.');
      return;
    }

    if (cart.length === 0) {
      setError('Tu carrito de compras está vacío.');
      return;
    }

    setIsProcessing(true);

    // Si está marcado simular error (Figura 8)
    if (simulateError) {
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/compra-error', {
          state: {
            orderData: {
              numeroOrden: (20240700 + Math.floor(Math.random() * 50) + 1).toString(),
              cliente: formData,
              items: cart,
              total: totals.total,
              subtotal: totals.subtotal,
              iva: totals.iva,
              envio: totals.envio,
              descuento: totals.descuento
            }
          }
        });
      }, 800);
      return;
    }

    // Proceso de compra exitosa (Figura 7)
    setTimeout(() => {
      const orderPayload = {
        cliente: {
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          correo: formData.correo.trim(),
          direccion: formData.calle.trim(),
          departamento: formData.departamento.trim(),
          region: formData.region,
          comuna: formData.comuna,
          indicaciones: formData.indicaciones.trim()
        },
        items: [...cart],
        subtotal: totals.subtotal,
        descuento: totals.descuento,
        cupon: totals.cupon?.codigo || null,
        iva: totals.iva,
        envio: totals.envio,
        total: totals.total
      };

      const newOrder = orderService.create(orderPayload);
      clearCart();
      setIsProcessing(false);
      navigate(`/compra-exitosa/${newOrder.numeroOrden}`, { state: { order: newOrder } });
    }, 1000);
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 border-0 shadow-sm max-w-500 mx-auto">
          <h4>No hay productos para pagar</h4>
          <p className="text-muted small">Agrega productos al carrito antes de proceder al pago.</p>
          <div>
            <Link to="/productos" className="btn btn-primary">Ir a la tienda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/carrito">Carrito</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Checkout y Pago</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0 p-4 mb-4">
            {/* Header del Checkout (Figura 6) */}
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <h2 className="fw-bold font-serif mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Carrito de compra
                </h2>
                <small className="text-muted">Completa la siguiente información para procesar tu pedido</small>
              </div>
              <div>
                <span className="badge bg-primary fs-5 px-3 py-2 shadow-sm">
                  Total a pagar: {formatPrice(totals.total)}
                </span>
              </div>
            </div>

            {/* Aviso de auto-completado si hay sesión activa */}
            {currentUser ? (
              <div className="alert alert-info py-2 small d-flex align-items-center mb-4">
                <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                <span>
                  Has iniciado sesión como <strong>{currentUser.nombre} {currentUser.apellidos}</strong>. Tu información y dirección han sido cargadas automáticamente.
                </span>
              </div>
            ) : (
              <div className="alert alert-warning py-2 small d-flex align-items-center mb-4">
                <i className="bi bi-person-fill-exclamation me-2 fs-5"></i>
                <span>
                  ¿Ya tienes cuenta? <Link to="/login" className="alert-link fw-bold">Inicia sesión</Link> para autocompletar tus datos de despacho automáticamente.
                </span>
              </div>
            )}

            {/* Resumen de items del carrito (Figura 6) */}
            <div className="table-responsive mb-4">
              <table className="table table-sm align-middle">
                <thead className="table-light small">
                  <tr>
                    <th style={{ width: '70px' }}>Imagen</th>
                    <th>Nombre</th>
                    <th className="text-end" style={{ width: '100px' }}>Precio</th>
                    <th className="text-center" style={{ width: '80px' }}>Cantidad</th>
                    <th className="text-end" style={{ width: '110px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imagen || '/img/torta-mil-sabores.png'}
                          alt={item.nombre}
                          width="45"
                          height="45"
                          className="rounded object-fit-contain bg-light"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/torta-mil-sabores.png';
                          }}
                        />
                      </td>
                      <td className="small fw-semibold">{item.nombre}</td>
                      <td className="text-end small">{formatPrice(item.precio)}</td>
                      <td className="text-center small">{item.cantidad}</td>
                      <td className="text-end small fw-bold">{formatPrice(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <AlertMessage message={error} type="danger" onClose={() => setError('')} />}

              {/* Sección 1: Información del cliente */}
              <div className="mb-4">
                <h5 className="fw-bold border-bottom pb-2 mb-3 text-secondary">
                  Información del cliente
                </h5>
                <small className="text-muted d-block mb-3">Completa la siguiente información</small>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      placeholder="Pedro"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Apellidos *</label>
                    <input
                      type="text"
                      name="apellidos"
                      className="form-control"
                      placeholder="Hacker"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Correo *</label>
                    <input
                      type="email"
                      name="correo"
                      className="form-control"
                      placeholder="pedro.hacker20@example.com"
                      value={formData.correo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Dirección de entrega de los productos */}
              <div className="mb-4">
                <h5 className="fw-bold border-bottom pb-2 mb-3 text-secondary">
                  Dirección de entrega de los productos
                </h5>
                <small className="text-muted d-block mb-3">Ingrese dirección de forma detallada</small>

                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label small fw-bold">Calle *</label>
                    <input
                      type="text"
                      name="calle"
                      className="form-control"
                      placeholder="Los Crisantemos, Edificio Norte"
                      value={formData.calle}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Departamento (opcional)</label>
                    <input
                      type="text"
                      name="departamento"
                      className="form-control"
                      placeholder="Ej: Depto 603"
                      value={formData.departamento}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Región *</label>
                    <select
                      name="region"
                      className="form-select"
                      value={formData.region}
                      onChange={handleRegionChange}
                      required
                    >
                      {REGIONES_Y_COMUNAS.map((r, i) => (
                        <option key={i} value={r.region}>{r.region}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Comuna *</label>
                    <select
                      name="comuna"
                      className="form-select"
                      value={formData.comuna}
                      onChange={handleChange}
                      required
                    >
                      {comunasDisponibles.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Indicaciones para la entrega (opcional)</label>
                    <textarea
                      name="indicaciones"
                      className="form-control"
                      rows="2"
                      placeholder="Ej: El martes no estaremos en el depto, pero puede dejárselo con el conserje."
                      value={formData.indicaciones}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Selector para simular compra exitosa o error de pago según rúbrica */}
              <div className="p-3 bg-light rounded-3 mb-4 border d-flex justify-content-between align-items-center">
                <div>
                  <strong className="d-block small text-dark">Simulación de Pasarela de Pago:</strong>
                  <span className="text-muted small">
                    {simulateError ? 'Se simulará un rechazo bancario (Figura 8)' : 'Se simulará un pago aprobado exitosamente (Figura 7)'}
                  </span>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="switchError"
                    checked={simulateError}
                    onChange={(e) => setSimulateError(e.target.checked)}
                  />
                  <label className="form-check-label small fw-bold text-danger" htmlFor="switchError">
                    Forzar error de pago
                  </label>
                </div>
              </div>

              {/* Botón de pago (Figura 6) */}
              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5 shadow"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span><i className="spinner-border spinner-border-sm me-2"></i>Procesando Pago...</span>
                  ) : (
                    <span>Pagar ahora {formatPrice(totals.total)}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
