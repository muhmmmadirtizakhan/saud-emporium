const supabase = require('../config/database');

// ============================================================
// GET /api/products/bestsellers
// ============================================================
exports.getBestsellers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_bestseller', true)
      .order('bestseller_rank', { ascending: true })
      .limit(8);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching bestsellers:', err);
    res.status(500).json({ error: 'Failed to fetch bestsellers' });
  }
};

// ============================================================
// GET /api/products/new-arrivals
// ============================================================
exports.getNewArrivals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    res.status(500).json({ error: 'Failed to fetch new arrivals' });
  }
};

// ============================================================
// GET /api/products/category/:category
// ============================================================
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // FIX: unified schema — the 'products' table (not the old
    // 'category_products' table) is where the admin panel now inserts
    // all products, with a 'category' column. Using ilike for
    // case-insensitive matching since frontend sends lowercase
    // ("saree") while the DB stores "Saree".
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ error: 'Failed to fetch category products' });
  }
};

// ============================================================
// GET /api/products/:id
// ============================================================
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // FIX: primary table is now 'products'; kept 'category_products' as a
    // fallback for any legacy rows that still live there.
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const fallback = await supabase
        .from('category_products')
        .select('*')
        .eq('id', id)
        .single();
      data = fallback.data;
      error = fallback.error;
    }

    if (error || !data) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};