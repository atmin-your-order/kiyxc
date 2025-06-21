import config from '../../config.json'

export default async function handler(req, res) {
  // Hanya terima POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya menerima method POST' })
  }

  try {
    // Validasi data yang diterima
    const requiredFields = ['owner', 'username', 'ram', 'cpu', 'password', 'panel']
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ 
          error: `Field ${field} harus diisi`,
          contoh_format: {
            owner: "Nama Owner",
            username: "username_panel",
            ram: 1024, // dalam MB (0 untuk unlimited)
            cpu: 100, // dalam persen (0 untuk unlimited)
            password: "password123",
            panel: "https://panel.domain.com"
          }
        })
      }
    }

    // Format pesan Telegram
    const msg = `🔥 PANEL BARU DIBUAT 🔥

👤 Owner: ${req.body.owner}
🖥️ Username: ${req.body.username}
💾 RAM: ${req.body.ram == 0 ? 'Unlimited' : `${req.body.ram}MB`} | CPU: ${req.body.cpu == 0 ? 'Unlimited' : `${req.body.cpu}%`}
🔐 Password: ${req.body.password}
🌐 Panel: ${req.body.panel}

🕒 Dikirim otomatis via API
👑 By: IKYY TEAM`

    // Kirim ke Telegram
    const { token, chat_id } = config.telegram
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        text: msg,
        parse_mode: 'HTML'
      })
    })

    const telegramData = await telegramResponse.json()

    if (!telegramResponse.ok) {
      throw new Error(`Gagal mengirim ke Telegram: ${telegramData.description}`)
    }

    res.status(200).json({
      success: true,
      message: 'Panel berhasil dibuat dan notifikasi terkirim ke Telegram!',
      telegramResponse: telegramData
    })

  } catch (err) {
    res.status(500).json({ 
      error: 'Terjadi kesalahan',
      detail: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
  }
}
