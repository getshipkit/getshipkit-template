"use client";

import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSubscription } from '@/lib/hooks/useSubscription';

export default function SubscriptionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const subscription = useSubscription();
  const router = useRouter();
  const pathname = usePathname();
  
  // Paths that should be accessible without an active subscription
  const allowedPaths = useMemo(() => [
    '/dashboard/billing'
  ], []);
  
  useEffect(() => {
    // If subscription data is still loading, do nothing yet
    if (subscription.loading) {
      return;
    }
    
    // Check if user is on an allowed path
    const isAllowedPath = allowedPaths.some(path => pathname === path);
    
    // Check if the subscription status allows access
    const hasValidSubscription = ['active', 'trial', 'ending', 'past_due'].includes(subscription.status);
    
    // If user doesn't have a valid subscription and is not on an allowed path,
    // redirect to the subscription page
    if (!hasValidSubscription && !isAllowedPath) {
      router.push('/dashboard/billing');
    }
  }, [subscription, pathname, router, allowedPaths]);
  
  // Show loading state while checking subscription
  if (subscription.loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1A1A1A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // Display error state if there's an error
  if (subscription.error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#1A1A1A] text-white p-6">
        <div className="max-w-md bg-[#232323] border border-[#333333] rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">Subscription Check Failed</h2>
          <p className="mb-4">There was an error checking your subscription status. This might be due to a sync issue between your user account and subscription data.</p>
          
          <div className="mb-4 bg-[#1A1A1A] p-3 rounded border border-[#333333] text-sm text-[#A0A0A0]">
            <p>Error: {subscription.error}</p>
          </div>
          
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md font-medium"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  // If not on an allowed path and subscription is not valid, render nothing (will redirect)
  const isAllowedPath = allowedPaths.some(path => pathname === path);
  const hasValidSubscription = ['active', 'trial', 'ending', 'past_due'].includes(subscription.status);
  
  if (!hasValidSubscription && !isAllowedPath) {
    return null;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
} 