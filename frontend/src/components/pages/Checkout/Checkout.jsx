import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { money } from '../../../utils/helpers';
import api from '../../../api';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    address: user?.address || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.full_name || prev.full_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.city || prev.city,
        address: user.address || prev.address
      }));
    }
  }, [items, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Please login to place order!');
      return;
    }

    const { full_name, email, phone, city, address } = formData;
    if (!full_name || !phone || !address) {
      alert('Please fill all required fields!');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = getTotalPrice();

      // FIX: using the shared axios `api` instance (baseURL = http://localhost:3000/api)
      // instead of raw fetch('/api/orders'), which was resolving against the Vite dev
      // server (localhost:5173) and returning a 404 with an empty body.
      const response = await api.post('/orders', {
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
          product_image: item.product_image,
          quantity: item.quantity,
          size: item.size,
          color: item.color
        })),
        full_name,
        email,
        phone,
        city,
        address,
        payment_method: 'easypaisa',
        total_amount: totalAmount
      });

      clearCart();
      navigate('/payment-instructions', {
        state: {
          orderId: response.data.order.id,
          amount: totalAmount
        }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.error || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getTotalPrice();

  return (
    <div className="page">
      <section className="checkout-section">
        <div className="checkout-left">
          <h2>Shipping Information</h2>
          <form id="checkoutForm" onSubmit={handleSubmit}>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              required
              value={formData.full_name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              value={formData.city}
              onChange={handleChange}
            />
            <textarea
              name="address"
              placeholder="Full Address"
              required
              value={formData.address}
              onChange={handleChange}
            ></textarea>

            <div className="payment-section">
              <div className="payment-header">
                <img
                  src="https://crystalpng.com/wp-content/uploads/2024/10/Easypaisa-logo.png"
                  alt="Easypaisa"
                  className="easypaisa-logo"
                />
                <h3>Pay with Easypaisa</h3>
              </div>
              <p className="payment-note">
                You will be redirected to the Easypaisa page where you can confirm your number
                and complete the payment securely.
              </p>
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className="checkout-right">
          <h2>Order Summary</h2>
          <div id="orderSummary">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.product_image} alt={item.product_name} />
                <div className="summary-item-info">
                  <p>{item.product_name}{item.size ? ' — ' + item.size : ''}</p>
                  <span>{item.quantity} × {money(item.product_price)}</span>
                </div>
                <div className="summary-item-price">{money(item.product_price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div id="checkoutTotal">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;