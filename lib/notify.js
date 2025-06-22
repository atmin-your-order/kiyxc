import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_SID, 
  process.env.TWILIO_TOKEN
);

export async function sendWhatsAppNotification(message) {
  try {
    // 1. Cek nomor tujuan dan format
    const toNumber = 'whatsapp:+6283133328750'; // Pastikan format benar: whatsapp:+62...
    console.log('Mengirim ke:', toNumber); // Log nomor tujuan
    
    // 2. Kirim pesan
    const response = await client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Nomor sandbox Twilio
      to: toNumber
    });

    console.log('Pesan terkirim! SID:', response.sid); // Log keberhasilan
    return { success: true, sid: response.sid };
  } catch (error) {
    // 3. Tangkap error detail
    console.error('Gagal kirim WA:', {
      message: error.message,
      code: error.code,
      moreInfo: error.moreInfo
    });
    return { success: false, error: error.message };
  }
}
