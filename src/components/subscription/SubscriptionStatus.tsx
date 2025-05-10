'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/hooks/use-supabase';
import { useUser } from '@clerk/nextjs';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type SubscriptionData = {
  status: string;
  product_id: string | null;
  current_period_end: string | null;
  is_active: boolean;
  subscription_id: string;
};

export default function SubscriptionStatus() {
  const { user } = useUser();
  const supabase = useSupabase();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase || !user) return;

    async function fetchSubscription() {
      setLoading(true);
      try {
        // First approach: use direct API call to avoid RLS issues
        const response = await fetch('/api/subscription');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }
        
        const responseData = await response.json();
        
        if (responseData.active) {
          // Convert to the expected format
          setSubscription({
            status: responseData.status || 'active',
            product_id: responseData.plan,
            current_period_end: responseData.nextBillingDate,
            is_active: responseData.active,
            subscription_id: '' // This field might not be available from the API
          });
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription information');
      }
      setLoading(false);
    }

    fetchSubscription();
  }, [supabase, user]);

  const cancelSubscription = async () => {
    if (!subscription?.is_active) return;
    
    setCancelling(true);
    setError(null);
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel subscription');
      }
      
      // Update the local state
      setSubscription((prev) => prev ? { ...prev, status: 'ending' } : null);
      
    } catch (err: unknown) {
      // Handle errors with proper type checking
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while cancelling your subscription');
      }
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'ending':
        return <Badge className="bg-amber-500">Ending Soon</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500">Expired</Badge>;
      case 'trial':
        return <Badge className="bg-blue-500">Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-amber-500">Past Due</Badge>;
      case 'unpaid':
        return <Badge className="bg-red-500">Unpaid</Badge>;
      case 'incomplete':
        return <Badge className="bg-gray-500">Incomplete</Badge>;
      case 'paused':
        return <Badge className="bg-blue-300">Paused</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don&apos;t have an active subscription. Upgrade to access premium features.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <a href="/pricing">View Plans</a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Subscription {getStatusBadge(subscription.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.product_id && (
          <div>
            <p className="text-sm font-medium">Plan</p>
            <p className="text-lg">{subscription.product_id}</p>
          </div>
        )}
        
        {subscription.current_period_end && (
          <div>
            <p className="text-sm font-medium">
              {subscription.status === 'ending' 
                ? 'Access Until' 
                : 'Renews On'}
            </p>
            <p className="text-lg">
              {format(new Date(subscription.current_period_end), 'PPP')}
            </p>
          </div>
        )}
        
        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
      <CardFooter>
        {subscription.status === 'active' && (
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={cancelSubscription}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        )}
        
        {subscription.status === 'ending' && (
          <p className="text-sm text-center w-full text-muted-foreground">
            Your subscription will remain active until the end of the current billing period.
          </p>
        )}
      </CardFooter>
    </Card>
  );
} 