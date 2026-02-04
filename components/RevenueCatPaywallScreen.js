import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Constants from 'expo-constants';
import * as RevenueCatService from '../services/revenueCatService';
import * as SubscriptionApi from '../services/subscriptionApi';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';
import colors from '../colors';

// Conditionally load RevenueCat UI - only in dev/production builds, not Expo Go
let RevenueCatUI = null;
try {
  if (Constants.appOwnership !== 'expo') {
    RevenueCatUI = require('react-native-purchases-ui').default;
  }
} catch (e) {
  console.log('RevenueCat UI not available:', e?.message);
}

/**
 * Paywall screen that uses RevenueCat's declarative Paywall component.
 * Shows current offering from the dashboard; falls back to a message in Expo Go.
 */
export default function RevenueCatPaywallScreen({ onClose, onPurchaseSuccess, onRestore }) {
  const { refreshSubscriptionStatus, restorePurchases } = useSubscription();
  const { accessToken, isAuthenticated } = useAuth();
  const [offering, setOffering] = useState(null);

  const handlePurchaseCompleted = async ({ customerInfo, storeTransaction }) => {
    try {
      const packId = storeTransaction?.productIdentifier ?? storeTransaction?.productId;
      const transactionId = storeTransaction?.transactionIdentifier ?? storeTransaction?.transactionId ?? storeTransaction?.originalTransactionIdentifier ?? String(Date.now());
      if (isAuthenticated && accessToken && packId) {
        await SubscriptionApi.purchaseTokenPack(accessToken, packId, transactionId);
      }
      await refreshSubscriptionStatus();
      onPurchaseSuccess?.();
    } catch (e) {
      console.warn('Error notifying backend after purchase:', e?.message);
      await refreshSubscriptionStatus();
      onPurchaseSuccess?.();
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const offerings = await RevenueCatService.getOfferings();
        if (!cancelled && offerings?.current) {
          setOffering(offerings.current);
        }
      } catch (e) {
        console.warn('Could not load offerings:', e?.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDismiss = async () => {
    try {
      await refreshSubscriptionStatus();
    } catch (e) {
      console.warn('Refresh after paywall dismiss:', e?.message);
    }
    onPurchaseSuccess?.();
    onClose?.();
  };

  const handleRestoreCompleted = async ({ customerInfo }) => {
    try {
      await refreshSubscriptionStatus();
    } catch (e) {
      console.warn('Refresh after restore:', e?.message);
    }
    onPurchaseSuccess?.();
    onClose?.();
  };

  // Expo Go or module not available: show fallback
  if (!RevenueCatUI?.Paywall) {
    return (
      <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Purchase Scan Packs</Text>
          <Text style={styles.fallbackMessage}>
            Open this app in a development build to purchase. RevenueCat paywall is not available in Expo Go.
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <RevenueCatUI.Paywall
          options={offering ? { offering } : undefined}
          onPurchaseCompleted={handlePurchaseCompleted}
          onRestoreCompleted={handleRestoreCompleted}
          onDismiss={handleDismiss}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background?.dark ?? '#111',
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: colors.background?.dark ?? '#111',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text?.primary ?? '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  fallbackMessage: {
    fontSize: 16,
    color: colors.text?.secondary ?? '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primary ?? '#007AFF',
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
