import React from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CameraIcon from '../components/CameraIcon';
import colors from '../colors';
import { permissionStyles } from '../styles';

const PermissionsScreen = ({ onSignIn, onSignUp, onContinueAsGuest, isCreatingGuest = false }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={permissionStyles.container}>
      <View style={permissionStyles.contentContainer}>
        {/* Camera Icon */}
        <View style={permissionStyles.iconContainer}>
          <CameraIcon />
        </View>

        {/* Text Content */}
        <View style={permissionStyles.textContainer}>
          <Text style={permissionStyles.heading}>
            We need access to help you scan
          </Text>
          <Text style={permissionStyles.description}>
            Camera access to take photos and gallery access to upload existing images for analysis.
          </Text>
        </View>

        {/* Buttons - Right after text */}
        <View style={[permissionStyles.buttonContainer, { 
          paddingTop: 32, 
          paddingBottom: Math.max(insets.bottom, 20),
          paddingHorizontal: 0,
          width: '100%',
          alignItems: 'center'
        }]}>
          <TouchableOpacity
            style={permissionStyles.signInButton}
            onPress={onSignUp}
            activeOpacity={0.8}
          >
            <Text style={permissionStyles.signInButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={permissionStyles.signInButton}
            onPress={onSignIn}
            activeOpacity={0.8}
          >
            <Text style={permissionStyles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              permissionStyles.guestButton,
              isCreatingGuest && permissionStyles.guestButtonDisabled
            ]}
            onPress={onContinueAsGuest}
            activeOpacity={0.8}
            disabled={isCreatingGuest}
          >
            {isCreatingGuest ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color={colors.text.white} style={{ marginRight: 8 }} />
                <Text style={permissionStyles.guestButtonText}>Creating Guest Account...</Text>
              </View>
            ) : (
              <Text style={permissionStyles.guestButtonText}>Continue as Guest</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PermissionsScreen;

