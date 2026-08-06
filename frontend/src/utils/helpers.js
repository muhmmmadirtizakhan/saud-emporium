// ============================================================
// HELPERS - Utility Functions
// ============================================================

// Format Currency (Rs)
export const money = (amount) => {
  return 'Rs ' + Number(amount || 0).toLocaleString('en-PK');
};

export const getProductVariantType = (product) => {
  const variant = String(product?.variant || 'unstitched').toLowerCase();
  if (variant === 'stitched' || variant === 'unstitched' || variant === 'both') {
    return variant;
  }
  return 'unstitched';
};

export const getProductDisplayPrice = (product) => {
  const variantType = getProductVariantType(product);
  if (variantType === 'unstitched') {
    return Number(product?.unstitched_price ?? product?.price ?? 0);
  }
  return Number(product?.price ?? 0);
};

export const getVariantDisplayName = (variant) => {
  if (variant === 'stitched') return 'Stitched';
  if (variant === 'unstitched') return 'Unstitched';
  return '';
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