import React, { useState, useEffect } from 'react';
import Background3D from './components/Background3D';
import Header from './components/Header';
import Hero from './components/Hero';
import GiftList from './components/GiftList';
import FreeContribution from './components/FreeContribution';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import { initialGifts } from './data/initialGifts';

function App() {
  const [gifts, setGifts] = useState(() => {
    const saved = localStorage.getItem('wedding_gifts_gm');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar do localStorage, usando inicial.", e);
      }
    }
    return initialGifts;
  });

  const [showAdmin, setShowAdmin] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wedding_gifts_gm', JSON.stringify(gifts));
  }, [gifts]);

  // Handler: Reserve a Gift
  const handleReserveGift = (id, guestName, message) => {
    setGifts(prevGifts => 
      prevGifts.map(gift => 
        gift.id === id 
          ? { ...gift, reserved: true, reservedBy: guestName, message: message }
          : gift
      )
    );
  };

  // Handler: Reset a Gift (Make it available again)
  const handleResetGift = (id) => {
    setGifts(prevGifts =>
      prevGifts.map(gift =>
        gift.id === id
          ? { ...gift, reserved: false, reservedBy: '', message: '' }
          : gift
      )
    );
  };

  // Handler: Remove Gift from List
  const handleRemoveGift = (id) => {
    setGifts(prevGifts => prevGifts.filter(gift => gift.id !== id));
  };

  // Handler: Add New Gift
  const handleAddGift = (newGift) => {
    setGifts(prevGifts => {
      // Find max ID to prevent collisions
      const maxId = prevGifts.reduce((max, gift) => gift.id > max ? gift.id : max, 0);
      const giftToAdd = {
        ...newGift,
        id: maxId + 1,
        reserved: false,
        reservedBy: '',
        message: ''
      };
      return [...prevGifts, giftToAdd];
    });
  };

  return (
    <>
      {/* 3D Moving Canvas Background */}
      <Background3D />

      {/* Main Layout */}
      <Header onAdminClick={() => setShowAdmin(true)} />
      <Hero />
      
      <main>
        {/* Gift List Grid with Filters */}
        <GiftList gifts={gifts} onReserveGift={handleReserveGift} />
        
        {/* Free Custom Contribution Section */}
        <FreeContribution />
      </main>

      <Footer onAdminClick={() => setShowAdmin(true)} />

      {/* Admin Dashboard Drawer/Modal */}
      {showAdmin && (
        <Dashboard
          gifts={gifts}
          onResetGift={handleResetGift}
          onRemoveGift={handleRemoveGift}
          onAddGift={handleAddGift}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </>
  );
}

export default App;
