import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api';
import { money } from '../../../utils/helpers';
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

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      const response = await api.get('/products/new-arrivals');
      setProducts(response.data || []);
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

  // FIX: New Arrival cards route to their category page (e.g. /suits),
  // not to the individual product detail page — matches intended flow.
  const handleCardClick = (product) => {
    navigate(getCategoryRoute(product.category));
  };

  if (loading) {
    return (
      <section className="newarrival-section">
        <div className="newarrival-header">
          <div className="newarrival-header-text"><h2>NEW ARRIVALS</h2></div>
          <Link to="/new-arrivals" className="view-all-btn">View All</Link>
        </div>
        <div className="newarrival-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="newarrival-skeleton-card"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="newarrival-section">
      <div className="newarrival-header">
        <div className="newarrival-header-text"><h2>NEW ARRIVALS</h2></div>
        <Link to="/new-arrivals" className="view-all-btn">View All</Link>
      </div>
      {products.length === 0 ? (
        <p className="empty-state">No new arrivals yet.</p>
      ) : (
        <div className="best-grid">
          {products.slice(0, 8).map((product) => (
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
                {/* FIX: this schema stores the image URL in `front_image`,
                    not `image` or `images[]` — that's why the picture was
                    missing and only the alt text showed. */}
                <img src={product.image || product.front_image || product.images?.[0] || ''} alt={product.name || product.heading} />
              </div>
              <div className="best-content">
                <small>{product.category || ''}</small>
                <h3>{product.name || product.heading}</h3>
                <div className="best-bottom">
                  <h4>{money(product.price)}</h4>
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

export default NewArrivals;