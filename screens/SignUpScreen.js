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
import { useAuth } from '../context/AuthContext';
import colors from '../colors';
import { signUpStyles } from '../styles';

const SignUpScreen = ({ onSignIn, onClose, onVerificationSent }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters with uppercase, lowercase, and numbers
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /[0-9]/.test(password);
  };

  const handleSignUp = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Password Requirements',
        'Password must be at least 8 characters long and contain:\n• At least one uppercase letter\n• At least one lowercase letter\n• At least one number'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp(email.trim(), password, name.trim() || null);
      
      if (result.success) {
        Alert.alert(
          'Verification Email Sent',
          'Please check your email for a verification code to complete your registration.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onVerificationSent) {
                  onVerificationSent(email.trim());
                } else if (onClose) {
                  onClose();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Sign Up Failed', result.error || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={signUpStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={signUpStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={signUpStyles.header}>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={signUpStyles.closeButton}>
              <Text style={signUpStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <Text style={signUpStyles.title}>Create Account</Text>
          <Text style={signUpStyles.subtitle}>Join Catfish to get started</Text>
        </View>

        {/* Form */}
        <View style={signUpStyles.form}>
          <View style={signUpStyles.inputContainer}>
            <Text style={signUpStyles.label}>Name (Optional)</Text>
            <TextInput
              style={signUpStyles.input}
              placeholder="Enter your name"
              placeholderTextColor={colors.text.secondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View style={signUpStyles.inputContainer}>
            <Text style={signUpStyles.label}>Email</Text>
            <TextInput
              style={signUpStyles.input}
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

          <View style={signUpStyles.inputContainer}>
            <Text style={signUpStyles.label}>Password</Text>
            <TextInput
              style={signUpStyles.input}
              placeholder="Create a password"
              placeholderTextColor={colors.text.secondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
              editable={!isLoading}
            />
            <Text style={signUpStyles.helperText}>
              Must be 8+ characters with uppercase, lowercase, and numbers
            </Text>
          </View>

          <View style={signUpStyles.inputContainer}>
            <Text style={signUpStyles.label}>Confirm Password</Text>
            <TextInput
              style={signUpStyles.input}
              placeholder="Confirm your password"
              placeholderTextColor={colors.text.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              textContentType="newPassword"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[signUpStyles.signUpButton, isLoading && signUpStyles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={signUpStyles.signUpButtonText}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign In Link */}
        <View style={signUpStyles.footer}>
          <Text style={signUpStyles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignIn} disabled={isLoading}>
            <Text style={signUpStyles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

