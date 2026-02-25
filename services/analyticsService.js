/**
 * Centralized Analytics Service
 * Provides a unified interface for tracking events across multiple analytics platforms
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as MetaAnalytics from './metaAnalytics';
import * as SingularAnalytics from './singularAnalytics';
import apiConfig from '../config/apiConfig';

let isInitialized = false;
let capiEndpoint = null;
let advertiserTrackingEnabled = 0; // ATT consent: 1 = granted, 0 = denied
let deviceInfo = {}; // Device info for CAPI app_data.extinfo

/**
 * Initialize all analytics services
 * @param {Object} config - Configuration object with platform-specific keys
 */
export async function initializeAnalytics(config = {}) {
  try {
    // Initialize Meta SDK
    if (config.meta) {
      await MetaAnalytics.initialize(config.meta);
    }

    // Initialize Singular SDK
    if (config.singular) {
      await SingularAnalytics.initialize(config.singular);
    }

    // Store ATT consent status for CAPI events
    if (config.meta?.trackingConsent === 'granted') {
      advertiserTrackingEnabled = 1;
    } else {
      advertiserTrackingEnabled = 0;
    }

    // Collect device info for CAPI app_data.extinfo
    deviceInfo = {
      app_platform: Platform.OS, // 'ios' or 'android'
      app_version: Constants.expoConfig?.version || Constants.manifest?.version || '1.0.0',
      os_version: Platform.Version ? String(Platform.Version) : '',
    };

    // Set up CAPI endpoint if Meta Pixel ID is configured
    if (apiConfig.META_PIXEL_ID) {
      capiEndpoint = `${apiConfig.API_BASE_URL}/meta/capi`;
    }

    isInitialized = true;
    console.log('Analytics services initialized');
  } catch (error) {
    console.error('Error initializing analytics:', error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Send event to CAPI endpoint (server-side)
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Event parameters
 * @param {string} eventId - Event ID for deduplication
 */
async function sendToCAPI(eventName, eventParams = {}, eventId = null) {
  if (!capiEndpoint) {
    return; // CAPI not configured
  }

  try {
    const response = await fetch(capiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventParams: {
          ...eventParams,
          advertiser_tracking_enabled: advertiserTrackingEnabled,
          ...deviceInfo,
        },
        eventId: eventId || `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      }),
    });

    if (!response.ok) {
      console.warn(`CAPI request failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error sending event to CAPI:', error);
    // Don't throw - CAPI failures shouldn't break the app
  }
}

const CAPI_ONLY_EVENTS = [];

/**
 * Track an event across all configured analytics platforms
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Event parameters
 */
export async function trackEvent(eventName, eventParams = {}) {
  if (!isInitialized) {
    console.warn('Analytics not initialized, skipping event:', eventName);
    return;
  }

  // Generate event ID for deduplication (shared between SDK and CAPI)
  const eventId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;

  const isCapiOnly = CAPI_ONLY_EVENTS.includes(eventName);

  try {
    // For conversion events, skip the Meta client-side SDK to avoid double-counting.
    // CAPI is the primary source of truth for these events.
    if (!isCapiOnly) {
      // Track in Meta SDK (client-side) for non-conversion events
      await MetaAnalytics.trackEvent(eventName, { ...eventParams, _eventId: eventId });
    }

    // Send to CAPI (server-side) for better data quality — always fires
    await sendToCAPI(eventName, eventParams, eventId);

    // Track in Singular — always fires (Singular has its own deduplication)
    await SingularAnalytics.trackEvent(eventName, eventParams);
  } catch (error) {
    console.error(`Error tracking event ${eventName}:`, error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

/**
 * Set user ID for analytics
 * @param {string} userId - User ID to set
 */
export async function setUserId(userId) {
  try {
    await MetaAnalytics.setUserId(userId);
    await SingularAnalytics.setUserId(userId);
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
}

/**
 * Clear user ID (e.g., on logout)
 */
export async function clearUserId() {
  try {
    await MetaAnalytics.clearUserId();
    await SingularAnalytics.clearUserId();
  } catch (error) {
    console.error('Error clearing user ID:', error);
  }
}

/**
 * Track app initialization event
 * @param {Object} params - Event parameters
 */
export async function trackAppInitialized(params = {}) {
  await trackEvent('AppInitialized', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track picture taken event
 * @param {Object} params - Event parameters
 */
export async function trackPictureTaken(params = {}) {
  await trackEvent('PictureTaken', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track scan completed event
 * @param {Object} params - Event parameters
 */
export async function trackScanCompleted(params = {}) {
  await trackEvent('ScanCompleted', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track trial completed event
 * @param {Object} params - Event parameters
 */
export async function trackTrialCompleted(params = {}) {
  await trackEvent('TrialCompleted', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track purchase completed event
 * @param {Object} params - Event parameters
 */
export async function trackPurchaseCompleted(params = {}) {
  await trackEvent('PurchaseCompleted', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track sign in event
 * @param {Object} params - Event parameters
 */
export async function trackSignIn(params = {}) {
  await trackEvent('SignIn', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track sign up event
 * @param {Object} params - Event parameters
 */
export async function trackSignUp(params = {}) {
  await trackEvent('SignUp', {
    ...params,
    timestamp: new Date().toISOString(),
  });
}

export default {
  initializeAnalytics,
  trackEvent,
  setUserId,
  clearUserId,
  trackAppInitialized,
  trackPictureTaken,
  trackScanCompleted,
  trackTrialCompleted,
  trackPurchaseCompleted,
  trackSignIn,
  trackSignUp,
};
