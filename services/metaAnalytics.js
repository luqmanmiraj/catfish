/**
 * Meta (Facebook) Analytics Service
 * Wrapper for Meta SDK event tracking with AEM support
 */

import { Settings, AppEventsLogger } from 'react-native-fbsdk-next';
import { Platform } from 'react-native';

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
  if (!isInitialized) {
    console.warn('Meta SDK not initialized, skipping event:', eventName);
    return;
  }

  try {
    // Generate event ID for deduplication (AEM requirement)
    const eventId = generateEventId();

    // Prepare parameters for Meta SDK
    // Meta SDK expects parameters in a specific format
    const params = {
      ...eventParams,
      _eventId: eventId, // For deduplication
    };

    // Add user ID if available
    if (currentUserId) {
      params._user_id = currentUserId;
    }

    // Log event with Meta SDK
    AppEventsLogger.logEvent(eventName, params);

    console.log(`Meta event tracked: ${eventName}`, params);
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
