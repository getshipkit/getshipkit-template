import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with admin privileges for server-side use
// This bypasses RLS and should be used carefully, only in server-side code
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  
  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables');
    throw new Error('Missing service role key for Supabase admin client');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
} 