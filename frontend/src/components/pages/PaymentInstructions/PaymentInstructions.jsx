import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { money } from '../../../utils/helpers';

const PaymentInstructions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, amount } = location.state || {};

  if (!orderId || !amount) {
    return (
      <div className="page">
        <div className="payment-instructions-section">
          <div className="payment-instructions-card">
            <h2 style={{ textAlign: 'center', color: '#111', marginBottom: '20px' }}>
              No order found
            </h2>
            <button 
              onClick={() => navigate('/')}
              style={{
                display: 'block',
                margin: '0 auto',
                padding: '12px 30px',
                background: '#c9a44c',
                color: '#000',
                border: 'none',
                borderRadius: '50px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Category Hero */}
      <section className="category-hero">
        <div className="category-hero-banner">
          <img 
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80" 
            alt="Payment Instructions" 
          />
          <div className="category-hero-overlay"></div>
          <div className="category-hero-content">
            <span>SECURE PAYMENT</span>
            <h1>PAYMENT INSTRUCTIONS</h1>
            <p>Your order has been created. Please complete payment using the details below.</p>
          </div>
        </div>
      </section>

      {/* Payment Instructions Card */}
      <section className="payment-instructions-section">
        <div className="payment-instructions-card">

          {/* ========== ORDER SUMMARY ========== */}
          <div className="pi-order-summary">
            <div>
              <span>Order ID</span>
              <strong>#{orderId.slice(0, 8)}</strong>
            </div>
            <div>
              <span>Amount</span>
              <strong>{money(amount)}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong className="pi-status-pending">Pending</strong>
            </div>
          </div>

          {/* ========== TIMING NOTICE ========== */}
          <div className="pi-timing-notice">
            <i className="fas fa-clock"></i>
            <div>
              <h4>⏰ Payment Acceptance Hours</h4>
              <p>
                We accept and verify payments only between <strong>12:00 AM – 12:00 PM</strong>. 
                Payments sent outside these hours will be verified once our team is back online — 
                please avoid duplicate messages, your order is safe.
              </p>
            </div>
          </div>

          {/* ========== BANK DETAILS ========== */}
          <div className="pi-details-grid">
            {/* UBL Bank */}
            <div className="pi-detail-box bank-detail-box">
              <span className="pi-label">🏦 UBL Bank</span>
              <span className="pi-value">Syed Saud Ali</span>
              <span className="pi-account">Account #: 1403320337369</span>
            </div>

            {/* Meezan Bank */}
            <div className="pi-detail-box bank-detail-box">
              <span className="pi-label">🏦 Meezan Bank</span>
              <span className="pi-value">Syed Saud Ali</span>
              <span className="pi-account">Account #: 99180113296230</span>
            </div>

            {/* WhatsApp */}
            <div className="pi-detail-box bank-detail-box highlight-box">
              <span className="pi-label">💬 WhatsApp Confirmation</span>
              <span className="pi-value">+92 333 2836899</span>
              <span className="pi-account">Send payment screenshot here</span>
            </div>

            {/* Email */}
            <div className="pi-detail-box bank-detail-box">
              <span className="pi-label">📧 Email</span>
              <span className="pi-value">saudemporium@gmail.com</span>
              <span className="pi-account">For queries &amp; support</span>
            </div>
          </div>

          {/* ========== INSTRUCTIONS ========== */}
          <div className="pi-instructions-box">
            <h4>📋 How to Complete Your Payment</h4>
            <ol>
              <li>
                <strong>Transfer the exact amount</strong> to any of the above bank accounts.
              </li>
              <li>
                <strong>Take a screenshot</strong> of your payment confirmation (include transaction ID).
              </li>
              <li>
                <strong>Send the screenshot</strong> with your <strong>Order ID (#{orderId.slice(0, 8)})</strong> to our WhatsApp number: <strong>+92 333 2836899</strong>
              </li>
              <li>
                <strong>Wait for verification</strong> — Our team will confirm your payment within 24 hours.
              </li>
              <li>
                <strong>Order status will change</strong> from <span className="status-pending">Pending</span> to <span className="status-paid">Paid</span> after verification.
              </li>
            </ol>
          </div>

          {/* ========== IMPORTANT NOTE ========== */}
          <div className="pi-important-note">
            <i className="fas fa-exclamation-circle"></i>
            <div>
              <h4>⚠️ Important Note</h4>
              <p>
                Your order will only be processed after payment verification. 
                Please ensure you send the screenshot within <strong>24 hours</strong> to avoid order cancellation.
                For any queries, contact us on WhatsApp.
              </p>
            </div>
          </div>

          {/* ========== ACTION BUTTONS ========== */}
          <div className="pi-actions">
            <button 
              className="pi-whatsapp-btn"
              onClick={() => window.open(
                'https://wa.me/923332836899?text=My%20Order%20ID%20is%20' + 
                orderId.slice(0, 8) + 
                '%20-%20Payment%20Confirmation', 
                '_blank'
              )}
            >
              <i className="fab fa-whatsapp"></i> Send on WhatsApp
            </button>
            <button className="pi-continue-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PaymentInstructions;