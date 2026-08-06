// src/components/pages/Jewelry/Jewelry.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../../api';
import { money, getProductDisplayPrice } from '../../../utils/helpers';
import { useWishlist } from '../../../context/WishlistContext';

const Jewelry = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/category/jewelry');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching jewelry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // FIX: card click now navigates to the product detail page.
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filters = ['Earrings', 'Necklace', 'Rings', 'Bracelet', 'Anklets', 'Pendants', 'Brooches'];
  const filteredProducts = selectedFilter
    ? products.filter(p => p.sub_category?.toLowerCase() === selectedFilter.toLowerCase())
    : products;

  if (loading) {
    return (
      <div className="page">
        <Helmet>
          <title>Ladies Jewelry Collection | Saud Emporium</title>
          <meta name="description" content="Elevate your style with handcrafted jewelry blending timeless beauty with contemporary design at Saud Emporium." />
        </Helmet>
        <section className="category-hero">
          <div className="category-hero-banner">
            <img src="https://hips.hearstapps.com/hmg-prod/images/fc96bb75-dd84-4373-971e-4124fd911998.jpg?crop=1xw:0.4xh;0xw,0.296xh&resize=1200:*" alt="Jewelry" />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>EXCLUSIVE BRANDS</span>
              <h1>SHINE WITH ELEGANCE</h1>
              <p>Elevate your style with handcrafted jewelry that blends timeless beauty with contemporary design. Discover pieces made to inspire confidence and sophistication.</p>
            </div>
          </div>
        </section>
        <section className="products-section">
          <div className="products-skeleton">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton-card"></div>)}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <Helmet>
        <title>Ladies Jewelry Collection | Saud Emporium</title>
        <meta name="description" content="Elevate your style with handcrafted jewelry blending timeless beauty with contemporary design at Saud Emporium." />
      </Helmet>
      <section className="category-hero">
        <div className="category-hero-banner">
          <img src="https://hips.hearstapps.com/hmg-prod/images/fc96bb75-dd84-4373-971e-4124fd911998.jpg?crop=1xw:0.4xh;0xw,0.296xh&resize=1200:*" alt="Jewelry" />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>EXCLUSIVE BRANDS</span>
            <h1>SHINE WITH ELEGANCE</h1>
            <p>Elevate your style with handcrafted jewelry that blends timeless beauty with contemporary design. Discover pieces made to inspire confidence and sophistication.</p>
          </div>
        </div>
      </section>

      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">Jewelry</span>
          </nav>
        </div>
      </section>

      <section className="products-section">
        <div className="shop-layout">
          <aside className="filter-sidebar">
            <h4>Filters</h4>
            <div className="filter-group">
              <h5>Jewelry Type</h5>
              {filters.map(filter => (
                <div key={filter} className="filter-option">
                  <input 
                    type="checkbox" 
                    id={filter} 
                    checked={selectedFilter === filter}
                    onChange={() => setSelectedFilter(selectedFilter === filter ? null : filter)}
                  />
                  <label htmlFor={filter}>{filter}</label>
                </div>
              ))}
            </div>
          </aside>

          {filteredProducts.length === 0 ? (
            <p className="empty-state">No products in this collection yet.</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="product-card sale-card"
                  onClick={() => handleCardClick(product.id)}
                >
                  <div className="image-container">
                    <img src={product.image || product.images?.[0] || ''} alt={product.name} className="product-image" />
                    <div 
                      className={`heart ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => handleWishlist(e, product)}
                    >
                      <i className="fas fa-heart"></i>
                    </div>
                  </div>
                  <div className="product-details">
                    <h3 className="product-title">{product.name}</h3>
                    <div className="price-container">
                      <span className="discounted-price">{money(getProductDisplayPrice(product))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jewelry;