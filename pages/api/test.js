import supabase from '../../lib/supabase-admin';

export default async function handler(req, res) {
  const { error } = await supabase.from('access_requests').insert([{
    user_id: crypto.randomUUID(),
    email: 'test@test.com',
    name: 'Test User',
    status: 'pending',
    approved: false,
    created_at: new Date().toISOString(),
    expires_at: null,
  }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
}
