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
      {/* Hero Banner Principal con degradado oficial */}
      <section className="hero-aniversario py-5 position-relative overflow-hidden">
        <div className="container py-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="badge px-3 py-2 mb-3 shadow-sm text-uppercase fw-bold" style={{ backgroundColor: 'var(--color-rosa)', color: 'var(--color-chocolate)' }}>
                <i className="bi bi-cake2-fill me-2"></i>Edición 50° Aniversario (1976 - 2026)
              </span>
              <h1 className="display-4 mb-3 font-pacifico" style={{ color: 'var(--color-chocolate)' }}>
                Tradición, Pasión y el Auténtico Sabor Chileno
              </h1>
              <p className="lead mb-4" style={{ color: 'var(--color-texto)' }}>
                Medio siglo endulzando los hogares y celebraciones de Chile con tortas artesanales de hojarasca, milhojas, opciones sin azúcar, sin gluten y especialidades tradicionales.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/productos" className="btn btn-primary btn-lg shadow-sm px-4">
                  <i className="bi bi-grid-fill me-2"></i>Ver Catálogo
                </Link>
                <Link to="/ofertas" className="btn btn-rosa btn-lg shadow-sm px-4">
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
                <div className="position-absolute bottom-0 end-0 bg-white p-3 rounded-3 shadow text-start m-3 d-none d-sm-block border" style={{ borderColor: 'var(--color-borde)' }}>
                  <div className="fw-bold" style={{ color: 'var(--color-chocolate)' }}>Torta Cuadrada Mil Sabores</div>
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
            <span className="text-uppercase fw-bold small" style={{ color: 'var(--color-chocolate)' }}>Explora por sección</span>
            <h2 className="font-pacifico mb-0" style={{ color: 'var(--color-chocolate)' }}>
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
      <section className="py-5" style={{ backgroundColor: 'rgba(255, 245, 225, 0.6)', borderTop: '1px solid var(--color-borde)', borderBottom: '1px solid var(--color-borde)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 text-uppercase mb-2" style={{ backgroundColor: 'var(--color-rosa)', color: 'var(--color-chocolate)' }}>
              Selección del Chef
            </span>
            <h2 className="display-6 font-pacifico" style={{ color: 'var(--color-chocolate)' }}>
              Las Tortas Más Cotizadas de la Temporada
            </h2>
            <p className="mx-auto" style={{ maxWidth: '620px', color: 'var(--color-texto-secundario)' }}>
              Recetas clásicas preparadas diariamente en nuestro taller con manjar de campo e ingredientes 100% artesanales.
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
            <div className="p-4 rounded-4 h-100 card-beneficio-aniversario">
              <i className="bi bi-award fs-1 mb-2 d-block" style={{ color: 'var(--color-chocolate)' }}></i>
              <h5 className="fw-bold" style={{ color: 'var(--color-chocolate)' }}>Récord Guinness 1995</h5>
              <p className="small mb-0" style={{ color: 'var(--color-texto-secundario)' }}>
                Creadores de la torta de milhojas más grande de Sudamérica, un hito histórico de la pastelería nacional.
              </p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 rounded-4 h-100 card-beneficio-aniversario">
              <i className="bi bi-truck fs-1 mb-2 d-block" style={{ color: 'var(--color-chocolate)' }}></i>
              <h5 className="fw-bold" style={{ color: 'var(--color-chocolate)' }}>Despacho Refrigerado</h5>
              <p className="small mb-0" style={{ color: 'var(--color-texto-secundario)' }}>
                Flota especializada con temperatura controlada para asegurar que tus tortas lleguen frescas e impecables.
              </p>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <div className="p-4 rounded-4 h-100 card-beneficio-aniversario">
              <i className="bi bi-percent fs-1 mb-2 d-block" style={{ color: 'var(--color-chocolate)' }}></i>
              <h5 className="fw-bold" style={{ color: 'var(--color-chocolate)' }}>Convenio Duoc & Edad 50+</h5>
              <p className="small mb-0" style={{ color: 'var(--color-texto-secundario)' }}>
                10% de descuento para la comunidad Duoc UC y 50% de descuento para clientes mayores de 50 años.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
