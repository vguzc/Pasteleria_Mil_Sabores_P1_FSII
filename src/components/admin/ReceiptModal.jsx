import React from 'react';
import BoletaOficial from '../common/BoletaOficial';

export default function ReceiptModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(32, 22, 16, 0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          {/* Header del Modal (Oculto en Impresión / PDF) */}
          <div
            className="modal-header text-white d-print-none"
            style={{ backgroundColor: '#201610', borderBottom: '1px solid var(--color-borde)' }}
          >
            <h5 className="modal-title" style={{ fontFamily: 'var(--fuente-titulos)' }}>
              <i className="bi bi-receipt me-2" style={{ color: 'var(--color-caramelo)' }}></i>
              Boleta Electrónica Oficial #{order.numeroOrden}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          {/* Cuerpo del Modal con la Boleta Oficial */}
          <div className="modal-body p-3 p-md-4" id="boleta-imprimible" style={{ backgroundColor: '#FAF7F2' }}>
            <BoletaOficial order={order} />
          </div>

          {/* Footer del Modal (Oculto en Impresión / PDF) */}
          <div
            className="modal-footer d-print-none"
            style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-borde)' }}
          >
            <button type="button" className="boton boton-secundario btn-baker" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="boton boton-primario btn-baker" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i>Imprimir Boleta (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
