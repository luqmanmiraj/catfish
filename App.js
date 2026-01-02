import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator, Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import * as RevenueCatService from './services/revenueCatService';
import CatfishLogo from './components/CatfishLogo';
import SignInButton from './components/SignInButton';
import SignUpButton from './components/SignUpButton';
import ContinueAsGuestButton from './components/ContinueAsGuestButton';
import PermissionsScreen from './screens/PermissionsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import TermsScreen from './screens/TermsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import HowItWorksScreen from './screens/HowItWorksScreen';
import VerificationScreen from './screens/VerificationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ScanScreen from './screens/ScanScreen';
import HistoryScreen from './screens/HistoryScreen';
import AboutScreen from './screens/AboutScreen';
import ProfileScreen from './screens/ProfileScreen';
import CameraScanScreen from './screens/CameraScanScreen';
import AnalysisScreen from './screens/AnalysisScreen';
import ResultsScreen from './screens/ResultsScreen';
import PaywallScreen from './components/PaywallScreen';
import LabelNoteModal from './components/LabelNoteModal';
import { getScanHistory, updateScanHistory, createScanHistory } from './services/subscriptionApi';
import { populateGalleryWithSamples } from './services/galleryService';
import styles from './styles';
import colors from './colors';

function AppContent() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading, signOut, user, guestSignUp, accessToken } = useAuth();
  const { 
    purchaseSubscription, 
    purchaseTokenPack,
    getAvailablePackages, 
    refreshSubscriptionStatus,
    presentPaywall,
    presentCustomerCenter,
    restorePurchases,
    checkCanScan,
    decrementToken,
    scansRemaining,
    tokenBalance,
  } = useSubscription();
  const [showPermissions, setShowPermissions] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [showScanScreen, setShowScanScreen] = useState(false);
  const [showHistoryScreen, setShowHistoryScreen] = useState(false);
  const [showAboutScreen, setShowAboutScreen] = useState(false);
  const [showProfileScreen, setShowProfileScreen] = useState(false);
  const [showCameraScan, setShowCameraScan] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [currentScanId, setCurrentScanId] = useState(null);
  const [showLabelNoteModal, setShowLabelNoteModal] = useState(false);

  // Populate gallery with sample images on app launch
  // This will run on every fresh install (AsyncStorage is empty on first launch)
  // On subsequent app opens, it will skip if already populated
  useEffect(() => {
    const populateGallery = async () => {
      try {
        console.log('Checking if gallery needs to be populated with sample images...');
        const result = await populateGalleryWithSamples();
        if (result.success) {
          if (result.count > 0) {
            console.log(`✅ Gallery populated successfully: ${result.message}`);
          } else {
            console.log('ℹ️ Gallery population skipped (already populated)');
          }
        } else {
          console.warn('⚠️ Gallery population failed:', result.message);
          // Don't block app if gallery population fails - app can still function
        }
      } catch (error) {
        console.error('❌ Error populating gallery:', error);
        // Don't block app startup if gallery population fails
      }
    };

    // Populate gallery on app start
    // On fresh install: AsyncStorage is empty → gallery gets populated
    // On subsequent opens: AsyncStorage has flag → gallery population skipped
    populateGallery();
  }, []); // Empty dependency array - runs only once on mount

  // Check if user is authenticated and RevenueCat is not configured
  // If so, show scan screen automatically on app start
  useEffect(() => {
    if (!isLoading && isAuthenticated && !showScanScreen && !showHistoryScreen && 
        !showAboutScreen && !showProfileScreen && !showCameraScan && !showAnalysis && 
        !showResults && !showSignIn && !showSignUp && !showVerification && !showPermissions &&
        !showForgotPassword && !showResetPassword) {
      const isRevenueCatConfigured = RevenueCatService.isRevenueCatConfigured();
      
      // If RevenueCat is not configured but user is authenticated, show scan screen
      if (!isRevenueCatConfigured) {
        setShowScanScreen(true);
      }
    }
  }, [isLoading, isAuthenticated]);

  // Show loading screen while checking auth status
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const handleGetStarted = () => {
    setShowPermissions(true);
  };

  const handleSignIn = () => {
    setShowSignIn(true);
    setShowPermissions(false);
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    setShowSignIn(false);
  };

  const handleBackToSignIn = () => {
    setShowSignIn(true);
    setShowSignUp(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
  };

  const handleVerificationSent = (email) => {
    setVerificationEmail(email);
    setShowSignUp(false);
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    setShowSignIn(true);
  };

  const handleCloseAuth = () => {
    setShowSignIn(false);
    setShowSignUp(false);
    setShowVerification(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowPermissions(true);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
  };

  const handleCodeSent = (email) => {
    setResetPasswordEmail(email);
    setShowForgotPassword(false);
    setShowResetPassword(true);
  };

  const handlePasswordReset = () => {
    setShowResetPassword(false);
    setShowSignIn(true);
  };

  /**
   * Handle successful sign-in
   * Show scan screen after successful sign in
   */
  const handleSignInSuccess = async () => {
    // Close sign-in screen
    setShowSignIn(false);
    setShowSignUp(false);
    setShowVerification(false);
    setShowPermissions(false);

    // Show scan screen after successful sign in
    setShowScanScreen(true);
    setShowProfileScreen(false);
    setShowHistoryScreen(false);
    setShowAboutScreen(false);
  };

  const handleContinueAsGuest = async () => {
    try {
      setIsCreatingGuest(true);
      
      // Create guest user account
      console.log('Creating guest user...');
      const guestResult = await guestSignUp();
      
      if (!guestResult.success) {
        Alert.alert(
          'Guest Signup Failed',
          guestResult.error || 'Unable to create guest account. Please try again.',
          [{ text: 'OK' }]
        );
        setIsCreatingGuest(false);
        return;
      }
      
      console.log('Guest user created successfully');
      
      // Request camera permissions - this will show the native iOS popup
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.status === 'granted') {
        console.log('Camera permission granted');
        // Show scan screen after permission is granted
        setShowScanScreen(true);
        setShowPermissions(false);
      } else {
        console.log('Camera permission denied');
        // Still show scan screen even if permission is denied
        // User can grant permission later when they try to use camera
        setShowScanScreen(true);
        setShowPermissions(false);
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to scan images. You can grant it later in settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error in guest signup flow:', error);
      Alert.alert(
        'Error',
        'An error occurred while creating your guest account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsCreatingGuest(false);
    }
  };

  const handleLabelNoteSave = async (label, note) => {
    if (!accessToken) {
      Alert.alert('Error', 'Unable to save. Please sign in to save scans to history.');
      setShowLabelNoteModal(false);
      return;
    }

    try {
      // If currentScanId exists, update existing scan (from history edit)
      if (currentScanId) {
        await updateScanHistory(accessToken, currentScanId, label, note);
        setShowLabelNoteModal(false);
        setCurrentScanId(null);
        Alert.alert('Success', 'Scan updated successfully.');
      } 
      // Otherwise, create new scan history entry (from "Save to History" button)
      else if (analysisResult && selectedImageUri) {
        // Extract data from analysis result
        const scanData = {
          success: true,
          status: analysisResult.status || 'unknown',
          deepfakeScore: analysisResult.deepfakeScore || analysisResult.confidence || null,
          aiProbability: analysisResult.aiProbability || null,
          humanProbability: analysisResult.humanProbability || null,
          sightengineRequestId: analysisResult.sightengineRequestId || analysisResult.requestId || null,
          gowinstonRequestId: analysisResult.gowinstonRequestId || analysisResult.requestId || null,
          s3Url: analysisResult.s3Url || null,
          requestId: analysisResult.requestId || null,
          source: analysisResult.source || 'image-analysis',
          label: label || null,
          note: note || null,
        };

        const result = await createScanHistory(accessToken, scanData);
        setShowLabelNoteModal(false);
        setCurrentScanId(null);
        
        // Navigate to history screen after successful save
        setShowResults(false);
        setShowScanScreen(false);
        setShowAboutScreen(false);
        setShowProfileScreen(false);
        setShowCameraScan(false);
        setShowHistoryScreen(true);
        
        Alert.alert('Success', 'Scan saved to history successfully.');
      } else {
        Alert.alert('Error', 'No scan data available to save.');
        setShowLabelNoteModal(false);
      }
    } catch (error) {
      console.error('Error saving scan history:', error);
      Alert.alert('Error', 'Failed to save scan. Please try again.');
    }
  };

  const handleLabelNoteCancel = () => {
    setShowLabelNoteModal(false);
    setCurrentScanId(null); // Clear scanId when canceling
  };

  const handleSaveToHistory = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to save scans to history.');
      return;
    }
    // Open the label/note modal for saving
    setCurrentScanId(null); // Clear any existing scanId to indicate this is a new save
    setShowLabelNoteModal(true);
  };

  const handleTapToScan = async () => {
    // Check if user has tokens before allowing scan
    if (isAuthenticated) {
      try {
        const canScanResult = await checkCanScan();
        if (!canScanResult.canScan || canScanResult.scansRemaining <= 0) {
          Alert.alert(
            'No Scans Remaining',
            'You have no scans left. Please purchase a scan pack to continue.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Purchase Scans', onPress: () => setShowPaywall(true) },
            ]
          );
          return;
        }
      } catch (error) {
        console.error('Error checking scan eligibility:', error);
        // Continue with scan attempt if check fails
      }
    }
    
    setShowCameraScan(true);
  };

  const handleCloseCameraScan = () => {
    setShowCameraScan(false);
  };

  const handleImageSelected = (imageUri) => {
    setSelectedImageUri(imageUri);
    setAnalysisResult(null);
    setShowCameraScan(false);
    setShowAnalysis(true);
  };

  const handleAnalysisComplete = async (result) => {
    setAnalysisResult(result);
    console.log('Analysis complete - showing results screen');
    console.log('Analysis result data:', result);
    
    // Decrement token after successful scan (if authenticated)
    // DEV MODE: Only local decrement - no backend sync
    if (isAuthenticated && result) {
      try {
        await decrementToken();
        // Refresh token balance to ensure sync
        await refreshSubscriptionStatus();
      } catch (error) {
        console.error('Error decrementing token:', error);
        // Continue even if token decrement fails - scan was successful
      }
    }
    
    // Clear any existing scanId when starting a new scan
    setCurrentScanId(null);
    
    setShowAnalysis(false);
    setShowResults(true);
    // Reset other screen states
    setShowScanScreen(false);
    setShowHistoryScreen(false);
    setShowAboutScreen(false);
    setShowProfileScreen(false);
    setShowCameraScan(false);
  };

  const handleScanAgain = () => {
    setShowResults(false);
    setShowScanScreen(true);
    // Clear any previous scan data
    setSelectedImageUri(null);
    setAnalysisResult(null);
    // Ensure other screens are closed
    setShowHistoryScreen(false);
    setShowAboutScreen(false);
    setShowProfileScreen(false);
    setShowCameraScan(false);
    setShowAnalysis(false);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setShowScanScreen(true);
    setShowScanScreen(true);
  };

  const handleShare = async () => {
    if (!selectedImageUri) {
      Alert.alert('Error', 'No image to share');
      return;
    }

    try {
      // Get the result status text
      const resultText = analysisResult?.status === 'deepfake_detected' 
        ? 'Confirmed Fake / AI Generated' 
        : analysisResult?.status === 'authentic' 
        ? 'Likely Real' 
        : 'Inconclusive';

      // Prepare share message
      const shareMessage = `Check out this image analysis from Catfish Crasher!\n\nResult: ${resultText}`;

      // Share options - React Native Share API works with URLs
      const shareOptions = {
        message: shareMessage,
        url: selectedImageUri, // This works on iOS for images
        title: 'Catfish Crasher Analysis',
      };

      // Try to share
      const result = await Share.share(shareOptions);

      // Check if user cancelled
      if (result.action === Share.dismissedAction) {
        // User dismissed the share dialog, no action needed
        return;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      
      // If sharing failed, provide fallback message
      if (error.message && !error.message.includes('cancelled')) {
        Alert.alert('Error', 'Failed to share image. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    if (!selectedImageUri) {
      Alert.alert('Error', 'No image to save');
      return;
    }

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save files to your device.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get image as base64 for PDF
      let imageBase64 = '';
      if (selectedImageUri.startsWith('http://') || selectedImageUri.startsWith('https://')) {
        // Download and convert to base64
        const downloadResult = await FileSystem.downloadAsync(selectedImageUri, FileSystem.documentDirectory + `temp_image_${Date.now()}.jpg`);
        const base64 = await FileSystem.readAsStringAsync(downloadResult.uri, { encoding: FileSystem.EncodingType.Base64 });
        imageBase64 = `data:image/jpeg;base64,${base64}`;
      } else {
        // Local file, read as base64
        const base64 = await FileSystem.readAsStringAsync(selectedImageUri, { encoding: FileSystem.EncodingType.Base64 });
        imageBase64 = `data:image/jpeg;base64,${base64}`;
      }

      // Get analysis summary
      const isDeepfakeDetected = analysisResult?.status === 'deepfake_detected';
      const isAuthentic = analysisResult?.status === 'authentic';
      const isUnknown = 
        !analysisResult?.status ||
        analysisResult?.status === 'empty' ||
        analysisResult?.status === 'no_result' ||
        analysisResult?.status === 'unknown' ||
        analysisResult?.status === 'inconclusive' ||
        analysisResult?.status === 'unverifiable' ||
        analysisResult?.status === 'unverified';

      let headline = 'Inconclusive';
      let subheadline = 'Insufficient data for analysis';
      
      if (isDeepfakeDetected) {
        const confidence = analysisResult?.confidence ?? analysisResult?.deepfakeScore ?? analysisResult?.score ?? null;
        headline = 'Confirmed Fake / AI Generated';
        subheadline = confidence != null ? `High confidence fake or AI (${Math.round(Number(confidence))}% confidence)` : 'High confidence fake or AI';
      } else if (isAuthentic) {
        const confidence = analysisResult?.confidence ?? analysisResult?.score ?? null;
        headline = 'Likely Real';
        subheadline = confidence != null ? `${Math.round(Number(confidence))}% confidence` : 'High authenticity confidence';
      } else if (isUnknown) {
        headline = 'Inconclusive';
        subheadline = 'Insufficient data for analysis';
      }

      const metadata = {
        detectionAlgorithm: analysisResult?.metadata?.detectionAlgorithm || 'AI Pattern Recognition v2.1',
        processingTime: analysisResult?.metadata?.processingTime || '3.2s',
        imageQuality: analysisResult?.metadata?.imageQuality || 'High Resolution',
      };

      const primaryMessage = analysisResult?.primaryMessage || 
        (isDeepfakeDetected 
          ? 'We can say with high confidence that this image was partially or completely created or altered using AI.'
          : isUnknown
            ? 'Image quality too low or insufficient data to verify authenticity.'
            : 'Below is a summary of the Hive AI analysis for this image.');

      const currentDateTime = new Date().toLocaleString('en-US', { 
        month: '2-digit', 
        day: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      });

      // Create HTML for PDF
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #0E1F2B;
                color: #FFFFFF;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .title {
                font-size: 24px;
                color: #0AB4E0;
                margin-bottom: 8px;
              }
              .date {
                font-size: 14px;
                color: #A0B4C8;
                margin-bottom: 30px;
              }
              .image-container {
                text-align: center;
                margin-bottom: 30px;
              }
              .image-container img {
                max-width: 100%;
                height: auto;
                border-radius: 12px;
              }
              .result-section {
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .headline {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 8px;
                color: ${isDeepfakeDetected ? '#FF3B30' : isAuthentic ? '#4CAF50' : '#A0B4C8'};
              }
              .subheadline {
                font-size: 16px;
                color: #A0B4C8;
                margin-bottom: 20px;
              }
              .analysis-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #FFFFFF;
              }
              .analysis-text {
                font-size: 16px;
                color: #FFFFFF;
                line-height: 24px;
                margin-bottom: 20px;
              }
              .details-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              .details-table td {
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                color: #FFFFFF;
              }
              .details-label {
                color: #A0B4C8;
                font-size: 14px;
              }
              .details-value {
                font-weight: 600;
                font-size: 14px;
                text-align: right;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Catfish Crasher - Scan Report</div>
              <div class="date">${currentDateTime}</div>
            </div>
            
            <div class="image-container">
              <img src="${imageBase64}" alt="Scanned Image" />
            </div>
            
            <div class="result-section">
              <div class="headline">${headline}</div>
              <div class="subheadline">${subheadline}</div>
              
              <div class="analysis-title">Detailed Analysis</div>
              <div class="analysis-text">${primaryMessage}</div>
              
              <table class="details-table">
                <tr>
                  <td class="details-label">Detection Algorithm</td>
                  <td class="details-value">${metadata.detectionAlgorithm}</td>
                </tr>
                <tr>
                  <td class="details-label">Processing Time</td>
                  <td class="details-value">${metadata.processingTime}</td>
                </tr>
                <tr>
                  <td class="details-label">Image Quality</td>
                  <td class="details-value">${metadata.imageQuality}</td>
                </tr>
              </table>
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });
      
      // Save PDF to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Optionally, add to a specific album
      try {
        let album = await MediaLibrary.getAlbumAsync('Catfish Crasher');
        if (album == null) {
          album = await MediaLibrary.createAlbumAsync('Catfish Crasher', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (albumError) {
        console.log('Could not add to album, but PDF was saved:', albumError);
      }

      Alert.alert('Success', 'PDF report saved to your device!');
    } catch (error) {
      console.error('Error saving PDF:', error);
      Alert.alert('Error', 'Failed to save PDF. Please try again.');
    }
  };

  const handleUpgrade = () => {
    // Show the PaywallScreen modal
    setShowPaywall(true);
  };

  const handlePaywallClose = () => {
    setShowPaywall(false);
  };

  const handlePaywallPurchaseSuccess = async () => {
    // Refresh subscription status after successful purchase
    await refreshSubscriptionStatus();
    setShowPaywall(false);
  };

  const handleManageSubscription = async () => {
    try {
      await presentCustomerCenter();
      // Refresh status after customer center interaction
      await refreshSubscriptionStatus();
    } catch (error) {
      console.error('Error presenting customer center:', error);
      Alert.alert('Error', 'Unable to open subscription management. Please try again.');
    }
  };

  const handleHistoryClick = () => {
    console.log('📊 History menu clicked - navigating to history screen');
    setShowHistoryScreen(true);
    setShowScanScreen(false);
    setShowAboutScreen(false);
    setShowProfileScreen(false);
  };

  const handleScanClick = () => {
    setShowScanScreen(true);
    setShowHistoryScreen(false);
    setShowAboutScreen(false);
    setShowProfileScreen(false);
  };

  const handleAboutClick = () => {
    setShowAboutScreen(true);
    setShowScanScreen(false);
    setShowHistoryScreen(false);
    setShowProfileScreen(false);
  };

  const handleProfileClick = () => {
    setShowProfileScreen(true);
    setShowScanScreen(false);
    setShowHistoryScreen(false);
    setShowAboutScreen(false);
  };

  const handleLogOut = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          setShowProfileScreen(false);
          setShowScanScreen(false);
          setShowPermissions(true);
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    // Handle delete account
    Alert.alert('Delete Account', 'Are you sure you want to delete your account? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
    ]);
  };

  const renderContent = () => {
    // Authentication screens
    if (showResetPassword) {
      return (
        <ResetPasswordScreen
          email={resetPasswordEmail}
          onBack={handleBackToSignIn}
          onPasswordReset={handlePasswordReset}
        />
      );
    }

    if (showForgotPassword) {
      return (
        <ForgotPasswordScreen
          onBack={handleBackToSignIn}
          onCodeSent={handleCodeSent}
        />
      );
    }

    if (showVerification) {
      return (
        <VerificationScreen
          email={verificationEmail}
          onVerified={handleVerificationComplete}
          onClose={handleCloseAuth}
        />
      );
    }

    if (showTerms) {
      return (
        <TermsScreen
          onClose={() => setShowTerms(false)}
        />
      );
    }

    if (showPrivacy) {
      return (
        <PrivacyScreen
          onClose={() => setShowPrivacy(false)}
        />
      );
    }

    if (showHowItWorks) {
      return (
        <HowItWorksScreen
          onClose={() => setShowHowItWorks(false)}
        />
      );
    }

    if (showSignUp) {
      return (
        <SignUpScreen
          onSignIn={handleBackToSignIn}
          onClose={handleCloseAuth}
          onVerificationSent={handleVerificationSent}
          onViewTerms={() => setShowTerms(true)}
          onViewPrivacy={() => setShowPrivacy(true)}
        />
      );
    }

    if (showSignIn) {
      return (
        <SignInScreen
          onSignUp={handleSignUp}
          onForgotPassword={handleForgotPassword}
          onClose={handleCloseAuth}
          onSignInSuccess={handleSignInSuccess}
        />
      );
    }

    if (showResults) {
      return (
        <>
          <ResultsScreen
            imageUri={selectedImageUri}
            analysisResult={analysisResult}
            onScanAgain={handleScanAgain}
            onShare={handleShare}
            onSave={handleSaveToHistory}
            onClose={handleCloseResults}
          />
          <LabelNoteModal
            visible={showLabelNoteModal}
            onSave={handleLabelNoteSave}
            onCancel={handleLabelNoteCancel}
          />
        </>
      );
    }

    if (showAnalysis && selectedImageUri) {
      return (
        <AnalysisScreen
          imageUri={selectedImageUri}
          onComplete={handleAnalysisComplete}
        />
      );
    }

    if (showCameraScan) {
      return (
        <CameraScanScreen
          onClose={handleCloseCameraScan}
          onImageSelected={handleImageSelected}
          onUpgrade={handleUpgrade}
        />
      );
    }

    if (showProfileScreen) {
      return (
        <ProfileScreen
          onScanClick={handleScanClick}
          onHistoryClick={handleHistoryClick}
          onAboutClick={handleAboutClick}
          onUpgrade={handleUpgrade}
          onLogOut={handleLogOut}
          onDeleteAccount={handleDeleteAccount}
          onManageSubscription={handleManageSubscription}
        />
      );
    }

    if (showAboutScreen) {
      return (
        <AboutScreen
          onScanClick={handleScanClick}
          onHistoryClick={handleHistoryClick}
          onProfileClick={handleProfileClick}
        />
      );
    }

    if (showHistoryScreen) {
      return (
        <HistoryScreen
          onScanClick={handleScanClick}
          onAboutClick={handleAboutClick}
          onProfileClick={handleProfileClick}
        />
      );
    }

    if (showScanScreen) {
      return (
        <ScanScreen
          onTapToScan={handleTapToScan}
          onUpgrade={handleUpgrade}
          onHistoryClick={handleHistoryClick}
          onAboutClick={handleAboutClick}
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          user={user}
          onHowItWorks={() => setShowHowItWorks(true)}
        />
      );
    }

    if (showPermissions) {
      return (
        <>
          <PermissionsScreen
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onContinueAsGuest={handleContinueAsGuest}
            isCreatingGuest={isCreatingGuest}
          />
          <StatusBar style="light" />
        </>
      );
    }

    // Default: Show landing screen for unauthenticated users
    // For authenticated users, show scan screen as default
    if (isAuthenticated) {
      // If authenticated but no screen is showing, show scan screen
      return (
        <ScanScreen
          onTapToScan={handleTapToScan}
          onUpgrade={handleUpgrade}
          onHistoryClick={handleHistoryClick}
          onAboutClick={handleAboutClick}
          onProfileClick={handleProfileClick}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      );
    }

    // Landing screen for unauthenticated users
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <CatfishLogo />
            </View>
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome to Catfish</Text>
            <Text style={styles.taglineText}>Detect AI-Generated Images Instantly</Text>
          </View>
        </View>
        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 30) - 5 }]}>
          <View style={{ width: '100%', maxWidth: 345, alignItems: 'center' }}>
            <SignUpButton onPress={handleSignUp} style={{ marginBottom: 12, width: '100%' }} />
            <SignInButton onPress={handleSignIn} style={{ marginBottom: 12, width: '100%' }} />
            <ContinueAsGuestButton 
              onPress={handleContinueAsGuest} 
              isLoading={isCreatingGuest}
              style={{ width: '100%' }} 
            />
          </View>
        </View>
        <StatusBar style="light" />
      </View>
    );
  };

  return (
    <>
      {renderContent()}
      {showPaywall && (
        <PaywallScreen
          onClose={handlePaywallClose}
          onPurchaseSuccess={handlePaywallPurchaseSuccess}
          onRestore={async () => {
            try {
              await restorePurchases();
              await refreshSubscriptionStatus();
            } catch (error) {
              console.error('Error restoring purchases:', error);
            }
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
