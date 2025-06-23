import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email wajib diisi' });

  try {
    const { error } = await supabaseAdmin
      .from('profiles') // ganti dengan nama tabel user kamu jika bukan 'profiles'
      .update({ approved: true })
      .eq('email', email);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'User berhasil di-approve' });
  } catch (err) {
    console.error('[APPROVE ERROR]', err.message);
    res.status(500).json({ error: 'Gagal approve user' });
  }
}
