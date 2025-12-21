import Purchases, { LOG_LEVEL, PurchasesError } from 'react-native-purchases';
import PurchasesUI from 'react-native-purchases-ui';
import { Platform, Alert } from 'react-native';
import apiConfig from '../config/apiConfig';

const { REVENUECAT_API_KEY } = apiConfig;

// Entitlement identifier for Catfish Pro
export const CATFISH_PRO_ENTITLEMENT = 'Catfish Pro';
// Legacy export for backward compatibility
export const TEKJIN_PRO_ENTITLEMENT = CATFISH_PRO_ENTITLEMENT;

// Product identifiers
export const PRODUCT_IDENTIFIERS = {
  BASIC: 'basic',
  PREMIUM_MONTHLY: 'premium_monthly',
  LIFETIME: 'lifetime',
};

let isConfigured = false;

/**
 * Initialize RevenueCat SDK with modern configuration
 * @param {string|null} userId - Optional user ID to link purchases
 */
export async function initializeRevenueCat(userId = null) {
  // Check if RevenueCat is disabled (API keys are null/empty)
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY.ios : REVENUECAT_API_KEY.android;
  
  if (!apiKey || apiKey.includes('YOUR_') || apiKey.trim() === '') {
    console.warn('RevenueCat is disabled. App will continue without RevenueCat features.');
    isConfigured = false; // Ensure it's marked as not configured
    return;
  }

  if (isConfigured) {
    console.log('RevenueCat already configured');
    return;
  }

  try {

    // Configure RevenueCat with debug logging in development
    await Purchases.configure({
      apiKey,
      appUserID: userId || undefined,
      observerMode: false, // Set to true if using webhooks for server-side validation
    });

    // Enable debug logging in development
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    console.log('RevenueCat SDK configured successfully');

    // Set user ID if provided (link to Cognito user ID)
    if (userId) {
      await Purchases.logIn(userId);
      console.log(`RevenueCat user logged in: ${userId}`);
    }

    isConfigured = true;
  } catch (error) {
    console.warn('Error configuring RevenueCat (app will continue without RevenueCat):', error);
    // Don't throw error - allow app to continue without RevenueCat
  }
}

/**
 * Get current offerings (products available for purchase)
 * @returns {Promise<Offerings|null>}
 */
export async function getOfferings() {
  try {
    if (!isConfigured) {
      return null;
    }
    const offerings = await Purchases.getOfferings();
    return offerings;
  } catch (error) {
    console.warn('Error fetching offerings:', error);
    return null;
  }
}

/**
 * Get current customer info (subscription status, entitlements)
 * @returns {Promise<CustomerInfo|null>}
 */
export async function getCustomerInfo() {
  try {
    if (!isConfigured) {
      return null;
    }
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.warn('Error fetching customer info:', error);
    return null;
  }
}

/**
 * Check if user has active Catfish Pro subscription
 * @returns {Promise<boolean>}
 */
export async function hasProSubscription() {
  try {
    if (!isConfigured) {
      return false;
    }
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[CATFISH_PRO_ENTITLEMENT] !== undefined;
  } catch (error) {
    console.warn('Error checking pro subscription:', error);
    return false;
  }
}

/**
 * Get Catfish Pro entitlement status
 * @returns {Promise<{isActive: boolean, willRenew: boolean, expirationDate: string|null}>}
 */
export async function getProEntitlementStatus() {
  try {
    if (!isConfigured) {
      return { isActive: false, willRenew: false, expirationDate: null };
    }
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[CATFISH_PRO_ENTITLEMENT];
    
    if (!entitlement) {
      return { isActive: false, willRenew: false, expirationDate: null };
    }

    return {
      isActive: true,
      willRenew: entitlement.willRenew || false,
      expirationDate: entitlement.expirationDate || null,
      productIdentifier: entitlement.productIdentifier || null,
    };
  } catch (error) {
    console.warn('Error getting pro entitlement status:', error);
    return { isActive: false, willRenew: false, expirationDate: null };
  }
}

/**
 * Purchase a package (product)
 * @param {Package} packageToPurchase - The package to purchase
 * @returns {Promise<CustomerInfo>}
 */
export async function purchasePackage(packageToPurchase) {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }
    
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error) {
    // Handle specific error types
    if (error instanceof PurchasesError) {
      // User cancelled
      if (error.code === PurchasesError.PURCHASE_CANCELLED) {
        throw { ...error, userCancelled: true, message: 'Purchase was cancelled' };
      }
      // Payment pending
      if (error.code === PurchasesError.PAYMENT_PENDING) {
        throw { ...error, message: 'Payment is pending approval' };
      }
      // Store product not available
      if (error.code === PurchasesError.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE) {
        throw { ...error, message: 'Product is not available for purchase' };
      }
    }
    
    console.error('Error purchasing package:', error);
    throw error;
  }
}

/**
 * Purchase a product by identifier
 * @param {string} productIdentifier - Product identifier (monthly, yearly, lifetime)
 * @returns {Promise<CustomerInfo>}
 */
export async function purchaseProduct(productIdentifier) {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }

    const offerings = await getOfferings();
    if (!offerings || !offerings.current) {
      throw new Error('No offerings available');
    }

    // Find the package with matching identifier
    const packageToPurchase = offerings.current.availablePackages.find(
      pkg => pkg.identifier === productIdentifier || 
             pkg.storeProduct.identifier === productIdentifier
    );

    if (!packageToPurchase) {
      throw new Error(`Product ${productIdentifier} not found in available packages`);
    }

    return await purchasePackage(packageToPurchase);
  } catch (error) {
    console.error('Error purchasing product:', error);
    throw error;
  }
}

