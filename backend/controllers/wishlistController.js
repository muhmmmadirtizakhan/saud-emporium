const supabase = require('../config/database');

// ============================================================
// GET /api/wishlist
// ============================================================
exports.getWishlist = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_wishlist')
      .select('*')
      .eq('user_id', req.userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

// ============================================================
// POST /api/wishlist
// ============================================================
exports.addToWishlist = async (req, res) => {
  try {
    const { product_id, product_name, product_price, product_image } = req.body;

    if (!product_id || !product_name || !product_price) {
      return res.status(400).json({ error: 'Product id, name and price are required' });
    }

    const { data: existing } = await supabase
      .from('user_wishlist')
      .select('id')
      .eq('user_id', req.userId)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    const { data, error } = await supabase
      .from('user_wishlist')
      .insert({
        user_id: req.userId,
        product_id,
        product_name,
        product_price,
        product_image: product_image || ''
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Added to wishlist', product: data });

  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

// ============================================================
// DELETE /api/wishlist/:id
// ============================================================
exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: wishItem } = await supabase
      .from('user_wishlist')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!wishItem || wishItem.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('user_wishlist')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Removed from wishlist' });

  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

// ============================================================
// DELETE /api/wishlist/product/:productId
// ============================================================
exports.removeByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const { error } = await supabase
      .from('user_wishlist')
      .delete()
      .eq('user_id', req.userId)
      .eq('product_id', productId);

    if (error) throw error;
    res.json({ success: true, message: 'Removed from wishlist' });

  } catch (err) {
    console.error('Error removing from wishlist:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};