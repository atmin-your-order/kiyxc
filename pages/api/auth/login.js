import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validasi input
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required',
      code: 'MISSING_CREDENTIALS'
    });
  }

  try {
    // 1. Login dengan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // 2. Dapatkan session lengkap
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // 3. Verifikasi user ID ada
    if (!data.user?.id) {
      throw new Error('User ID not found in response');
    }

    // 4. Cek status approval (contoh)
    const { data: approvalData, error: approvalError } = await supabase
      .from('access_requests')
      .select('approved')
      .eq('user_id', data.user.id)
      .single();

    if (approvalError || !approvalData?.approved) {
      await supabase.auth.signOut();
      return res.status(403).json({
        error: 'Account not approved yet',
        code: 'ACCOUNT_PENDING_APPROVAL'
      });
    }

    // 5. Return response aman
    return res.status(200).json({
      user: {
        id: data.user.id,
        email: data.user.email
      },
      session
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: error.message,
      code: error.code || 'LOGIN_FAILED'
    });
  }
}
