// pages/api/access-request.js
import supabase from '@/lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, reason } = req.body;

  if (!username || !reason) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('access_requests')
    .insert([{ username, reason }]);

  if (error) {
    console.error('[Supabase Error]', error);
    return res.status(500).json({ error: 'Failed to insert data' });
  }

  return res.status(200).json({ message: 'Request submitted', data });
}
