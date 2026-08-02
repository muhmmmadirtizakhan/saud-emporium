import React from 'react';


const WhatsAppButton = () => {
  const phoneNumber = '923332836899'; // 333 2836899
  const message = 'Hi! I have a question about your products.';

  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="whatsapp-float" onClick={handleClick}>
      <i className="fab fa-whatsapp"></i>
      <span className="whatsapp-tooltip">Chat with us!</span>
    </div>
  );
};

export default WhatsAppButton;