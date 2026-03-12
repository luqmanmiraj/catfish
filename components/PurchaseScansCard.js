import React, { useMemo, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { profileStyles } from '../styles';
import colors from '../colors';
import * as RevenueCatService from '../services/revenueCatService';
import * as SubscriptionApi from '../services/subscriptionApi';
import * as PurchaseAnalytics from '../services/purchaseAnalytics';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { getFriendlyErrorMessage, isUserCancelledError } from '../utils/errorMessages';

// Fallback prices when RevenueCat packages aren't loaded
const FALLBACK_PACKS = [
  { key: 'pack_15', scans: 15, price: '$4.99' },
  { key: 'pack_50', scans: 50, price: '$9.99' },
  { key: 'pack_100', scans: 100, price: '$16.99' },
];

const PurchaseScansCard = ({ onUpgrade, onPurchaseComplete }) => {
  const insets = useSafeAreaInsets();
  const { refreshSubscriptionStatus, scansRemaining } = useSubscription();
  const { accessToken, isAuthenticated, user } = useAuth();
  const { showAlert } = useAlert();

  const [packagesByType, setPackagesByType] = useState({
    pack_15: null,
    pack_50: null,
    pack_100: null,
  });
  const [packagesLoaded, setPackagesLoaded] = useState(false);
  const [purchasingPack, setPurchasingPack] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedPackScans, setPurchasedPackScans] = useState(0);

  const packMetadataByKey = useMemo(() => {
    return FALLBACK_PACKS.reduce((acc, pack) => {
      acc[pack.key] = pack;
      return acc;
    }, {});
  }, []);

  // Load RevenueCat packages on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const allPackages = await RevenueCatService.getAvailablePackages();
        if (cancelled) return;

        const tokenPackages = { pack_15: null, pack_50: null, pack_100: null };

        allPackages.forEach(pkg => {
          const identifier = (pkg.identifier || pkg.product?.identifier || '').toLowerCase();
          if (identifier.includes('pack_15') || identifier.includes('15') || identifier.includes('fifteen')) {
            tokenPackages.pack_15 = pkg;
          } else if (identifier.includes('pack_50') || identifier.includes('50') || identifier.includes('fifty')) {
            tokenPackages.pack_50 = pkg;
          } else if (identifier.includes('pack_100') || identifier.includes('100') || identifier.includes('hundred')) {
            tokenPackages.pack_100 = pkg;
          }
        });

        setPackagesByType(tokenPackages);
        setPackagesLoaded(true);
      } catch (e) {
        console.warn('PurchaseScansCard: could not load packages:', e?.message);
        setPackagesLoaded(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleGetIt = async (packKey) => {
    const pkg = packagesByType[packKey];
    if (!pkg) {
      onUpgrade?.();
      return;
    }

    try {
      setPurchasingPack(packKey);

      // Purchases must be tied to an authenticated app user so backend can credit scans.
      if (!isAuthenticated || !accessToken) {
        showAlert({
          title: 'Sign In Required',
          message: 'Please sign in before purchasing scan packs so your scans can be added to your account.',
        });
        return;
      }

      // 1. Trigger the native purchase sheet via RevenueCat
      const customerInfo = await RevenueCatService.purchasePackage(pkg);

      // 2. Notify backend about the purchase
      // Use canonical backend pack IDs to avoid RC identifier format drift.
      const packId = packKey;
      const transactionId = customerInfo.originalPurchaseDate || Date.now().toString();

      console.log('💳 PurchaseScansCard purchase sync:', {
        packKey,
        packId,
        packageIdentifier: pkg.identifier || null,
        productIdentifier: pkg.product?.identifier || null,
        transactionId,
      });

      let purchaseSyncResult;
      try {
        purchaseSyncResult = await SubscriptionApi.purchaseTokenPack(accessToken, packId, transactionId);
      } catch (backendError) {
        // Do not silently succeed for consumables if backend sync fails.
        console.error('❌ Backend token credit failed after RevenueCat purchase:', backendError);
        showAlert({
          title: 'Sync Failed',
          message: 'Purchase completed, but scans were not added yet. Please contact support with your receipt.',
        });
        return;
      }

      // 3. Refresh token balance
      const refreshed = await refreshSubscriptionStatus();
      const refreshedBalance = refreshed?.tokenBalance ?? 0;
      const previousBalance = scansRemaining ?? 0;
      const expectedIncrease = FALLBACK_PACKS.find((p) => p.key === packKey)?.scans || 0;

      console.log('✅ PurchaseScansCard post-refresh balance check:', {
        previousBalance,
        refreshedBalance,
        expectedIncrease,
        purchaseSyncResult,
      });

      // Guard against false-positive success when backend did not actually credit balance.
      if (expectedIncrease > 0 && refreshedBalance < previousBalance + expectedIncrease) {
        showAlert({
          title: 'Sync Pending',
          message: 'Purchase succeeded, but your new scans are not reflected yet. Please pull to refresh or contact support if it persists.',
        });
        return;
      }

      // 4. Track conversion only after the full purchase+credit success checkpoint.
      try {
        const userId = user?.sub || user?.email || user?.['cognito:username'] || null;
        const productId = pkg.identifier || pkg.product?.identifier || packId;
        const price = pkg.product?.price ?? 0;
        const currency = pkg.product?.currencyCode || 'USD';

        await PurchaseAnalytics.trackPurchaseSuccess({
          userId,
          productId,
          packId,
          price,
          currency,
          transactionId,
        });
      } catch (trackingError) {
        console.error('Error tracking purchase analytics:', trackingError);
      }

      // 4. Show success modal
      const pack = FALLBACK_PACKS.find(p => p.key === packKey);
      setPurchasedPackScans(pack ? pack.scans : 0);
      setShowSuccessModal(true);
    } catch (error) {
      if (isUserCancelledError(error) || error?.userCancelled) return;

      console.error('Purchase error:', error);
      const friendlyMessage = getFriendlyErrorMessage(error, 'purchase');
      if (friendlyMessage) {
        showAlert({ title: 'Purchase Failed', message: friendlyMessage });
      }
    } finally {
      setPurchasingPack(null);
    }
  };

  const handleStartScanning = () => {
    setShowSuccessModal(false);
    onPurchaseComplete?.();
  };

  const isPurchasing = purchasingPack !== null;

  const packageRows = useMemo(() => {
    const dynamicRows = Object.entries(packagesByType)
      .filter(([, pkg]) => !!pkg)
      .map(([key, pkg]) => {
        const fallback = packMetadataByKey[key] || null;
        const scans = fallback?.scans || 0;
        const numericPrice = typeof pkg?.product?.price === 'number' ? pkg.product.price : null;
        const valueScore = numericPrice && numericPrice > 0 ? scans / numericPrice : null;

        return {
          key,
          scans,
          pkg,
          displayPrice: RevenueCatService.getFormattedPrice(pkg),
          fallbackPrice: fallback?.price || 'N/A',
          numericPrice,
          valueScore,
        };
      });

    // If RevenueCat packages aren't available yet, keep fallback rows visible.
    if (dynamicRows.length === 0) {
      return FALLBACK_PACKS.map((pack) => ({
        key: pack.key,
        scans: pack.scans,
        pkg: null,
        displayPrice: pack.price,
        fallbackPrice: pack.price,
        numericPrice: null,
        valueScore: null,
      }));
    }

    return dynamicRows;
  }, [packagesByType, packMetadataByKey]);

  const bestValueKey = useMemo(() => {
    const rankable = packageRows.filter((row) => typeof row.valueScore === 'number' && Number.isFinite(row.valueScore));
    if (rankable.length === 0) return null;

    const best = rankable.reduce((currentBest, row) => {
      if (!currentBest) return row;
      if (row.valueScore > currentBest.valueScore) return row;
      if (row.valueScore < currentBest.valueScore) return currentBest;
      // Tie-breaker: prefer higher scans, then lower absolute price.
      if (row.scans > currentBest.scans) return row;
      if (row.scans < currentBest.scans) return currentBest;
      if ((row.numericPrice ?? Infinity) < (currentBest.numericPrice ?? Infinity)) return row;
      return currentBest;
    }, null);

    return best?.key || null;
  }, [packageRows]);

  const getDisplayPrice = (packKey) => {
    const pkg = packagesByType[packKey];
    if (pkg) {
      return RevenueCatService.getFormattedPrice(pkg);
    }
    const fallback = FALLBACK_PACKS.find(p => p.key === packKey);
    return fallback ? fallback.price : 'N/A';
  };

  return (
    <>
      <View style={profileStyles.upgradeCard}>
        <View style={profileStyles.pricingInfo}>
          <Text style={profileStyles.pricingTitle}>Get 5 free scans on signup</Text>
          <View style={profileStyles.pricingPackagesList}>
            {packageRows.map((row, index) => {
              const isBestValue = row.key === bestValueKey;
              const rowPrice = row.pkg ? getDisplayPrice(row.key) : row.displayPrice;

              return (
                <View
                  key={row.key}
                  style={[
                    profileStyles.pricingPackageRow,
                    index < packageRows.length - 1 && profileStyles.pricingPackageRowDivider,
                    isBestValue && profileStyles.pricingPackageRowBestValue,
                  ]}
                >
                  <View style={profileStyles.pricingPackageInfo}>
                    <View style={profileStyles.pricingPackageTitleRow}>
                      <Text style={profileStyles.packageScans}>{row.scans} scans</Text>
                      {isBestValue ? (
                        <View style={profileStyles.bestValueBadge}>
                          <Text style={profileStyles.bestValueBadgeText}>Best Value</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={profileStyles.packagePrice}>{rowPrice}</Text>
                  </View>

                  {packagesLoaded && row.pkg ? (
                    <TouchableOpacity
                      style={[
                        profileStyles.packageGetButton,
                        profileStyles.packageGetButtonRow,
                        isPurchasing && profileStyles.packageGetButtonDisabled,
                      ]}
                      onPress={() => handleGetIt(row.key)}
                      disabled={isPurchasing}
                      activeOpacity={0.7}
                    >
                      {purchasingPack === row.key ? (
                        <ActivityIndicator size="small" color={colors.text.black} />
                      ) : (
                        <Text style={profileStyles.packageGetButtonText}>Get it</Text>
                      )}
                    </TouchableOpacity>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>
        <Text style={profileStyles.upgradeTerms}>
          One-time purchase • No recurring billing
        </Text>
      </View>

      {/* Purchase Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleStartScanning}
      >
        <View style={successStyles.overlay}>
          <View style={successStyles.card}>
            <View style={successStyles.checkmarkContainer}>
              <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <Path
                  d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM25 42.5L12.5 30L16.025 26.475L25 35.45L43.975 16.475L47.5 20L25 42.5Z"
                  fill={colors.primary}
                />
              </Svg>
            </View>

            <Text style={successStyles.title}>You're All Set!</Text>

            <Text style={successStyles.packText}>
              You purchased {purchasedPackScans} Scans Pack
            </Text>

            <Text style={successStyles.balanceText}>
              You now have {scansRemaining} scans
            </Text>

            <TouchableOpacity
              style={successStyles.button}
              onPress={handleStartScanning}
              activeOpacity={0.8}
            >
              <Text style={successStyles.buttonText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const successStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: colors.background.dark,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  packText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PurchaseScansCard;
