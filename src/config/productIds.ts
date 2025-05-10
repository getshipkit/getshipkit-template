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

// Mapping of plan types to product ID keys and display names
// These match the product ID keys used in the checkout API route
export const PRODUCT_IDS = {
  starter: {
    monthly: "starter_monthly",
    annual: "starter_annual",
    displayName: productsConfig.starter_monthly ? parseProductIdWithName(productsConfig.starter_monthly).name : "Starter"
  },
  pro: {
    monthly: "pro_monthly",
    annual: "pro_annual",
    displayName: productsConfig.pro_monthly ? parseProductIdWithName(productsConfig.pro_monthly).name : "Pro"
  },
  enterprise: {
    monthly: "enterprise_monthly",
    annual: "enterprise_annual",
    displayName: productsConfig.enterprise_monthly ? parseProductIdWithName(productsConfig.enterprise_monthly).name : "Enterprise"
  },
  oneTime: "one_time_payment",
  displayNames: {
    // Generate display names for all products
    ...(Object.keys(productsConfig).reduce((acc, key) => {
      const parsed = parseProductIdWithName(productsConfig[key]);
      return { ...acc, [key]: parsed.name };
    }, {})),
    
    // Fallbacks for backward compatibility
    starter_monthly: productsConfig.starter_monthly ? parseProductIdWithName(productsConfig.starter_monthly).name : "Starter",
    starter_annual: productsConfig.starter_annual ? parseProductIdWithName(productsConfig.starter_annual).name : "Starter",
    pro_monthly: productsConfig.pro_monthly ? parseProductIdWithName(productsConfig.pro_monthly).name : "Pro",
    pro_annual: productsConfig.pro_annual ? parseProductIdWithName(productsConfig.pro_annual).name : "Pro",
    enterprise_monthly: productsConfig.enterprise_monthly ? parseProductIdWithName(productsConfig.enterprise_monthly).name : "Enterprise",
    enterprise_annual: productsConfig.enterprise_annual ? parseProductIdWithName(productsConfig.enterprise_annual).name : "Enterprise",
    one_time_payment: productsConfig.one_time ? parseProductIdWithName(productsConfig.one_time).name : "Lifetime"
  },
  // Direct ID-to-name mapping
  idToName: Object.keys(productsConfig).reduce((acc, key) => {
    const parsed = parseProductIdWithName(productsConfig[key]);
    return { ...acc, [parsed.id]: parsed.name };
  }, {} as Record<string, string>)
}; 