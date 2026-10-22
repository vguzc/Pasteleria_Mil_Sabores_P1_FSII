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
              <img src="/img/logo-ms.png" alt="Mil Sabores" className="logo-ms-footer" />
              <div className="logo-textos-footer">
                <span className="logo-marca-footer">Mil Sabores</span>
                <span className="logo-submarca-footer">Pastelería & Café</span>
              </div>
            </Link>
            <p className="footer-desc">
              Celebrando 50 años de tradición dulce en Chile. Elaboramos cada receta desde cero con mantequilla de campo, masas madre e ingredientes nobles.
            </p>
            <div className="footer-social-links">
              <span className="social-pill">Instagram</span>
              <span className="social-pill">Facebook</span>
              <span className="social-pill">WhatsApp</span>
            </div>
          </div>

          {/* Columna 2: Explorar Obrador */}
          <div className="footer-col">
            <h4 className="footer-col-titulo">Explorar</h4>
            <ul className="footer-links">
              <li><Link to="/productos">Catálogo Completo</Link></li>
              <li><Link to="/categorias">Nuestras Categorías</Link></li>
              <li><Link to="/ofertas">Ofertas & Promociones</Link></li>
              <li><Link to="/categoria/Especial%2018">Especial Fiestas Patrias</Link></li>
              <li><Link to="/categoria/Sin%20Gluten">Línea Sin Gluten</Link></li>
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
