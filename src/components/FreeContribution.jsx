import React, { useState } from 'react';
import { Copy, Check, Heart } from 'lucide-react';

const FreeContribution = () => {
  const [copied, setCopied] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [showPixInfo, setShowPixInfo] = useState(false);

  const handleCopyPix = () => {
    const pixKey = "pix@gabrielemanoela2026.com.br";
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShowPix = (e) => {
    e.preventDefault();
    setShowPixInfo(true);
  };

  return (
    <section id="contribution" className="contribution-section">
      <div className="contribution-container glass-effect">
        <div className="contribution-header">
          <Heart size={32} className="contribution-heart-icon" />
          <span className="section-subtitle">CONTRIBUIÇÃO LIVRE</span>
          <h2 className="section-title-alt">Deseja nos presentear com um valor livre?</h2>
          <p className="contribution-desc">
            Se preferir fazer uma contribuição espontânea de qualquer valor para nos ajudar em nossa lua de mel ou na montagem do nosso novo lar, sinta-se à vontade! Qualquer quantia será recebida com imensa gratidão e carinho.
          </p>
        </div>

        {!showPixInfo ? (
          <form onSubmit={handleShowPix} className="contribution-form">
            <div className="input-value-wrapper">
              <span className="currency-prefix">R$</span>
              <input 
                type="number"
                placeholder="Digite um valor (Ex: 150)"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                min="1"
                step="any"
                className="contribution-value-input"
              />
            </div>
            
            <button type="submit" className="contribution-submit-btn">
              Ver chave Pix
            </button>
          </form>
        ) : (
          <div className="contribution-pix-details animate-fade-in">
            {customValue && (
              <div className="contribution-amount-display">
                Valor escolhido: <strong>R$ {parseFloat(customValue).toFixed(2).replace('.', ',')}</strong>
              </div>
            )}
            
            <div className="pix-box-wide">
              <div className="pix-info-wide">
                <span className="pix-key-label">Chave PIX (E-mail):</span>
                <span className="pix-key-val">pix@gabrielemanoela2026.com.br</span>
              </div>
              <button className="pix-copy-btn-wide" onClick={handleCopyPix}>
                {copied ? <Check size={18} color="green" /> : <Copy size={18} />}
                <span>{copied ? "Copiado!" : "Copiar Chave Pix"}</span>
              </button>
            </div>

            <div className="qr-code-placeholder-wide">
              <div className="qr-code-box">
                <div className="qr-grid">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`qr-dot ${i % 4 === 1 || i % 5 === 0 ? 'active' : ''}`} />
                  ))}
                </div>
              </div>
              <span className="qr-code-caption">Abra o app do seu banco e aponte a câmera para o QR Code</span>
            </div>

            <button onClick={() => { setShowPixInfo(false); setCustomValue(""); }} className="contribution-reset-btn">
              Voltar / Escolher outro valor
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FreeContribution;
