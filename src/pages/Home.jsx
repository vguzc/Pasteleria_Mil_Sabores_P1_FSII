import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';
import CategoryCard from '../components/store/CategoryCard';
import BakerHeroSlider from '../components/store/BakerHeroSlider';
import { BLOG_POSTS } from './Blogs';

export default function Home() {
  const [especialidades, setEspecialidades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [couponCopied, setCouponCopied] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const allProducts = productService.getAll();
    // Especialidades principales (Tres Leches, Amor Lúcuma, Cheesecake Sin Gluten, Strudel de Manzana)
    const espIds = ['TC001', 'TC003', 'SG001', 'PT005'];
    const esp = allProducts.filter(p => espIds.includes(p.id));
    setEspecialidades(esp.length > 0 ? esp : allProducts.slice(0, 4));

    // Categorías principales
    setCategories(categoryService.getAll().slice(0, 4));
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FELICES50');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2200);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 3500);
  };

  return (
    <div className="home-page" style={{ backgroundColor: 'var(--color-fondo)' }}>
      {/* =========================================================================
          SECCIÓN 1: [FOTO] Hero Slider Interactivo Estilo Baker
          ========================================================================= */}
      <BakerHeroSlider />

      {/* =========================================================================
          SECCIÓN 2: [NO FOTO] Nuestras Especialidades Destacadas
          ========================================================================= */}
      <section style={{ padding: '5.5rem 1.5rem 4.5rem 1.5rem', backgroundColor: 'var(--color-fondo)' }}>
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="seccion-baker-eyebrow">Selección del Maestro Pastelero</span>
            <h2 className="seccion-baker-titulo">Nuestras Especialidades</h2>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc">
              Recetas emblemáticas horneadas cada madrugada con paciencia, materias primas nobles y medio siglo de tradición familiar.
            </p>
          </div>

          <div className="grilla-productos">
            {especialidades.map((prod) => (
              <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/productos" className="boton boton-secundario btn-baker">
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 3: [FOTO SPLIT] Creamos Dulces Recuerdos (Baker Split 2 Columnas)
          ========================================================================= */}
      <section className="seccion-recuerdos-baker">
        <div className="contenedor">
          <div className="grilla-recuerdos-baker">
            {/* Columna Izquierda: Historia y Oficio */}
            <div className="recuerdos-textos">
              <span className="seccion-baker-eyebrow">Tradición Desde 1976 en Providencia</span>
              <h2 className="recuerdos-titulo">
                Creamos Dulces Recuerdos Para Toda la Familia
              </h2>
              <div className="adorno-baker" style={{ margin: '0.8rem 0 1.5rem 0' }} />
              <p className="recuerdos-parrafo">
                Nuestra vocación por la pastelería artesanal comenzó hace cinco décadas en un pequeño horno de Providencia. Hoy conservamos intacta la liturgia del amasado a mano, la cocción pausada y la selección rigurosa de cada ingrediente: mantequilla pura de campo, huevos de gallinas libres y manjar blanco cocido a fuego lento.
              </p>
              <p className="recuerdos-parrafo" style={{ color: 'var(--color-texto-secundario)' }}>
                Desde nuestras clásicas tortas de hojarasca y tres leches hasta nuestra cuidada línea inclusiva sin gluten y sin azúcar añadida, cada pieza que sale de las manos de nuestro maestro pastelero es una invitación a celebrar la dulzura de la vida.
              </p>

              <ul className="recuerdos-pilares-lista">
                <li className="recuerdos-pilar-item">
                  <span className="recuerdos-pilar-check">✓</span>
                  <span>Horneado fresco a diario en nuestro taller de Manuel Montt</span>
                </li>
                <li className="recuerdos-pilar-item">
                  <span className="recuerdos-pilar-check">✓</span>
                  <span>Ingredientes nobles sin sucedáneos ni conservantes artificiales</span>
                </li>
                <li className="recuerdos-pilar-item">
                  <span className="recuerdos-pilar-check">✓</span>
                  <span>Línea inclusiva certificada para celíacos y personas diabéticas</span>
                </li>
              </ul>

              <Link to="/nosotros" className="boton boton-primario btn-baker" style={{ marginTop: '0.5rem' }}>
                Conoce Nuestra Historia
              </Link>
            </div>

            {/* Columna Derecha: Fotos Escalonadas */}
            <div className="recuerdos-fotos-wrap">
              <div className="recuerdos-sello-experiencia">
                <span className="sello-numero">50</span>
                <span className="sello-texto">Años de Oficio</span>
              </div>

              <div className="recuerdos-foto-principal">
                <img
                  src="/img/slider/slide-2-masa.jpg"
                  alt="Amasado artesanal del maestro pastelero"
                  loading="lazy"
                />
              </div>

              <div className="recuerdos-foto-secundaria">
                <img
                  src="/img/slider/slide-3-croissant.jpg"
                  alt="Bollería recién horneada"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 4: [NO FOTO] Nuestras Categorías
          ========================================================================= */}
      <section style={{ padding: '5.5rem 1.5rem 4.5rem 1.5rem', backgroundColor: 'var(--color-fondo)' }}>
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="seccion-baker-eyebrow">Selección del Maestro Pastelero</span>
            <h2 className="seccion-baker-titulo">Nuestras Categorías</h2>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc">
              Cada sección está pensada para acompañar tus celebraciones familiares, aniversarios y momentos de pausa con repostería de excelencia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.25rem' }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/categorias" className="boton boton-secundario btn-baker">
              Ver Todas las Categorías
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 5: [FOTO BANNER] Club Mil Sabores / Newsletter & Aniversario
          ========================================================================= */}
      <section className="seccion-club-baker">
        <div className="club-baker-contenedor">
          <span className="club-baker-eyebrow">Club Mil Sabores • 50° Aniversario</span>
          <h2 className="club-baker-titulo">Mantente al Día con Nuestro Club Pastelero</h2>
          <p className="club-baker-desc">
            Únete a nuestro club de amantes de la buena pastelería para recibir recetas de temporada, invitaciones a catas privadas y un 50% de descuento en tu primera compra con el cupón de aniversario:
          </p>

          {/* Caja Interactiva de Cupón */}
          <div className="club-cupon-box">
            <div className="cupon-box-texto">
              <span className="cupon-box-etiqueta">Cupón 50° Aniversario (50% OFF)</span>
              <span className="cupon-box-codigo">FELICES50</span>
            </div>
            <button
              type="button"
              className="btn-copiar-club"
              onClick={handleCopyCoupon}
              title="Copiar cupón de descuento"
            >
              {couponCopied ? '¡Copiado!' : 'Copiar Cupón'}
            </button>
          </div>

          {/* Formulario de Suscripción */}
          <form className="club-form-wrap" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              className="club-input-email"
              placeholder="Ingresa tu correo electrónico..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-club-submit">
              Unirme al Club
            </button>
          </form>

          {newsletterSuccess && (
            <p className="small mb-4" style={{ color: 'var(--color-caramelo)', fontWeight: 700 }}>
              ¡Bienvenido al Club! Revisa tu bandeja de entrada con el regalo de bienvenida.
            </p>
          )}

          {/* Beneficios Destacados */}
          <div className="club-beneficios-pills">
            <div className="club-beneficio-item">
              <span>•</span>
              <span>Torta gratis en la semana de tu cumpleaños</span>
            </div>
            <div className="club-beneficio-item">
              <span>•</span>
              <span>10% OFF permanente con Convenio Duoc UC</span>
            </div>
            <div className="club-beneficio-item">
              <span>•</span>
              <span>Despacho prioritario en Providencia y Las Condes</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN 6: [NO FOTO] Del Maestro Pastelero (Blog & Recetas de la Casa)
          ========================================================================= */}
      <section className="seccion-blog-baker">
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="seccion-baker-eyebrow">Del Maestro Pastelero</span>
            <h2 className="seccion-baker-titulo">Blog & Recetas de la Casa</h2>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc">
              Secretos culinarios, tutoriales paso a paso de nuestros maestros pasteleros y crónicas de nuestra historia viva.
            </p>
          </div>

          <div className="grilla-blog-baker">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <article key={post.id} className="tarjeta-blog-baker">
                <div className="tarjeta-blog-foto">
                  <Link to={`/blog/${post.id}`} tabIndex="-1">
                    <img
                      src={post.imagen}
                      alt={post.titulo}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/img/torta-mil-sabores.png';
                      }}
                    />
                  </Link>
                </div>
                <div className="tarjeta-blog-cuerpo">
                  <div className="tarjeta-blog-meta">
                    <span className="tarjeta-blog-tag">{post.categoria}</span>
                    <span className="tarjeta-blog-fecha">{post.fecha}</span>
                  </div>
                  <h3 className="tarjeta-blog-titulo">
                    <Link to={`/blog/${post.id}`}>{post.titulo}</Link>
                  </h3>
                  <p className="tarjeta-blog-resumen">{post.resumen}</p>
                  <Link to={`/blog/${post.id}`} className="tarjeta-blog-link">
                    Leer Receta Completa →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/blogs" className="boton boton-secundario btn-baker">
              Ver Todas las Recetas y Artículos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}