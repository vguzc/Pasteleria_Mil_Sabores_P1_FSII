import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from './Blogs';

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

  return (
    <div style={{ backgroundColor: 'var(--color-fondo)', minHeight: '100vh', padding: '3.5rem 0 6rem 0' }}>
      <div className="contenedor">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/blogs" style={{ color: 'var(--color-espresso)' }}>Blog & Recetas</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>{post.titulo}</li>
          </ol>
        </nav>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-3">
              <span className="badge me-2" style={{ backgroundColor: 'var(--color-caramelo)', color: '#FFFFFF', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {post.categoria}
              </span>
              <span className="text-muted small">{post.fecha} • Por {post.autor}</span>
            </div>

            <h1 className="fw-bold mb-4" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: 'clamp(2rem, 3.4vw, 2.8rem)', lineHeight: 1.25 }}>
              {post.titulo}
            </h1>

            <div className="text-center p-4 rounded-3 mb-4 shadow-sm" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-borde)' }}>
              <img
                src={post.imagen}
                alt={post.titulo}
                className="img-fluid rounded-3"
                style={{ maxHeight: '380px', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/img/torta-mil-sabores.png';
                }}
              />
            </div>

            <div className="lead text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.75 }}>
              {post.resumen}
            </div>

            {/* Ingredientes si es receta */}
            {post.ingredientes && (
              <div className="card border-0 p-4 rounded-3 mb-4 shadow-sm" style={{ backgroundColor: '#FAF4EC', border: '1px solid var(--color-caramelo)' }}>
                <h4 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)', fontSize: '1.4rem' }}>
                  <i className="bi bi-card-checklist me-2" style={{ color: 'var(--color-caramelo)' }}></i>Ingredientes Requeridos:
                </h4>
                <ul className="list-group list-group-flush bg-transparent">
                  {post.ingredientes.map((ing, i) => (
                    <li key={i} className="list-group-item bg-transparent px-0 py-2 small d-flex align-items-center" style={{ color: 'var(--color-espresso)' }}>
                      <span className="me-2" style={{ color: 'var(--color-caramelo)', fontWeight: 'bold' }}>✓</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contenido en párrafos */}
            <div className="article-body mb-4">
              {post.contenido.map((parrafo, idx) => (
                <p key={idx} className="mb-3" style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--color-texto)' }}>
                  {parrafo}
                </p>
              ))}
            </div>

            {/* Video Tutorial embebido de YouTube si existe */}
            {post.videoUrl && (
              <div className="my-5">
                <h4 className="fw-bold mb-3" style={{ fontFamily: 'var(--fuente-titulos)', color: 'var(--color-espresso)' }}>
                  <i className="bi bi-play-circle-fill me-2" style={{ color: 'var(--color-caramelo)' }}></i>Video Tutorial Paso a Paso
                </h4>
                <div className="ratio ratio-16x9 rounded-3 overflow-hidden shadow-sm" style={{ border: '1px solid var(--color-borde)' }}>
                  <iframe
                    src={post.videoUrl}
                    title={post.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            <div className="border-top pt-4 mt-5 text-center" style={{ borderColor: 'var(--color-borde)' }}>
              <Link to="/blogs" className="boton boton-secundario btn-baker">
                ← Volver al Blog & Recetas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}