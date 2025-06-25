import supabaseAdmin from '@/lib/supabase-admin';
import { sendWhatsAppNotification } from '@/lib/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1. Sign up user
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;

    // 2. Simpan permintaan akses
    if (authData.user) {
      const { error: dbError } = await supabaseAdmin
        .from('access_requests')
        .insert([{
          user_id: authData.user.id,
          email,
          name: email.split('@')[0] || 'User',
          approved: false,
          created_at: new Date().toISOString()
        }]);

      if (dbError) throw dbError;
    }

    // 3. Kirim notifikasi
    await sendWhatsAppNotification(`New signup: ${email}`);

    return res.status(200).json({ 
      success: true,
      message: 'Signup successful! Waiting for admin approval.' 
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      error: error.message || 'Signup failed',
      code: error.code
    });
  }
}
