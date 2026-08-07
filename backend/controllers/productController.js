const supabase = require('../config/database');

const normalizeProductPayload = (product) => {
  if (!product) return null;

  const variantType = String(product.variant || 'unstitched').toLowerCase();
  const normalized = { ...product };

  normalized.variant = ['stitched', 'unstitched', 'both'].includes(variantType) ? variantType : 'unstitched';

  if (normalized.variant === 'unstitched') {
    normalized.price = normalized.unstitched_price ?? normalized.price ?? 0;
    normalized.description = normalized.unstitched_description ?? normalized.description ?? '';
    normalized.features = normalized.unstitched_features || normalized.features || [];
    normalized.sizes = normalized.unstitched_sizes || [];
  } else if (normalized.variant === 'stitched') {
    normalized.price = normalized.price ?? normalized.unstitched_price ?? 0;
    normalized.description = normalized.description ?? '';
    normalized.features = normalized.features || [];
    normalized.sizes = normalized.sizes || [];
  } else if (normalized.variant === 'both') {
    // FIX: base price/features/description columns ARE the stitched variant's
    // data — don't clobber them with unstitched_* fallbacks like before.
    // That old code was overwriting correct stitched data with unstitched data.
    normalized.price = normalized.price ?? normalized.unstitched_price ?? 0;
    normalized.description = normalized.description ?? '';
    normalized.features = normalized.features || [];
    normalized.sizes = normalized.sizes || normalized.unstitched_sizes || [];
  }

  if (!Array.isArray(normalized.features)) normalized.features = [];
  if (!Array.isArray(normalized.unstitched_features)) normalized.unstitched_features = [];
  if (!Array.isArray(normalized.sizes)) normalized.sizes = [];

  if (!normalized.size && normalized.sizes.length > 0) {
    normalized.size = normalized.sizes.join(', ');
  }

  return normalized;
};
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

    // FIX: unified schema — the 'products' table (not the old
    // 'category_products' table) is where the admin panel now inserts
    // all products, with a 'category' column. Using ilike for
    // case-insensitive matching since frontend sends lowercase
    // ("saree") while the DB stores "Saree".
    // Query both 'products' (primary) and 'category_products' (legacy)
    // then merge them so storefront shows admin-created rows regardless
    // of which table they were stored in.
    const [primary, legacy] = await Promise.all([
      supabase
        .from('products')
        .select('*')
        .ilike('category', category)
        .order('created_at', { ascending: false }),
      supabase
        .from('category_products')
        .select('*')
        .ilike('category', category)
        .order('created_at', { ascending: false })
    ]);

    if (primary.error && legacy.error) throw primary.error || legacy.error;

    const primaryData = primary.data || [];
    const legacyData = legacy.data || [];

    // Merge by id, prefer primary table entries when ids collide
    const mergedById = new Map();
    primaryData.forEach(p => mergedById.set(String(p.id), p));
    legacyData.forEach(p => {
      const key = String(p.id);
      if (!mergedById.has(key)) mergedById.set(key, p);
    });

    const merged = Array.from(mergedById.values()).sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json(merged.map(normalizeProductPayload));
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

    res.json(normalizeProductPayload(data));
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};
