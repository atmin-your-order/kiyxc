// File: pages/api/config.js
export const CONFIG = {
  // Panel Pterodactyl kamu
  panel: 'https://kenjapublicantiddos.freezee.biz.id', // Ganti ke domain panel kamu

  // API Key dari admin panel Pterodactyl (Application API Key)
  apiKey: 'ptla_WNQY5xBLAYF40mm1YuvPT2npMpsT8xcftCMdt3FXVKt', // Gunakan yang valid dan aktif

  // Nama node, nest, dan egg yang akan dipakai untuk deployment
  nodeName: 'node by atraxz',       // Nama node tempat server dibuat
  nestName: 'untuk bot whatsapp',   // Nama nest yang kamu pakai
  eggName: 'naofumi',               // Nama egg/script server

  // Image docker default (pakai Node.js 18)
  defaultDockerImage: 'ghcr.io/parkervcp/yolks:nodejs_18',

  // Email default untuk pendaftaran akun user (dibuat otomatis dari username)
  defaultEmailDomain: '@gmail.com',

  // Batasan default (I/O, database, backup, allocation)
  defaultLimits: {
    io: 500,
    databases: 0,
    backups: 0,
    allocations: 0
  }
};
