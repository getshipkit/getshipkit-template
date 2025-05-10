# Clerk-Supabase Integration Guide

This project uses the native integration between Clerk (for authentication) and Supabase (for database). This document explains the implementation approach.

## Integration Architecture

1. **Native Integration**: We use Clerk's native integration with Supabase, which uses the `requesting_user_id()` function in Supabase to identify users.

2. **Client-Side Integration**: 
   - Use the `useSupabase()` hook from `src/lib/hooks/use-supabase.ts` for client components
   - This hook automatically handles authentication with Clerk and creates a Supabase client

3. **Server-Side Integration**:
   - Use the `createServerSupabaseClient()` function from `src/lib/supabase-auth.ts` for server components and API routes
   - This function gets the Clerk token and attaches it to Supabase requests

4. **User Syncing**:
   - We maintain a `profiles` table in Supabase that mirrors essential user data from Clerk
   - The `/api/auth/sync-user` endpoint is called when a user signs in to keep the data in sync

## Row Level Security (RLS) Policies

Our RLS policies use the `requesting_user_id()` function instead of `auth.uid()` to work with Clerk's tokens:

```sql
-- Example: Allow users to read only their own data
CREATE POLICY "Users can view their own data"
ON table_name
FOR SELECT
TO authenticated
USING (requesting_user_id() = user_id);
```

## Usage Examples

### In Client Components

```tsx
'use client'

import { useSupabase } from '@/lib/hooks/use-supabase'
import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const supabase = useSupabase()
  const [data, setData] = useState(null)
  
  useEffect(() => {
    if (!supabase) return
    
    async function fetchData() {
      const { data, error } = await supabase
        .from('your_table')
        .select('*')
      
      if (!error) {
        setData(data)
      }
    }
    
    fetchData()
  }, [supabase])
  
  return <div>{/* Your component JSX */}</div>
}
```

### In Server Components or API Routes

```tsx
import { createServerSupabaseClient } from '@/lib/supabase-auth'

export async function GET() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*')
  
  // Handle data and errors
}
```

## Security Considerations

1. The Clerk token is automatically added to Supabase requests
2. RLS policies ensure users can only access their own data
3. The native integration provides better security than the JWT template approach 