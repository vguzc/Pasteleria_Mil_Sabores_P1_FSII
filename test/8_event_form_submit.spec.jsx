import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

function SimpleContactForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email: e.target.elements.email.value });
  };

  return (
    <form onSubmit={handleSubmit} data-testid="contact-form">
      <input name="email" defaultValue="cliente@duoc.cl" />
      <button type="submit">Enviar Mensaje</button>
    </form>
  );
}

describe('8. Pruebas de Eventos: Simulación de Evento Submit de Formulario', () => {
  it('dispara el manejador onSubmit y previene la recarga predeterminada del navegador', () => {
    const handleSubmit = jasmine.createSpy('handleSubmit');

    render(<SimpleContactForm onSubmit={handleSubmit} />);

    const form = screen.getByTestId('contact-form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'cliente@duoc.cl' });
  });
});
