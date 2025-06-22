import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

export async function sendWhatsAppNotification(message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Nomor sandbox Twilio
      to: 'whatsapp:+6281234567890' // Ganti dengan nomor Anda
    });
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error('Twilio error:', error);
    return { success: false, error: error.message };
  }
}
