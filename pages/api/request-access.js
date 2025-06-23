import { supabase } from '../../lib/supabase';
import { sendWhatsAppNotification } from '../../lib/notify';
import { supabaseAdmin } from '../../lib/supabase-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;

  console.log('[DEBUG] Email:', email);
  console.log('[DEBUG] Name:', name);

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email tidak valid' });
  }

  try {
    const { error } = await supabase
      .from('access_requests')
      .insert([{ email, name }]);

    if (error) {
      console.error('SUPABASE INSERT ERROR:', error.message);
      return res.status(400).json({ error: error.message });
    }

    const message = `📢 *REQUEST AKSES BARU*\n\nEmail: ${email}\nNama: ${name || '-'}\n\nSegera cek di dashboard admin!`;
    const { success, sid } = await sendWhatsAppNotification(message);

    if (!success) {
      await sendEmailFallback(email, name);
    }

    res.status(200).json({ success: true, sid });
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
}
