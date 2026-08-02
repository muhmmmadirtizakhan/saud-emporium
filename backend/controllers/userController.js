const bcrypt = require('bcrypt');
const supabase = require('../config/database');

// ============================================================
// PUT /api/users/update
// ============================================================
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, city } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: full_name || '',
        phone: phone || '',
        address: address || '',
        city: city || '',
        updated_at: new Date()
      })
      .eq('id', req.userId)
      .select('id, email, full_name, phone, address, city, role, is_active, created_at')
      .single();

    if (error) throw error;
    res.json({ success: true, message: 'Profile updated', user: data });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ============================================================
// PUT /api/users/change-password
// ============================================================
exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res.status(400).json({ error: 'Old and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.userId)
      .single();

    if (error) throw error;

    const isValid = await bcrypt.compare(old_password, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(new_password, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash, updated_at: new Date() })
      .eq('id', req.userId);

    if (updateError) throw updateError;

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
};