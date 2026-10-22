import React from 'react';

export default function BoletaOficial({ order, id, className = '' }) {
  if (!order) return null;

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(val || 0);

  const fechaObj = order.fecha ? new Date(order.fecha) : new Date();
  const fechaEmision = !isNaN(fechaObj.getTime())
    ? fechaObj.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('es-CL');
  const horaEmision = !isNaN(fechaObj.getTime())
    ? fechaObj.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    : '12:00';

  const isRetiro = order.agendamiento?.modalidad === 'retiro';
  const franjaHorariaRaw = order.agendamiento?.franjaHoraria;
  const franjaTexto =
    franjaHorariaRaw === 'manana'
      ? 'Mañana (10:00 - 13:00 hrs)'
      : franjaHorariaRaw === 'atardecer'
        ? 'Atardecer (18:00 - 20:30 hrs)'
        : 'Tarde (14:00 - 18:00 hrs)';

  const subtotalNeto = order.subtotal
    ? Math.round(order.subtotal / 1.19)
    : Math.round(order.total / 1.19);
  const ivaCalculado = order.iva || Math.round(order.total - subtotalNeto);

  return (
    <div
      id={id}
      className={`boleta-oficial-documento ${className}`}
      style={{
        backgroundColor: '#FFFFFF',
        color: '#1A1A1A',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: '1.75rem',
        borderRadius: '6px',
        border: '1px solid #E2D9CC',
        maxWidth: '820px',
        margin: '0 auto'
      }}
    >
      {/* 1. Encabezado Tributario Superior */}
      <div className="row align-items-start g-3 mb-3 border-bottom pb-3" style={{ borderColor: '#E2D9CC' }}>
        {/* Emisor / Datos de Pastelería Mil Sabores */}
        <div className="col-sm-7 col-md-8">
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2
              className="fw-bold mb-0"
              style={{
                fontFamily: 'var(--fuente-titulos)',
                color: 'var(--color-espresso)',
                fontSize: '1.9rem',
                lineHeight: 1
              }}
            >
              Pastelería Mil Sabores
            </h2>
          </div>
          <div style={{ fontSize: '9pt', fontWeight: '700', color: '#2C1E16', marginTop: '2px' }}>
            Pastelería Mil Sabores SpA
          </div>
          <div style={{ fontSize: '8.5pt', color: '#555555', lineHeight: 1.45 }}>
            Giro: Elaboración y Venta de Productos de Pastelería Fina, Panadería y Cafetería Tradicional
          </div>
          <div style={{ fontSize: '8.5pt', color: '#555555', lineHeight: 1.45 }}>
            Casa Matriz: Av. Providencia 1200, Providencia, Santiago de Chile
          </div>
          <div style={{ fontSize: '8.5pt', color: '#555555', lineHeight: 1.45 }}>
            Fono: +56 9 8765 4321 | Correo: boletas@milsabores.cl | Web: www.pasteleriamilsabores.cl
          </div>
        </div>

        {/* Recuadro Rojo Oficial SII */}
        <div className="col-sm-5 col-md-4">
          <div
            className="boleta-sii-box text-center p-2 rounded"
            style={{
              border: '2.5px solid #C41E25',
              color: '#C41E25',
              backgroundColor: '#FFFDFD'
            }}
          >
            <div style={{ fontSize: '11pt', fontWeight: '800', letterSpacing: '0.5px' }}>
              R.U.T.: 76.543.210-K
            </div>
            <div style={{ fontSize: '12pt', fontWeight: '900', margin: '2px 0', letterSpacing: '0.8px' }}>
              BOLETA ELECTRÓNICA
            </div>
            <div style={{ fontSize: '14pt', fontWeight: '900', margin: '2px 0' }}>
              Nº {order.numeroOrden}
            </div>
            <div style={{ fontSize: '8pt', fontWeight: '700', textTransform: 'uppercase', marginTop: '2px' }}>
              S.I.I. - SANTIAGO ORIENTE
            </div>
          </div>
        </div>
      </div>

      {/* 2. Franja de Emisión y Transacción */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center mb-3 p-2 rounded small"
        style={{
          backgroundColor: '#FAF7F2',
          border: '1px solid #E8DFD3',
          fontSize: '8.5pt'
        }}
      >
        <div>
          <span className="text-muted">Fecha de Emisión:</span> <strong>{fechaEmision}</strong>
        </div>
        <div>
          <span className="text-muted">Hora:</span> <strong>{horaEmision} hrs</strong>
        </div>
        <div>
          <span className="text-muted">Medio de Pago:</span> <strong>Webpay Plus (Transbank Aprobado)</strong>
        </div>
        <div>
          <span className="badge" style={{ backgroundColor: '#2D6A4F', color: '#FFFFFF', fontSize: '8pt' }}>
            EMITIDA / PAGADA
          </span>
        </div>
      </div>

      {/* 3. Datos del Receptor / Cliente y Entrega */}
      <div
        className="p-3 rounded mb-3"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2D9CC',
          fontSize: '8.5pt'
        }}
      >
        <div className="row g-2">
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>SEÑOR(A):</span>
            <strong className="text-dark">{order.cliente?.nombre} {order.cliente?.apellidos}</strong>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>R.U.T. / ID CLIENTE:</span>
            <span>{order.cliente?.rut || '66.666.666-6 (Consumidor Final)'}</span>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>CORREO ELECTRÓNICO:</span>
            <span>{order.cliente?.correo || '-'}</span>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>MODALIDAD DE ENTREGA:</span>
            <strong>{isRetiro ? 'Retiro en Pastelería (Av. Providencia 1200)' : 'Despacho Programado a Domicilio'}</strong>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>DIRECCIÓN:</span>
            <span>
              {isRetiro
                ? 'Av. Providencia 1200 (Metro Manuel Montt), Providencia'
                : `${order.cliente?.direccion || ''} ${order.cliente?.departamento || ''}`}
            </span>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>COMUNA Y REGIÓN:</span>
            <span>
              {isRetiro
                ? 'Providencia, Región Metropolitana de Santiago'
                : `${order.cliente?.comuna || ''}, ${order.cliente?.region || ''}`}
            </span>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>FECHA Y BLOQUE PROGRAMADO:</span>
            <strong>
              {order.agendamiento?.fecha || fechaEmision} ({franjaTexto})
            </strong>
          </div>
          <div className="col-sm-6">
            <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>CÓDIGO INTERNO:</span>
            <span className="text-muted">ORD-{order.numeroOrden}</span>
          </div>

          {order.agendamiento?.dedicatoria && (
            <div className="col-12 mt-2 pt-2 border-top" style={{ borderColor: '#EAE3D9' }}>
              <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>DEDICATORIA EN PLACA DE CHOCOLATE:</span>
              <em className="text-dark">"{order.agendamiento.dedicatoria}"</em>
            </div>
          )}

          {order.cliente?.indicaciones && (
            <div className="col-12 mt-1">
              <span className="text-muted d-block" style={{ fontSize: '7.8pt' }}>INDICACIONES DE ENTREGA:</span>
              <span className="text-dark">{order.cliente.indicaciones}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Tabla Detallada de Ítems */}
      <div className="table-responsive mb-3">
        <table
          className="table table-sm align-middle mb-0"
          style={{
            border: '1px solid #E2D9CC',
            fontSize: '8.8pt'
          }}
        >
          <thead style={{ backgroundColor: '#F5EFEB', color: 'var(--color-espresso)' }}>
            <tr style={{ borderBottom: '1px solid #D6CEBE' }}>
              <th style={{ width: '60px', textAlign: 'center', padding: '7px 8px' }}>CANT.</th>
              <th style={{ textAlign: 'left', padding: '7px 8px' }}>DETALLE / PRODUCTO</th>
              <th style={{ width: '120px', textAlign: 'right', padding: '7px 8px' }}>P. UNITARIO</th>
              <th style={{ width: '120px', textAlign: 'right', padding: '7px 8px' }}>SUBTOTAL</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #EAE3D9' }}>
                <td style={{ textAlign: 'center', padding: '7px 8px' }}>{item.cantidad}</td>
                <td style={{ textAlign: 'left', padding: '7px 8px' }}>
                  <div className="fw-semibold text-dark">{item.nombre}</div>
                  {item.categoria && <small className="text-muted d-block">{item.categoria}</small>}
                </td>
                <td style={{ textAlign: 'right', padding: '7px 8px' }}>{formatPrice(item.precio)}</td>
                <td style={{ textAlign: 'right', padding: '7px 8px', fontWeight: '700', color: 'var(--color-espresso)' }}>
                  {formatPrice(item.subtotal || item.precio * item.cantidad)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Liquidación de Totales */}
      <div className="row justify-content-end mb-3">
        <div className="col-sm-7 col-md-5">
          <div
            className="p-3 rounded"
            style={{
              backgroundColor: '#FAF7F2',
              border: '1px solid #E2D9CC',
              fontSize: '8.8pt'
            }}
          >
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Subtotal Neto:</span>
              <span>{formatPrice(subtotalNeto)}</span>
            </div>
            {order.descuento > 0 && (
              <div className="d-flex justify-content-between mb-1 text-danger">
                <span>Descuento ({order.cupon || 'Promoción'}):</span>
                <span>-{formatPrice(order.descuento)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">IVA (19% Incluido):</span>
              <span>{formatPrice(ivaCalculado)}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-muted">Costo de Despacho:</span>
              <span>{order.envio === 0 ? <strong className="text-success">Gratis ($0)</strong> : formatPrice(order.envio)}</span>
            </div>
            <div
              className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top fw-bold"
              style={{
                borderColor: 'var(--color-espresso)',
                color: 'var(--color-espresso)',
                fontSize: '1.05rem'
              }}
            >
              <span>TOTAL PAGADO:</span>
              <span style={{ color: 'var(--color-caramelo)' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Timbre Electrónico SII Simulado (TED) */}
      <div
        className="boleta-ted-box p-2 rounded text-center"
        style={{
          border: '1.5px solid #4A3E39',
          backgroundColor: '#FAF9F6',
          marginTop: '0.8rem'
        }}
      >
        <div
          style={{
            fontSize: '7.8pt',
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#2C1E16',
            marginBottom: '3px'
          }}
        >
          Timbre Electrónico SII
        </div>

        {/* Patrón de barras bidimensionales simuladas de alta fidelidad */}
        <svg
          width="280"
          height="34"
          viewBox="0 0 280 34"
          style={{ display: 'block', margin: '0 auto', maxWidth: '100%', opacity: 0.9 }}
        >
          <rect width="280" height="34" fill="#FAF9F6" />
          {Array.from({ length: 58 }).map((_, i) => {
            const w = i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1.2;
            const x = 6 + i * 4.6;
            return <rect key={i} x={x} y={2} width={w} height={30} fill="#1A1A1A" />;
          })}
        </svg>

        <div style={{ fontSize: '7.2pt', color: '#555555', marginTop: '3px', fontWeight: '500' }}>
          Res. Ex. N° 80 de 2014 - Verifique documento tributario en www.sii.cl
        </div>
        <div style={{ fontSize: '7.2pt', color: '#777777', marginTop: '1px' }}>
          El IVA de esta boleta está incluido en el precio final. Documento emitido por Pastelería Mil Sabores SpA.
        </div>
      </div>

      {/* 7. Pie institucional de cortesía */}
      <div className="text-center mt-3 pt-2 border-top" style={{ borderColor: '#EAE3D9', fontSize: '8pt', color: '#888888' }}>
        ¡Gracias por su preferencia! Pastelería Mil Sabores — Tradición pastelera artesanal desde 1974.
      </div>
    </div>
  );
}
