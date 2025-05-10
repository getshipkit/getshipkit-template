"use client";

/**
 * ProPricingCard Component
 * 
 * A self-contained pricing card component for the Pro plan.
 * Contains all pricing data, features, and product IDs for this specific plan.
 * Styled as the featured plan with prominent visual treatment.
 * 
 * Integration with checkout:
 * - Uses product IDs from the centralized config
 * - Exposes product IDs via data attributes
 * - Provides direct checkout capability via handleClick
 */

import Link from "next/link";
import { PricingPlan } from "@/types";
import { PRODUCT_IDS } from "@/config/productIds";

export interface ProPricingCardProps {
  pricingPeriod: 'monthly' | 'annual';
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  buttonType?: 'link' | 'button';
  buttonHref?: string;
}

// Pro plan data defined directly in the component
const proPlan: PricingPlan = {
  title: PRODUCT_IDS.pro.displayName,
  monthlyPrice: "$89",
  yearlyPrice: "$890",
  description: "Ideal for growing businesses with more demanding requirements.",
  features: [
    "Up to 15 team members",
    "10,000 monthly active users",
    "Advanced authentication",
    "Priority support",
    "API access"
  ],
  cta: "Get Started",
  featured: true
};

// Product IDs for the Pro plan
const productIds = {
  monthly: PRODUCT_IDS.pro.monthly,
  annual: PRODUCT_IDS.pro.annual
};

export default function ProPricingCard({ 
  pricingPeriod,
  isCurrentPlan = false,
  isLoading = false,
  onClick,
  buttonType = 'link',
  buttonHref = '/sign-up'
}: ProPricingCardProps) {
  // Use the plan data defined within this component
  const plan = proPlan;
  
  // Get the appropriate product ID based on the pricing period
  const productId = pricingPeriod === 'monthly' ? productIds.monthly : productIds.annual;
  
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const displayPrice = pricingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const monthlyCost = parseInt(plan.monthlyPrice.replace('$', ''));
  const annualCost = parseInt(plan.yearlyPrice.replace('$', ''));
  const annualSavings = (monthlyCost * 12) - annualCost;
  
  // Handle the button click with the product ID
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // If no onClick handler is provided, you can use the product ID directly
      // For example, redirect to checkout directly
      window.location.href = `/api/checkout?productId=${productId}`;
    }
  };
  
  return (
    <div className="bg-[#0a0c14] rounded-2xl shadow-2xl p-8 border-2 border-[#10b981]/30 relative transform hover:scale-105 transition-all duration-300 z-10 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10b981]/20 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]"></div>
      
      {isCurrentPlan ? (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wide">
          Current
        </div>
      ) : (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#10b981] to-[#a7f3d0] text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wide">
          Most Popular
        </div>
      )}
      
      <div className="relative">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">{plan.title}</h2>
          {pricingPeriod === 'monthly' ? (
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981] mb-1">{plan.monthlyPrice}<span className="text-sm font-normal text-gray-400">/month</span></p>
          ) : (
            <div>
              <div className="flex items-baseline">
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981]">{plan.yearlyPrice}</p>
                {annualSavings > 0 && (
                  <p className="text-sm text-gray-500 line-through ml-2">${monthlyCost * 12}</p>
                )}
              </div>
              <p className="text-sm font-normal text-gray-400">/year</p>
            </div>
          )}
          <p className="text-gray-300 mt-2">{plan.description}</p>
          <div className="w-full h-px bg-gradient-to-r from-[#10b981]/50 via-[#a7f3d0]/30 to-transparent my-6"></div>
        </div>
        
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-5 w-5 text-[#10b981] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-white">{feature}</span>
            </li>
          ))}
        </ul>
        
        {isCurrentPlan ? (
          <button
            className="w-full py-3 rounded-lg border border-gray-700 text-white hover:bg-[#1e1e1e] transition-colors font-medium"
            disabled
          >
            Current Plan
          </button>
        ) : buttonType === 'button' ? (
          <button
            onClick={onClick || handleClick}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#10b981] to-[#a7f3d0] hover:from-[#a7f3d0] hover:to-[#10b981] text-black shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
            data-product-id={productId}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              plan.cta
            )}
          </button>
        ) : (
          <Link
            href={buttonHref}
            className="block w-full bg-gradient-to-r from-[#10b981] to-[#a7f3d0] hover:from-[#a7f3d0] hover:to-[#10b981] text-black shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 text-center py-3 px-6 rounded-xl font-medium transition-all duration-300 text-sm"
            data-product-id={productId}
          >
            {plan.cta}
          </Link>
        )}
      </div>
    </div>
  );
} 