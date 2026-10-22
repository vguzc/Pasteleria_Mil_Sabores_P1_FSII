import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { REGIONES_Y_COMUNAS } from '../../services/chileData';

const SUCURSALES_RETIRO = [
  {
    id: 'chicureo',
    nombre: 'Factory Nine Chicureo',
    direccion: 'P.º Colina Sur 14600',
    comuna: 'colina, 9340000',
    info: 'Lunes a Domingo de 10:00 a 20:00 hrs. Retiro en mesón de entrega con tu orden.'
  },
  {
    id: 'providencia',
    nombre: 'Taller Central Manuel Montt',
    direccion: 'Av. Providencia 1200',
    comuna: 'Providencia, 7500000',
    info: 'Lunes a Domingo de 10:00 a 20:30 hrs. A pasos de la estación Metro Manuel Montt.'
  },
  {
    id: 'lascondes',
    nombre: 'Sucursal Las Condes',
    direccion: 'Av. Las Condes 9500',
    comuna: 'Las Condes, 7550000',
    info: 'Lunes a Domingo de 10:30 a 19:30 hrs. Estacionamiento privado disponible.'
  }
];

export default function CartDrawer() {
  const {
    cart,
    totals,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    scheduling,
    updateScheduling,
    stockNotice,
    clearStockNotice
  } = useCart();

  const navigate = useNavigate();

  // Modo de entrega activo: 'hoy' | 'despacho_programado' | 'retiro_programado'
  const [activeMode, setActiveMode] = useState(() => {
    if (scheduling?.tipoModo) return scheduling.tipoModo;
    if (scheduling?.modalidad === 'retiro') return 'retiro_programado';
    return 'hoy';
  });

  // Comuna para despacho programado
  const [comunaInput, setComunaInput] = useState(scheduling?.comuna || '');
  const [comunaSugerida, setComunaSugerida] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Sucursal de retiro seleccionada
  const [selectedBranch, setSelectedBranch] = useState(
    scheduling?.sucursalRetiro || 'Factory Nine Chicureo'
  );
  const [infoBranchVisible, setInfoBranchVisible] = useState(null);

  // Fecha y franja horaria
  const [selectedDate, setSelectedDate] = useState(scheduling?.fecha || '');
  const [selectedTime, setSelectedTime] = useState(scheduling?.franjaHoraria || 'tarde');

  // Lista de comunas de la Región Metropolitana
  const comunasRM = React.useMemo(() => {
    const rm = REGIONES_Y_COMUNAS.find(r => r.region.includes('Metropolitana'));
    return rm ? rm.comunas : ['Santiago', 'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'Colina'];
  }, []);

  useEffect(() => {
    if (scheduling?.tipoModo) {
      setActiveMode(scheduling.tipoModo);
    }
  }, [scheduling]);

  const handleComunaChange = (e) => {
    const val = e.target.value;
    setComunaInput(val);
    if (val.trim().length > 0) {
      const match = comunasRM.filter(c => c.toLowerCase().includes(val.toLowerCase()));
      setComunaSugerida(match.slice(0, 5));
      setMostrarSugerencias(true);
    } else {
      setMostrarSugerencias(false);
    }
  };

  const handleSelectComuna = (c) => {
    setComunaInput(c);
    setMostrarSugerencias(false);
  };

  const formatPrice = (val) => '$' + Number(val || 0).toLocaleString('es-CL');

  // Barra de ahorro de envío (meta $20.000 como en la Imagen 3)
  const metaEnvio = 20000;
  const restanteAhorro = Math.max(0, metaEnvio - totals.subtotal);
  const porcentajeAhorro = Math.min(100, Math.round((totals.subtotal / metaEnvio) * 100));

  const handleContinue = () => {
    const isRetiro = activeMode === 'retiro_programado';
    const sucursalObj = SUCURSALES_RETIRO.find(s => s.nombre === selectedBranch) || SUCURSALES_RETIRO[0];

    updateScheduling({
      modalidad: isRetiro ? 'retiro' : 'despacho',
      tipoModo: activeMode,
      comuna: comunaInput || 'Providencia',
      sucursalRetiro: selectedBranch,
      direccionRetiro: isRetiro ? `${sucursalObj.direccion}, ${sucursalObj.comuna}` : '',
      fecha: selectedDate,
      franjaHoraria: selectedTime
    });

    closeDrawer();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`backdrop-carrito ${isDrawerOpen ? 'backdrop-abierto' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel Desplegable Moderno */}
      <aside
        id="drawerCarrito"
        className={`fn-cart-drawer ${isDrawerOpen ? 'drawer-abierto' : ''}`}
        aria-label="Carrito de compras"
        aria-hidden={!isDrawerOpen}
      >
        {/* 1. Header con total de ítems */}
        <div className="fn-cart-header">
          <h2 className="fn-cart-title">
            CARRITO ({totals.itemsCount})
          </h2>
          <button
            type="button"
            className="fn-cart-btn-close"
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 2. Barra de Ahorro en Envío (Imagen 3) */}
        {cart.length > 0 && (
          <div className="fn-cart-savings-bar">
            <div className="fn-cart-savings-text">
              {restanteAhorro > 0 ? (
                <>
                  Agrega <strong>{formatPrice(restanteAhorro)}</strong> más y ahorra <strong>$2.000</strong> en tu envío
                </>
              ) : (
                <>
                  <strong>¡Ahorro de $2.000 conseguido!</strong> Tienes tarifa preferencial de envío
                </>
              )}
            </div>
            <div className="fn-cart-savings-track">
              <div
                className="fn-cart-savings-progress"
                style={{ width: `${porcentajeAhorro}%` }}
              />
            </div>
          </div>
        )}

        {/* 3. Cuerpo del Carrito */}
        <div className="fn-cart-body">
          {stockNotice && (
            <div className="alert p-2 small mb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#FAF4EC', border: '1px solid #D5B99A', color: '#2C1E16', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.78rem' }}>
                {stockNotice.mensaje}
              </div>
              <button type="button" className="btn-close btn-close-sm" onClick={clearStockNotice} aria-label="Cerrar aviso" />
            </div>
          )}

          {cart.length === 0 ? (
            <div className="bolsa-vacia-container text-center py-5">
              <h4 className="bolsa-vacia-titulo mb-2">Tu bolsa está vacía</h4>
              <p className="bolsa-vacia-subtitulo text-muted small mb-4">
                Explora nuestras creaciones recién horneadas y añádelas con un toque.
              </p>
              <Link
                to="/productos"
                className="btn btn-dark rounded-pill px-4 py-2"
                onClick={closeDrawer}
              >
                Ver Catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="fn-cart-section-label">
                Productos
              </div>

              {/* Lista de productos */}
              <div className="fn-cart-items-list">
                {cart.map((item) => {
                  const itemStock = typeof item.stock === 'number' ? item.stock : 99;
                  const isMax = item.cantidad >= itemStock;

                  return (
                    <div key={item.id} className="fn-cart-item">
                      <img
                        src={item.imagen || '/img/torta-mil-sabores.png'}
                        alt={item.nombre}
                        className="fn-cart-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/img/torta-mil-sabores.png';
                        }}
                      />

                      <div className="fn-cart-item-info">
                        <div className="fn-cart-item-name">
                          {item.nombre.toUpperCase()}
                        </div>

                        <div className="fn-cart-item-portion">
                          Tamaño: {item.porcion || '1P'}
                        </div>

                        <div className="fn-cart-item-price">
                          {formatPrice(item.precio)}
                        </div>

                        {/* Selector de cantidad estilo cápsula redondeada */}
                        <div className="fn-cart-qty-pill">
                          <button
                            type="button"
                            className="fn-cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>
                          <span className="fn-cart-qty-val">
                            {item.cantidad}
                          </span>
                          <button
                            type="button"
                            className="fn-cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={isMax}
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        {/* Enlace QUITAR */}
                        <button
                          type="button"
                          className="fn-cart-item-remove"
                          onClick={() => removeItem(item.id)}
                        >
                          QUITAR
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fila de Subtotal */}
              <div className="fn-cart-subtotal-row">
                <span className="fn-cart-subtotal-label">SUBTOTAL</span>
                <span className="fn-cart-subtotal-val">{formatPrice(totals.subtotal)} CLP</span>
              </div>

              {/* 4. Tarjetas de Modalidad de Entrega (3 columnas) */}
              <div className="fn-cart-modes-grid">
                {/* Opción 1: Envío o retiro hoy */}
                <button
                  type="button"
                  className={`fn-cart-mode-card ${activeMode === 'hoy' ? 'active' : ''}`}
                  onClick={() => setActiveMode('hoy')}
                >
                  <div className="fn-cart-mode-icon">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                  </div>
                  <span className="fn-cart-mode-text">
                    Envío o retiro hoy
                  </span>
                </button>

                {/* Opción 2: Programar envío próximos días */}
                <button
                  type="button"
                  className={`fn-cart-mode-card ${activeMode === 'despacho_programado' ? 'active' : ''}`}
                  onClick={() => setActiveMode('despacho_programado')}
                >
                  <div className="fn-cart-mode-icon">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                  <span className="fn-cart-mode-text">
                    Programar envío próximos días
                  </span>
                </button>

                {/* Opción 3: Programar retiro próximos días */}
                <button
                  type="button"
                  className={`fn-cart-mode-card ${activeMode === 'retiro_programado' ? 'active' : ''}`}
                  onClick={() => setActiveMode('retiro_programado')}
                >
                  <div className="fn-cart-mode-icon">
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <span className="fn-cart-mode-text">
                    Programar retiro próximos días
                  </span>
                </button>
              </div>

              {/* 5. Área dinámica según la modalidad seleccionada */}
              <div className="fn-cart-mode-details">
                {/* Estado 1: Envío o retiro hoy (Imagen 3) */}
                {activeMode === 'hoy' && (
                  <p className="fn-cart-today-text">
                    Haz tu pedido antes de las 19:00 y lo recibes hoy.
                  </p>
                )}

                {/* Estado 2: Programar envío próximos días (Imagen 4) */}
                {activeMode === 'despacho_programado' && (
                  <div>
                    <label className="form-label small fw-bold mb-1" style={{ color: 'var(--color-espresso)' }}>
                      Indica tu comuna de entrega:
                    </label>
                    <div className="position-relative">
                      <div className="fn-cart-search-comuna">
                        <input
                          type="text"
                          className="fn-cart-search-input"
                          placeholder="Por favor, ingresa tu comuna"
                          value={comunaInput}
                          onChange={handleComunaChange}
                          onFocus={() => {
                            if (comunaInput.trim().length > 0) setMostrarSugerencias(true);
                          }}
                        />
                        <button
                          type="button"
                          className="fn-cart-search-btn"
                          aria-label="Buscar comuna"
                          onClick={() => setMostrarSugerencias(!mostrarSugerencias)}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                          </svg>
                        </button>
                      </div>

                      {mostrarSugerencias && comunaSugerida.length > 0 && (
                        <div className="list-group position-absolute w-100 shadow-sm" style={{ zIndex: 20, top: '100%', marginTop: '2px' }}>
                          {comunaSugerida.map((c) => (
                            <button
                              key={c}
                              type="button"
                              className="list-group-item list-group-item-action py-2 small text-start"
                              style={{ color: 'var(--color-espresso)' }}
                              onClick={() => handleSelectComuna(c)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="row g-2 mt-2">
                      <div className="col-6">
                        <label className="form-label" style={{ fontSize: '0.74rem', color: 'var(--color-texto-secundario)' }}>Fecha de entrega:</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={selectedDate}
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          style={{ borderColor: 'var(--color-borde)', color: 'var(--color-espresso)' }}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label" style={{ fontSize: '0.74rem', color: 'var(--color-texto-secundario)' }}>Bloque horario:</label>
                        <select
                          className="form-select form-select-sm"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          style={{ borderColor: 'var(--color-borde)', color: 'var(--color-espresso)' }}
                        >
                          <option value="manana">Mañana (10:00 - 13:00)</option>
                          <option value="tarde">Tarde (14:00 - 18:00)</option>
                          <option value="atardecer">Atardecer (18:00 - 20:30)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estado 3: Programar retiro próximos días (Imagen 5) */}
                {activeMode === 'retiro_programado' && (
                  <div>
                    <div className="mb-2">
                      <strong className="d-block" style={{ fontSize: '0.86rem', color: 'var(--color-espresso)' }}>
                        Encuentra el lugar de retiro más cercano
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-texto-secundario)' }}>
                        Por favor, selecciona un lugar de retiro, fecha y hora
                      </span>
                    </div>

                    <div className="fn-cart-branch-list mb-3">
                      {SUCURSALES_RETIRO.map((branch) => {
                        const isSelected = selectedBranch === branch.nombre;
                        return (
                          <div
                            key={branch.id}
                            className={`fn-cart-branch-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedBranch(branch.nombre)}
                          >
                            <input
                              type="radio"
                              name="sucursalRetiro"
                              id={`sucursal-${branch.id}`}
                              checked={isSelected}
                              onChange={() => setSelectedBranch(branch.nombre)}
                              className="mt-1"
                              style={{ accentColor: 'var(--color-caramelo)' }}
                            />
                            <div className="flex-grow-1">
                              <label htmlFor={`sucursal-${branch.id}`} className="fn-cart-branch-title d-block mb-0 cursor-pointer">
                                {branch.nombre}
                              </label>
                              <div className="fn-cart-branch-address">
                                {branch.direccion}
                              </div>
                              <div className="fn-cart-branch-address">
                                {branch.comuna}
                              </div>
                              <button
                                type="button"
                                className="fn-cart-branch-info-link border-0 bg-transparent p-0 text-decoration-underline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInfoBranchVisible(infoBranchVisible === branch.id ? null : branch.id);
                                }}
                              >
                                Más información
                              </button>
                              {infoBranchVisible === branch.id && (
                                <div className="small mt-1 p-2 rounded border" style={{ fontSize: '0.72rem', backgroundColor: 'var(--color-superficie)', borderColor: 'var(--color-borde)', color: 'var(--color-espresso)' }}>
                                  {branch.info}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label" style={{ fontSize: '0.74rem', color: 'var(--color-texto-secundario)' }}>Fecha de retiro:</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={selectedDate}
                          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          style={{ borderColor: 'var(--color-borde)', color: 'var(--color-espresso)' }}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label" style={{ fontSize: '0.74rem', color: 'var(--color-texto-secundario)' }}>Horario:</label>
                        <select
                          className="form-select form-select-sm"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          style={{ borderColor: 'var(--color-borde)', color: 'var(--color-espresso)' }}
                        >
                          <option value="manana">Mañana (10:00 - 13:00)</option>
                          <option value="tarde">Tarde (14:00 - 18:00)</option>
                          <option value="atardecer">Atardecer (18:00 - 20:30)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 6. Footer con Botón Continuar (Imágenes 3 y 4) */}
        {cart.length > 0 && (
          <div className="fn-cart-footer">
            <button
              type="button"
              className="fn-cart-btn-continue"
              onClick={handleContinue}
            >
              Continuar
            </button>
            <p className="fn-cart-footer-note">
              Antes de los costos de envío.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
