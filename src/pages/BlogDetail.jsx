import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from './Blogs';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find(p => p.id === id || p.slug === id);

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h4>Artículo no encontrado</h4>
        <Link to="/blogs" className="btn btn-primary mt-3">Volver al Blog</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/blogs">Blog</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{post.titulo}</li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mb-3">
            <span className="badge bg-warning text-dark me-2">{post.categoria}</span>
            <span className="text-muted small">{post.fecha} • Por {post.autor}</span>
          </div>

          <h1 className="fw-bold font-serif display-5 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {post.titulo}
          </h1>

          <div className="text-center bg-light p-4 rounded-4 mb-4 shadow-sm">
            <img
              src={post.imagen}
              alt={post.titulo}
              className="img-fluid rounded-3"
              style={{ maxHeight: '350px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/img/torta-mil-sabores.png';
              }}
            />
          </div>

          <div className="lead text-muted mb-4">
            {post.resumen}
          </div>

          {/* Ingredientes si es receta (Blog 1) */}
          {post.ingredientes && (
            <div className="card bg-light border-0 p-4 rounded-4 mb-4">
              <h4 className="fw-bold mb-3 font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
                <i className="bi bi-card-checklist text-primary me-2"></i>Ingredientes Requeridos:
              </h4>
              <ul className="list-group list-group-flush bg-transparent">
                {post.ingredientes.map((ing, i) => (
                  <li key={i} className="list-group-item bg-transparent px-0 py-2 small d-flex align-items-center">
                    <i className="bi bi-check2-circle text-success me-2 fs-5"></i>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contenido en párrafos */}
          <div className="article-body mb-4">
            {post.contenido.map((parrafo, idx) => (
              <p key={idx} className="fs-6 lh-base mb-3">
                {parrafo}
              </p>
            ))}
          </div>

          {/* Video Tutorial embebido de YouTube si existe */}
          {post.videoUrl && (
            <div className="my-5">
              <h4 className="fw-bold mb-3 font-serif" style={{ fontFamily: 'Playfair Display, serif' }}>
                <i className="bi bi-play-circle-fill text-danger me-2"></i>Video Tutorial Paso a Paso
              </h4>
              <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow">
                <iframe
                  src={post.videoUrl}
                  title={post.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center border-top pt-4 mt-5">
            <Link to="/blogs" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>Volver a Noticias y Recetas
            </Link>
            <Link to="/productos" className="btn btn-primary">
              <i className="bi bi-shop me-2"></i>Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
