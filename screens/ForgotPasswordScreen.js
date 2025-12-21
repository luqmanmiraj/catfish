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
import { forgotPasswordStyles } from '../styles';

const ForgotPasswordScreen = ({ onBack, onCodeSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email.trim());
      
      if (result.success) {
        // Navigate to reset password screen
        if (onCodeSent) {
          onCodeSent(email.trim());
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to send password reset code. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={forgotPasswordStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={forgotPasswordStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={forgotPasswordStyles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={forgotPasswordStyles.closeButton}>
              <Text style={forgotPasswordStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <Text style={forgotPasswordStyles.title}>Forgot Password?</Text>
          <Text style={forgotPasswordStyles.subtitle}>
            Enter your email address and we'll send you a code to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={forgotPasswordStyles.form}>
          <View style={forgotPasswordStyles.inputContainer}>
            <Text style={forgotPasswordStyles.label}>Email</Text>
            <TextInput
              style={forgotPasswordStyles.input}
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

          <TouchableOpacity
            style={[forgotPasswordStyles.sendButton, isLoading && forgotPasswordStyles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={forgotPasswordStyles.sendButtonText}>Send Reset Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

