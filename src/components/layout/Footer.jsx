import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pie-pagina" style={{ backgroundColor: 'var(--color-chocolate)', color: 'var(--color-fondo)', padding: '3.5rem 0 2rem 0', marginTop: '3rem' }}>
      <div className="contenedor" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', textAlign: 'center', justifyItems: 'center', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Link to="/" className="logo-footer" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/img/logo-ms.png" alt="Mil Sabores" style={{ height: '52px', width: 'auto', marginBottom: '0.6rem' }} />
            <span className="logo-texto-footer">
              Mil Sabores
              <span className="logo-subtexto-footer">Pastelería & Café</span>
            </span>
          </Link>
          <p style={{ fontSize: '0.9rem', opacity: 0.85, maxWidth: '300px', margin: '0 auto', textAlign: 'center', lineHeight: 1.6 }}>
            Celebrando 50 años de tradición endulzando los momentos más especiales de Chile.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Navegación</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2, fontSize: '0.9rem', textAlign: 'center' }}>
            <li><Link to="/productos" style={{ color: 'var(--color-fondo)' }}>Catálogo de Productos</Link></li>
            <li><Link to="/categorias" style={{ color: 'var(--color-fondo)' }}>Categorías</Link></li>
            <li><Link to="/ofertas" style={{ color: 'var(--color-fondo)' }}>Ofertas Especiales</Link></li>
            <li><Link to="/nosotros" style={{ color: 'var(--color-fondo)' }}>Nuestra Historia</Link></li>
            <li><Link to="/blogs" style={{ color: 'var(--color-fondo)' }}>Blog & Recetas</Link></li>
            <li><Link to="/contacto" style={{ color: 'var(--color-fondo)' }}>Contacto & Sedes</Link></li>
          </ul>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Horario & Ubicación</h4>
          <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', textAlign: 'center', fontWeight: 700 }}>Antonio Varas 666, Providencia</p>
          <p style={{ fontSize: '0.88rem', margin: 0, textAlign: 'center', lineHeight: 1.7, opacity: 0.9 }}>
            Lunes a Sábado: 09:00 - 20:00 hrs.<br />Domingos y Festivos: 10:00 - 18:00 hrs.
          </p>
        </div>
      </div>
      <div className="contenedor" style={{ textAlign: 'center', marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: '0.85rem', opacity: 0.85 }}>
        © {new Date().getFullYear()} Pastelería Mil Sabores — Evaluación Parcial N° 2 (Fullstack II - Duoc UC)
      </div>
    </footer>
  );
}
