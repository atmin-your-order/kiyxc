import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.kiizuebvqeucyksorsfu_SUPABASE_URL;
const supabaseKey = process.env.kiizuebvqeucyksorsfu_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});
