import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../src/components/store/ProductCard';

describe('7. Pruebas de Eventos: Simulación de Clic en Agregar al Carrito', () => {
  it('simula un clic en el botón "+ Agregar" y comprueba que se ejecute la función callback con el producto', () => {
    const handleAddToCart = jasmine.createSpy('handleAddToCart');
    const mockProduct = {
      id: 'PI001',
      nombre: 'Pie de Limón Individual',
      categoria: 'Postres Individuales',
      precio: 3490,
      stock: 15,
      descripcion: 'Delicioso pie de limón artesanal.'
    };

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} onAddToCart={handleAddToCart} />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: /\+ Agregar/i });
    expect(addButton).toBeDefined();

    fireEvent.click(addButton);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
