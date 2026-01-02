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

const PrivacyScreen = ({ onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[privacyStyles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar style="light" />
      
      {/* Header with Close Button */}
      <View style={privacyStyles.header}>
        <Text style={privacyStyles.title}>Privacy Policy</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={privacyStyles.closeButton}>
            <Text style={privacyStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={privacyStyles.scrollView}
        contentContainerStyle={privacyStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={privacyStyles.content}>
          <Text style={privacyStyles.sectionTitle}>1. Information We Collect</Text>
          <Text style={privacyStyles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={privacyStyles.bulletPoint}>• Account information (email, name)</Text>
          <Text style={privacyStyles.bulletPoint}>• Images and videos you submit for analysis</Text>
          <Text style={privacyStyles.bulletPoint}>• Usage data and analytics</Text>
          <Text style={privacyStyles.bulletPoint}>• Device information and identifiers</Text>

          <Text style={privacyStyles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={privacyStyles.paragraph}>
            We use the information we collect to:
          </Text>
          <Text style={privacyStyles.bulletPoint}>• Provide, maintain, and improve our services</Text>
          <Text style={privacyStyles.bulletPoint}>• Process and analyze images you submit</Text>
          <Text style={privacyStyles.bulletPoint}>• Send you technical notices and support messages</Text>
          <Text style={privacyStyles.bulletPoint}>• Respond to your comments and questions</Text>

          <Text style={privacyStyles.sectionTitle}>3. Data Storage and Security</Text>
          <Text style={privacyStyles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </Text>
          <Text style={privacyStyles.paragraph}>
            Your images are stored securely and are used solely for verification purposes. We retain your data only as long as necessary to provide our services.
          </Text>

          <Text style={privacyStyles.sectionTitle}>4. Data Sharing</Text>
          <Text style={privacyStyles.paragraph}>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </Text>
          <Text style={privacyStyles.bulletPoint}>• With your explicit consent</Text>
          <Text style={privacyStyles.bulletPoint}>• To comply with legal obligations</Text>
          <Text style={privacyStyles.bulletPoint}>• To protect our rights and safety</Text>
          <Text style={privacyStyles.bulletPoint}>• With service providers who assist in our operations</Text>

          <Text style={privacyStyles.sectionTitle}>5. Your Rights</Text>
          <Text style={privacyStyles.paragraph}>
            You have the right to:
          </Text>
          <Text style={privacyStyles.bulletPoint}>• Access your personal information</Text>
          <Text style={privacyStyles.bulletPoint}>• Request correction of inaccurate data</Text>
          <Text style={privacyStyles.bulletPoint}>• Request deletion of your data</Text>
          <Text style={privacyStyles.bulletPoint}>• Object to processing of your data</Text>
          <Text style={privacyStyles.bulletPoint}>• Request data portability</Text>

          <Text style={privacyStyles.sectionTitle}>6. Cookies and Tracking</Text>
          <Text style={privacyStyles.paragraph}>
            We may use cookies and similar tracking technologies to track activity on our application and hold certain information. You can instruct your device to refuse all cookies or to indicate when a cookie is being sent.
          </Text>

          <Text style={privacyStyles.sectionTitle}>7. Third-Party Services</Text>
          <Text style={privacyStyles.paragraph}>
            Our application may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.
          </Text>

          <Text style={privacyStyles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={privacyStyles.paragraph}>
            Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </Text>

          <Text style={privacyStyles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={privacyStyles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </Text>

          <Text style={privacyStyles.sectionTitle}>10. Contact Us</Text>
          <Text style={privacyStyles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us through the application support channels.
          </Text>

          <View style={privacyStyles.footer}>
            <Text style={privacyStyles.footerText}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const privacyStyles = StyleSheet.create({
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

export default PrivacyScreen;

