// src/components/pages/Maxi/Maxi.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../../api';
import { money, getProductDisplayPrice } from '../../../utils/helpers';
import { useWishlist } from '../../../context/WishlistContext';

const Maxi = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/category/maxi');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching maxi:', error);
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

  if (loading) {
    return (
      <div className="page">
        <Helmet>
          <title>Maxi Dresses & Long Frocks | Saud Emporium</title>
          <meta name="description" content="Shop graceful maxi dresses and long frocks featuring luxurious fabrics and sophisticated designs at Saud Emporium." />
        </Helmet>
        <section className="category-hero">
          <div className="category-hero-banner">
            <img src="https://cdn.shopify.com/s/files/1/0027/2596/9964/files/US_web_banner.avif?v=1783939563" alt="Maxi" />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>MAXI & LONG FROCKS</span>
              <h1>PREMIUM MAXI COLLECTION</h1>
              <p>Explore graceful maxi dresses and long frocks featuring luxurious fabrics, exquisite embroidery, and sophisticated designs for a timeless look.</p>
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
        <title>Maxi Dresses & Long Frocks | Saud Emporium</title>
        <meta name="description" content="Shop graceful maxi dresses and long frocks featuring luxurious fabrics and sophisticated designs at Saud Emporium." />
      </Helmet>
      <section className="category-hero">
        <div className="category-hero-banner">
          <img src="https://cdn.shopify.com/s/files/1/0027/2596/9964/files/US_web_banner.avif?v=1783939563" alt="Maxi" />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>MAXI & LONG FROCKS</span>
            <h1>PREMIUM MAXI COLLECTION</h1>
            <p>Explore graceful maxi dresses and long frocks featuring luxurious fabrics, exquisite embroidery, and sophisticated designs for a timeless look.</p>
          </div>
        </div>
      </section>

      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">Maxi & Long Frocks</span>
          </nav>
        </div>
      </section>

      <section className="products-section">
        {products.length === 0 ? (
          <p className="empty-state">No products in this collection yet.</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
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
      </section>
    </div>
  );
};

export default Maxi;
