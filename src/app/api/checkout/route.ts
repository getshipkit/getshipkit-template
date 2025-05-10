import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { POLAR_PRODUCT_IDS } from "@/config/polarProductIds";

// Use the centralized product IDs from our configuration
const PRODUCT_KEYS = {
  starter_monthly: "starter_monthly",
  starter_annual: "starter_annual",
  pro_monthly: "pro_monthly",
  pro_annual: "pro_annual",
  enterprise_monthly: "enterprise_monthly",
  enterprise_annual: "enterprise_annual",
  one_time_payment: "one_time"
};

// Parse product configuration from environment
const getProductData = () => {
  try {
    const productsData = process.env.NEXT_PUBLIC_PRODUCTS;
    const products = productsData ? JSON.parse(productsData) : {};
    return products;
  } catch (error) {
    console.error("Error parsing products data:", error);
    return {};
  }
};

// Parse product ID from the combined format
const getProductId = (value: string) => {
  const parts = value.split(':');
  return parts.length === 2 ? parts[0] : value;
};

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await auth();
    const userId = authResult.userId;
    
    // Get productId from URL params
    const { searchParams } = new URL(request.url);
    const productKey = searchParams.get("productId");
    
    console.log(`Received checkout request for product: ${productKey}`);
    
    if (!productKey || !Object.keys(PRODUCT_KEYS).includes(productKey)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }
    
    // Get the actual Polar product ID from our configuration
    let polarProductId;
    
    // First try to get it from the POLAR_PRODUCT_IDS mapping
    polarProductId = POLAR_PRODUCT_IDS[productKey as keyof typeof POLAR_PRODUCT_IDS];
    
    // If that fails, try parsing from NEXT_PUBLIC_PRODUCTS
    if (!polarProductId) {
      const products = getProductData();
      const mappedKey = PRODUCT_KEYS[productKey as keyof typeof PRODUCT_KEYS];
      if (products[mappedKey]) {
        polarProductId = getProductId(products[mappedKey]);
      }
    }
    
    console.log(`Looking for product key: ${productKey}, found ID: ${polarProductId}`);
    
    if (!polarProductId) {
      console.error(`Product ID not found for ${productKey}`);
      return NextResponse.json({ error: `Product configuration error: ID not found for ${productKey}` }, { status: 500 });
    }

    // Check access token
    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Polar access token is missing");
      return NextResponse.json({ error: "Missing POLAR_ACCESS_TOKEN" }, { status: 500 });
    }

    // Get Polar mode from environment (default to sandbox)
    const polarMode = process.env.POLAR_MODE || "sandbox";
    console.log(`Using Polar API mode: ${polarMode}`);

    // Get user email if authenticated
    let userEmail = null;
    if (userId) {
      try {
        const user = await clerkClient.users.getUser(userId);
        userEmail = user.emailAddresses[0]?.emailAddress;
        console.log(`Found user email: ${userEmail}`);
      } catch (error) {
        console.warn("Could not retrieve user email:", error);
      }
    }

    // Initialize Polar client
    const polar = new Polar({
      accessToken: accessToken,
      server: polarMode as "sandbox" | "production",
    });

    // Create checkout session
    console.log(`Creating checkout with product ID: ${polarProductId}`);
    const checkout = await polar.checkouts.create({
      products: [polarProductId],
      successUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000/dashboard/billing?success=true",
      customerEmail: userEmail || undefined,
    });

    console.log(`Checkout created successfully, redirecting to: ${checkout.url}`);
    // Redirect to checkout URL
    return NextResponse.redirect(checkout.url);
  } catch (error) {
    console.error("Error creating Polar checkout:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 