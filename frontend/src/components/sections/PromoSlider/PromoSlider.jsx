import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PromoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://static.vecteezy.com/system/resources/thumbnails/057/184/608/small/elegant-woman-in-orange-traditional-dress-at-palace-photo.jpg',
      tag: 'CUSTOM DESIGN',
      title: 'THREADS OF YOUR OWN STORY',
      link: '/suits',
      linkText: 'Customize Yours'
    },
    {
      id: 2,
      image: 'https://res.cloudinary.com/fortyfournorth/image/upload/v1710256288/The%20Look%20Company%20(Staging)/j2zi31lqofw1abqfrjux.jpg',
      tag: 'SIGNATURE EDIT',
      title: 'CRAFTED FOR TIMELESS GRACE',
      link: '/jewelry',
      linkText: 'Explore Collection'
    },
    {
      id: 3,
      image: 'https://nishatboutique.com/cdn/shop/articles/long_dresses_for_women.jpg?v=1722579740&width=1200',
      tag: 'LIMITED EDIT',
      title: 'WEAR EVERY MOMENT',
      link: '/maxi',
      linkText: 'Shop Now'
    },
    {
      id: 4,
      image: 'https://koshurindia.com/cdn/shop/articles/Winter_Dress_for_Women.jpg?v=1732044942&width=1200',
      tag: 'NEW ARRIVALS',
      title: 'ELEVATE YOUR WARDROBE',
      link: '/sarees',
      linkText: 'Shop Now'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section className="promo-slider-section">
      <div className="promo-slider">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`promo-slide ${index === currentSlide ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.title} />
            <div className="promo-overlay"></div>
            <div className="promo-content">
              <span>{slide.tag}</span>
              <h2>{slide.title}</h2>
              <Link to={slide.link}>{slide.linkText}</Link>
            </div>
          </div>
        ))}
      </div>
      <button className="promo-prev" onClick={prevSlide}>❮</button>
      <button className="promo-next" onClick={nextSlide}>❯</button>
      <div className="promo-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`promo-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default PromoSlider;