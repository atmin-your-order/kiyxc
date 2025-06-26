import supabaseAdmin from '@/lib/supabase-admin';

export default async function handler(req, res) {
  try {
    const { data, error } = await supabaseAdmin
      .from('access_requests')
      .select('*')
      .limit(1);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
