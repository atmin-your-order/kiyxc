// Di file lib/notify.js
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Test kirim pesan manual
async function testSendWhatsApp() {
  try {
    const message = await client.messages.create({
      body: '🔔 TEST: Notifikasi WhatsApp',
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+6283133328750' // Ganti dengan nomor Anda
    });
    console.log('Pesan terkirim! SID:', message.sid);
    return true;
  } catch (error) {
    console.error('Error Twilio:', error.message);
    return false;
  }
}

testSendWhatsApp(); // Jalankan fungsi test ini
