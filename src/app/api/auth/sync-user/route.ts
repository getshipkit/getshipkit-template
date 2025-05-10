import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-auth'

export async function GET() {
  try {
    const { userId } = await auth()
    
    // If the user isn't authenticated, return 401
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the current user from Clerk
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Extract user data
    const email = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId)?.emailAddress
    const firstName = user.firstName
    const lastName = user.lastName
    
    // Create an authenticated Supabase client using the native integration
    const supabase = createServerSupabaseClient()
    
    // Insert or update the user in the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'user_id' 
      })
      .select()
    
    if (error) {
      console.error('Error syncing user details:', error.message)
      console.error('Error code:', error.code)
      return NextResponse.json({ 
        error: 'Failed to sync user', 
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, user: data[0] })
  } catch (error) {
    console.error('Error in sync-user route:', error)
    // Convert error to string in a safe way
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: errorMessage
      }, 
      { status: 500 }
    )
  }
} 