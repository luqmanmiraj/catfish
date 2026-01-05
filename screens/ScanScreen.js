import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, G, Defs, LinearGradient as SvgLinearGradient, Stop, Filter, FeFlood, FeColorMatrix, FeMorphology, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scanStyles } from '../styles';
import colors from '../colors';
import { useSubscription } from '../context/SubscriptionContext';

const ScanScreen = ({ onTapToScan, onUpgrade, onHistoryClick, onAboutClick, onProfileClick, isAuthenticated, user, onHowItWorks }) => {
  const insets = useSafeAreaInsets();
  const { scansRemaining } = useSubscription();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  // Check if user is a guest
  const isGuest = user?.email?.includes('@temp.catfish.app') || user?.['custom:is_guest'] === 'true';
  
  // Get user email or name for display (hide device ID for guests)
  const userDisplayName = isGuest ? 'Guest Account' : (user?.email || user?.name);
  
  // Check if this is the first time visiting the scan screen
  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasSeenWelcome = await AsyncStorage.getItem('@catfish:hasSeenWelcome');
        if (!hasSeenWelcome) {
          // Small delay to ensure screen is rendered
          setTimeout(() => {
            setShowWelcomeModal(true);
          }, 500);
        }
      } catch (error) {
        console.error('Error checking welcome status:', error);
      }
    };

    checkFirstVisit();
  }, []);

  const handleWelcomeClose = async () => {
    try {
      await AsyncStorage.setItem('@catfish:hasSeenWelcome', 'true');
      setShowWelcomeModal(false);
    } catch (error) {
      console.error('Error saving welcome status:', error);
      setShowWelcomeModal(false);
    }
  };
  
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
        <View style={scanStyles.headerRight}>
          <TouchableOpacity
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={colors.gradients.upgradeButton.colors}
              start={colors.gradients.upgradeButton.start}
              end={colors.gradients.upgradeButton.end}
              style={scanStyles.upgradeButton}
            >
              <Svg width="23" height="18" viewBox="0 0 23 18" fill="none">
                <Path
                  d="M2.37402 8.26758C1.93685 8.26758 1.53841 8.15967 1.17871 7.94385C0.81901 7.72803 0.53125 7.44027 0.31543 7.08057C0.105143 6.72087 0 6.32243 0 5.88525C0 5.44808 0.105143 5.05241 0.31543 4.69824C0.53125 4.33854 0.81901 4.05355 1.17871 3.84326C1.53841 3.62744 1.93685 3.51953 2.37402 3.51953C2.8112 3.51953 3.20964 3.62744 3.56934 3.84326C3.92904 4.05908 4.21403 4.34684 4.42432 4.70654C4.6346 5.06071 4.73975 5.45361 4.73975 5.88525C4.73975 6.32243 4.6346 6.72087 4.42432 7.08057C4.21403 7.44027 3.92904 7.72803 3.56934 7.94385C3.20964 8.15967 2.8112 8.26758 2.37402 8.26758ZM2.37402 6.69873C2.60091 6.69873 2.79183 6.62126 2.94678 6.46631C3.10173 6.30583 3.1792 6.11214 3.1792 5.88525C3.1792 5.66943 3.09896 5.48128 2.93848 5.3208C2.78353 5.16032 2.59538 5.08008 2.37402 5.08008C2.15267 5.08008 1.96175 5.16032 1.80127 5.3208C1.64079 5.47575 1.56055 5.6639 1.56055 5.88525C1.56055 6.11214 1.64079 6.30583 1.80127 6.46631C1.96175 6.62126 2.15267 6.69873 2.37402 6.69873ZM11.0483 4.73975C10.6167 4.73975 10.2183 4.6346 9.85303 4.42432C9.49333 4.2085 9.20557 3.92074 8.98975 3.56104C8.77946 3.20133 8.67432 2.8029 8.67432 2.36572C8.67432 1.93408 8.77946 1.53841 8.98975 1.17871C9.20557 0.81901 9.49333 0.534017 9.85303 0.32373C10.2127 0.10791 10.6112 0 11.0483 0C11.4855 0 11.8812 0.10791 12.2354 0.32373C12.5951 0.534017 12.88 0.81901 13.0903 1.17871C13.3062 1.53841 13.4141 1.93408 13.4141 2.36572C13.4141 2.8029 13.3062 3.20133 13.0903 3.56104C12.88 3.92074 12.5951 4.2085 12.2354 4.42432C11.8812 4.6346 11.4855 4.73975 11.0483 4.73975ZM11.0483 3.1792C11.2752 3.1792 11.4661 3.09896 11.6211 2.93848C11.776 2.77799 11.8535 2.58708 11.8535 2.36572C11.8535 2.1499 11.7733 1.96175 11.6128 1.80127C11.4578 1.64079 11.2697 1.56055 11.0483 1.56055C10.827 1.56055 10.6361 1.63802 10.4756 1.79297C10.3151 1.94792 10.2349 2.13883 10.2349 2.36572C10.2349 2.58708 10.3151 2.77799 10.4756 2.93848C10.6361 3.09896 10.827 3.1792 11.0483 3.1792ZM19.7227 8.26758C19.2855 8.26758 18.887 8.15967 18.5273 7.94385C18.1676 7.72803 17.8799 7.44027 17.6641 7.08057C17.4538 6.72087 17.3486 6.32243 17.3486 5.88525C17.3486 5.45361 17.4538 5.06071 17.6641 4.70654C17.8799 4.34684 18.1676 4.05908 18.5273 3.84326C18.887 3.62744 19.2855 3.51953 19.7227 3.51953C20.1543 3.51953 20.55 3.62744 20.9097 3.84326C21.2694 4.05355 21.5571 4.33854 21.7729 4.69824C21.9888 5.05241 22.0967 5.44808 22.0967 5.88525C22.0967 6.32243 21.9888 6.72087 21.7729 7.08057C21.5571 7.44027 21.2694 7.72803 20.9097 7.94385C20.55 8.15967 20.1543 8.26758 19.7227 8.26758ZM19.7227 6.69873C19.944 6.69873 20.1322 6.62126 20.2871 6.46631C20.4476 6.30583 20.5278 6.11214 20.5278 5.88525C20.5278 5.6639 20.4476 5.47575 20.2871 5.3208C20.1322 5.16032 19.944 5.08008 19.7227 5.08008C19.5013 5.08008 19.3104 5.16032 19.1499 5.3208C18.9894 5.48128 18.9092 5.66943 18.9092 5.88525C18.9092 6.11214 18.9867 6.30583 19.1416 6.46631C19.3021 6.62126 19.4958 6.69873 19.7227 6.69873ZM3.26221 7.67822L4.15869 6.24219L6.60742 7.76123C6.7181 7.83317 6.80941 7.86084 6.88135 7.84424C6.95882 7.82764 7.02799 7.77783 7.08887 7.69482L9.96924 3.81006L11.5713 4.49902L8.30908 8.89014C8.01025 9.29411 7.64225 9.52376 7.20508 9.5791C6.77344 9.62891 6.37223 9.5459 6.00146 9.33008L3.26221 7.67822ZM18.8594 7.71143L16.0703 9.37988C15.7272 9.58464 15.3398 9.65934 14.9082 9.604C14.4766 9.54867 14.1141 9.32178 13.8208 8.92334L10.5503 4.52393L12.144 3.83496L15.0078 7.69482C15.0742 7.7889 15.1462 7.84424 15.2236 7.86084C15.3066 7.87744 15.4062 7.84701 15.5225 7.76953L17.9546 6.26709L18.8594 7.71143ZM4.35791 13.8706V12.1689H17.7471V13.8706H4.35791ZM2.20801 7.91064L3.78516 7.18848L5.61133 14.6841C5.72201 15.1489 6.0236 15.3813 6.51611 15.3813H15.5806C16.0731 15.3813 16.3747 15.1489 16.4854 14.6841L18.3115 7.18848L19.8887 7.91064L18.1621 14.9497C17.9906 15.658 17.6973 16.1893 17.2822 16.5435C16.8672 16.8976 16.2944 17.0747 15.564 17.0747H6.52441C5.79948 17.0747 5.22949 16.8976 4.81445 16.5435C4.40495 16.1893 4.11165 15.658 3.93457 14.9497L2.20801 7.91064Z"
                  fill="black"
                />
              </Svg>
              <Text style={scanStyles.upgradeText}>Upgrade</Text>
            </LinearGradient>
          </TouchableOpacity>
          {onHowItWorks && (
            <TouchableOpacity
              onPress={onHowItWorks}
              activeOpacity={0.7}
              style={scanStyles.howItWorksButton}
            >
              <Text style={scanStyles.howItWorksText}>How it works?</Text>
            </TouchableOpacity>
          )}
        </View>
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
            {/* New Camera Icon with Outer Circles */}
            <Svg width="352" height="352" viewBox="0 0 352 352" fill="none" style={{ position: 'absolute', alignSelf: 'center' }}>
              <Defs>
                {/* Linear Gradient */}
                <SvgLinearGradient id="paint0_linear_6723_247" x1="95.8746" y1="95.8746" x2="185.87" y2="185.87" gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#0AB4E0" />
                  <Stop offset="1" stopColor="#0AB4E0" stopOpacity="0.8" />
                </SvgLinearGradient>
                
                {/* Filter for drop shadow */}
                <Filter id="filter0_dd_6723_247" x="83.8746" y="93.8746" width="183.991" height="183.991" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <FeFlood floodOpacity="0" result="BackgroundImageFix" />
                  <FeColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <FeMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6723_247" />
                  <FeOffset dy="4" />
                  <FeGaussianBlur stdDeviation="3" />
                  <FeComposite in2="hardAlpha" operator="out" />
                  <FeColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.0403104 0 0 0 0 0.705835 0 0 0 0 0.878288 0 0 0 0.5 0"
                  />
                  <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6723_247" />
                  <FeColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <FeMorphology radius="3" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6723_247" />
                  <FeOffset dy="10" />
                  <FeGaussianBlur stdDeviation="7.5" />
                  <FeComposite in2="hardAlpha" operator="out" />
                  <FeColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.0403104 0 0 0 0 0.705835 0 0 0 0 0.878288 0 0 0 0.5 0"
                  />
                  <FeBlend mode="normal" in2="effect1_dropShadow_6723_247" result="effect2_dropShadow_6723_247" />
                  <FeBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6723_247" result="shape" />
                </Filter>
              </Defs>
              
              {/* Outer Circle 1 */}
              <G opacity="0.133592">
                <Path
                  d="M39.9978 175.87C39.9978 100.83 100.83 39.9978 175.87 39.9978C250.91 39.9978 311.743 100.83 311.743 175.87C311.743 250.91 250.91 311.742 175.87 311.742C100.83 311.742 39.9978 250.91 39.9978 175.87Z"
                  fill="#0AB4E0"
                />
              </G>
              
              {/* Outer Circle 2 */}
              <G opacity="0.216925">
                <Path
                  d="M79.9955 175.87C79.9955 122.92 122.92 79.9955 175.87 79.9955C228.82 79.9955 271.745 122.92 271.745 175.87C271.745 228.82 228.82 271.745 175.87 271.745C122.92 271.745 79.9955 228.82 79.9955 175.87Z"
                  fill="#0AB4E0"
                />
              </G>
              
              {/* Main Circle with Gradient and Camera Icon */}
              <G filter="url(#filter0_dd_6723_247)">
                <Path
                  d="M95.8746 175.87C95.8746 131.69 131.69 95.8746 175.87 95.8746C220.05 95.8746 255.866 131.69 255.866 175.87C255.866 220.05 220.05 255.866 175.87 255.866C131.69 255.866 95.8746 220.05 95.8746 175.87Z"
                  fill="url(#paint0_linear_6723_247)"
                  shapeRendering="crispEdges"
                />
                <Path
                  d="M188.058 172.765C187.482 172.765 186.995 172.565 186.597 172.167C186.198 171.757 185.999 171.271 185.999 170.706C185.999 170.131 186.198 169.644 186.597 169.245C186.995 168.847 187.482 168.647 188.058 168.647C188.622 168.647 189.104 168.847 189.502 169.245C189.911 169.644 190.116 170.131 190.116 170.706C190.116 171.271 189.911 171.757 189.502 172.167C189.104 172.565 188.622 172.765 188.058 172.765ZM160.316 191.69C158.579 191.69 157.273 191.259 156.398 190.396C155.535 189.543 155.104 188.259 155.104 186.544V169.162C155.104 167.458 155.535 166.179 156.398 165.327C157.273 164.464 158.579 164.032 160.316 164.032H164.948C165.601 164.032 166.083 163.955 166.393 163.8C166.702 163.634 167.04 163.346 167.405 162.937L168.733 161.442C169.154 160.989 169.608 160.64 170.095 160.396C170.593 160.153 171.268 160.031 172.12 160.031H178.744C179.596 160.031 180.271 160.153 180.77 160.396C181.268 160.64 181.721 160.989 182.131 161.442L183.459 162.937C183.714 163.213 183.94 163.435 184.14 163.601C184.35 163.756 184.588 163.866 184.854 163.933C185.119 163.999 185.473 164.032 185.916 164.032H190.664C192.391 164.032 193.691 164.464 194.565 165.327C195.44 166.179 195.877 167.458 195.877 169.162V186.544C195.877 188.259 195.44 189.543 194.565 190.396C193.691 191.259 192.391 191.69 190.664 191.69H160.316ZM160.35 189.018H190.614C191.433 189.018 192.07 188.802 192.523 188.37C192.977 187.927 193.204 187.274 193.204 186.411V169.312C193.204 168.448 192.977 167.801 192.523 167.369C192.07 166.926 191.433 166.705 190.614 166.705H185.252C184.499 166.705 183.891 166.622 183.426 166.456C182.972 166.279 182.535 165.958 182.114 165.493L180.819 164.032C180.343 163.501 179.923 163.147 179.558 162.97C179.192 162.793 178.645 162.704 177.914 162.704H172.95C172.22 162.704 171.672 162.793 171.307 162.97C170.941 163.147 170.521 163.501 170.045 164.032L168.75 165.493C168.329 165.958 167.887 166.279 167.422 166.456C166.968 166.622 166.365 166.705 165.612 166.705H160.35C159.531 166.705 158.894 166.926 158.44 167.369C157.998 167.801 157.776 168.448 157.776 169.312V186.411C157.776 187.274 157.998 187.927 158.44 188.37C158.894 188.802 159.531 189.018 160.35 189.018ZM175.49 186.627C174.229 186.627 173.05 186.395 171.954 185.93C170.858 185.465 169.896 184.817 169.065 183.987C168.246 183.157 167.599 182.194 167.123 181.099C166.658 180.003 166.426 178.819 166.426 177.546C166.426 176.284 166.658 175.105 167.123 174.01C167.599 172.914 168.246 171.951 169.065 171.121C169.896 170.291 170.858 169.644 171.954 169.179C173.05 168.714 174.229 168.481 175.49 168.481C177.161 168.481 178.683 168.885 180.056 169.693C181.428 170.501 182.518 171.591 183.326 172.964C184.134 174.336 184.538 175.864 184.538 177.546C184.538 178.819 184.306 180.003 183.841 181.099C183.376 182.194 182.729 183.157 181.898 183.987C181.068 184.817 180.105 185.465 179.01 185.93C177.914 186.395 176.741 186.627 175.49 186.627ZM175.49 184.104C176.697 184.104 177.792 183.81 178.777 183.224C179.773 182.637 180.565 181.851 181.151 180.866C181.738 179.87 182.031 178.763 182.031 177.546C182.031 176.34 181.738 175.244 181.151 174.259C180.565 173.263 179.773 172.471 178.777 171.885C177.792 171.287 176.697 170.988 175.49 170.988C174.284 170.988 173.183 171.287 172.187 171.885C171.201 172.471 170.41 173.263 169.812 174.259C169.226 175.244 168.933 176.34 168.933 177.546C168.933 178.763 169.226 179.87 169.812 180.866C170.41 181.851 171.201 182.637 172.187 183.224C173.183 183.81 174.284 184.104 175.49 184.104Z"
                  fill="white"
                />
              </G>
            </Svg>
          </View>
        </TouchableOpacity>

        <Text style={scanStyles.tapToScanText}>Tap to Scan an Image of a Potential Date</Text>
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

      {/* Welcome Modal for First-Time Visitors */}
      <Modal
        visible={showWelcomeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleWelcomeClose}
        transparent={false}
      >
        <View style={[welcomeModalStyles.container, { paddingTop: Math.max(insets.top, 20) }]}>
          <View style={welcomeModalStyles.header}>
            <Text style={welcomeModalStyles.title}>Welcome to Catfish Crasher! 🎉</Text>
          </View>

          <View style={welcomeModalStyles.content}>
            <Text style={welcomeModalStyles.welcomeText}>
              We're excited to have you here! Get started with 3 free scans on signup.
            </Text>

            <View style={welcomeModalStyles.featureSection}>
              <Text style={welcomeModalStyles.sectionTitle}>How It Works:</Text>
              <View style={welcomeModalStyles.featureItem}>
                <Text style={welcomeModalStyles.bullet}>•</Text>
                <Text style={welcomeModalStyles.featureText}>Tap the camera icon to scan an image</Text>
              </View>
              <View style={welcomeModalStyles.featureItem}>
                <Text style={welcomeModalStyles.bullet}>•</Text>
                <Text style={welcomeModalStyles.featureText}>Our AI analyzes the image for deepfakes and AI-generated content</Text>
              </View>
              <View style={welcomeModalStyles.featureItem}>
                <Text style={welcomeModalStyles.bullet}>•</Text>
                <Text style={welcomeModalStyles.featureText}>Get instant results to help protect yourself from catfishing</Text>
              </View>
            </View>

            <View style={welcomeModalStyles.pricingSection}>
              <Text style={welcomeModalStyles.sectionTitle}>Pricing:</Text>
              <Text style={welcomeModalStyles.pricingText}>15 scans — $4.99</Text>
              <Text style={welcomeModalStyles.pricingText}>50 scans — $9.99</Text>
              <Text style={welcomeModalStyles.pricingText}>100 scans — $16.99</Text>
            </View>
          </View>

          <View style={[welcomeModalStyles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <TouchableOpacity
              style={welcomeModalStyles.getStartedButton}
              onPress={handleWelcomeClose}
            >
              <Text style={welcomeModalStyles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const welcomeModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: colors.text.white,
    lineHeight: 26,
    marginBottom: 30,
    textAlign: 'center',
  },
  featureSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: 18,
    color: colors.primary,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  pricingSection: {
    marginTop: 20,
  },
  pricingText: {
    fontSize: 16,
    color: colors.text.white,
    lineHeight: 24,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScanScreen;

