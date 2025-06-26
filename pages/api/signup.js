import twilio from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const fromNumber = 'whatsapp:+14155238886'; // Twilio default sender
const toNumber = process.env.NOTIF_PHONE;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi.' });
  }

  try {
    const message = `📝 [SIGNUP BARU]
Username: ${username}
Password: ${password}

Segera verifikasi dan tambahkan ke daftar user jika sudah bayar.`;

    await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });

    res.status(200).json({ message: 'Notifikasi dikirim ke admin.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengirim notifikasi WA.' });
  }
}
