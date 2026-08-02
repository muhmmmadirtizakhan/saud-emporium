import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api';
import { money } from '../../../utils/helpers';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      const images = response.data.images || (response.data.front_image ? [response.data.front_image] : []);
      setMainImage(images[0] || '');
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      alert('Please login first!');
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login first!');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please login first!');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    // Navigate to checkout
  };

  if (loading) {
    return (
      <div className="page">
        <div className="product-skeleton">
          <div className="skeleton-gallery"></div>
          <div className="skeleton-info">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <div className="product-section">
          <p>Product not found</p>
          <Link to="/">Go Home</Link>
        </div>
      </div>
    );
  }

  const images = product.images || (product.front_image ? [product.front_image] : []);
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="page">
      <section className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/${product.category || 'products'}`}>Products</Link>
        <span>/</span>
        <strong>Product Detail</strong>
      </section>

      <section className="product-section">
        <div className="product-container">
          <div className="product-gallery">
            <div className="product-main-image">
              <img id="mainProductImage" src={mainImage} alt={product.heading || product.name} />
            </div>
            {images.length > 1 && (
              <div className="product-thumbnails" id="productThumbnails">
                {images.map((img, i) => (
                  <div 
                    key={i} 
                    className={`product-thumb ${i === 0 ? 'active' : ''}`}
                    onClick={() => setMainImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <div className="product-badge">BEST SELLER</div>
            <h1 className="product-title" id="productPageTitle">
              {product.heading || product.name}
            </h1>

            {product.features && product.features.length > 0 && (
              <ul className="product-highlights" id="productHighlights">
                {product.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}

            <div className="product-price-area">
              <div className="product-price" id="productPagePrice">{money(product.price)}</div>
            </div>

            <div className="product-stock" id="productPageStock">
              {product.stock_status !== 'out_of_stock' ? '● In Stock' : '● Out of Stock'}
            </div>

            {product.color && (
              <div className="product-option-group" id="productColorGroup">
                <h4>Available Colors</h4>
                <div className="product-colors" id="productColors">
                  <div 
                    className={`product-color ${selectedColor === product.color ? 'active' : ''}`} 
                    style={{ background: product.color_hex || '#ccc' }}
                    onClick={() => setSelectedColor(product.color)}
                    title={product.color}
                  ></div>
                </div>
              </div>
            )}

            {product.size && (
              <div className="product-option-group" id="productSizeGroup">
                <h4>Available Sizes</h4>
                <div className="product-sizes" id="productSizes">
                  <button 
                    className={`product-size ${selectedSize === product.size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(product.size)}
                  >
                    {product.size}
                  </button>
                </div>
              </div>
            )}

            <div className="product-option-group">
              <h4>Quantity</h4>
              <div className="product-quantity">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span id="quantityValue">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {product.description && (
              <div className="product-description" id="productPageDescription">
                {product.description}
              </div>
            )}

            <div className="product-actions">
              <button className="add-cart-btn" onClick={handleAddToCart}>Add To Cart</button>
              <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>

            <div className="product-delivery">
              <h4>Free Delivery Available</h4>
              <p>Estimated Delivery: 2–4 Business Days</p>
            </div>

            <div className="product-features">
              <div>✓ Free Shipping</div>
              <div>✓ Secure Checkout</div>
              <div>✓ Easy Returns</div>
              <div>✓ Premium Quality</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;