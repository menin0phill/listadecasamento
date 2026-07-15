import React, { useState } from 'react';
import { Search, Gift, Copy, Check, ExternalLink, X } from 'lucide-react';

const GiftList = ({ gifts, onReserveGift }) => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);
  
  // Guest Form State
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  // Extract unique categories
  const categories = ["Todos", ...new Set(gifts.map(g => g.category))];

  // Filter gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesCategory = selectedCategory === "Todos" || gift.category === selectedCategory;
    const matchesSearch = gift.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          gift.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenReserveModal = (gift) => {
    if (gift.reserved) return;
    setSelectedGift(gift);
    setGuestName("");
    setGuestMessage("");
    setCopied(false);
  };

  const handleCopyPix = () => {
    const pixKey = "pix@gabrielemanoela2026.com.br"; // Example PIX key
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert("Por favor, insira o seu nome.");
      return;
    }

    onReserveGift(selectedGift.id, guestName, guestMessage);
    setSelectedGift(null);
    setIsSuccessModal(true);
  };

  return (
    <section id="gifts" className="gifts-section">
      <div className="section-header">
        <span className="section-subtitle">ESCOLHA UMA LEMBRANÇA</span>
        <h2 className="section-title">Lista de Presentes</h2>
        <div className="section-title-line" />
        <p className="section-intro">
          Sua presença já é o nosso maior presente. Mas, se quiser nos presentear, preparamos esta lista com muito carinho. Você pode optar por comprar o produto ou fazer um PIX no valor sugerido.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar-container">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Procurar presente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Gifts Grid */}
      <div className="gifts-grid">
        {filteredGifts.length > 0 ? (
          filteredGifts.map(gift => (
            <div key={gift.id} className={`gift-card ${gift.reserved ? 'gift-reserved' : ''}`}>
              <div className="gift-card-img-container">
                <img src={gift.image} alt={gift.title} className="gift-card-img" />
                <span className="gift-card-category">{gift.category}</span>
                {gift.reserved && (
                  <div className="reserved-overlay">
                    <span className="reserved-badge">Reservado por um convidado</span>
                  </div>
                )}
              </div>

              <div className="gift-card-content">
                <h3 className="gift-card-title">{gift.title}</h3>
                <p className="gift-card-desc">{gift.description}</p>
                
                <div className="gift-card-footer">
                  <div className="gift-price-container">
                    <span className="gift-price-label">Valor Sugerido</span>
                    <span className="gift-price">
                      {gift.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  
                  <div className="gift-actions">
                    <button 
                      onClick={() => handleOpenReserveModal(gift)}
                      disabled={gift.reserved}
                      className={`gift-btn-reserve ${gift.reserved ? 'disabled' : ''}`}
                    >
                      {gift.reserved ? 'Reservado' : 'Presentear'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-gifts-found">
            <Gift size={48} className="no-gifts-icon" />
            <p>Nenhum presente encontrado para a sua busca.</p>
          </div>
        )}
      </div>

      {/* Modal - Reserve Gift Flow */}
      {selectedGift && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect">
            <button className="modal-close-btn" onClick={() => setSelectedGift(null)}>
              <X size={20} />
            </button>

            <h3 className="modal-title">Presentear o Casal</h3>
            <div className="modal-gift-summary">
              <img src={selectedGift.image} alt={selectedGift.title} className="modal-gift-img" />
              <div>
                <h4>{selectedGift.title}</h4>
                <p className="modal-gift-price">
                  {selectedGift.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            </div>

            <div className="modal-steps-container">
              <div className="modal-step">
                <span className="step-num">1</span>
                <div>
                  <h5>Contribuição por PIX (Recomendado)</h5>
                  <p className="step-desc">Facilite e contribua diretamente no valor sugerido de {selectedGift.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.</p>
                  
                  <div className="pix-key-box">
                    <div className="pix-key-info">
                      <span className="pix-key-label">Chave PIX (E-mail):</span>
                      <span className="pix-key-value">pix@gabrielemanoela2026.com.br</span>
                    </div>
                    <button className="pix-copy-btn" onClick={handleCopyPix}>
                      {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
                      <span>{copied ? "Copiado" : "Copiar Chave"}</span>
                    </button>
                  </div>
                  
                  {/* Visual QR Code Mock */}
                  <div className="qr-code-placeholder">
                    <div className="qr-code-box">
                      {/* Simulating QR code lines */}
                      <div className="qr-grid">
                        {[...Array(16)].map((_, i) => (
                          <div key={i} className={`qr-dot ${i % 3 === 0 || i % 7 === 0 ? 'active' : ''}`} />
                        ))}
                      </div>
                    </div>
                    <span>Escaneie com o app do seu banco</span>
                  </div>
                </div>
              </div>

              <div className="modal-step">
                <span className="step-num">2</span>
                <div>
                  <h5>Ou Compre na Loja de sua Preferência</h5>
                  <p className="step-desc">Se preferir comprar fisicamente e nos entregar, clique abaixo para ver um link de referência (se disponível):</p>
                  <a 
                    href="https://www.google.com/search?tbm=shop&q=comprar+presente" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="shop-link-btn"
                  >
                    <span>Ver produto na internet</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="modal-step border-none">
                <span className="step-num">3</span>
                <div>
                  <h5>Confirme sua Escolha</h5>
                  <p className="step-desc">Preencha seus dados abaixo para retirarmos este presente da lista e evitarmos presentes duplicados!</p>
                  
                  <form onSubmit={handleConfirmReservation} className="reservation-form">
                    <div className="form-group">
                      <label htmlFor="guest-name">Seu Nome Completo *</label>
                      <input 
                        type="text" 
                        id="guest-name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Ex: Maria Souza"
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="guest-msg">Mensagem para os Noivos (Opcional)</label>
                      <textarea 
                        id="guest-msg"
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Ex: Gabriel e Manoela, desejamos toda a felicidade do mundo nessa nova caminhada..."
                        rows="3"
                        className="form-textarea"
                      />
                    </div>

                    <button type="submit" className="form-submit-btn">
                      Confirmar que Comprei / Presenteei
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal text-center glass-effect">
            <div className="success-heart-icon">❤</div>
            <h3 className="modal-title">Muito Obrigado!</h3>
            <p className="success-msg">
              Sua escolha foi confirmada e salva com sucesso. O casal Gabriel e Manoela já foi notificado da sua generosidade.
            </p>
            <button className="form-submit-btn" onClick={() => setIsSuccessModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GiftList;
