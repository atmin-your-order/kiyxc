import { supabase } from '@/lib/supabase';
import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;

  try {
    // 1. Simpan request ke database
    const { error } = await supabase
      .from('access_requests')
      .insert([{ email, name }]);

    if (error) throw error;

    // 2. Kirim notifikasi ke admin
    await sendAdminNotification(email, name);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      error: error.message || 'Failed to process request' 
    });
  }
}

async function sendAdminNotification(email, name) {
  const message = `📢 New Access Request:\nEmail: ${email}\nName: ${name}`;
  
  // Kirim via WhatsApp (Twilio)
  const twilio = require('twilio')(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );
  await twilio.messages.create({
    body: message,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${process.env.ADMIN_PHONE}`
  });

  // ... (Tambahkan email/telegram jika perlu)
}
