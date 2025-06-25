import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.kiizuebvqeucyksorsfu_SUPABASE_URL,
  process.env.kiizuebvqeucyksorsfu_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

export default supabaseAdmin;
