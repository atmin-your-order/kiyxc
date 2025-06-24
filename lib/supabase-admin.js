// lib/supabase-admin.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.kiizuebvqeucyksorsfu_SUPABASE_URL, // URL tetap boleh public
  process.env.kiizuebvqeucyksorsfu_SUPABASE_SERVICE_ROLE_KEY // Aman karena hanya di server-side
);

export default supabases;
