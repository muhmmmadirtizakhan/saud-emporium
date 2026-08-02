// src/components/common/Footer/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setSubmitStatus('Please enter your email');
      setTimeout(() => setSubmitStatus(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/xdaqjnqw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitStatus('Subscribed successfully! 🎉');
        setEmail('');
        setTimeout(() => setSubmitStatus(null), 3000);
      } else {
        setSubmitStatus('Something went wrong. Please try again.');
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      setSubmitStatus('Network error. Please try again.');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-top">
        <div className="footer-column">
          <h3>SHOP</h3>
          <ul>
            <li><Link to="/sarees">Sarees</Link></li>
            <li><Link to="/suits">Suits</Link></li>
            <li><Link to="/">New Arrivals</Link></li>
            <li><Link to="/">Best Sellers</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>COMPANY</h3>
          <ul>
            <li><Link to="/maxi">Maxi & Longfrocks</Link></li>
            <li><Link to="/jewelry">Jewelry</Link></li>
            <li><Link to="/collections">Collections</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>SUPPORT</h3>
          <ul>
            <li><Link to="/">Contact</Link></li>
            <li><Link to="/">FAQs</Link></li>
            <li><Link to="/">Shipping</Link></li>
            <li><Link to="/">Returns</Link></li>
          </ul>
        </div>
        <div className="footer-newsletter">
          <h3>NEWSLETTER</h3>
          <p>Subscribe for exclusive collection launches, special offers, and the latest updates.</p>
          <form onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {submitStatus && (
            <p className={`subscribe-status ${submitStatus.includes('successfully') ? 'success' : 'error'}`}>
              {submitStatus}
            </p>
          )}
          
          {/* SOCIAL MEDIA LINKS - FIXED */}
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="mailto:saudemporium@gmail.com" aria-label="Email">
              <i className="fas fa-envelope"></i>
            </a>
            <a 
              href="https://www.instagram.com/saudemporium" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Saud Emporium. All Rights Reserved.</p>
        <div className="footer-policies">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;