import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, productService, SUCURSALES_RETIRO } from '../services/db';
import { REGIONES_Y_COMUNAS } from '../services/chileData';
import AlertMessage from '../components/common/AlertMessage';

export default function Checkout() {
  const {
    cart,
    totals,
    clearCart,
    scheduling,
    updateScheduling,
    applyCoupon,
    removeCoupon
  } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });

  // Fechas de referencia para el agendamiento
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Estados del formulario de contacto y dirección
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    rut: '',
    calle: '',
    departamento: '',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Santiago',
    indicaciones: '',
    notasRetiro: ''
  });

  const [comunasDisponibles, setComunasDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [simulateError, setSimulateError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-completar datos si el usuario ha iniciado sesión (Requisito de la pauta)
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nombre: currentUser.nombre || prev.nombre,
        apellidos: currentUser.apellidos || prev.apellidos,
        correo: currentUser.correo || prev.correo,
        telefono: currentUser.telefono || prev.telefono,
        rut: currentUser.rut || prev.rut,
        calle: currentUser.direccion || prev.calle,
        departamento: currentUser.departamento || prev.departamento,
        region: currentUser.region || prev.region,
        comuna: currentUser.comuna || prev.comuna,
        indicaciones: currentUser.indicaciones || prev.indicaciones
      }));
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

  const handleApplyCoupon = (codeToApply) => {
    const code = (typeof codeToApply === 'string' ? codeToApply : inputCoupon).trim();
    setCouponMsg({ text: '', type: '' });
    if (!code) return;

    const res = applyCoupon(code);
    if (res.success) {
      setCouponMsg({
        text: `Cupón "${res.coupon.codigo}" aplicado con éxito (-${res.coupon.porcentaje}% de descuento).`,
        type: 'success'
      });
      setInputCoupon('');
    } else {
      setCouponMsg({
        text: res.message || 'Cupón no válido o expirado.',
        type: 'danger'
      });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMsg({ text: 'Cupón removido.', type: 'info' });
  };

  const isRetiro = scheduling?.modalidad === 'retiro';
  const selectedBranchName = scheduling?.sucursalRetiro || 'Mil Sabores Chicureo';
  const selectedBranchObj = SUCURSALES_RETIRO.find(s => s.nombre === selectedBranchName) || SUCURSALES_RETIRO[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nombre.trim() || !formData.apellidos.trim() || !formData.correo.trim()) {
      setError('Por favor completa todos los campos obligatorios de información del cliente.');
      return;
    }

    if (!isRetiro && (!formData.calle.trim() || !formData.region || !formData.comuna)) {
      setError('Por favor ingresa tu calle, número, región y comuna para el despacho a domicilio.');
      return;
    }

    if (cart.length === 0) {
      setError('Tu bolsa de compras está vacía.');
      return;
    }

    // Validación de stock en tiempo real antes de procesar el pago
    const allProducts = productService.getAll();
    for (const item of cart) {
      const p = allProducts.find(prod => prod.id === item.id);
      if (p && item.cantidad > p.stock) {
        setError(`Stock insuficiente para "${item.nombre}". Solo quedan ${p.stock} unidades en el taller.`);
        return;
      }
    }

    setIsProcessing(true);

    // Simular error si está activado el switch de prueba
    if (simulateError) {
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/compra-error', {
          state: {
            orderData: {
              numeroOrden: (20240700 + Math.floor(Math.random() * 50) + 1).toString(),
              cliente: {
                ...formData,
                direccion: isRetiro ? selectedBranchObj.direccion : formData.calle
              },
              items: cart,
              total: totals.total,
              subtotal: totals.subtotal,
              iva: totals.iva,
              envio: totals.envio,
              descuento: totals.descuento
            }
          }
        });
      }, 700);
      return;
    }

    // Proceso de compra exitosa
    setTimeout(() => {
      const orderPayload = {
        cliente: {
          nombre: formData.nombre.trim(),
          apellidos: formData.apellidos.trim(),
          correo: formData.correo.trim(),
          telefono: formData.telefono.trim(),
          rut: formData.rut.trim(),
          direccion: isRetiro ? `Retiro en ${selectedBranchObj.nombre} (${selectedBranchObj.direccion})` : formData.calle.trim(),
          departamento: isRetiro ? '' : formData.departamento.trim(),
          region: isRetiro ? 'Región Metropolitana de Santiago' : formData.region,
          comuna: isRetiro ? 'Santiago' : formData.comuna,
          indicaciones: (isRetiro ? formData.notasRetiro : formData.indicaciones).trim()
        },
        agendamiento: {
          modalidad: scheduling?.modalidad || 'despacho',
          fecha: scheduling?.fecha || todayStr,
          franjaHoraria: scheduling?.franjaHoraria || 'tarde',
          dedicatoria: scheduling?.dedicatoria || '',
          sucursalRetiro: isRetiro ? selectedBranchObj.nombre : null,
          direccionRetiro: isRetiro ? selectedBranchObj.direccion : null
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
    }, 900);
  };

  const formatPrice = (val) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val || 0);

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '5rem 0' }}>
        <div className="contenedor text-center">
          <div className="card p-5 border-0 shadow-sm mx-auto" style={{ maxWidth: '520px', borderRadius: '12px', backgroundColor: '#FFFFFF' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 1.25rem', borderRadius: '50%', backgroundColor: '#F3ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-moca)' }}>
              <i className="bi bi-bag-x fs-2"></i>
            </div>
            <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
              No hay productos para pagar
            </h3>
            <p className="text-muted small mb-4">
              Tu bolsa de compras está vacía. Añade tus tortas o dulces favoritos antes de proceder al checkout.
            </p>
            <div>
              <Link to="/productos" className="boton boton-primario btn-baker">
                Explorar Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
      {/* Encabezado limpio de Checkout */}
      <div className="checkout-top-strip">
        <div className="contenedor">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
                Finalizar Compra
              </span>
              <h1 className="seccion-baker-titulo" style={{ fontSize: '2.3rem', textAlign: 'left', margin: 0 }}>
                Confirmación & Despacho
              </h1>
              <p className="text-muted small mb-0 mt-1">
                Completa tus datos de entrega y procesa tu pago de forma segura con Webpay Plus.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge fs-6 px-3 py-2 shadow-sm" style={{ backgroundColor: 'var(--color-espresso)', color: '#FFFFFF' }}>
                Total a pagar: {formatPrice(totals.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="contenedor pt-3">
          <AlertMessage message={error} type="danger" onClose={() => setError('')} />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ========================================================================= */}
        {/* FRANJA 1: INFORMACIÓN PERSONAL & MODALIDAD DE ENTREGA (FRANJA BLANCA)     */}
        {/* ========================================================================= */}
        <section className="seccion-franja-checkout seccion-checkout-franja-1">
          <div className="contenedor">
            <div className="franja-checkout-header">
              <div className="franja-checkout-numero">1</div>
              <div>
                <h2 className="franja-checkout-titulo">
                  Información Personal & Modalidad de Entrega
                </h2>
                <p className="franja-checkout-bajada">
                  Ingresa tus datos de contacto y selecciona cómo y cuándo deseas recibir tus pasteles frescos.
                </p>
              </div>
            </div>

            {/* Aviso de Autofill según sesión iniciada */}
            {currentUser ? (
              <div className="alert py-2 px-3 small d-flex align-items-center mb-4" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', border: '1px solid var(--color-caramelo)', borderRadius: '8px' }}>
                <i className="bi bi-person-check-fill me-2 fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                <span>
                  Sesión iniciada como <strong>{currentUser.nombre} {currentUser.apellidos}</strong> ({currentUser.correo}). Tus datos personales y de despacho se han cargado automáticamente.
                </span>
              </div>
            ) : (
              <div className="alert py-2 px-3 small d-flex align-items-center mb-4" style={{ backgroundColor: '#FAF7F2', color: 'var(--color-espresso)', border: '1px solid var(--color-borde)', borderRadius: '8px' }}>
                <i className="bi bi-info-circle-fill me-2 fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                <span>
                  ¿Ya tienes cuenta en Mil Sabores? <Link to="/login" className="alert-link fw-bold" style={{ color: 'var(--color-caramelo)' }}>Inicia sesión</Link> para autocompletar tus datos y canjear cupones automáticamente.
                </span>
              </div>
            )}

            <div className="row g-4 g-lg-5">
              {/* Columna Izquierda: Información del Cliente */}
              <div className="col-lg-6">
                <div className="p-4 rounded-3 border h-100" style={{ backgroundColor: '#FAF7F2', borderColor: 'var(--color-borde)' }}>
                  <h3 className="franja-checkout-subtitulo">
                    <i className="bi bi-person-lines-fill"></i>
                    Datos de Contacto del Cliente
                  </h3>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        className="form-control form-control-sm"
                        placeholder="Ej: Sofía"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                        Apellidos *
                      </label>
                      <input
                        type="text"
                        name="apellidos"
                        className="form-control form-control-sm"
                        placeholder="Ej: Silva Valenzuela"
                        value={formData.apellidos}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="correo"
                        className="form-control form-control-sm"
                        placeholder="sofia.silva@example.com"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                      />
                      <small className="text-muted" style={{ fontSize: '0.74rem' }}>
                        Enviaremos tu boleta electrónica y estado de preparación a este correo.
                      </small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                        Teléfono Móvil (opcional)
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        className="form-control form-control-sm"
                        placeholder="+56 9 8765 4321"
                        value={formData.telefono}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                        RUT (opcional para boleta)
                      </label>
                      <input
                        type="text"
                        name="rut"
                        className="form-control form-control-sm"
                        placeholder="12.345.678-9"
                        value={formData.rut}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Modalidad de Entrega & Dirección */}
              <div className="col-lg-6">
                <div className="p-4 rounded-3 border h-100" style={{ backgroundColor: '#FAF7F2', borderColor: 'var(--color-borde)' }}>
                  <h3 className="franja-checkout-subtitulo">
                    <i className="bi bi-geo-alt-fill"></i>
                    Modalidad y Destino de Entrega
                  </h3>

                  {/* Toggle Modalidad: Despacho vs Retiro */}
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <div
                        className={`checkout-mode-card ${!isRetiro ? 'is-active' : ''}`}
                        onClick={() => updateScheduling({ modalidad: 'despacho' })}
                      >
                        <div className="form-check p-0 m-0 d-flex align-items-center gap-2">
                          <input
                            className="form-check-input mt-0"
                            type="radio"
                            name="checkoutModalidad"
                            id="checkoutModoDespacho"
                            checked={!isRetiro}
                            onChange={() => updateScheduling({ modalidad: 'despacho' })}
                          />
                          <label className="form-check-label fw-bold small cursor-pointer" htmlFor="checkoutModoDespacho" style={{ color: 'var(--color-espresso)' }}>
                            Despacho a Domicilio
                          </label>
                        </div>
                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.74rem' }}>
                          Cadena de frío {totals.subtotal >= 30000 ? '(Envío Gratis)' : totals.subtotal >= 20000 ? '($1.990)' : '($3.990)'}
                        </small>
                      </div>
                    </div>

                    <div className="col-6">
                      <div
                        className={`checkout-mode-card ${isRetiro ? 'is-active' : ''}`}
                        onClick={() => updateScheduling({ modalidad: 'retiro' })}
                      >
                        <div className="form-check p-0 m-0 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <input
                              className="form-check-input mt-0"
                              type="radio"
                              name="checkoutModalidad"
                              id="checkoutModoRetiro"
                              checked={isRetiro}
                              onChange={() => updateScheduling({ modalidad: 'retiro' })}
                            />
                            <label className="form-check-label fw-bold small cursor-pointer" htmlFor="checkoutModoRetiro" style={{ color: 'var(--color-espresso)' }}>
                              Retiro en Sucursal
                            </label>
                          </div>
                          <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF', fontSize: '0.68rem' }}>
                            Gratis ($0)
                          </span>
                        </div>
                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.74rem' }}>
                          En Chicureo, Providencia o Las Condes
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Formulario condicional según modalidad */}
                  {isRetiro ? (
                    <div className="p-3 rounded-3 mb-3 border bg-white" style={{ borderColor: 'var(--color-borde)' }}>
                      <label className="form-label small fw-bold d-block mb-2" style={{ color: 'var(--color-espresso)' }}>
                        Elige la sucursal donde retirarás tu pedido:
                      </label>

                      {SUCURSALES_RETIRO.map((branch) => {
                        const isSelected = selectedBranchName === branch.nombre;
                        return (
                          <div
                            key={branch.id}
                            className={`checkout-branch-item ${isSelected ? 'is-selected' : ''}`}
                            onClick={() => updateScheduling({ sucursalRetiro: branch.nombre })}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <strong className="small d-block" style={{ color: 'var(--color-espresso)' }}>
                                  {branch.nombre}
                                </strong>
                                <span className="text-muted small d-block" style={{ fontSize: '0.76rem' }}>
                                  <i className="bi bi-geo-alt me-1"></i>{branch.direccion}
                                </span>
                                <span className="text-muted small d-block" style={{ fontSize: '0.72rem' }}>
                                  <i className="bi bi-clock me-1"></i>{branch.horario}
                                </span>
                              </div>
                              <input
                                type="radio"
                                name="sucursalRadio"
                                className="form-check-input mt-1"
                                checked={isSelected}
                                onChange={() => updateScheduling({ sucursalRetiro: branch.nombre })}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="mt-2">
                        <label className="form-label small fw-semibold" style={{ color: 'var(--color-espresso)', fontSize: '0.78rem' }}>
                          ¿Quién retirará el pedido en la tienda? (opcional):
                        </label>
                        <input
                          type="text"
                          name="notasRetiro"
                          className="form-control form-control-sm"
                          placeholder="Ej: Retirará Juan Pérez con número de orden y carnet"
                          value={formData.notasRetiro}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-2 mb-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                          Calle y Número *
                        </label>
                        <input
                          type="text"
                          name="calle"
                          className="form-control form-control-sm"
                          placeholder="Ej: Av. Providencia 1200, Edificio Los Robles"
                          value={formData.calle}
                          onChange={handleChange}
                          required={!isRetiro}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                          Depto / Casa (opc.)
                        </label>
                        <input
                          type="text"
                          name="departamento"
                          className="form-control form-control-sm"
                          placeholder="Ej: Depto 502"
                          value={formData.departamento}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                          Región *
                        </label>
                        <select
                          name="region"
                          className="form-select form-select-sm"
                          value={formData.region}
                          onChange={handleRegionChange}
                          required={!isRetiro}
                        >
                          {REGIONES_Y_COMUNAS.map((r, i) => (
                            <option key={i} value={r.region}>{r.region}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                          Comuna *
                        </label>
                        <select
                          name="comuna"
                          className="form-select form-select-sm"
                          value={formData.comuna}
                          onChange={handleChange}
                          required={!isRetiro}
                        >
                          {comunasDisponibles.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                          Indicaciones para el repartidor (opcional)
                        </label>
                        <input
                          type="text"
                          name="indicaciones"
                          className="form-control form-control-sm"
                          placeholder="Ej: Dejar en conserjería si no responde el timbre"
                          value={formData.indicaciones}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sub-bloque de Agendamiento de Fecha & Dedicatoria */}
                  <div className="p-3 rounded-3 border bg-white" style={{ borderColor: 'var(--color-borde)' }}>
                    <div className="row g-2">
                      <div className="col-sm-6">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.78rem' }}>
                          <i className="bi bi-calendar-event me-1"></i>Fecha de {isRetiro ? 'Retiro' : 'Entrega'}:
                        </label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={scheduling?.fecha || todayStr}
                          min={todayStr}
                          onChange={(e) => updateScheduling({ fecha: e.target.value })}
                        />
                        <div className="d-flex gap-1 mt-1">
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm py-0 px-2"
                            style={{ fontSize: '0.7rem' }}
                            onClick={() => updateScheduling({ fecha: todayStr })}
                          >
                            Hoy
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm py-0 px-2"
                            style={{ fontSize: '0.7rem' }}
                            onClick={() => updateScheduling({ fecha: tomorrowStr })}
                          >
                            Mañana
                          </button>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.78rem' }}>
                          <i className="bi bi-clock me-1"></i>Franja Horaria:
                        </label>
                        <select
                          className="form-select form-select-sm"
                          value={scheduling?.franjaHoraria || 'tarde'}
                          onChange={(e) => updateScheduling({ franjaHoraria: e.target.value })}
                        >
                          <option value="manana">Mañana (10:00 - 13:00 hrs)</option>
                          <option value="tarde">Tarde (14:00 - 18:00 hrs)</option>
                          <option value="atardecer">Atardecer (18:00 - 20:30 hrs)</option>
                        </select>
                      </div>

                      <div className="col-12 mt-2">
                        <label className="form-label small fw-bold" style={{ color: 'var(--color-espresso)', fontSize: '0.78rem' }}>
                          Dedicatoria en Chocolate para la torta (opcional):
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Ej: ¡Feliz Aniversario Claudia y Pedro!"
                          value={scheduling?.dedicatoria || ''}
                          onChange={(e) => updateScheduling({ dedicatoria: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FRANJA 2: DETALLE DE LA COMPRA, CUPONES & PAGO SEGURO (FRANJA CREMA)      */}
        {/* ========================================================================= */}
        <section className="seccion-franja-checkout seccion-checkout-franja-2">
          <div className="contenedor">
            <div className="franja-checkout-header">
              <div className="franja-checkout-numero">2</div>
              <div>
                <h2 className="franja-checkout-titulo">
                  Detalle de la Compra, Cupones & Pago Seguro
                </h2>
                <p className="franja-checkout-bajada">
                  Revisa los productos seleccionados, aplica cupones de descuento y procesa tu pago mediante Webpay Plus.
                </p>
              </div>
            </div>

            <div className="row g-4 g-lg-5">
              {/* Columna Izquierda: Detalle de Productos y Sección de Cupones */}
              <div className="col-lg-7">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="franja-checkout-subtitulo mb-0">
                    <i className="bi bi-bag-check-fill"></i>
                    Productos en tu Orden ({cart.length})
                  </h3>
                  <Link to="/carrito" className="btn btn-outline-secondary btn-sm py-0 px-2" style={{ fontSize: '0.76rem' }}>
                    <i className="bi bi-pencil me-1"></i>Modificar en Bolsa
                  </Link>
                </div>

                {/* Tabla de Productos del Carrito */}
                <div className="table-responsive mb-4 rounded-3 border bg-white shadow-sm" style={{ borderColor: 'var(--color-borde)' }}>
                  <table className="table table-sm align-middle mb-0">
                    <thead style={{ backgroundColor: '#F5EFEB', borderBottom: '1px solid var(--color-borde)' }} className="small">
                      <tr>
                        <th style={{ width: '60px', color: 'var(--color-espresso)' }}>Pastel</th>
                        <th style={{ color: 'var(--color-espresso)' }}>Descripción</th>
                        <th className="text-end" style={{ width: '90px', color: 'var(--color-espresso)' }}>Precio</th>
                        <th className="text-center" style={{ width: '60px', color: 'var(--color-espresso)' }}>Cant.</th>
                        <th className="text-end" style={{ width: '100px', color: 'var(--color-espresso)' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--color-borde)' }}>
                          <td>
                            <img
                              src={item.imagen || '/img/torta-mil-sabores.png'}
                              alt={item.nombre}
                              width="48"
                              height="48"
                              className="rounded object-fit-contain"
                              style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-borde)' }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/img/torta-mil-sabores.png';
                              }}
                            />
                          </td>
                          <td>
                            <div className="small fw-semibold" style={{ color: 'var(--color-espresso)', lineHeight: 1.2 }}>
                              {item.nombre}
                            </div>
                            {item.porciones && (
                              <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                                Formato: {item.porciones} porciones
                              </span>
                            )}
                          </td>
                          <td className="text-end small">{formatPrice(item.precio)}</td>
                          <td className="text-center small fw-bold">{item.cantidad}</td>
                          <td className="text-end small fw-bold" style={{ color: 'var(--color-caramelo)' }}>
                            {formatPrice(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sección de Cupones de Descuento (Sin Especial 18) */}
                <div className="caja-cupon-checkout bg-white shadow-sm" style={{ border: '1px solid var(--color-borde)', borderRadius: '10px' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="bi bi-tag-fill fs-5" style={{ color: 'var(--color-caramelo)' }}></i>
                    <strong className="small" style={{ color: 'var(--color-espresso)' }}>
                      ¿Tienes un cupón de descuento o convenio?
                    </strong>
                  </div>

                  {totals.cupon ? (
                    <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}>
                      <div className="small">
                        <span className="badge me-2" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF' }}>
                          {totals.cupon.codigo}
                        </span>
                        <strong style={{ color: 'var(--color-espresso)' }}>
                          {totals.cupon.nombre || 'Cupón activo'} (-{totals.cupon.porcentaje}%)
                        </strong>
                        <span className="text-success ms-2 fw-bold">
                          Ahorras {formatPrice(totals.descuento)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm py-0 px-2"
                        onClick={handleRemoveCoupon}
                        style={{ fontSize: '0.76rem' }}
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Ingresa tu cupón (ej: FELICES50)"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value)}
                          style={{ maxWidth: '280px', borderColor: 'var(--color-borde)' }}
                        />
                        <button
                          type="button"
                          className="boton boton-primario btn-baker py-1 px-3"
                          onClick={() => handleApplyCoupon(inputCoupon)}
                          style={{ fontSize: '0.8rem' }}
                        >
                          Aplicar
                        </button>
                      </div>

                      {/* Chips de cupones oficiales vigentes: FELICES50 y DUOC10 */}
                      <div className="mt-3 pt-2 border-top d-flex align-items-center gap-2 flex-wrap" style={{ borderColor: 'var(--color-borde)' }}>
                        <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                          Cupones disponibles:
                        </span>
                        <button
                          type="button"
                          className="cupon-chip"
                          onClick={() => handleApplyCoupon('FELICES50')}
                        >
                          FELICES50 (-50%)
                        </button>
                        <button
                          type="button"
                          className="cupon-chip"
                          onClick={() => handleApplyCoupon('DUOC10')}
                        >
                          DUOC10 (-10%)
                        </button>
                      </div>
                    </div>
                  )}

                  {couponMsg.text && (
                    <div className={`small mt-2 text-${couponMsg.type === 'danger' ? 'danger' : couponMsg.type === 'info' ? 'muted' : 'success'} fw-semibold`}>
                      {couponMsg.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Totales y Pasarela Webpay Plus */}
              <div className="col-lg-5">
                <h3 className="franja-checkout-subtitulo">
                  <i className="bi bi-credit-card-2-front-fill"></i>
                  Resumen de Pago & Pasarela
                </h3>

                {/* Tarjeta de Resumen de Pago */}
                <div className="caja-resumen-pago mb-3 bg-white shadow-sm" style={{ border: '1px solid var(--color-borde)' }}>
                  <div className="row g-2 small">
                    <div className="col-7 text-muted">Subtotal productos:</div>
                    <div className="col-5 text-end fw-semibold text-dark">{formatPrice(totals.subtotal)}</div>

                    {totals.descuento > 0 && (
                      <>
                        <div className="col-7 text-danger fw-bold">Descuento ({totals.cupon?.codigo}):</div>
                        <div className="col-5 text-end text-danger fw-bold">-{formatPrice(totals.descuento)}</div>
                      </>
                    )}

                    <div className="col-7 text-muted">IVA (19% incluido):</div>
                    <div className="col-5 text-end text-muted">{formatPrice(totals.iva)}</div>

                    <div className="col-7 text-muted">Costo de entrega:</div>
                    <div className="col-5 text-end fw-semibold">
                      {isRetiro ? (
                        <span className="text-success fw-bold">Gratis (Retiro)</span>
                      ) : totals.envio === 0 ? (
                        <span className="text-success fw-bold">Gratis ($0)</span>
                      ) : (
                        <span>
                          {formatPrice(totals.envio)}
                          {totals.subtotal >= 20000 && (
                            <small className="text-success d-block" style={{ fontSize: '0.7rem' }}>Ahorras $2.000</small>
                          )}
                        </span>
                      )}
                    </div>

                    {/* Mensaje de ahorro o progreso de despacho */}
                    {!isRetiro && (
                      <div className="col-12 mt-1">
                        {totals.subtotal >= 30000 ? (
                          <div className="p-1 px-2 rounded small text-center" style={{ backgroundColor: '#EBF4EE', color: '#2D6A4F', fontSize: '0.72rem' }}>
                            <i className="bi bi-check-circle-fill me-1"></i>¡Tu pedido califica para despacho gratis!
                          </div>
                        ) : totals.subtotal >= 20000 ? (
                          <div className="p-1 px-2 rounded small text-center" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', fontSize: '0.72rem' }}>
                            Te faltan <strong>{formatPrice(30000 - totals.subtotal)}</strong> para despacho 100% gratis.
                          </div>
                        ) : (
                          <div className="p-1 px-2 rounded small text-center" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-espresso)', fontSize: '0.72rem' }}>
                            Agrega <strong>{formatPrice(20000 - totals.subtotal)}</strong> más para ahorrar $2.000 en el envío.
                          </div>
                        )}
                      </div>
                    )}

                    <div className="col-12 border-top pt-3 mt-3">
                      <div className="d-flex justify-content-between align-items-baseline">
                        <span className="fs-5 fw-bold" style={{ color: 'var(--color-espresso)' }}>Total a Pagar:</span>
                        <span className="fs-3 fw-bold" style={{ color: 'var(--color-caramelo)' }}>
                          {formatPrice(totals.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pasarela Webpay Plus */}
                <div className="p-3 rounded-3 mb-3 border bg-white shadow-sm" style={{ borderColor: 'var(--color-borde)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small fw-bold" style={{ color: 'var(--color-espresso)' }}>
                      <i className="bi bi-shield-lock-fill me-1" style={{ color: '#2D6A4F' }}></i>
                      Transacción Segura Webpay Plus
                    </span>
                    <span className="badge" style={{ backgroundColor: '#FAF4EC', color: 'var(--color-caramelo)', border: '1px solid var(--color-caramelo)', fontSize: '0.68rem' }}>
                      Transbank SSL
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="badge bg-light text-dark border py-1 px-2" style={{ fontSize: '0.72rem' }}>Redcompra Débito</span>
                    <span className="badge bg-light text-dark border py-1 px-2" style={{ fontSize: '0.72rem' }}>Visa / Mastercard</span>
                    <span className="badge bg-light text-dark border py-1 px-2" style={{ fontSize: '0.72rem' }}>Prepago</span>
                  </div>

                  {/* Switch para simular error de pago (Evaluación React) */}
                  <div className="p-2 rounded border d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FFF7F7', borderColor: '#F5C2C7' }}>
                    <div>
                      <strong className="d-block text-danger" style={{ fontSize: '0.76rem' }}>
                        Modo de Prueba:
                      </strong>
                      <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                        {simulateError ? 'Se simulará un rechazo bancario' : 'Pago procesará con éxito'}
                      </span>
                    </div>
                    <div className="form-check form-switch m-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="switchError"
                        checked={simulateError}
                        onChange={(e) => setSimulateError(e.target.checked)}
                      />
                      <label className="form-check-label small fw-bold text-danger cursor-pointer" htmlFor="switchError" style={{ fontSize: '0.75rem' }}>
                        Simular rechazo
                      </label>
                    </div>
                  </div>
                </div>

                {/* Botón Pagar con Webpay Plus */}
                <button
                  type="submit"
                  className="btn-pagar-webpay"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Conectando con Transbank...
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-lock-fill me-1"></i>
                      Pagar {formatPrice(totals.total)} con Webpay Plus
                    </span>
                  )}
                </button>

                <div className="text-center mt-2">
                  <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                    Al pagar aceptas los términos de despacho artesanal y condiciones de Mil Sabores.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
