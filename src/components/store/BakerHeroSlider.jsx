import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES_DATA = [
  {
    id: 1,
    image: '/img/slider/slide-1-cafe.png',
    eyebrow: 'Cafetería Mil Sabores • Buen Café, Mil Momentos',
    title: 'El Auténtico Placer de un Buen Café',
    subtitle: 'Granos de especialidad tostados con maestría y repostería artesanal chilena, pensados para acompañar cada rebanada y crear momentos únicos.',
    primaryBtn: { text: 'Ver Catálogo Completo', link: '/productos' },
    secondaryBtn: { text: 'Ofertas Especiales', link: '/ofertas' }
  },
  {
    id: 2,
    image: '/img/slider/slide-2-masa.jpg',
    eyebrow: '50 Años de Oficio & Tradición',
    title: 'Masas Madre & Recetas Hechas a Mano',
    subtitle: 'Desde 1976 preparamos cada receta desde cero en nuestro taller familiar, con mantequilla de campo, fermentación lenta y amor por el detalle.',
    primaryBtn: { text: 'Nuestra Historia', link: '/nosotros' },
    secondaryBtn: { text: 'Catálogo Pastelero', link: '/productos' }
  },
  {
    id: 3,
    image: '/img/slider/slide-3-croissant.jpg',
    eyebrow: 'Bollería & Hojaldres del Día',
    title: 'Croissants Crujientes & Panes Frescos',
    subtitle: 'Capas doradas, textura aireada y el aroma inconfundible que inunda nuestro taller pastelero de Providencia cada amanecer.',
    primaryBtn: { text: 'Ver Bollería & Tortas', link: '/productos' },
    secondaryBtn: { text: 'Explorar Catálogo', link: '/productos' }
  },
  {
    id: 4,
    image: '/img/slider/slide-4-cookies.jpg',
    eyebrow: 'Galletería & Chocolatería Artesanal',
    title: 'Galletas Caseras & Chocolate Belga',
    subtitle: 'Crujientes en los bordes, suaves en el corazón y repletas de chispas de cacao puro seleccionadas para compartir en familia.',
    primaryBtn: { text: 'Ver Especialidades', link: '/productos' },
    secondaryBtn: { text: 'Beneficios 50% OFF', link: '/registro' }
  },
  {
    id: 5,
    image: '/img/slider/slide-5-cinnamon.jpg',
    eyebrow: 'Horneado Diario con Amor',
    title: 'Rollos de Canela con Glaseado Real',
    subtitle: 'Esponjosos espirales con canela aromática, azúcar morena y suave glaseado de vainilla recién salido del horno.',
    primaryBtn: { text: 'Pedir Dulzuras Ahora', link: '/productos' },
    secondaryBtn: { text: 'Ver Promociones', link: '/ofertas' }
  }
];

export default function BakerHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const total = SLIDES_DATA.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Autoplay effect
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  return (
    <section
      className="baker-slider-contenedor"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrusel de bienvenida estilo Baker"
    >
      {/* Diapositivas */}
      {SLIDES_DATA.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`baker-slide ${isActive ? 'baker-slide-activo' : ''}`}
            aria-hidden={!isActive}
          >
            {/* Imagen de Fondo con Zoom Sutil */}
            <div
              className="baker-slide-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Capa de atmósfera cálida con viñeta */}
            <div className="baker-slide-overlay" />

            {/* Contenido Editorial Flotante */}
            <div className="contenedor baker-slide-contenido">
              <div className="baker-slide-caja">
                <span className="baker-slide-eyebrow">
                  {slide.eyebrow}
                </span>

                <h1 className="baker-slide-titulo">
                  {slide.title}
                </h1>

                <div className="adorno-baker-slide" />

                <p className="baker-slide-subtitulo">
                  {slide.subtitle}
                </p>

                <div className="d-flex gap-3 flex-wrap">
                  <Link
                    to={slide.primaryBtn.link}
                    className="boton boton-primario btn-baker-slider"
                  >
                    {slide.primaryBtn.text}
                  </Link>
                  <Link
                    to={slide.secondaryBtn.link}
                    className="boton boton-secundario btn-baker-slider btn-baker-slider-outline"
                  >
                    {slide.secondaryBtn.text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Flechas de Navegación (‹ y ›) */}
      <button
        type="button"
        className="baker-slider-flecha baker-slider-prev"
        onClick={prevSlide}
        aria-label="Diapositiva anterior"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        type="button"
        className="baker-slider-flecha baker-slider-next"
        onClick={nextSlide}
        aria-label="Siguiente diapositiva"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Indicadores / Paginación en la base */}
      <div className="baker-slider-indicadores">
        {SLIDES_DATA.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`baker-slider-punto ${index === current ? 'activo' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          >
            <span className="punto-numero">0{index + 1}</span>
            <span className="punto-barra" />
          </button>
        ))}
      </div>
    </section>
  );
}
