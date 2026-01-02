import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import colors from '../colors';

const SignInButton = ({ onPress, disabled = false, isLoading = false, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[signInButtonStyles.button, disabled && signInButtonStyles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.text.white} />
      ) : (
        <Text style={[signInButtonStyles.buttonText, textStyle]}>Sign In</Text>
      )}
    </TouchableOpacity>
  );
};

const signInButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 345,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 20,
    // fontWeight: 'bold',
  },
});

export default SignInButton;

