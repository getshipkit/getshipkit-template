# UI Components

This directory contains reusable UI components that are used throughout the application.

## Components

- **Button**: Basic button component with multiple variants
- **Card**: Card component with header, content, and footer
- **Badge**: Badge component for displaying status and labels
- **Skeleton**: Loading skeleton for content
- **ThemeToggle**: Toggle switch for dark/light mode theme selection

## Usage

```tsx
import { Button, Card, Badge, Skeleton, ThemeToggle } from "@/components/ui";

// Or through the main components export
import { Button, Card, Badge, Skeleton, ThemeToggle } from "@/components";

// Example usage
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Badge>Active</Badge>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
    <ThemeToggle />
  </CardFooter>
</Card>
```

## Adding New UI Components

When adding new UI components:

1. Create the component in this directory
2. Export it in the index.ts file
3. Update this README to document the new component 