import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⛔ JANGAN pakai anon key
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId diperlukan' });

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ approved: true })
    .eq('id', userId);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true });
}
