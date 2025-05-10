import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export type SubscriptionStatus = {
  status: 'active' | 'ending' | 'canceled' | 'past_due' | 'unpaid' | 'trial' | 'incomplete' | 'incomplete_expired' | 'paused' | 'pending' | 'expired';
  plan: 'free' | 'pro' | 'enterprise' | 'lifetime';
  period?: 'monthly' | 'annual' | 'one_time';
  nextBillingDate?: string;
  loading: boolean;
  error?: string;
  isCancelling?: boolean;
  isOneTimePayment?: boolean;
  product_id?: string;
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    status: 'expired',
    plan: 'free',
    loading: true
  });
  
  const { isSignedIn, isLoaded } = useAuth();
  
  useEffect(() => {
    async function fetchSubscription() {
      if (!isLoaded || !isSignedIn) {
        return;
      }
      
      try {
        const response = await fetch('/api/subscription');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch subscription');
        }
        
        const data = await response.json();
        console.log('Subscription API response:', data);
        
        let status: SubscriptionStatus['status'] = 'expired';
        
        if (data.status) {
          status = data.status as SubscriptionStatus['status'];
        } else if (data.active) {
          status = 'active';
        }
        
        setSubscription({
          status,
          plan: data.plan?.toLowerCase() || 'free',
          period: data.billingPeriod,
          nextBillingDate: data.nextBillingDate,
          loading: false,
          isCancelling: status === 'ending' || data.isCancelling || false,
          isOneTimePayment: data.isOneTimePayment || false,
          product_id: data.product_id || undefined
        });
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setSubscription({
          status: 'expired',
          plan: 'free',
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch subscription'
        });
      }
    }
    
    fetchSubscription();
  }, [isSignedIn, isLoaded]);
  
  return subscription;
} 