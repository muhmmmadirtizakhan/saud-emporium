// src/components/pages/Sarees/Sarees.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../../api';
import { money, getProductDisplayPrice } from '../../../utils/helpers';
import { useWishlist } from '../../../context/WishlistContext';

const Sarees = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // Poll for new products while user is on this page so newly added
    // admin products appear without a hard page refresh.
    const interval = setInterval(() => {
      fetchProducts();
    }, 3000); // every 3s

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/category/saree');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching sarees:', error);
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

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const filters = ['Net', 'Chiffon', 'Silk', 'Sheesha Silk'];

  const parseImages = (images) => {
    if (Array.isArray(images)) return images;
    if (!images) return [];
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [images];
      }
    }
    return [];
  };

  // ✅ FIX: model_image first priority
  const getProductImage = (product) => {
    if (product.model_image) return product.model_image;  // ✅ PRIORITY 1
    if (product.image) return product.image;              // ✅ PRIORITY 2
    const images = parseImages(product.images);
    return images[0] || 'https://via.placeholder.com/300x400?text=No+Image';
  };

  const filteredProducts = selectedFilter
    ? products.filter(p => p.sub_category?.toLowerCase() === selectedFilter.toLowerCase())
    : products;

  if (loading) {
    return (
      <div className="page">
        <Helmet>
          <title>Ladies Sarees Online | Saud Emporium</title>
          <meta name="description" content="Discover exquisite sarees crafted with premium fabrics, intricate detailing, and timeless elegance. Shop the latest saree collection at Saud Emporium." />
        </Helmet>
        <section className="category-hero">
          <div className="category-hero-banner">
            <img 
              src="https://nishatboutique.com/cdn/shop/articles/Untitled_design_7_baeffd74-e8c1-4650-8ff3-1e401fc8edc0.jpg?v=1741081389&width=1200" 
              alt="Sarees" 
            />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>WOMEN'S COLLECTION</span>
              <h1>LADIES SAREE</h1>
              <p>Discover exquisite sarees crafted with premium fabrics, intricate detailing, and timeless elegance for every occasion.</p>
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
        <title>Ladies Sarees Online | Saud Emporium</title>
        <meta name="description" content="Discover exquisite sarees crafted with premium fabrics, intricate detailing, and timeless elegance. Shop the latest saree collection at Saud Emporium." />
      </Helmet>
      {/* ========================= */}
      {/* CATEGORY HERO */}
      {/* ========================= */}
      <section className="category-hero">
        <div className="category-hero-banner">
          <img 
            src="https://nishatboutique.com/cdn/shop/articles/Untitled_design_7_baeffd74-e8c1-4650-8ff3-1e401fc8edc0.jpg?v=1741081389&width=1200" 
            alt="Sarees" 
          />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>WOMEN'S COLLECTION</span>
            <h1>LADIES SAREE</h1>
            <p>Discover exquisite sarees crafted with premium fabrics, intricate detailing, and timeless elegance for every occasion.</p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* BREADCRUMB */}
      {/* ========================= */}
      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">Sarees</span>
          </nav>
        </div>
      </section>

      {/* ========================= */}
      {/* PRODUCTS WITH FILTERS */}
      {/* ========================= */}
      <section className="products-section">
        <div className="shop-layout">
          {/* FILTER SIDEBAR */}
          <aside className="filter-sidebar">
            <h4>Filters</h4>
            <div className="filter-group">
              <h5>Saree Type</h5>
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

          {/* PRODUCTS GRID */}
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
                    {/* ✅ model_image first priority */}
                    <img 
                      src={getProductImage(product)} 
                      alt={product.name} 
                      className="product-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                      }}
                    />
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

export default Sarees;
