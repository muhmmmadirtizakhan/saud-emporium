const supabase = require('../config/database');

// ============================================================
// POST /api/orders
// ============================================================
exports.createOrder = async (req, res) => {
  try {
    const { items, full_name, email, phone, city, address, payment_method, total_amount } = req.body;

    if (!items || !items.length || !full_name || !phone || !address || !total_amount) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: req.userId,
        items,
        full_name,
        email,
        phone,
        city,
        address,
        payment_method: payment_method || 'easypaisa',
        total_amount,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('user_cart').delete().eq('user_id', req.userId);

    res.status(201).json({ success: true, message: 'Order placed successfully', order: data });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ============================================================
// GET /api/orders
// ============================================================
exports.getOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ============================================================
// GET /api/orders/:id
// ============================================================
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};