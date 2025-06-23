import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const token = req.headers.token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' })
  }

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' })
  }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden: Admin only' })
  }

  // Aman, lanjut query
  const { data, error: queryError } = await supabase
    .from('Users')
    .select('*')
    .eq('approved', false)

  if (queryError) {
    return res.status(200).json({ data: [], warning: 'Query error / table not found' })
  }

  return res.status(200).json({ data })
}
