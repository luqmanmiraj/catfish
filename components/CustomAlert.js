import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';
import colors from '../colors';

const CustomAlert = ({ visible, title, message, buttons, onDismiss }) => {
  const resolvedButtons = buttons && buttons.length > 0
    ? buttons
    : [{ text: 'OK', style: 'default' }];

  const handlePress = (button) => {
    onDismiss();
    if (button.onPress) {
      button.onPress();
    }
  };

  const getButtonStyle = (style) => {
    switch (style) {
      case 'destructive':
        return styles.destructiveButton;
      case 'cancel':
        return styles.cancelButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (style) => {
    switch (style) {
      case 'destructive':
        return styles.destructiveButtonText;
      case 'cancel':
        return styles.cancelButtonText;
      default:
        return styles.defaultButtonText;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={resolvedButtons.length === 2 ? styles.buttonRow : styles.buttonColumn}>
            {resolvedButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  getButtonStyle(button.style),
                  resolvedButtons.length === 2 && styles.buttonRowItem,
                ]}
                onPress={() => handlePress(button)}
                activeOpacity={0.7}
              >
                <Text style={getButtonTextStyle(button.style)}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(25, 45, 65, 0.97)',
    borderRadius: 16,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  buttonColumn: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonRowItem: {
    flex: 1,
  },
  defaultButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveButton: {
    backgroundColor: colors.accent.red,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
