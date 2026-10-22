import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import ProductQuickViewDrawer from '../components/store/ProductQuickViewDrawer';

export default function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--color-fondo)' }}>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      {/* Vista previa lateral deslizante del producto */}
      <ProductQuickViewDrawer />
      {/* Drawer deslizante del carrito */}
      <CartDrawer />
    </div>
  );
}
