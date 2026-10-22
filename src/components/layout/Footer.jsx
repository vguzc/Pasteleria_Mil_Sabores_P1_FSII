import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="pie-pagina">
      <div className="contenedor">
        <div className="grilla-footer">
          {/* Columna 1: Marca y Filosofía */}
          <div className="footer-col footer-col-marca">
            <Link to="/" className="logo-footer">
              <img src="/img/logo-ms-caramelo.png" alt="Mil Sabores" className="logo-ms-footer" />
              <div className="logo-textos-footer">
                <span className="logo-marca-footer">Mil Sabores</span>
                <span className="logo-submarca-footer">Pastelería & Café</span>
              </div>
            </Link>
            <p className="footer-desc">
              Celebrando 50 años de tradición dulce en Chile. Elaboramos cada receta desde cero con mantequilla de campo, masas madre e ingredientes nobles.
            </p>
            <div className="footer-social-links" aria-label="Redes sociales oficiales">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-pill social-btn-instagram"
                aria-label="Instagram de Mil Sabores"
                title="Síguenos en Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-pill social-btn-facebook"
                aria-label="Facebook de Mil Sabores"
                title="Síguenos en Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              <a
                href="https://wa.me/56922223344"
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn social-pill social-btn-whatsapp"
                aria-label="WhatsApp de Mil Sabores"
                title="Escríbenos por WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.101-.475-.15-.675.15-.2.299-.775.979-.95 1.178-.175.2-.35.225-.65.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.783-1.675-2.083-.176-.3-.019-.462.131-.611.135-.134.3-.35.45-.525.15-.175.2-.299.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.243-.585-.49-.506-.675-.515-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8.375s-1.05 1.025-1.05 2.5 1.075 2.9 1.225 3.1c.15.2 2.115 3.23 5.125 4.53.716.31 1.275.495 1.71.635.72.23 1.375.197 1.895.12.58-.088 1.78-.727 2.03-1.428.25-.7.25-1.3.175-1.428-.075-.128-.275-.203-.575-.353zM12.04 2C6.51 2 2.015 6.495 2.015 12.025c0 1.95.56 3.77 1.53 5.315L2 22l4.82-1.495c1.485.89 3.22 1.41 5.22 1.41 5.53 0 10.025-4.495 10.025-10.025S17.57 2 12.04 2zm0 18.235c-1.745 0-3.37-.53-4.725-1.445l-.34-.23-2.865.89.905-2.79-.22-.35c-.985-1.57-1.51-3.4-1.51-5.285 0-4.54 3.695-8.235 8.24-8.235 4.54 0 8.235 3.695 8.235 8.235 0 4.54-3.695 8.235-8.235 8.235z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2: Explorar Catálogo Pastelero */}
          <div className="footer-col">
            <h4 className="footer-col-titulo">Catálogo</h4>
            <ul className="footer-links">
              <li><Link to="/productos">Todas las Delicias</Link></li>
              <li><Link to="/productos?categoria=Pastelería%20Tradicional">Pastelería Tradicional</Link></li>
              <li><Link to="/productos?categoria=Productos%20Sin%20Gluten">Línea Sin Gluten</Link></li>
              <li><Link to="/productos?categoria=Tortas%20Cuadradas">Tortas de Celebración</Link></li>
              <li><Link to="/ofertas">Ofertas & Promociones</Link></li>
            </ul>
          </div>

          {/* Columna 3: Conócenos */}
          <div className="footer-col">
            <h4 className="footer-col-titulo">La Pastelería</h4>
            <ul className="footer-links">
              <li><Link to="/nosotros">Nuestra Historia (Desde 1976)</Link></li>
              <li><Link to="/blogs">Blog & Recetas de Taller</Link></li>
              <li><Link to="/contacto">Contacto & Pedidos</Link></li>
              <li><Link to="/login">Mi Cuenta & Descuentos</Link></li>
            </ul>
          </div>

          {/* Columna 4: Taller & Horarios */}
          <div className="footer-col">
            <h4 className="footer-col-titulo">Taller & Café</h4>
            <p className="footer-info-texto">
              <strong>Sede Providencia:</strong><br />
              Antonio Varas 666, Providencia, Santiago.
            </p>
            <p className="footer-info-texto">
              <strong>Horarios de Atención:</strong><br />
              Lunes a Sábado: 09:00 - 20:00 hrs.<br />
              Domingos y Festivos: 10:00 - 18:00 hrs.
            </p>
            <p className="footer-info-texto">
              <strong>Teléfono:</strong> +56 2 2222 3344
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="footer-barra-inferior">
          <div>
            © {new Date().getFullYear()} Pastelería Mil Sabores — Tradición y Repostería Chilena.
          </div>
          <div>
            Desarrollado para Evaluación Parcial N° 2 (DSY1104 Fullstack II - Duoc UC)
          </div>
        </div>
      </div>
    </footer>
  );
}
