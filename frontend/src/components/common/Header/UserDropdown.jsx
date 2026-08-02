import React, { useState, useRef, useEffect } from 'react';

const UserDropdown = ({ user, logout, onOpenProfile, onOpenChangePassword }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  const handleProfile = () => {
    setIsOpen(false);
    // FIX: call parent-provided callback to flip React state,
    // instead of document.getElementById(...).classList.add('active')
    // which never matched any element and never touched React state.
    onOpenProfile();
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    onOpenChangePassword();
  };

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button className={`user-btn ${isOpen ? 'active' : ''}`} onClick={toggleDropdown}>
        <i className="fas fa-user-circle"></i>
        <span>{user?.full_name || user?.email || 'Account'}</span>
        <i className="fas fa-chevron-down"></i>
      </button>

      {isOpen && (
        <div className="dropdown-menu active">
          <div className="user-greeting">
            <div className="greeting-name">{user?.full_name || 'Guest'}</div>
            <div className="greeting-email">{user?.email || 'guest@example.com'}</div>
          </div>
          <div className="dropdown-divider"></div>

          <div className="dropdown-item" onClick={handleProfile}>
            <i className="fas fa-user"></i> My Profile
          </div>
          <div className="dropdown-item" onClick={handleChangePassword}>
            <i className="fas fa-key"></i> Change Password
          </div>
          <div className="dropdown-divider"></div>
          <div className="dropdown-item logout-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;