/**
 * Mapping of product IDs to Polar API product IDs
 */

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

// Parse product ID and name from the combined format
const parseProductIdWithName = (value: string) => {
  const parts = value.split(':');
  return parts.length === 2 ? { id: parts[0], name: parts[1] } : { id: value, name: 'Unknown' };
};

// Get all product configs
const productsConfig = getProductsConfig();

export const POLAR_PRODUCT_IDS = {
  // Subscription products
  starter_monthly: parseProductIdWithName(productsConfig.starter_monthly || "").id,
  starter_annual: parseProductIdWithName(productsConfig.starter_annual || "").id,
  pro_monthly: parseProductIdWithName(productsConfig.pro_monthly || "").id,
  pro_annual: parseProductIdWithName(productsConfig.pro_annual || "").id,
  enterprise_monthly: parseProductIdWithName(productsConfig.enterprise_monthly || "").id,
  enterprise_annual: parseProductIdWithName(productsConfig.enterprise_annual || "").id,
  
  // One-time product
  one_time_payment: parseProductIdWithName(productsConfig.one_time || "").id
}; 