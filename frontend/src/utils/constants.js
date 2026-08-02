// ============================================================
// CONSTANTS - App-Wide Constants
// ============================================================

// API URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Categories Mapping
export const CATEGORY_MAP = {
  'saree': 'Sarees',
  'sarees': 'Sarees',
  'suit': 'Suits',
  'suits': 'Suits',
  'maxi': 'Maxi & Long Frocks',
  'maxi dress': 'Maxi & Long Frocks',
  'jewelry': 'Jewelry',
  'jewellery': 'Jewelry',
};

// Page Routes
export const ROUTES = {
  HOME: '/',
  SAREES: '/sarees',
  SUITS: '/suits',
  MAXI: '/maxi',
  JEWELRY: '/jewelry',
  COLLECTIONS: '/collections',
  WISHLIST: '/wishlist',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PAYMENT_INSTRUCTIONS: '/payment-instructions',
  PRODUCT_DETAIL: '/product/:id',
};

// Toast Durations
export const TOAST_DURATION = 4000;

// Pagination
export const ITEMS_PER_PAGE = 12;