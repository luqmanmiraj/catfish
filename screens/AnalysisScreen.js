import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image, Text, Animated, Alert } from 'react-native';
import { File } from 'expo-file-system/next';
import { analysisStyles } from '../styles';
import colors from '../colors';
import apiConfig from '../config/apiConfig';
import { logDeviceMetadata, getDeviceId } from '../utils/deviceLogger';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import { useAuth } from '../context/AuthContext';

const AnalysisScreen = ({ imageUri, onComplete }) => {
  const { accessToken } = useAuth();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    'Preparing image for analysis...'
  );
  const progressAnim = useRef(new Animated.Value(0)).current;
  const hasRequestedRef = useRef(false); // Prevent duplicate API calls across re-renders
  const previousImageUriRef = useRef(null); // Track previous image to detect actual changes

  useEffect(() => {
    let isCancelled = false;
    let isRequestInProgress = false;
    
    // Sync progress state with animated value for percentage display
    const listenerId = progressAnim.addListener(({ value }) => {
      if (!isCancelled) {
        setProgress(Math.round(value * 100));
      }
    });

    const analyzeWithLambda = async () => {
      if (!imageUri) {
        return;
      }

      // Check if this is a NEW image (different from previous)
      const isNewImage = imageUri !== previousImageUriRef.current;
      
      if (isNewImage) {
        console.log('🔄 NEW image detected, allowing analysis');
        console.log('  Previous URI:', previousImageUriRef.current?.substring(0, 50) + '...');
        console.log('  New URI:', imageUri?.substring(0, 50) + '...');
        // Reset flags for new image
        hasRequestedRef.current = false;
        previousImageUriRef.current = imageUri;
      }

      // Prevent duplicate API calls (both within effect and across re-renders)
      if (isRequestInProgress || hasRequestedRef.current) {
        console.log('⚠️ API request already in progress or completed, skipping duplicate call');
        console.log('  - isRequestInProgress:', isRequestInProgress);
        console.log('  - hasRequestedRef.current:', hasRequestedRef.current);
        console.log('  - imageUri:', imageUri?.substring(0, 50) + '...');
        return;
      }
      
      isRequestInProgress = true;
      hasRequestedRef.current = true;
      console.log('🔒 API request started - duplicate calls blocked');
      console.log('📊 This should only appear ONCE per image');
      console.log('📸 Image URI:', imageUri?.substring(0, 50) + '...');

      try {
        setStatusMessage('Preparing image for analysis...');
        
        // Convert local image URI to base64 using new File API
        // Lambda handler expects base64 data URL format
        const file = new File(imageUri);
        const base64Image = await file.base64();
        
        // Determine image format from URI
        const imageFormat = imageUri.toLowerCase().includes('.png') 
          ? 'png' 
          : imageUri.toLowerCase().includes('.webp')
          ? 'webp'
          : 'jpeg';
        
        // Format as data URL for Lambda
        const imageDataUrl = `data:image/${imageFormat};base64,${base64Image}`;

        setStatusMessage('Uploading image and analyzing...');
        
        // Update progress animation to show we're making progress
        Animated.timing(progressAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: false,
        }).start();

        // Call Lambda endpoint (configurable: 'analyze' or 'gowinston/detect')
        const lambdaEndpoint = `${apiConfig.API_BASE_URL}/${apiConfig.ANALYSIS_ENDPOINT || 'gowinston/detect'}`;
        // Log device info before request
        await logDeviceMetadata(null, lambdaEndpoint);
        
        // Prepare headers with Authorization token and Device ID
        const deviceId = await getDeviceId();
        const headers = {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId,
        };
        
        // Add Authorization header with token if available
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
          console.log('Including Authorization token in request');
        } else {
          console.warn('No access token available, request will be sent without authentication');
        }
        
        // Prepare request body (include deviceId as fallback in case header is stripped)
        const requestBody = {
          image: imageDataUrl,
          deviceId: deviceId,
        };
        
        // Log request details (without full base64 image data)
        console.log('📤 SCAN API REQUEST:');
        console.log('URL:', lambdaEndpoint);
        console.log('Method: POST');
        console.log('Headers:', JSON.stringify(headers, null, 2));
        console.log('Request Body (image data length):', {
          imageDataLength: imageDataUrl.length,
          imageFormat: imageFormat,
          hasImageData: !!imageDataUrl,
        });
        
        console.log('🚀 Sending API request (should only happen ONCE per image)');
        
        const response = await fetch(lambdaEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
        });

        isRequestInProgress = false;
        console.log('🔓 API request completed successfully - duplicate calls unblocked');

        // Log response status
        console.log('📥 SCAN API RESPONSE STATUS:');
        console.log('Status:', response.status, response.statusText);
        console.log('Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
        
        const json = await response.json();
        
        // Log full response in a clearly formatted way
        console.log('📥 SCAN API RESPONSE JSON:');
        console.log('==========================================');
        console.log(JSON.stringify(json, null, 2));
        console.log('==========================================');

        if (isCancelled) {
          return;
        }

        // Handle error responses from Lambda
        if (!response.ok || !json.success) {
          console.error('Lambda error response:', response.status, json);
          // Use the error message from the response, the errorMessages utility
          // will convert it to a user-friendly message in the catch block
          throw new Error(json?.error || 'Analysis request failed');
        }

        setStatusMessage('Processing results...');
        
        // Animate progress bar to 100% before completing
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start(() => {
          if (isCancelled) {
            return;
          }
          setProgress(100);
          if (onComplete) {
            console.log('Calling onComplete callback with Lambda analysis result');
            // Pass the full Lambda response including s3Url, requestId, and tokenBalance
            // Lambda returns: { success: true, s3Url: "...", analysis: {...}, requestId: "...", tokenBalance: X, scansRemaining: X }
            // Merge analysis data with response metadata
            const result = {
              ...(json.analysis || json),
              s3Url: json.s3Url || null,
              requestId: json.requestId || null,
              // Include token balance from Lambda response (already decremented by Lambda)
              tokenBalance: json.tokenBalance !== undefined ? json.tokenBalance : null,
              scansRemaining: json.scansRemaining !== undefined ? json.scansRemaining : (json.tokenBalance !== undefined ? json.tokenBalance : null),
            };
            onComplete(result);
          }
        });
      } catch (error) {
        console.error('Error analyzing image with Lambda:', error);
        isRequestInProgress = false;
        console.log('🔓 API request completed (with error) - duplicate calls unblocked');
        
        if (isCancelled) {
          return;
        }
        // Show only a friendly popup — no raw error in the status text
        setStatusMessage('');
        const friendlyMessage = getFriendlyErrorMessage(error, 'analysis');
        Alert.alert('Scan Failed', friendlyMessage, [{ text: 'OK' }]);

        // Complete the progress so user can go back / retry
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setProgress(100);
          if (onComplete) {
            onComplete(null);
          }
        });
      }
    };

    analyzeWithLambda();

    return () => {
      isCancelled = true;
      isRequestInProgress = false;
      // Note: We DON'T reset hasRequestedRef here to keep flag sticky
      // It only resets when a truly NEW image is selected
      progressAnim.removeListener(listenerId);
      console.log('🧹 AnalysisScreen cleanup - request flag kept sticky');
    };
    // Note: accessToken is intentionally not in dependencies - we read it from context when needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUri, progressAnim, onComplete]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={analysisStyles.container}>
      {/* Image Container */}
      <View style={analysisStyles.imageContainer}>
        <Image source={{ uri: imageUri }} style={analysisStyles.image} resizeMode="cover" />
      </View>

      {/* Analysis Progress Section */}
      <View style={analysisStyles.progressSection}>
        {/* Progress Bar */}
        <View style={analysisStyles.progressBarContainer}>
          <Animated.View
            style={[
              analysisStyles.progressBarFill,
              { width: progressWidth },
            ]}
          />
        </View>

        {/* Percentage and Analyzing Text Row */}
        <View style={analysisStyles.progressTextRow}>
          <Text style={analysisStyles.analyzingText}>Analyzing</Text>
          <Text style={analysisStyles.percentageText}>{Math.round(progress)}%</Text>
        </View>

        {/* Status Message */}
        <Text style={analysisStyles.statusMessage}>{statusMessage}</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
};

export default AnalysisScreen;

