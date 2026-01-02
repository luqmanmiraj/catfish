import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../colors';

const DisclaimerModal = ({ visible, onAccept, onClose }) => {
  const insets = useSafeAreaInsets();

  console.log('DisclaimerModal render - visible:', visible);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Important Disclaimer</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.paragraph}>
              Catfish Crasher uses advanced AI technology to analyze images for potential manipulation, deepfakes, or AI-generated content. However, please understand the following:
            </Text>

            <Text style={styles.sectionTitle}>Accuracy Limitations</Text>
            <Text style={styles.paragraph}>
              • Results are not 100% accurate and should be used as a tool for awareness, not definitive proof
            </Text>
            <Text style={styles.paragraph}>
              • Technology continues to evolve, and new manipulation techniques may not be detected
            </Text>
            <Text style={styles.paragraph}>
              • False positives and false negatives are possible
            </Text>

            <Text style={styles.sectionTitle}>Use at Your Own Risk</Text>
            <Text style={styles.paragraph}>
              • Do not make important decisions based solely on scan results
            </Text>
            <Text style={styles.paragraph}>
              • Always verify information through multiple sources
            </Text>
            <Text style={styles.paragraph}>
              • Results should be considered as one factor in your decision-making process
            </Text>

            <Text style={styles.sectionTitle}>Privacy and Data</Text>
            <Text style={styles.paragraph}>
              • Images are processed securely, but we cannot guarantee absolute security
            </Text>
            <Text style={styles.paragraph}>
              • By using this service, you acknowledge and accept these limitations
            </Text>

            <Text style={styles.warningText}>
              ⚠️ This tool is for informational purposes only and should not be the sole basis for any decisions.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
          >
            <Text style={styles.acceptButtonText}>I Understand</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
    marginTop: 20,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(10, 180, 224, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  acceptButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DisclaimerModal;

