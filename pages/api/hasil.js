// File: telegram-bot.js
import fetch from 'node-fetch';

// Konfigurasi langsung dalam kode (bisa di-obfuscate nanti)
const CONFIG = {
  TELEGRAM: {
    TOKEN: "7787192883:AAHTxCGcJMv84Vx-Lb54cyvLW-Ou6uyUwmY",
    CHAT_ID: "7926105928"
  },
  PANEL_INFO: {
    DOMAIN: "https://domainpanelkamu",
    NODE_NAME: "node by atraxz"
  }
};

export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed',
      message: 'Hanya menerima method POST'
    });
  }

  try {
    // Validasi data input
    const requiredFields = ['owner', 'username', 'ram', 'cpu', 'password'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: `Field ${field} harus diisi`,
          contoh_format: {
            owner: "Nama Owner",
            username: "username_panel",
            ram: 1024, // dalam MB (0 untuk unlimited)
            cpu: 100, // dalam persen (0 untuk unlimited)
            password: "password123"
          }
        });
      }
    }

    // Format pesan Telegram
    const msg = `🔥 PANEL BARU DIBUAT 🔥

👤 Owner: ${req.body.owner}
🖥️ Username: ${req.body.username}
💾 RAM: ${req.body.ram == 0 ? 'Unlimited' : `${req.body.ram}MB`} 
💻 CPU: ${req.body.cpu == 0 ? 'Unlimited' : `${req.body.cpu}%`}
🔐 Password: ${req.body.password}
🌐 Panel: ${CONFIG.PANEL_INFO.DOMAIN}

📡 Node: ${CONFIG.PANEL_INFO.NODE_NAME}
🕒 Dikirim otomatis via API
👑 By: IKYY TEAM`;

    // Kirim ke Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${CONFIG.TELEGRAM.TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM.CHAT_ID,
          text: msg,
          parse_mode: 'HTML'
        })
      }
    );

    const responseData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Gagal mengirim ke Telegram:', responseData);
      throw new Error(`Telegram API error: ${responseData.description}`);
    }

    console.log('Pesan terkirim:', responseData);
    return res.status(200).json({
      success: true,
      message: 'Panel berhasil dibuat dan notifikasi terkirim ke Telegram!',
      telegram_response: responseData
    });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ 
      error: 'Terjadi kesalahan',
      detail: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
