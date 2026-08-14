const supabase = require('../config/database');

// ============================================================
// GET /api/cart
// ============================================================
exports.getCart = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_cart')
      .select('*')
      .eq('user_id', req.userId)
      .order('added_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// ============================================================
// POST /api/cart — ✅ FIXED
// ============================================================
exports.addToCart = async (req, res) => {
  try {
    const {
      product_id,
      product_name,
      product_price,
      product_image,
      quantity,
      size,
      color,
      variant,
      color_variant_id,   // ✅ ADDED
      color_hex           // ✅ ADDED
    } = req.body;

    console.log('📥 Cart Request:', { product_id, product_name, quantity, size, color, variant, color_variant_id, color_hex });

    if (!product_id || !product_name || !product_price) {
      return res.status(400).json({ error: 'Product id, name and price are required' });
    }

    // Check if same product + same size + same color + same variant exists
    const { data: existing } = await supabase
      .from('user_cart')
      .select('*')
      .eq('user_id', req.userId)
      .eq('product_id', product_id)
      .eq('size', size || '')
      .eq('color', color || '')
      .eq('variant', variant || '')
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('user_cart')
        .update({
          quantity: existing.quantity + (quantity || 1),
          updated_at: new Date()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ success: true, message: 'Cart updated', product: data });
    }

    // ✅ INSERT with new fields
    const { data, error } = await supabase
      .from('user_cart')
      .insert({
        user_id: req.userId,
        product_id,
        product_name,
        product_price,
        product_image: product_image || '',
        quantity: quantity || 1,
        size: size || '',
        color: color || '',
        variant: variant || '',
        color_variant_id: color_variant_id || null,   // ✅ ADDED
        color_hex: color_hex || null                  // ✅ ADDED
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Added to cart', product: data });

  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// ============================================================
// PUT /api/cart/:id
// ============================================================
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const { data: cartItem } = await supabase
      .from('user_cart')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!cartItem || cartItem.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('user_cart')
      .update({ quantity, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Quantity updated', product: data });

  } catch (err) {
    console.error('Error updating cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// ============================================================
// DELETE /api/cart/:id
// ============================================================
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: cartItem } = await supabase
      .from('user_cart')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!cartItem || cartItem.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('user_cart')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Removed from cart' });

  } catch (err) {
    console.error('Error removing from cart:', err);
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

// ============================================================
// DELETE /api/cart
// ============================================================
exports.clearCart = async (req, res) => {
  try {
    const { error } = await supabase
      .from('user_cart')
      .delete()
      .eq('user_id', req.userId);

    if (error) throw error;
    res.json({ success: true, message: 'Cart cleared' });

  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
