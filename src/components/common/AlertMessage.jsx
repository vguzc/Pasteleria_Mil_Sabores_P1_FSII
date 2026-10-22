import React from 'react';

/**
 * Componente AlertMessage para renderizado condicional de mensajes informativos o de error.
 * Solo se muestra si `message` tiene contenido.
 */
export default function AlertMessage({ message, type = 'danger', onClose = null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`alert alert-${type} d-flex align-items-center justify-content-between my-2 shadow-sm`}
    >
      <div className="d-flex align-items-center">
        <i
          className={`bi ${type === 'danger' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-check-circle-fill text-success'} me-2 fs-5`}
        ></i>
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          aria-label="Cerrar"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
}
