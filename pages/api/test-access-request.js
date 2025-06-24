// pages/api/test-access-request.js
import supabaseAdmin from '../../lib/supabase-admin'

export default async function handler(req, res) {
  const { user_id } = req.query  // tes bisa lewat query param

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' })
  }

  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({ data })
}
