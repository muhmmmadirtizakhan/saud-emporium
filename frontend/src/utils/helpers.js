// ============================================================
// HELPERS - Utility Functions
// ============================================================

// Format Currency (Rs)
export const money = (amount) => {
  return 'Rs ' + Number(amount || 0).toLocaleString('en-PK');
};

// Escape HTML attributes
export const escapeAttr = (str) => {
  return String(str || '').replace(/"/g, '&quot;');
};

// Format Date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Truncate Text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Generate Random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

// Debounce Function
export const debounce = (func, delay = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

// Check if Object is Empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};