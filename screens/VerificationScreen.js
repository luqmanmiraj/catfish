import React, { useState, useRef } from 'react';
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
import { verificationStyles } from '../styles';

const VerificationScreen = ({ email, onVerified, onClose, onResendCode }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const { confirmSignUp, resendConfirmationCode } = useAuth();

  const handleCodeChange = (value, index) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      
      // Focus on next empty input or last input
      const nextIndex = Math.min(index + pastedCode.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit verification code');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmSignUp(email, verificationCode);
      
      if (result.success) {
        Alert.alert('Success', 'Your email has been verified! You can now sign in.', [
          {
            text: 'OK',
            onPress: () => {
              if (onVerified) {
                onVerified();
              } else if (onClose) {
                onClose();
              }
            },
          },
        ]);
      } else {
        Alert.alert('Verification Failed', result.error || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const result = await resendConfirmationCode(email);
      
      if (result.success) {
        Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Alert.alert('Error', result.error || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={verificationStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={verificationStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={verificationStyles.header}>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={verificationStyles.closeButton}>
              <Text style={verificationStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <Text style={verificationStyles.title}>Verify Email</Text>
          <Text style={verificationStyles.subtitle}>
            We've sent a verification code to{'\n'}
            <Text style={verificationStyles.emailText}>{email}</Text>
          </Text>
        </View>

        {/* Code Input */}
        <View style={verificationStyles.form}>
          <View style={verificationStyles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={verificationStyles.codeInput}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[verificationStyles.verifyButton, isLoading && verificationStyles.buttonDisabled]}
            onPress={handleVerify}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={verificationStyles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View style={verificationStyles.resendContainer}>
            <Text style={verificationStyles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={isResending || isLoading}
            >
              <Text style={verificationStyles.resendLink}>
                {isResending ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerificationScreen;

