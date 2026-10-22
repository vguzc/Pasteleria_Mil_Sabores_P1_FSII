import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout';
import AdminLayout from './layouts/AdminLayout';

// Redirección elegante: Categorías unificadas dentro del Catálogo
function CategoryRedirect() {
  const { categoryName } = useParams();
  return <Navigate to={`/productos?categoria=${encodeURIComponent(categoryName || '')}`} replace />;
}

// Store Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutError from './pages/CheckoutError';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';
import About from './pages/About';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminProfile from './pages/admin/AdminProfile';

export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas de la Tienda */}
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Products />} />
        <Route path="producto/:id" element={<ProductDetail />} />
        {/* Unificación de Categorías dentro del Catálogo */}
        <Route path="categorias" element={<Navigate to="/productos" replace />} />
        <Route path="categoria/:categoryName" element={<CategoryRedirect />} />
        <Route path="ofertas" element={<Offers />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="compra" element={<Checkout />} />
        <Route path="compra-exitosa/:orderId" element={<CheckoutSuccess />} />
        <Route path="compra-exitosa" element={<CheckoutSuccess />} />
        <Route path="compra-error" element={<CheckoutError />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="mi-cuenta" element={<MyAccount />} />
        <Route path="nosotros" element={<About />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="contacto" element={<Contact />} />
      </Route>

      {/* Rutas del Panel Administrativo */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="ordenes" element={<AdminOrders />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="reportes" element={<AdminReports />} />
        <Route path="perfil" element={<AdminProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
