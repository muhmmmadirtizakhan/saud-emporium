// src/components/pages/Suits/Suits.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api';
import { money } from '../../../utils/helpers';
import { useWishlist } from '../../../context/WishlistContext';

const Suits = () => {
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
      const response = await api.get('/products/category/suits');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching suits:', error);
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

  const filters = ['2 Piece', '3 Piece', 'Lawn', 'Khaddi', 'Chiffon', 'Silk', 'Party Wear'];
  const filteredProducts = selectedFilter
    ? products.filter(p => p.sub_category?.toLowerCase() === selectedFilter.toLowerCase())
    : products;

  if (loading) {
    return (
      <div className="page">
        <section className="category-hero">
          <div className="category-hero-banner">
            <img src="https://www.nishatlinenuae.com/cdn/shop/articles/Unstitched_printed_suits_for_ladies_in_UAE.jpg?v=1719402045&width=1200" alt="Suits" />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>COMFORT</span>
              <h1>ELEGANT WOMEN'S SUITS</h1>
              <p>Explore our exclusive collection of beautifully crafted women's suits, featuring premium fabrics, elegant embroidery, and timeless designs for every occasion.</p>
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
      <section className="category-hero">
        <div className="category-hero-banner">
          <img src="https://www.nishatlinenuae.com/cdn/shop/articles/Unstitched_printed_suits_for_ladies_in_UAE.jpg?v=1719402045&width=1200" alt="Suits" />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>COMFORT</span>
            <h1>ELEGANT WOMEN'S SUITS</h1>
            <p>Explore our exclusive collection of beautifully crafted women's suits, featuring premium fabrics, elegant embroidery, and timeless designs for every occasion.</p>
          </div>
        </div>
      </section>

      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">Suits</span>
          </nav>
        </div>
      </section>

      <section className="products-section">
        <div className="shop-layout">
          <aside className="filter-sidebar">
            <h4>Filters</h4>
            <div className="filter-group">
              <h5>Suit Type</h5>
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
                      <span className="discounted-price">{money(product.price)}</span>
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

export default Suits;