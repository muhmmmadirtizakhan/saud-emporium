import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Listen for toast events
    const handleToast = (event) => {
      const { message, type = 'info', duration = 4000 } = event.detail;
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    document.addEventListener('showToast', handleToast);
    return () => document.removeEventListener('showToast', handleToast);
  }, []);

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-exclamation',
    info: 'fa-circle-info'
  };

  return ReactDOM.createPortal(
    <div id="toastContainer">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type} show`}>
          <i className={`fas ${icons[toast.type] || icons.info}`}></i>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
};

// Helper function to show toast
export const showToast = (message, type = 'info', duration = 4000) => {
  const event = new CustomEvent('showToast', {
    detail: { message, type, duration }
  });
  document.dispatchEvent(event);
};

export default ToastContainer;