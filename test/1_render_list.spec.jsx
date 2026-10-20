import React from 'react';
import { render, screen } from '@testing-library/react';

// Componente de lista para pruebas
function ProductList({ items }) {
  if (!items || items.length === 0) {
    return <p>No hay elementos disponibles</p>;
  }
  return (
    <ul data-testid="product-list">
      {items.map((item) => (
        <li key={item.id} data-testid="product-item">
          <span className="item-name">{item.nombre}</span> - <span className="item-price">${item.precio}</span>
        </li>
      ))}
    </ul>
  );
}

describe('1. Pruebas de Renderizado: Renderizado Correcto de Listas', () => {
  it('debe renderizar exactamente todos los elementos de un conjunto de datos proporcionado', () => {
    const mockProducts = [
      { id: 'TC001', nombre: 'Torta Tres Leches Cuadrada', precio: 24990 },
      { id: 'TC002', nombre: 'Torta Cuadrada Mil Sabores', precio: 28990 },
      { id: 'TC003', nombre: 'Torta Amor Manjar Lúcuma', precio: 26990 }
    ];

    render(<ProductList items={mockProducts} />);

    const listElement = screen.getByTestId('product-list');
    expect(listElement).toBeDefined();

    const renderedItems = screen.getAllByTestId('product-item');
    expect(renderedItems.length).toBe(3);

    expect(screen.getByText('Torta Tres Leches Cuadrada')).toBeDefined();
    expect(screen.getByText('Torta Cuadrada Mil Sabores')).toBeDefined();
    expect(screen.getByText('Torta Amor Manjar Lúcuma')).toBeDefined();
  });
});
