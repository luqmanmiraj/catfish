import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PurchaseScansCard from './PurchaseScansCard';
import colors from '../colors';

/**
 * Paywall screen that displays the PurchaseScansCard in a modal.
 * Reuses the same pricing card shown on the Profile screen for consistency.
 */
export default function RevenueCatPaywallScreen({ onClose, onPurchaseSuccess, onRestore, onPurchaseComplete }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 30) }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Purchase Scan Packs</Text>

          <PurchaseScansCard onUpgrade={onClose} onPurchaseComplete={onPurchaseComplete} />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background?.dark ?? '#111',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text?.white ?? '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.text?.secondary ?? '#999',
  },
});
