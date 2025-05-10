'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { SupabaseClient, createClient } from '@supabase/supabase-js'

/**
 * Custom hook for using Supabase in client components with Clerk authentication
 * This hook provides a properly authenticated Supabase client that stays in sync
 * with the Clerk authentication state
 */
export function useSupabase() {
  const { getToken, isSignedIn, isLoaded } = useAuth()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  
  useEffect(() => {
    if (!isLoaded) return
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    // Create a Supabase client with the Clerk auth
    const supabaseClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: '',
        },
        async fetch(url, options = {}) {
          const headers = new Headers(options.headers)
          
          if (isSignedIn) {
            try {
              // Get the token directly from Clerk
              const token = await getToken()
              if (token) {
                headers.set('Authorization', `Bearer ${token}`)
              }
            } catch (error) {
              console.error('Failed to get Clerk token:', error)
            }
          }
          
          return fetch(url, {
            ...options,
            headers,
          })
        },
      },
    })
    
    setSupabase(supabaseClient)
  }, [isLoaded, isSignedIn, getToken])
  
  return supabase
} 