import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/db';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/store/ProductCard';
import CategoryCard from '../components/store/CategoryCard';
import BakerHeroSlider from '../components/store/BakerHeroSlider';

export default function Home() {
  const [especialidades, setEspecialidades] = useState([]);
  const [especial18, setEspecial18] = useState([]);
  const [categories, setCategories] = useState([]);
  const [couponCopied, setCouponCopied] = useState(false);
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

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FELICES50');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2200);
  };

  return (
    <div className="home-page">
      {/* 1. Hero Slider Interactivo con Imágenes y Diapositivas Estilo Baker */}
      <BakerHeroSlider />

      {/* 2. Barra de Pilares de Oficio (Baker Features Bar) */}
      <section className="barra-pilares-baker">
        <div className="contenedor">
          <div className="grilla-pilares">
            <div className="pilar-item">
              <div className="pilar-icono">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h4 className="pilar-titulo">Horneado a Diario</h4>
              <p className="pilar-desc">Todo elaborado fresco cada madrugada en nuestro taller familiar de Providencia.</p>
            </div>

            <div className="pilar-item">
              <div className="pilar-icono">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h4 className="pilar-titulo">Ingredientes Nobles</h4>
              <p className="pilar-desc">Mantequilla de campo, huevos seleccionados, manjar artesanal y chocolate puro.</p>
            </div>

            <div className="pilar-item">
              <div className="pilar-icono">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06z"></path>
                </svg>
              </div>
              <h4 className="pilar-titulo">50 Años de Tradición</h4>
              <p className="pilar-desc">Recetas emblemáticas transmitidas de generación en generación desde 1976.</p>
            </div>

            <div className="pilar-item">
              <div className="pilar-icono">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h4 className="pilar-titulo">Línea Inclusiva</h4>
              <p className="pilar-desc">Opciones dedicadas sin gluten certificadas, veganas y sin azúcar añadida.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Nuestras Especialidades Destacadas (Baker Showcase) */}
      <section style={{ padding: '5rem 1.5rem 4rem 1.5rem' }}>
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="seccion-baker-eyebrow">Selección del Maestro Pastelero</span>
            <h2 className="seccion-baker-titulo">Nuestras Especialidades</h2>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc">
              Descubre los favoritos de nuestros clientes, elaborados con paciencia y las mejores materias primas.
            </p>
          </div>

          <div className="grilla-productos">
            {especialidades.map((prod) => (
              <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/productos" className="boton boton-secundario btn-baker">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Cita Editorial / Testimonio Estilo Baker ("They said about us") */}
      <section className="seccion-cita-baker">
        <div className="contenedor" style={{ maxWidth: '860px', textAlign: 'center' }}>
          <span className="cita-baker-simbolo">“</span>
          <blockquote className="cita-baker-texto">
            El verdadero secreto de Mil Sabores no radica únicamente en sus recetas de 1976, sino en el cariño y la devoción con que cada madrugada encienden los hornos para endulzar nuestras celebraciones familiares.
          </blockquote>
          <div className="cita-baker-autor">
            <span className="autor-nombre">Crónica Gastronómica de Santiago</span>
            <span className="autor-cargo">50 Años de Tradición y Repostería Artesanal</span>
          </div>
        </div>
      </section>

      {/* 5. Banner Aniversario / Ticket Artesanal con Cupón FELICES50 */}
      <section className="seccion-ticket-aniversario">
        <div className="contenedor" style={{ maxWidth: '1080px' }}>
          <div className="ticket-aniversario">
            <div>
              <span className="ticket-tag">
                Edición Especial 50° Aniversario
              </span>
              <h2 className="ticket-titulo">
                Celebra con Nosotros: Beneficios Exclusivos
              </h2>
              <ul className="ticket-cuerpo-lista">
                <li>
                  <span className="ticket-bullet">•</span>
                  <span><strong>50% OFF</strong> para mayores de 50 años con el cupón de aniversario.</span>
                </li>
                <li>
                  <span className="ticket-bullet">•</span>
                  <span><strong>10% OFF</strong> permanente para estudiantes y docentes con <strong>Convenio Duoc UC</strong>.</span>
                </li>
                <li>
                  <span className="ticket-bullet">•</span>
                  <span><strong>Torta Gratis</strong> en tu semana de cumpleaños al registrarte.</span>
                </li>
              </ul>
              <Link to="/registro" className="boton boton-rosa btn-baker" style={{ marginTop: '0.5rem' }}>
                Crear Cuenta y Acceder a Beneficios
              </Link>
            </div>

            <div className="ticket-tarjeta-cupon">
              <p className="ticket-cupon-label">Cupón Mayores de 50 Años</p>
              <div className="ticket-cupon-codigo">FELICES50</div>
              <button
                type="button"
                className="btn-copiar-cupon"
                onClick={handleCopyCoupon}
                title="Copiar cupón al portapapeles"
              >
                {couponCopied ? '¡Cupón Copiado!' : 'Copiar Cupón'}
              </button>
              <small style={{ display: 'block', marginTop: '0.85rem', color: '#EADFD2', fontSize: '0.78rem' }}>
                Ingrésalo en tu bolsa de compra o en el checkout
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Especial 18 de Septiembre (Tradición Fiestas Patrias) */}
      {especial18.length > 0 && (
        <section
          style={{
            padding: '5rem 1.5rem',
            backgroundColor: '#F3EDE2',
            borderTop: '1px solid var(--color-borde)',
            borderBottom: '1px solid var(--color-borde)'
          }}
        >
          <div className="contenedor">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span
                style={{
                  backgroundColor: '#B54234',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  padding: '0.4rem 1.1rem',
                  borderRadius: '30px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  display: 'inline-block',
                  marginBottom: '0.85rem'
                }}
              >
                Edición Fiestas Patrias
              </span>
              <h2 className="seccion-baker-titulo">Especial 18 de Septiembre</h2>
              <div className="adorno-baker" />
              <p className="seccion-baker-desc">
                Nuestras tradicionales empanadas preparadas con receta campestre tradicional, masa crujiente y pino jugoso (incluye opción sin gluten certificada).
              </p>
            </div>

            <div className="grilla-productos">
              {especial18.map((prod) => (
                <ProductCard key={prod.id} product={prod} onAddToCart={addItem} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link to="/categoria/Especial%2018" className="boton boton-primario btn-baker">
                Ver Todo el Especial 18
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Nuestras Categorías (Baker Category Showcase) */}
      <section style={{ padding: '5rem 1.5rem 4rem 1.5rem' }}>
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="seccion-baker-eyebrow">Explora Nuestro Obrador</span>
            <h2 className="seccion-baker-titulo">Nuestras Categorías</h2>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc">
              Cada sección está pensada para acompañar tus celebraciones con la más alta repostería artesanal.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '2.25rem' }}>
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/categorias" className="boton boton-secundario btn-baker">
              Ver Todas las Categorías ({categories.length})
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Galería del Obrador / Momentos Artesanales Estilo Baker */}
      <section className="seccion-galeria-obrador">
        <div className="contenedor">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="seccion-baker-eyebrow">Detrás del Horno</span>
            <h2 className="seccion-baker-titulo">Desde Nuestro Obrador</h2>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc">
              Cada preparación cuenta una historia de dedicación, paciencia y amor por la buena mesa.
            </p>
          </div>

          <div className="grilla-galeria-baker">
            <div className="galeria-baker-item">
              <img src="/img/slider/slide-1-cafe.png" alt="Café de especialidad" loading="lazy" />
              <div className="galeria-baker-overlay">
                <span className="galeria-tag">Barismo & Café</span>
              </div>
            </div>
            <div className="galeria-baker-item">
              <img src="/img/slider/slide-2-masa.jpg" alt="Amasado artesanal" loading="lazy" />
              <div className="galeria-baker-overlay">
                <span className="galeria-tag">Masas Madre</span>
              </div>
            </div>
            <div className="galeria-baker-item">
              <img src="/img/slider/slide-3-croissant.jpg" alt="Hojaldres crujientes" loading="lazy" />
              <div className="galeria-baker-overlay">
                <span className="galeria-tag">Bollería del Día</span>
              </div>
            </div>
            <div className="galeria-baker-item">
              <img src="/img/slider/slide-4-cookies.jpg" alt="Galletas con chocolate belga" loading="lazy" />
              <div className="galeria-baker-overlay">
                <span className="galeria-tag">Galletas Caseras</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
