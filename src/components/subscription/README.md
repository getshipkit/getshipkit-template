# Subscription Components

This directory contains components related to subscription management and access control.

## Components

- **SubscriptionGuard**: Protection component that restricts access based on subscription status
- **SubscriptionStatus**: Component for displaying current subscription information

## Usage

```tsx
import { SubscriptionGuard, SubscriptionStatus } from "@/components/subscription";

// Protect routes with subscription requirements
<SubscriptionGuard>
  <ProtectedContent />
</SubscriptionGuard>

// Display subscription info
<SubscriptionStatus plan={currentPlan} status="active" />
``` 