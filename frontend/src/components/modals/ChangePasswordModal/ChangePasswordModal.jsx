import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.old_password || !formData.new_password || !formData.confirm_password) {
      alert('Please fill all fields');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }

    if (formData.new_password.length < 6) {
      alert('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password
      });
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      onClose();
    } catch (error) {
      console.error('Change password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <h2><i className="fas fa-key"></i> Change Password</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                name="old_password"
                placeholder="Enter current password" 
                value={formData.old_password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                name="new_password"
                placeholder="Enter new password" 
                value={formData.new_password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                name="confirm_password"
                placeholder="Confirm new password" 
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              <i className="fas fa-key"></i> {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;