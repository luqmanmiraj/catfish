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
import * as RevenueCatService from '../services/revenueCatService';
import colors from '../colors';

/**
 * PaywallScreen Component
 * Displays subscription options (Monthly, Yearly, Lifetime) with RevenueCat Paywall UI option
 */
export default function PaywallScreen({ onClose, onPurchaseSuccess, onRestore }) {
  const [packages, setPackages] = useState([]);
  const [packagesByType, setPackagesByType] = useState({
    basic: null,
    premium_monthly: null,
    lifetime: null,
  });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
      setPackagesByType(byType);

      // Auto-select premium_monthly if available, otherwise basic, then lifetime
      if (byType.premium_monthly) {
        setSelectedPackage(byType.premium_monthly);
      } else if (byType.basic) {
        setSelectedPackage(byType.basic);
      } else if (byType.lifetime) {
        setSelectedPackage(byType.lifetime);
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
      
      if (hasPro) {
        Alert.alert('Success', 'Welcome to Catfish Pro! You now have unlimited access.', [
          { text: 'OK', onPress: () => {
            onPurchaseSuccess?.();
            onClose?.();
          }},
        ]);
      } else {
        Alert.alert('Purchase Complete', 'Your subscription is being processed.');
        onPurchaseSuccess?.();
        onClose?.();
      }
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

  const renderPackage = (pkg, title, description, isRecommended = false) => {
    if (!pkg) return null;

    const isSelected = selectedPackage?.identifier === pkg.identifier;
    const price = RevenueCatService.getFormattedPrice(pkg);

    return (
      <TouchableOpacity
        key={pkg.identifier}
        style={[
          styles.packageCard,
          isSelected && styles.packageCardSelected,
          isRecommended && styles.packageCardRecommended,
        ]}
        onPress={() => setSelectedPackage(pkg)}
        disabled={purchasing}
      >
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}
        <View style={styles.packageHeader}>
          <Text style={styles.packageTitle}>{title}</Text>
          <Text style={styles.packagePrice}>{price}</Text>
        </View>
        {description && (
          <Text style={styles.packageDescription}>{description}</Text>
        )}
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>✓ Selected</Text>
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
          <Text style={styles.title}>Upgrade to Catfish Pro</Text>
          <Text style={styles.subtitle}>Unlock unlimited scans and premium features</Text>
        </View>

        <View style={styles.packagesContainer}>
          {renderPackage(
            packagesByType.basic,
            'Basic',
            '$4.99 one-time payment',
            false
          )}
          {renderPackage(
            packagesByType.premium_monthly,
            'Premium Monthly',
            '$9.99/month - Best value',
            true
          )}
          {renderPackage(
            packagesByType.lifetime,
            'Lifetime Access',
            '$24.99 - Limited early access',
            false
          )}
        </View>

        {packages.length === 0 && (
          <View style={styles.noPackagesContainer}>
            <Text style={styles.noPackagesText}>
              No subscription packages available. Please try again later.
            </Text>
          </View>
        )}

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Catfish Pro Features:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Unlimited AI image scans</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Advanced analysis features</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Priority support</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Ad-free experience</Text>
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
              {selectedPackage?.identifier?.includes('lifetime') || selectedPackage?.identifier?.includes('basic') 
                ? 'Purchase Now' 
                : 'Subscribe Now'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.revenueCatPaywallButton}
          onPress={handleUseRevenueCatPaywall}
          disabled={purchasing}
        >
          <Text style={styles.revenueCatPaywallText}>
            Use RevenueCat Paywall UI
          </Text>
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
          By subscribing, you agree to our Terms of Service and Privacy Policy.
          Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period.
        </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
    fontSize: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  packagesContainer: {
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packageCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.cardBackground,
  },
  packageCardRecommended: {
    borderColor: colors.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  packageDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  selectedIndicator: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  noPackagesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noPackagesText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    color: colors.text,
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
    backgroundColor: colors.cardBackground,
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
    color: colors.textSecondary,
    fontSize: 16,
  },
  termsText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
