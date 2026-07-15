import React, { useState } from 'react';
import { Shield, Plus, Trash2, RotateCcw, LogOut, DollarSign, Gift, CheckCircle, BarChart3, X } from 'lucide-react';

const Dashboard = ({ gifts, onResetGift, onRemoveGift, onAddGift, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Form State for Adding Gift
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Cozinha");
  const [newPrice, setNewPrice] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Setting simple password
    if (password === "gm2026" || password === "admin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Senha incorreta. Tente novamente.");
    }
  };

  const handleAddGiftSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice) {
      alert("Por favor, preencha o título e o valor do presente.");
      return;
    }

    // Default image if none provided
    const defaultImages = {
      Cozinha: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=60",
      Quarto: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&auto=format&fit=crop&q=60",
      Mesa: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60",
      Sala: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60",
      Banheiro: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60"
    };

    const finalImage = newImage.trim() || defaultImages[newCategory] || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=60";

    const newItem = {
      title: newTitle,
      category: newCategory,
      price: parseFloat(newPrice),
      description: newDesc || "Lembrança muito especial para o casal.",
      image: finalImage
    };

    onAddGift(newItem);

    // Clear form
    setNewTitle("");
    setNewPrice("");
    setNewDesc("");
    setNewImage("");
    alert("Presente adicionado com sucesso!");
  };

  // Calculate statistics
  const totalGifts = gifts.length;
  const reservedGifts = gifts.filter(g => g.reserved);
  const totalReservedCount = reservedGifts.length;
  const percentReserved = totalGifts > 0 ? Math.round((totalReservedCount / totalGifts) * 100) : 0;
  const totalValueReserved = reservedGifts.reduce((acc, g) => acc + g.price, 0);

  if (!isAuthenticated) {
    return (
      <div className="modal-overlay">
        <div className="modal-content admin-login-card glass-effect">
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className="admin-login-header">
            <Shield size={36} className="admin-shield-icon" />
            <h3>Área do Casal</h3>
            <p>Insira a senha de acesso para gerenciar seus presentes.</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-password">Senha de Acesso</label>
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha (Dica: gm2026)"
                required
                className="form-input"
                autoFocus
              />
            </div>

            {loginError && <p className="login-error-msg">{loginError}</p>}

            <button type="submit" className="form-submit-btn">
              Entrar no Painel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overlay">
      <div className="dashboard-container">
        
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-area">
            <h2>Painel de Controle do Casal</h2>
            <p>Gerencie a lista de presentes de Gabriel & Manoela</p>
          </div>
          <div className="dashboard-action-btns">
            <button className="dashboard-logout-btn" onClick={() => setIsAuthenticated(false)}>
              <LogOut size={16} />
              <span>Sair</span>
            </button>
            <button className="dashboard-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Statistics Widgets */}
        <div className="stats-grid">
          <div className="stat-card glass-effect">
            <div className="stat-header">
              <Gift size={24} className="stat-icon-gifts" />
              <span>Total de Itens</span>
            </div>
            <span className="stat-value">{totalGifts}</span>
          </div>

          <div className="stat-card glass-effect">
            <div className="stat-header">
              <CheckCircle size={24} className="stat-icon-reserved" />
              <span>Reservados</span>
            </div>
            <span className="stat-value">
              {totalReservedCount} <small>({percentReserved}%)</small>
            </span>
            <div className="stat-progress-bar-bg">
              <div className="stat-progress-bar-fill" style={{ width: `${percentReserved}%` }} />
            </div>
          </div>

          <div className="stat-card glass-effect">
            <div className="stat-header">
              <DollarSign size={24} className="stat-icon-value" />
              <span>Valor Reservado</span>
            </div>
            <span className="stat-value">
              {totalValueReserved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        </div>

        {/* Dashboard Content split into Add Gift Form & List of Gifts */}
        <div className="dashboard-content-grid">
          
          {/* Add Gift Section */}
          <div className="dashboard-panel-card glass-effect">
            <h3 className="panel-card-title">
              <Plus size={18} />
              <span>Adicionar Novo Presente</span>
            </h3>
            
            <form onSubmit={handleAddGiftSubmit} className="add-gift-form">
              <div className="form-group">
                <label>Nome do Presente *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Cafeteira Stand Mixer"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Categoria</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Cozinha">Cozinha</option>
                    <option value="Quarto">Quarto</option>
                    <option value="Sala">Sala</option>
                    <option value="Mesa">Mesa</option>
                    <option value="Banheiro">Banheiro</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Preço Sugerido (R$) *</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Ex: 699.00"
                    min="1"
                    step="any"
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição do Item</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Ex: Modelo de alta precisão 19 bar."
                  rows="3"
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Link da Imagem (Opcional)</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Deixe em branco para usar imagem padrão da categoria"
                  className="form-input"
                />
              </div>

              <button type="submit" className="add-gift-submit-btn">
                Salvar Presente na Lista
              </button>
            </form>
          </div>

          {/* Manage Gifts Section */}
          <div className="dashboard-panel-card glass-effect flex-2">
            <h3 className="panel-card-title">
              <BarChart3 size={18} />
              <span>Gerenciar Presentes da Lista</span>
            </h3>

            <div className="table-responsive">
              <table className="gifts-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Status / Comprador</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {gifts.map(gift => (
                    <tr key={gift.id} className={gift.reserved ? 'row-reserved' : ''}>
                      <td>
                        <div className="table-item-info">
                          <img src={gift.image} alt={gift.title} className="table-item-img" />
                          <div>
                            <span className="table-item-title">{gift.title}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge-cat">{gift.category}</span></td>
                      <td>{gift.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                      <td>
                        {gift.reserved ? (
                          <div className="table-buyer-info">
                            <span className="buyer-tag">Reservado por: {gift.reservedBy}</span>
                            {gift.message && (
                              <span className="buyer-msg" title={gift.message}>
                                "{gift.message}"
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="status-available-tag">Disponível</span>
                        )}
                      </td>
                      <td>
                        <div className="table-actions">
                          {gift.reserved && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja resetar o presente "${gift.title}" para ficar disponível novamente?`)) {
                                  onResetGift(gift.id);
                                }
                              }}
                              className="action-btn btn-reset"
                              title="Resetar Reserva"
                            >
                              <RotateCcw size={14} />
                              <span>Resetar</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm(`Tem certeza que deseja remover o presente "${gift.title}" permanentemente?`)) {
                                onRemoveGift(gift.id);
                              }
                            }}
                            className="action-btn btn-delete"
                            title="Remover Item"
                          >
                            <Trash2 size={14} />
                            <span>Remover</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {gifts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Nenhum presente cadastrado na lista.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
