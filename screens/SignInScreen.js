import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import colors from '../colors';
import { signInStyles } from '../styles';
import PasswordInput from '../components/PasswordInput';

const SignInScreen = ({ onSignUp, onForgotPassword, onClose, onSignInSuccess }) => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn(email.trim(), password);
      
      if (result.success) {
        // Sign in successful
        if (onSignInSuccess) {
          // Use the success callback to handle navigation
          await onSignInSuccess();
        } else if (onClose) {
          // Fallback to close if no success callback
          onClose();
        }
      } else {
        const errorMsg = result.error || '';
        // Show user-friendly message for common auth errors
        if (errorMsg.toLowerCase().includes('incorrect') || errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('not authorized')) {
          Alert.alert('Sign In Failed', 'Incorrect email or password. Please try again.');
        } else if (errorMsg.toLowerCase().includes('user does not exist') || errorMsg.toLowerCase().includes('not found')) {
          Alert.alert('Sign In Failed', 'No account found with this email. Please sign up first.');
        } else {
          Alert.alert('Sign In Failed', errorMsg || 'Please check your credentials and try again.');
        }
      }
    } catch (error) {
      const errorMsg = error.message || '';
      if (errorMsg.toLowerCase().includes('incorrect') || errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('not authorized')) {
        Alert.alert('Sign In Failed', 'Incorrect email or password. Please try again.');
      } else if (errorMsg.toLowerCase().includes('network') || errorMsg.toLowerCase().includes('fetch')) {
        Alert.alert('Connection Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Sign In Failed', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={signInStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[signInStyles.scrollContent, { paddingBottom: Math.max(insets.bottom, 40) }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={signInStyles.header}>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={signInStyles.closeButton}>
              <Text style={signInStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <Text style={signInStyles.title}>Sign In</Text>
          <Text style={signInStyles.subtitle}>Welcome back to Catfish</Text>
        </View>

        {/* Form */}
        <View style={signInStyles.form}>
          <View style={signInStyles.inputContainer}>
            <Text style={signInStyles.label}>Email</Text>
            <TextInput
              style={signInStyles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.secondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              editable={!isLoading}
            />
          </View>

          <View style={signInStyles.inputContainer}>
            <Text style={signInStyles.label}>Password</Text>
            <PasswordInput
              placeholder="Enter your password"
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              autoComplete="password"
              textContentType="password"
              passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={signInStyles.forgotPasswordButton}
            onPress={onForgotPassword}
            disabled={isLoading}
          >
            <Text style={signInStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[signInStyles.signInButton, isLoading && signInStyles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={signInStyles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={signInStyles.footer}>
          <Text style={signInStyles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSignUp} disabled={isLoading}>
            <Text style={signInStyles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

