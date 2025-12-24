import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { scanStyles } from '../styles';
import colors from '../colors';
import { useSubscription } from '../context/SubscriptionContext';

const ScanScreen = ({ onTapToScan, onUpgrade, onHistoryClick, onAboutClick, onProfileClick, isAuthenticated, user }) => {
  const insets = useSafeAreaInsets();
  const { scansRemaining } = useSubscription();

  // Check if user is a guest
  const isGuest = user?.email?.includes('@temp.catfish.app') || user?.['custom:is_guest'] === 'true';
  
  // Get user email or name for display (hide device ID for guests)
  const userDisplayName = isGuest ? 'Guest Account' : (user?.email || user?.name);
  
  // Determine what to show in the header
  const getHeaderText = () => {
    if (isAuthenticated && userDisplayName) {
      // Show logged-in status with scan count
      const scanText = scansRemaining > 0 ? `Scans left: ${scansRemaining}` : 'No scans left';
      return `${userDisplayName} • ${scanText}`;
    } else if (isAuthenticated) {
      // Just show logged-in status with scan count
      const scanText = scansRemaining > 0 ? `Scans left: ${scansRemaining}` : 'No scans left';
      return `Logged in • ${scanText}`;
    } else {
      // Not logged in, show scan count
      return scansRemaining > 0 ? `Scans left: ${scansRemaining}` : 'No scans left';
    }
  };
  
  return (
    <View style={scanStyles.container}>
      {/* Header Section */}
      <View style={scanStyles.header}>
        <View style={scanStyles.headerLeft}>
          <Text style={scanStyles.appName}>CATFISH CRASHER</Text>
          <Text style={scanStyles.scansRemaining}>{getHeaderText()}</Text>
        </View>
        <TouchableOpacity
          style={scanStyles.upgradeButton}
          onPress={onUpgrade}
          activeOpacity={0.8}
        >
          <Text style={scanStyles.upgradeIcon}>👑</Text>
          <Text style={scanStyles.upgradeText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={scanStyles.contentArea}>
        {/* Circular Scan Design */}
        <TouchableOpacity
          style={scanStyles.scanCircleContainer}
          onPress={onTapToScan}
          activeOpacity={0.9}
        >
          <View style={scanStyles.scanCircle}>
            {/* Gradient Background Layers */}
            <View style={scanStyles.gradientLayer1} />
            <View style={scanStyles.gradientLayer2} />
            <View style={scanStyles.gradientLayer3} />
            
            {/* Top Most Outer Circle */}
            <View style={scanStyles.topMostCircleContainer}>
              <Svg width="351" height="351" viewBox="0 0 351 351" style={scanStyles.topMostCircleSvg}>
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
            <View style={scanStyles.outerCircleContainer}>
              <Svg width="272" height="272" viewBox="0 0 272 272" style={scanStyles.outerCircleSvg}>
                <G opacity="0.133592">
                  <Path
                    d="M0 135.872C0 60.8321 60.8321 0 135.872 0C210.913 0 271.745 60.8321 271.745 135.872C271.745 210.913 210.913 271.745 135.872 271.745C60.8321 271.745 0 210.913 0 135.872Z"
                    fill="#0AB4E0"
                  />
                </G>
              </Svg>
            </View>

            {/* Middle Concentric Circle */}
            <View style={[scanStyles.circlesContainer, { marginBottom: 20 }]}>
              <Svg width="192" height="192" viewBox="0 0 192 192" style={scanStyles.circleSvg}>
                <G opacity="0.216925">
                  <Path
                    d="M0 95.8746C0 42.9245 42.9245 0 95.8746 0C148.825 0 191.749 42.9245 191.749 95.8746C191.749 148.825 148.825 191.749 95.8746 191.749C42.9245 191.749 0 148.825 0 95.8746Z"
                    fill="#0AB4E0"
                  />
                </G>
              </Svg>
            </View>

            {/* Camera Icon in Center */}
            <View style={scanStyles.cameraIconContainer}>
              <Svg width="184" height="184" viewBox="0 0 184 184" fill="none">
                <Defs>
                  <LinearGradient id="paint0_linear_scan" x1="12" y1="2" x2="171.991" y2="161.991" gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#0AB4E0" />
                    <Stop offset="1" stopColor="#0AB4E0" stopOpacity="0.8" />
                  </LinearGradient>
                </Defs>
                <G>
                  <Path
                    d="M12 81.9955C12 37.8152 47.8152 2 91.9955 2C136.176 2 171.991 37.8152 171.991 81.9955C171.991 126.176 136.176 161.991 91.9955 161.991C47.8152 161.991 12 126.176 12 81.9955Z"
                    fill="url(#paint0_linear_scan)"
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
        </TouchableOpacity>

        <Text style={scanStyles.tapToScanText}>Tap to Scan</Text>
        <Text style={scanStyles.descriptionText}>
          Detect AI-generated images and protect against catfishing
        </Text>
      </View>

      {/* Bottom Navigation */}
      <View style={[scanStyles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={scanStyles.navItem}>
          <Svg width="24" height="24" viewBox="0 0 21 16" fill="none">
            <Path
              d="M17.1992 6.3667C17.487 6.3667 17.7305 6.26709 17.9297 6.06787C18.1344 5.86312 18.2368 5.61963 18.2368 5.3374C18.2368 5.04964 18.1344 4.80615 17.9297 4.60693C17.7305 4.40771 17.487 4.30811 17.1992 4.30811C16.917 4.30811 16.6735 4.40771 16.4688 4.60693C16.2695 4.80615 16.1699 5.04964 16.1699 5.3374C16.1699 5.61963 16.2695 5.86312 16.4688 6.06787C16.6735 6.26709 16.917 6.3667 17.1992 6.3667ZM2.60645 15.8296C1.73763 15.8296 1.08464 15.6138 0.647461 15.1821C0.21582 14.756 0 14.1141 0 13.2563V4.56543C0 3.71322 0.21582 3.07406 0.647461 2.64795C1.08464 2.21631 1.73763 2.00049 2.60645 2.00049H4.92236C5.24886 2.00049 5.48958 1.96175 5.64453 1.88428C5.79948 1.80127 5.96826 1.65739 6.15088 1.45264L6.81494 0.705566C7.02523 0.478678 7.25212 0.304362 7.49561 0.182617C7.74463 0.0608724 8.08219 0 8.5083 0H11.8203C12.2464 0 12.584 0.0608724 12.833 0.182617C13.082 0.304362 13.3089 0.478678 13.5137 0.705566L14.1777 1.45264C14.305 1.59098 14.4185 1.70166 14.5181 1.78467C14.6232 1.86214 14.7422 1.91748 14.875 1.95068C15.0078 1.98389 15.1849 2.00049 15.4062 2.00049H17.7803C18.6436 2.00049 19.2938 2.21631 19.731 2.64795C20.1681 3.07406 20.3867 3.71322 20.3867 4.56543V13.2563C20.3867 14.1141 20.1681 14.756 19.731 15.1821C19.2938 15.6138 18.6436 15.8296 17.7803 15.8296H2.60645ZM10.1934 13.3809C10.8187 13.3809 11.4053 13.2646 11.9531 13.0322C12.501 12.7998 12.9824 12.4761 13.3975 12.061C13.8125 11.646 14.1362 11.1646 14.3687 10.6167C14.6011 10.0688 14.7173 9.47673 14.7173 8.84033C14.7173 7.99919 14.5153 7.23551 14.1113 6.54932C13.7074 5.86312 13.1623 5.31803 12.4761 4.91406C11.7899 4.51009 11.029 4.30811 10.1934 4.30811C9.5625 4.30811 8.97314 4.42432 8.42529 4.65674C7.87744 4.88916 7.396 5.21289 6.98096 5.62793C6.57145 6.04297 6.24772 6.52441 6.00977 7.07227C5.77734 7.62012 5.66113 8.20947 5.66113 8.84033C5.66113 9.47673 5.77734 10.0688 6.00977 10.6167C6.24772 11.1646 6.57145 11.646 6.98096 12.061C7.396 12.4761 7.87744 12.7998 8.42529 13.0322C8.97314 13.2646 9.5625 13.3809 10.1934 13.3809ZM10.1934 12.1191C9.59017 12.1191 9.03955 11.9725 8.5415 11.6792C8.04899 11.3859 7.65332 10.993 7.35449 10.5005C7.0612 10.0024 6.91455 9.44906 6.91455 8.84033C6.91455 8.23714 7.0612 7.68929 7.35449 7.19678C7.65332 6.69873 8.04899 6.30306 8.5415 6.00977C9.03955 5.71094 9.59017 5.56152 10.1934 5.56152C10.7965 5.56152 11.3444 5.71094 11.8369 6.00977C12.335 6.30306 12.7306 6.69873 13.0239 7.19678C13.3172 7.68929 13.4639 8.23714 13.4639 8.84033C13.4639 9.44906 13.3172 10.0024 13.0239 10.5005C12.7306 10.993 12.335 11.3859 11.8369 11.6792C11.3444 11.9725 10.7965 12.1191 10.1934 12.1191Z"
              fill={colors.primary}
            />
          </Svg>
          <Text style={[scanStyles.navText, { color: colors.primary }]}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={scanStyles.navItem} onPress={onHistoryClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Clock circle */}
            <Circle cx="12" cy="12" r="10" stroke={colors.text.white} strokeWidth="2" fill="none" />
            {/* Clock hands */}
            <Path
              d="M12 8V12L15 15"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={scanStyles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={scanStyles.navItem} onPress={onAboutClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={colors.text.white} strokeWidth="2" fill="none" />
            <Path
              d="M12 16V12M12 8H12.01"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={scanStyles.navText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={scanStyles.navItem} onPress={onProfileClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill={colors.text.white}
            />
          </Svg>
          <Text style={scanStyles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default ScanScreen;

