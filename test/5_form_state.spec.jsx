import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Formulario de prueba con estado local controlado
function SearchForm() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar productos"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        data-testid="search-input"
      />
      <p data-testid="search-output">Buscando: {query}</p>
    </div>
  );
}

describe('5. Pruebas de Estado (state): Gestión de Estado en Formulario', () => {
  it('verifica que el estado del componente cambie correctamente cuando el usuario introduce texto', () => {
    render(<SearchForm />);

    const input = screen.getByTestId('search-input');
    const output = screen.getByTestId('search-output');

    expect(output.textContent).toBe('Buscando: ');

    fireEvent.change(input, { target: { value: 'Torta de Lúcuma' } });

    expect(input.value).toBe('Torta de Lúcuma');
    expect(output.textContent).toBe('Buscando: Torta de Lúcuma');
  });
});
