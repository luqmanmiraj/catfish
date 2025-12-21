import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Image, Text, Animated, Alert } from 'react-native';
import { File } from 'expo-file-system/next';
import { analysisStyles } from '../styles';
import colors from '../colors';
import apiConfig from '../config/apiConfig';
import { logDeviceMetadata } from '../utils/deviceLogger';
import { useAuth } from '../context/AuthContext';

const AnalysisScreen = ({ imageUri, onComplete }) => {
  const { accessToken } = useAuth();
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    'Preparing image for analysis...'
  );
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isCancelled = false;
    
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

        // Call Lambda endpoint
        const lambdaEndpoint = `${apiConfig.API_BASE_URL}/analyze`;
        // Log device info before request
        await logDeviceMetadata(null, lambdaEndpoint);
        
        // Prepare headers with Authorization token if available
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // Add Authorization header with token if available
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
          console.log('Including Authorization token in request');
        } else {
          console.warn('No access token available, request will be sent without authentication');
        }
        
        const response = await fetch(lambdaEndpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            image: imageDataUrl,
          }),
        });

        const json = await response.json();
        console.log('Full Lambda response:', JSON.stringify(json, null, 2));

        if (isCancelled) {
          return;
        }

        if (!response.ok || !json.success) {
          console.error('Lambda error response:', json);
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
            // Pass the analysis object from Lambda response
            // Lambda returns: { success: true, s3Url: "...", analysis: {...} }
            // We pass the full analysis object which contains the Hive API response
            onComplete(json.analysis || json);
          }
        });
      } catch (error) {
        console.error('Error analyzing image with Lambda:', error);
        if (isCancelled) {
          return;
        }
        setStatusMessage('Analysis failed. Please try again.');
        Alert.alert(
          'Analysis Error', 
          error.message || 'Unable to analyze image. Please try again.'
        );

        // Still complete the progress so user can go back / retry
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
      progressAnim.removeListener(listenerId);
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
        <View style={analysisStyles.progressHeader}>
          <Text style={analysisStyles.analyzingText}>Analyzing</Text>
          <Text style={analysisStyles.percentageText}>{Math.round(progress)}%</Text>
        </View>
        
        {/* Progress Bar */}
        <View style={analysisStyles.progressBarContainer}>
          <Animated.View
            style={[
              analysisStyles.progressBarFill,
              { width: progressWidth },
            ]}
          />
        </View>

        {/* Status Message */}
        <Text style={analysisStyles.statusMessage}>{statusMessage}</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
};

export default AnalysisScreen;

