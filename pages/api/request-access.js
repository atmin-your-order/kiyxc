import { supabaseAdmin } from '../../lib/supabase-admin'
import { sendWhatsAppNotification } from '../../lib/notify';

export default async function handler(req, res) {
  const { userId, email, name } = req.body;

  // Gunakan supabaseAdmin untuk bypass RLS
  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .insert([{ 
      user_id: userId, 
      email, 
      name,
      approved: false // default status
    }]);

  if (error) {
    console.error('Error inserting access request:', error);
    return res.status(500).json({ error: error.message });
  }

  // Kirim notifikasi ke admin (contoh via email)
  const { success, sid } = await sendWhatsAppNotification;

  res.status(200).json({ success: true });
}
