import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-auth";
import { PRODUCT_IDS } from "@/config/productIds";

export async function GET(/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult.userId;
    
    console.log("Subscription API: User ID", userId);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient();

    // Query the subscription directly using the Clerk userId - get the most recent active subscription
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        id,
        product_id,
        billing_period,
        status,
        current_period_end,
        current_period_start,
        amount,
        currency,
        updated_at,
        user_id,
        customer_id
      `)
      .eq('user_id', userId)
      .filter('status', 'in', '(active,ending,trial,past_due)') // Include all statuses that should have access
      .order('updated_at', { ascending: false });

    if (subscriptionError) {
      console.error("Error fetching subscription:", subscriptionError);
      return NextResponse.json(
        { error: "Failed to fetch subscription data" },
        { status: 500 }
      );
    }
    
    console.log("Subscription API: Found subscriptions", JSON.stringify(subscriptions));
    
    // If no subscriptions found, check if the user has a canceled one-time payment
    if (!subscriptions || subscriptions.length === 0) {
      console.log("Subscription API: No active subscriptions found, checking for canceled one-time payments");
      
      // Look for canceled one-time payments
      const { data: canceledOneTime, error: canceledError } = await supabase
        .from('subscriptions')
        .select(`
          id,
          product_id,
          billing_period,
          status,
          current_period_end,
          current_period_start,
          amount,
          currency,
          updated_at,
          user_id,
          customer_id
        `)
        .eq('user_id', userId)
        .eq('billing_period', 'one_time')
        .eq('status', 'canceled')
        .order('updated_at', { ascending: false })
        .limit(1);
      
      if (!canceledError && canceledOneTime && canceledOneTime.length > 0) {
        // Return the canceled one-time payment information
        const canceledSub = canceledOneTime[0];
        console.log("Subscription API: Found canceled one-time payment", JSON.stringify(canceledSub));
        
        // Determine plan name for the canceled subscription
        let planName = "free";
        if (canceledSub.product_id) {
          if (PRODUCT_IDS.displayNames[canceledSub.product_id as keyof typeof PRODUCT_IDS.displayNames]) {
            planName = PRODUCT_IDS.displayNames[canceledSub.product_id as keyof typeof PRODUCT_IDS.displayNames];
          } else if (canceledSub.product_id.includes('one_time') || canceledSub.billing_period === 'one_time') {
            planName = PRODUCT_IDS.displayNames.one_time_payment;
          } else {
            planName = "Custom Plan";
          }
        }
        
        return NextResponse.json({
          active: false,
          status: 'canceled',
          plan: planName,
          product_id: canceledSub.product_id,
          billingPeriod: 'one_time',
          amount: canceledSub.amount,
          currency: canceledSub.currency,
          nextBillingDate: null,
          isCancelling: false,
          isOneTimePayment: true
        });
      }
      
      console.log("Subscription API: No subscriptions found");
      return NextResponse.json({
        active: false,
        status: 'expired',
        plan: 'free',
        billingPeriod: null,
        amount: null,
        currency: null,
        nextBillingDate: null
      });
    }
    
    // Get the most recent subscription
    const subscription = subscriptions[0];
    
    console.log("Subscription API: Found subscription:", JSON.stringify(subscription));
    
    // Check if subscription is still within its billing period by comparing current_period_end with current date
    const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    const isActive = currentPeriodEnd ? currentPeriodEnd > new Date() : false;

    // If subscription is expired, return inactive
    if (!isActive) {
      return NextResponse.json({
        active: false,
        status: 'expired',
        plan: 'free',
        billingPeriod: null,
        amount: null,
        currency: null,
        nextBillingDate: null
      });
    }

    // Determine plan name based on product_id
    let planName = "free";
    if (subscription.product_id) {
      // First, check if we have a display name mapping for this exact product ID
      if (PRODUCT_IDS.displayNames[subscription.product_id as keyof typeof PRODUCT_IDS.displayNames]) {
        planName = PRODUCT_IDS.displayNames[subscription.product_id as keyof typeof PRODUCT_IDS.displayNames];
      } 
      // Otherwise, try to determine the plan name from the product ID
      else if (subscription.product_id.includes('starter') || subscription.product_id.includes('basic')) {
        planName = PRODUCT_IDS.starter.displayName;
      } else if (subscription.product_id.includes('pro')) {
        planName = PRODUCT_IDS.pro.displayName;
      } else if (subscription.product_id.includes('premium') || subscription.product_id.includes('enterprise')) {
        planName = PRODUCT_IDS.enterprise.displayName;
      } else if (subscription.product_id.includes('one_time') || subscription.billing_period === 'one_time') {
        planName = PRODUCT_IDS.displayNames.one_time_payment;
      } else {
        // If still not determined, use a generic name
        planName = "Custom Plan";
      }
    }

    // Get billing period directly from the field
    const billingPeriod = subscription.billing_period || "unknown";

    // For active access statuses, set the active flag to true
    const isAccessAllowed = ['active', 'ending', 'trial', 'past_due'].includes(subscription.status);
    
    // Special handling for one-time payments
    const isOneTime = subscription.billing_period === 'one_time';
    
    // Log the product ID and plan name for debugging
    console.log("Subscription API: Product ID:", subscription.product_id);
    console.log("Subscription API: Plan name determined:", planName);
    
    const response = {
      active: isAccessAllowed, // Set active based on status that should have access
      status: subscription.status, // Return the actual status from the database
      plan: planName,
      product_id: subscription.product_id, // Include the product ID
      billingPeriod: billingPeriod,
      amount: subscription.amount,
      currency: subscription.currency,
      nextBillingDate: isOneTime ? null : subscription.current_period_end, // No next billing for one-time
      isCancelling: !isOneTime && subscription.status === 'ending', // One-time payments can't be cancelled
      isOneTimePayment: isOneTime
    };
    
    console.log("Subscription API: Sending response:", JSON.stringify(response));
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in subscription route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 