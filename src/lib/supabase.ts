import { createClient } from '@supabase/supabase-js';
import { createClientSupabaseClient, createServerSupabaseClient } from './supabase-auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Basic unauthenticated client - only for public data
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export our authenticated clients
export { createClientSupabaseClient, createServerSupabaseClient }; 