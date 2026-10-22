import { productService } from '../src/services/db';

describe('9. Pruebas con Mocks: Servicio CRUD de Productos con Jasmine Spies', () => {
  it('debe utilizar mocks y spies para aislar las operaciones CRUD de lectura y creación', () => {
    const mockList = [
      { id: 'PROD-01', nombre: 'Torta Mock 1', precio: 15000, stock: 10, categoria: 'Tortas Cuadradas' }
    ];

    // Mock con spyOn de Jasmine
    spyOn(productService, 'getAll').and.returnValue(mockList);

    const result = productService.getAll();
    expect(productService.getAll).toHaveBeenCalled();
    expect(result.length).toBe(1);
    expect(result[0].nombre).toBe('Torta Mock 1');

    // Mock para creación
    const newMockProduct = { id: 'PROD-02', nombre: 'Torta Mock 2', precio: 20000, stock: 5 };
    spyOn(productService, 'create').and.returnValue(newMockProduct);

    const created = productService.create(newMockProduct);
    expect(productService.create).toHaveBeenCalledWith(newMockProduct);
    expect(created.id).toBe('PROD-02');
  });
});
