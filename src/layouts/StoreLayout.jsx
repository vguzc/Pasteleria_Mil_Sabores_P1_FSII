import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';

export default function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--color-fondo)' }}>
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      {/* Drawer deslizante del carrito */}
      <CartDrawer />
    </div>
  );
}
