import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import Svg, { Path, Circle, Line, G, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { resultsStyles } from '../styles';
import colors from '../colors';

const ResultsScreen = ({ imageUri, analysisResult, onScanAgain, onShare, onSave, onClose }) => {
  // Debug: Log the analysis result to see what we're receiving
  console.log('ResultsScreen - Full analysisResult:', JSON.stringify(analysisResult, null, 2));
  console.log('ResultsScreen - analysisResult?.status:', analysisResult?.status);
  console.log('ResultsScreen - analysisResult keys:', analysisResult ? Object.keys(analysisResult) : 'null');

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return `${date} • ${time}`;
  };

  // Check if status is deepfake_detected, authentic, or unknown/empty/no result
  const isDeepfakeDetected = analysisResult?.status === 'deepfake_detected';
  const isAuthentic = analysisResult?.status === 'authentic';
  const isUnknown = 
    !analysisResult?.status ||
    analysisResult?.status === 'empty' ||
    analysisResult?.status === 'no_result' ||
    analysisResult?.status === 'unknown' ||
    analysisResult?.status === 'inconclusive'||
    analysisResult?.status === 'unverifiable' ||
    analysisResult?.status === 'unverified';
  
  // Debug: Log the status checks
  console.log('ResultsScreen - Status checks:', {
    isDeepfakeDetected,
    isAuthentic,
    isUnknown,
    statusValue: analysisResult?.status
  });
  const getSummaryFromResult = () => {
    if (!analysisResult) {
      return {
        headline: 'Inconclusive',
        subheadline: 'Insufficient data for analysis',
      };
    }

    // If status is explicitly set, use it
    if (isDeepfakeDetected) {
      const confidence = analysisResult?.confidence ?? analysisResult?.deepfakeScore ?? analysisResult?.score ?? null;
      let subheadline = 'High confidence fake or AI';
      if (confidence != null) {
        const pct = Math.round(Number(confidence));
        if (!Number.isNaN(pct)) {
          subheadline = `High confidence fake or AI (${pct}% confidence)`;
        }
      }
      return {
        headline: 'Confirmed Fake / AI Generated',
        subheadline: subheadline,
      };
    }

    if (isAuthentic) {
      const confidence = analysisResult?.confidence ?? analysisResult?.score ?? null;
      let subheadline = 'High authenticity confidence';
      if (confidence != null) {
        const pct = Math.round(Number(confidence));
        if (!Number.isNaN(pct)) {
          subheadline = `${pct}% confidence`;
        }
      }
      return {
        headline: 'Likely Real',
        subheadline: subheadline,
      };
    }

    if (isUnknown) {
      return {
        headline: 'Inconclusive',
        subheadline: 'Insufficient data for analysis',
      };
    }

    // Fallback to old logic for backward compatibility
    const isAIGenerated =
      analysisResult.ai_generated === true ||
      analysisResult.ai_generated === 'ai_generated' ||
      analysisResult?.ai_generated?.label === 'ai_generated';

    const confidence =
      analysisResult?.score ??
      analysisResult?.ai_generated?.score ??
      null;

    const source =
      analysisResult?.source ??
      analysisResult?.ai_generated?.source ??
      null;

    const headline = isAIGenerated ? 'Likely AI-Generated' : 'Likely Real';

    let subheadlineParts = [];
    if (confidence != null) {
      const pct = Math.round(Number(confidence) * 100);
      if (!Number.isNaN(pct)) {
        subheadlineParts.push(`${pct}% confidence`);
      }
    }
    if (source) {
      subheadlineParts.push(`Source: ${source}`);
    }

    const subheadline =
      subheadlineParts.length > 0
        ? subheadlineParts.join(' • ')
        : isAIGenerated
          ? 'Image shows patterns consistent with AI generation.'
          : 'High authenticity confidence';

    return {
      headline,
      subheadline,
    };
  };

  const { headline, subheadline } = getSummaryFromResult();

  // Get metadata values with fallbacks
  const getMetadata = () => {
    if (!analysisResult?.metadata) {
      return {
        detectionAlgorithm: 'AI Pattern Recognition v2.1',
        processingTime: '3.2s',
        imageQuality: 'High Resolution',
      };
    }
    return {
      detectionAlgorithm: analysisResult.metadata.detectionAlgorithm || 'AI Pattern Recognition v2.1',
      processingTime: analysisResult.metadata.processingTime || '3.2s',
      imageQuality: analysisResult.metadata.imageQuality || 'High Resolution',
    };
  };

  const metadata = getMetadata();
  const primaryMessage = analysisResult?.primaryMessage || 
    (isDeepfakeDetected 
      ? 'We can say with high confidence that this image was partially or completely created or altered using AI.'
      : isUnknown
        ? 'Image quality too low or insufficient data to verify authenticity.'
        : 'Below is a summary of the Hive AI analysis for this image.');

  // Render icon based on status
  const renderIcon = () => {
    if (isDeepfakeDetected) {
      // Red warning icon with fish outline and red concentric circles
      return (
        <View style={resultsStyles.shieldContainer}>
          <Svg width="264" height="264" viewBox="100 100 320 320" fill="none">
            <Defs>
              <LinearGradient id="paint0_linear_2048_2859" x1="186.5" y1="186" x2="334.5" y2="334" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#EF4444" stopOpacity="0.19" />
                <Stop offset="1" stopColor="#EF4444" stopOpacity="0.063" />
              </LinearGradient>
              <LinearGradient id="paint1_linear_2048_2859" x1="210.503" y1="205.746" x2="309.503" y2="314.426" gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#EF4444" stopOpacity="0.3" />
                <Stop offset="1" stopColor="#EF4444" stopOpacity="0.1" />
              </LinearGradient>
            </Defs>
            
            {/* Blurred background rectangle */}
            <G opacity="0.24">
              <Rect x="128" y="128" width="264" height="264" rx="132" fill="#EF4444" />
            </G>
            
            {/* Main gradient circle */}
            <Circle cx="260.5" cy="260" r="74" fill="url(#paint0_linear_2048_2859)" />
            
            {/* Blurred path background */}
            <G opacity="0.12">
              <Path
                d="M174.698 240.365C174.698 193.53 212.665 155.563 259.5 155.563C306.335 155.563 344.302 193.53 344.302 240.365V276.895C344.302 323.73 306.335 361.698 259.5 361.698C212.665 361.698 174.698 323.73 174.698 276.895V240.365Z"
                fill="#EF4444"
              />
            </G>
            
            {/* Shield paths */}
            <Path
              d="M230.24 207.571C249.093 197.247 271.907 197.247 290.76 207.571L293.24 208.929C311.899 219.147 323.5 238.727 323.5 260C323.5 281.273 311.899 300.853 293.24 311.071L290.76 312.429C271.907 322.753 249.093 322.753 230.24 312.429L227.76 311.071C209.101 300.853 197.5 281.273 197.5 260C197.5 238.727 209.101 219.147 227.76 208.929L230.24 207.571Z"
              fill="#192D41"
              fillOpacity="0.6"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <Path
              d="M237.637 217.074C251.697 209.952 268.309 209.952 282.369 217.074L283.409 217.601C299.415 225.707 309.503 242.125 309.503 260.066C309.503 278.008 299.415 294.425 283.409 302.532L282.369 303.059C268.309 310.18 251.697 310.18 237.637 303.059L236.596 302.532C220.591 294.425 210.503 278.008 210.503 260.066C210.503 242.125 220.591 225.707 236.596 217.601L237.637 217.074Z"
              fill="url(#paint1_linear_2048_2859)"
              stroke="#EF4444"
              strokeOpacity="0.3"
              strokeWidth="2"
            />
            
            {/* Outer circle */}
            <Circle cx="260.5" cy="260" r="93" stroke="#EF4444" strokeWidth="2" />
            
            {/* Fish icon */}
            <Path
              d="M272 260V261M268 271.86C265.398 268.454 263.989 264.286 263.989 260C263.989 255.714 265.398 251.546 268 248.14M250 257.34C250 252 247.16 247.94 241.46 247C239.46 250 239.46 257 241.92 260C239.44 263 239.44 270 241.46 273C247.16 272.06 250 268 250 262.66M256.92 250.52C256.4 247.76 254.34 244.48 252 242H263.6C264.549 241.996 265.468 242.33 266.194 242.942C266.919 243.554 267.403 244.404 267.56 245.34L268.02 248.14M268.02 271.86L267.56 274.66C267.403 275.596 266.919 276.446 266.194 277.058C265.468 277.67 264.549 278.004 263.6 278H255C256.938 275.803 257.998 272.969 257.98 270.04M249 260C250.88 253.08 258.88 248 266 248C273.12 248 278.12 253.08 280 260C278.12 266.94 273.12 272 266 272C258.88 272 250.88 266.94 249 260Z"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      );
    }

    if (isUnknown) {
      // Inconclusive icon - camera focus reticle with light grey circles
      return (
        <View style={resultsStyles.shieldContainer}>
          <Svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            {/* Light grey concentric circles */}
            <Circle cx="100" cy="100" r="90" fill="rgba(160, 180, 200, 0.2)" />
            <Circle cx="100" cy="100" r="70" fill="rgba(160, 180, 200, 0.3)" />
            <Circle cx="100" cy="100" r="50" fill="rgba(160, 180, 200, 0.4)" />
            
            {/* Search icon - centered in the 200x200 SVG */}
            <G transform="translate(76, 76)">
              <Path
                d="M6 14V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H14M34 6H38C39.0609 6 40.0783 6.42143 40.8284 7.17157C41.5786 7.92172 42 8.93913 42 10V14M42 34V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H34M14 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V34M32 32L28.2 28.2M30 24C30 27.3137 27.3137 30 24 30C20.6863 30 18 27.3137 18 24C18 20.6863 20.6863 18 24 18C27.3137 18 30 20.6863 30 24Z"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </G>
          </Svg>
        </View>
      );
    }

    // Default green shield for authentic/real
    return (
      <View style={resultsStyles.shieldContainer}>
        <Svg width="264" height="264" viewBox="90 90 320 320" fill="none">
          <Defs>
            <LinearGradient id="paint0_linear_2048_2860" x1="186.5" y1="186" x2="334.5" y2="334" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#00C853" stopOpacity="0.19" />
              <Stop offset="1" stopColor="#00C853" stopOpacity="0.063" />
            </LinearGradient>
            <LinearGradient id="paint1_linear_2048_2860" x1="210.503" y1="205.746" x2="309.503" y2="314.426" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#00C853" stopOpacity="0.3" />
              <Stop offset="1" stopColor="#00C853" stopOpacity="0.1" />
            </LinearGradient>
          </Defs>
          
          {/* Blurred background rectangle */}
          <G opacity="0.24">
            <Rect x="128" y="128" width="264" height="264" rx="132" fill="#22C55E" />
          </G>
          
          {/* Main gradient circle */}
          <Circle cx="260.5" cy="260" r="74" fill="url(#paint0_linear_2048_2860)" />
          
          {/* Blurred rectangle background */}
          <G opacity="0.12">
            <Rect x="166.5" y="166" width="188" height="188" rx="94" fill="#00C853" />
          </G>
          
          {/* Shield paths */}
          <Path
            d="M230.24 207.571C249.093 197.247 271.907 197.247 290.76 207.571L293.24 208.929C311.899 219.147 323.5 238.727 323.5 260C323.5 281.273 311.899 300.853 293.24 311.071L290.76 312.429C271.907 322.753 249.093 322.753 230.24 312.429L227.76 311.071C209.101 300.853 197.5 281.273 197.5 260C197.5 238.727 209.101 219.147 227.76 208.929L230.24 207.571Z"
            fill="#192D41"
            fillOpacity="0.6"
            stroke="#00C853"
            strokeWidth="2"
          />
          <Path
            d="M237.637 217.074C251.697 209.952 268.309 209.952 282.369 217.074L283.409 217.601C299.415 225.707 309.503 242.125 309.503 260.066C309.503 278.008 299.415 294.425 283.409 302.532L282.369 303.059C268.309 310.18 251.697 310.18 237.637 303.059L236.596 302.532C220.591 294.425 210.503 278.008 210.503 260.066C210.503 242.125 220.591 225.707 236.596 217.601L237.637 217.074Z"
            fill="url(#paint1_linear_2048_2860)"
            stroke="#00C853"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
          
          {/* Outer circle */}
          <Circle cx="260.5" cy="260" r="93" stroke="#00C853" strokeWidth="2" />
          
          {/* Checkmark icon */}
          <Path
            d="M248.752 273.82C249.605 271.524 251.141 269.545 253.152 268.147C255.163 266.75 257.554 266.001 260.003 266.002C262.452 266.002 264.843 266.752 266.853 268.151C268.863 269.55 270.398 271.53 271.25 273.826M276 262C276 272 269 277 260.68 279.9C260.244 280.048 259.771 280.041 259.34 279.88C251 277 244 272 244 262V248C244 247.47 244.211 246.961 244.586 246.586C244.961 246.211 245.47 246 246 246C250 246 255 243.6 258.48 240.56C258.904 240.198 259.443 239.999 260 239.999C260.557 239.999 261.096 240.198 261.52 240.56C265.02 243.62 270 246 274 246C274.53 246 275.039 246.211 275.414 246.586C275.789 246.961 276 247.47 276 248V262ZM268 258C268 262.418 264.418 266 260 266C255.582 266 252 262.418 252 258C252 253.582 255.582 250 260 250C264.418 250 268 253.582 268 258Z"
            stroke="#00C853"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  };

  // Render analysis header icon
  const renderAnalysisIcon = () => {
    if (isDeepfakeDetected) {
      // Red circle with diagonal line (prohibited/stop symbol)
      return (
        <View style={resultsStyles.checkmarkContainer}>
          <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <Circle cx="8.5" cy="8.5" r="8.5" fill="#FF3B30" />
            <Path
              d="M3 3L14 14M14 3L3 14"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );
    }

    if (isUnknown) {
      // Square icon with rounded corners and white "i" for inconclusive
      return (
        <View style={resultsStyles.checkmarkContainer}>
          <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            {/* Rounded square background */}
            <Path
              d="M0 2.5C0 1.11929 1.11929 0 2.5 0H14.5C15.8807 0 17 1.11929 17 2.5V14.5C17 15.8807 15.8807 17 14.5 17H2.5C1.11929 17 0 15.8807 0 14.5V2.5Z"
              fill="#9CA3AF"
            />
            {/* White lowercase "i" */}
            <Circle cx="8.5" cy="5" r="1" fill="white" />
            <Path
              d="M8.5 7V12"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </Svg>
        </View>
      );
    }

    // Green rounded rectangle with white checkmark for authentic
    return (
      <View style={resultsStyles.checkmarkContainer}>
        <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
          <Defs>
            <LinearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="17" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#22C55E" stopOpacity="1" />
              <Stop offset="1" stopColor="#00C853" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {/* Rounded rectangle background with gradient */}
          <Path
            d="M0 3C0 1.34315 1.34315 0 3 0H14C15.6569 0 17 1.34315 17 3V14C17 15.6569 15.6569 17 14 17H3C1.34315 17 0 15.6569 0 14V3Z"
            fill="url(#greenGradient)"
          />
          {/* White checkmark */}
          <Path
            d="M4 8.5L7 11.5L13 5.5"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={resultsStyles.container}>
      {/* Close Button */}
      {onClose && (
        <TouchableOpacity
          style={resultsStyles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={resultsStyles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}
      <ScrollView style={resultsStyles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Scan Summary Section */}
        <View style={resultsStyles.summarySection}>
          <Text style={resultsStyles.scanCompleteText}>Scan Complete</Text>
          <Text style={resultsStyles.dateTimeText}>{getCurrentDateTime()}</Text>

          {/* Icon Graphic - changes based on status */}
          {renderIcon()}

          <Text style={[
            resultsStyles.resultText,
            isDeepfakeDetected && resultsStyles.resultTextWarning,
            isUnknown && resultsStyles.resultTextInconclusive
          ]}>
            {headline}
          </Text>
          <Text style={resultsStyles.confidenceText}>{subheadline}</Text>
        </View>

        {/* Detailed Analysis Section */}
        <View style={resultsStyles.analysisCard}>
          <View style={resultsStyles.analysisHeader}>
            {renderAnalysisIcon()}
            <Text style={resultsStyles.analysisTitle}>Detailed Analysis</Text>
          </View>

          {/* Divider under header */}
          <View style={resultsStyles.analysisDivider} />

          <View style={resultsStyles.analysisSummaryContainer}>
            <Text style={resultsStyles.analysisSummary}>
              {analysisResult
                ? primaryMessage
                : 'No detailed analysis data was returned from the server.'}
            </Text>
          </View>

          <View style={resultsStyles.detailsList}>
            {/* Divider above details list */}
            <View style={resultsStyles.analysisDividerSummary} />
            <View style={resultsStyles.detailRow}>
              <Text style={resultsStyles.detailLabel}>Detection Algorithm</Text>
              <Text style={resultsStyles.detailValue}>{metadata.detectionAlgorithm}</Text>
            </View>
            <View style={resultsStyles.detailRow}>
              <Text style={resultsStyles.detailLabel}>Processing Time</Text>
              <Text style={resultsStyles.detailValue}>{metadata.processingTime}</Text>
            </View>
            <View style={resultsStyles.detailRow}>
              <Text style={resultsStyles.detailLabel}>Image Quality</Text>
              <Text style={resultsStyles.detailValue}>{metadata.imageQuality}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={resultsStyles.actionsContainer}>
          <TouchableOpacity
            style={resultsStyles.scanAgainButton}
            onPress={onScanAgain}
            activeOpacity={0.8}
          >
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <Svg width="20" height="20" viewBox="0 0 528.919 528.918" fill="none">
                <G transform={`rotate(70, 264.46, 264.46)`}>
                  <Path
                    d="M70.846,324.059c3.21,3.926,8.409,3.926,11.619,0l69.162-84.621c3.21-3.926,1.698-7.108-3.372-7.108h-36.723
			c-5.07,0-8.516-4.061-7.427-9.012c18.883-85.995,95.625-150.564,187.207-150.564c105.708,0,191.706,85.999,191.706,191.706
			c0,105.709-85.998,191.707-191.706,191.707c-12.674,0-22.95,10.275-22.95,22.949s10.276,22.949,22.95,22.949
			c131.018,0,237.606-106.588,237.606-237.605c0-131.017-106.589-237.605-237.606-237.605
			c-116.961,0-214.395,84.967-233.961,196.409c-0.878,4.994-5.52,9.067-10.59,9.067H5.057c-5.071,0-6.579,3.182-3.373,7.108
			L70.846,324.059z"
                    fill="white"
                  />
                </G>
              </Svg>
            </View>
            <Text style={resultsStyles.scanAgainText}>Check Another Photo</Text>
          </TouchableOpacity>

          <View style={resultsStyles.bottomActions}>
            <TouchableOpacity
              style={resultsStyles.shareButton}
              onPress={onShare}
              activeOpacity={0.8}
            >
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M18 2L10 10M18 2L12 18L10 10M18 2L2 8L10 10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={resultsStyles.shareButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={resultsStyles.saveButton}
              onPress={onSave}
              activeOpacity={0.8}
            >
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M10 3V13M10 13L6 9M10 13L14 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M3 15V17C3 18.1046 3.89543 19 5 19H15C16.1046 19 17 18.1046 17 17V15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={resultsStyles.saveButtonText}>Save to History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
};

export default ResultsScreen;
