// src/components/pages/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { money } from '../../../utils/helpers';
import api from '../../../api';

const Cart = () => {
  const { items, loading, updateQuantity, removeFromCart, getTotalPrice, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cartTab');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleQuantityChange = (cartId, delta) => {
    const item = items.find(i => i.id === cartId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    updateQuantity(cartId, newQty);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };
const loadOrders = async () => {
  if (!isAuthenticated) {
    alert('Please login first!');
    return;
  }
  setOrdersLoading(true);
  try {
    const response = await api.get('/orders');
    console.log('ORDERS API RESPONSE:', response.data);   // 👈 YE NAYI LINE ADD KARO
    console.log('IS ARRAY?', Array.isArray(response.data));  // 👈 YE BHI ADD KARO
    setOrders(response.data || []);
  } catch (error) {
    console.error('Error loading orders:', error);
  } finally {
    setOrdersLoading(false);
  }
};

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'ordersTab') {
      loadOrders();
    }
  };

  if (loading) {
    return (
      <div className="page">
        <section className="category-hero">
          <div className="category-hero-banner">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80" alt="Your Cart" />
            <div className="category-hero-overlay"></div>
            <div className="category-hero-content">
              <span>REVIEW & CHECKOUT</span>
              <h1>YOUR CART</h1>
              <p>Review your selected pieces and proceed to a seamless checkout experience.</p>
            </div>
          </div>
        </section>
        <div className="cart-layout">
          <div className="cart-content">
            <div className="cart-empty">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="category-hero">
        <div className="category-hero-banner">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80" alt="Your Cart" />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>REVIEW & CHECKOUT</span>
            <h1>YOUR CART</h1>
            <p>Review your selected pieces and proceed to a seamless checkout experience.</p>
          </div>
        </div>
      </section>

      <section className="breadcrumb-section">
        <div className="breadcrumb-container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="active">Cart</span>
          </nav>
        </div>
      </section>

      <div className="cart-layout">
        <aside className="cart-sidebar">
          <h4>My Account</h4>
          <button 
            className={`cart-tab ${activeTab === 'cartTab' ? 'active' : ''}`} 
            onClick={() => handleTabSwitch('cartTab')}
          >
            🛒 My Cart
          </button>
          <button 
            className={`cart-tab ${activeTab === 'ordersTab' ? 'active' : ''}`} 
            onClick={() => handleTabSwitch('ordersTab')}
          >
            📦 Order History
          </button>
        </aside>

        <div className="cart-content">
          {activeTab === 'cartTab' && (
            <div className="cart-tab-content active">
              {items.length === 0 ? (
                <div className="cart-empty">Your cart is empty 🛍️</div>
              ) : (
                <>
                  <div id="cartContainer">
                    {items.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-img">
                          <img src={item.product_image} alt={item.product_name} />
                        </div>
                        <button 
                          className="cart-item-remove" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          ✕
                        </button>
                        <div className="cart-item-content">
                          <h3>
                            {item.product_name}
                            {(item.variant || item.selected_variant) ? ` — ${item.variant || item.selected_variant}` : ''}
                            {item.size ? ` — ${item.size}` : ''}
                          </h3>
                          <span className="cart-item-unit">{money(item.product_price)} each</span>
                          <div className="cart-item-qty">
                            <button onClick={() => handleQuantityChange(item.id, -1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                          </div>
                          <div className="cart-item-subtotal">{money(item.product_price * item.quantity)}</div>
                          <button className="cart-item-checkout" onClick={handleCheckout}>Checkout</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div id="cartTotalWrapper">
                    <div className="cart-summary-bar">
                      <h2 id="totalPrice">Total: {money(getTotalPrice())}</h2>
                      <div className="cart-actions">
                        <button id="checkoutBtn" onClick={handleCheckout}>Proceed to Checkout</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
{activeTab === 'ordersTab' && (
  <div className="cart-tab-content active" id="ordersTab">
    <div id="ordersContainer">
      {ordersLoading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="cart-empty">No orders yet 📦</div>
      ) : (
        <table className="orders-table">
          <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td data-label="Order ID">#{order.id.slice(0, 8)}</td>
                          <td data-label="Date">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td data-label="Product">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="order-product-row">
                                <img src={item.product_image} alt={item.product_name} />
                                <span>{item.product_name} × {item.quantity}</span>
                              </div>
                            ))}
                          </td>
                          <td data-label="Status">
                            <span className={`order-status-badge status-${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td data-label="Total">{money(order.total_amount)}</td>
                          <td data-label="Action">
                            {order.status === 'pending' ? (
                              <button 
                                className="pay-now-btn"
                                onClick={() => navigate('/payment-instructions', { state: { orderId: order.id, amount: order.total_amount } })}
                              >
                                View Payment Info
                              </button>
                            ) : (
                              <span className="order-paid-label">✓ Paid</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;