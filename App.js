import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator, Share, Platform, Linking, Image, Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import * as RevenueCatService from './services/revenueCatService';
import CatfishLogo from './components/CatfishLogo';
import SignInButton from './components/SignInButton';
import SignUpButton from './components/SignUpButton';
import ContinueAsGuestButton from './components/ContinueAsGuestButton';
import ContinueToAppButton from './components/ContinueToAppButton';
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
import RevenueCatPaywallScreen from './components/RevenueCatPaywallScreen';
import LabelNoteModal from './components/LabelNoteModal';
import { getScanHistory, updateScanHistory, createScanHistory } from './services/subscriptionApi';
import * as Analytics from './services/analyticsService';
import * as SentryService from './services/sentryService';
import * as PostHogService from './services/posthogService';
import * as SampleImagesService from './services/sampleImagesService';
import apiConfig from './config/apiConfig';
import { getFriendlyErrorMessage } from './utils/errorMessages';
import styles from './styles';
import colors from './colors';
import ErrorBoundary from './components/ErrorBoundary';

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
  const compositeViewRef = useRef(null);
  const [isCreatingComposite, setIsCreatingComposite] = useState(false);
  const [currentScanId, setCurrentScanId] = useState(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0); // Force HistoryScreen refresh
  const [showLabelNoteModal, setShowLabelNoteModal] = useState(false);
  const [showLandingScreen, setShowLandingScreen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [tokenBalanceBeforeScan, setTokenBalanceBeforeScan] = useState(null);


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
    setShowLandingScreen(false);
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
        getFriendlyErrorMessage(error, 'auth'),
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
        console.log('✅ Scan saved to history:', result);
        setShowLabelNoteModal(false);
        setCurrentScanId(null);
        
        // Force HistoryScreen to refresh by updating the key FIRST
        // This ensures the component remounts and fetches fresh data
        setHistoryRefreshKey(prev => {
          const newKey = prev + 1;
          console.log('🔄 History refresh key updated:', newKey);
          return newKey;
        });
        
        // Small delay to ensure DynamoDB write has propagated before navigating
        // This helps ensure the newly saved scan appears in the query results
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
      Alert.alert('Error', getFriendlyErrorMessage(error, 'history'));
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
    // Prevent multiple rapid taps
    if (isScanning) {
      console.log('⚠️ Scan already in progress, ignoring tap');
      return;
    }
    
    setIsScanning(true);
    setTokenBalanceBeforeScan(scansRemaining);
    console.log('🔒 Scan started - button locked');
    console.log('📊 Token balance at scan start:', scansRemaining);
    
    try {
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
            setIsScanning(false);
            return;
          }
        } catch (error) {
          console.error('Error checking scan eligibility:', error);
          // Continue with scan attempt if check fails
        }
      }
      
      setShowCameraScan(true);
    } catch (error) {
      console.error('Error in handleTapToScan:', error);
      setIsScanning(false);
    }
  };

  const handleCloseCameraScan = () => {
    console.log('📷 Camera closed WITHOUT selecting image');
    console.log('📊 Token balance at camera close:', scansRemaining);
    console.log('📊 Token balance when scan started:', tokenBalanceBeforeScan);
    console.log('⚠️ NO TOKEN SHOULD BE DEDUCTED - User cancelled');
    
    // Verify token count didn't change (it shouldn't!)
    if (tokenBalanceBeforeScan !== null && scansRemaining !== tokenBalanceBeforeScan) {
      console.error('🚨 ERROR: Token count changed during camera cancel!');
      console.error('  Expected:', tokenBalanceBeforeScan);
      console.error('  Actual:', scansRemaining);
      console.error('  Difference:', tokenBalanceBeforeScan - scansRemaining);
      
      // This shouldn't happen - alert user if in development
      if (__DEV__) {
        Alert.alert(
          'Debug: Token Count Changed',
          `Tokens changed from ${tokenBalanceBeforeScan} to ${scansRemaining} when canceling camera. This shouldn't happen!`
        );
      }
    }
    
    setShowCameraScan(false);
    setTokenBalanceBeforeScan(null);
    
    // Reset scanning state when camera is closed without selecting image
    setTimeout(() => {
      setIsScanning(false);
      console.log('🔓 Scan button unlocked (camera closed)');
      console.log('📊 Final token balance:', scansRemaining);
    }, 500);
  };

  const handleImageSelected = (imageUri) => {
    console.log('📸 Image SELECTED - Analysis will start');
    console.log('📊 Token balance BEFORE analysis:', scansRemaining);
    console.log('⚠️ Token will be decremented by Lambda AFTER successful analysis');
    
    setSelectedImageUri(imageUri);
    // Track photo selected event
    PostHogService.trackPhotoSelected({
      has_image: !!imageUri,
    });
    // Track photo selected event
    PostHogService.trackPhotoSelected({
      has_image: !!imageUri,
    });
    setAnalysisResult(null);
    setShowCameraScan(false);
    setShowAnalysis(true);
    // Keep isScanning true until analysis completes
    console.log('📸 Image selected, starting analysis...');
  };

  const handleAnalysisComplete = async (result) => {
    setAnalysisResult(result);
    console.log('✅ Analysis complete - showing results screen');
    console.log('📊 Analysis result data:', result);
    console.log('📊 Token balance FROM Lambda response:', result?.tokenBalance || result?.scansRemaining || 'NOT PROVIDED');
    console.log('📊 Current local token balance:', scansRemaining);
    
    // Unlock scan button after analysis completes
    setTimeout(() => {
      setIsScanning(false);
      console.log('🔓 Scan button unlocked (analysis complete)');
    }, 1000);
    
    // Track scan completed event
    if (result) {
      try {
        const userId = user?.sub || user?.email || user?.['cognito:username'] || null;
        await Analytics.trackScanCompleted({
          user_id: userId,
          scan_id: result.requestId || result.sightengineRequestId || result.gowinstonRequestId || null,
          result_status: result.status || 'unknown',
          deepfake_score: result.deepfakeScore || result.confidence || null,
          ai_probability: result.aiProbability || null,
          human_probability: result.humanProbability || null,
        });
        // Track in PostHog
        PostHogService.trackScanCompleted({
          result_status: result.status || 'unknown',
          scan_id: result.requestId || result.sightengineRequestId || result.gowinstonRequestId || null,
        });
      } catch (error) {
        console.error('Error tracking scan completed event:', error);
      }
    }
    
    // Update token balance from scan API response (Lambda already decremented tokens)
    // The scan API response includes the updated tokenBalance after decrement
    // DO NOT call decrementToken() again - Lambda already handled it!
    if (isAuthenticated && result) {
      try {
        // Check if scan response includes updated token balance
        if (result.tokenBalance !== undefined || result.scansRemaining !== undefined) {
          const updatedBalance = result.tokenBalance !== undefined 
            ? result.tokenBalance 
            : result.scansRemaining;
          
          console.log('📊 Token balance from scan response (Lambda already decremented):', updatedBalance);
          // Refresh subscription status to sync with backend (includes the decremented balance)
          // This ensures the app state matches the database
          await refreshSubscriptionStatus();
        } else {
          // Fallback: refresh status if balance not in response
          console.log('⚠️ Token balance not in scan response, refreshing from backend...');
          await refreshSubscriptionStatus();
        }
      } catch (error) {
        console.error('Error updating token balance:', error);
        // Continue even if update fails - scan was successful
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

  // Helper function to create composite image with text overlay
  const createCompositeImage = async (imageUri, result) => {
    return new Promise((resolve, reject) => {
      // Set state to show composite view temporarily
      setIsCreatingComposite(true);
      
      // Wait for view to render, then capture
      setTimeout(async () => {
        try {
          if (compositeViewRef.current) {
            const uri = await captureRef(compositeViewRef.current, {
              format: 'jpg',
              quality: 0.9,
              result: 'tmpfile',
            });
            setIsCreatingComposite(false);
            resolve(uri);
          } else {
            setIsCreatingComposite(false);
            reject(new Error('Composite view ref not available'));
          }
        } catch (error) {
          setIsCreatingComposite(false);
          console.error('Error capturing composite image:', error);
          reject(error);
        }
      }, 300); // Give more time for view to render
    });
  };

  const handleShare = async () => {
    if (!selectedImageUri) {
      Alert.alert('Error', 'No image to share');
      return;
    }

    try {
      // Get the result status text for share message
      const resultText = analysisResult?.status === 'deepfake_detected' 
        ? 'Confirmed Fake / AI Generated' 
        : analysisResult?.status === 'authentic' 
        ? 'Likely Real' 
        : 'Inconclusive';

      // Prepare share message
      const shareMessage = `Check out this image analysis from Catfish Crasher!\n\nResult: ${resultText}`;

      // Create composite image with text overlay
      let imageFileUri = selectedImageUri;
      try {
        imageFileUri = await createCompositeImage(selectedImageUri, analysisResult);
      } catch (compositeError) {
        console.warn('Failed to create composite image, using original:', compositeError);
        // Continue with original image if composite fails
      }

      // Prepare image file for sharing
      
      // Check if the image URI is a remote URL or local file
      if (selectedImageUri.startsWith('http://') || selectedImageUri.startsWith('https://')) {
        // Download remote image to a temporary file
        const filename = `share_image_${Date.now()}.jpg`;
        const localUri = `${FileSystem.cacheDirectory}${filename}`;
        const downloadResult = await FileSystem.downloadAsync(selectedImageUri, localUri);
        imageFileUri = downloadResult.uri;
      } else if (!selectedImageUri.startsWith('file://') && !selectedImageUri.startsWith('content://')) {
        // Ensure local files have file:// prefix (Android content:// URIs are handled separately)
        imageFileUri = selectedImageUri.startsWith('/') 
          ? `file://${selectedImageUri}` 
          : `file:///${selectedImageUri}`;
      }

      // Ensure URI is properly formatted for sharing
      let shareableImageUri = imageFileUri;
      if (Platform.OS === 'android') {
        // Android needs file:// URI format for local files
        if (!imageFileUri.startsWith('file://') && !imageFileUri.startsWith('content://') && !imageFileUri.startsWith('http')) {
          shareableImageUri = `file://${imageFileUri}`;
        }
      }

      // Platform-specific sharing approach
      if (Platform.OS === 'ios') {
        // iOS: Share API supports both message and url together
        const shareOptions = {
          message: shareMessage,
          url: shareableImageUri,
          title: 'Catfish Crasher Analysis',
        };
        
        try {
          const result = await Share.share(shareOptions);
          if (result.action === Share.dismissedAction) {
            return;
          }
        } catch (shareError) {
          console.error('iOS Share failed:', shareError);
          throw shareError;
        }
      } else {
        // Android: Use expo-sharing directly for reliable image sharing
        // React Native Share API on Android is unreliable for images
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (!isAvailable) {
          // Fallback: Try React Native Share API
          try {
            const shareOptions = {
              url: shareableImageUri,
              title: shareMessage,
            };
            const result = await Share.share(shareOptions);
            if (result.action === Share.dismissedAction) {
              return;
            }
          } catch (shareError) {
            console.error('Sharing failed:', shareError);
            Alert.alert('Error', 'Unable to share. Please try again.');
          }
          return;
        }

        // Determine MIME type
        let mimeType = 'image/jpeg';
        const uriLower = shareableImageUri.toLowerCase();
        if (uriLower.includes('.png')) {
          mimeType = 'image/png';
        } else if (uriLower.includes('.webp')) {
          mimeType = 'image/webp';
        } else if (uriLower.includes('.gif')) {
          mimeType = 'image/gif';
        }

        // Share image using expo-sharing (most reliable for images on Android)
        // The dialogTitle shows the message text in the share dialog
        // Note: The text will be visible in the share dialog, and users can add it
        // to their share in most Android apps (WhatsApp, Messages, etc.)
        await Sharing.shareAsync(shareableImageUri, {
          mimeType: mimeType,
          dialogTitle: shareMessage, // This displays the text message
        });
      }

    } catch (error) {
      console.error('Error sharing:', error);
      
      // If sharing failed, provide fallback message
      if (error.message && !error.message.includes('cancelled') && !error.message.includes('User cancelled')) {
        Alert.alert('Error', getFriendlyErrorMessage(error, 'general'));
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
      // The expo-media-library plugin configuration in app.json ensures only image permissions are requested
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
      Alert.alert('Error', getFriendlyErrorMessage(error, 'general'));
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
      Alert.alert('Error', getFriendlyErrorMessage(error, 'purchase'));
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

  const handleWatchVideo = async () => {
    // TODO: Replace with your actual video URL
    const videoUrl = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID'; // Replace with actual video URL
    
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert('Error', 'Cannot open video URL');
      }
    } catch (error) {
      console.error('Error opening video:', error);
      Alert.alert('Error', getFriendlyErrorMessage(error, 'general'));
    }
  };

  const handleHomeClick = () => {
    // Reset all screen states to show welcome/landing screen
    // Keep user authenticated
    setShowScanScreen(false);
    setShowHistoryScreen(false);
    setShowAboutScreen(false);
    setShowProfileScreen(false);
    setShowCameraScan(false);
    setShowAnalysis(false);
    setShowResults(false);
    setShowSignIn(false);
    setShowSignUp(false);
    setShowVerification(false);
    setShowPermissions(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setShowHowItWorks(false);
    setShowPaywall(false);
    setShowLandingScreen(true); // Explicitly show landing screen
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
      // Get text info for composite image
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
      let textColor = '#A0B4C8'; // Grey for inconclusive
      
      if (isDeepfakeDetected) {
        const confidence = analysisResult?.confidence ?? analysisResult?.deepfakeScore ?? analysisResult?.score ?? null;
        headline = 'Confirmed Fake / AI Generated';
        textColor = '#FF3B30'; // Red
        if (confidence != null) {
          const pct = Math.round(Number(confidence));
          if (!Number.isNaN(pct)) {
            subheadline = `${pct}% confidence`;
          }
        } else {
          subheadline = 'High confidence fake or AI';
        }
      } else if (isAuthentic) {
        const confidence = analysisResult?.confidence ?? analysisResult?.score ?? null;
        headline = 'Likely Real';
        textColor = '#4CAF50'; // Green
        if (confidence != null) {
          const pct = Math.round(Number(confidence));
          if (!Number.isNaN(pct)) {
            subheadline = `${pct}% confidence`;
          }
        } else {
          subheadline = 'High authenticity confidence';
        }
      } else if (isUnknown) {
        headline = 'Inconclusive';
        subheadline = 'Insufficient data for analysis';
        textColor = '#A0B4C8'; // Grey
      }

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
          {/* Hidden composite view for image capture */}
          {isCreatingComposite && selectedImageUri && (
            <View
              ref={compositeViewRef}
              style={{
                position: 'absolute',
                left: -9999,
                top: -9999,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').width, // Square for now, will adjust based on image
                opacity: 0.01, // Nearly invisible but still renderable
              }}
              collapsable={false}
            >
              <Image
                source={{ uri: selectedImageUri }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.60)',
                  padding: 20,
                  paddingBottom: 50, // Increased bottom padding for more space below text
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: textColor,
                    marginBottom: 8,
                    textAlign: 'center',
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}
                >
                  {headline}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#FFFFFF',
                    textAlign: 'center',
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                    marginBottom: 10, // Add margin below percentage text
                  }}
                >
                  {subheadline}
                </Text>
              </View>
              {/* Logo and branding at bottom right corner */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <CatfishLogo width={20} height={22} />
                <Text
                  style={{
                    fontSize: 12,
                    color: '#FFFFFF',
                    marginLeft: 6,
                    textShadowColor: 'rgba(0, 0, 0, 0.75)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Scanned by Catfish Crasher
                </Text>
              </View>
            </View>
          )}
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
          key={historyRefreshKey} // Force remount when key changes (after saving new scan)
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
          onWatchVideo={handleWatchVideo}
          onHomeClick={handleHomeClick}
          isScanning={isScanning}
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
    // For authenticated users, show scan screen as default (unless landing screen was explicitly requested via home button)
    if (isAuthenticated && !showLandingScreen) {
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
          onHowItWorks={() => setShowHowItWorks(true)}
          onWatchVideo={handleWatchVideo}
          onHomeClick={handleHomeClick}
          isScanning={isScanning}
        />
      );
    }

    // Landing screen for unauthenticated users or when home button is clicked (showLandingScreen is true)
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
            <Text style={styles.taglineTextExp1}>Upload a photo to see whether it’s verified, inconclusive, or fake
            in secounds.”</Text>
            <Text style={styles.taglineTextExp}>Before you invest your time, emotion or
            money- know if the photo is real.</Text>
            
          </View>
        </View>
        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 30) - 5 }]}>
          <View style={{ width: '100%', maxWidth: 345, alignItems: 'center' }}>
            {isAuthenticated ? (
              // If user is logged in, show "Continue to App" button
              <ContinueToAppButton 
                onPress={() => { 
                  setShowLandingScreen(false); 
                  setShowScanScreen(true); 
                }} 
                style={{ width: '100%' }} 
              />
            ) : (
              // If user is NOT logged in, show sign up/sign in/guest options
              <>
                <SignUpButton onPress={() => { setShowLandingScreen(false); handleSignUp(); }} style={{ marginBottom: 12, width: '100%' }} />
                <SignInButton onPress={() => { setShowLandingScreen(false); handleSignIn(); }} style={{ marginBottom: 12, width: '100%' }} />
                <ContinueAsGuestButton 
                  onPress={() => { setShowLandingScreen(false); handleContinueAsGuest(); }} 
                  isLoading={isCreatingGuest}
                  style={{ width: '100%' }} 
                />
              </>
            )}
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
        <RevenueCatPaywallScreen
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
  // Initialize Sentry, PostHog, and analytics on app start
  useEffect(() => {
    const initializeServices = async () => {
      // Initialize Sentry first (for error tracking)
      await SentryService.initializeSentry({
        filterDevErrors: false, // Track errors in dev too
      });

      // Initialize PostHog (for product analytics)
      await PostHogService.initializePostHog();
      
      // Track app opened event
      PostHogService.trackAppOpened();

      // Request ATT (App Tracking Transparency) permission on iOS before initializing Meta SDK
      // This must happen before Meta SDK init so advertiser tracking reflects actual user consent
      let trackingConsent = 'denied';
      if (Platform.OS === 'ios') {
        try {
          const { status } = await requestTrackingPermissionsAsync();
          trackingConsent = status;
          console.log('ATT tracking permission status:', status);
        } catch (attError) {
          console.warn('Error requesting ATT permission:', attError);
          // Continue with tracking disabled if ATT prompt fails
        }
      } else {
        // Android does not have ATT; treat as granted for Meta SDK purposes
        trackingConsent = 'granted';
      }

      // Initialize analytics (marketing analytics)
      await Analytics.initializeAnalytics({
        meta: {
          appId: apiConfig.META_APP_ID,
          pixelId: apiConfig.META_PIXEL_ID,
          trackingConsent,
        },
        singular: {
          apiKey: apiConfig.SINGULAR_API_KEY,
          secret: apiConfig.SINGULAR_SECRET,
        },
      });

      // Copy sample images to gallery on first launch
      try {
        const result = await SampleImagesService.copySampleImagesToGallery();
        if (result.success && result.copiedCount > 0) {
          console.log(`✓ Copied ${result.copiedCount} sample images to gallery`);
        } else if (result.skipped) {
          console.log('Sample images already in gallery');
        } else if (result.error) {
          console.warn('Could not copy sample images:', result.error);
        }
      } catch (error) {
        console.error('Error initializing sample images:', error);
        // Don't block app launch if this fails
      }
    };
    initializeServices();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <AppContent />
          </SubscriptionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
