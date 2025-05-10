import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAdminSupabaseClient } from '@/lib/supabase-admin';
import { createServerSupabaseClient } from '@/lib/supabase-auth';

export async function POST(/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult.userId;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Supabase clients
    const supabase = createServerSupabaseClient();
    const adminClient = createAdminSupabaseClient();
    
    // 1. Find the active subscription for this user
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('updated_at', { ascending: false });
      
    if (subError) {
      console.error("Error finding active subscription:", subError);
      return NextResponse.json({ error: "Failed to find active subscription" }, { status: 500 });
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }
    
    const subscription = subscriptions[0];
    
    console.log("Cancelling subscription:", subscription.id);
    
    // 2. Update the subscription status to 'ends' in our database
    // This indicates the subscription will end at the end of the current period
    const { error: updateError } = await adminClient
      .from('subscriptions')
      .update({
        status: 'ending',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);
      
    if (updateError) {
      console.error("Error updating subscription:", updateError);
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
    
    // 3. Cancel the subscription in Polar using a direct API call
    try {
      const subscriptionId = subscription.product_id;
      
      if (subscriptionId) {
        const polarResponse = await fetch(`https://api.polar.sh/subscriptions/${subscriptionId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`
          }
        });
        
        if (!polarResponse.ok) {
          const errorText = await polarResponse.text();
          console.error(`Polar API error (${polarResponse.status}): ${errorText}`);
        } else {
          const responseData = await polarResponse.json();
          console.log(`Successfully cancelled subscription ${subscriptionId} in Polar`, responseData);
        }
      } else {
        console.warn("No subscription ID found for cancellation in Polar");
      }
    } catch (polarError) {
      console.error("Error cancelling subscription in Polar:", polarError);
      // We log the error but don't fail the request, as the local DB update is successful
      // This will allow the UI to show the subscription as ending
    }
    
    return NextResponse.json({
      success: true,
      message: "Subscription has been cancelled. You will have access until the end of your current billing period.",
      subscription: {
        id: subscription.id,
        status: 'ending',
        current_period_end: subscription.current_period_end
      }
    });
  } catch (error) {
    console.error("Error in cancel subscription route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}