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
  const [scanCount, setScanCount] = useState(0);
  const [scanLimit, setScanLimit] = useState(3);
  const [scansRemaining, setScansRemaining] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
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
   * Fetch subscription status from backend and RevenueCat
   * Uses TEKJIN Pro entitlement for checking subscription status
   */
  const refreshSubscriptionStatus = async () => {
    setIsLoading(true);
    try {
      // Fetch from RevenueCat first - check for TEKJIN Pro entitlement
      let hasProRC = false;
      let entitlementStatus = null;
      
      try {
        hasProRC = await RevenueCatService.hasProSubscription();
        entitlementStatus = await RevenueCatService.getProEntitlementStatus();
      } catch (rcError) {
        console.warn('Error checking RevenueCat subscription:', rcError);
      }

      // Fetch from backend if authenticated
      if (isAuthenticated && accessToken) {
        try {
          const backendStatus = await SubscriptionApi.getSubscriptionStatus(accessToken);
          setSubscriptionStatus(backendStatus);
          
          if (backendStatus.subscription) {
            // Use RevenueCat status as source of truth, but also check backend
            setIsPro(backendStatus.subscription.isPro || hasProRC);
            setScanCount(backendStatus.scanCount || 0);
            setScanLimit(backendStatus.scanLimit || 3);
            setScansRemaining(backendStatus.scansRemaining || 3);
          } else {
            // Fallback to RevenueCat status
            setIsPro(hasProRC);
            setScanLimit(hasProRC ? Infinity : 3);
            setScansRemaining(hasProRC ? Infinity : 3);
          }
        } catch (backendError) {
          console.warn('Error fetching backend subscription status:', backendError);
          // Fallback to RevenueCat status
          setIsPro(hasProRC);
          setScanLimit(hasProRC ? Infinity : 3);
          setScansRemaining(hasProRC ? Infinity : 3);
        }
      } else {
        // Not authenticated, use RevenueCat only
        setIsPro(hasProRC);
        setScanLimit(hasProRC ? Infinity : 3);
        setScansRemaining(hasProRC ? Infinity : 3);
      }
    } catch (error) {
      console.error('Error refreshing subscription status:', error);
      // Set defaults on error
      setIsPro(false);
      setScanCount(0);
      setScanLimit(3);
      setScansRemaining(3);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user can perform a scan
   */
  const checkCanScan = async () => {
    if (isPro) {
      return { canScan: true, scansRemaining: Infinity };
    }

    if (isAuthenticated && accessToken) {
      try {
        const result = await SubscriptionApi.checkCanScan(accessToken);
        return result;
      } catch (error) {
        console.error('Error checking scan eligibility:', error);
        // Fallback to local check
        return {
          canScan: scansRemaining > 0,
          scansRemaining: scansRemaining,
        };
      }
    }

    // Not authenticated or no access token, use local state
    return {
      canScan: scansRemaining > 0,
      scansRemaining: scansRemaining,
    };
  };

  /**
   * Increment scan count after successful scan
   */
  const incrementScanCount = async () => {
    if (isPro) {
      // Pro users have unlimited scans, no need to increment
      return;
    }

    // Update local state immediately for better UX
    const newCount = scanCount + 1;
    const newRemaining = Math.max(0, scanLimit - newCount);
    setScanCount(newCount);
    setScansRemaining(newRemaining);

    // Update backend if authenticated
    if (isAuthenticated && accessToken) {
      try {
        await SubscriptionApi.incrementScanCount(accessToken);
      } catch (error) {
        console.error('Error incrementing scan count on backend:', error);
        // Revert local state on error
        setScanCount(scanCount);
        setScansRemaining(scansRemaining);
      }
    }
  };

  /**
   * Purchase subscription
   * Enhanced with better error handling
   */
  const purchaseSubscription = async (packageToPurchase) => {
    try {
      const customerInfo = await RevenueCatService.purchasePackage(packageToPurchase);
      
      // Verify purchase was successful by checking Catfish Pro entitlement
      const hasPro = customerInfo.entitlements.active[RevenueCatService.CATFISH_PRO_ENTITLEMENT] || 
                     customerInfo.entitlements.active[RevenueCatService.TEKJIN_PRO_ENTITLEMENT];
      if (!hasPro) {
        console.warn('Purchase completed but Catfish Pro entitlement not found');
      }
      
      // Refresh subscription status after purchase
      await refreshSubscriptionStatus();
      return customerInfo;
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      // Re-throw with user-friendly message if needed
      if (error.userCancelled) {
        throw { ...error, message: 'Purchase was cancelled' };
      }
      throw error;
    }
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
      setIsPro(false);
      setScanCount(0);
      setScanLimit(3);
      setScansRemaining(3);
      setIsLoading(false);
    }
  }, [isAuthenticated, accessToken]);

  const value = {
    subscriptionStatus,
    scanCount,
    scanLimit,
    scansRemaining,
    isLoading,
    isPro,
    refreshSubscriptionStatus,
    checkCanScan,
    incrementScanCount,
    purchaseSubscription,
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

