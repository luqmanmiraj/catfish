import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import colors from '../colors';

const ContinueAsGuestButton = ({ onPress, disabled = false, isLoading = false, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[continueAsGuestButtonStyles.button, disabled && continueAsGuestButtonStyles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.text.white} style={{ marginRight: 8 }} />
          <Text style={[continueAsGuestButtonStyles.buttonText, textStyle]}>Creating Guest Account...</Text>
        </View>
      ) : (
        <Text style={[continueAsGuestButtonStyles.buttonText, textStyle]}>Continue as Guest</Text>
      )}
    </TouchableOpacity>
  );
};

const continueAsGuestButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.background.dark,
    borderWidth: 0.1,
    borderColor: colors.text.white,
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

export default ContinueAsGuestButton;

