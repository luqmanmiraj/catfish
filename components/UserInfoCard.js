import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { profileStyles } from '../styles';

const UserInfoCard = ({ displayName, displayEmail, isAuthenticated, scansRemaining, tokenBalance }) => {
  return (
    <View style={profileStyles.card}>
      <View style={profileStyles.userInfoRow}>
        <View style={profileStyles.userIconContainer}>
          <Svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <Defs>
              <SvgLinearGradient id="paint0_linear_36_656" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <Stop stopColor="#0AB4E0" />
                <Stop offset="1" stopColor="#0AB4E0" stopOpacity="0.8" />
              </SvgLinearGradient>
            </Defs>
            <Path
              d="M0 40C0 17.9086 17.9086 0 40 0C62.0914 0 80 17.9086 80 40C80 62.0914 62.0914 80 40 80C17.9086 80 0 62.0914 0 40Z"
              fill="url(#paint0_linear_36_656)"
            />
            <Path
              d="M51.6642 54.9964V51.6639C51.6642 49.8962 50.962 48.2009 49.7121 46.951C48.4621 45.701 46.7668 44.9988 44.9991 44.9988H35.0015C33.2338 44.9988 31.5385 45.701 30.2886 46.951C29.0386 48.2009 28.3364 49.8962 28.3364 51.6639V54.9964"
              stroke="white"
              strokeWidth="3.33254"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M40.0001 38.3337C43.6811 38.3337 46.6651 35.3497 46.6651 31.6686C46.6651 27.9876 43.6811 25.0035 40.0001 25.0035C36.319 25.0035 33.335 27.9876 33.335 31.6686C33.335 35.3497 36.319 38.3337 40.0001 38.3337Z"
              stroke="white"
              strokeWidth="3.33254"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <View style={profileStyles.userInfo}>
          <Text style={profileStyles.userName}>{displayName}</Text>
          <Text style={profileStyles.accountType}>
            {isAuthenticated ? displayEmail || 'Free Account' : 'Guest User'}
          </Text>
        </View>
      </View>
      <View style={profileStyles.statsRow}>
        <View style={profileStyles.statItem}>
          <Text style={profileStyles.statNumber}>{scansRemaining || 0}</Text>
          <Text style={profileStyles.statLabel}>Scans Left</Text>
        </View>
        <View style={profileStyles.statItem}>
          <Text style={profileStyles.statNumber}>{tokenBalance || 0}</Text>
          <Text style={profileStyles.statLabel}>Token Balance</Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfoCard;

