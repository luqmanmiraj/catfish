import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import * as RevenueCatService from './services/revenueCatService';
import CatfishLogo from './components/CatfishLogo';
import PermissionsScreen from './screens/PermissionsScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
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
import styles from './styles';
import colors from './colors';

function AppContent() {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading, signOut, user, guestSignUp } = useAuth();
  const { 
    purchaseSubscription, 
    getAvailablePackages, 
    refreshSubscriptionStatus,
    presentPaywall,
    presentCustomerCenter,
    restorePurchases,
    isPro,
  } = useSubscription();
  const [showPermissions, setShowPermissions] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
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
   * Show profile page after successful sign in
   */
  const handleSignInSuccess = async () => {
    // Close sign-in screen
    setShowSignIn(false);
    setShowSignUp(false);
    setShowVerification(false);
    setShowPermissions(false);

    // Show profile screen after successful sign in
    setShowProfileScreen(true);
    setShowScanScreen(false);
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

  const handleTapToScan = () => {
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

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    console.log('Analysis complete - showing results screen');
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
  };

  const handleShare = () => {
    // Handle share
    console.log('Share pressed');
  };

  const handleSave = () => {
    // Handle save
    console.log('Save pressed');
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

    if (showSignUp) {
      return (
        <SignUpScreen
          onSignIn={handleBackToSignIn}
          onClose={handleCloseAuth}
          onVerificationSent={handleVerificationSent}
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
        <ResultsScreen
          imageUri={selectedImageUri}
          analysisResult={analysisResult}
          onScanAgain={handleScanAgain}
          onShare={handleShare}
          onSave={handleSave}
        />
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
          isPro={isPro}
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
        />
      );
    }

    if (showPermissions) {
      return (
        <>
          <PermissionsScreen
            onSignIn={handleSignIn}
            onContinueAsGuest={handleContinueAsGuest}
            isCreatingGuest={isCreatingGuest}
          />
          <StatusBar style="light" />
        </>
      );
    }

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
        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 30) }]}>
          <TouchableOpacity 
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
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
