import { supabaseAdmin } from '@/lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('access_requests')
      .select('approved')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return res.status(200).json({ 
      approved: data?.approved || false 
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: error.message || 'Failed to check approval status' 
    });
  }
}
