import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || ''
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      onClose();
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2><i className="fas fa-user"></i> My Profile</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="full_name"
                placeholder="Enter full name" 
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input 
                type="text" 
                name="phone"
                placeholder="Enter phone number" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                name="address"
                placeholder="Enter address" 
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                name="city"
                placeholder="Enter city" 
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              <i className="fas fa-save"></i> {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;