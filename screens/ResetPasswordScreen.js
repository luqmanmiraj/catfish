import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import colors from '../colors';
import { resetPasswordStyles } from '../styles';
import PasswordInput from '../components/PasswordInput';

const ResetPasswordScreen = ({ email, onBack, onPasswordReset }) => {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const passwordInputRef = useRef(null);
  const { confirmForgotPassword, forgotPassword } = useAuth();

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
      
      // Focus on next empty input or password field
      const nextIndex = Math.min(index + pastedCode.length, 5);
      if (nextIndex === 6 && passwordInputRef.current) {
        passwordInputRef.current.focus();
      } else if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input or password field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      // Last code digit entered, focus password field
      passwordInputRef.current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      showAlert({ title: 'Error', message: 'Please enter the complete 6-digit verification code' });
      return;
    }

    if (!newPassword.trim()) {
      showAlert({ title: 'Error', message: 'Please enter a new password' });
      return;
    }

    if (newPassword.length < 8) {
      showAlert({ title: 'Error', message: 'Password must be at least 8 characters long' });
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert({ title: 'Error', message: 'Passwords do not match' });
      return;
    }

    // Check password requirements
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      showAlert({
        title: 'Invalid Password',
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmForgotPassword(email, verificationCode, newPassword);
      
      if (result.success) {
        showAlert({ title: 'Success', message: 'Your password has been reset successfully! You can now sign in with your new password.', buttons: [
          {
            text: 'OK',
            onPress: () => {
              if (onPasswordReset) {
                onPasswordReset();
              } else if (onBack) {
                onBack();
              }
            },
          },
        ] });
      } else {
        showAlert({ title: 'Reset Failed', message: getFriendlyErrorMessage(result.error, 'auth') });
      }
    } catch (error) {
      showAlert({ title: 'Error', message: getFriendlyErrorMessage(error, 'auth') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        showAlert({ title: 'Code Sent', message: 'A new password reset code has been sent to your email.' });
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        showAlert({ title: 'Error', message: getFriendlyErrorMessage(result.error, 'auth') });
      }
    } catch (error) {
      showAlert({ title: 'Error', message: getFriendlyErrorMessage(error, 'auth') });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={resetPasswordStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[resetPasswordStyles.scrollContent, { paddingBottom: Math.max(insets.bottom, 40) }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={resetPasswordStyles.header}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={resetPasswordStyles.closeButton}>
              <Text style={resetPasswordStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          <Text style={resetPasswordStyles.title}>Reset Password</Text>
          <Text style={resetPasswordStyles.subtitle}>
            Enter the verification code sent to{'\n'}
            <Text style={resetPasswordStyles.emailText}>{email}</Text>
            {'\n'}and your new password.
          </Text>
        </View>

        {/* Form */}
        <View style={resetPasswordStyles.form}>
          {/* Code Input */}
          <View style={resetPasswordStyles.codeContainer}>
            <Text style={resetPasswordStyles.label}>Verification Code</Text>
            <View style={resetPasswordStyles.codeInputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={resetPasswordStyles.codeInput}
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
          </View>

          {/* Password Inputs */}
          <View style={resetPasswordStyles.inputContainer}>
            <Text style={resetPasswordStyles.label}>New Password</Text>
            <PasswordInput
              placeholder="Enter new password"
              placeholderTextColor={colors.text.secondary}
              value={newPassword}
              onChangeText={setNewPassword}
              autoComplete="password-new"
              textContentType="newPassword"
              passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
              editable={!isLoading}
            />
            <Text style={resetPasswordStyles.helperText}>
              Must be at least 8 characters with uppercase, lowercase, and numbers
            </Text>
          </View>

          <View style={resetPasswordStyles.inputContainer}>
            <Text style={resetPasswordStyles.label}>Confirm Password</Text>
            <PasswordInput
              placeholder="Confirm new password"
              placeholderTextColor={colors.text.secondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoComplete="password-new"
              textContentType="newPassword"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[resetPasswordStyles.resetButton, isLoading && resetPasswordStyles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.white} />
            ) : (
              <Text style={resetPasswordStyles.resetButtonText}>Reset Password</Text>
            )}
          </TouchableOpacity>

          <View style={resetPasswordStyles.resendContainer}>
            <Text style={resetPasswordStyles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={isResending || isLoading}
            >
              <Text style={resetPasswordStyles.resendLink}>
                {isResending ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

