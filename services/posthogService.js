/**
 * PostHog Analytics Service
 * Lightweight product analytics for tracking key app events
 */

import PostHog from 'posthog-react-native';
import apiConfig from '../config/apiConfig';
import { Platform } from 'react-native';

let isInitialized = false;

/**
 * Initialize PostHog SDK
 * @param {Object} options - Optional configuration
 */
export async function initializePostHog(options = {}) {
  // Check if PostHog is disabled (API key is null/empty)
  if (!apiConfig.POSTHOG_API_KEY || apiConfig.POSTHOG_API_KEY.trim() === '') {
    console.warn('PostHog is disabled. App will continue without product analytics.');
    isInitialized = false;
    return;
  }

  if (isInitialized) {
    console.log('PostHog already initialized');
    return;
  }

  try {
    await PostHog.setup(apiConfig.POSTHOG_API_KEY, {
      host: apiConfig.POSTHOG_HOST || 'https://app.posthog.com',
      enableSessionReplay: false, // Disable session replay to keep it lightweight
      captureApplicationLifecycleEvents: false, // Disable automatic events
      captureDeepLinks: false, // Disable deep link tracking
      debug: __DEV__, // Enable debug logging in development
      ...options,
    });

    isInitialized = true;
    console.log('PostHog initialized successfully');
  } catch (error) {
    console.error('Error initializing PostHog:', error);
    // Don't throw - allow app to continue without PostHog
    isInitialized = false;
  }
}

/**
 * Set user ID for analytics
 * @param {string} userId - User ID (Cognito user ID)
 * @param {Object} userProperties - Additional user properties
 */
export function identify(userId, userProperties = {}) {
  if (!isInitialized) {
    console.warn('PostHog not initialized, skipping identify');
    return;
  }

  try {
    PostHog.identify(userId, {
      platform: Platform.OS,
      ...userProperties,
    });
  } catch (error) {
    console.error('Error identifying user in PostHog:', error);
  }
}

/**
 * Clear user identification (e.g., on logout)
 */
export function reset() {
  if (!isInitialized) return;

  try {
    PostHog.reset();
  } catch (error) {
    console.error('Error resetting PostHog user:', error);
  }
}

/**
 * Track an event
 * @param {string} eventName - Name of the event
 * @param {Object} properties - Event properties
 */
export function track(eventName, properties = {}) {
  if (!isInitialized) {
    if (__DEV__) {
      console.log(`[PostHog not initialized] Event: ${eventName}`, properties);
    }
    return;
  }

  try {
    PostHog.capture(eventName, {
      platform: Platform.OS,
      ...properties,
    });
  } catch (error) {
    console.error(`Error tracking event ${eventName} in PostHog:`, error);
  }
}

/**
 * Track app opened event
 */
export function trackAppOpened(properties = {}) {
  track('app_opened', {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Track photo selected event
 */
export function trackPhotoSelected(properties = {}) {
  track('photo_selected', {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Track scan completed event
 */
export function trackScanCompleted(properties = {}) {
  track('scan_completed', {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

/**
 * Track purchase completed event
 */
export function trackPurchaseCompleted(properties = {}) {
  track('purchase_completed', {
    timestamp: new Date().toISOString(),
    ...properties,
  });
}

export default {
  initializePostHog,
  identify,
  reset,
  track,
  trackAppOpened,
  trackPhotoSelected,
  trackScanCompleted,
  trackPurchaseCompleted,
};
