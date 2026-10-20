import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/store/ProductCard';

describe('4. Pruebas de Propiedades (props): Tarjeta de Producto', () => {
  it('debe recibir correctamente el objeto product y renderizar nombre, categoría y precio', () => {
    const mockProduct = {
      id: 'TC001',
      nombre: 'Torta Tres Leches Cuadrada',
      categoria: 'Tortas Cuadradas',
      precio: 24990,
      stock: 10,
      descripcion: 'Bizcocho esponjoso remojado en tres leches.',
      imagen: '/img/torta-tres-leches-cuadrada.png',
      enOferta: true
    };

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onAddToCart={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Torta Tres Leches Cuadrada')).toBeDefined();
    expect(screen.getByText('Tortas Cuadradas')).toBeDefined();
    expect(screen.getByText(/24\.990/)).toBeDefined();
    expect(screen.getByText(/OFERTA/i)).toBeDefined();
  });
});
