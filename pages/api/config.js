// File: pages/api/config.js
export const CONFIG = {
  panel: 'https://kenjapublicantiddos.freezee.biz.id', // Domain panel
  apiKey: 'ptla_23LI2QemzEAnAVEt1gvqG1B6Finqntn32kpRSks26Nl',
  eggName: 'naofumi', // Nama egg yang dicari
  nodeName: 'node by atraxz', // Nama node yang dicari
  nestName: 'bot whatsapp', // Nama nest yang dicari
  // Konfigurasi tambahan
  defaultDockerImage: 'ghcr.io/parkervcp/yolks:nodejs_18',
  defaultEmailDomain: '@gmail.com',
  defaultLimits: {
    io: 500,
    databases: 0,
    backups: 0,
    allocations: 0
  }
};
