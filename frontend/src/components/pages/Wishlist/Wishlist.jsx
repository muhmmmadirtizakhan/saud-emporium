// src/components/pages/Wishlist/Wishlist.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../../context/WishlistContext';
import { money } from '../../../utils/helpers';

const Wishlist = () => {
  const { items, fetchWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ✅ Get product image with priority: model_image > product_image
  const getProductImage = (item) => {
    if (item.model_image) return item.model_image;
    if (item.product_image) return item.product_image;
    if (item.image) return item.image;
    return 'https://via.placeholder.com/300x400?text=No+Image';
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <section className="category-hero">
          <div className="category-hero-banner">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/059/145/924/small/vibrant-fashion-sale-banner-design-for-seasonal-store-promotions-photo.jpg" alt="Wishlist" />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>SAVED FOR YOU</span>
              <h1>YOUR WISHLIST</h1>
              <p>All the pieces you've fallen in love with, saved in one place — ready whenever you are.</p>
            </div>
          </div>
        </section>
        <section className="breadcrumb-section">
          <div className="breadcrumb-container">
            <nav className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span className="active">Wishlist</span>
            </nav>
          </div>
        </section>
        <div className="wishlist-section">
          <div className="empty-state" style={{textAlign: 'center', padding: '80px 20px'}}>
            No items in your wishlist yet ❤️
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="category-hero">
        <div className="category-hero-banner">
          <img src="https://static.vecteezy.com/system/resources/thumbnails/059/145/924/small/vibrant-fashion-sale-banner-design-for-seasonal-store-promotions-photo.jpg" alt="Wishlist" />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>SAVED FOR YOU</span>
            <h1>YOUR WISHLIST</h1>
            <p>All the pieces you've fallen in love with, saved in one place — ready whenever you are.</p>
          </div>
        </div>
      </section>

      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">Wishlist</span>
          </nav>
        </div>
      </section>

      <section className="wishlist-section">
        <div className="products-grid">
          {items.map(item => (
            <div key={item.id} className="product-card sale-card">
              <div className="image-container">
                {/* ✅ model_image first priority */}
                <img 
                  src={getProductImage(item)} 
                  alt={item.product_name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div 
                  className="heart active" 
                  onClick={() => removeFromWishlist(item.product_id)}
                >
                  <i className="fas fa-times"></i>
                </div>
              </div>
              <div className="product-details">
                <h3 className="product-title">{item.product_name}</h3>
                <div className="price-container">
                  <span className="discounted-price">{money(item.product_price)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
