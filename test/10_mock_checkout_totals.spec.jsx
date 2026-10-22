import { cartService } from '../src/services/db';

describe('10. Pruebas con Mocks y Lógica de Negocio: Cálculo de Totales y Cupones', () => {
  it('calcula con precisión matemática subtotal, descuento del 50% con cupón FELICES50, IVA y despacho', () => {
    // Carrito mockeado
    const mockCart = [
      { id: 'TC001', nombre: 'Torta Tres Leches Cuadrada', precio: 24990, cantidad: 1 },
      { id: 'PI001', nombre: 'Pie de Limón Individual', precio: 3490, cantidad: 2 }
    ];

    // Subtotal esperado: 24990 + (3490 * 2) = 31970
    const totalsSinCupon = cartService.calculateTotals(mockCart, null);
    expect(totalsSinCupon.subtotal).toBe(31970);
    expect(totalsSinCupon.descuento).toBe(0);
    expect(totalsSinCupon.envio).toBe(0); // Subtotal > 30000 -> Despacho gratis
    expect(totalsSinCupon.total).toBe(31970);

    // Aplicando cupón FELICES50 (50% de descuento)
    const totalsConCupon = cartService.calculateTotals(mockCart, 'FELICES50');
    expect(totalsConCupon.subtotal).toBe(31970);
    // 50% de 31970 = 15985
    expect(totalsConCupon.descuento).toBe(15985);
    expect(totalsConCupon.cupon.codigo).toBe('FELICES50');
    expect(totalsConCupon.total).toBe(15985); // 31970 - 15985 = 15985
  });
});
