import React from 'react';

/**
 * Componente Botón reutilizable con principio de Responsabilidad Única.
 * Gestiona variantes de estilo Bootstrap, evento onClick, estado deshabilitado y etiquetas.
 */
export default function Button({
  children,
  label,
  onClick,
  type = 'button',
  variant = 'primary',
  size = '',
  disabled = false,
  className = '',
  icon = null
}) {
  const content = label || children;
  const sizeClass = size ? `btn-${size}` : '';

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <i className={`${icon} me-1`}></i>}
      {content}
    </button>
  );
}
