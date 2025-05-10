"use client";

/**
 * OneTimePaymentCard Component
 * 
 * A self-contained card component for one-time payment option.
 * Contains pricing data, features, and product ID for this payment option.
 * 
 * Integration with checkout:
 * - Uses product IDs from the centralized config
 * - Exposes product ID via data attributes
 * - Provides direct checkout capability via handleClick
 */

import Link from "next/link";
import { PRODUCT_IDS } from "@/config/productIds";

export interface OneTimePaymentCardProps {
  isLoading?: boolean;
  onClick?: () => void;
  buttonType?: 'link' | 'button';
  buttonHref?: string;
}

// Component data defined directly in the component
const oneTimePlan = {
  title: PRODUCT_IDS.displayNames.one_time_payment,
  price: "$129",
  originalPrice: "$229",
  description: "One-time payment for lifetime access to all current and future features.",
  features: [
    "All premium features",
    "Lifetime updates",
    "No recurring fees",
    "Priority support"
  ],
  cta: "Get Lifetime Access",
  featured: true
};

// Product ID for the one-time payment
const productId = PRODUCT_IDS.oneTime;

export default function OneTimePaymentCard({ 
  isLoading = false,
  onClick,
  buttonType = 'link',
  buttonHref = '/sign-up'
}: OneTimePaymentCardProps) {
  
  // Handle the button click with the product ID
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // If no onClick handler is provided, use the product ID directly
      window.location.href = `/api/checkout?productId=${productId}`;
    }
  };
  
  return (
    <div className="bg-[#0a0c14] rounded-xl shadow-lg transition-all duration-300 p-6 border border-gray-800 hover:border-[#10b981]/40 hover:shadow-xl relative overflow-hidden hover:-translate-y-1 max-w-sm mx-auto">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/10 to-[#a7f3d0]/5"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]"></div>
      
      {/* Best Value Badge */}
      <div className="absolute -right-11 top-5 rotate-45 bg-gradient-to-r from-[#10b981] to-[#a7f3d0] text-black text-xs font-bold py-1 px-10 shadow-md">
        {oneTimePlan.featured ? "Best Value" : ""}
      </div>
      
      <div className="relative">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-1">{oneTimePlan.title}</h2>
          
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a7f3d0] to-[#10b981]">{oneTimePlan.price}</p>
            <p className="text-sm text-gray-500 line-through">{oneTimePlan.originalPrice}</p>
            <span className="text-xs font-medium bg-[#122820] text-[#10b981] rounded-full px-2 py-0.5">
              Save {Math.round((parseInt(oneTimePlan.originalPrice.substring(1)) - parseInt(oneTimePlan.price.substring(1))) / parseInt(oneTimePlan.originalPrice.substring(1)) * 100)}%
            </span>
          </div>
          
          <div className="flex items-center space-x-1 mt-2 mb-3">
            <svg className="w-4 h-4 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <p className="text-sm text-[#10b981] font-medium">
              One-time payment, lifetime access
            </p>
          </div>
          
          <p className="text-sm text-gray-300">{oneTimePlan.description}</p>
          <div className="w-full h-px bg-gradient-to-r from-[#10b981]/50 via-[#a7f3d0]/30 to-transparent my-4"></div>
        </div>
        
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Everything you need:</h3>
          <ul className="grid grid-cols-1 gap-y-2">
            {oneTimePlan.features.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <span className="h-5 w-5 rounded-full bg-[#122820] flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="h-3 w-3 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </span>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {buttonType === 'button' ? (
          <button
            onClick={onClick || handleClick}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[#10b981] to-[#a7f3d0] hover:from-[#a7f3d0] hover:to-[#10b981] text-black px-5 font-medium transition-all duration-300 flex items-center justify-center shadow-md shadow-[#10b981]/20 hover:shadow-[#10b981]/40 text-sm relative overflow-hidden group"
            data-product-id={productId}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {oneTimePlan.cta}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <Link
            href={buttonHref}
            className="block w-full bg-gradient-to-r from-[#10b981] to-[#a7f3d0] hover:from-[#a7f3d0] hover:to-[#10b981] text-black text-center py-3 px-5 rounded-lg font-medium transition-all duration-300 shadow-md shadow-[#10b981]/20 hover:shadow-[#10b981]/40 text-sm flex items-center justify-center relative overflow-hidden group"
            data-product-id={productId}
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            {oneTimePlan.cta}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        )}
        
        <div className="flex items-center justify-center gap-1 mt-3">
          <svg className="h-4 w-4 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-gray-400">
            Secure payment processing
          </p>
        </div>
      </div>
    </div>
  );
} 