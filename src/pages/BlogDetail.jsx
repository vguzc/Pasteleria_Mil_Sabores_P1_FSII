import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from './Blogs';
import { getAssetUrl } from '../utils/imageUrl';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find(p => p.id === id || p.slug === id);

  if (!post) {
    return (
      <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '60vh', padding: '5rem 1rem' }} className="text-center">
        <h4 style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>Artículo no encontrado</h4>
        <Link to="/blogs" className="boton boton-primario btn-baker mt-3">Volver al Blog</Link>
      </div>
    );
  }

  const otherPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

  const heroBg = `linear-gradient(135deg, rgba(26, 17, 12, 0.90) 0%, rgba(38, 24, 18, 0.82) 55%, rgba(26, 17, 12, 0.92) 100%), url(${getAssetUrl(post.imagen || 'img/slider/slide-2-masa.jpg')})`;

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Hero Banner Editorial del Artículo Full Width estilo Baker */}
      <section className="articulo-hero-banner" style={{ backgroundImage: heroBg }}>
        <div className="contenedor">
          {/* Breadcrumb integrado con estilo de las otras páginas */}
          <nav aria-label="breadcrumb" className="articulo-hero-breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/blogs">Blog & Recetas</Link>
              </li>
              <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '420px' }}>
                {post.titulo}
              </li>
            </ol>
          </nav>

          <div className="articulo-hero-contenido">
            {/* Metadatos y Categoría */}
            <div className="articulo-hero-meta">
              <span className="articulo-hero-badge">
                <i className="bi bi-tag-fill"></i>
                {post.categoria}
              </span>
              <span className="articulo-hero-meta-item">
                <i className="bi bi-calendar3"></i>
                {post.fecha}
              </span>
              <span className="articulo-hero-meta-item">
                <i className="bi bi-person-circle"></i>
                Por {post.autor}
              </span>
            </div>

            {/* Título Principal */}
            <h1 className="articulo-hero-titulo">
              {post.titulo}
            </h1>

            {/* Adorno Divisor Baker */}
            <div className="adorno-baker" style={{ margin: '0.6rem 0 1.25rem 0' }} />

            {/* Bajada Editorial */}
            <p className="articulo-hero-bajada">
              {post.resumen}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Cuerpo del Artículo */}
      <div className="contenedor" style={{ paddingTop: '3.5rem' }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            {/* Imagen Principal en Card Enmarcada */}
            <div
              className="card border-0 rounded-4 overflow-hidden shadow-sm mb-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}
            >
              <img
                src={getAssetUrl(post.imagen)}
                alt={post.titulo}
                className="w-100 object-fit-cover"
                style={{ maxHeight: '420px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getAssetUrl('img/torta-mil-sabores.png');
                }}
              />
            </div>

            {/* Ingredientes si es receta */}
            {post.ingredientes && (
              <div
                className="card border-0 p-4 rounded-4 mb-4 shadow-sm"
                style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}
              >
                <h4
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.35rem' }}
                >
                  <i className="bi bi-card-checklist me-2" style={{ color: 'var(--color-caramelo)' }}></i>
                  Ingredientes Requeridos:
                </h4>
                <ul className="list-group list-group-flush bg-transparent">
                  {post.ingredientes.map((ing, i) => (
                    <li
                      key={i}
                      className="list-group-item bg-transparent px-0 py-2 small d-flex align-items-center"
                      style={{ color: 'var(--color-espresso)' }}
                    >
                      <span className="me-2" style={{ color: 'var(--color-caramelo)', fontWeight: 'bold' }}>✓</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contenido en párrafos */}
            <div className="article-body mb-5">
              {post.contenido.map((parrafo, idx) => (
                <p
                  key={idx}
                  className="mb-3"
                  style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--color-texto)' }}
                >
                  {parrafo}
                </p>
              ))}
            </div>

            {/* Video Tutorial embebido de YouTube si existe */}
            {post.videoUrl && (
              <div className="my-5 p-4 rounded-4 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}>
                <h4
                  className="fw-bold mb-3 d-flex align-items-center"
                  style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}
                >
                  <i className="bi bi-play-circle-fill me-2" style={{ color: 'var(--color-caramelo)' }}></i>
                  Video Tutorial Paso a Paso
                </h4>
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-borde)' }}>
                  <iframe
                    src={post.videoUrl}
                    title={post.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Tarjeta de Firma / Autor */}
            <div
              className="p-4 rounded-4 mb-5 d-flex align-items-center gap-3 shadow-sm"
              style={{ backgroundColor: '#FAF7F2', border: '1px solid var(--color-borde)' }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-caramelo)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}
              >
                <i className="bi bi-person"></i>
              </div>
              <div>
                <h6 className="mb-1 fw-bold" style={{ color: 'var(--color-espresso)' }}>
                  {post.autor}
                </h6>
                <p className="mb-0 text-muted small">
                  Maestro pastelero y equipo editorial de Pastelería Mil Sabores • Tradición artesanal desde 1976.
                </p>
              </div>
            </div>

            {/* Navegación al final */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 pt-3 border-top" style={{ borderColor: 'var(--color-borde)' }}>
              <Link to="/blogs" className="boton boton-secundario btn-baker">
                ← Volver al Blog & Recetas
              </Link>
              <Link to="/productos" className="boton boton-primario btn-baker">
                Ver Catálogo de Tortas →
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Sección de Más Artículos del Blog */}
        {otherPosts.length > 0 && (
          <div className="mt-5 pt-5 border-top" style={{ borderColor: 'var(--color-borde)' }}>
            <div className="text-center mb-4">
              <span className="seccion-baker-eyebrow">
                Continúa Leyendo
              </span>
              <h2 className="seccion-baker-titulo" style={{ fontSize: '1.8rem' }}>
                Más Artículos & Técnicas
              </h2>
              <div className="adorno-baker mx-auto" />
            </div>

            <div className="row g-4 justify-content-center">
              {otherPosts.map((other) => (
                <div key={other.id} className="col-12 col-md-6 col-lg-5">
                  <div
                    className="card h-100 border-0 rounded-3 overflow-hidden shadow-sm"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}
                  >
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img
                        src={getAssetUrl(other.imagen)}
                        alt={other.titulo}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getAssetUrl('img/torta-mil-sabores.png');
                        }}
                      />
                    </div>
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--color-caramelo)'
                          }}
                        >
                          {other.categoria}
                        </span>
                        <h4
                          className="card-title fw-bold mt-1 mb-2"
                          style={{ fontFamily: 'var(--fuente-titulos)', fontSize: '1.15rem', color: 'var(--color-espresso)' }}
                        >
                          {other.titulo}
                        </h4>
                        <p className="card-text text-muted small">{other.resumen}</p>
                      </div>
                      <div className="mt-3">
                        <Link to={`/blog/${other.id}`} className="boton boton-secundario btn-baker w-100 text-center" style={{ fontSize: '0.82rem' }}>
                          Leer Artículo →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
