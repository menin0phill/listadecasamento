import React from 'react';
import { Heart } from 'lucide-react';

const Footer = ({ onAdminClick }) => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-logo">GM</div>
        
        <p className="footer-quote">
          "O amor tudo sofre, tudo crê, tudo espera, tudo suporta."
          <span className="footer-quote-ref">1 Coríntios 13:7</span>
        </p>

        <div className="footer-divider">
          <Heart size={14} className="footer-heart" />
        </div>

        <div className="footer-meta">
          <p>Gabriel & Manoela • 25 de Outubro de 2026</p>
          <button className="footer-admin-btn" onClick={onAdminClick}>
            Área do Casal (Dashboard)
          </button>
        </div>

        <p className="footer-credits">
          Desenvolvido com carinho para Gabriel & Manoela. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
