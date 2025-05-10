import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/nextjs'

// Custom hook for client-side Supabase client (to be used in client components)
export function useSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const { getToken } = useAuth()
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: '',
      },
      async fetch(input, init) {
        // Get token directly from Clerk hook - more efficient than an API call
        const token = await getToken()
        
        // Merge the Authorization header with any existing headers
        const headers = new Headers(init?.headers)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        
        // Return the fetch request with the updated headers
        return fetch(input, {
          ...init,
          headers,
        })
      },
    },
  })
}

// For compatibility with existing code
export function createClientSupabaseClient() {
  console.warn('createClientSupabaseClient is deprecated. Use useSupabaseClient hook instead.')
  // This function should only be called from components that use the hook
  // It's here for backward compatibility
  return null
}

// Server-side Supabase client (to be used in server components or route handlers)
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: '',
      },
      async fetch(input, init) {
        // Get the token from Clerk - using native integration
        const { getToken } = await auth()
        const token = await getToken()
        
        // Merge the Authorization header with any existing headers
        const headers = new Headers(init?.headers)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        
        // Return the fetch request with the updated headers
        return fetch(input, {
          ...init,
          headers,
        })
      },
    },
  })
} 