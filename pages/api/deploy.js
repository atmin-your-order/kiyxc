import crypto from 'crypto'
import config from '../../config.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { username, ram, cpu } = req.body
  if (!username || !ram || !cpu) {
    return res.status(400).json({ success: false, error: 'Semua field wajib diisi' })
  }

  const panel = config.domain
  const apiKey = config.apikey
  const nodeName = config.nodeName.toLowerCase()
  const nestName = config.nestName.toLowerCase()
  const eggName = config.eggName.toLowerCase()
  const password = crypto.randomBytes(3).toString('hex')
  const ramInt = parseInt(ram)
  const cpuInt = parseInt(cpu)
  const disk = ramInt
  const user = username.toLowerCase()

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }

  try {
    // GET NODE
    const nodeRes = await fetch(`${panel}/api/application/nodes`, { headers })
    const nodeJson = await nodeRes.json()
    const node = nodeJson.data.find(n => n.attributes.name.toLowerCase() === nodeName)
    if (!node) return res.status(404).json({ success: false, error: 'Node tidak ditemukan' })
    const nodeId = node.attributes.id

    // GET ALLOCATION
    const allocRes = await fetch(`${panel}/api/application/nodes/${nodeId}/allocations`, { headers })
    const allocJson = await allocRes.json()
    const alloc = allocJson.data.find(a => !a.attributes.assigned)
    if (!alloc) return res.status(404).json({ success: false, error: 'Allocation kosong tidak tersedia' })
    const allocation = alloc.attributes.id

    // GET NEST
    const nestRes = await fetch(`${panel}/api/application/nests`, { headers })
    const nestJson = await nestRes.json()
    const nest = nestJson.data.find(n => n.attributes.name.toLowerCase() === nestName)
    if (!nest) return res.status(404).json({ success: false, error: 'Nest tidak ditemukan' })
    const nestId = nest.attributes.id

    // GET EGG
    const eggRes = await fetch(`${panel}/api/application/nests/${nestId}/eggs`, { headers })
    const eggJson = await eggRes.json()
    const egg = eggJson.data.find(e => e.attributes.name.toLowerCase() === eggName)
    if (!egg) return res.status(404).json({ success: false, error: 'Egg tidak ditemukan' })
    const eggId = egg.attributes.id
    const startup = egg.attributes.startup

    // BUAT USER
    const userRes = await fetch(`${panel}/api/application/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: `${user}@gmail.com`,
        username: user,
        first_name: `${user} Server`,
        last_name: 'Bot',
        language: 'en',
        password
      })
    })
    const userJson = await userRes.json()
    if (userJson.errors) {
      console.error('❌ ERROR BUAT USER:', userJson.errors[0])
      return res.status(400).json({ success: false, error: userJson.errors[0] })
    }
    const userId = userJson.attributes.id

    // BUAT SERVER
    const srvRes = await fetch(`${panel}/api/application/servers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: `${user} Server`,
        user: userId,
        egg: eggId,
        nest: nestId,
        startup,
        docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
        environment: {
          INST: 'npm',
          USER_UPLOAD: '0',
          AUTO_UPDATE: '0',
          CMD_RUN: 'npm start'
        },
        limits: {
          memory: ramInt,
          swap: 0,
          disk: disk,
          io: 500,
          cpu: cpuInt
        },
        feature_limits: {
          databases: 2,
          backups: 2,
          allocations: 1
        },
        deploy: {
          locations: [nodeId],
          dedicated_ip: false,
          port_range: []
        },
        allocation
      })
    })

    const srvJson = await srvRes.json()
    if (srvJson.errors) {
      console.error('❌ ERROR BUAT SERVER:', srvJson.errors[0])
      return res.status(400).json({ success: false, error: srvJson.errors[0] })
    }

    // Sukses
    return res.status(200).json({
      success: true,
      username: user,
      password,
      ram: ramInt,
      cpu: cpuInt,
      disk,
      panel
    })

  } catch (e) {
    console.error('🔥 ERROR SYSTEM:', e)
    return res.status(500).json({ success: false, error: 'Terjadi error internal', detail: e.message })
  }
}
