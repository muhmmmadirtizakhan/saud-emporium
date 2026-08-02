require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors({
  // FIX: add your production frontend URL here once you have it
  // (e.g. 'https://saudemporium.vercel.app'), otherwise the deployed
  // frontend will be blocked by CORS.
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL, // set this in Vercel env vars
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Prevent the browser from caching API responses.
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// FIX (SECURITY): removed `app.use(express.static(__dirname))`.
// This backend is a pure JSON API — there is no reason to serve the
// project's own source files (routes/, controllers/, config/, etc.)
// over HTTP. Leaving it in place would let anyone fetch files like
// middleware/auth.js and see the hardcoded JWT fallback secret.

// ============================================================
// ROUTES - SARI Original Functionality Ke Saath
// ============================================================
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Simple health check — useful to confirm the deployed function is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================================================
// ERROR HANDLER
// ============================================================
app.use(errorHandler);

// ============================================================
// START SERVER (local dev only)
// ============================================================
// FIX: On Vercel, this file is imported as a serverless function handler,
// not run directly — so app.listen() should only fire during local
// development (or any environment where Vercel hasn't injected VERCEL=1).
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`👥 Auth API: /api/auth/*`);
    console.log(`🛒 Cart API: /api/cart/*`);
    console.log(`❤️ Wishlist API: /api/wishlist/*`);
    console.log(`📦 Products API: /api/products/*`);
    console.log(`📋 Orders API: /api/orders/*`);
    console.log(`👤 Users API: /api/users/*`);
  });
}

// FIX: export the app so Vercel's Node runtime can use it as a
// serverless function handler.
module.exports = app;