import { createClient } from '@supabase/supabase-js'

// Pastikan export-nya sebagai named export
export const supabaseAdmin = createClient(
  process.env.kiizuebvqeucyksorsfu_SUPABASE_URL,
  process.env.kiizuebvqeucyksorsfu_SUPABASE_SERVICE_ROLE_KEY
);
