import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { Webhooks } from "@polar-sh/nextjs";
import { webhookLogger, formatError } from "@/utils/webhook-logger";

// Get product configuration from environment
const getProductsConfig = () => {
  try {
    const productsData = process.env.NEXT_PUBLIC_PRODUCTS;
    return productsData ? JSON.parse(productsData) : {};
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

// Get the one-time product ID
const getOneTimeProductId = () => {
  const products = getProductsConfig();
  return products.one_time ? getProductId(products.one_time) : "";
};

// Define interfaces for Polar types we need
interface PolarProduct {
  id: string;
  name?: string;
  price?: number;
  metadata?: {
    type?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

interface PolarOrder {
  id: string;
  products?: PolarProduct[];
  product?: PolarProduct;
  customer?: {
    id: string;
    email: string;
  };
  amount?: number;
  currency?: string;
  refunded?: boolean;
  refund_id?: string;
  status?: string;
  metadata?: {
    [key: string]: string | number | boolean | null | undefined;
  };
}

// Helper function to store one-time payment data
async function storeOneTimePaymentData(order: PolarOrder, product: PolarProduct) {
    const logger = webhookLogger('polar');
  const functionTimer = logger.timer('one-time.payment', 'Store one-time payment data');
  
  try {
    logger.debug('one-time.payment', 'Starting storeOneTimePaymentData', { orderId: order.id });
    logger.debug('one-time.payment', 'Order data', order);
    logger.debug('one-time.payment', 'Product data', product);
    
    // Use admin client that bypasses RLS
    const supabase = createAdminSupabaseClient();
    
    // We only need to process orders with customer emails
    if (order.customer?.email) {
      const customerEmail = order.customer.email;
      logger.info('one-time.payment', `Processing one-time payment for customer email: ${customerEmail}`);
      
      // Use proper parameterized queries instead of string interpolation to prevent SQL injection
      let matchedUsers = null; // Variable to store matched users from any of the search methods
      
      // Try exact match first
      const { data: exactUsers, error: userError } = await supabase
        .from("profiles")
        .select("user_id, email")
        .eq("email", customerEmail)
        .limit(5);  // Get multiple matches if they exist
      
      if (!userError && exactUsers && exactUsers.length > 0) {
        matchedUsers = exactUsers;
        logger.debug('one-time.payment', `Found ${exactUsers.length} users matching email ${customerEmail}`);
      } else {
        logger.debug('one-time.payment', `No users found with exact match, trying broader search...`);
        
        // Try a broader search with ILIKE
        const { data: broadUsers, error: broadError } = await supabase
          .from("profiles")
          .select("user_id, email")
          .ilike("email", customerEmail)
          .limit(5);
            
        if (!broadError && broadUsers && broadUsers.length > 0) {
          matchedUsers = broadUsers;
          logger.debug('one-time.payment', `Found users with broader search: ${JSON.stringify(broadUsers)}`);
        } else {
          const emailDomain = customerEmail.split('@')[1];
          const emailUsername = customerEmail.split('@')[0];
          
          // Try a broader search if we have domain and username
          if (emailDomain && emailUsername) {
            logger.debug('one-time.payment', `Trying broader search with username: ${emailUsername} and domain: ${emailDomain}`);
            
            // Search for emails that contain the username and domain parts
            const { data: domainUsers, error: domainError } = await supabase
              .from("profiles")
              .select("user_id, email")
              .ilike("email", `%${emailUsername}%@%${emailDomain}%`)
              .limit(5);
              
            if (!domainError && domainUsers && domainUsers.length > 0) {
              matchedUsers = domainUsers;
              logger.debug('one-time.payment', `Found users with domain search: ${JSON.stringify(domainUsers)}`);
            } else {
              logger.debug('one-time.payment', `No users found with broader search either`);
            }
          }
        }
      }
      
      // Log found users for debugging
      if (matchedUsers && matchedUsers.length > 0) {
        logger.debug('one-time.payment', `Found ${matchedUsers.length} matching users for email ${customerEmail}:`);
        matchedUsers.forEach((u: { user_id: string, email: string }, i: number) => {
          logger.debug('one-time.payment', `  Match ${i+1}: user_id=${u.user_id}, email=${u.email}`);
        });
        
        // Use the first match
        const userData = matchedUsers[0];
        logger.debug('one-time.payment', `Using user: ${userData.user_id} with email: ${userData.email}`);
        
        // Status for one-time payments is always "active"
        const status = "active";
        
        // Get product details - ENHANCED EXTRACTION OF PRODUCT ID
        let product_id;
        
        // Try multiple sources to get the product ID
        if (product && product.id) {
          product_id = product.id;
          logger.debug('one-time.payment', `Using product ID from product object: ${product_id}`);
        } else if (order.product && order.product.id) {
          product_id = order.product.id;
          logger.debug('one-time.payment', `Using product ID from order.product: ${product_id}`);
        } else if (order.metadata && order.metadata.product_id) {
          product_id = order.metadata.product_id;
          logger.debug('one-time.payment', `Using product ID from order metadata: ${product_id}`);
        } else if (order.products && order.products.length > 0 && order.products[0].id) {
          product_id = order.products[0].id;
          logger.debug('one-time.payment', `Using product ID from first product in products array: ${product_id}`);
        } else {
          // Fallback to a default product ID
          product_id = getOneTimeProductId() || "one_time_payment";
          logger.debug('one-time.payment', `Using default product ID: ${product_id}`);
        }
        
        // For one-time payments, set a far future end date (10 years from now)
        const currentDate = new Date();
        const farFutureDate = new Date();
        farFutureDate.setFullYear(currentDate.getFullYear() + 10);
        
        // Extract price from order if available
        const amount = order.amount || product.price || 9900; // Default to $99 if no price found
        const currency = order.currency || "USD";
        
        // First check if this user already has any subscription entry
        logger.debug('one-time.payment', `Checking for existing subscriptions for user: ${userData.user_id}`);
        const { data: existingSubscriptions, error: existingError } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("user_id", userData.user_id)
          .order("updated_at", { ascending: false })
          .limit(1);
        
        if (existingError) {
          logger.error('one-time.payment', "Error checking existing subscriptions:", existingError);
          return;
        }
        
        let result;
        
        // If user already has a subscription, update it instead of creating a new one
        if (existingSubscriptions && existingSubscriptions.length > 0) {
          const existingId = existingSubscriptions[0].id;
          logger.debug('one-time.payment', `Found existing subscription with ID ${existingId}, updating to one-time payment`);
          
          result = await supabase
            .from("subscriptions")
            .update({
              product_id: product_id,
              status: status,
              billing_period: "one_time",
              current_period_start: currentDate.toISOString(),
              current_period_end: farFutureDate.toISOString(),
              cancel_at_period_end: false,
              amount: amount,
              currency: currency,
              customer_id: order.customer.id,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingId)
            .select();
        } else {
          // If no existing subscription, create a new one
          logger.debug('one-time.payment', `No existing subscription found for user ${userData.user_id}, creating new record`);
          
          result = await supabase
            .from("subscriptions")
            .insert({
              id: crypto.randomUUID(),
              user_id: userData.user_id,
              product_id: product_id,
              status: status,
              billing_period: "one_time",
              current_period_start: currentDate.toISOString(),
              current_period_end: farFutureDate.toISOString(),
              cancel_at_period_end: false,
              amount: amount,
              currency: currency,
              customer_id: order.customer.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select();
        }
        
        const { data: subscriptionData, error: subscriptionError } = result;
        
        if (subscriptionError) {
          logger.error('one-time.payment', "Error managing subscription:", subscriptionError);
          // Fix error logging by combining arguments
          logger.error('one-time.payment', `Details: ${subscriptionError.message}, ${JSON.stringify(subscriptionError.details)}`);
        } else {
          logger.debug('one-time.payment', `✅ Subscription update/insertion completed. Data:`, JSON.stringify(subscriptionData));
        }
      } else {
        logger.debug('one-time.payment', `No user found for email ${customerEmail}`);
      }
    }
  } catch (error) {
    logger.error('one-time.payment', 'Error processing one-time payment', formatError(error));
  } finally {
    functionTimer.end();
  }
}

// Define a proper interface for Polar subscriptions
interface PolarSubscription {
  id: string;
  customer_email?: string;
  customer_id?: string;
  product_id?: string;
  status?: string;
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  created_at?: number;
  // Specific objects that may be present in the subscription data
  items?: {
    price?: {
      id?: string;
      product_id?: string;
      price_id?: string;
      price?: number;
      interval?: string;
    };
    product?: {
      id?: string;
      name?: string;
    };
  }[];
  // For customer data
  customer?: {
    id?: string;
    email?: string;
  };
  // For product data
  product?: {
    id?: string;
    name?: string;
  };
  
  // NOTE ON TYPE SAFETY:
  // We initially tried to replace 'any' with more specific types such as:
  // type PolarBaseValue = string | number | boolean | null | undefined;
  // type PolarNestedObject = Record<string, unknown>;
  // type PolarValue = PolarBaseValue | PolarNestedObject | Array<unknown>;
  // [key: string]: PolarValue;
  //
  // However, this caused 20+ TypeScript errors throughout the codebase because:
  // 1. External API data structures are complex and unpredictable
  // 2. Property access patterns vary throughout the code
  // 3. Some objects have special types like Date that don't fit the index signature
  //
  // Using 'any' here is a deliberate decision with these tradeoffs:
  // - PRO: Code works correctly at runtime
  // - PRO: Avoids excessive type assertions throughout the codebase
  // - CON: Less type safety for dynamic property access
  //
  // A future refactoring should properly type all subscription data structures
  // with a more comprehensive type system or schema validation library.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Helper function to store subscription data
async function storeSubscriptionData(subscription: PolarSubscription, eventType: string) {
  const logger = webhookLogger('polar');
  const functionTimer = logger.timer(eventType, 'storeSubscriptionData');
  
  try {
    logger.debug(eventType, 'Starting storeSubscriptionData', { eventType });
    logger.debug(eventType, 'Subscription data to process', subscription);
    
    // Use admin client that bypasses RLS
    const supabase = createAdminSupabaseClient();
    
    // We only need to process subscriptions with customer emails
    if (subscription.customer?.email) {
      const customerEmail = subscription.customer.email;
      const customerStep = logger.step(eventType, 'Processing customer data');
      customerStep.success(`Found customer email: ${customerEmail}`);
      
      // Use parameterized queries instead of string interpolation
      const { data: users, error: userError } = await supabase
        .from("profiles")
        .select("user_id, email")
        .eq("email", customerEmail)
        .limit(5);  // Get multiple matches if they exist

      if (userError) {
        logger.error(eventType, 'Error querying profiles table', {
          error: userError.message,
          details: userError.details,
          customerEmail
        });
        return;
      }
      
      // Log found users for debugging
      if (users && users.length > 0) {
        logger.info(eventType, `Found ${users.length} matching users for email ${customerEmail}`);
        users.forEach((u, i) => {
          logger.debug(eventType, `Match ${i+1}: user_id=${u.user_id}, email=${u.email}`);
        });
        
        // Use the first match
        const userData = users[0];
        logger.info(eventType, `Using user: ${userData.user_id} with email: ${userData.email}`);
        
        // Map event type to subscription status
        let status;
        if (eventType === "subscription.cancelled") {
          // Check what kind of cancellation we're dealing with
          if (subscription.status === "canceled" || subscription.status === "cancelled") {
            // Immediate cancellation by admin in Polar portal
            status = "canceled";
            logger.info(eventType, 'Subscription has been immediately canceled by admin');
          } else if (subscription.cancelAtPeriodEnd === true) {
            // End-of-period cancellation (either by admin or by customer)
            status = "ending";
            logger.info(eventType, 'Subscription is set to end at period end (admin or customer cancellation)');
          } else {
            // Fallback for any other cancellation scenario
            status = "ending";
            logger.info(eventType, 'Subscription cancellation detected with unknown pattern - marking as ending');
          }
        } else if (eventType === "subscription.expired") {
          status = "inactive"; // No longer active
        } else if (eventType === "subscription.created") {
          status = "active"; // New subscription
        } else if (eventType === "subscription.updated") {
          // For updates, check the actual status from Polar 
          // AND check if cancel_at_period_end is true (indicates cancellation)
          if (subscription.status === "active") {
            // Check cancel_at_period_end flag to determine if active or ending
            if (subscription.cancelAtPeriodEnd === true) {
              status = "ending"; // It's active but will end at period end
              logger.info(eventType, 'Subscription is active but will cancel at period end - marking as \'ending\'');
            } else {
              // Definitely active and will renew
              status = "active";
              logger.info(eventType, 'Subscription is active and will renew (cancel_at_period_end=false)');
            }
          } else if (subscription.status === "past_due") {
            status = "past_due";
          } else if (subscription.status === "unpaid") {
            status = "unpaid";
          } else if (subscription.status === "canceled" || subscription.status === "cancelled") {
            status = "canceled";
          } else if (subscription.status === "trial" || subscription.status === "trialing") {
            status = "trial";
          } else if (subscription.status === "paused") {
            status = "paused";
          } else if (subscription.status === "incomplete") {
            status = "incomplete";
          } else if (subscription.status === "incomplete_expired") {
            status = "incomplete_expired";
          } else if (subscription.status === "ended" || subscription.status === "ending") {
            status = "ending";
          } else if (subscription.status === "pending") {
            status = "pending";
          } else {
            // Default to active if status is unknown, but still check cancel_at_period_end
            logger.warn(eventType, `Unknown Polar subscription status: ${subscription.status}, defaulting to active`);
            if (subscription.cancelAtPeriodEnd === true) {
              status = "ending";
              logger.info(eventType, 'Subscription has unknown status but will cancel at period end - marking as \'ending\'');
            } else {
              status = "active";
            }
          }
        } else {
          // For other events, keep existing status or default to active
          status = subscription.status || "active";
        }
        
        logger.info(eventType, `Mapped Polar status to database status: ${status}`);
        
        // Get product details
        // First try to get product from plan, then from product properties
        const planProduct = subscription.plan?.product;
        const product = subscription.product;
        
        // Enhanced extraction logic for product_id
        let product_id = null;
        logger.debug(eventType, 'Attempting to extract product_id...');
        
        // Try all possible paths where product_id might be stored
        if (planProduct && planProduct.id) {
          product_id = planProduct.id;
          logger.debug(eventType, `Found product_id from plan.product.id: ${product_id}`);
        } else if (product && product.id) {
          product_id = product.id;
          logger.debug(eventType, `Found product_id from product.id: ${product_id}`);
        } else if (subscription.plan?.id) {
          product_id = subscription.plan.id;
          logger.debug(eventType, `Using plan.id as product_id: ${product_id}`);
        } else if (subscription.product_id) {
          product_id = subscription.product_id;
          logger.debug(eventType, `Found product_id directly in subscription: ${product_id}`);
        } else if (subscription.metadata?.product_id) {
          product_id = subscription.metadata.product_id;
          logger.debug(eventType, `Found product_id in metadata: ${product_id}`);
        } else {
          // Generate a default product_id based on the subscription type if detectable
          const planName = subscription.plan?.name || '';
          const productName = planProduct?.name || product?.name || '';
          const allNames = [planName, productName].filter(Boolean).join('_').toLowerCase();
          
          if (allNames.includes('pro') || allNames.includes('premium')) {
            product_id = 'pro_plan';
            logger.debug(eventType, `Generated product_id based on plan/product name: ${product_id}`);
          } else if (allNames.includes('basic') || allNames.includes('starter')) {
            product_id = 'basic_plan';
            logger.debug(eventType, `Generated product_id based on plan/product name: ${product_id}`);
          } else {
            product_id = 'unknown';
            logger.debug(eventType, `Could not find or generate product_id, using 'unknown'`);
          }
        }
        
        // Enhanced extraction logic for price_id
        let price_id = null;
        logger.debug(eventType, 'Attempting to extract price_id from Polar subscription data...');
        
        // Determine billing period from subscription data
        let billing_period = 'unknown';
        
        // First try to determine periodicity from subscription data
        const interval = subscription.plan?.interval || subscription.interval;
        if (interval) {
          billing_period = interval === 'month' || interval === 'monthly' ? 'monthly' : 
                         interval === 'year' || interval === 'yearly' || interval === 'annual' ? 'annual' : 'unknown';
          logger.debug(eventType, `Detected billing_period: ${billing_period}`);
        } else {
          // Try to extract from other data
          const allData = JSON.stringify(subscription).toLowerCase();
          if (allData.includes('month')) {
            billing_period = 'monthly';
            logger.debug(eventType, 'Determined monthly subscription from data inspection');
          } else if (allData.includes('year') || allData.includes('annual')) {
            billing_period = 'annual';
            logger.debug(eventType, 'Determined annual subscription from data inspection');
          }
        }
        
        // Try all possible paths where price_id might be stored in the Polar data - for logging only
        if (subscription.plan?.price?.id) {
          price_id = subscription.plan.price.id;
          logger.debug(eventType, `Found price_id from plan.price.id: ${price_id}`);
        } else if (subscription.price?.id) {
          price_id = subscription.price.id;
          logger.debug(eventType, `Found price_id from price.id: ${price_id}`);
        } else if (subscription.plan?.price_id) {
          price_id = subscription.plan.price_id;
          logger.debug(eventType, `Found price_id from plan.price_id: ${price_id}`);
        } else if (subscription.price_id) {
          price_id = subscription.price_id;
          logger.debug(eventType, `Found price_id directly in subscription: ${price_id}`);
        } else if (subscription.metadata?.price_id) {
          price_id = subscription.metadata.price_id;
          logger.debug(eventType, `Found price_id in metadata: ${price_id}`);
        } else {
          // If we could not extract a price_id, log this issue
          logger.error(eventType, 'Could not find price_id in Polar subscription data.');
          logger.error(eventType, 'Full subscription data:', JSON.stringify(subscription));
        }
        
        // Ensure we have period dates
        // Check if current_period_start and current_period_end exist and set defaults if not
        const now = new Date();
        const period_start = subscription.current_period_start ? new Date(subscription.current_period_start) : now;
        
        // Determine period end based on status and available data
        let period_end;
        if (subscription.current_period_end) {
          period_end = new Date(subscription.current_period_end);
        } else {
          // Use the billing_period
          if (billing_period === 'annual') {
            // Set period end to 1 year from now
            period_end = new Date(now);
            period_end.setFullYear(period_end.getFullYear() + 1);
            logger.debug(eventType, 'Setting default annual period end (1 year)');
          } else {
            // Default to monthly (30 days)
            period_end = new Date(now);
            period_end.setDate(period_end.getDate() + 30);
            logger.debug(eventType, 'Setting default monthly period end (30 days)');
          }
        }
        
        // Format as ISO strings for database storage
        const current_period_start = period_start.toISOString();
        const current_period_end = period_end.toISOString();
        
        logger.debug(eventType, `Period dates: start=${current_period_start}, end=${current_period_end}`);
        
        // Add debug info
        logger.info(eventType, `Setting subscription status to ${status}`);
        logger.info(eventType, `Final Product ID: ${product_id}`);
        logger.info(eventType, `Final Billing Period: ${billing_period}`);
        
        let result;
        
        // First check if this exact subscription already exists
        const { data: existingSubscription, error: existingError } = await supabase
          .from("subscriptions")
          .select("id, status")
          .eq("id", subscription.id)
          .maybeSingle();
          
        if (existingError) {
          logger.error(eventType, 'Error checking for existing subscription:', existingError);
        }
        
        // Status priority logic - prevent downgrades from terminal statuses 
        // unless it's a legitimate reactivation
        if (existingSubscription) {
          const existingStatus = existingSubscription.status;
          logger.info(eventType, `🔄 Checking status transition: ${existingStatus} -> ${status}`);
          logger.info(eventType, `🔄 Subscription data - status: ${subscription.status}, cancel_at_period_end: ${subscription.cancelAtPeriodEnd}`);
          
          // Check for uncancellation specifically: If status was "ending" and now is "active" with cancel_at_period_end=false
          const isUncancelling = existingStatus === "ending" && 
                               subscription.status === "active" && 
                               subscription.cancelAtPeriodEnd === false;
          
          logger.info(eventType, `🔄 Is this an uncancellation? ${isUncancelling}`);
          logger.info(eventType, `🔄 Status check: ${existingStatus === "ending"}`);
          logger.info(eventType, `🔄 Active check: ${subscription.status === "active"}`);
          logger.info(eventType, `🔄 Cancel flag check: ${subscription.cancelAtPeriodEnd === false}`);
                               
          // Check if we're trying to downgrade from a terminal status to active
          const isTerminalToActive = 
            (existingStatus === "canceled" || existingStatus === "expired") && 
            status === "active";
          
          if (isUncancelling) {
            logger.info(eventType, 'Detected subscription uncancellation: changing from ${existingStatus} to active');
            logger.info(eventType, 'Explicitly ensuring cancel_at_period_end is false for uncancellation');
            
            // Force status to active when uncancelling
            status = "active";
            // Ensure cancel_at_period_end is false
            subscription.cancelAtPeriodEnd = false;
          } else if (isTerminalToActive && eventType !== "subscription.active") {
            logger.info(eventType, 'Preventing downgrade from terminal status ${existingStatus} to ${status}');
            logger.info(eventType, 'This change can only happen via subscription.active event');
            
            // Keep the existing terminal status
            status = existingStatus;
          }
        }
        
        if (existingSubscription) {
          // If exact subscription exists, just update it
          logger.info(eventType, `Found existing subscription with ID ${subscription.id}, updating status from ${existingSubscription.status} to ${status}`);
          
          result = await supabase
            .from("subscriptions")
            .update({
              status: status,
              product_id: product_id,
              billing_period: billing_period,
              amount: subscription.amount,
              currency: subscription.currency,
              current_period_start: current_period_start,
              current_period_end: current_period_end,
              customer_id: subscription.customer?.id,
              updated_at: new Date().toISOString()
            })
            .eq("id", subscription.id)
            .select();
        } else {
          // Check if this user already has any subscription (active or inactive)
          const { data: existingUserSubscription, error: existingUserError } = await supabase
            .from("subscriptions")
            .select("id, status")
            .eq("user_id", userData.user_id)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (existingUserError) {
            logger.error(eventType, 'Error checking for existing user subscription:', existingUserError);
          }
          
          if (existingUserSubscription) {
            // If user already has a subscription, update it instead of creating a new one
            logger.info(eventType, `Found existing user subscription with ID ${existingUserSubscription.id}, updating to new subscription ID ${subscription.id} with status ${status}`);
            
            result = await supabase
              .from("subscriptions")
              .update({
                id: subscription.id,
                status: status,
                product_id: product_id,
                billing_period: billing_period,
                amount: subscription.amount,
                currency: subscription.currency,
                current_period_start: current_period_start,
                current_period_end: current_period_end,
                customer_id: subscription.customer?.id,
                updated_at: new Date().toISOString()
              })
              .eq("id", existingUserSubscription.id)
              .select();
          } else {
            // If no subscription exists for this user, create a new one with all details
            logger.info(eventType, `No existing subscription found for user ${userData.user_id}, creating new record with ID ${subscription.id}`);
            
            result = await supabase
              .from("subscriptions")
              .insert({
                id: subscription.id,
                user_id: userData.user_id,
                status: status,
                product_id: product_id,
                billing_period: billing_period,
                amount: subscription.amount,
                currency: subscription.currency,
                current_period_start: current_period_start,
                current_period_end: current_period_end,
                customer_id: subscription.customer?.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select();
          }
        }
        
        const { data: subData, error: subError } = result;
        
        if (subError) {
          logger.error(eventType, 'Error managing subscription:', subError);
          // Fix error logging by combining arguments
          logger.error(eventType, `Details: ${subError.message}, ${JSON.stringify(subError.details)}`);
        } else {
          logger.info(eventType, `✅ Database operation completed. Rows affected: ${subData?.length}`);
          logger.info(eventType, `Subscription data: ${JSON.stringify(subData)}`);
        }
      } else {
        logger.info(eventType, 'No customer email found in subscription data');
      }
      }
    } catch (error) {
      logger.error(eventType, 'Error in storeSubscriptionData', formatError(error));
    } finally {
      functionTimer.end();
    }
  }

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  
  // Use specific handlers for each event type
  
  // Checkout events
  onCheckoutCreated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('checkout.created', 'Webhook received: checkout.created');
    
    const checkout = payload.data;
    logger.debug('checkout.created', `Checkout created with ID: ${checkout.id}`, checkout);
    
    // We no longer store checkout data as we've simplified the schema
  },
  
  onCheckoutUpdated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('checkout.updated', 'Webhook received: checkout.updated');
    
    const checkout = payload.data;
    logger.debug('checkout.updated', `Checkout updated with ID: ${checkout.id}`, checkout);
    
    // We no longer store checkout data as we've simplified the schema
  },
  
  // Order events
  onOrderCreated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('order.created', 'Webhook received: order.created');
    
    const order = payload.data as PolarOrder;
    logger.debug('order.created', `Order created with ID: ${order.id}`, order);
    
    // Enhanced detection for one-time payment orders
    try {
      // Access either products array or single product
        const productsToCheck = order.products || (order.product ? [order.product] : []);
      
      logger.debug('order.created', 'Products to check for one-time payment', productsToCheck);
      
      // Check if this is a one-time payment order - more robust detection
      if (productsToCheck.length > 0) {
        const detectOneTimeStep = logger.step('order.created', 'Detecting one-time payment');
        
        // Look for one-time payment indicators in any of these fields
        const oneTimeProduct = productsToCheck.find(product => {
          const isOneTimeById = product.id === getOneTimeProductId();
          const isOneTimeByName = product.name && (
            product.name.toLowerCase().includes('lifetime') || 
            product.name.toLowerCase().includes('one time') ||
            product.name.toLowerCase().includes('one-time')
          );
          const isOneTimeByMetadata = product.metadata?.type === 'one_time';
          
          // Log what we found
          if (isOneTimeById) logger.debug('order.created', `Found one-time product by ID: ${product.id}`);
          if (isOneTimeByName) logger.debug('order.created', `Found one-time product by name: ${product.name}`);
          if (isOneTimeByMetadata) logger.debug('order.created', `Found one-time product by metadata`);
          
          return isOneTimeById || isOneTimeByName || isOneTimeByMetadata;
        });
        
        // If we found a one-time product and have customer email
        if (oneTimeProduct) {
          detectOneTimeStep.success('One-time payment product detected', oneTimeProduct);
          
          if (order.customer?.email) {
            logger.info('order.created', `Processing one-time payment for customer: ${order.customer.email}`);
            
            // Time the operation to store the payment data
            const storageTimer = logger.timer('order.created', 'Store one-time payment data');
            await storeOneTimePaymentData(order, oneTimeProduct);
            storageTimer.end();
            } else {
            logger.error('order.created', 'One-time payment detected but no customer email found', {
              orderId: order.id,
              product: oneTimeProduct
            });
          }
        } else {
          detectOneTimeStep.success('Not a one-time payment order, regular product');
      }
    } else {
        logger.warn('order.created', 'No products found in order data', {
          orderId: order.id
        });
    }
  } catch (error) {
      logger.error('order.created', 'Error processing order for one-time payment detection', formatError(error));
  }
  },

  // Handle order updates (removed refund handling since we don't offer refunds)
  onOrderUpdated: async (payload) => {
  const logger = webhookLogger('polar');
    logger.info('order.updated', 'Webhook received: order.updated');
    
    const order = payload.data as PolarOrder;
    logger.debug('order.updated', `Order updated with ID: ${order.id}`, order);
    
    // No refund processing since refunds are not offered
  },
  
  // Removed refund handling for onOrderRefunded
  onOrderRefunded: async (/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    payload) => {
    const logger = webhookLogger('polar');
    logger.info('order.refunded', 'Webhook received: order.refunded');
    logger.info('order.refunded', 'Refunds are not supported in this application');
  },
  
  // Subscription events
  onSubscriptionCreated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('subscription.created', 'Webhook received: subscription.created');
    
    const subscription = payload.data;
    logger.debug('subscription.created', `Subscription created with ID: ${subscription.id}`, subscription);
    
    await storeSubscriptionData(subscription, "subscription.created");
  },
  
  onSubscriptionUpdated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('subscription.updated', 'Webhook received: subscription.updated');
    
    const subscription = payload.data;
    logger.debug('subscription.updated', `Subscription updated: ${subscription.id}, status: ${subscription.status}, cancel_at_period_end: ${subscription.cancelAtPeriodEnd}`, subscription);
    
    // Force direct status handling for updates to ensure we're always in sync
    await storeSubscriptionData(subscription, "subscription.updated");
  },
  
  onSubscriptionCanceled: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('subscription.canceled', 'Webhook received: subscription.canceled');
    
    const subscription = payload.data;
    logger.debug('subscription.canceled', `Subscription canceled: ${subscription.id}, status: ${subscription.status}, cancel_at_period_end: ${subscription.cancelAtPeriodEnd}`, subscription);
    
    await storeSubscriptionData(subscription, "subscription.cancelled");
  },
  
  onSubscriptionRevoked: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('subscription.revoked', 'Webhook received: subscription.revoked');
    
    const subscription = payload.data;
    logger.debug('subscription.revoked', `Subscription revoked with ID: ${subscription.id}`, subscription);
    
    await storeSubscriptionData(subscription, "subscription.expired");
  },
  
  onSubscriptionActive: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('subscription.active', 'Webhook received: subscription.active');
    
    const subscription = payload.data;
    logger.debug('subscription.active', `Subscription active: ${subscription.id}, status: ${subscription.status}, cancel_at_period_end: ${subscription.cancelAtPeriodEnd}`, subscription);
    
    await storeSubscriptionData(subscription, "subscription.active");
  },
  
  // Customer events
  onCustomerCreated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('customer.created', 'Webhook received: customer.created');
    const customer = payload.data;
    logger.debug('customer.created', `Customer created with ID: ${customer.id}`, customer);
    // We don't need to store customer data separately anymore
  },
  
  onCustomerUpdated: async (payload) => {
    const logger = webhookLogger('polar');
    logger.info('customer.updated', 'Webhook received: customer.updated');
    const customer = payload.data;
    logger.debug('customer.updated', `Customer updated with ID: ${customer.id}`, customer);
    // We don't need to store customer data separately anymore
  },
});
