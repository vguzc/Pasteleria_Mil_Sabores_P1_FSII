import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService, VALID_COUPONS } from '../services/db';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => cartService.getCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem = (product, qty = 1, showDrawer = true) => {
    const updated = cartService.addItem(product, qty);
    setCart([...updated]);
    if (showDrawer) {
      setIsDrawerOpen(true);
    }
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
    localStorage.removeItem('mil_sabores_cupon_activo');
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

  const totals = cartService.calculateTotals(cart, couponCode);

  return (
    <CartContext.Provider value={{
      cart,
      totals,
      couponCode,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
