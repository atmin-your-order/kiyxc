import { sendWhatsAppNotification } from '@/lib/notify';

export default async function handler(req, res) {
  const { success, error } = await sendWhatsAppNotification('🔔 TEST: Pesan dari Twilio');
  if (success) {
    res.status(200).json({ message: 'Notifikasi terkirim!' });
  } else {
    res.status(500).json({ error });
  }
}
