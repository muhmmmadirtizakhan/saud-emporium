import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api';
import { money, getProductDisplayPrice } from '../../../utils/helpers';
import { useWishlist } from '../../../context/WishlistContext';

// Maps a product's category string to its category page route.
// Mirrors the original vanilla JS goToCategoryPage() mapping.
const categoryRouteMap = {
  saree: '/sarees',
  sarees: '/sarees',
  suit: '/suits',
  suits: '/suits',
  maxi: '/maxi',
  'maxi dress': '/maxi',
  jewelry: '/jewelry',
  jewellery: '/jewelry',
};

const getCategoryRoute = (category) => {
  const normalized = (category || '').toLowerCase().trim();
  return categoryRouteMap[normalized] || '/sarees';
};

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await api.get('/products/bestsellers');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching bestsellers:', error);
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

  // FIX: Best Seller cards route to their category page (e.g. /sarees),
  // not to the individual product detail page — matches intended flow.
  const handleCardClick = (product) => {
    navigate(getCategoryRoute(product.category));
  };

  if (loading) {
    return (
      <section className="best-sellers-section">
        <div className="best-header">
          <div className="best-header-text"><h2>BEST SELLERS</h2></div>
          <Link to="/sarees" className="view-all-btn">View All</Link>
        </div>
        <div className="best-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="best-skeleton-card"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="best-sellers-section">
      <div className="best-header">
        <div className="best-header-text"><h2>BEST SELLERS</h2></div>
        <Link to="/sarees" className="view-all-btn">View All</Link>
      </div>
      {products.length === 0 ? (
        <p className="empty-state">No best sellers yet.</p>
      ) : (
        <div className="best-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="best-card"
              onClick={() => handleCardClick(product)}
            >
              <div
                className={`heart ${isInWishlist(product.id) ? 'active' : ''}`}
                onClick={(e) => handleWishlist(e, product)}
              >
                <i className="fas fa-heart"></i>
              </div>
              <div className="best-image">
                <img src={product.front_image || product.images?.[0] || ''} alt={product.heading || product.name} />
              </div>
              <div className="best-content">
                <small>{product.small_label || ''}</small>
                <h3>{product.heading || product.name}</h3>
                <div className="best-bottom">
                  <h4>{money(getProductDisplayPrice(product))}</h4>
                  <button className="view-btn">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BestSellers;