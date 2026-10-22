import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuantitySelector from '../src/components/cart/QuantitySelector';

function ControlledQuantityWrapper() {
  const [qty, setQty] = useState(2);
  return (
    <div>
      <QuantitySelector value={qty} onChange={setQty} min={1} max={10} />
      <span data-testid="current-qty">{qty}</span>
    </div>
  );
}

describe('6. Pruebas de Estado (state): Contador de Cantidad', () => {
  it('incrementa y decrementa el estado numérico mediante las interacciones del usuario', () => {
    render(<ControlledQuantityWrapper />);

    const display = screen.getByTestId('current-qty');
    expect(display.textContent).toBe('2');

    const incButton = screen.getByRole('button', { name: /Aumentar cantidad/i });
    fireEvent.click(incButton);
    expect(display.textContent).toBe('3');

    const decButton = screen.getByRole('button', { name: /Disminuir cantidad/i });
    fireEvent.click(decButton);
    expect(display.textContent).toBe('2');
  });
});
