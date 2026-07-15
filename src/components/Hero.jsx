import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';

const Hero = () => {
  // We'll set the wedding date to Oct 25, 2026, to demonstrate the countdown live.
  // If the user wants 2025, they can see the completed state. Let's make it dynamic.
  const weddingDate = new Date('2026-10-25T16:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isCelebrated, setIsCelebrated] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference <= 0) {
        setIsCelebrated(true);
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime(); // initial run

    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleScrollToGifts = () => {
    document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section">
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-subtitle">LISTA DE PRESENTES DE</span>
        
        <h1 className="hero-names">
          Gabriel <span className="hero-ampersand">&</span> Manoela
        </h1>

        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span className="hero-divider-heart">❤</span>
          <span className="hero-divider-line" />
        </div>

        <div className="hero-info">
          <div className="hero-info-item">
            <Calendar size={18} className="hero-info-icon" />
            <span>25 de Outubro de 2026</span>
          </div>
          <div className="hero-info-item">
            <MapPin size={18} className="hero-info-icon" />
            <span>Gramado, RS</span>
          </div>
        </div>

        {/* Elegant Countdown Timer */}
        {!isCelebrated ? (
          <div className="countdown-container">
            <div className="countdown-box">
              <span className="countdown-num">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="countdown-label">dias</span>
            </div>
            <div className="countdown-colon">:</div>
            <div className="countdown-box">
              <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="countdown-label">horas</span>
            </div>
            <div className="countdown-colon">:</div>
            <div className="countdown-box">
              <span className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="countdown-label">min</span>
            </div>
            <div className="countdown-colon">:</div>
            <div className="countdown-box">
              <span className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="countdown-label">seg</span>
            </div>
          </div>
        ) : (
          <div className="celebration-msg">
            <h2>O Grande Dia Chegou! ❤</h2>
            <p>Sejam bem-vindos ao início do nosso felizes para sempre.</p>
          </div>
        )}

        <button className="scroll-down-btn" onClick={handleScrollToGifts} aria-label="Ver mais">
          <ChevronDown size={28} className="scroll-arrow" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