/**
 * Restore purchases (for users who reinstalled app)
 * @returns {Promise<CustomerInfo|null>}
 */
export async function restorePurchases() {
  try {
    if (!isConfigured) {
      return null;
    }
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.warn('Error restoring purchases:', error);
    throw error;
  }
}

/**
 * Log out current user
 */
export async function logoutRevenueCat() {
  try {
    if (!isConfigured) {
      return;
    }
    await Purchases.logOut();
    console.log('RevenueCat user logged out');
  } catch (error) {
    console.warn('Error logging out RevenueCat:', error);
    // Don't throw - allow logout to continue
  }
}

/**
 * Update user ID (link to Cognito user ID after login)
 * @param {string} userId - User ID to link
 */
export async function updateUserId(userId) {
  try {
    if (!isConfigured) {
      return;
    }
    await Purchases.logIn(userId);
    console.log(`RevenueCat user ID updated: ${userId}`);
  } catch (error) {
    console.warn('Error updating RevenueCat user ID:', error);
    // Don't throw - allow app to continue
  }
}

/**
 * Get available packages from default offering
 * @returns {Promise<Package[]>}
 */
export async function getAvailablePackages() {
  try {
    if (!isConfigured) {
      return [];
    }
    const offerings = await getOfferings();
    if (offerings && offerings.current !== null) {
      return offerings.current.availablePackages;
    }
    return [];
  } catch (error) {
    console.warn('Error getting available packages:', error);
    return [];
  }
}

/**
 * Get packages organized by type (basic, premium_monthly, lifetime)
 * @returns {Promise<{basic: Package|null, premium_monthly: Package|null, lifetime: Package|null}>}
 */
export async function getPackagesByType() {
  try {
    const packages = await getAvailablePackages();
    const result = {
      basic: null,
      premium_monthly: null,
      lifetime: null,
    };

    packages.forEach(pkg => {
      const identifier = pkg.identifier?.toLowerCase() || pkg.storeProduct.identifier?.toLowerCase() || '';
      
      if (identifier.includes('basic') || identifier === 'basic') {
        result.basic = pkg;
      } else if (identifier.includes('premium_monthly') || identifier.includes('premium') && identifier.includes('month')) {
        result.premium_monthly = pkg;
      } else if (identifier.includes('lifetime') || identifier.includes('forever')) {
        result.lifetime = pkg;
      }
    });

    return result;
  } catch (error) {
    console.warn('Error getting packages by type:', error);
    return { basic: null, premium_monthly: null, lifetime: null };
  }
}

/**
 * Present RevenueCat Paywall UI
 * @param {Object} options - Paywall options
 * @returns {Promise<CustomerInfo|null>}
 */
export async function presentPaywall(options = {}) {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }

    const offerings = await getOfferings();
    if (!offerings || !offerings.current) {
      throw new Error('No offerings available');
    }

    // Present the paywall
    const result = await PurchasesUI.presentPaywall(offerings.current, {
      ...options,
    });

    return result;
  } catch (error) {
    console.error('Error presenting paywall:', error);
    
    // Handle user cancellation gracefully
    if (error.code === 'USER_CANCELLED' || error.message?.includes('cancelled')) {
      return null;
    }
    
    throw error;
  }
}

/**
 * Present Customer Center (manage subscriptions)
 * @returns {Promise<void>}
 */
export async function presentCustomerCenter() {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }

    await PurchasesUI.presentCustomerCenter();
  } catch (error) {
    console.error('Error presenting customer center:', error);
    throw error;
  }
}

/**
 * Check purchase eligibility (iOS only)
 * @param {string} productIdentifier - Product identifier
 * @returns {Promise<Object>}
 */
export async function checkPromotionalOfferEligibility(productIdentifier) {
  try {
    if (!isConfigured) {
      return {};
    }
    if (Platform.OS === 'ios') {
      const eligibility = await Purchases.checkPromotionalDiscountEligibility(productIdentifier);
      return eligibility;
    }
    return {};
  } catch (error) {
    console.warn('Error checking promotional offer eligibility:', error);
    return {};
  }
}

/**
 * Sync purchases (useful for debugging or manual sync)
 * @returns {Promise<CustomerInfo>}
 */
export async function syncPurchases() {
  try {
    if (!isConfigured) {
      throw new Error('RevenueCat is not configured');
    }
    const customerInfo = await Purchases.syncPurchases();
    return customerInfo;
  } catch (error) {
    console.warn('Error syncing purchases:', error);
    throw error;
  }
}

/**
 * Check if RevenueCat is configured
 * @returns {boolean} True if RevenueCat API keys are configured and SDK is initialized
 */
export function isRevenueCatConfigured() {
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY.ios : REVENUECAT_API_KEY.android;
  return isConfigured && apiKey && !apiKey.includes('YOUR_') && apiKey.length > 0;
}

/**
 * Get formatted price for a package
 * @param {Package} pkg - Package to get price for
 * @returns {string} Formatted price string
 */
export function getFormattedPrice(pkg) {
  if (!pkg || !pkg.storeProduct) {
    return 'N/A';
  }
  return pkg.storeProduct.priceString || 'N/A';
}

/**
 * Get product identifier from package
 * @param {Package} pkg - Package to get identifier from
 * @returns {string} Product identifier
 */
export function getProductIdentifier(pkg) {
  if (!pkg) {
    return null;
  }
  return pkg.storeProduct.identifier || pkg.identifier || null;
}
