import { sendWhatsAppNotification } from '../../lib/notify';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;

  console.log('[DEBUG] Email:', email);
  console.log('[DEBUG] Name:', name);

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email tidak valid' });
  }

  const message = `
📢 *REQUEST SIGN UP*

📧 Email: ${email}
👤 Nama: ${name || '-'}

Segera cek dashboard admin untuk menyetujui!`;

  try {
    const { success, sid } = await sendWhatsAppNotification(message);

    if (!success) {
      console.warn('Gagal kirim WA. Fallback email akan digunakan.');
      await sendEmailFallback?.(email, name); // optional, if defined
    }

    res.status(200).json({ success: true, sid });
  } catch (err) {
    console.error('UNEXPECTED ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
}
