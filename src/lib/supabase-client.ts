import { createClient } from '@supabase/supabase-js';

// Make sure these environment variables are available to the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a client-side only Supabase client
export const supabaseClient = createClient(supabaseUrl, supabaseKey); 