const supabase = require('../config/database');

const normalizeProductPayload = (product) => {
  if (!product) return null;

  const variantType = String(product.variant || 'unstitched').toLowerCase();
  const normalized = { ...product };

  normalized.variant = ['stitched', 'unstitched', 'both'].includes(variantType) ? variantType : 'unstitched';

  // ✅ FIX: Keep features separate — don't override
  let unstitchedFeatures = normalized.unstitched_features || [];
  let stitchedFeatures = normalized.stitched_features || normalized.features || [];
  let baseFeatures = normalized.features || [];

  // Ensure arrays
  if (typeof unstitchedFeatures === 'string') {
    try { unstitchedFeatures = JSON.parse(unstitchedFeatures); } catch { unstitchedFeatures = []; }
  }
  if (typeof stitchedFeatures === 'string') {
    try { stitchedFeatures = JSON.parse(stitchedFeatures); } catch { stitchedFeatures = []; }
  }
  if (typeof baseFeatures === 'string') {
    try { baseFeatures = JSON.parse(baseFeatures); } catch { baseFeatures = []; }
  }

  if (!Array.isArray(unstitchedFeatures)) unstitchedFeatures = [];
  if (!Array.isArray(stitchedFeatures)) stitchedFeatures = [];
  if (!Array.isArray(baseFeatures)) baseFeatures = [];

  // ✅ Keep ALL features separate
  normalized.unstitched_features = unstitchedFeatures;
  normalized.stitched_features = stitchedFeatures;
  normalized.features = baseFeatures;

  // Price logic
  if (normalized.variant === 'unstitched') {
    normalized.price = normalized.unstitched_price ?? normalized.price ?? 0;
    normalized.description = normalized.unstitched_description ?? normalized.description ?? '';
    normalized.sizes = normalized.unstitched_sizes || [];
  } else if (normalized.variant === 'stitched') {
    normalized.price = normalized.price ?? normalized.unstitched_price ?? 0;
    normalized.description = normalized.stitched_description ?? normalized.description ?? '';
    normalized.sizes = normalized.stitched_sizes || normalized.sizes || [];
  } else if (normalized.variant === 'both') {
    normalized.price = normalized.price ?? normalized.unstitched_price ?? 0;
    normalized.description = normalized.stitched_description ?? normalized.unstitched_description ?? normalized.description ?? '';
    normalized.sizes = normalized.stitched_sizes || normalized.unstitched_sizes || normalized.sizes || [];
  }

  if (!Array.isArray(normalized.sizes)) normalized.sizes = [];

  if (!normalized.size && normalized.sizes.length > 0) {
    normalized.size = normalized.sizes.join(', ');
  }

  return normalized;
};

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
