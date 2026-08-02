// src/components/common/Header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import UserDropdown from './UserDropdown';
import AuthModal from '../../modals/AuthModal/AuthModal';
import ProfileModal from '../../modals/ProfileModal/ProfileModal';
import ChangePasswordModal from '../../modals/ChangePasswordModal/ChangePasswordModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/sarees', label: 'Sarees' },
    { path: '/suits', label: 'Suits' },
    { path: '/maxi', label: 'Maxi & Long Frocks' },
    { path: '/jewelry', label: 'Jewelry' },
    { path: '/collections', label: 'Collections' },
      { path: '/new-arrivals', label: 'New Arrivals' },
  ];

  const handleLogoClick = () => {
    navigate('/');
    closeMenu();
  };

  return (
    <>
      <header className="header">
        <nav className="navbar">
          {/* Logo */}
          <div className="logo" onClick={handleLogoClick}>
            <img src="/assets/images/hello.png" alt="Saud Emporium" />
          </div>

          {/* Nav Links */}
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  onClick={closeMenu}
                  className={location.pathname === link.path ? 'active' : ''}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Nav Icons */}
          <div className="nav-icons">
         
            
            {/* Wishlist Icon */}
            <Link to="/wishlist" onClick={closeMenu}>
              <i className="fas fa-heart"></i>
            </Link>
            
            {/* Cart Icon with Badge */}
            <Link to="/cart" onClick={closeMenu} className="cart-icon-wrapper">
              <i className="fas fa-shopping-cart"></i>
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>

            {/* User Dropdown / Login Button */}
            {isAuthenticated ? (
              <UserDropdown 
                user={user} 
                logout={logout}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
              />
            ) : (
              <button 
                className="login-btn" 
                onClick={() => setIsAuthModalOpen(true)}
              >
                Login
              </button>
            )}

            {/* Hamburger */}
     <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen} 
        onClose={() => setIsChangePasswordModalOpen(false)} 
      />
    </>
  );
};

export default Header;