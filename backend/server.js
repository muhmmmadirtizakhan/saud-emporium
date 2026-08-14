require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(s => s.trim()).filter(Boolean) : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// FIX (SECURITY): debug route ab sirf non-production mein available hai.
// Production (Vercel) mein ye route hi register nahi hoga, isliye
// FRONTEND_URL / allowedOrigins publicly expose nahi hoga.
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/cors', (req, res) => {
    try {
      res.json({
        FRONTEND_URL: process.env.FRONTEND_URL || null,
        allowedOrigins
      });
    } catch (err) {
      res.status(500).json({ error: 'Debug failed', details: err.message });
    }
  });
}

app.use(errorHandler);

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

module.exports = app;
