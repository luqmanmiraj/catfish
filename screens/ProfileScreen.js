import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { profileStyles } from '../styles';
import colors from '../colors';

const ProfileScreen = ({ onScanClick, onHistoryClick, onAboutClick, onUpgrade, onLogOut, onDeleteAccount, onManageSubscription, isPro }) => {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Check if user is a guest
  const isGuest = user?.email?.includes('@temp.catfish.app') || user?.['custom:is_guest'] === 'true';
  
  const displayName = user?.name || (isGuest ? 'Guest Account' : user?.email) || 'Guest User';
  const displayEmail = isGuest ? 'Guest Account' : (user?.email || '');

  return (
    <View style={profileStyles.container}>
      <ScrollView style={profileStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={profileStyles.header}>
          <Text style={profileStyles.title}>Profile</Text>
        </View>

        {/* User Account Information Card */}
        <View style={profileStyles.card}>
          <View style={profileStyles.userInfoRow}>
            <View style={profileStyles.userIconContainer}>
              <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <Circle cx="30" cy="30" r="30" fill={colors.primary} />
                <Circle cx="30" cy="22" r="8" fill="white" />
                <Path
                  d="M30 35C22 35 15 38 15 42V45H45V42C45 38 38 35 30 35Z"
                  fill="white"
                />
              </Svg>
            </View>
            <View style={profileStyles.userInfo}>
              <Text style={profileStyles.userName}>{displayName}</Text>
              <Text style={profileStyles.accountType}>
                {isAuthenticated ? displayEmail || 'Free Account' : 'Guest User'}
              </Text>
              <View style={profileStyles.statsRow}>
                <View style={profileStyles.statItem}>
                  <Text style={profileStyles.statNumber}>3</Text>
                  <Text style={profileStyles.statLabel}>Scans Completed</Text>
                </View>
                <View style={profileStyles.statItem}>
                  <Text style={profileStyles.statNumber}>3</Text>
                  <Text style={profileStyles.statLabel}>Scan Limit</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Upgrade Subscription Card or Manage Subscription */}
        {isPro ? (
          <View style={profileStyles.upgradeCard}>
            <Text style={profileStyles.priceText}>
              <Text style={profileStyles.crownIcon}>👑</Text>
              <Text style={profileStyles.priceAmount}> Catfish Pro</Text>
            </Text>
            <Text style={[profileStyles.upgradeTerms, { marginBottom: 12 }]}>
              You have an active subscription
            </Text>
            {onManageSubscription && (
              <TouchableOpacity
                style={[profileStyles.upgradeButton, { backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.primary }]}
                onPress={onManageSubscription}
                activeOpacity={0.8}
              >
                <Text style={[profileStyles.upgradeButtonText, { color: colors.primary }]}>
                  Manage Subscription
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={profileStyles.upgradeCard}>
            <Text style={profileStyles.priceText}>
              <Text style={profileStyles.dollarSign}>Starting at $</Text>
              <Text style={profileStyles.priceAmount}>4.99</Text>
            </Text>
            <TouchableOpacity
              style={profileStyles.upgradeButton}
              onPress={onUpgrade}
              activeOpacity={0.8}
            >
              <Text style={profileStyles.crownIcon}>👑</Text>
              <Text style={profileStyles.upgradeButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
            <Text style={profileStyles.upgradeTerms}>
              Basic $4.99 • Premium $9.99/month • Lifetime $24.99
            </Text>
          </View>
        )}

        {/* Settings Card */}
        <View style={profileStyles.card}>
          <Text style={profileStyles.settingsTitle}>Settings</Text>
          
          {/* Notifications */}
          <View style={profileStyles.settingItem}>
            <View style={profileStyles.settingLeft}>
              <View style={profileStyles.settingIconContainer}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 8A6 6 0 0 0 6 8C6 11.31 3 14 3 14H21C21 14 18 11.31 18 8Z"
                    stroke={colors.primary}
                    strokeWidth="2"
                    fill="none"
                  />
                  <Path
                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke={colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
              <View style={profileStyles.settingTextContainer}>
                <Text style={profileStyles.settingTitle}>Notifications</Text>
                <Text style={profileStyles.settingSubtitle}>Receive scan alerts</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Privacy & Safety */}
          <TouchableOpacity style={[profileStyles.settingItem, { borderBottomWidth: 0 }]}>
            <View style={profileStyles.settingLeft}>
              <View style={profileStyles.settingIconContainer}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke={colors.primary}
                    strokeWidth="2"
                    fill="none"
                  />
                  <Path
                    d="M9 12L11 14L15 10"
                    stroke={colors.primary}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <View style={profileStyles.settingTextContainer}>
                <Text style={profileStyles.settingTitle}>Privacy & Safety</Text>
                <Text style={profileStyles.settingSubtitle}>Learn about catfishing</Text>
              </View>
            </View>
            <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path
                d="M6 12L10 8L6 4"
                stroke={colors.accent.lightGreyBlue}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Account Management */}
        <View style={profileStyles.accountActions}>
          <TouchableOpacity
            style={profileStyles.actionItem}
            onPress={onLogOut}
            activeOpacity={0.7}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke={colors.accent.lightGreyBlue}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M16 17L21 12L16 7"
                stroke={colors.accent.lightGreyBlue}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M21 12H9"
                stroke={colors.accent.lightGreyBlue}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={profileStyles.actionText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={profileStyles.actionItem}
            onPress={onDeleteAccount}
            activeOpacity={0.7}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 6H5H21"
                stroke={colors.accent.red}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                stroke={colors.accent.red}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={[profileStyles.actionText, { color: colors.accent.red }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[profileStyles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={profileStyles.navItem} onPress={onScanClick}>
          <Svg width="24" height="24" viewBox="0 0 21 16" fill="none">
            <Path
              d="M16.4771 6.3667C16.1893 6.3667 15.9458 6.26709 15.7466 6.06787C15.5474 5.86312 15.4478 5.61963 15.4478 5.3374C15.4478 5.04964 15.5474 4.80615 15.7466 4.60693C15.9458 4.40771 16.1893 4.30811 16.4771 4.30811C16.7593 4.30811 17 4.40771 17.1992 4.60693C17.404 4.80615 17.5063 5.04964 17.5063 5.3374C17.5063 5.61963 17.404 5.86312 17.1992 6.06787C17 6.26709 16.7593 6.3667 16.4771 6.3667ZM2.60645 15.8296C1.73763 15.8296 1.08464 15.6138 0.647461 15.1821C0.21582 14.756 0 14.1141 0 13.2563V4.56543C0 3.71322 0.21582 3.07406 0.647461 2.64795C1.08464 2.21631 1.73763 2.00049 2.60645 2.00049H4.92236C5.24886 2.00049 5.48958 1.96175 5.64453 1.88428C5.79948 1.80127 5.96826 1.65739 6.15088 1.45264L6.81494 0.705566C7.02523 0.478678 7.25212 0.304362 7.49561 0.182617C7.74463 0.0608724 8.08219 0 8.5083 0H11.8203C12.2464 0 12.584 0.0608724 12.833 0.182617C13.082 0.304362 13.3089 0.478678 13.5137 0.705566L14.1777 1.45264C14.305 1.59098 14.4185 1.70166 14.5181 1.78467C14.6232 1.86214 14.7422 1.91748 14.875 1.95068C15.0078 1.98389 15.1849 2.00049 15.4062 2.00049H17.7803C18.6436 2.00049 19.2938 2.21631 19.731 2.64795C20.1681 3.07406 20.3867 3.71322 20.3867 4.56543V13.2563C20.3867 14.1141 20.1681 14.756 19.731 15.1821C19.2938 15.6138 18.6436 15.8296 17.7803 15.8296H2.60645ZM2.62305 14.4932H17.7554C18.1649 14.4932 18.4831 14.3853 18.71 14.1694C18.9368 13.9481 19.0503 13.6216 19.0503 13.1899V4.64014C19.0503 4.2085 18.9368 3.88477 18.71 3.66895C18.4831 3.44759 18.1649 3.33691 17.7554 3.33691H15.0742C14.6979 3.33691 14.3936 3.29541 14.1611 3.2124C13.9342 3.12386 13.7157 2.96338 13.5054 2.73096L12.8579 2.00049C12.62 1.73486 12.4097 1.55778 12.2271 1.46924C12.0444 1.3807 11.7705 1.33643 11.4053 1.33643H8.92334C8.55811 1.33643 8.28418 1.3807 8.10156 1.46924C7.91895 1.55778 7.70866 1.73486 7.4707 2.00049L6.82324 2.73096C6.61296 2.96338 6.3916 3.12386 6.15918 3.2124C5.93229 3.29541 5.6307 3.33691 5.25439 3.33691H2.62305C2.21354 3.33691 1.89535 3.44759 1.66846 3.66895C1.4471 3.88477 1.33643 4.2085 1.33643 4.64014V13.1899C1.33643 13.6216 1.4471 13.9481 1.66846 14.1694C1.89535 14.3853 2.21354 14.4932 2.62305 14.4932ZM10.1934 13.2979C9.5625 13.2979 8.97314 13.1816 8.42529 12.9492C7.87744 12.7168 7.396 12.3931 6.98096 11.978C6.57145 11.563 6.24772 11.0815 6.00977 10.5337C5.77734 9.98584 5.66113 9.39372 5.66113 8.75732C5.66113 8.12646 5.77734 7.53711 6.00977 6.98926C6.24772 6.44141 6.57145 5.95996 6.98096 5.54492C7.396 5.12988 7.87744 4.80615 8.42529 4.57373C8.97314 4.34131 9.5625 4.2251 10.1934 4.2251C11.029 4.2251 11.7899 4.42708 12.4761 4.83105C13.1623 5.23503 13.7074 5.78011 14.1113 6.46631C14.5153 7.15251 14.7173 7.91618 14.7173 8.75732C14.7173 9.39372 14.6011 9.98584 14.3687 10.5337C14.1362 11.0815 13.8125 11.563 13.3975 11.978C12.9824 12.3931 12.501 12.7168 11.9531 12.9492C11.4053 13.1816 10.8187 13.2979 10.1934 13.2979ZM10.1934 12.0361C10.7965 12.0361 11.3444 11.8895 11.8369 11.5962C12.335 11.3029 12.7306 10.91 13.0239 10.4175C13.3172 9.91943 13.4639 9.36605 13.4639 8.75732C13.4639 8.15413 13.3172 7.60628 13.0239 7.11377C12.7306 6.61572 12.335 6.22005 11.8369 5.92676C11.3444 5.62793 10.7965 5.47852 10.1934 5.47852C9.59017 5.47852 9.03955 5.62793 8.5415 5.92676C8.04899 6.22005 7.65332 6.61572 7.35449 7.11377C7.0612 7.60628 6.91455 8.15413 6.91455 8.75732C6.91455 9.36605 7.0612 9.91943 7.35449 10.4175C7.65332 10.91 8.04899 11.3029 8.5415 11.5962C9.03955 11.8895 9.59017 12.0361 10.1934 12.0361Z"
              fill={colors.accent.lightGreyBlue}
            />
          </Svg>
          <Text style={profileStyles.navText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.navItem} onPress={onHistoryClick}>
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
          <Text style={profileStyles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.navItem} onPress={onAboutClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={colors.text.white} strokeWidth="2" fill="none" />
            <Path
              d="M12 16V12M12 8H12.01"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={profileStyles.navText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={profileStyles.navItem}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill={colors.primary}
            />
          </Svg>
          <Text style={[profileStyles.navText, { color: colors.primary }]}>Profile</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default ProfileScreen;

