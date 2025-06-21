import fs from 'fs'
import path from 'path'
import config from '../../config.json'

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })

  try {
    const filePath = path.resolve('./database.json')
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Data tidak ditemukan' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)

    if (!data.length) return res.status(404).json({ error: 'Data kosong' })

    const latest = data[data.length - 1] // Ambil data terakhir

    // Format pesan Telegram
    const msg = `🔥 AKUN PANEL TERBARU 🔥

👤 Owner: ${latest.owner}
🖥️ Username: ${latest.username}
💾 RAM: ${latest.ram == 0 ? 'Unlimited' : `${latest.ram}MB`} | CPU: ${latest.cpu == 0 ? 'Unlimited' : `${latest.cpu}%`}
🔐 Password: ${latest.password}
🌐 Panel: ${latest.panel}

🕒 Dikirim otomatis via API hasil.js
👑 By: IKYY`

    const { token, chat_id } = config.telegram

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        text: msg,
        parse_mode: 'HTML'
      })
    })

    res.status(200).json({
      success: true,
      message: 'Data terbaru berhasil dikirim ke Telegram!',
      latest
    })
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan', detail: err.message })
  }
}
