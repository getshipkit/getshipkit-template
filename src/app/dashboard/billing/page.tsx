"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { PricingCards } from "@/components/pricing";
import { isSubscriptionModel, isOneTimeModel } from '@/utils/paymentModel';
import { PRODUCT_IDS } from "@/config/productIds";

export default function BillingPage() {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  // Portal link state
  const [portalIsLoading, setPortalIsLoading] = useState(false);
  const [preloadedPortalLink, setPreloadedPortalLink] = useState<string | null>(null);
  const portalLinkRef = useRef<HTMLAnchorElement>(null);
  
  const subscription = useSubscription();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const isSubscription = isSubscriptionModel();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const isOneTime = isOneTimeModel();
  
  // Check if user has an active subscription
  const hasActiveSubscription = ['active', 'ending', 'trial', 'past_due'].includes(subscription.status);
  
  // Preload the portal link in the background
  useEffect(() => {
    if (hasActiveSubscription && !preloadedPortalLink) {
      // Add a small delay to allow the page to render first
      const timeoutId = setTimeout(() => {
        // Skip the prefetch HEAD request and just set the link directly
        // This avoids the "Failed to fetch" error when the server doesn't support HEAD requests
        setPreloadedPortalLink('/portal');
        
        // Optionally create a hidden image to warm up the connection to the server
        const preconnectLink = document.createElement('link');
        preconnectLink.rel = 'preconnect';
        preconnectLink.href = window.location.origin;
        document.head.appendChild(preconnectLink);
        
        // Clean up the preconnect link later
        setTimeout(() => {
          if (document.head.contains(preconnectLink)) {
            document.head.removeChild(preconnectLink);
          }
        }, 5000);
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [subscription.status, preloadedPortalLink, hasActiveSubscription]);
  
  // Handle the manage subscription button click
  const handleManageSubscription = () => {
    setPortalIsLoading(true);
    
    // Create a fake delay if the portal link is already preloaded to show the loading animation
    if (preloadedPortalLink) {
      setTimeout(() => {
        setPortalIsLoading(false);
        if (portalLinkRef.current) {
          portalLinkRef.current.click();
        } else {
          // Fallback in case the ref isn't available
          window.location.href = '/portal';
        }
      }, 300);
    } else {
      // If not preloaded, redirect directly
      window.location.href = '/portal';
    }
  };
  
  // Handle subscription plan upgrades (monthly/annual)
  const handleSubscriptionUpgrade = (planType: string, period: 'monthly' | 'annual', productId: string) => {
    const key = `${planType}_${period}`;
    setIsLoading({ ...isLoading, [key]: true });
    
    // Redirect to checkout API with the appropriate product ID
    window.location.href = `/api/checkout?productId=${productId}`;
  };
  
  // Handle one-time payment upgrades
  const handleOneTimeUpgrade = (productId: string) => {
    setIsLoading({ ...isLoading, ['onetime']: true });
    
    // Redirect to checkout API with the appropriate product ID
    window.location.href = `/api/checkout?productId=${productId}`;
  };
  
  if (subscription.loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] bg-white dark:bg-[#0F0F0F]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-emerald-500"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <svg className="w-10 h-10 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white animate-pulse">
            Loading subscription details...
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs text-center">
            We&apos;re fetching your latest billing information
          </div>
        </div>
      </div>
    );
  }
  
  // Helper function to display the plan name
  const getPlanName = (plan: string) => {
    // First check if we have a direct mapping for the plan type
    if (plan === 'free') return 'Free';
    if (plan === 'starter') return PRODUCT_IDS.starter.displayName;
    if (plan === 'pro') return PRODUCT_IDS.pro.displayName;
    if (plan === 'enterprise') return PRODUCT_IDS.enterprise.displayName;
    if (plan === 'lifetime') return PRODUCT_IDS.displayNames.one_time_payment;
    
    // If no direct mapping, return the capitalized plan name
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  };
  
  // Helper function to get the product display name directly from product ID
  const getProductDisplayName = (productId: string | undefined) => {
    if (!productId) return "Free Plan";
    
    console.log("Looking up display name for product ID:", productId);
    
    // Use the pre-parsed ID-to-name mapping from config
    if (PRODUCT_IDS.idToName && PRODUCT_IDS.idToName[productId]) {
      return PRODUCT_IDS.idToName[productId];
    }
    
    // Parse the JSON products data from environment variable
    try {
      const productsData = process.env.NEXT_PUBLIC_PRODUCTS;
      if (productsData) {
        const products = JSON.parse(productsData);
        
        // Check each product to see if it has a matching ID
        for (const key in products) {
          const value = products[key];
          const parts = value.split(':');
          if (parts.length === 2 && parts[0] === productId) {
            return parts[1]; // Return the display name part
          }
        }
      }
    } catch (error) {
      console.error("Error parsing products data:", error);
    }
    
    // Fallback to pattern matching if direct match fails
    if (productId.includes('pro')) {
      return "Premium";
    }
    if (productId.includes('starter') || productId.includes('basic')) {
      return "Basic";
    }
    if (productId.includes('enterprise') || productId.includes('premium')) {
      return "Ultimate";
    }
    if (productId.includes('one_time') || productId.includes('lifetime')) {
      return "Forever Access";
    }
    
    // Last resort fallback
    return "Custom Plan";
  };
  
  // Format date in a user-friendly way
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get badge color based on subscription status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-900/30',
          text: 'text-emerald-700 dark:text-emerald-400',
          icon: (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"/>
            </svg>
          )
        };
      case 'trial':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          icon: (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-10V7h-2v5H6v2h5v5h2v-5h5v-2h-5z"/>
            </svg>
          )
        };
      case 'past_due':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-400',
          icon: (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
            </svg>
          )
        };
      case 'ending':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-700 dark:text-orange-400',
          icon: (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.41l2.54 2.53 1.42-1.42-3.96-3.96L8.04 12l1.42 1.42L12 10.59z"/>
            </svg>
          )
        };
      case 'canceled':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-700 dark:text-red-400',
          icon: (
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/>
            </svg>
          )
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-700 dark:text-gray-400',
          icon: null
        };
    }
  };

  // Get status display text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'active': return 'Active';
      case 'trial': return 'Trial';
      case 'past_due': return 'Past Due';
      case 'ending': return 'Ending Soon';
      case 'canceled': return 'Canceled';
      default: return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };

  // Get plan icon based on plan name
  const getPlanIcon = (plan: string) => {
    switch(plan.toLowerCase()) {
      case 'free':
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'starter':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </div>
        );
      case 'pro':
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      case 'enterprise':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'lifetime':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-4 4v12h8zm0 0V6a4 4 0 014-4h1.2a4 4 0 014 4v12h-8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <>
      {/* Hidden preloaded link */}
      {preloadedPortalLink && (
        <Link ref={portalLinkRef} href={preloadedPortalLink} className="hidden" aria-hidden="true">
          Preloaded Portal Link
        </Link>
      )}
      
      <div className="container max-w-6xl mx-auto py-12 px-4 bg-white dark:bg-[#0F0F0F]">
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Billing</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Manage your subscription, payment methods, and billing information.
          </p>
        </div>
        
        {/* Notice for canceled one-time payments */}
        {subscription.isOneTimePayment && subscription.status === 'canceled' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Access Canceled
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                  <p>
                    Your one-time payment has been refunded and your access has been canceled. 
                    If you believe this is an error, please contact support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Current Subscription */}
        {subscription.status && subscription.status !== 'expired' && (
          <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div className="flex items-center mb-4 lg:mb-0">
                {getPlanIcon(subscription.plan || 'Free')}
                <div className="ml-4">
                  <h2 className="font-semibold text-xl text-gray-900 dark:text-white">
                    {subscription.product_id ? getProductDisplayName(subscription.product_id) : getPlanName(subscription.plan)}
                    {subscription.isOneTimePayment ? 
                     (getProductDisplayName(subscription.product_id)?.toLowerCase().includes('access') ? '' : ' Lifetime Access') : 
                     ' Plan'}
                  </h2>
                  <div className="flex items-center text-sm mt-1">
                    <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status).bg} ${getStatusColor(subscription.status).text}`}>
                      {getStatusColor(subscription.status).icon}
                      {subscription.isOneTimePayment && subscription.status !== 'canceled' ? 'Lifetime' : getStatusText(subscription.status)}
                    </span>
                    {subscription.nextBillingDate && !subscription.isOneTimePayment && (
                      <span className="ml-3 text-gray-500 dark:text-gray-400">
                        {subscription.status === 'ending' ? 'Ends' : 'Renews'} {formatDate(subscription.nextBillingDate)}
                      </span>
                    )}
                  </div>
                  {subscription.product_id && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ID: {subscription.product_id}
                    </p>
                  )}
                </div>
              </div>
              
              {!subscription.isOneTimePayment && (
                <button
                  onClick={handleManageSubscription}
                  disabled={portalIsLoading}
                  className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-[#1B1B1B] transition-all duration-200 ${
                    portalIsLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {portalIsLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Manage Subscription
                    </>
                  )}
                </button>
              )}
            </div>
            
            {/* Subscription Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {subscription.isOneTimePayment ? 'Payment Type' : 'Billing Period'}
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {subscription.isOneTimePayment 
                      ? 'One-time payment' 
                      : subscription.period === 'monthly' 
                        ? 'Monthly' 
                        : subscription.period === 'annual' 
                          ? 'Annually'
                          : 'One-time payment'}
                  </p>
                </div>
                
                {!subscription.isOneTimePayment && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Next Payment</h3>
                    <p className="text-gray-900 dark:text-white">
                      {subscription.nextBillingDate 
                        ? formatDate(subscription.nextBillingDate) 
                        : 'No upcoming payments'}
                    </p>
                  </div>
                )}
                
                {subscription.isOneTimePayment && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Access Status</h3>
                    <p className="text-gray-900 dark:text-white">
                      Permanent Access
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</h3>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-400 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 4H2c-1.11 0-2 .89-2 2v12c0 1.097.903 2 2 2h20c1.097 0 2-.903 2-2V6a2 2 0 00-2-2zm0 14H2V8h20v10z" fillRule="nonzero"/>
                    </svg>
                    <span className="text-gray-900 dark:text-white">
                      {/* No paymentMethod in subscription state, use a generic message */}
                      Credit Card
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Subscription Plans */}
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {hasActiveSubscription && !subscription.isOneTimePayment 
                ? 'Upgrade Plan' 
                : subscription.isOneTimePayment 
                  ? (subscription.status === 'canceled' ? 'Access Canceled' : 'You Have Lifetime Access')
                  : 'Choose a Plan'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              {hasActiveSubscription && !subscription.isOneTimePayment 
                ? 'Upgrade your plan to access more features and benefits.' 
                : subscription.isOneTimePayment 
                  ? (subscription.status === 'canceled' 
                    ? 'Your lifetime access has been canceled. You can purchase again below.' 
                    : 'Thank you for your purchase! You have lifetime access to all features.')
                  : 'Choose the perfect plan for your needs.'}
            </p>
          </div>
          
          {/* Hide pricing options for one-time payment users with active access */}
          {(!subscription.isOneTimePayment || subscription.status === 'canceled') && (
            <>
              <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <PricingCards 
                  isLoading={isLoading} 
                  onUpgrade={handleSubscriptionUpgrade}
                  onOneTimeUpgrade={handleOneTimeUpgrade}
                  currentPlan={subscription.plan}
                  defaultPeriod={pricingPeriod}
                  buttonType="button"
                />
              </div>
            </>
          )}
          
          {/* Special message for one-time payment users with active access */}
          {subscription.isOneTimePayment && subscription.status !== 'canceled' && (
            <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Permanent Access Activated</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                You have permanent access to all features and future updates. Thank you for your support!
              </p>
              <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-400 text-sm">
                No additional payments required
              </div>
            </div>
          )}
        </div>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="bg-white dark:bg-[#1B1B1B] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 dark:text-white">How do I change my plan?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  You can change your plan at any time by clicking the &quot;Manage Subscription&quot; button. You will be prorated for the remainder of your billing period.
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 dark:text-white">Can I cancel my subscription?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period.
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 dark:text-white">How secure is my payment information?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your payment information is securely processed by our payment provider and is never stored on our servers.
                </p>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900 dark:text-white">What happens when my trial ends?</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  When your trial ends, you will be automatically charged for the plan you selected. You can cancel before the trial ends to avoid being charged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Add this to global.css or create a new stylesheet
// .bg-grid-white {
//   background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
// } 