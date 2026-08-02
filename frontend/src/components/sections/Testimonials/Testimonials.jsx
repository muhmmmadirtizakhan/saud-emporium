import React, { useRef } from 'react';

const Testimonials = () => {
  const sliderRef = useRef(null);

  const testimonials = [
    {
      id: 1,
      text: 'The flowy maxi dresses and embroidered suits feel like poetry. Every piece is a masterpiece — soft, elegant, and timeless.',
      name: 'Narmeenmohsin',
      date: '2 days ago',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5
    },
    {
      id: 2,
      text: 'From crisp suits to luxurious maxis — the fabric, the drape, the colors. Absolutely obsessed with the festive collection.',
      name: 'Ramasha Khurram',
      date: '4 days ago',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 5
    },
    {
      id: 3,
      text: 'The handwork on the sarees and maxi dresses is unreal. Pure elegance — I\'ve never felt so graceful in ethnic wear.',
      name: 'Warisha',
      date: '1 week ago',
      image: 'https://randomuser.me/api/portraits/women/33.jpg',
      rating: 5
    },
    {
      id: 4,
      text: 'The fusion of contemporary cuts with traditional embroidery — each suit and maxi tells a story. Absolutely royal.',
      name: 'Sema Rehman',
      date: '2 weeks ago',
      image: 'https://randomuser.me/api/portraits/women/55.jpg',
      rating: 5
    }
  ];

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-top">
        <h2>REVIEWS FROM REAL PEOPLE</h2>
        <div className="testimonials-rating">
          <span>⭐ 4.9/5</span>
          <p>Trustpilot • Based on 3,987 reviews</p>
        </div>
      </div>
      <div className="testimonials-wrapper">
        <div className="testimonials-left">
          <div className="quote-icon">"</div>
          <h3>What Our Customers Are Saying</h3>
          <div className="testimonial-arrows">
            <button onClick={scrollLeft}>←</button>
            <button onClick={scrollRight}>→</button>
          </div>
        </div>
        <div className="testimonials-right">
          <div className="testimonials-slider" ref={sliderRef}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <p>{testimonial.text}</p>
                <div className="testimonial-stars">{renderStars(testimonial.rating)}</div>
                <div className="testimonial-user">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;