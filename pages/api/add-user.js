// pages/api/add-user.js
import fs from 'fs'
import path from 'path'

const dbPath = path.resolve('./database.json')

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { username, password, role } = req.body
    if (!username || !password || !role)
      return res.status(400).json({ error: 'Semua field wajib diisi' })

    const users = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
    const isExist = users.find(u => u.username === username)

    if (isExist) {
      return res.status(409).json({ error: 'Username sudah terdaftar' })
    }

    users.push({ username, password, role })
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2))

    res.status(200).json({ success: true, message: 'User berhasil ditambahkan!' })

  } catch (err) {
    res.status(500).json({ error: 'Gagal menambah user', detail: err.message })
  }
}
