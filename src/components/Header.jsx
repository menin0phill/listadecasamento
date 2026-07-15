import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import Logo from './Logo';

const Header = ({ onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Monogram Logo */}
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo className="logo-img" />
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-link">Início</button>
          <button onClick={() => scrollToSection('gifts')} className="nav-link">Lista de Presentes</button>
          <button onClick={() => scrollToSection('contribution')} className="nav-link">Contribuição Livre</button>
          <button onClick={onAdminClick} className="nav-link nav-btn-admin">Área do Casal</button>
        </nav>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      {isMenuOpen && (
        <div className="mobile-nav-panel">
          <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }} className="mobile-nav-link">Início</button>
          <button onClick={() => scrollToSection('gifts')} className="mobile-nav-link">Lista de Presentes</button>
          <button onClick={() => scrollToSection('contribution')} className="mobile-nav-link">Contribuição Livre</button>
          <button onClick={() => { onAdminClick(); setIsMenuOpen(false); }} className="mobile-nav-link mobile-admin-link">Área do Casal</button>
        </div>
      )}
    </header>
  );
};

export default Header;
