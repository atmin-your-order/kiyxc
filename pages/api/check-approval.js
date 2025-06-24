// /pages/api/check-approval.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // HARUS pakai service role
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .select('approved')
    .eq('user_id', userId)
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch approval status' });
  }

  res.status(200).json({ approved: data?.approved });
}
