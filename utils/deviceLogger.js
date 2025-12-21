/**
 * Device Metadata Logger
 * Logs device information before API calls for debugging and analytics
 */

import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as authStorage from '../services/authStorage';

/**
 * Get device ID (Android ID on Android, Installation ID on iOS)
 */
export async function getDeviceId() {
  try {
    if (Platform.OS === 'android') {
      // Try to get Android ID (available in Expo SDK 51+)
      try {
        const androidId = await Application.getAndroidId();
        if (androidId) {
          return androidId;
        }
      } catch (error) {
        console.warn('Could not get Android ID:', error);
      }
    }
    
    // Fallback to installation ID (works on both platforms)
    try {
      const installationId = await Application.getInstallationIdAsync();
      return installationId;
    } catch (error) {
      console.warn('Could not get installation ID:', error);
    }
    
    // Last resort: generate a fallback ID
    return `device-${Platform.OS}-${Date.now()}`;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return `device-unknown-${Date.now()}`;
  }
}

/**
 * Get platform information
 */
function getPlatformInfo() {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isDevice: Device.isDevice,
    brand: Device.brand || 'unknown',
    modelName: Device.modelName || 'unknown',
    osName: Device.osName || Platform.OS,
    osVersion: Device.osVersion || String(Platform.Version),
  };
}

/**
 * Extract purpose/endpoint name from URL for logging
 * @param {string} url - Full URL or endpoint path
 * @returns {string} - Extracted purpose name
 */
function extractPurposeFromUrl(url) {
  if (!url) return 'unknown';
  
  // Extract endpoint path
  let endpoint = url;
  try {
    const urlObj = new URL(url);
    endpoint = urlObj.pathname;
  } catch {
    // If URL parsing fails, assume it's already an endpoint path
    endpoint = url.startsWith('/') ? url : `/${url}`;
  }
  
  // Map common endpoints to readable purposes
  const endpointMap = {
    '/auth/signup': 'user_signup',
    '/auth/signin': 'user_signin',
    '/auth/guest-signup': 'guest_signup',
    '/auth/confirm-signup': 'email_verification',
    '/auth/resend-confirmation': 'resend_verification',
    '/auth/refresh-token': 'token_refresh',
    '/auth/forgot-password': 'forgot_password',
    '/auth/confirm-forgot-password': 'reset_password',
    '/auth/user': 'get_user_info',
    '/subscription/status': 'subscription_status',
    '/subscription/check': 'subscription_check',
    '/subscription/increment': 'subscription_increment',
    '/analyze': 'image_analysis',
    '/scan-history': 'scan_history',
  };
  
  // Try exact match first
  if (endpointMap[endpoint]) {
    return endpointMap[endpoint];
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(endpointMap)) {
    if (endpoint.includes(key)) {
      return value;
    }
  }
  
  // Extract from path segments
  const segments = endpoint.split('/').filter(Boolean);
  if (segments.length > 0) {
    return segments.join('_');
  }
  
  return 'api_request';
}

/**
 * Log device metadata before API call
 * @param {string} purpose - Purpose of the API call (e.g., 'image_analysis', 'user_signin', 'subscription_check')
 * @param {string} url - Optional URL to extract purpose from if not provided
 */
export async function logDeviceMetadata(purpose, url = null) {
  try {
    // Auto-extract purpose from URL if not provided
    const finalPurpose = purpose || (url ? extractPurposeFromUrl(url) : 'unknown');
    
    const deviceId = await getDeviceId();
    const platformInfo = getPlatformInfo();
    const accessToken = await authStorage.getAccessToken();
    
    // Safely get Android ID
    let androidId = null;
    if (Platform.OS === 'android') {
      try {
        androidId = await Application.getAndroidId();
      } catch (error) {
        // getAndroidId might not be available or might fail
        androidId = null;
      }
    }
    
    const metadata = {
      timestamp: new Date().toISOString(),
      purpose: finalPurpose,
      url: url || 'unknown',
      device: {
        deviceId: deviceId,
        androidId: androidId,
        platform: platformInfo.platform,
        platformVersion: platformInfo.version,
        isDevice: platformInfo.isDevice,
        brand: platformInfo.brand,
        modelName: platformInfo.modelName,
        osName: platformInfo.osName,
        osVersion: platformInfo.osVersion,
      },
      auth: {
        isLoggedIn: !!accessToken,
        hasToken: !!accessToken,
        tokenPreview: accessToken ? `${accessToken.substring(0, 20)}...` : null,
      },
    };
    
    // Log the metadata
    console.log('📱 Device Metadata for API Request:', JSON.stringify(metadata, null, 2));
    
    return metadata;
  } catch (error) {
    console.error('Error logging device metadata:', error);
    // Return minimal metadata even on error
    return {
      timestamp: new Date().toISOString(),
      purpose: purpose || 'unknown',
      url: url || 'unknown',
      error: error.message,
      device: {
        platform: Platform.OS,
        platformVersion: Platform.Version,
      },
      auth: {
        isLoggedIn: false,
      },
    };
  }
}

/**
 * Wrapper for fetch that automatically logs device info before every request
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithDeviceLogging(url, options = {}) {
  // Log device info before the request
  await logDeviceMetadata(null, url);
  
  // Make the actual fetch request
  return fetch(url, options);
}

export default {
  logDeviceMetadata,
  getDeviceId,
  getPlatformInfo,
  fetchWithDeviceLogging,
};
