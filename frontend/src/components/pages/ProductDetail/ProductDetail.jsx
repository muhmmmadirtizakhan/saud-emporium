import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api';
import { money, getProductDisplayPrice, getProductVariantType, getVariantDisplayName } from '../../../utils/helpers';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useAuth } from '../../../context/AuthContext';
import Toast from '../../common/Toast/Toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState('');
  
  // ✅ VARIANT SWITCH STATE
  const [activeVariant, setActiveVariant] = useState('unstitched');
  
  // ✅ COLOR VARIANT STATE
  const [colorVariants, setColorVariants] = useState([]);
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [toast, setToast] = useState(null);

  // ✅ Check if product is jewelry
  const isJewelry = () => {
    return product?.category?.toLowerCase() === 'jewelry' || 
           product?.category?.toLowerCase() === 'jewellery';
  };

  // ✅ Get variant type from DB
  const getVariant = () => {
    return getProductVariantType(product);
  };

  const getAvailableVariants = () => {
    const variantType = getVariant();
    if (variantType === 'both') return ['unstitched', 'stitched'];
    if (variantType === 'stitched') return ['stitched'];
    return ['unstitched'];
  };

  // ✅ HELPER: Normalize array from JSON string or array
  const normalizeArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (!raw) return [];
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // ✅ SIMPLE getVariantData — BAS YAHI CHANGE HAI
  const getVariantData = () => {
    if (!product) return { price: 0, features: [], size: null, description: '' };

    const jewelrySize = product.size || (Array.isArray(product.sizes) ? product.sizes.join(', ') : null);
    const sizeForJewelry = isJewelry() ? jewelrySize : null;

    // ✅ Normalize both features arrays
    const unstitchedFeatures = normalizeArray(product.unstitched_features);
    const stitchedFeatures = normalizeArray(product.features);

    if (activeVariant === 'unstitched') {
      return {
        price: Number(product.unstitched_price ?? product.price ?? 0),
        features: unstitchedFeatures.length > 0 ? unstitchedFeatures : stitchedFeatures,
        description: product.description || '',
        size: sizeForJewelry,
        label: 'Unstitched'
      };
    }

    return {
      price: Number(product.price ?? product.unstitched_price ?? 0),
      features: stitchedFeatures,
      description: product.description || '',
      size: isJewelry() ? jewelrySize : product.size,
      label: 'Stitched'
    };
  };

  const getSizeDisplay = () => {
    const variantData = getVariantData();
    if (!variantData.size) return null;
    if (isJewelry()) {
      return variantData.size.split(',').map(s => s.trim());
    }
    return [variantData.size];
  };

  const shouldShowSize = () => {
    if (!product) return false;
    if (isJewelry()) return true;
    return activeVariant === 'stitched';
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const normalizeImages = (images) => {
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

  const normalizeColorVariants = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (!raw) return [];
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      const productData = response.data;
      setProduct(productData);
      
      const images = normalizeImages(productData.images) || (productData.front_image ? [productData.front_image] : []);
      
      const variants = normalizeColorVariants(productData.color_variants);
      setColorVariants(variants);
      
      if (variants.length > 0) {
        setSelectedColorVariant(variants[0]);
        setMainImage(variants[0].image || images[0] || '');
      } else {
        setMainImage(images[0] || '');
      }
      
      const variantType = getProductVariantType(response.data);
      setActiveVariant(variantType === 'stitched' ? 'stitched' : 'unstitched');
      
      const sizeField = response.data.size || (Array.isArray(response.data.sizes) ? response.data.sizes.join(', ') : '');
      if (sizeField) {
        if (isJewelry()) {
          const sizes = sizeField.split(',').map(s => s.trim());
          if (sizes.length > 0) setSelectedSize(sizes[0]);
        } else {
          setSelectedSize(sizeField);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorClick = (variant) => {
    setSelectedColorVariant(variant);
    setMainImage(variant.image || '');
  };

  const handleThumbnailClick = (image, variant) => {
    setMainImage(image);
    if (variant) {
      setSelectedColorVariant(variant);
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

    if (isJewelry() && !selectedSize) {
      setToast({ message: 'Please select a size before adding to cart.', type: 'error' });
      return;
    }

    const variantData = getVariantData();
    const cartProduct = {
      ...product,
      price: variantData.price,
      selectedVariant: activeVariant,
      selectedColorVariantId: selectedColorVariant?.id || null,
      selectedColorHex: selectedColorVariant?.hex || product.color_hex || null,
      image: selectedColorVariant?.image || mainImage || product.image
    };
    addToCart(cartProduct, quantity, selectedSize, selectedColor, activeVariant);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Please login first!');
      return;
    }

    if (isJewelry() && !selectedSize) {
      setToast({ message: 'Please select a size before placing an order.', type: 'error' });
      return;
    }

    handleAddToCart();
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

  const images = normalizeImages(product.images) || (product.front_image ? [product.front_image] : []);
  const isWishlisted = isInWishlist(product.id);
  const variantData = getVariantData();
  const displayPrice = variantData.price;
  const displayFeatures = variantData.features;
  const displayDescription = variantData.description;
  const showSize = shouldShowSize();
  const sizeList = getSizeDisplay();
  const isJewelryCategory = isJewelry();
  const availableVariants = getAvailableVariants();

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
            
            {/* ✅ THUMBNAIL GRID WITH ARROW */}
            {colorVariants.length > 0 && selectedColorVariant && (
              <div className="product-thumbnails-wrapper" style={{ position: 'relative', marginTop: '20px' }}>
                <div className="product-thumbnails" id="productThumbnails" style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  padding: '10px 5px',
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                  {colorVariants.map((cv, index) => (
                    <div 
                      key={cv.id || index}
                      className={`product-thumb ${selectedColorVariant?.id === cv.id ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(cv.image, cv)}
                      style={{
                        minWidth: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selectedColorVariant?.id === cv.id ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                        flexShrink: 0,
                        background: '#f3f4f6'
                      }}
                    >
                      <img 
                        src={cv.image} 
                        alt={`Variant ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=No+Img';
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <button 
                  className="thumb-scroll-btn left"
                  onClick={() => {
                    const container = document.getElementById('productThumbnails');
                    container.scrollLeft -= 200;
                  }}
                  style={{
                    position: 'absolute',
                    left: '-15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    transition: 'all 0.2s'
                  }}
                >
                  ‹
                </button>
                
                <button 
                  className="thumb-scroll-btn right"
                  onClick={() => {
                    const container = document.getElementById('productThumbnails');
                    container.scrollLeft += 200;
                  }}
                  style={{
                    position: 'absolute',
                    right: '-15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 5,
                    transition: 'all 0.2s'
                  }}
                >
                  ›
                </button>
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title" id="productPageTitle">
              {product.heading || product.name}
            </h1>

            {/* ✅ VARIANT SWITCH BUTTONS */}
            {!isJewelryCategory && availableVariants.length > 0 && (
              <div className="variant-switch-container" style={{ marginBottom: '16px' }}>
                <label style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#6b7280',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Select Variant:
                </label>
                <div className="variant-switch" style={{ 
                  display: 'flex', 
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {availableVariants.map((variantOption) => (
                      <button 
                        key={variantOption}
                        className={`variant-btn ${activeVariant === variantOption ? 'active' : ''}`}
                        onClick={() => setActiveVariant(variantOption)}
                        style={{
                          padding: '8px 20px',
                          borderRadius: '6px',
                          border: activeVariant === variantOption ? '2px solid #3b82f6' : '2px solid #111827',
                          background: activeVariant === variantOption ? '#3b82f6' : '#111827',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {getVariantDisplayName(variantOption)}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* ✅ FEATURES - Changes with variant */}
            {displayFeatures && displayFeatures.length > 0 && (
              <ul className="product-highlights" id="productHighlights">
                {displayFeatures.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}

            <div className="product-price-area">
              <div className="product-price" id="productPagePrice">{money(displayPrice)}</div>
            </div>

            <div className="product-stock" id="productPageStock">
              {product.stock_status !== 'out_of_stock' ? '● In Stock' : '● Out of Stock'}
            </div>

            {/* ✅ AVAILABLE COLORS - SIRF CIRCLES */}
            {colorVariants.length > 0 ? (
              <div className="product-option-group" id="productColorGroup">
                <h4>Available Colors ({colorVariants.length})</h4>
                <div className="product-colors" id="productColors" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {colorVariants.map((cv) => (
                    <div 
                      key={cv.id}
                      className={`product-color ${selectedColorVariant?.id === cv.id ? 'active' : ''}`}
                      style={{ 
                        background: cv.hex,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        border: selectedColorVariant?.id === cv.id ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                        transition: 'all 0.2s ease',
                        boxShadow: selectedColorVariant?.id === cv.id ? '0 0 0 3px rgba(59,130,246,0.3)' : 'none'
                      }}
                      onClick={() => handleColorClick(cv)}
                      title={cv.hex}
                    />
                  ))}
                </div>
              </div>
            ) : (
              product.color && (
                <div className="product-option-group" id="productColorGroup">
                  <h4>Available Colors</h4>
                  <div className="product-colors" id="productColors">
                    <div 
                      className={`product-color ${selectedColor === product.color ? 'active' : ''}`} 
                      style={{ background: product.color_hex || '#ccc' }}
                      onClick={() => setSelectedColor(product.color)}
                      title={product.color}
                    />
                  </div>
                </div>
              )
            )}

            {/* ✅ SIZE */}
            {showSize && sizeList && sizeList.length > 0 ? (
              <div className="product-option-group" id="productSizeGroup">
                <h4>Available Sizes</h4>
                <div className="product-sizes" id="productSizes" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {sizeList.map((size, index) => (
                    <button 
                      key={index}
                      className={`product-size ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px',
                        border: selectedSize === size ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                        borderRadius: '6px',
                        background: selectedSize === size ? '#3b82f6' : 'white',
                        color: selectedSize === size ? 'white' : '#1f2937',
                        cursor: 'pointer',
                        fontWeight: '600',
                        minWidth: '40px'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {isJewelryCategory && (
                  <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                    <i className="fas fa-info-circle"></i> US ring sizes
                  </small>
                )}
              </div>
            ) : (
              !isJewelryCategory && activeVariant === 'unstitched' && (
                <div className="product-option-group">
                  <h4>Size</h4>
                  <div style={{ 
                    padding: '8px 16px', 
                    background: '#f3f4f6', 
                    borderRadius: '6px',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    <i className="fas fa-info-circle"></i> No size required (Unstitched)
                  </div>
                </div>
              )
            )}

            <div className="product-option-group">
              <h4>Quantity</h4>
              <div className="product-quantity">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span id="quantityValue">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* ✅ DESCRIPTION */}
            {displayDescription && (
              <div className="product-description" id="productPageDescription">
                {displayDescription}
              </div>
            )}

            <div className="product-actions">
              <button className="add-cart-btn" onClick={handleAddToCart}>Add To Cart</button>
              <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>

            <div className="product-delivery-details" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginTop: '24px' }}>
              <h4 style={{ marginBottom: '14px', color: '#111827' }}>Within Karachi</h4>
              <div style={{ marginBottom: '12px' }}>
                <strong>Free Delivery</strong>
                <p style={{ margin: '8px 0 0', color: '#475569' }}>Delivery Time: <strong>2–4 Working Days (Unstitched)</strong></p>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>Delivery Time: <strong>5–8 Working Days (Stitched)</strong></p>
              </div>
              <h4 style={{ marginBottom: '14px', color: '#111827' }}>Outside Karachi</h4>
              <div>
                <strong>Delivery Charges Apply</strong>
                <p style={{ margin: '8px 0 0', color: '#475569' }}><em>Terms & Conditions Apply</em></p>
                <p style={{ margin: '8px 0 0', color: '#475569' }}>Delivery Time: <strong>2–4 Working Days (Unstitched)</strong></p>
                <p style={{ margin: '4px 0 0', color: '#475569' }}>Delivery Time: <strong>5–8 Working Days (Stitched)</strong></p>
              </div>
            </div>

            <div className="product-notice" style={{ marginTop: '18px', background: '#fff7ed', border: '1px solid #fb923c', borderRadius: '12px', padding: '16px', color: '#92400e', fontSize: '14px' }}>
              <strong>Note:</strong> Model images are for reference only. Please check the original product images before placing your order.
            </div>
          </div>
        </div>
      </section>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
