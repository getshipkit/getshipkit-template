# Pricing Components

This directory contains components related to the pricing system and subscription plans.

## Components

- **PricingCards**: Container component managing all pricing cards with period toggle
- **StarterPricingCard**: Individual card for the Starter plan
- **ProPricingCard**: Individual card for the Pro plan (featured)
- **EnterprisePricingCard**: Individual card for the Enterprise plan

## Product ID Integration

Each pricing card component integrates with the centralized product ID system:

1. Product IDs are defined in `src/config/productIds.ts`
2. Each card component pulls the appropriate IDs based on the pricing period
3. IDs are exposed via data attributes on elements for tracking
4. The card components provide direct checkout capability or delegation to parent

## Usage

```tsx
import { PricingCards } from "@/components/pricing";

// In your component
<PricingCards 
  showToggle={true}
  defaultPeriod="annual"
  buttonType="button"
  onUpgrade={(planType, period, productId) => {
    // Handle upgrade with product ID
  }}
/>
``` 