import { supabaseAdmin } from '../../lib/supabase-admin';
import { sendWhatsAppNotification } from '../../lib/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, email, name } = req.body;

  // Simpan permintaan akses ke Supabase
  const { data, error } = await supabaseAdmin
    .from('access_requests')
    .insert([{ 
      user_id: userId, 
      email,
      name,
      approved: false,
      created_at: new Date().toISOString(),
    }]);

  if (error) {
    console.error('❌ Gagal menyimpan permintaan akses:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat menyimpan ke database.' });
  }

  // Pesan WhatsApp super keren 🚀
  const message = `
🛡️ *[AKSES BARU DIMINTA]* 🛡️

👤 *Nama:* ${name}
📧 *Email:* ${email}
🆔 *User ID:* ${userId}
🗓️ *Waktu:* ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}

📌 Status: *Belum Disetujui*

🛠️ Panel Reseller Siap Digunakan!
Silakan cek dashboard untuk proses *approve* atau *tolak permintaan ini*.

⚙️ *Bot Notifikasi by Ikyy*
`;

  try {
    const { success, sid } = await sendWhatsAppNotification(message);

    if (!success) {
      return res.status(500).json({ error: '❌ Gagal mengirim notifikasi WhatsApp.' });
    }

    return res.status(200).json({
      success: true,
      message: '✅ Permintaan berhasil dikirim!',
      notif_sid: sid,
    });
  } catch (err) {
    console.error('❌ Error saat kirim WA:', err);
    return res.status(500).json({ error: 'Gagal mengirim notifikasi ke WhatsApp.' });
  }
}
