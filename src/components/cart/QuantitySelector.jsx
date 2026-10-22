import React from 'react';

/**
 * Componente controlado para ajustar cantidades en el carrito y ficha de producto.
 * Estilo unificado con la paleta oficial de Pastelería Mil Sabores.
 */
export default function QuantitySelector({
  value,
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = 'md'
}) {
  const currentVal = value !== undefined ? value : (quantity !== undefined ? quantity : 1);

  const handleDecrement = () => {
    if (currentVal > min) {
      onChange(currentVal - 1);
    }
  };

  const handleIncrement = () => {
    if (currentVal < max) {
      onChange(currentVal + 1);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    if (val >= min && val <= max) {
      onChange(val);
    }
  };

  const isSmall = size === 'sm';
  const btnPadding = isSmall ? '0.2rem 0.55rem' : '0.35rem 0.75rem';
  const fontSize = isSmall ? '0.82rem' : '0.9rem';

  return (
    <div
      className="input-group input-group-sm quantity-selector-baker"
      style={{
        maxWidth: isSmall ? '115px' : '130px',
        border: '1px solid var(--color-borde)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF'
      }}
    >
      <button
        type="button"
        className="btn p-0 d-flex align-items-center justify-content-center"
        aria-label="Disminuir cantidad"
        onClick={handleDecrement}
        disabled={currentVal <= min}
        style={{
          width: isSmall ? '28px' : '34px',
          padding: btnPadding,
          backgroundColor: 'var(--color-superficie)',
          color: 'var(--color-espresso)',
          border: 'none',
          borderRight: '1px solid var(--color-borde)',
          cursor: currentVal <= min ? 'not-allowed' : 'pointer',
          opacity: currentVal <= min ? 0.45 : 1,
          transition: 'background-color 0.15s ease'
        }}
      >
        <i className="bi bi-dash" style={{ fontSize }}></i>
      </button>

      <input
        type="text"
        className="form-control text-center p-0 border-0 fw-bold"
        value={currentVal}
        onChange={handleInputChange}
        aria-label="Cantidad de producto"
        readOnly
        style={{
          color: 'var(--color-espresso)',
          fontSize,
          backgroundColor: '#FFFFFF',
          boxShadow: 'none'
        }}
      />

      <button
        type="button"
        className="btn p-0 d-flex align-items-center justify-content-center"
        aria-label="Aumentar cantidad"
        onClick={handleIncrement}
        disabled={currentVal >= max}
        style={{
          width: isSmall ? '28px' : '34px',
          padding: btnPadding,
          backgroundColor: 'var(--color-superficie)',
          color: 'var(--color-espresso)',
          border: 'none',
          borderLeft: '1px solid var(--color-borde)',
          cursor: currentVal >= max ? 'not-allowed' : 'pointer',
          opacity: currentVal >= max ? 0.45 : 1,
          transition: 'background-color 0.15s ease'
        }}
      >
        <i className="bi bi-plus" style={{ fontSize }}></i>
      </button>
    </div>
  );
}
