import React from 'react';

/**
 * Componente controlado para ajustar cantidades en el carrito y ficha de producto.
 */
export default function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 99,
  size = 'md'
}) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) return;
    if (val >= min && val <= max) {
      onChange(val);
    }
  };

  const btnClass = size === 'sm' ? 'btn-sm px-2 py-0' : 'px-3';

  return (
    <div className="input-group input-group-sm" style={{ maxWidth: '130px' }}>
      <button
        type="button"
        className={`btn btn-outline-secondary ${btnClass}`}
        aria-label="Disminuir cantidad"
        onClick={handleDecrement}
        disabled={value <= min}
      >
        <i className="bi bi-dash"></i>
      </button>
      <input
        type="text"
        className="form-control text-center fw-bold bg-white"
        value={value}
        onChange={handleInputChange}
        aria-label="Cantidad de producto"
        readOnly
      />
      <button
        type="button"
        className={`btn btn-outline-secondary ${btnClass}`}
        aria-label="Aumentar cantidad"
        onClick={handleIncrement}
        disabled={value >= max}
      >
        <i className="bi bi-plus"></i>
      </button>
    </div>
  );
}
