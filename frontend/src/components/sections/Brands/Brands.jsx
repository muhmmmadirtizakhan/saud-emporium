import React from 'react';

const Brands = () => {
  const brands = [
    { id: 1, name: 'Brand 1', logo: 'https://via.placeholder.com/120x40?text=Brand+1' },
    { id: 2, name: 'Brand 2', logo: 'https://via.placeholder.com/120x40?text=Brand+2' },
    { id: 3, name: 'Brand 3', logo: 'https://via.placeholder.com/120x40?text=Brand+3' },
    { id: 4, name: 'Brand 4', logo: 'https://via.placeholder.com/120x40?text=Brand+4' },
    { id: 5, name: 'Brand 5', logo: 'https://via.placeholder.com/120x40?text=Brand+5' },
    { id: 6, name: 'Brand 6', logo: 'https://via.placeholder.com/120x40?text=Brand+6' },
    { id: 7, name: 'Brand 7', logo: 'https://via.placeholder.com/120x40?text=Brand+7' }
  ];

  return (
    <section className="brands-section">
      <div className="brands-wrapper">
        <div className="brands-top">
          <p>LUXURY BRANDS WE CARRY</p>
        </div>
        <div className="brands-container">
          <div className="brands-track">
            {brands.map((brand) => (
              <div key={brand.id} className="brand-item">
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;