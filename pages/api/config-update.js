import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  const configPath = path.resolve('./config.json')

  try {
    const { domain, apikey, nodeName, nestName, eggName } = req.body

    if (!domain || !apikey || !nodeName || !nestName || !eggName) {
      return res.status(400).json({ error: 'Semua field wajib diisi' })
    }

    const configBaru = {
      domain,
      apikey,
      nodeName,
      nestName,
      eggName
    }

    fs.writeFileSync(configPath, JSON.stringify(configBaru, null, 2))

    res.status(200).json({ success: true, message: 'Config berhasil diperbarui!' })

  } catch (err) {
    res.status(500).json({ error: 'Gagal update config', detail: err.message })
  }
  }
