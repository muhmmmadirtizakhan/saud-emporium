function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;