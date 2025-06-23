// lib/supabase-admin.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('[DEBUG] SERVICE ROLE KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 10) + '...');

export default supabase;
