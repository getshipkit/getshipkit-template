import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "@/lib/supabase-auth";

// Make sure the access token exists
const accessToken = process.env.POLAR_ACCESS_TOKEN;
if (!accessToken) {
  throw new Error("POLAR_ACCESS_TOKEN is not defined");
}

// Get the Polar server mode from environment variables
const polarMode = process.env.POLAR_MODE;
if (!polarMode || (polarMode !== "sandbox" && polarMode !== "production")) {
  console.warn("POLAR_MODE not set or invalid. Using sandbox as default.");
}

export const GET = CustomerPortal({
  accessToken,
  getCustomerId: async (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    req: NextRequest) => {
    try {
      // Get the current authenticated user from Clerk
      const { userId } = await auth();
      
      if (!userId) {
        return "";
      }
      
      // Create an authenticated Supabase client
      const supabase = createServerSupabaseClient();
      
      // Get the customer_id from the subscriptions table for this user
      // Include all subscription statuses that should have access to manage their subscription
      const { data, error } = await supabase
        .from('subscriptions')
        .select('customer_id')
        .eq('user_id', userId)
        .in('status', ['active', 'ending', 'trial', 'past_due'])
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !data || !data.customer_id) {
        console.error("Error getting customer_id:", error || "No valid subscription found");
        return "";
      }
      
      // Return the customer_id as a string
      return data.customer_id;
    } catch (error) {
      console.error("Error getting customer ID:", error);
      return "";
    }
  },
  server: polarMode as "sandbox" | "production" || "sandbox", // Use environment variable or default to sandbox
}); 