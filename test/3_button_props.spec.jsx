import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../src/components/common/Button';

describe('3. Pruebas de Propiedades (props): Componente Botón Reutilizable', () => {
  it('recibe correctamente la etiqueta (label o children) y la función de evento onClick', () => {
    const handleClick = jasmine.createSpy('handleClick');
    const labelText = 'Agregar al Carrito';

    render(
      <Button
        label={labelText}
        variant="primary"
        onClick={handleClick}
      />
    );

    const buttonElement = screen.getByRole('button', { name: labelText });
    expect(buttonElement).toBeDefined();
    expect(buttonElement.classList.contains('btn-primary')).toBeTrue();

    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
