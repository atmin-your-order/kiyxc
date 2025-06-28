import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Kirim notifikasi WhatsApp ke admin
    await client.messages.create({
      body: `🚀 Ada permintaan signup baru!\n\n👤 Username: ${username}\n🔐 Password: ${password}\n\nSegera verifikasi dan tambahkan ke sistem!`,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
