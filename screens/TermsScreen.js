import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../colors';

const TermsScreen = ({ onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[termsStyles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar style="light" />
      
      {/* Header with Close Button */}
      <View style={termsStyles.header}>
        <Text style={termsStyles.title}>Terms and Conditions</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={termsStyles.closeButton}>
            <Text style={termsStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={termsStyles.scrollView}
        contentContainerStyle={termsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={termsStyles.content}>
          <Text style={termsStyles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={termsStyles.paragraph}>
            By accessing and using the Catfish application, you accept and agree to be bound by the terms and provision of this agreement.
          </Text>

          <Text style={termsStyles.sectionTitle}>2. Use License</Text>
          <Text style={termsStyles.paragraph}>
            Permission is granted to temporarily use the Catfish application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </Text>
          <Text style={termsStyles.bulletPoint}>• Modify or copy the materials</Text>
          <Text style={termsStyles.bulletPoint}>• Use the materials for any commercial purpose</Text>
          <Text style={termsStyles.bulletPoint}>• Attempt to reverse engineer any software contained in the application</Text>
          <Text style={termsStyles.bulletPoint}>• Remove any copyright or other proprietary notations from the materials</Text>

          <Text style={termsStyles.sectionTitle}>3. Age Requirement</Text>
          <Text style={termsStyles.paragraph}>
            You must be at least 18 years old to use this application. By using Catfish, you represent and warrant that you are at least 18 years of age.
          </Text>

          <Text style={termsStyles.sectionTitle}>4. User Account</Text>
          <Text style={termsStyles.paragraph}>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </Text>

          <Text style={termsStyles.sectionTitle}>5. Privacy Policy</Text>
          <Text style={termsStyles.paragraph}>
            Your use of the application is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
          </Text>

          <Text style={termsStyles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={termsStyles.paragraph}>
            In no event shall Catfish or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the application.
          </Text>

          <Text style={termsStyles.sectionTitle}>7. Accuracy of Materials</Text>
          <Text style={termsStyles.paragraph}>
            The materials appearing in the Catfish application could include technical, typographical, or photographic errors. Catfish does not warrant that any of the materials on its application are accurate, complete, or current.
          </Text>

          <Text style={termsStyles.sectionTitle}>8. Modifications</Text>
          <Text style={termsStyles.paragraph}>
            Catfish may revise these terms of service for its application at any time without notice. By using this application you are agreeing to be bound by the then current version of these terms of service.
          </Text>

          <Text style={termsStyles.sectionTitle}>9. Governing Law</Text>
          <Text style={termsStyles.paragraph}>
            These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts.
          </Text>

          <Text style={termsStyles.sectionTitle}>10. DISCLAIMER</Text>
          <Text style={termsStyles.paragraph}>
            This application is a verification and risk-reduction tool only. It does not guarantee the identity, intent, or behavior of any person.
          </Text>
          <Text style={termsStyles.paragraph}>
            The application does not perform background checks, criminal history checks, or access law-enforcement or government databases.
          </Text>
          <Text style={termsStyles.paragraph}>
            Users are solely responsible for their own decisions and interactions. The application and its operators are not responsible for any outcomes resulting from use of the service.
          </Text>
          <Text style={termsStyles.paragraph}>
            By using the application, you confirm that you have the right and consent to submit any images, videos, or information provided.
          </Text>
          <Text style={termsStyles.paragraph}>
            Submitted data is used solely for verification purposes and is handled in accordance with the application's privacy practices.
          </Text>

          <Text style={termsStyles.sectionTitle}>11. Contact Information</Text>
          <Text style={termsStyles.paragraph}>
            If you have any questions about these Terms and Conditions, please contact us through the application support channels.
          </Text>

          <View style={termsStyles.footer}>
            <Text style={termsStyles.footerText}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const termsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.text.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.white,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
    marginLeft: 16,
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 14,
    color: colors.accent.lightGreyBlue,
    textAlign: 'center',
  },
});

export default TermsScreen;


