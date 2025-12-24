import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as RevenueCatService from '../services/revenueCatService';
import * as SubscriptionApi from '../services/subscriptionApi';

// Export TEKJIN_PRO_ENTITLEMENT for use in components
export { RevenueCatService };

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user, isAuthenticated, accessToken } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [scansRemaining, setScansRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Legacy fields for backward compatibility
  const [scanCount, setScanCount] = useState(0);
  const [scanLimit, setScanLimit] = useState(Infinity);
  const [isPro, setIsPro] = useState(false);

  /**
   * Initialize RevenueCat when user is authenticated
   * Errors are handled gracefully - app continues without RevenueCat if not configured
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        if (isAuthenticated && user) {
          // Initialize RevenueCat with Cognito user ID
          const userId = user.sub || user.email || user['cognito:username'];
          if (userId) {
            await RevenueCatService.initializeRevenueCat(userId);
          } else {
            await RevenueCatService.initializeRevenueCat();
          }
        } else {
          // Initialize RevenueCat for anonymous users
          await RevenueCatService.initializeRevenueCat();
        }
      } catch (error) {
        // Silently handle RevenueCat initialization errors - app works without it
        console.warn('RevenueCat initialization failed (app will continue without RevenueCat):', error);
      }
    };

    initialize();
  }, [isAuthenticated, user]);

  /**
   * Fetch token balance from backend
   */
  const refreshSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      // Fetch from backend if authenticated
      if (isAuthenticated && accessToken) {
        try {
          const backendStatus = await SubscriptionApi.getSubscriptionStatus(accessToken);
          setSubscriptionStatus(backendStatus);
          
          // Use token balance from backend
          const balance = backendStatus.tokenBalance !== undefined 
            ? backendStatus.tokenBalance 
            : (backendStatus.scansRemaining !== undefined ? backendStatus.scansRemaining : 0);
          
          setTokenBalance(balance);
          setScansRemaining(balance);
          
          // Legacy fields for backward compatibility
          setScanCount(0);
          setScanLimit(Infinity);
          setIsPro(false);
        } catch (backendError) {
          console.warn('Error fetching backend token balance:', backendError);
          // Set defaults on error
          setTokenBalance(0);
          setScansRemaining(0);
          setScanCount(0);
          setScanLimit(Infinity);
          setIsPro(false);
        }
      } else {
        // Not authenticated, set defaults
        setTokenBalance(0);
        setScansRemaining(0);
        setScanCount(0);
        setScanLimit(Infinity);
        setIsPro(false);
      }
    } catch (error) {
      console.error('Error refreshing token balance:', error);
      // Set defaults on error
      setTokenBalance(0);
      setScansRemaining(0);
      setScanCount(0);
      setScanLimit(Infinity);
      setIsPro(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user can perform a scan
   */
  const checkCanScan = async () => {
    if (isAuthenticated && accessToken) {
      try {
        const result = await SubscriptionApi.checkCanScan(accessToken);
        return {
          canScan: result.canScan || (result.scansRemaining > 0),
          scansRemaining: result.scansRemaining !== undefined ? result.scansRemaining : result.tokenBalance || 0,
          tokenBalance: result.tokenBalance !== undefined ? result.tokenBalance : result.scansRemaining || 0,
        };
      } catch (error) {
        console.error('Error checking scan eligibility:', error);
        // Fallback to local check
        return {
          canScan: scansRemaining > 0,
          scansRemaining: scansRemaining,
          tokenBalance: tokenBalance,
        };
      }
    }

    // Not authenticated or no access token, use local state
    return {
      canScan: scansRemaining > 0,
      scansRemaining: scansRemaining,
      tokenBalance: tokenBalance,
    };
  };

  /**
   * Decrement token after successful scan
   */
  const decrementToken = async () => {
    // Update local state immediately for better UX
    const newBalance = Math.max(0, tokenBalance - 1);
    setTokenBalance(newBalance);
    setScansRemaining(newBalance);

    // Update backend if authenticated
    if (isAuthenticated && accessToken) {
      try {
        const result = await SubscriptionApi.decrementToken(accessToken);
        // Update with actual balance from backend
        if (result.tokenBalance !== undefined) {
          setTokenBalance(result.tokenBalance);
          setScansRemaining(result.tokenBalance);
        }
      } catch (error) {
        console.error('Error decrementing token on backend:', error);
        // Revert local state on error
        setTokenBalance(tokenBalance);
        setScansRemaining(scansRemaining);
      }
    }
  };

  /**
   * Purchase token pack
   * Enhanced with better error handling
   */
  const purchaseTokenPack = async (packageToPurchase) => {
    try {
      // Purchase through RevenueCat (consumable product)
      const customerInfo = await RevenueCatService.purchasePackage(packageToPurchase);
      
      // Extract pack ID from package identifier
      // Package identifiers should be: pack_5, pack_20, pack_50
      const packId = packageToPurchase.identifier || packageToPurchase.storeProduct?.identifier;
      
      // Notify backend about the purchase to add tokens
      if (isAuthenticated && accessToken && packId) {
        try {
          const transactionId = customerInfo.originalPurchaseDate || Date.now().toString();
          await SubscriptionApi.purchaseTokenPack(accessToken, packId, transactionId);
        } catch (backendError) {
          console.error('Error notifying backend of token purchase:', backendError);
          // Continue even if backend notification fails - RevenueCat purchase succeeded
        }
      }
      
      // Refresh token balance after purchase
      await refreshSubscriptionStatus();
      return customerInfo;
    } catch (error) {
      console.error('Error purchasing token pack:', error);
      // Re-throw with user-friendly message if needed
      if (error.userCancelled) {
        throw { ...error, message: 'Purchase was cancelled' };
      }
      throw error;
    }
  };

  /**
   * Purchase subscription (legacy - kept for backward compatibility)
   * Now redirects to purchaseTokenPack
   */
  const purchaseSubscription = async (packageToPurchase) => {
    return purchaseTokenPack(packageToPurchase);
  };

  /**
   * Restore purchases
   * Enhanced with better error handling and entitlement verification
   */
  const restorePurchases = async () => {
    try {
      const customerInfo = await RevenueCatService.restorePurchases();
      
      // Verify restoration by checking Catfish Pro entitlement
      const hasPro = customerInfo.entitlements.active[RevenueCatService.CATFISH_PRO_ENTITLEMENT] || 
                     customerInfo.entitlements.active[RevenueCatService.TEKJIN_PRO_ENTITLEMENT];
      
      // Refresh subscription status after restore
      await refreshSubscriptionStatus();
      
      return { customerInfo, hasPro };
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  };

  /**
   * Get available packages for purchase
   */
  const getAvailablePackages = async () => {
    try {
      return await RevenueCatService.getAvailablePackages();
    } catch (error) {
      console.error('Error getting available packages:', error);
      return [];
    }
  };

  /**
   * Get packages organized by type (basic, premium_monthly, lifetime)
   */
  const getPackagesByType = async () => {
    try {
      return await RevenueCatService.getPackagesByType();
    } catch (error) {
      console.error('Error getting packages by type:', error);
      return { basic: null, premium_monthly: null, lifetime: null };
    }
  };

  /**
   * Present RevenueCat Paywall UI
   */
  const presentPaywall = async () => {
    try {
      const customerInfo = await RevenueCatService.presentPaywall();
      if (customerInfo) {
        await refreshSubscriptionStatus();
      }
      return customerInfo;
    } catch (error) {
      console.error('Error presenting paywall:', error);
      throw error;
    }
  };

  /**
   * Present Customer Center (manage subscriptions)
   */
  const presentCustomerCenter = async () => {
    try {
      await RevenueCatService.presentCustomerCenter();
      // Refresh status after customer center interaction
      await refreshSubscriptionStatus();
    } catch (error) {
      console.error('Error presenting customer center:', error);
      throw error;
    }
  };

  /**
   * Get customer info with TEKJIN Pro entitlement status
   */
  const getCustomerInfo = async () => {
    try {
      const customerInfo = await RevenueCatService.getCustomerInfo();
      const entitlementStatus = await RevenueCatService.getProEntitlementStatus();
      return { customerInfo, entitlementStatus };
    } catch (error) {
      console.error('Error getting customer info:', error);
      return null;
    }
  };

  /**
   * Refresh subscription status when authentication changes
   */
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscriptionStatus();
    } else {
      // Reset to defaults when logged out
      setTokenBalance(0);
      setScansRemaining(0);
      setScanCount(0);
      setScanLimit(Infinity);
      setIsPro(false);
      setIsLoading(false);
    }
  }, [isAuthenticated, accessToken]);

  const value = {
    subscriptionStatus,
    tokenBalance,
    scansRemaining,
    isLoading,
    // Legacy fields for backward compatibility
    scanCount,
    scanLimit,
    isPro,
    refreshSubscriptionStatus,
    checkCanScan,
    decrementToken,
    purchaseTokenPack,
    purchaseSubscription, // Legacy alias
    restorePurchases,
    getAvailablePackages,
    getPackagesByType,
    presentPaywall,
    presentCustomerCenter,
    getCustomerInfo,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

