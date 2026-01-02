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

const HowItWorksScreen = ({ onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[howItWorksStyles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar style="light" />
      
      {/* Header with Close Button */}
      <View style={howItWorksStyles.header}>
        <Text style={howItWorksStyles.title}>How it Works?</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={howItWorksStyles.closeButton}>
            <Text style={howItWorksStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={howItWorksStyles.scrollView}
        contentContainerStyle={howItWorksStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={howItWorksStyles.content}>
          <Text style={howItWorksStyles.sectionTitle}>Step 1: Get the Image in Your Gallery</Text>
          <Text style={howItWorksStyles.paragraph}>
            First, you need to have the image you want to scan in your device's gallery. You can do this in two ways:
          </Text>
          
          <Text style={howItWorksStyles.subsectionTitle}>Option A: Image Already in Gallery</Text>
          <Text style={howItWorksStyles.paragraph}>
            If the image is already saved in your gallery, you can proceed to Step 2.
          </Text>

          <Text style={howItWorksStyles.subsectionTitle}>Option B: Take a Screenshot</Text>
          <Text style={howItWorksStyles.paragraph}>
            If you need to capture an image from another app or website, take a screenshot:
          </Text>
          
          <Text style={howItWorksStyles.bulletPoint}>• <Text style={howItWorksStyles.boldText}>Android:</Text> Press and hold the Power button and Volume Down button simultaneously, or swipe down from the top of the screen and tap the Screenshot option.</Text>
          
          <Text style={howItWorksStyles.bulletPoint}>• <Text style={howItWorksStyles.boldText}>iOS:</Text> Press the Side button and Volume Up button at the same time (iPhone X and later), or press the Home button and Power button simultaneously (iPhone 8 and earlier). On newer iPhones, you can also swipe up from the bottom corner.</Text>

          <Text style={howItWorksStyles.sectionTitle}>Step 2: Tap to Scan</Text>
          <Text style={howItWorksStyles.paragraph}>
            On the scan screen, you'll see a camera icon with the text "Tap to scan an image of a potential date". Tap on this camera icon.
          </Text>
          <Text style={howItWorksStyles.paragraph}>
            A window will open showing your device's photo gallery. Browse through your photos and select the image you want to scan.
          </Text>

          <Text style={howItWorksStyles.sectionTitle}>Step 3: Crop and Scan</Text>
          <Text style={howItWorksStyles.paragraph}>
            Once you've selected an image, it will open in the preview screen. You'll see crop tool grids overlaid on the image.
          </Text>
          <Text style={howItWorksStyles.paragraph}>
            Adjust the crop area to focus on the part of the image you want to analyze. Once you're satisfied with the crop, the scan will start automatically.
          </Text>
          <Text style={howItWorksStyles.paragraph}>
            The app will analyze the image to determine if it's AI-generated, real, or inconclusive.
          </Text>

          <Text style={howItWorksStyles.sectionTitle}>Step 4: View Results and Save to History</Text>
          <Text style={howItWorksStyles.paragraph}>
            After the scan completes, you'll see the results screen showing one of three outcomes:
          </Text>
          <Text style={howItWorksStyles.bulletPoint}>• <Text style={howItWorksStyles.boldText}>Real:</Text> The image appears to be authentic</Text>
          <Text style={howItWorksStyles.bulletPoint}>• <Text style={howItWorksStyles.boldText}>Fake:</Text> The image appears to be AI-generated or manipulated</Text>
          <Text style={howItWorksStyles.bulletPoint}>• <Text style={howItWorksStyles.boldText}>Inconclusive:</Text> The analysis couldn't determine with certainty</Text>
          
          <Text style={howItWorksStyles.paragraph}>
            If you want to save this scan for later reference, click the "Save to History" button. A form will appear where you can enter a name or label for this scan (e.g., "Date from Tinder", "Profile pic check", etc.).
          </Text>
          <Text style={howItWorksStyles.paragraph}>
            Click "Save" to store the scan in your history. You can view all your saved scans anytime by navigating to the History screen from the bottom navigation menu.
          </Text>

          <View style={howItWorksStyles.footer}>
            <Text style={howItWorksStyles.footerText}>
              Need help? Contact us through the app support channels.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const howItWorksStyles = StyleSheet.create({
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
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.white,
    marginTop: 16,
    marginBottom: 8,
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
  boldText: {
    fontWeight: '600',
    color: colors.text.white,
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

export default HowItWorksScreen;

