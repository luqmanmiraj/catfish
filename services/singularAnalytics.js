/**
 * Singular Analytics Service
 * Wrapper for Singular SDK event tracking
 */

import Constants from 'expo-constants';

// Conditionally import Singular SDK - only available in development builds, not in Expo Go
let Singular = null;
let SingularConfig = null;
try {
  const isExpoGo = Constants.appOwnership === 'expo';
  if (!isExpoGo) {
    const SingularSDK = require('singular-react-native');
    Singular = SingularSDK.Singular;
    SingularConfig = SingularSDK.SingularConfig;
  } else {
    console.log('Running in Expo Go - Singular SDK not available');
  }
} catch (error) {
  console.log('Singular SDK module not available:', error.message);
}

let isInitialized = false;
let currentUserId = null;
let singularApiKey = null;
let singularSecret = null;

/**
 * Initialize Singular SDK
 * @param {Object} config - Configuration object
 * @param {string} config.apiKey - Singular SDK Key
 * @param {string} config.secret - Singular SDK Secret
 */
export async function initialize(config = {}) {
  try {
    // Check if Singular SDK is available (not in Expo Go)
    if (!Singular || !SingularConfig) {
      console.warn('Singular SDK not available (running in Expo Go). App will continue without Singular analytics.');
      return;
    }

    singularApiKey = config.apiKey;
    singularSecret = config.secret;

    if (!singularApiKey || !singularSecret) {
      console.warn('Singular API Key or Secret not provided, Singular analytics will be disabled');
      return;
    }

    // Initialize Singular SDK
    const singularConfig = new SingularConfig(singularApiKey, singularSecret)
      .withLoggingEnabled(false); // Set to true for debugging
    
    Singular.init(singularConfig);
    
    isInitialized = true;
    console.log('Singular SDK initialized');
  } catch (error) {
    console.error('Error initializing Singular SDK:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Set user ID for Singular analytics
 * @param {string} userId - User ID to set
 */
export async function setUserId(userId) {
  try {
    currentUserId = userId;
    if (Singular && isInitialized && userId) {
      Singular.setCustomUserId(userId);
    }
  } catch (error) {
    console.error('Error setting Singular user ID:', error);
  }
}

/**
 * Clear user ID
 */
export async function clearUserId() {
  try {
    currentUserId = null;
    if (Singular && isInitialized) {
      Singular.unsetCustomUserId();
    }
  } catch (error) {
    console.error('Error clearing Singular user ID:', error);
  }
}

/**
 * Track an event with Singular SDK
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Event parameters
 */
export async function trackEvent(eventName, eventParams = {}) {
  if (!Singular || !isInitialized) {
    console.warn('Singular SDK not initialized, skipping event:', eventName);
    return;
  }

  try {
    Singular.eventWithArgs(eventName, eventParams);
    console.log(`Singular event tracked: ${eventName}`, {
      ...eventParams,
      user_id: currentUserId,
    });
  } catch (error) {
    console.error(`Error tracking Singular event ${eventName}:`, error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

export default {
  initialize,
  setUserId,
  clearUserId,
  trackEvent,
};
