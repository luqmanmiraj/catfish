import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import CatfishLogo from '../components/CatfishLogo';
import { aboutStyles } from '../styles';
import colors from '../colors';

const AboutScreen = ({ onScanClick, onHistoryClick, onProfileClick }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={aboutStyles.container}>
      <ScrollView style={aboutStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={aboutStyles.header}>
          <Text style={aboutStyles.title}>About & Education</Text>
        </View>

        {/* Logo and Branding */}
        <View style={aboutStyles.logoSection}>
          <View style={aboutStyles.logoContainer}>
            <CatfishLogo />
          </View>
          <Text style={aboutStyles.brandName}>CATFISH CRASHER</Text>
          <Text style={aboutStyles.tagline}>AI Detection Technology</Text>
        </View>

        {/* Our Mission */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Our Mission</Text>
          <Text style={aboutStyles.cardBody}>
            Catfish Crasher helps you identify AI-generated images and protect yourself from online deception. With advanced detection algorithms, we analyze images for telltale signs of synthetic content. Our technology examines patterns, artifacts, and metadata to provide you with confidence scores and detailed explanations about each image you scan.
          </Text>
        </View>

        {/* What is Catfishing? */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>What is Catfishing?</Text>
          <Text style={aboutStyles.cardBody}>
            Catfishing is when someone creates a fake online identity to deceive others, often using stolen or AI-generated photos. This deception can lead to emotional manipulation, financial scams, or identity theft. With the rise of AI image generation, it's easier than ever for bad actors to create convincing fake profiles. Catfish Crasher gives you the tools to verify authenticity and stay safe.
          </Text>
        </View>

        {/* Safety Tips */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Safety Tips</Text>
          
          <View style={aboutStyles.tipItem}>
            <View style={aboutStyles.tipIconContainer}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  fill={colors.primary}
                />
                <Path
                  d="M2 17L12 22L22 17"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M2 12L12 17L22 12"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={aboutStyles.tipContent}>
              <Text style={aboutStyles.tipTitle}>Stay Protected</Text>
              <Text style={aboutStyles.tipText}>
                Always verify profiles before sharing personal information online.
              </Text>
            </View>
          </View>

          <View style={aboutStyles.tipItem}>
            <View style={aboutStyles.tipIconContainer}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="3" fill={colors.primary} />
                <Path
                  d="M12 1V3M12 21V23M1 12H3M21 12H23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={aboutStyles.tipContent}>
              <Text style={aboutStyles.tipTitle}>Watch for Red Flags</Text>
              <Text style={aboutStyles.tipText}>
                Be cautious of profiles with limited photos or inconsistent details.
              </Text>
            </View>
          </View>

          <View style={aboutStyles.tipItem}>
            <View style={aboutStyles.tipIconContainer}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M2 17L12 22L22 17"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M2 12L12 17L22 12"
                  stroke={colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx="12" cy="12" r="1" fill={colors.primary} />
              </Svg>
            </View>
            <View style={aboutStyles.tipContent}>
              <Text style={aboutStyles.tipTitle}>Trust Your Instincts</Text>
              <Text style={aboutStyles.tipText}>
                If something feels off, take a step back and investigate further.
              </Text>
            </View>
          </View>
        </View>

        {/* Learn More */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Learn More</Text>
          
          <TouchableOpacity style={aboutStyles.linkItem}>
            <Text style={aboutStyles.linkText}>FBI Internet Crime Report</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 2H14V10M14 2L2 14"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={aboutStyles.linkItem}>
            <Text style={aboutStyles.linkText}>Online Safety Resources</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 2H14V10M14 2L2 14"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          <TouchableOpacity style={aboutStyles.linkItem}>
            <Text style={aboutStyles.linkText}>How AI Detection Works</Text>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 2H14V10M14 2L2 14"
                stroke={colors.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Disclaimer</Text>
          <Text style={aboutStyles.cardBody}>
            This application is a verification and risk-reduction tool only. It does not guarantee the identity, intent, or behavior of any person.
          </Text>
          <Text style={aboutStyles.cardBody}>
            The application does not perform background checks, criminal history checks, or access law-enforcement or government databases.
          </Text>
          <Text style={aboutStyles.cardBody}>
            Users are solely responsible for their own decisions and interactions. The application and its operators are not responsible for any outcomes resulting from use of the service.
          </Text>
          <Text style={aboutStyles.cardBody}>
            By using the application, you confirm that you have the right and consent to submit any images, videos, or information provided.
          </Text>
          <Text style={aboutStyles.cardBody}>
            Submitted data is used solely for verification purposes and is handled in accordance with the application's privacy practices.
          </Text>
        </View>

        {/* Support */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Need help?</Text>
          <Text style={aboutStyles.cardBody}>
            Please contact us at support@catfishcrasher.com.
          </Text>
          <Text style={aboutStyles.cardBody}>
            We typically respond within 24 hours.
          </Text>
        </View>

        {/* Refund Policy */}
        <View style={aboutStyles.card}>
          <Text style={aboutStyles.cardTitle}>Refund Policy</Text>
          <Text style={aboutStyles.cardBody}>
            If you believe there was an issue with your purchase, please contact us at support@catfishcrasher.com.
          </Text>
          <Text style={aboutStyles.cardBody}>
            Refunds are reviewed on a case-by-case basis, typically for unused or minimally used scans. Purchases made through the Apple App Store are subject to Apple's refund policies.
          </Text>
          <Text style={aboutStyles.cardBody}>
            Refund requests may be submitted directly through Apple or reviewed by our team where applicable.
          </Text>
          <Text style={aboutStyles.cardBody}>
            We reserve the right to deny refund requests in cases of excessive or completed usage.
          </Text>
        </View>

        {/* Footer */}
        <View style={aboutStyles.footer}>
          <Text style={aboutStyles.footerText}>Version 1.0.0</Text>
          <Text style={aboutStyles.footerText}>© 2025 Catfish Crasher. All rights reserved.</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[aboutStyles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={aboutStyles.navItem} onPress={onScanClick}>
          <Svg width="24" height="24" viewBox="0 0 21 16" fill="none">
            <Path
              d="M16.4771 6.3667C16.1893 6.3667 15.9458 6.26709 15.7466 6.06787C15.5474 5.86312 15.4478 5.61963 15.4478 5.3374C15.4478 5.04964 15.5474 4.80615 15.7466 4.60693C15.9458 4.40771 16.1893 4.30811 16.4771 4.30811C16.7593 4.30811 17 4.40771 17.1992 4.60693C17.404 4.80615 17.5063 5.04964 17.5063 5.3374C17.5063 5.61963 17.404 5.86312 17.1992 6.06787C17 6.26709 16.7593 6.3667 16.4771 6.3667ZM2.60645 15.8296C1.73763 15.8296 1.08464 15.6138 0.647461 15.1821C0.21582 14.756 0 14.1141 0 13.2563V4.56543C0 3.71322 0.21582 3.07406 0.647461 2.64795C1.08464 2.21631 1.73763 2.00049 2.60645 2.00049H4.92236C5.24886 2.00049 5.48958 1.96175 5.64453 1.88428C5.79948 1.80127 5.96826 1.65739 6.15088 1.45264L6.81494 0.705566C7.02523 0.478678 7.25212 0.304362 7.49561 0.182617C7.74463 0.0608724 8.08219 0 8.5083 0H11.8203C12.2464 0 12.584 0.0608724 12.833 0.182617C13.082 0.304362 13.3089 0.478678 13.5137 0.705566L14.1777 1.45264C14.305 1.59098 14.4185 1.70166 14.5181 1.78467C14.6232 1.86214 14.7422 1.91748 14.875 1.95068C15.0078 1.98389 15.1849 2.00049 15.4062 2.00049H17.7803C18.6436 2.00049 19.2938 2.21631 19.731 2.64795C20.1681 3.07406 20.3867 3.71322 20.3867 4.56543V13.2563C20.3867 14.1141 20.1681 14.756 19.731 15.1821C19.2938 15.6138 18.6436 15.8296 17.7803 15.8296H2.60645ZM2.62305 14.4932H17.7554C18.1649 14.4932 18.4831 14.3853 18.71 14.1694C18.9368 13.9481 19.0503 13.6216 19.0503 13.1899V4.64014C19.0503 4.2085 18.9368 3.88477 18.71 3.66895C18.4831 3.44759 18.1649 3.33691 17.7554 3.33691H15.0742C14.6979 3.33691 14.3936 3.29541 14.1611 3.2124C13.9342 3.12386 13.7157 2.96338 13.5054 2.73096L12.8579 2.00049C12.62 1.73486 12.4097 1.55778 12.2271 1.46924C12.0444 1.3807 11.7705 1.33643 11.4053 1.33643H8.92334C8.55811 1.33643 8.28418 1.3807 8.10156 1.46924C7.91895 1.55778 7.70866 1.73486 7.4707 2.00049L6.82324 2.73096C6.61296 2.96338 6.3916 3.12386 6.15918 3.2124C5.93229 3.29541 5.6307 3.33691 5.25439 3.33691H2.62305C2.21354 3.33691 1.89535 3.44759 1.66846 3.66895C1.4471 3.88477 1.33643 4.2085 1.33643 4.64014V13.1899C1.33643 13.6216 1.4471 13.9481 1.66846 14.1694C1.89535 14.3853 2.21354 14.4932 2.62305 14.4932ZM10.1934 13.2979C9.5625 13.2979 8.97314 13.1816 8.42529 12.9492C7.87744 12.7168 7.396 12.3931 6.98096 11.978C6.57145 11.563 6.24772 11.0815 6.00977 10.5337C5.77734 9.98584 5.66113 9.39372 5.66113 8.75732C5.66113 8.12646 5.77734 7.53711 6.00977 6.98926C6.24772 6.44141 6.57145 5.95996 6.98096 5.54492C7.396 5.12988 7.87744 4.80615 8.42529 4.57373C8.97314 4.34131 9.5625 4.2251 10.1934 4.2251C11.029 4.2251 11.7899 4.42708 12.4761 4.83105C13.1623 5.23503 13.7074 5.78011 14.1113 6.46631C14.5153 7.15251 14.7173 7.91618 14.7173 8.75732C14.7173 9.39372 14.6011 9.98584 14.3687 10.5337C14.1362 11.0815 13.8125 11.563 13.3975 11.978C12.9824 12.3931 12.501 12.7168 11.9531 12.9492C11.4053 13.1816 10.8187 13.2979 10.1934 13.2979ZM10.1934 12.0361C10.7965 12.0361 11.3444 11.8895 11.8369 11.5962C12.335 11.3029 12.7306 10.91 13.0239 10.4175C13.3172 9.91943 13.4639 9.36605 13.4639 8.75732C13.4639 8.15413 13.3172 7.60628 13.0239 7.11377C12.7306 6.61572 12.335 6.22005 11.8369 5.92676C11.3444 5.62793 10.7965 5.47852 10.1934 5.47852C9.59017 5.47852 9.03955 5.62793 8.5415 5.92676C8.04899 6.22005 7.65332 6.61572 7.35449 7.11377C7.0612 7.60628 6.91455 8.15413 6.91455 8.75732C6.91455 9.36605 7.0612 9.91943 7.35449 10.4175C7.65332 10.91 8.04899 11.3029 8.5415 11.5962C9.03955 11.8895 9.59017 12.0361 10.1934 12.0361Z"
              fill={colors.accent.lightGreyBlue}
            />
          </Svg>
          <Text style={aboutStyles.navText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={aboutStyles.navItem} onPress={onHistoryClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Clock circle */}
            <Circle cx="12" cy="12" r="10" stroke={colors.text.white} strokeWidth="2" fill="none" />
            {/* Clock hands */}
            <Path
              d="M12 8V12L15 15"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={aboutStyles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={aboutStyles.navItem}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" fill="none" />
            <Path
              d="M12 16V12M12 8H12.01"
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={[aboutStyles.navText, { color: colors.primary }]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={aboutStyles.navItem} onPress={onProfileClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill={colors.text.white}
            />
          </Svg>
          <Text style={aboutStyles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default AboutScreen;

