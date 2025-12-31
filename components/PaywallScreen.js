import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import * as RevenueCatService from '../services/revenueCatService';
import colors from '../colors';

/**
 * PaywallScreen Component
 * Displays token pack options (5, 20, 50 scans) with RevenueCat Paywall UI option
 */
export default function PaywallScreen({ onClose, onPurchaseSuccess, onRestore }) {
  const [packages, setPackages] = useState([]);
  const [packagesByType, setPackagesByType] = useState({
    pack_5: null,
    pack_20: null,
    pack_50: null,
  });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  
  // Token pack configurations
  const TOKEN_PACKS = {
    pack_15: { tokens: 15, price: 4.99, name: '15 Scans' },
    pack_50: { tokens: 50, price: 9.99, name: '50 Scans' },
    pack_100: { tokens: 100, price: 16.99, name: '100 Scans' },
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const [allPackages, byType] = await Promise.all([
        RevenueCatService.getAvailablePackages(),
        RevenueCatService.getPackagesByType(),
      ]);

      setPackages(allPackages);
      
      // Map packages to token pack types
      const tokenPackages = {
        pack_15: null,
        pack_50: null,
        pack_100: null,
      };
      
      allPackages.forEach(pkg => {
        const identifier = (pkg.identifier || pkg.storeProduct?.identifier || '').toLowerCase();
        if (identifier.includes('pack_15') || identifier.includes('15') || identifier.includes('fifteen')) {
          tokenPackages.pack_15 = pkg;
        } else if (identifier.includes('pack_50') || identifier.includes('50') || identifier.includes('fifty')) {
          tokenPackages.pack_50 = pkg;
        } else if (identifier.includes('pack_100') || identifier.includes('100') || identifier.includes('hundred')) {
          tokenPackages.pack_100 = pkg;
        }
      });
      
      setPackagesByType(tokenPackages);

      // Auto-select pack_50 if available (best value), otherwise pack_15, then pack_100
      if (tokenPackages.pack_50) {
        setSelectedPackage(tokenPackages.pack_50);
      } else if (tokenPackages.pack_15) {
        setSelectedPackage(tokenPackages.pack_15);
      } else if (tokenPackages.pack_100) {
        setSelectedPackage(tokenPackages.pack_100);
      } else if (allPackages.length > 0) {
        setSelectedPackage(allPackages[0]);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
      Alert.alert('Error', 'Failed to load subscription options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg) => {
    if (!pkg) {
      Alert.alert('Error', 'Please select a subscription plan');
      return;
    }

    try {
      setPurchasing(true);
      const customerInfo = await RevenueCatService.purchasePackage(pkg);
      
      // Check if purchase was successful
      const hasPro = customerInfo.entitlements.active[RevenueCatService.CATFISH_PRO_ENTITLEMENT] || 
                     customerInfo.entitlements.active[RevenueCatService.TEKJIN_PRO_ENTITLEMENT];
      
      // Token pack purchase completed
      Alert.alert('Purchase Complete', 'Your scan pack has been added to your account!', [
        { text: 'OK', onPress: () => {
          onPurchaseSuccess?.();
          onClose?.();
        }},
      ]);
    } catch (error) {
      console.error('Purchase error:', error);
      
      if (error.userCancelled) {
        // User cancelled, no need to show error
        return;
      }

      let errorMessage = 'Unable to complete purchase. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Purchase Failed', errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const handleUseRevenueCatPaywall = async () => {
    try {
      setPurchasing(true);
      const result = await RevenueCatService.presentPaywall();
      
      if (result) {
        // Check if purchase was successful
        const hasPro = result.entitlements.active[RevenueCatService.CATFISH_PRO_ENTITLEMENT] || 
                       result.entitlements.active[RevenueCatService.TEKJIN_PRO_ENTITLEMENT];
        
        if (hasPro) {
          Alert.alert('Success', 'Welcome to Catfish Pro!', [
            { text: 'OK', onPress: () => {
              onPurchaseSuccess?.();
              onClose?.();
            }},
          ]);
        } else {
          onPurchaseSuccess?.();
          onClose?.();
        }
      }
    } catch (error) {
      console.error('Paywall error:', error);
      if (!error.message?.includes('cancelled')) {
        Alert.alert('Error', 'Unable to show subscription options. Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setPurchasing(true);
      const customerInfo = await RevenueCatService.restorePurchases();
      
      if (customerInfo) {
        const hasPro = customerInfo.entitlements.active[RevenueCatService.CATFISH_PRO_ENTITLEMENT] || 
                        customerInfo.entitlements.active[RevenueCatService.TEKJIN_PRO_ENTITLEMENT];
        
        if (hasPro) {
          Alert.alert('Success', 'Your purchases have been restored!', [
            { text: 'OK', onPress: () => {
              onPurchaseSuccess?.();
              onClose?.();
            }},
          ]);
        } else {
          Alert.alert('No Purchases Found', 'We couldn\'t find any purchases to restore.');
        }
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert('Error', 'Unable to restore purchases. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const renderPackageIcon = (pkg, scanCount, isRecommended = false) => {
    if (!pkg) return null;

    const isSelected = selectedPackage?.identifier === pkg.identifier;
    const price = RevenueCatService.getFormattedPrice(pkg);

    // Icon sizes based on scan count
    const iconSizes = {
      5: { size: 60, circles: 3 },
      20: { size: 80, circles: 5 },
      50: { size: 100, circles: 7 },
    };

    const iconConfig = iconSizes[scanCount] || iconSizes[5];

    return (
      <TouchableOpacity
        key={pkg.identifier}
        style={[
          styles.packageIconCard,
          isSelected && styles.packageIconCardSelected,
          isRecommended && styles.packageIconCardRecommended,
        ]}
        onPress={() => setSelectedPackage(pkg)}
        disabled={purchasing}
        activeOpacity={0.8}
      >
        {isRecommended && (
          <View style={styles.recommendedBadgeIcon}>
            <Text style={styles.recommendedTextIcon}>BEST</Text>
          </View>
        )}
        <View style={styles.iconContainer}>
          <Svg width={iconConfig.size} height={iconConfig.size} viewBox="0 0 100 100">
            {/* Camera icon base */}
            <Path
              d="M20 30 L20 75 L80 75 L80 30 L65 30 L60 20 L40 20 L35 30 Z"
              fill={isSelected ? colors.primary : colors.text.secondary}
              opacity={0.3}
            />
            <Path
              d="M25 35 L25 70 L75 70 L75 35 L62 35 L57 25 L43 25 L38 35 Z"
              stroke={isSelected ? colors.primary : colors.text.secondary}
              strokeWidth="2"
              fill="none"
            />
            {/* Lens circle */}
            <Circle
              cx="50"
              cy="52"
              r="12"
              stroke={isSelected ? colors.primary : colors.text.secondary}
              strokeWidth="2"
              fill="none"
            />
            <Circle
              cx="50"
              cy="52"
              r="6"
              fill={isSelected ? colors.primary : colors.text.secondary}
              opacity={0.5}
            />
            {/* Flash icon */}
            <Path
              d="M50 25 L55 20 L52 28 L58 28 L50 35 Z"
              fill={isSelected ? colors.primary : colors.text.secondary}
              opacity={0.6}
            />
          </Svg>
          {/* Scan count badge */}
          <View style={[
            styles.scanCountBadge,
            isSelected && styles.scanCountBadgeSelected
          ]}>
            <Text style={[
              styles.scanCountText,
              isSelected && styles.scanCountTextSelected
            ]}>{scanCount}</Text>
          </View>
        </View>
        <Text style={[
          styles.packageIconTitle,
          isSelected && styles.packageIconTitleSelected
        ]}>{scanCount} Scans</Text>
        <Text style={[
          styles.packageIconPrice,
          isSelected && styles.packageIconPriceSelected
        ]}>{price}</Text>
        {isSelected && (
          <View style={styles.selectedIconIndicator}>
            <Text style={styles.selectedIconText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading subscription options...</Text>
        </View>
      </View>
    );
  }

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Purchase Scan Packs</Text>
          <Text style={styles.subtitle}>Buy scans as you need them - no recurring billing</Text>
        </View>

        <View style={styles.packagesIconContainer}>
          {renderPackageIcon(packagesByType.pack_15, 15, false)}
          {renderPackageIcon(packagesByType.pack_50, 50, true)}
          {renderPackageIcon(packagesByType.pack_100, 100, false)}
        </View>

        {packages.length === 0 && (
          <View style={styles.noPackagesContainer}>
            <Text style={styles.noPackagesText}>
              No subscription packages available. Please try again later.
            </Text>
          </View>
        )}

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>How It Works:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>1 scan = 1 token</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Tokens never expire</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>No recurring billing</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Buy more anytime</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, (!selectedPackage || purchasing) && styles.purchaseButtonDisabled]}
          onPress={() => handlePurchase(selectedPackage)}
          disabled={!selectedPackage || purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Purchase Now
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={purchasing}
        >
          <Text style={styles.restoreButtonText}>Restore Purchases</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          disabled={purchasing}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By purchasing, you agree to our Terms of Service and Privacy Policy.
          All purchases are one-time payments with no recurring billing.
        </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.text.white,
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  packagesIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  packageIconCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    minHeight: 180,
  },
  packageIconCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  packageIconCardRecommended: {
    borderColor: colors.primary,
  },
  recommendedBadgeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  recommendedTextIcon: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  scanCountBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: colors.background.dark,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.text.secondary,
  },
  scanCountBadgeSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  scanCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
  scanCountTextSelected: {
    color: '#fff',
  },
  packageIconTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginTop: 8,
    textAlign: 'center',
  },
  packageIconTitleSelected: {
    color: colors.primary,
  },
  packageIconPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  packageIconPriceSelected: {
    color: colors.primary,
  },
  selectedIconIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noPackagesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noPackagesText: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  featureBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.white,
  },
  purchaseButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    opacity: 0.5,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  revenueCatPaywallButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  revenueCatPaywallText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  restoreButtonText: {
    color: colors.primary,
    fontSize: 16,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
