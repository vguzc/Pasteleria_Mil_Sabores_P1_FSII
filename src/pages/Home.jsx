import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';
import CategoryCard from '../components/store/CategoryCard';

export default function Home() {
  const [especialidades, setEspecialidades] = useState([]);
  const [especial18, setEspecial18] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    const allProducts = productService.getAll();
    // 1. Especialidades principales (Tres Leches, Amor Lúcuma, Cheesecake Sin Gluten, Strudel de Manzana)
    const espIds = ['TC001', 'TC003', 'SG001', 'PT005'];
    const esp = allProducts.filter(p => espIds.includes(p.id));
    setEspecialidades(esp.length > 0 ? esp : allProducts.slice(0, 4));

    // 2. Especial 18 de Septiembre (Empanadas)
    const esp18 = allProducts.filter(p => p.categoria.toLowerCase().includes('18'));
    setEspecial18(esp18);

    // 3. Categorías oficiales
    setCategories(categoryService.getAll().slice(0, 4));
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Principal Fiel al Original */}
      <section className="hero hero-tienda">
        <div className="contenedor" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow" style={{ fontSize: '1.05rem', color: 'var(--color-chocolate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            50 Años de Dulzura Chilena
          </span>
          <h1 style={{ fontFamily: 'var(--fuente-titulos)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--color-chocolate)', margin: '0.5rem 0 1rem 0', fontWeight: 'normal', lineHeight: 1.2 }}>
            Pastelería Mil Sabores
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-texto)', lineHeight: 1.7, maxWidth: '720px', margin: '0 auto 2rem auto' }}>
            Bienvenidos a nuestra repostería artesanal. Desde 1976 preparamos tortas y postres tradicionales elaborados con ingredientes seleccionados y el auténtico toque casero que nos caracteriza.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/productos" className="boton boton-primario" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Ver Catálogo Completo
            </Link>
            <Link to="/registro" className="boton boton-secundario" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Obtener Descuentos Especiales
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Banner Aniversario / Beneficios con Cupón FELICES50 */}
      <section style={{ padding: '3rem 1rem', backgroundColor: '#FFFFFF' }}>
        <div className="contenedor" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-chocolate) 0%, #5C2C0B 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radio-borde)',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
              boxShadow: 'var(--sombra-suave)'
            }}
          >
            <div>
              <span
                style={{
                  backgroundColor: 'var(--color-rosa)',
                  color: 'var(--color-chocolate)',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Beneficios 50° Aniversario
              </span>
              <h2 style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '2.2rem', color: 'var(--color-fondo)', margin: '0.8rem 0 0.5rem 0', fontWeight: 'normal' }}>
                ¡Descuentos por Inscribirte!
              </h2>
              <p style={{ color: '#F8E8D8', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                Regístrate y accede a un <strong>50% OFF</strong> para mayores de 50 años con el cupón <strong>FELICES50</strong>, además de un 10% OFF y torta gratis en tu semana de cumpleaños con <strong>Convenio Duoc UC</strong>.
              </p>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.25)' }}>
              <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem 0', color: 'var(--color-rosa)' }}>
                Cupón 50% OFF (50+ Años)
              </p>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '3px', color: '#FFFFFF', marginBottom: '1rem' }}>
                FELICES50
              </div>
              <Link to="/registro" className="boton boton-rosa" style={{ width: '100%' }}>
                Registrarme Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Nuestras Especialidades Destacadas (El orden exacto original) */}
      <section style={{ padding: '3rem 1rem' }}>
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '2.5rem', color: 'var(--color-chocolate)', marginBottom: '0.5rem', fontWeight: 'normal' }}>
              Nuestras Especialidades
            </h2>
            <p style={{ color: 'var(--color-texto)', fontSize: '1.05rem', margin: '0 auto' }}>
              Descubre los favoritos de nuestros clientes, preparados día a día en nuestro taller de Providencia.
            </p>
          </div>

          <div className="grilla-productos">
            {especialidades.map((prod) => (
              <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/productos" className="boton boton-secundario" style={{ padding: '0.8rem 2.2rem' }}>
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Especial 18 de Septiembre (Idéntico a la versión original) */}
      {especial18.length > 0 && (
        <section
          style={{
            padding: '3rem 1rem',
            backgroundColor: '#FFFBF7',
            borderTop: '1px solid rgba(107, 68, 35, 0.08)',
            borderBottom: '1px solid rgba(107, 68, 35, 0.08)'
          }}
        >
          <div className="contenedor">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span
                style={{
                  backgroundColor: '#D32F2F',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '50px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  marginBottom: '0.75rem'
                }}
              >
                🇨🇱 Edición Fiestas Patrias
              </span>
              <h2 style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '2.5rem', color: 'var(--color-chocolate)', marginBottom: '0.5rem', fontWeight: 'normal' }}>
                Especial 18 de Septiembre
              </h2>
              <p style={{ color: 'var(--color-texto)', fontSize: '1.05rem', margin: '0 auto', maxWidth: '650px' }}>
                Disfruta de nuestras tradicionales empanadas artesanalmente preparadas para celebrar en familia (¡incluye opción sin gluten!).
              </p>
            </div>

            <div className="grilla-productos">
              {especial18.map((prod) => (
                <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/categoria/Especial%2018" className="boton boton-primario" style={{ padding: '0.8rem 2.2rem' }}>
                Ver Categoría Especial 18
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5. Categorías de la Tienda (Requisito de Evaluación 2 integrado armoniosamente) */}
      <section style={{ padding: '3.5rem 1rem' }}>
        <div className="contenedor">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--color-chocolate)', textTransform: 'uppercase', fontWeight: 700, fontSize: '0.85rem' }}>
                Explora por sección
              </span>
              <h2 style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '2.2rem', color: 'var(--color-chocolate)', margin: 0, fontWeight: 'normal' }}>
                Nuestras Categorías
              </h2>
            </div>
            <Link to="/categorias" className="boton boton-secundario" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              Ver todas →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
