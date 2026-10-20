import React from 'react';
import { Link } from 'react-router-dom';

export const BLOG_POSTS = [
  {
    id: '1',
    slug: 'receta-pasteles-belem',
    titulo: 'Receta Tradicional de Pasteles de Belém con Video Tutorial',
    categoria: 'Recetas de Repostería',
    fecha: '15 de Octubre, 2026',
    autor: 'Chef Pastelera María Elena',
    resumen: 'Aprende a preparar los icónicos pasteles de nata portugueses con masa hojaldrada crujiente y suave crema de vainilla dorada.',
    imagen: '/img/pie-de-limon.png',
    videoUrl: 'https://www.youtube.com/embed/6iO1Q3c6h3M',
    contenido: [
      'Los Pasteles de Belém son una de las joyas de la repostería mundial nacidos en el Monasterio de los Jerónimos en Lisboa.',
      'En este tutorial paso a paso te enseñamos a laminar la masa de hojaldre casera y preparar el almíbar aromatizado con canela y limón para lograr el característico quemado superior.'
    ],
    ingredientes: [
      '500g de masa de hojaldre artesanal',
      '500ml de leche entera fresca',
      '6 yemas de huevo de campo',
      '250g de azúcar flor',
      '50g de harina de trigo',
      '1 rama de canela de Ceylán',
      'Cáscara de 1 limón natural'
    ]
  },
  {
    id: '2',
    slug: '50-anos-mil-sabores',
    titulo: '50 Años de Mil Sabores: Medio Siglo de Recetas y Tradición',
    categoria: 'Noticias & Aniversario',
    fecha: '10 de Septiembre, 2026',
    autor: 'Equipo Editorial Mil Sabores',
    resumen: 'Recorremos los momentos más emotivos de nuestras 5 décadas de historia, desde nuestro primer horno en 1976 hasta las nuevas tendencias.',
    imagen: '/img/torta-aniversario.png',
    contenido: [
      'Cumplir 50 años en la industria pastelera no es solo una celebración de longevidad, es el reconocimiento de miles de familias que han confiado sus momentos más felices en nuestras manos.',
      'Hoy miramos al futuro con entusiasmo, integrando nuevas líneas saludables sin gluten y sin azúcar, y manteniendo intacto nuestro compromiso con los sabores que marcaron a generaciones.'
    ]
  }
];

export default function Blogs() {
  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Blog & Recetas</li>
        </ol>
      </nav>

      <div className="text-center mb-5">
        <span className="badge bg-primary px-3 py-2 text-uppercase mb-2">Comunidad Dulce</span>
        <h1 className="fw-bold font-serif display-4 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Blog y Recetas de Pastelería
        </h1>
        <p className="text-muted">Secretos, técnicas de repostería y noticias de nuestra casa pastelera.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {BLOG_POSTS.map((post) => (
          <div key={post.id} className="col-md-6 col-lg-5">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <div className="bg-light text-center p-3" style={{ height: '220px' }}>
                <img
                  src={post.imagen}
                  alt={post.titulo}
                  className="img-fluid h-100 object-fit-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/img/torta-mil-sabores.png';
                  }}
                />
              </div>
              <div className="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between small text-muted mb-2">
                    <span className="badge bg-warning text-dark">{post.categoria}</span>
                    <span>{post.fecha}</span>
                  </div>
                  <h4 className="card-title fw-bold font-serif mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {post.titulo}
                  </h4>
                  <p className="card-text text-muted small mb-4">{post.resumen}</p>
                </div>
                <div>
                  <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm w-100">
                    Leer Artículo Completo <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
