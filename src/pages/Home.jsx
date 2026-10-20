import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';
import CategoryCard from '../components/store/CategoryCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const prods = productService.getAll().filter(p => p.destacado);
    setFeaturedProducts(prods.slice(0, 4));
    setCategories(categoryService.getAll().slice(0, 4));
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner Principal */}
      <section className="bg-light py-5 position-relative overflow-hidden border-bottom hero-section">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge bg-warning text-dark px-3 py-2 mb-3 shadow-sm text-uppercase fw-bold">
                <i className="bi bi-cake2-fill me-2"></i>Edición 50° Aniversario (1976 - 2026)
              </span>
              <h1 className="display-4 fw-bold mb-3 text-dark font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
                Tradición, Pasión y el Auténtico Sabor Chileno
              </h1>
              <p className="lead text-muted mb-4">
                Medio siglo endulzando los hogares y celebraciones de Chile con tortas artesanales de hojarasca, milhojas, opciones sin azúcar, sin gluten y especialidades tradicionales.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/productos" className="btn btn-primary btn-lg shadow-sm px-4">
                  <i className="bi bi-grid-fill me-2"></i>Ver Catálogo
                </Link>
                <Link to="/ofertas" className="btn btn-outline-danger btn-lg shadow-sm px-4">
                  <i className="bi bi-percent me-2"></i>Especial Ofertas
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src="/img/torta-mil-sabores.png"
                  alt="Torta Mil Sabores Insignia"
                  className="img-fluid rounded-4 shadow-lg hero-img"
                  style={{ maxHeight: '380px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/torta-aniversario.png';
                  }}
                />
                <div className="position-absolute bottom-0 end-0 bg-white p-3 rounded-3 shadow text-start m-3 d-none d-sm-block">
                  <div className="fw-bold text-primary">Torta Cuadrada Mil Sabores</div>
                  <small className="text-muted">Nuestra especialidad insignia</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Principales (Figura 1 & 4 de la pauta) */}
      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <span className="text-primary text-uppercase fw-bold small">Explora por sección</span>
            <h2 className="fw-bold font-serif mb-0" style={{ fontFamily: 'Playfair Display, serif' }}>
              Nuestras Categorías
            </h2>
          </div>
          <Link to="/categorias" className="btn btn-outline-primary btn-sm">
            Ver todas <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {categories.map((cat) => (
            <div key={cat.id} className="col">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </section>

      {/* Especialidades Destacadas */}
      <section className="bg-light py-5 border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary px-3 py-2 text-uppercase mb-2">Selección del Chef</span>
            <h2 className="display-6 fw-bold font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
              Las Tortas Más Cotizadas de la Temporada
            </h2>
            <p className="text-muted max-w-600 mx-auto">
              Recetas clásicas preparadas diariamente en nuestro taller con manjar de campo e ingredientes seleccionados.
            </p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="col">
                <ProductCard product={prod} onAddToCart={addItem} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner 50 Años & Beneficios */}
      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center">
            <div className="p-4 bg-warning bg-opacity-10 rounded-4 border border-warning h-100">
              <i className="bi bi-award fs-1 text-warning mb-2 d-block"></i>
              <h5 className="fw-bold">Récord Guinness 1995</h5>
              <p className="text-muted small mb-0">
                Creadores de la torta de milhojas más grande de Sudamérica, un hito histórico de la pastelería nacional.
              </p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 bg-primary bg-opacity-10 rounded-4 border border-primary h-100">
              <i className="bi bi-truck fs-1 text-primary mb-2 d-block"></i>
              <h5 className="fw-bold">Despacho Refrigerado</h5>
              <p className="text-muted small mb-0">
                Flota especializada con temperatura controlada para asegurar que tus tortas lleguen perfectas y frescas.
              </p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 bg-success bg-opacity-10 rounded-4 border border-success h-100">
              <i className="bi bi-percent fs-1 text-success mb-2 d-block"></i>
              <h5 className="fw-bold">Convenio Duoc UC & Edad 50+</h5>
              <p className="text-muted small mb-0">
                10% de descuento para la comunidad Duoc UC y 50% de descuento para clientes mayores de 50 años.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
