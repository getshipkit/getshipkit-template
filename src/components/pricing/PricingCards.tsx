"use client";

/**
 * PricingCards Component
 * 
 * A container component that manages and renders all pricing cards based on the configured payment model.
 * Can either display subscription-based pricing or one-time payment pricing.
 * 
 * Features:
 * - Period toggle between monthly and annual plans (for subscription model)
 * - Manages state of the selected pricing period
 * - Handles passing product IDs to the parent component via onUpgrade
 * - Compatible with both link and button modes
 * - Supports showing current plan status
 * - Dynamically adapts based on NEXT_PUBLIC_PAYMENT_MODEL environment variable
 */

import { useState } from "react";
import StarterPricingCard from "./StarterPricingCard";
import ProPricingCard from "./ProPricingCard";
import EnterprisePricingCard from "./EnterprisePricingCard";
import OneTimePaymentCard from "./OneTimePaymentCard";
import PriceComparisonCard from "./PriceComparisonCard";
import { PRODUCT_IDS } from "@/config/productIds";
import { isSubscriptionModel, isOneTimeModel } from "@/utils/paymentModel";

export interface PricingCardsProps {
  showToggle?: boolean;
  defaultPeriod?: 'monthly' | 'annual';
  period?: 'monthly' | 'annual';
  onPeriodChange?: (period: 'monthly' | 'annual') => void;
  isLoggedIn?: boolean;
  currentPlan?: string;
  onUpgrade?: (planType: string, period: 'monthly' | 'annual', productId: string) => void;
  onOneTimeUpgrade?: (productId: string) => void;
  isLoading?: {[key: string]: boolean};
  buttonType?: 'link' | 'button';
  buttonHref?: string;
}

export default function PricingCards({ 
  showToggle = true,
  defaultPeriod = 'annual',
  period,
  onPeriodChange,
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  isLoggedIn = false,
  currentPlan,
  onUpgrade,
  onOneTimeUpgrade,
  isLoading = {},
  buttonType = 'link',
  buttonHref = '/sign-up'
}: PricingCardsProps) {
  // Use internal state only if period is not provided
  const [internalPricingPeriod, setInternalPricingPeriod] = useState<'monthly' | 'annual'>(defaultPeriod);
  
  // Use either the controlled prop or internal state
  const pricingPeriod = period !== undefined ? period : internalPricingPeriod;
  
  // Handler for period changes
  const handlePeriodChange = (newPeriod: 'monthly' | 'annual') => {
    if (onPeriodChange) {
      // If we have a callback, use it (controlled component)
      onPeriodChange(newPeriod);
    } else {
      // Otherwise update internal state (uncontrolled component)
      setInternalPricingPeriod(newPeriod);
    }
  };
  
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const isSubscription = isSubscriptionModel();
  const isOneTime = isOneTimeModel();

  // Helper function to get product ID for specific plan and period
  const getProductId = (planType: string, period: 'monthly' | 'annual') => {
    const planMapping: Record<string, { monthly: string, annual: string }> = {
      'starter': PRODUCT_IDS.starter,
      'pro': PRODUCT_IDS.pro,
      'enterprise': PRODUCT_IDS.enterprise
    };
    
    return planMapping[planType]?.[period] || '';
  };

  // Handlers for each plan type
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const handleStarterUpgrade = () => {
    if (onUpgrade) {
      const productId = getProductId('starter', pricingPeriod);
      onUpgrade('starter', pricingPeriod, productId);
    }
  };

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const handleProUpgrade = () => {
    if (onUpgrade) {
      const productId = getProductId('pro', pricingPeriod);
      onUpgrade('pro', pricingPeriod, productId);
    }
  };

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const handleEnterpriseUpgrade = () => {
    if (onUpgrade) {
      const productId = getProductId('enterprise', pricingPeriod);
      onUpgrade('enterprise', pricingPeriod, productId);
    }
  };

  const handleOneTimeUpgrade = () => {
    if (onOneTimeUpgrade) {
      onOneTimeUpgrade(PRODUCT_IDS.oneTime);
    }
  };

  // Render the appropriate pricing model
  if (isOneTime) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PriceComparisonCard />
          <OneTimePaymentCard
            isLoading={isLoading['onetime']}
            onClick={onOneTimeUpgrade ? handleOneTimeUpgrade : undefined}
            buttonType={buttonType}
            buttonHref={buttonHref}
          />
        </div>
      </div>
    );
  }

  // Default to subscription model
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {showToggle && (
        <div className="flex justify-center mb-12">
          <div className="p-1 rounded-full bg-gradient-to-r from-[#10b981]/20 to-[#a7f3d0]/20 inline-flex backdrop-blur-sm border border-[#10b981]/10">
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
                pricingPeriod === 'monthly'
                  ? 'bg-transparent border-2 border-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handlePeriodChange('annual')}
              className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
                pricingPeriod === 'annual'
                  ? 'bg-transparent border-2 border-[#10b981] text-white shadow-lg shadow-[#10b981]/20'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Annual <span className="bg-black/30 text-[#10b981] font-bold ml-1 px-1.5 py-0.5 rounded-full text-xs">Save 20%</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StarterPricingCard
          pricingPeriod={pricingPeriod}
          isCurrentPlan={currentPlan === 'starter'}
          isLoading={isLoading['starter']}
          onClick={
            onUpgrade
              ? () => onUpgrade('starter', pricingPeriod, pricingPeriod === 'monthly'
                  ? PRODUCT_IDS.starter.monthly
                  : PRODUCT_IDS.starter.annual)
              : undefined
          }
          buttonType={buttonType}
          buttonHref={buttonHref}
        />
        <ProPricingCard
          pricingPeriod={pricingPeriod}
          isCurrentPlan={currentPlan === 'pro'}
          isLoading={isLoading['pro']}
          onClick={
            onUpgrade
              ? () => onUpgrade('pro', pricingPeriod, pricingPeriod === 'monthly'
                  ? PRODUCT_IDS.pro.monthly
                  : PRODUCT_IDS.pro.annual)
              : undefined
          }
          buttonType={buttonType}
          buttonHref={buttonHref}
        />
        <EnterprisePricingCard
          pricingPeriod={pricingPeriod}
          isCurrentPlan={currentPlan === 'enterprise'}
          isLoading={isLoading['enterprise']}
          onClick={
            onUpgrade
              ? () => onUpgrade('enterprise', pricingPeriod, pricingPeriod === 'monthly'
                  ? PRODUCT_IDS.enterprise.monthly
                  : PRODUCT_IDS.enterprise.annual)
              : undefined
          }
          buttonType={buttonType}
          buttonHref={buttonHref}
        />
      </div>
    </div>
  );
} 