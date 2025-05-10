/**
 * Payment Model Utilities
 * 
 * Provides helper functions for checking the configured payment model.
 * The payment model is set via the NEXT_PUBLIC_PAYMENT_MODEL environment variable,
 * which can be either 'subscription' or 'onetime'.
 */

export type PaymentModel = 'subscription' | 'onetime';

/**
 * Gets the current payment model from environment variables
 */
export function getPaymentModel(): PaymentModel {
  const model = process.env.NEXT_PUBLIC_PAYMENT_MODEL?.toLowerCase();
  return (model === 'onetime' ? 'onetime' : 'subscription');
}

/**
 * Checks if the current payment model is subscription-based
 */
export function isSubscriptionModel(): boolean {
  return getPaymentModel() === 'subscription';
}

/**
 * Checks if the current payment model is one-time payment
 */
export function isOneTimeModel(): boolean {
  return getPaymentModel() === 'onetime';
} 