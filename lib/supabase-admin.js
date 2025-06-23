import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.kiizuebvqeucyksorsfu_NEXT_PUBLIC_SUPABASE_URL,
  process.env.kiizuebvqeucyksorsfu_SUPABASE_SERVICE_ROLE_KEY // service role dari Supabase
);

export { supabaseAdmin };
