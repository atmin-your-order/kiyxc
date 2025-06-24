import supabase from '../../lib/supabase-admin';
import { sendWhatsAppNotification } from '../../lib/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email tidak valid' });
  }

  try {
    // Cek apakah email sudah pernah request sebelumnya
    const { data: existingUser, error: checkError } = await supabase
      .from('access_requests')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) throw new Error(checkError.message);

    if (existingUser) {
      return res.status(409).json({ error: 'Email ini sudah pernah mendaftar.' });
    }

    // Simpan data ke database
    const { data, error } = await supabase.from('access_requests').insert([
  {
    user_id: user_id, // ← tambahkan ini
    email,
    name: name || '',
    status: 'pending',            // ← tambahkan ini
    approved: false,
    created_at: new Date().toISOString(),
    expires_at: null,            // ← tambahkan ini (optional)
  },
]);

    if (error) throw new Error(error.message);

    // Kirim notifikasi WA
    const message = `
📢 *PERMINTAAN AKSES BARU DITERIMA!*

🔐 *Layanan:* Panel Web CPanel Premium
📧 *Email:* ${email}
👤 *Nama:* ${name || '-'}

📝 Pendaftar ini telah mengisi formulir akses panel CPanel.

⚠️ *PERHATIAN ADMIN!*
Jika pendaftar ini *BELUM MELAKUKAN PEMBAYARAN*, 
abaikan permintaan ini dan JANGAN BUATKAN AKUN PANEL.

✅ Jika SUDAH DIBAYAR:
Silakan buat akun di panel dan update statusnya menjadi *approved: true* di database.

—
🤖 *Sistem Otomatis Panel KIYXC*
`;

    const { success, sid } = await sendWhatsAppNotification(message);

    res.status(200).json({
      success: true,
      message: 'Permintaan akses berhasil dikirim!',
      sid,
    });
  } catch (err) {
    console.error('[ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
}
