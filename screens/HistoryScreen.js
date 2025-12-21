import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { historyStyles } from '../styles';
import colors from '../colors';
import { useAuth } from '../context/AuthContext';
import { getScanHistory } from '../services/subscriptionApi';
import { logDeviceMetadata } from '../utils/deviceLogger';
import apiConfig from '../config/apiConfig';

const HistoryScreen = ({ onScanClick, onAboutClick, onProfileClick }) => {
  const insets = useSafeAreaInsets();
  const { accessToken, isAuthenticated } = useAuth();
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const hasLoggedAccess = useRef(false);

  // Map API status to UI format
  const mapStatusToUI = (status, deepfakeScore) => {
    switch (status) {
      case 'authentic':
        return {
          status: 'Like Real',
          statusColor: colors.accent.green,
          statusIcon: 'check',
          percentage: deepfakeScore !== null ? `${Math.round((1 - deepfakeScore) * 100)}%` : 'N/A',
          description: 'This image exhibits strong authenticity markers',
        };
      case 'deepfake_detected':
        return {
          status: 'AI Generated',
          statusColor: colors.primary,
          statusIcon: 'duplicate',
          percentage: deepfakeScore !== null ? `${Math.round(deepfakeScore * 100)}%` : 'N/A',
          description: 'This image was partially or completely created or altered using AI',
        };
      case 'unverifiable':
      default:
        return {
          status: 'Inconclusive',
          statusColor: colors.text.white,
          statusIcon: 'info',
          percentage: deepfakeScore !== null ? `${Math.round(deepfakeScore * 100)}%` : 'N/A',
          description: 'Unable to make a definitive determination',
        };
    }
  };

  // Format date from ISO string
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Log history screen access
  const logHistoryAccess = async () => {
    if (hasLoggedAccess.current) return; // Only log once per mount
    
    try {
      const historyEndpoint = `${apiConfig.API_BASE_URL}/scan-history`;
      await logDeviceMetadata(null, historyEndpoint);
      console.log('📊 History screen accessed - logged device metadata');
      hasLoggedAccess.current = true;
    } catch (err) {
      console.error('Error logging history access:', err);
    }
  };

  // Fetch scan history
  const fetchScanHistory = async (isRefresh = false) => {
    if (!isAuthenticated || !accessToken) {
      setError('Please sign in to view scan history');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log('🔄 Fetching scan history...');
      const response = await getScanHistory(accessToken, 50);
      
      if (response.success && response.scans) {
        // Map API response to UI format
        const mappedHistory = response.scans.map((scan) => {
          const uiStatus = mapStatusToUI(scan.status, scan.deepfakeScore);
          return {
            id: scan.scanId,
            image: scan.s3Url || null,
            status: uiStatus.status,
            statusColor: uiStatus.statusColor,
            statusIcon: uiStatus.statusIcon,
            percentage: uiStatus.percentage,
            date: formatDate(scan.timestamp || scan.createdAt),
            description: uiStatus.description,
            deepfakeScore: scan.deepfakeScore,
            s3Url: scan.s3Url,
          };
        });
        
        console.log(`✅ Loaded ${mappedHistory.length} scan(s) from history`);
        setScanHistory(mappedHistory);
      } else {
        console.log('ℹ️ No scans found in history');
        setScanHistory([]);
      }
    } catch (err) {
      console.error('❌ Error fetching scan history:', err);
      setError(err.message || 'Failed to load scan history');
      setScanHistory([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Log access and fetch history when screen is shown
    logHistoryAccess();
    fetchScanHistory();
    
    // Reset log flag when component unmounts (so it logs again on next mount)
    return () => {
      hasLoggedAccess.current = false;
    };
  }, [isAuthenticated, accessToken]);

  const onRefresh = () => {
    fetchScanHistory(true);
  };

  const renderStatusIcon = (iconType, color) => {
    switch (iconType) {
      case 'info':
        return (
          <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Circle cx="10" cy="10" r="9" stroke={color} strokeWidth="2" fill="none" />
            <Path
              d="M10 14V10M10 6H10.01"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );
      case 'duplicate':
        return (
          <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path
              d="M4 4H10C11.1 4 12 4.9 12 6V12C12 13.1 11.1 14 10 14H4C2.9 14 2 13.1 2 12V6C2 4.9 2.9 4 4 4Z"
              stroke={color}
              strokeWidth="2"
              fill="none"
            />
            <Path
              d="M16 6H12M16 10H12M16 14H12"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        );
      case 'check':
        return (
          <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <Path
              d="M16 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H16C17.1 18 18 17.1 18 16V4C18 2.9 17.1 2 16 2Z"
              fill={color}
            />
            <Path
              d="M7 10L9 12L13 8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );
      default:
        return null;
    }
  };

  return (
    <View style={historyStyles.container}>
      {/* Header */}
      <View style={historyStyles.header}>
        <View>
          <Text style={historyStyles.title}>Scan History</Text>
          <Text style={historyStyles.subtitle}>
            {loading ? 'Loading...' : `${scanHistory.length} scan${scanHistory.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={historyStyles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {loading && !refreshing ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.text.white, marginTop: 16 }}>Loading scan history...</Text>
          </View>
        ) : error ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.text.white, textAlign: 'center', marginBottom: 16 }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => fetchScanHistory()}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: colors.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.text.white }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : !isAuthenticated ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.text.white, textAlign: 'center' }}>
              Please sign in to view your scan history
            </Text>
          </View>
        ) : scanHistory.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.text.white, textAlign: 'center' }}>
              No scan history found. Start scanning images to see your history here.
            </Text>
          </View>
        ) : (
          scanHistory.map((scan) => (
            <View key={scan.id} style={historyStyles.card}>
              <View style={historyStyles.cardImage}>
                {scan.image ? (
                  <Image 
                    source={{ uri: scan.image }} 
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={historyStyles.imagePlaceholder}>
                    <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                      <Path
                        d="M10 10H50C52.7614 10 55 12.2386 55 15V45C55 47.7614 52.7614 50 50 50H10C7.23858 50 5 47.7614 5 45V15C5 12.2386 7.23858 10 10 10Z"
                        stroke={colors.accent.lightGreyBlue}
                        strokeWidth="2"
                        fill="none"
                      />
                      <Circle cx="30" cy="25" r="5" stroke={colors.accent.lightGreyBlue} strokeWidth="2" fill="none" />
                      <Path
                        d="M5 40L15 30L25 35L35 20L50 35"
                        stroke={colors.accent.lightGreyBlue}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </View>
                )}
              </View>
              <View style={historyStyles.cardContent}>
                <View style={historyStyles.statusRow}>
                  {renderStatusIcon(scan.statusIcon, scan.statusColor)}
                  <Text style={[historyStyles.statusText, { color: scan.statusColor }]}>
                    {scan.status}
                  </Text>
                </View>
                <View style={historyStyles.detailsRow}>
                  <Text style={historyStyles.percentage}>{scan.percentage}</Text>
                  <Text style={historyStyles.dot}>•</Text>
                  <Text style={historyStyles.date}>{scan.date}</Text>
                </View>
                <Text style={historyStyles.description} numberOfLines={2}>
                  {scan.description}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[historyStyles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity style={historyStyles.navItem} onPress={onScanClick}>
          <Svg width="24" height="24" viewBox="0 0 21 16" fill="none">
            <Path
              d="M16.4771 6.3667C16.1893 6.3667 15.9458 6.26709 15.7466 6.06787C15.5474 5.86312 15.4478 5.61963 15.4478 5.3374C15.4478 5.04964 15.5474 4.80615 15.7466 4.60693C15.9458 4.40771 16.1893 4.30811 16.4771 4.30811C16.7593 4.30811 17 4.40771 17.1992 4.60693C17.404 4.80615 17.5063 5.04964 17.5063 5.3374C17.5063 5.61963 17.404 5.86312 17.1992 6.06787C17 6.26709 16.7593 6.3667 16.4771 6.3667ZM2.60645 15.8296C1.73763 15.8296 1.08464 15.6138 0.647461 15.1821C0.21582 14.756 0 14.1141 0 13.2563V4.56543C0 3.71322 0.21582 3.07406 0.647461 2.64795C1.08464 2.21631 1.73763 2.00049 2.60645 2.00049H4.92236C5.24886 2.00049 5.48958 1.96175 5.64453 1.88428C5.79948 1.80127 5.96826 1.65739 6.15088 1.45264L6.81494 0.705566C7.02523 0.478678 7.25212 0.304362 7.49561 0.182617C7.74463 0.0608724 8.08219 0 8.5083 0H11.8203C12.2464 0 12.584 0.0608724 12.833 0.182617C13.082 0.304362 13.3089 0.478678 13.5137 0.705566L14.1777 1.45264C14.305 1.59098 14.4185 1.70166 14.5181 1.78467C14.6232 1.86214 14.7422 1.91748 14.875 1.95068C15.0078 1.98389 15.1849 2.00049 15.4062 2.00049H17.7803C18.6436 2.00049 19.2938 2.21631 19.731 2.64795C20.1681 3.07406 20.3867 3.71322 20.3867 4.56543V13.2563C20.3867 14.1141 20.1681 14.756 19.731 15.1821C19.2938 15.6138 18.6436 15.8296 17.7803 15.8296H2.60645ZM2.62305 14.4932H17.7554C18.1649 14.4932 18.4831 14.3853 18.71 14.1694C18.9368 13.9481 19.0503 13.6216 19.0503 13.1899V4.64014C19.0503 4.2085 18.9368 3.88477 18.71 3.66895C18.4831 3.44759 18.1649 3.33691 17.7554 3.33691H15.0742C14.6979 3.33691 14.3936 3.29541 14.1611 3.2124C13.9342 3.12386 13.7157 2.96338 13.5054 2.73096L12.8579 2.00049C12.62 1.73486 12.4097 1.55778 12.2271 1.46924C12.0444 1.3807 11.7705 1.33643 11.4053 1.33643H8.92334C8.55811 1.33643 8.28418 1.3807 8.10156 1.46924C7.91895 1.55778 7.70866 1.73486 7.4707 2.00049L6.82324 2.73096C6.61296 2.96338 6.3916 3.12386 6.15918 3.2124C5.93229 3.29541 5.6307 3.33691 5.25439 3.33691H2.62305C2.21354 3.33691 1.89535 3.44759 1.66846 3.66895C1.4471 3.88477 1.33643 4.2085 1.33643 4.64014V13.1899C1.33643 13.6216 1.4471 13.9481 1.66846 14.1694C1.89535 14.3853 2.21354 14.4932 2.62305 14.4932ZM10.1934 13.2979C9.5625 13.2979 8.97314 13.1816 8.42529 12.9492C7.87744 12.7168 7.396 12.3931 6.98096 11.978C6.57145 11.563 6.24772 11.0815 6.00977 10.5337C5.77734 9.98584 5.66113 9.39372 5.66113 8.75732C5.66113 8.12646 5.77734 7.53711 6.00977 6.98926C6.24772 6.44141 6.57145 5.95996 6.98096 5.54492C7.396 5.12988 7.87744 4.80615 8.42529 4.57373C8.97314 4.34131 9.5625 4.2251 10.1934 4.2251C11.029 4.2251 11.7899 4.42708 12.4761 4.83105C13.1623 5.23503 13.7074 5.78011 14.1113 6.46631C14.5153 7.15251 14.7173 7.91618 14.7173 8.75732C14.7173 9.39372 14.6011 9.98584 14.3687 10.5337C14.1362 11.0815 13.8125 11.563 13.3975 11.978C12.9824 12.3931 12.501 12.7168 11.9531 12.9492C11.4053 13.1816 10.8187 13.2979 10.1934 13.2979ZM10.1934 12.0361C10.7965 12.0361 11.3444 11.8895 11.8369 11.5962C12.335 11.3029 12.7306 10.91 13.0239 10.4175C13.3172 9.91943 13.4639 9.36605 13.4639 8.75732C13.4639 8.15413 13.3172 7.60628 13.0239 7.11377C12.7306 6.61572 12.335 6.22005 11.8369 5.92676C11.3444 5.62793 10.7965 5.47852 10.1934 5.47852C9.59017 5.47852 9.03955 5.62793 8.5415 5.92676C8.04899 6.22005 7.65332 6.61572 7.35449 7.11377C7.0612 7.60628 6.91455 8.15413 6.91455 8.75732C6.91455 9.36605 7.0612 9.91943 7.35449 10.4175C7.65332 10.91 8.04899 11.3029 8.5415 11.5962C9.03955 11.8895 9.59017 12.0361 10.1934 12.0361Z"
              fill={colors.accent.lightGreyBlue}
            />
          </Svg>
          <Text style={historyStyles.navText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={historyStyles.navItem}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {/* Clock circle */}
            <Circle cx="12" cy="12" r="10" stroke={colors.primary} strokeWidth="2" fill="none" />
            {/* Clock hands */}
            <Path
              d="M12 8V12L15 15"
              stroke={colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={[historyStyles.navText, { color: colors.primary }]}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={historyStyles.navItem} onPress={onAboutClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={colors.text.white} strokeWidth="2" fill="none" />
            <Path
              d="M12 16V12M12 8H12.01"
              stroke={colors.text.white}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
          <Text style={historyStyles.navText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={historyStyles.navItem} onPress={onProfileClick}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill={colors.text.white}
            />
          </Svg>
          <Text style={historyStyles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
};

export default HistoryScreen;

