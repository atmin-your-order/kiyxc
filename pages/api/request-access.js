import { supabase } from '@/lib/supabase';
import { sendWhatsAppNotification } from '@/lib/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;

  // 1. Simpan request ke database
  const { error } = await supabase
    .from('access_requests')
    .insert([{ email, name }]);

  if (error) {
    return res.status(400).json({ error: 'Email sudah terdaftar' });
  }

  // 2. Kirim notifikasi WhatsApp
  const message = `📢 *REQUEST AKSS BARU*\n\nEmail: ${email}\nNama: ${name || '-'}\n\nSegera cek di dashboard admin!`;
  const { success, sid } = await sendWhatsAppNotification(message);

  if (!success) {
    // Fallback ke email jika WhatsApp gagal
    await sendEmailFallback(email, name);
  }

  res.status(200).json({ success: true, sid });
}
