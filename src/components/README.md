# Components Directory

This directory contains all reusable UI components organized into logical categories.

## Organization

Components are organized into the following categories:

- **layout**: Base layout components like `Navbar` and `Footer`
- **sections**: Page section components used across the application
- **pricing**: Components related to the pricing system and plans
- **subscription**: Components for subscription management and access control
- **user**: User-related components like authentication and profile

## Usage

Import components through the main index file to get the benefits of tree-shaking and organization:

```tsx
// Recommended approach - import from the main components index
import { Navbar, Footer } from "@/components";

// Alternative - import from specific category
import { PricingCards } from "@/components/pricing";
```

## Adding New Components

1. Create the component in the appropriate folder
2. Export it in the folder's index.ts file
3. Make sure it's properly exported in the main components/index.ts file

This structure makes it easy to find and maintain components as the application grows. 