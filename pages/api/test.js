import supabase from '../../lib/supabase-admin'

export default async function handler(req, res) {
  console.log('Using service_role:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Yes' : 'No');

  const { data, error } = await supabase.from('access_requests').select('*')
  if (error) {
    console.error('Supabase Error:', error)
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ data })
}
