import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

// This is the webhook handler for Clerk events
// It syncs user data from Clerk to Supabase

export async function POST(req: NextRequest) {
  // Get the Clerk webhook signature from the headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If there are no headers, return a 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with the secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    // Verify the webhook signature
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Error verifying webhook" },
      { status: 400 }
    );
  }

  const eventType = evt.type;
  console.log(`Received Clerk webhook: ${eventType}`);

  try {
    // Handle user creation
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      // Define proper type for email address objects
      interface EmailAddress {
        id: string;
        email_address: string;
      }
      
      // Extract the primary email
      const primaryEmail = email_addresses && email_addresses.length > 0 ? 
        email_addresses.find((email: EmailAddress) => email.id === evt.data.primary_email_address_id)?.email_address : 
        null;

      // Upsert the user profile in Supabase
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          user_id: id,
          email: primaryEmail,
          first_name: first_name || null,
          last_name: last_name || null,
          avatar_url: image_url || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error("Error upserting profile:", error);
        return NextResponse.json(
          { error: "Error saving user to database" },
          { status: 500 }
        );
      }

      console.log(`Successfully synced user profile for ${id}`);
      return NextResponse.json({ success: true, data });
    }

    // Handle user deletion
    if (eventType === "user.deleted") {
      const { id } = evt.data;
      
      // Delete the user profile from Supabase
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", id);

      if (error) {
        console.error("Error deleting profile:", error);
        return NextResponse.json(
          { error: "Error deleting user from database" },
          { status: 500 }
        );
      }

      console.log(`Successfully deleted user profile for ${id}`);
      return NextResponse.json({ success: true });
    }

    // For any other webhook events, just acknowledge
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
} 