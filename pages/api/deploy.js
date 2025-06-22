import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, ram, cpu } = req.body;
  if (!username || !ram || !cpu) return res.status(400).json({ error: 'Semua field wajib diisi' });

  const panelURL = 'https://kenjapublic.digital-market.web.id';
  const apiKey = 'ptla_R4Mg8FWtKRoSgfgiIcaSjfeVboP5mJZxp4VtZ2PYnkL';
  const password = crypto.randomBytes(3).toString('hex');
  const ramInt = parseInt(ram);
  const cpuInt = parseInt(cpu);
  const disk = ramInt;
  const user = username.toLowerCase();

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    // Mendapatkan node
    const nodeRes = await fetch(`${panelURL}/api/application/nodes`, { headers });
    const nodeJson = await nodeRes.json();
    const node = nodeJson.data.find(n => n.attributes.name.toLowerCase() === 'nodes');
    if (!node) return res.status(404).json({ error: 'Node tidak ditemukan' });
    const nodeId = node.attributes.id;

    // Mendapatkan allocation
    const allocRes = await fetch(`${panelURL}/api/application/nodes/${nodeId}/allocations`, { headers });
    const allocJson = await allocRes.json();
    const alloc = allocJson.data.find(a => !a.attributes.assigned);
    if (!alloc) return res.status(404).json({ error: 'Allocation kosong tidak tersedia' });
    const allocation = alloc.attributes.id;

    // Mendapatkan nest
    const nestRes = await fetch(`${panelURL}/api/application/nests`, { headers });
    const nestJson = await nestRes.json();
    const nest = nestJson.data.find(n => n.attributes.name.toLowerCase() === 'untuk bot whatsapp');
    if (!nest) return res.status(404).json({ error: 'Nest tidak ditemukan' });
    const nestId = nest.attributes.id;

    // Mendapatkan egg
    const eggRes = await fetch(`${panelURL}/api/application/nests/${nestId}/eggs`, { headers });
    const eggJson = await eggRes.json();
    const egg = eggJson.data.find(e => e.attributes.name.toLowerCase() === 'naofumi');
    if (!egg) return res.status(404).json({ error: 'Egg tidak ditemukan' });
    const eggId = egg.attributes.id;
    const startup = egg.attributes.startup;

    // Membuat user
    const userRes = await fetch(`${panelURL}/api/application/users`, {
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
    });

    const userJson = await userRes.json();
    if (userJson.errors) return res.status(400).json({ error: userJson.errors[0] });
    const userId = userJson.attributes.id;

    // Membuat server
    const srvRes = await fetch(`${panelURL}/api/application/servers`, {
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
    });

    const srvJson = await srvRes.json();
    if (srvJson.errors) return res.status(400).json({ error: srvJson.errors[0] });

    res.status(200).json({
      success: true,
      username: user,
      password,
      ram: `${ramInt} MB`,
      cpu: `${cpuInt}%`,
      disk: `${disk} MB`,
      panel: panelURL
    });

  } catch (e) {
    res.status(500).json({ error: 'Terjadi error', detail: e.message });
  }
}
