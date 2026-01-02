import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';
import colors from '../colors';
import { imagePreviewStyles } from '../styles';

const ImagePreviewScreen = ({ imageUri, onScan, onClose }) => {
  const insets = useSafeAreaInsets();
  const [isCropActive, setIsCropActive] = useState(false);
  const [croppedImageUri, setCroppedImageUri] = useState(null);

  const handleCropToggle = async () => {
    if (!isCropActive) {
      // Activate crop tool - open image picker with crop enabled
      // Note: expo-image-picker requires selecting an image to crop it
      // The user will need to select the same image (or a different one) to crop
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: false,
        });

        if (!result.canceled && result.assets[0]) {
          // User cropped an image (could be the same or different)
          setCroppedImageUri(result.assets[0].uri);
          setIsCropActive(true);
        }
        // If user cancelled, do nothing - crop tool remains inactive
      } catch (error) {
        console.error('Error opening crop tool:', error);
        Alert.alert('Error', 'Failed to open crop tool');
      }
    } else {
      // Deactivate crop tool - revert to original image
      setCroppedImageUri(null);
      setIsCropActive(false);
    }
  };

  const handleScan = () => {
    // Use cropped image if available, otherwise use original
    const imageToScan = croppedImageUri || imageUri;
    if (onScan) {
      onScan(imageToScan);
    }
  };

  const displayImageUri = croppedImageUri || imageUri;

  return (
    <View style={[imagePreviewStyles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={imagePreviewStyles.header}>
        <TouchableOpacity onPress={onClose} style={imagePreviewStyles.closeButton}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M18 6L6 18M6 6L18 18"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={imagePreviewStyles.headerTitle}>Preview Image</Text>
        <View style={{ width: 24 }} /> {/* Spacer for centering */}
      </View>

      {/* Image Preview */}
      <View style={imagePreviewStyles.imageContainer}>
        <Image
          source={{ uri: displayImageUri }}
          style={imagePreviewStyles.image}
          resizeMode="contain"
        />
      </View>

      {/* Action Buttons */}
      <View style={[imagePreviewStyles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* Crop Toggle Button */}
        <TouchableOpacity
          style={[imagePreviewStyles.cropButton, isCropActive && imagePreviewStyles.cropButtonActive]}
          onPress={handleCropToggle}
          activeOpacity={0.8}
        >
          {isCropActive ? (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6L18 18"
                stroke={colors.text.white}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ) : (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 3H21V21H3V3Z"
                stroke={colors.text.white}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9 9H15V15H9V9Z"
                stroke={colors.text.white}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
          <Text style={imagePreviewStyles.cropButtonText}>
            {isCropActive ? 'Close Crop' : 'Crop'}
          </Text>
        </TouchableOpacity>

        {/* Scan Button */}
        <TouchableOpacity
          style={imagePreviewStyles.scanButton}
          onPress={handleScan}
          activeOpacity={0.8}
        >
          <Text style={imagePreviewStyles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImagePreviewScreen;

