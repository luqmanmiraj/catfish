import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../colors';

/**
 * LabelNoteModal Component
 * Modal for adding/editing label and note for a scan
 */
export default function LabelNoteModal({ visible, onSave, onCancel, initialLabel = '', initialNote = '' }) {
  const insets = useSafeAreaInsets();
  const [label, setLabel] = useState(initialLabel);
  const [note, setNote] = useState(initialNote);

  // Update state when initial values change (for editing)
  useEffect(() => {
    setLabel(initialLabel);
    setNote(initialNote);
  }, [initialLabel, initialNote, visible]);

  const handleSave = () => {
    if (onSave) {
      onSave(label.trim(), note.trim());
    }
  };

  const handleCancel = () => {
    // Reset to initial values
    setLabel(initialLabel);
    setNote(initialNote);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Save to History</Text>
            <Text style={styles.subtitle}>Add a name and note for this scan (optional)</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Label</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter a name for this scan"
                placeholderTextColor={colors.text.secondary}
                value={label}
                onChangeText={setLabel}
                maxLength={100}
                autoFocus={!initialLabel}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Note</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Add a note..."
                placeholderTextColor={colors.text.secondary}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.white,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

