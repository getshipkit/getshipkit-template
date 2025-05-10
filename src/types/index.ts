// Define pricing plan interface
export interface PricingPlan {
  title: string;
  monthlyPrice: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
}

// Define the environment specific product IDs mapping
export interface ProductIdMapping {
  [key: string]: string;
} 