import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Hero Editorial de Nuestra Historia con Fotografías y Branding */}
      <section className="catalogo-hero-banner" style={{ marginBottom: '3.5rem' }}>
        <div className="contenedor">
          <div className="catalogo-hero-grid">
            {/* Columna Izquierda: Información Editorial */}
            <div className="catalogo-hero-info">
              <span className="seccion-baker-eyebrow">
                Medio Siglo de Oficio (1976 - 2026)
              </span>
              <h1 className="catalogo-hero-titulo">
                La Pasión por la Repostería Artesanal
              </h1>
              <div className="adorno-baker" style={{ margin: '0.6rem 0 1.2rem 0' }} />
              <p className="catalogo-hero-desc">
                Desde nuestro primer horno en Providencia hasta convertirnos en un referente de la dulzura familiar chilena, conservando intactas las recetas nobles, el amasado paciente y el cariño por la mesa compartida.
              </p>

              {/* Sellos de Confianza y Calidad */}
              <div className="catalogo-hero-features">
                <div className="catalogo-hero-feature-item">
                  <span className="catalogo-hero-check">✓</span>
                  <span>Recetas Familiares desde 1976</span>
                </div>
                <div className="catalogo-hero-feature-item">
                  <span className="catalogo-hero-check">✓</span>
                  <span>Amasado a Mano & Paciencia</span>
                </div>
                <div className="catalogo-hero-feature-item">
                  <span className="catalogo-hero-check">✓</span>
                  <span>Ingredientes Nobles Sin Sucedáneos</span>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Composición de Fotos Escalonadas y Branding */}
            <div className="catalogo-hero-fotos">
              {/* Foto Principal: Vitrina de croissants y hojaldres dorados */}
              <div className="catalogo-hero-foto-principal">
                <img
                  src="/img/galeria/vitrina-croissants-dorados.png"
                  alt="Vitrina de bollería y hojaldres recién horneados"
                  loading="eager"
                />
              </div>

              {/* Foto Secundaria: Amasado artesanal tradicional a mano con harina */}
              <div className="catalogo-hero-foto-secundaria">
                <img
                  src="/img/galeria/amasado-manos-harina.png"
                  alt="Amasado artesanal a mano tradicional desde 1976"
                  loading="lazy"
                />
              </div>

              {/* Sello Circular Flotante Oficial de Tradición */}
              <Link to="/" className="catalogo-hero-sello" title="Volver al inicio - Mil Sabores" aria-label="Volver al inicio">
                <img
                  src="/img/branding/sello-circular-transparent.png"
                  alt="Sello Mil Sabores Calidad Artesanal"
                  className="catalogo-hero-sello-img"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="contenedor">

        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Raíces & Memoria</span>
            <h2 className="seccion-baker-titulo" style={{ fontSize: '2rem', textAlign: 'left', margin: '0.3rem 0 1rem 0' }}>
              Nuestros Orígenes y Tradición Familiar
            </h2>
            <p className="text-muted" style={{ lineHeight: 1.75 }}>
              En 1976 nació <strong>Pastelería Mil Sabores</strong> como una iniciativa familiar orientada a rescatar las recetas de nuestras abuelas: bizcochos remojados con licores nobles, merengues dorados al horno de piedra y las tradicionales hojarascas finas.
            </p>
            <p className="text-muted" style={{ lineHeight: 1.75 }}>
              A lo largo de las décadas hemos perfeccionado nuestro proceso para incorporar nuevas líneas de productos sin perder la esencia: repostería sin azúcar añadida (con alulosa y stevia pura), opciones 100% libres de gluten certificadas y especialidades veganas.
            </p>
            <div
              className="p-3 rounded-3 mb-3 border-start border-4"
              style={{ backgroundColor: '#FAF4EC', borderColor: 'var(--color-caramelo)' }}
            >
              <p className="fst-italic mb-0 small" style={{ color: 'var(--color-espresso)', lineHeight: 1.6 }}>
                "El secreto de una gran torta no es solo la técnica, sino la devoción y generosidad con que se preparan el manjar blanco y las frutas de estación."
              </p>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <img
              src="/img/noticia-aniversario-1976.jpg"
              alt="Noticia Histórica 1976 Mil Sabores"
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxHeight: '380px', objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(44, 30, 22, 0.09))' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/torta-mil-sabores.png';
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Franja Entera: Hito Récord Guinness de Borde a Borde */}
      <section
        className="franja-guinness-banner"
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-borde)',
          borderBottom: '1px solid var(--color-borde)',
          padding: '4rem 0',
          margin: '2rem 0 4.5rem 0'
        }}
      >
        <div className="contenedor">
          <div className="row align-items-center g-4">
            <div className="col-md-2 text-center text-md-end">
              <div
                style={{
                  width: '84px',
                  height: '84px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  backgroundColor: '#FAF4EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-caramelo)',
                  border: '1px solid rgba(196, 136, 75, 0.25)',
                  boxShadow: '0 4px 12px rgba(44, 30, 22, 0.05)'
                }}
              >
                <i className="bi bi-trophy-fill fs-1"></i>
              </div>
            </div>
            <div className="col-md-10">
              <span className="seccion-baker-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>Hito Histórico</span>
              <h3 className="fw-bold mb-2" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: 'clamp(1.5rem, 2.4vw, 1.9rem)' }}>
                El Gran Hito: Récord Guinness 1995
              </h3>
              <p className="text-muted mb-0" style={{ lineHeight: 1.75, fontSize: '1rem', maxWidth: '960px' }}>
                En el año 1995, nuestro equipo de maestros pasteleros elaboró la torta de milhojas más grande de Sudamérica: más de 500 metros lineales rellenos con manjar artesanal de campo, congregando a miles de familias en una jornada solidaria que marcó la historia de la gastronomía nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="contenedor">
        {/* Identidad de Marca & Atmósfera */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <span className="seccion-baker-eyebrow">Espacios & Tradición</span>
            <h3 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.85rem' }}>
              Nuestra Identidad & Cafetería
            </h3>
            <div className="adorno-baker" />
            <p className="seccion-baker-desc" style={{ maxWidth: '640px', margin: '0 auto' }}>
              Cada detalle de nuestra cafetería ha sido pensado para acogerte: desde el letrero tradicional de nuestra fachada hasta el empaque de tus tortas favoritas.
            </p>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-3">
            {/* 1. Letrero de Fachada */}
            <div className="col">
              <div className="card-identidad-wrap">
                <img
                  src="/img/branding/mockup-letrero.png"
                  alt="Letrero oficial y fachada de cafetería Mil Sabores"
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-center small mt-2 mb-0 fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                Fachada Tradicional
              </p>
            </div>

            {/* 2. Vitrina y Ventanal */}
            <div className="col">
              <div className="card-identidad-wrap">
                <img
                  src="/img/branding/mockup-vitrina.png"
                  alt="Ventanal y vitrina de la cafetería"
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-center small mt-2 mb-0 fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                Nuestra Cafetería
              </p>
            </div>

            {/* 3. Bolsa Kraft Artesanal */}
            <div className="col">
              <div className="card-identidad-wrap">
                <img
                  src="/img/branding/mockup-bolsa.png"
                  alt="Empaques de papel Kraft artesanales"
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-center small mt-2 mb-0 fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                Bolsa Kraft Artesanal
              </p>
            </div>

            {/* 4. Vaso de Café para Llevar */}
            <div className="col">
              <div className="card-identidad-wrap">
                <img
                  src="/img/branding/mockup-vaso.png"
                  alt="Vaso de café de especialidad para llevar"
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-center small mt-2 mb-0 fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                Café de Especialidad
              </p>
            </div>

            {/* 5. Papelería & Sello Gofrado */}
            <div className="col">
              <div className="card-identidad-wrap">
                <img
                  src="/img/branding/mockup-papel.png"
                  alt="Papelería institucional y sello gofrado Mil Sabores"
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />
              </div>
              <p className="text-center small mt-2 mb-0 fw-semibold" style={{ color: 'var(--color-espresso)' }}>
                Papelería & Sello
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/productos" className="boton boton-primario btn-baker">
            Conoce Nuestras Especialidades
          </Link>
        </div>
      </div>
    </div>
  );
}