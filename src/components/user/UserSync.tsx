'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'

/**
 * UserSync component that synchronizes Clerk user data to Supabase
 * This component renders nothing but handles the sync process in the background
 */
export default function UserSync() {
  const { isSignedIn, isLoaded } = useAuth()
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [lastSynced, setLastSynced] = useState<Date | null>(null)

  useEffect(() => {
    if (isLoaded && isSignedIn && syncStatus === 'idle') {
      // Set status to syncing
      setSyncStatus('syncing')
      
      // Call our sync-user API endpoint
      fetch('/api/auth/sync-user')
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(`Failed to sync user: ${errorData.error || res.status}`)
          }
          return res.json()
        })
        .then(data => {
          console.log('User synced successfully', data)
          setSyncStatus('success')
          setLastSynced(new Date())
        })
        .catch(error => {
          console.error('Error syncing user:', error)
          setSyncStatus('error')
          
          // Try again after a delay
          setTimeout(() => {
            setSyncStatus('idle')
          }, 5000)
        })
    }
  }, [isSignedIn, isLoaded, syncStatus])

  // This component doesn't render anything
  return null
} 