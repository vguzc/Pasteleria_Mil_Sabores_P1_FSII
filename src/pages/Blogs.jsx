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
    imagen: '/img/pasteles-de-belem.jpg',
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
  },
  {
    id: '3',
    slug: 'secreto-milhojas-crujiente',
    titulo: 'El Secreto del Milhojas Perfecto: Capas Crujientes y Manjar Artesanal',
    categoria: 'Técnicas del Maestro Pastelero',
    fecha: '28 de Septiembre, 2026',
    autor: 'Maestro Pastelero Don Carlos',
    resumen: 'Descubre los tiempos de reposo y la técnica de horneado para lograr hojaldres dorados que conservan su crocancia junto al manjar de campo.',
    imagen: '/img/slider/slide-2-masa.jpg',
    contenido: [
      'La torta milhojas es un emblema de la repostería chilena. El equilibrio entre el dulzor denso del manjar de campo cocido a fuego lento y la delicadeza quebradiza de la masa es un arte que toma años dominar.',
      'En Mil Sabores horneamos cada disco de masa a 200°C con un prensado intermedio para evitar que suba de forma despareja, logrando finísimas láminas crujientes que no se humedecen al rellenar.'
    ],
    ingredientes: [
      '1 kg de harina de fuerza sin polvos',
      '800g de mantequilla pura de campo sin sal',
      '1 kg de manjar blanco artesanal tradicional',
      'Agua fría de glaciar y una pizca de sal marina'
    ]
  }
];

export default function Blogs() {
  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-fondo)' }}>
      <div className="contenedor">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small">
            <li className="breadcrumb-item"><Link to="/" style={{ color: 'var(--color-espresso)' }}>Inicio</Link></li>
            <li className="breadcrumb-item active" aria-current="page" style={{ color: 'var(--color-caramelo)' }}>Blog & Recetas</li>
          </ol>
        </nav>

        <div className="text-center mb-5">
          <span className="seccion-baker-eyebrow">
            Secretos de Nuestros Maestros
          </span>
          <h1 className="seccion-baker-titulo" style={{ fontSize: '2.6rem' }}>
            Blog & Recetas de Pastelería
          </h1>
          <div className="adorno-baker" />
          <p className="seccion-baker-desc">
            Técnicas del maestro pastelero, recetas tradicionales paso a paso y la historia viva de Mil Sabores desde 1976.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="col-12 col-md-6 col-lg-4">
              <article
                className="card h-100 border-0 overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid var(--color-borde)',
                  boxShadow: '0 4px 16px rgba(44, 30, 22, 0.04)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden', backgroundColor: '#FAF7F2' }}>
                  <img
                    src={post.imagen}
                    alt={post.titulo}
                    className="w-100 h-100 object-fit-cover"
                    style={{ transition: 'transform 0.4s ease' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/img/torta-mil-sabores.png';
                    }}
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--color-caramelo)'
                        }}
                      >
                        {post.categoria}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.78rem' }}>{post.fecha}</span>
                    </div>
                    <h3
                      className="card-title fw-bold mb-2"
                      style={{
                        fontFamily: 'var(--fuente-titulos)',
                        fontSize: '1.2rem',
                        color: 'var(--color-espresso)',
                        lineHeight: 1.35
                      }}
                    >
                      {post.titulo}
                    </h3>
                    <p className="card-text text-muted small mb-4" style={{ lineHeight: 1.6 }}>{post.resumen}</p>
                  </div>
                  <div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="boton boton-primario btn-baker w-100 text-center"
                      style={{ fontSize: '0.85rem' }}
                    >
                      Leer Receta Completa →
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
