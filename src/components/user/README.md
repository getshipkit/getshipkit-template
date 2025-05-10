# User Components

This directory contains components related to user management and authentication.

## Components

- **UserSync**: Background component that syncs Clerk user data to Supabase

## Usage

```tsx
import { UserSync } from "@/components/user";

// Add to app layout to ensure user data is synchronized
<Layout>
  <UserSync />
  <Content />
</Layout>
```

## Adding New User Components

When adding new user-related components:

1. Create the component in this directory
2. Export it in the index.ts file
3. Update this README to document the new component 