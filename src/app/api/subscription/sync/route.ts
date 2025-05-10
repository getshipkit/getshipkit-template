import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-auth";

// Shared function to sync a subscription
async function syncSubscription(userId: string, subscriptionId: string | null = null) {
  try {
    console.log("🔄 Starting subscription sync for user:", userId, "subscription:", subscriptionId || "latest");
    
    // Create a server-side Supabase client
    const supabase = createServerSupabaseClient();
    
    // Get the user's subscription from our database
    let query = supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1);
    
    // If subscriptionId provided, use that specific one
    if (subscriptionId) {
      query = supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .limit(1);
    }
    
    const { data: subscriptions, error: subscriptionError } = await query;

    if (subscriptionError) {
      console.error("❌ Error fetching subscription:", subscriptionError);
      return { error: "Failed to fetch subscription data", status: 500 };
    }
    
    if (!subscriptions || subscriptions.length === 0) {
      console.log("⚠️ No subscription found to sync");
      return { message: "No subscription found to sync", status: 404 };
    }
    
    const subscription = subscriptions[0];
    console.log("✅ Found subscription to sync:", JSON.stringify(subscription));
    
    // Make a request to Polar to get the current status
    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("❌ Missing Polar access token");
      return { error: "Missing Polar access token", status: 500 };
    }
    
    const polarMode = process.env.POLAR_MODE || "sandbox";
    const baseUrl = polarMode === "production" 
      ? "https://api.polar.sh" 
      : "https://api.sandbox.polar.sh";
    
    // If a customer_id exists, fetch the subscription from Polar
    let polarStatus = null;
    let polarDetails = null;
    
    if (subscription.customer_id) {
      try {
        console.log(`🔍 Fetching subscription from Polar API: ${baseUrl}/v1/subscriptions/${subscription.id}`);
        
        const polarResponse = await fetch(
          `${baseUrl}/v1/subscriptions/${subscription.id}`,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        
        if (polarResponse.ok) {
          polarDetails = await polarResponse.json();
          console.log("✅ Polar subscription data:", JSON.stringify(polarDetails));
          polarStatus = polarDetails.status;
          console.log(`📊 Polar status: ${polarStatus}, cancel_at_period_end: ${polarDetails.cancel_at_period_end}`);
        } else {
          const errorText = await polarResponse.text();
          console.error(`❌ Error fetching from Polar (${polarResponse.status}):`, errorText);
          return { error: "Failed to fetch subscription from Polar", status: 500 };
        }
      } catch (error) {
        console.error("❌ Error connecting to Polar API:", error);
        return { error: "Failed to connect to Polar API", status: 500 };
      }
    } else {
      console.error("❌ No customer_id found for subscription");
      return { error: "No customer_id found for subscription", status: 400 };
    }
    
    // Update our database if there's a status or cancel_at_period_end mismatch
    const statusChanged = polarStatus && polarStatus !== subscription.status;
    const cancelFlagChanged = polarDetails && polarDetails.cancel_at_period_end !== subscription.cancel_at_period_end;
    
    console.log(`📊 Status comparison - Local: ${subscription.status}, Polar: ${polarStatus}`);
    console.log(`📊 Cancel flag comparison - Local: ${subscription.cancel_at_period_end}, Polar: ${polarDetails?.cancel_at_period_end}`);
    console.log(`�� Status changed: ${statusChanged}, Cancel flag changed: ${cancelFlagChanged}`);
    
    if (statusChanged || cancelFlagChanged) {
      console.log(`🔄 Updating subscription - Status: ${subscription.status} -> ${polarStatus}, Cancel at period end: ${subscription.cancel_at_period_end} -> ${polarDetails?.cancel_at_period_end}`);
      
      // Map Polar status to our database enum
      let mappedStatus;
      if (polarStatus === "active") {
        // If active but will cancel at period end, mark as ending
        if (polarDetails && polarDetails.cancel_at_period_end === true) {
          console.log("📝 Subscription is active but will cancel at period end - marking as 'ending'");
          mappedStatus = "ending";
        } else {
          mappedStatus = "active";
          console.log("📝 Subscription is active and will renew (cancel_at_period_end=false)");
        }
      } else if (polarStatus === "canceled" || polarStatus === "cancelled") {
        mappedStatus = "canceled";
      } else if (polarStatus === "ended" || polarStatus === "ending") {
        mappedStatus = "ending";
      } else if (polarStatus === "past_due") {
        mappedStatus = "past_due";
      } else if (polarStatus === "trialing" || polarStatus === "trial") {
        mappedStatus = "trial";
      } else if (polarStatus === "paused") {
        mappedStatus = "paused";
      } else if (polarStatus === "incomplete") {
        mappedStatus = "incomplete";
      } else if (polarStatus === "incomplete_expired") {
        mappedStatus = "incomplete_expired";
      } else if (polarStatus === "unpaid") {
        mappedStatus = "unpaid";
      } else if (polarStatus === "pending") {
        mappedStatus = "pending";
      } else {
        mappedStatus = "expired";
      }
      
      // Special case for uncancelling: always allow transition from ending to active
      const isUncancelling = subscription.status === "ending" && 
                             polarStatus === "active" && 
                             polarDetails && polarDetails.cancel_at_period_end === false;
                           
      if (isUncancelling) {
        console.log("🔄 Detected subscription uncancellation - changing from ending to active");
        console.log("🔄 Status check: " + (subscription.status === "ending"));
        console.log("🔄 Active check: " + (polarStatus === "active"));
        console.log("🔄 Cancel flag check: " + (polarDetails && polarDetails.cancel_at_period_end === false));
        console.log("🔄 Explicitly ensuring cancel_at_period_end is false for uncancellation");
        
        // Force the status to active and ensure cancel flag is false
        mappedStatus = "active";
        if (polarDetails) {
          polarDetails.cancel_at_period_end = false;
        }
      }
      
      console.log(`📝 Final mapped status: ${mappedStatus}`);
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ 
          status: mappedStatus, 
          cancel_at_period_end: polarDetails?.cancel_at_period_end || false,
          updated_at: new Date().toISOString() 
        })
        .eq('id', subscription.id);
      
      if (updateError) {
        console.error("❌ Error updating subscription status:", updateError);
        return { error: "Failed to update subscription status", status: 500 };
      }
      
      console.log("✅ Successfully updated subscription");
      
      return {
        message: "Subscription synced successfully",
        previous_status: subscription.status,
        new_status: mappedStatus,
        previous_cancel_flag: subscription.cancel_at_period_end,
        new_cancel_flag: polarDetails?.cancel_at_period_end || false
      };
    }
    
    // If no update was needed or Polar API couldn't be reached
    console.log("ℹ️ No changes needed, subscription already in sync");
    return {
      message: polarStatus 
        ? "Subscription already in sync" 
        : "Couldn't fetch status from Polar, no changes made",
      status: subscription.status,
      polar_status: polarStatus,
      cancel_at_period_end: subscription.cancel_at_period_end
    };
  } catch (error) {
    console.error("❌ Error in subscription sync:", error);
    return { error: "An unexpected error occurred", status: 500 };
  }
}

// POST endpoint for triggering a sync
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult.userId;
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get optional subscription ID from request body
    const { subscriptionId } = await request.json().catch(() => ({}));
    
    const result = await syncSubscription(userId, subscriptionId);
    
    // Use appropriate status code
    const statusCode = result.status || (result.error ? 500 : 200);
    delete result.status; // Remove status from response body
    
    return NextResponse.json(result, { status: statusCode });
  } catch (error) {
    console.error("Error in subscription sync route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 