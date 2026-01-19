/**
 * Meta (Facebook) Analytics Service
 * Wrapper for Meta SDK event tracking with AEM support
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Conditionally import Meta SDK - only available in development builds, not in Expo Go
let Settings = null;
let AppEventsLogger = null;
try {
  const isExpoGo = Constants.appOwnership === 'expo';
  if (!isExpoGo) {
    const MetaSDK = require('react-native-fbsdk-next');
    Settings = MetaSDK.Settings;
    AppEventsLogger = MetaSDK.AppEventsLogger;
  } else {
    console.log('Running in Expo Go - Meta SDK not available');
  }
} catch (error) {
  console.log('Meta SDK module not available:', error.message);
}

let isInitialized = false;
let currentUserId = null;
let metaAppId = null;
let metaPixelId = null;

/**
 * Initialize Meta SDK
 * @param {Object} config - Configuration object
 * @param {string} config.appId - Facebook App ID
 * @param {string} config.pixelId - Meta Pixel ID (optional, for CAPI)
 */
export async function initialize(config = {}) {
  try {
    // Check if Meta SDK is available (not in Expo Go)
    if (!Settings || !AppEventsLogger) {
      console.warn('Meta SDK not available (running in Expo Go). App will continue without Meta analytics.');
      return;
    }

    metaAppId = config.appId;
    metaPixelId = config.pixelId;

    if (!metaAppId) {
      console.warn('Meta App ID not provided, Meta analytics will be disabled');
      return;
    }

    // Set app ID for Meta SDK
    Settings.setAppID(metaAppId);
    
    // Enable auto-logging of app events (optional)
    Settings.setAdvertiserTrackingEnabled(true);

    isInitialized = true;
    console.log('Meta SDK initialized');
  } catch (error) {
    console.error('Error initializing Meta SDK:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Set user ID for Meta analytics
 * @param {string} userId - User ID to set
 */
export async function setUserId(userId) {
  try {
    currentUserId = userId;
    // Meta SDK automatically tracks user ID through AppEventsLogger
  } catch (error) {
    console.error('Error setting Meta user ID:', error);
  }
}

/**
 * Clear user ID
 */
export async function clearUserId() {
  try {
    currentUserId = null;
  } catch (error) {
    console.error('Error clearing Meta user ID:', error);
  }
}

/**
 * Generate event ID for deduplication (AEM requirement)
 * @returns {string} Event ID
 */
function generateEventId() {
  // Generate a unique event ID using timestamp and random number
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Track an event with Meta SDK
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Event parameters
 */
export async function trackEvent(eventName, eventParams = {}) {
  if (!AppEventsLogger || !isInitialized) {
    console.warn('Meta SDK not initialized, skipping event:', eventName);
    return;
  }

  try {
    // Extract event ID from params if provided (for deduplication with CAPI)
    // Otherwise generate a new one
    const eventId = eventParams._eventId || generateEventId();

    // Prepare parameters for Meta SDK
    // Meta SDK expects parameters in a specific format
    // Remove _eventId from params as it's handled separately
    const { _eventId, _user_id, ...cleanParams } = eventParams;
    
    const params = {
      ...cleanParams,
    };

    // Add user ID if available (use provided _user_id or currentUserId)
    const userId = _user_id || currentUserId;
    if (userId) {
      params._user_id = userId;
    }

    // Log event with Meta SDK
    // Note: Meta SDK doesn't directly support event_id in logEvent
    // We'll include it in params for tracking purposes
    AppEventsLogger.logEvent(eventName, params);

    console.log(`Meta event tracked: ${eventName}`, { ...params, eventId });
  } catch (error) {
    console.error(`Error tracking Meta event ${eventName}:`, error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Track purchase event (special handling for Meta)
 * @param {Object} params - Purchase parameters
 */
export async function trackPurchase(params = {}) {
  if (!AppEventsLogger || !isInitialized) {
    console.warn('Meta SDK not initialized, skipping purchase event');
    return;
  }

  const { value, currency = 'USD', ...otherParams } = params;

  try {
    // Use Meta's built-in purchase event
    if (value !== undefined) {
      AppEventsLogger.logPurchase(value, currency, {
        ...otherParams,
        _eventId: generateEventId(),
        _user_id: currentUserId,
      });
    } else {
      // Fallback to custom event
      await trackEvent('PurchaseCompleted', params);
    }
  } catch (error) {
    console.error('Error tracking Meta purchase:', error);
  }
}

export default {
  initialize,
  setUserId,
  clearUserId,
  trackEvent,
  trackPurchase,
};
