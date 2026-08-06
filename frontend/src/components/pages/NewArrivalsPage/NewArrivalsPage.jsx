// src/components/pages/NewArrivalsPage/NewArrivalsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../../api';
import { money, getProductDisplayPrice } from '../../../utils/helpers';
import { useWishlist } from '../../../context/WishlistContext';

// Fisher-Yates shuffle — matches original vanilla JS loadNewArrivalPage()
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const categories = ['saree', 'suit', 'maxi', 'jewelry'];
      const results = await Promise.allSettled(
        categories.map((cat) => api.get(`/products/category/${cat}`))
      );

      const combined = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value.data || []);

      setProducts(shuffleArray(combined));
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // FIX: card click now navigates to that specific product's detail page.
  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="page">
        <Helmet>
          <title>New Arrivals | Saud Emporium</title>
          <meta name="description" content="Discover the latest fashion arrivals at Saud Emporium — fresh styles across sarees, suits, maxi dresses, and jewelry." />
        </Helmet>
        <section className="category-hero">
          <div className="category-hero-banner">
            <img
              src="https://img.freepik.com/premium-photo/closeup-colorful-tshirts-hanging-together_1015874-18127.jpg"
              alt="new arrivals"
            />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>TOP QUALITY</span>
              <h1>NEW ARRIVALS</h1>
              <p>Discover premium performance and lifestyle sneakers designed for everyday movement and modern streetwear.</p>
            </div>
          </div>
        </section>
        <section className="products-section">
          <div className="products-skeleton">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <Helmet>
        <title>New Arrivals | Saud Emporium</title>
        <meta name="description" content="Discover the latest fashion arrivals at Saud Emporium — fresh styles across sarees, suits, maxi dresses, and jewelry." />
      </Helmet>
      <section className="category-hero">
        <div className="category-hero-banner">
          <img
            src="https://img.freepik.com/premium-photo/closeup-colorful-tshirts-hanging-together_1015874-18127.jpg"
            alt="new arrivals"
          />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>TOP QUALITY</span>
            <h1>NEW ARRIVALS</h1>
            <p>Discover premium performance and lifestyle sneakers designed for everyday movement and modern streetwear.</p>
          </div>
        </div>
      </section>

      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">New Arrivals</span>
          </nav>
        </div>
      </section>

      <section className="products-section">
        {products.length === 0 ? (
          <p className="empty-state">No new arrivals yet.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="product-card sale-card"
                onClick={() => handleCardClick(product.id)}
              >
                <div className="image-container">
                  <img
                    src={product.image || product.images?.[0] || ''}
                    alt={product.name}
                    className="product-image"
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

export default NewArrivalsPage;