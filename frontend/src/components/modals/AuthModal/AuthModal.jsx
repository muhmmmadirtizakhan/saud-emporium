import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        onClose();
      } else {
        if (formData.password !== formData.confirm_password) {
          alert('Passwords do not match!');
          setLoading(false);
          return;
        }
        await register({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password
        });
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-modal ${isOpen ? 'active' : ''}`}>
      <div className="auth-overlay" onClick={onClose}></div>
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}>✕</button>
        
        <div className="logo">
          <img src="/assets/images/hello.png" alt="Saud Emporium" />
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="form active" onSubmit={handleSubmit}>
          <h2>{isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}</h2>
          
          {!isLogin && (
            <input 
              type="text" 
              name="full_name"
              placeholder="Full Name" 
              required 
              value={formData.full_name}
              onChange={handleChange}
            />
          )}
          
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
          
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            required 
            value={formData.password}
            onChange={handleChange}
          />
          
          {!isLogin && (
            <input 
              type="password" 
              name="confirm_password"
              placeholder="Confirm Password" 
              required 
              value={formData.confirm_password}
              onChange={handleChange}
            />
          )}
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;