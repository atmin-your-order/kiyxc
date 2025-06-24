// /pages/api/check-approval.js
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '../../lib/supabase-admin';

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
