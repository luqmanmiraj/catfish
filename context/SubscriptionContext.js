import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as RevenueCatService from '../services/revenueCatService';
import * as SubscriptionApi from '../services/subscriptionApi';
import * as Analytics from '../services/analyticsService';
import * as PostHogService from '../services/posthogService';

// Export TEKJIN_PRO_ENTITLEMENT for use in components
export { RevenueCatService };

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const { user, isAuthenticated, accessToken } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [scansRemaining, setScansRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Device-level scan tracking
  const [deviceFreeScansUsed, setDeviceFreeScansUsed] = useState(0);
  const [deviceFreeScansLimit, setDeviceFreeScansLimit] = useState(5);
  const [deviceLimitReached, setDeviceLimitReached] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
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
          
          console.log('📊 Setting token balance from backend response:');
          console.log('  - backendStatus.tokenBalance:', backendStatus.tokenBalance);
          console.log('  - backendStatus.scansRemaining:', backendStatus.scansRemaining);
          console.log('  - Calculated balance:', balance);
          console.log('  - User:', user?.sub || user?.email || user?.['cognito:username']);
          
          setTokenBalance(balance);
          
          // Update device-level scan tracking fields
          if (backendStatus.deviceFreeScansUsed !== undefined) {
            setDeviceFreeScansUsed(backendStatus.deviceFreeScansUsed);
          }
          if (backendStatus.deviceFreeScansLimit !== undefined) {
            setDeviceFreeScansLimit(backendStatus.deviceFreeScansLimit);
          }
          if (backendStatus.deviceLimitReached !== undefined) {
            setDeviceLimitReached(backendStatus.deviceLimitReached);
          }
          if (backendStatus.hasPurchased !== undefined) {
            setHasPurchased(backendStatus.hasPurchased);
          }
          
          // If device has exhausted free scans and user hasn't purchased,
          // show 0 scans remaining (even if token balance > 0, they can't use them)
          const deviceBlocked = backendStatus.deviceLimitReached && !backendStatus.hasPurchased;
          const effectiveScans = deviceBlocked ? 0 : balance;
          setScansRemaining(effectiveScans);
          
          console.log('📱 Device scan tracking:');
          console.log('  - deviceFreeScansUsed:', backendStatus.deviceFreeScansUsed);
          console.log('  - deviceFreeScansLimit:', backendStatus.deviceFreeScansLimit);
          console.log('  - deviceLimitReached:', backendStatus.deviceLimitReached);
          console.log('  - hasPurchased:', backendStatus.hasPurchased);
          console.log('  - deviceBlocked:', deviceBlocked);
          console.log('  - effectiveScans:', effectiveScans);
          
          // Legacy fields for backward compatibility
          setScanCount(0);
          setScanLimit(Infinity);
          setIsPro(false);
          return { scansRemaining: effectiveScans, tokenBalance: balance };
        } catch (backendError) {
          console.warn('Error fetching backend token balance:', backendError);
          // Set defaults on error
          setTokenBalance(0);
          setScansRemaining(0);
          setScanCount(0);
          setScanLimit(Infinity);
          setIsPro(false);
          return { scansRemaining: 0, tokenBalance: 0 };
        }
      } else {
        // Not authenticated, set defaults
        setTokenBalance(0);
        setScansRemaining(0);
        setScanCount(0);
        setScanLimit(Infinity);
        setIsPro(false);
        return { scansRemaining: 0, tokenBalance: 0 };
      }
    } catch (error) {
      console.error('Error refreshing token balance:', error);
      // Set defaults on error
      setTokenBalance(0);
      setScansRemaining(0);
      setScanCount(0);
      setScanLimit(Infinity);
      setIsPro(false);
      return { scansRemaining: 0, tokenBalance: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if user can perform a scan
   * Uses local scansRemaining state (fetched from /subscription/status)
   * No API call needed - eliminates 502 errors from /subscription/check endpoint
   */
  const checkCanScan = async () => {
    // Use local state - scansRemaining is already maintained from /subscription/status
    // scansRemaining is already adjusted to 0 if device limit is reached
    return {
      canScan: scansRemaining > 0,
      scansRemaining: scansRemaining,
      tokenBalance: tokenBalance,
      deviceLimitReached: deviceLimitReached,
    };
  };

  /**
   * Decrement token after successful scan
   */
  const decrementToken = async () => {
    // Update local state immediately for better UX
    const newBalance = Math.max(0, tokenBalance - 1);
    const previousBalance = tokenBalance;
    setTokenBalance(newBalance);
    setScansRemaining(newBalance);

    // Update backend if authenticated
    if (isAuthenticated && accessToken) {
      try {
        const result = await SubscriptionApi.decrementToken(accessToken);
        // Update with actual balance from backend
        const finalBalance = result.tokenBalance !== undefined ? result.tokenBalance : newBalance;
        setTokenBalance(finalBalance);
        setScansRemaining(finalBalance);
        
        // Track trial completed event if balance reached 0
        if (previousBalance > 0 && finalBalance === 0) {
          try {
            const userId = user?.sub || user?.email || user?.['cognito:username'] || null;
            await Analytics.trackTrialCompleted({
              user_id: userId,
              trial_scans_used: previousBalance,
            });
          } catch (error) {
            console.error('Error tracking trial completed event:', error);
          }
        }
      } catch (error) {
        // Handle "insufficient tokens" gracefully - this is expected business logic
        if (error.status === 400 && error.responseData?.error === 'Insufficient tokens') {
          // Update with actual balance from error response
          const finalBalance = error.responseData.tokenBalance !== undefined 
            ? error.responseData.tokenBalance 
            : newBalance;
          setTokenBalance(finalBalance);
          setScansRemaining(finalBalance);
          
          // Track trial completed event if balance reached 0
          if (previousBalance > 0 && finalBalance === 0) {
            try {
              const userId = user?.sub || user?.email || user?.['cognito:username'] || null;
              await Analytics.trackTrialCompleted({
                user_id: userId,
                trial_scans_used: previousBalance,
              });
            } catch (error) {
              console.error('Error tracking trial completed event:', error);
            }
          }
          // Log as warning instead of error since this is expected behavior
          console.warn('Cannot decrement token: insufficient tokens remaining');
        } else {
          // Log other errors normally
          console.error('Error decrementing token on backend:', error);
          // Revert local state on error
          setTokenBalance(tokenBalance);
          setScansRemaining(scansRemaining);
        }
      }
    } else {
      // Not authenticated - check if trial completed locally
      if (previousBalance > 0 && newBalance === 0) {
        try {
          await Analytics.trackTrialCompleted({
            user_id: null,
            trial_scans_used: previousBalance,
          });
        } catch (error) {
          console.error('Error tracking trial completed event:', error);
        }
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
      
      // Resolve canonical backend pack ID from package/product identifiers.
      const packageIdentifier = packageToPurchase.identifier || '';
      const productIdentifier = packageToPurchase.product?.identifier || '';
      const combinedIdentifier = `${packageIdentifier}|${productIdentifier}`.toLowerCase();
      let packId = null;
      if (combinedIdentifier.includes('pack_5') || combinedIdentifier.includes('pack5')) {
        packId = 'pack_5';
      } else if (combinedIdentifier.includes('pack_15') || combinedIdentifier.includes('pack15')) {
        packId = 'pack_15';
      } else if (combinedIdentifier.includes('pack_20') || combinedIdentifier.includes('pack20')) {
        packId = 'pack_20';
      } else if (combinedIdentifier.includes('pack_50') || combinedIdentifier.includes('pack50')) {
        packId = 'pack_50';
      } else if (combinedIdentifier.includes('pack_100') || combinedIdentifier.includes('pack100')) {
        packId = 'pack_100';
      }
      
      // Notify backend about the purchase to add tokens
      if (!isAuthenticated || !accessToken) {
        throw new Error('Purchase completed, but account is not authenticated to receive scans.');
      }
      if (!packId) {
        throw new Error(`Purchase completed, but pack mapping failed. package=${packageIdentifier}, product=${productIdentifier}`);
      }
      const transactionId = customerInfo.originalPurchaseDate || Date.now().toString();
      await SubscriptionApi.purchaseTokenPack(accessToken, packId, transactionId);
      
      // Refresh token balance after purchase
      await refreshSubscriptionStatus();
      
      // Track purchase completed event in PostHog
      try {
        PostHogService.trackPurchaseCompleted({
          pack_id: packId,
          transaction_id: customerInfo.originalPurchaseDate || Date.now().toString(),
        });
      } catch (error) {
        console.error('Error tracking purchase in PostHog:', error);
      }
      
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
      setDeviceFreeScansUsed(0);
      setDeviceFreeScansLimit(5);
      setDeviceLimitReached(false);
      setHasPurchased(false);
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
    // Device-level scan tracking
    deviceFreeScansUsed,
    deviceFreeScansLimit,
    deviceLimitReached,
    hasPurchased,
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

