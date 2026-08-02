const supabase = require('../config/database');

// ============================================================
// GET /api/products/bestsellers
// (homepage teaser only — pulled from 'products' table)
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
// (homepage teaser only — pulled from 'products' table)
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
// FIX: reverted to querying ONLY 'category_products' — this is the
// single source of truth for category browse pages (Sarees, Suits,
// Maxi, Jewelry). The 'products' table is exclusively for the
// Bestsellers / New Arrivals homepage teasers and must never feed
// the category listing pages, per the intended design: New Arrivals
// on the homepage is a pure navigation teaser — it only routes to the
// category page on click, it does not duplicate its own data there.
// ============================================================
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const { data, error } = await supabase
      .from('category_products')
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
// Product detail pages reached FROM a category listing should
// resolve from 'category_products' — kept a fallback to 'products'
// only in case a bestseller/new-arrival card's own detail view is
// ever opened directly.
// ============================================================
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let { data, error } = await supabase
      .from('category_products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      const fallback = await supabase
        .from('products')
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
