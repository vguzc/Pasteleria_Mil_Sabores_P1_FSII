import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService, VALID_COUPONS, DEFAULT_SCHEDULING } from '../services/db';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => cartService.getCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [stockNotice, setStockNotice] = useState(null);
  const [scheduling, setScheduling] = useState(() => cartService.getScheduling());
  const [couponCode, setCouponCode] = useState(() => {
    try {
      return localStorage.getItem('mil_sabores_cupon_activo') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const handleCartUpdate = () => {
      setCart(cartService.getCart());
    };
    const handleSchedulingUpdate = () => {
      setScheduling(cartService.getScheduling());
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('scheduling-updated', handleSchedulingUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('scheduling-updated', handleSchedulingUpdate);
    };
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const clearStockNotice = () => setStockNotice(null);

  const addItem = (product, qty = 1, showDrawer = true) => {
    const updated = cartService.addItem(product, qty);
    setCart([...updated]);

    if (updated.maxReached) {
      setStockNotice({
        productId: product.id,
        nombre: product.nombre,
        stockLimit: updated.stockLimit,
        mensaje: `Has alcanzado el stock maximo disponible para "${product.nombre}" (${updated.stockLimit} unidades).`
      });
    }

    if (showDrawer) {
      setIsDrawerOpen(true);
    }
    return updated;
  };

  const updateQuantity = (productId, qty) => {
    const updated = cartService.updateQuantity(productId, qty);
    setCart([...updated]);
  };

  const removeItem = (productId) => {
    const updated = cartService.removeItem(productId);
    setCart([...updated]);
  };

  const clearCart = () => {
    cartService.clear();
    setCart([]);
    setCouponCode('');
    setStockNotice(null);
    localStorage.removeItem('mil_sabores_cupon_activo');
  };

  const updateScheduling = (fields) => {
    const updated = cartService.saveScheduling(fields);
    setScheduling(updated);
    return updated;
  };

  const applyCoupon = (code) => {
    const normalized = (code || '').trim().toUpperCase();
    if (VALID_COUPONS[normalized]) {
      setCouponCode(normalized);
      localStorage.setItem('mil_sabores_cupon_activo', normalized);
      return { success: true, coupon: VALID_COUPONS[normalized] };
    }
    return { success: false, message: 'Cupón no válido o expirado.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    localStorage.removeItem('mil_sabores_cupon_activo');
  };

  const totals = cartService.calculateTotals(cart, couponCode, scheduling?.modalidad || 'despacho');

  return (
    <CartContext.Provider value={{
      cart,
      totals,
      couponCode,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      quickViewProduct,
      openQuickView,
      closeQuickView,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon,
      scheduling,
      updateScheduling,
      stockNotice,
      clearStockNotice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Retorno a prueba de fallos para tests aislados que renderizan componentes fuera del provider
    return {
      cart: [],
      totals: { subtotal: 0, descuento: 0, cupon: null, iva: 0, envio: 0, total: 0, itemsCount: 0 },
      couponCode: '',
      isDrawerOpen: false,
      openDrawer: () => {},
      closeDrawer: () => {},
      quickViewProduct: null,
      openQuickView: () => {},
      closeQuickView: () => {},
      addItem: () => {},
      updateQuantity: () => {},
      removeItem: () => {},
      clearCart: () => {},
      applyCoupon: () => ({ success: false }),
      removeCoupon: () => {},
      scheduling: DEFAULT_SCHEDULING,
      updateScheduling: () => {},
      stockNotice: null,
      clearStockNotice: () => {}
    };
  }
  return context;
}
