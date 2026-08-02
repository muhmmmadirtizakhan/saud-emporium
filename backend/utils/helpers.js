// Helper functions - Future use ke liye

exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-PK', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

exports.formatCurrency = (amount) => {
  return 'Rs ' + Number(amount || 0).toLocaleString('en-PK');
};

exports.generateOrderId = () => {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
};