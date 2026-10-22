import React from 'react';
import { render, screen } from '@testing-library/react';
import AlertMessage from '../src/components/common/AlertMessage';

describe('2. Pruebas de Renderizado: Renderizado Condicional', () => {
  it('muestra el mensaje solo cuando hay un error presente y no renderiza nada si está vacío', () => {
    // 1. Cuando está vacío: no renderiza nada
    const { container, rerender } = render(<AlertMessage message="" type="danger" />);
    expect(container.firstChild).toBeNull();

    // 2. Cuando hay mensaje: se renderiza en el DOM
    const errorMessage = 'El correo o la contraseña ingresados son incorrectos.';
    rerender(<AlertMessage message={errorMessage} type="danger" />);

    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeDefined();
    expect(alertElement.textContent).toContain(errorMessage);
  });
});
