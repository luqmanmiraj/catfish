import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, Alert, ScrollView, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { cameraScanStyles } from '../styles';
import colors from '../colors';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';

const CameraScanScreen = ({ onClose, onImageSelected, onUpgrade }) => {
  const { scansRemaining } = useSubscription();
  const { isAuthenticated, user } = useAuth();
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (onImageSelected) {
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  // Get user email or name for display
  const userDisplayName = user?.email || user?.name;
  
  // Determine what to show in the header
  const getHeaderText = () => {
    if (isAuthenticated && userDisplayName) {
      // Show logged-in status with scan count
      const scanText = scansRemaining === Infinity ? 'Unlimited' : `${scansRemaining} scans`;
      return `${userDisplayName} • ${scanText}`;
    } else if (isAuthenticated) {
      // Just show logged-in status with scan count
      const scanText = scansRemaining === Infinity ? 'Unlimited scans' : `${scansRemaining} scans remaining`;
      return `Logged in • ${scanText}`;
    } else {
      // Not logged in, show scan count
      return scansRemaining === Infinity ? 'Unlimited scans' : `${scansRemaining} scans remaining`;
    }
  };

  return (
    <View style={cameraScanStyles.container}>
      {/* Header Section */}
      <View style={cameraScanStyles.header}>
        <View style={cameraScanStyles.headerLeft}>
          <Text style={cameraScanStyles.appName}>CATFISH CRASHER</Text>
          <Text style={cameraScanStyles.scansRemaining}>{getHeaderText()}</Text>
        </View>
        <TouchableOpacity
          style={cameraScanStyles.upgradeButton}
          onPress={onUpgrade || onClose}
          activeOpacity={0.8}
        >
          <Text style={cameraScanStyles.upgradeIcon}>👑</Text>
          <Text style={cameraScanStyles.upgradeText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      {/* Upper Section with Gradient Background and Concentric Circles */}
      <View style={cameraScanStyles.upperSection}>
        {/* Gradient Background Layers */}
        <View style={cameraScanStyles.gradientLayer1} />
        <View style={cameraScanStyles.gradientLayer2} />
        <View style={cameraScanStyles.gradientLayer3} />
        
        {/* Top Most Outer Circle */}
        <View style={cameraScanStyles.topMostCircleContainer}>
          <Svg width="351" height="351" viewBox="0 0 351 351" style={cameraScanStyles.topMostCircleSvg}>
            <Circle
              cx="175.5"
              cy="175.5"
              r="175.5"
              fill="#0AB4E0"
              opacity="0.05"
            />
          </Svg>
        </View>

        {/* Outer Concentric Circle */}
        <View style={cameraScanStyles.outerCircleContainer}>
          <Svg width="272" height="272" viewBox="0 0 272 272" style={cameraScanStyles.outerCircleSvg}>
            <G opacity="0.133592">
              <Path
                d="M0 135.872C0 60.8321 60.8321 0 135.872 0C210.913 0 271.745 60.8321 271.745 135.872C271.745 210.913 210.913 271.745 135.872 271.745C60.8321 271.745 0 210.913 0 135.872Z"
                fill="#0AB4E0"
              />
            </G>
          </Svg>
        </View>

        {/* Middle Concentric Circle */}
        <View style={[cameraScanStyles.circlesContainer, { marginBottom: 20 }]}>
          <Svg width="192" height="192" viewBox="0 0 192 192" style={cameraScanStyles.circleSvg}>
            <G opacity="0.216925">
              <Path
                d="M0 95.8746C0 42.9245 42.9245 0 95.8746 0C148.825 0 191.749 42.9245 191.749 95.8746C191.749 148.825 148.825 191.749 95.8746 191.749C42.9245 191.749 0 148.825 0 95.8746Z"
                fill="#0AB4E0"
              />
            </G>
          </Svg>
        </View>

        {/* Camera Icon in Center */}
        <View style={[cameraScanStyles.cameraIconContainer]}>
          <Svg width="184" height="184" viewBox="0 0 184 184" fill="none">
            <Defs>
              <LinearGradient id="paint0_linear_30_396" x1="12" y1="2" x2="171.991" y2="161.991" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#0AB4E0" />
                <Stop offset="1" stopColor="#0AB4E0" stopOpacity="0.8" />
              </LinearGradient>
            </Defs>
            <G>
              <Path
                d="M12 81.9955C12 37.8152 47.8152 2 91.9955 2C136.176 2 171.991 37.8152 171.991 81.9955C171.991 126.176 136.176 161.991 91.9955 161.991C47.8152 161.991 12 126.176 12 81.9955Z"
                fill="url(#paint0_linear_30_396)"
                shapeRendering="crispEdges"
              />
              <Path
                d="M104.183 78.89C103.607 78.89 103.12 78.6908 102.722 78.2924C102.324 77.8829 102.124 77.3959 102.124 76.8315C102.124 76.2559 102.324 75.769 102.722 75.3705C103.12 74.9721 103.607 74.7729 104.183 74.7729C104.747 74.7729 105.229 74.9721 105.627 75.3705C106.037 75.769 106.242 76.2559 106.242 76.8315C106.242 77.3959 106.037 77.8829 105.627 78.2924C105.229 78.6908 104.747 78.89 104.183 78.89ZM76.4418 97.8158C74.7041 97.8158 73.3982 97.3842 72.5238 96.5209C71.6605 95.6687 71.2289 94.3848 71.2289 92.6693V75.2875C71.2289 73.5831 71.6605 72.3048 72.5238 71.4525C73.3982 70.5893 74.7041 70.1576 76.4418 70.1576H81.0736C81.7266 70.1576 82.208 70.0801 82.5179 69.9252C82.8278 69.7592 83.1654 69.4714 83.5306 69.0619L84.8588 67.5678C85.2793 67.114 85.7331 66.7654 86.2201 66.5219C86.7181 66.2784 87.3933 66.1566 88.2455 66.1566H94.8695C95.7217 66.1566 96.3969 66.2784 96.8949 66.5219C97.3929 66.7654 97.8467 67.114 98.2562 67.5678L99.5844 69.0619C99.8389 69.3386 100.066 69.56 100.265 69.726C100.475 69.8809 100.713 69.9916 100.979 70.058C101.245 70.1244 101.599 70.1576 102.041 70.1576H106.789C108.516 70.1576 109.816 70.5893 110.691 71.4525C111.565 72.3048 112.002 73.5831 112.002 75.2875V92.6693C112.002 94.3848 111.565 95.6687 110.691 96.5209C109.816 97.3842 108.516 97.8158 106.789 97.8158H76.4418ZM76.475 95.143H106.74C107.559 95.143 108.195 94.9272 108.649 94.4955C109.103 94.0528 109.329 93.3998 109.329 92.5365V75.4369C109.329 74.5736 109.103 73.9262 108.649 73.4945C108.195 73.0518 107.559 72.8305 106.74 72.8305H101.377C100.625 72.8305 100.016 72.7475 99.5511 72.5815C99.0974 72.4044 98.6602 72.0834 98.2396 71.6186L96.9447 70.1576C96.4688 69.6264 96.0482 69.2722 95.683 69.0951C95.3177 68.918 94.7699 68.8295 94.0394 68.8295H89.0756C88.3451 68.8295 87.7972 68.918 87.432 69.0951C87.0668 69.2722 86.6462 69.6264 86.1703 70.1576L84.8754 71.6186C84.4548 72.0834 84.0121 72.4044 83.5472 72.5815C83.0935 72.7475 82.4903 72.8305 81.7377 72.8305H76.475C75.656 72.8305 75.0196 73.0518 74.5658 73.4945C74.1231 73.9262 73.9017 74.5736 73.9017 75.4369V92.5365C73.9017 93.3998 74.1231 94.0528 74.5658 94.4955C75.0196 94.9272 75.656 95.143 76.475 95.143ZM91.6156 92.7523C90.3539 92.7523 89.1752 92.5199 88.0795 92.0551C86.9838 91.5902 86.0209 90.9428 85.1908 90.1127C84.3718 89.2826 83.7243 88.3197 83.2484 87.224C82.7836 86.1283 82.5511 84.9441 82.5511 83.6713C82.5511 82.4096 82.7836 81.2309 83.2484 80.1352C83.7243 79.0395 84.3718 78.0766 85.1908 77.2465C86.0209 76.4164 86.9838 75.769 88.0795 75.3041C89.1752 74.8393 90.3539 74.6068 91.6156 74.6068C93.2868 74.6068 94.8086 75.0108 96.181 75.8188C97.5534 76.6267 98.6436 77.7169 99.4515 79.0893C100.259 80.4617 100.663 81.989 100.663 83.6713C100.663 84.9441 100.431 86.1283 99.9662 87.224C99.5013 88.3197 98.8539 89.2826 98.0238 90.1127C97.1937 90.9428 96.2308 91.5902 95.1351 92.0551C94.0394 92.5199 92.8663 92.7523 91.6156 92.7523ZM91.6156 90.2289C92.822 90.2289 93.9177 89.9356 94.9027 89.349C95.8988 88.7624 96.6901 87.9766 97.2767 86.9916C97.8633 85.9955 98.1566 84.8887 98.1566 83.6713C98.1566 82.4649 97.8633 81.3692 97.2767 80.3842C96.6901 79.3881 95.8988 78.5968 94.9027 78.0102C93.9177 77.4125 92.822 77.1137 91.6156 77.1137C90.4092 77.1137 89.308 77.4125 88.3119 78.0102C87.3269 78.5968 86.5355 79.3881 85.9379 80.3842C85.3513 81.3692 85.058 82.4649 85.058 83.6713C85.058 84.8887 85.3513 85.9955 85.9379 86.9916C86.5355 87.9766 87.3269 88.7624 88.3119 89.349C89.308 89.9356 90.4092 90.2289 91.6156 90.2289Z"
                fill="white"
              />
            </G>
          </Svg>
        </View>
      </View>

      {/* Overlay */}
      <TouchableOpacity
        style={cameraScanStyles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Bottom Section - Dialog */}
      <Animated.View 
        style={[
          cameraScanStyles.bottomSection,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView 
          contentContainerStyle={cameraScanStyles.bottomScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={cameraScanStyles.dialogTitle}>Choose Image</Text>
          <Text style={cameraScanStyles.dialogDescription}>
            Upload Image of a Potential Date
          </Text>

          {/* Take Photo Button - Disabled/Hidden for now */}
          {/* <TouchableOpacity
            style={cameraScanStyles.takePhotoButton}
            onPress={openCamera}
            activeOpacity={0.8}
          >
            <Svg width="32" height="32" viewBox="60 45 55 40" fill="none" style={cameraScanStyles.buttonIcon}>
              <Path
                d="M104.183 78.89C103.607 78.89 103.12 78.6908 102.722 78.2924C102.324 77.8829 102.124 77.3959 102.124 76.8315C102.124 76.2559 102.324 75.769 102.722 75.3705C103.12 74.9721 103.607 74.7729 104.183 74.7729C104.747 74.7729 105.229 74.9721 105.627 75.3705C106.037 75.769 106.242 76.2559 106.242 76.8315C106.242 77.3959 106.037 77.8829 105.627 78.2924C105.229 78.6908 104.747 78.89 104.183 78.89ZM76.4418 97.8158C74.7041 97.8158 73.3982 97.3842 72.5238 96.5209C71.6605 95.6687 71.2289 94.3848 71.2289 92.6693V75.2875C71.2289 73.5831 71.6605 72.3048 72.5238 71.4525C73.3982 70.5893 74.7041 70.1576 76.4418 70.1576H81.0736C81.7266 70.1576 82.208 70.0801 82.5179 69.9252C82.8278 69.7592 83.1654 69.4714 83.5306 69.0619L84.8588 67.5678C85.2793 67.114 85.7331 66.7654 86.2201 66.5219C86.7181 66.2784 87.3933 66.1566 88.2455 66.1566H94.8695C95.7217 66.1566 96.3969 66.2784 96.8949 66.5219C97.3929 66.7654 97.8467 67.114 98.2562 67.5678L99.5844 69.0619C99.8389 69.3386 100.066 69.56 100.265 69.726C100.475 69.8809 100.713 69.9916 100.979 70.058C101.245 70.1244 101.599 70.1576 102.041 70.1576H106.789C108.516 70.1576 109.816 70.5893 110.691 71.4525C111.565 72.3048 112.002 73.5831 112.002 75.2875V92.6693C112.002 94.3848 111.565 95.6687 110.691 96.5209C109.816 97.3842 108.516 97.8158 106.789 97.8158H76.4418ZM76.475 95.143H106.74C107.559 95.143 108.195 94.9272 108.649 94.4955C109.103 94.0528 109.329 93.3998 109.329 92.5365V75.4369C109.329 74.5736 109.103 73.9262 108.649 73.4945C108.195 73.0518 107.559 72.8305 106.74 72.8305H101.377C100.625 72.8305 100.016 72.7475 99.5511 72.5815C99.0974 72.4044 98.6602 72.0834 98.2396 71.6186L96.9447 70.1576C96.4688 69.6264 96.0482 69.2722 95.683 69.0951C95.3177 68.918 94.7699 68.8295 94.0394 68.8295H89.0756C88.3451 68.8295 87.7972 68.918 87.432 69.0951C87.0668 69.2722 86.6462 69.6264 86.1703 70.1576L84.8754 71.6186C84.4548 72.0834 84.0121 72.4044 83.5472 72.5815C83.0935 72.7475 82.4903 72.8305 81.7377 72.8305H76.475C75.656 72.8305 75.0196 73.0518 74.5658 73.4945C74.1231 73.9262 73.9017 74.5736 73.9017 75.4369V92.5365C73.9017 93.3998 74.1231 94.0528 74.5658 94.4955C75.0196 94.9272 75.656 95.143 76.475 95.143ZM91.6156 92.7523C90.3539 92.7523 89.1752 92.5199 88.0795 92.0551C86.9838 91.5902 86.0209 90.9428 85.1908 90.1127C84.3718 89.2826 83.7243 88.3197 83.2484 87.224C82.7836 86.1283 82.5511 84.9441 82.5511 83.6713C82.5511 82.4096 82.7836 81.2309 83.2484 80.1352C83.7243 79.0395 84.3718 78.0766 85.1908 77.2465C86.0209 76.4164 86.9838 75.769 88.0795 75.3041C89.1752 74.8393 90.3539 74.6068 91.6156 74.6068C93.2868 74.6068 94.8086 75.0108 96.181 75.8188C97.5534 76.6267 98.6436 77.7169 99.4515 79.0893C100.259 80.4617 100.663 81.989 100.663 83.6713C100.663 84.9441 100.431 86.1283 99.9662 87.224C99.5013 88.3197 98.8539 89.2826 98.0238 90.1127C97.1937 90.9428 96.2308 91.5902 95.1351 92.0551C94.0394 92.5199 92.8663 92.7523 91.6156 92.7523ZM91.6156 90.2289C92.822 90.2289 93.9177 89.9356 94.9027 89.349C95.8988 88.7624 96.6901 87.9766 97.2767 86.9916C97.8633 85.9955 98.1566 84.8887 98.1566 83.6713C98.1566 82.4649 97.8633 81.3692 97.2767 80.3842C96.6901 79.3881 95.8988 78.5968 94.9027 78.0102C93.9177 77.4125 92.822 77.1137 91.6156 77.1137C90.4092 77.1137 89.308 77.4125 88.3119 78.0102C87.3269 78.5968 86.5355 79.3881 85.9379 80.3842C85.3513 81.3692 85.058 82.4649 85.058 83.6713C85.058 84.8887 85.3513 85.9955 85.9379 86.9916C86.5355 87.9766 87.3269 88.7624 88.3119 89.349C89.308 89.9356 90.4092 90.2289 91.6156 90.2289Z"
                fill="white"
              />
            </Svg>
            <Text style={cameraScanStyles.takePhotoText}>Take Photo</Text>
          </TouchableOpacity> */}

          {/* Upload from Gallery Button */}
          <TouchableOpacity
            style={cameraScanStyles.uploadGalleryButton}
            onPress={openGallery}
            activeOpacity={0.8}
          >
            <Svg width="24" height="24" viewBox="0 0 20 16" fill="none" style={cameraScanStyles.buttonIcon}>
              <Path
                d="M2.54834 14.7007C1.92855 14.7007 1.4637 14.5098 1.15381 14.1279C0.843913 13.7516 0.67513 13.1872 0.647461 12.4346L3.81006 9.5791C3.98161 9.41862 4.15592 9.30241 4.33301 9.23047C4.51009 9.15299 4.69271 9.11426 4.88086 9.11426C5.07454 9.11426 5.26546 9.15576 5.45361 9.23877C5.6473 9.31624 5.82992 9.43245 6.00146 9.5874L7.53711 10.9736L11.2891 7.62012C11.4827 7.4541 11.682 7.32959 11.8867 7.24658C12.0915 7.16357 12.3073 7.12207 12.5342 7.12207C12.7611 7.12207 12.9797 7.16634 13.1899 7.25488C13.4058 7.33789 13.605 7.46517 13.7876 7.63672L18.7183 12.2686C18.7183 13.0654 18.5301 13.6686 18.1538 14.0781C17.7775 14.4932 17.2131 14.7007 16.4604 14.7007H2.54834ZM6.18408 7.71973C5.82438 7.71973 5.49512 7.63395 5.19629 7.4624C4.90299 7.28532 4.66781 7.04736 4.49072 6.74854C4.31364 6.44971 4.2251 6.12044 4.2251 5.76074C4.2251 5.40658 4.31364 5.08008 4.49072 4.78125C4.66781 4.48242 4.90299 4.24447 5.19629 4.06738C5.49512 3.8903 5.82438 3.80176 6.18408 3.80176C6.54378 3.80176 6.87028 3.8903 7.16357 4.06738C7.45687 4.24447 7.69206 4.48242 7.86914 4.78125C8.04622 5.08008 8.13477 5.40658 8.13477 5.76074C8.13477 6.12044 8.04622 6.44971 7.86914 6.74854C7.69206 7.04736 7.45687 7.28532 7.16357 7.4624C6.87028 7.63395 6.54378 7.71973 6.18408 7.71973ZM2.60645 15.2817C1.73763 15.2817 1.08464 15.0659 0.647461 14.6343C0.21582 14.2082 0 13.569 0 12.7168V2.57324C0 1.71549 0.21582 1.07357 0.647461 0.647461C1.08464 0.21582 1.73763 0 2.60645 0H16.9668C17.8411 0 18.4941 0.21582 18.9258 0.647461C19.3574 1.0791 19.5732 1.72103 19.5732 2.57324V12.7168C19.5732 13.569 19.3574 14.2082 18.9258 14.6343C18.4941 15.0659 17.8411 15.2817 16.9668 15.2817H2.60645ZM2.62305 13.9453H16.9502C17.3597 13.9453 17.6751 13.8374 17.8965 13.6216C18.1234 13.4002 18.2368 13.0737 18.2368 12.6421V2.64795C18.2368 2.21631 18.1234 1.88981 17.8965 1.66846C17.6751 1.4471 17.3597 1.33643 16.9502 1.33643H2.62305C2.20801 1.33643 1.88981 1.4471 1.66846 1.66846C1.4471 1.88981 1.33643 2.21631 1.33643 2.64795V12.6421C1.33643 13.0737 1.4471 13.4002 1.66846 13.6216C1.88981 13.8374 2.20801 13.9453 2.62305 13.9453Z"
                fill="white"
              />
            </Svg>
            <Text style={cameraScanStyles.uploadGalleryText}>Upload Image</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={cameraScanStyles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={cameraScanStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      <StatusBar style="light" />
    </View>
  );
};

export default CameraScanScreen;

