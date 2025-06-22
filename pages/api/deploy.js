import crypto from 'crypto';
import { CONFIG } from './config';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, ram, cpu } = req.body;
  if (!username || !ram || !cpu) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  try {
    const password = crypto.randomBytes(3).toString('hex');
    const ramInt = parseInt(ram);
    const cpuInt = parseInt(cpu);
    const disk = ramInt;
    const user = username.toLowerCase();

    const headers = {
      Authorization: `Bearer ${CONFIG.apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    // 1. Cari Node
    const nodeRes = await fetch(`${CONFIG.panel}/api/application/nodes`, { headers });
    const node = (await nodeRes.json()).data.find(n =>
      n.attributes.name.toLowerCase() === CONFIG.nodeName.toLowerCase()
    );
    if (!node) return res.status(404).json({ error: 'Node tidak ditemukan' });

    // 2. Cari Allocation Kosong
    const allocRes = await fetch(`${CONFIG.panel}/api/application/nodes/${node.attributes.id}/allocations`, { headers });
    const allocations = (await allocRes.json()).data.filter(a => !a.attributes.assigned);
    if (!allocations.length) return res.status(404).json({ error: 'Tidak ada port kosong di node ini.' });
    const alloc = allocations[0]; // ambil pertama

    // 3. Cari Nest
    const nestRes = await fetch(`${CONFIG.panel}/api/application/nests`, { headers });
    const nest = (await nestRes.json()).data.find(n =>
      n.attributes.name.toLowerCase() === CONFIG.nestName.toLowerCase()
    );
    if (!nest) return res.status(404).json({ error: 'Nest tidak ditemukan' });

    // 4. Cari Egg
    const eggRes = await fetch(`${CONFIG.panel}/api/application/nests/${nest.attributes.id}/eggs`, { headers });
    const egg = (await eggRes.json()).data.find(e =>
      e.attributes.name.toLowerCase() === CONFIG.eggName.toLowerCase()
    );
    if (!egg) return res.status(404).json({ error: 'Egg tidak ditemukan' });

    // 5. Buat User
    const userRes = await fetch(`${CONFIG.panel}/api/application/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: `${user}${CONFIG.defaultEmailDomain}`,
        username: user,
        first_name: `${user} Server`,
        last_name: 'Bot',
        language: 'en',
        password
      })
    });
    const userData = await userRes.json();
    if (userData.errors) return res.status(400).json({ error: userData.errors[0] });

    // 6. Buat Server
    const srvRes = await fetch(`${CONFIG.panel}/api/application/servers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: `${user} Server`,
        user: userData.attributes.id,
        egg: egg.attributes.id,
        nest: nest.attributes.id,
        startup: egg.attributes.startup,
        docker_image: CONFIG.defaultDockerImage,
        environment: {
          INST: 'npm',
          USER_UPLOAD: '0',
          AUTO_UPDATE: '0',
          CMD_RUN: 'npm start'
        },
        limits: {
          memory: ramInt,
          swap: 0,
          disk,
          io: CONFIG.defaultLimits.io,
          cpu: cpuInt
        },
        feature_limits: {
          databases: CONFIG.defaultLimits.databases,
          backups: CONFIG.defaultLimits.backups,
          allocations: CONFIG.defaultLimits.allocations
        },
        deploy: {
          locations: [node.attributes.id],
          dedicated_ip: false,
          port_range: []
        },
        allocation: alloc.attributes.id
      })
    });

    const serverData = await srvRes.json();
    if (serverData.errors) return res.status(400).json({ error: serverData.errors[0] });

    // 7. Sukses
    res.status(200).json({
      success: true,
      username: user,
      password,
      resources: {
        ram: `${ramInt} MB`,
        cpu: `${cpuInt}%`,
        disk: `${disk} MB`
      },
      panel: CONFIG.panel,
      serverId: serverData.attributes.id,
      node: node.attributes.name,
      allocation: `${alloc.attributes.ip}:${alloc.attributes.port}`
    });

  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({
      error: 'Terjadi kesalahan sistem',
      detail: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
        }
