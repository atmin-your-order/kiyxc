//iky full power

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role dari Supabase
);

console.log('[DEBUG] SERVICE ROLE KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) + '...');

export { supabaseAdmin };
