/**
 * Development Restart Button
 * Only visible in development mode
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { restartApplication } from '../utils/restartApp';
import colors from '../colors';

const DevRestartButton = () => {
  const insets = useSafeAreaInsets();

  // Only show in development mode
  if (!__DEV__) {
    return null;
  }

  const handleRestart = async () => {
    await restartApplication();
  };

  return (
    <TouchableOpacity
      style={[styles.button, { top: insets.top + 10 }]}
      onPress={handleRestart}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>🔄 Restart</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: 10,
    zIndex: 9999,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DevRestartButton;

