/**
 * Centralized Analytics Service
 * Provides a unified interface for tracking events across multiple analytics platforms
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MetaAnalytics from './metaAnalytics';
import * as SingularAnalytics from './singularAnalytics';
import apiConfig from '../config/apiConfig';

let isInitialized = false;
let capiEndpoint = null;
let advertiserTrackingEnabled = 0; // ATT consent: 1 = granted, 0 = denied
let deviceInfo = {}; // Device info for CAPI app_data.extinfo
let attributionContext = {};
let linkingListener = null;

const ATTRIBUTION_STORAGE_KEY = '@catfish:metaAttributionContext';

function toStringOrNull(value) {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
}

function buildFbcFromFbclid(fbclid) {
  const cleanFbclid = toStringOrNull(fbclid);
  if (!cleanFbclid) return null;
  // Meta format for fbc: fb.1.<creation_time>.<fbclid>
  return `fb.1.${Date.now()}.${cleanFbclid}`;
}

function normalizeAttributionParams(rawParams = {}, sourceUrl = null) {
  const params = {};
  Object.keys(rawParams || {}).forEach((key) => {
    params[key.toLowerCase()] = rawParams[key];
  });

  const utmCampaign = toStringOrNull(params.utm_campaign);
  const campaignId =
    toStringOrNull(params.campaign_id) ||
    toStringOrNull(params.campaignid) ||
    toStringOrNull(params.campaign) ||
    utmCampaign;

  const normalized = {
    campaign_id: campaignId,
    campaign_name: toStringOrNull(params.campaign_name) || utmCampaign,
    adset_id: toStringOrNull(params.adset_id) || toStringOrNull(params.adsetid),
    ad_id: toStringOrNull(params.ad_id) || toStringOrNull(params.adid),
    utm_source: toStringOrNull(params.utm_source),
    utm_medium: toStringOrNull(params.utm_medium),
    utm_campaign: utmCampaign,
    fbc: toStringOrNull(params.fbc) || buildFbcFromFbclid(params.fbclid),
    fbp: toStringOrNull(params.fbp),
    source_url: toStringOrNull(sourceUrl),
    attribution_captured_at: new Date().toISOString(),
  };

  return Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== null && value !== undefined)
  );
}

async function loadStoredAttributionContext() {
  try {
    const raw = await AsyncStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('Failed to load attribution context:', error?.message || error);
    return {};
  }
}

async function persistAttributionContext(context) {
  try {
    await AsyncStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(context));
  } catch (error) {
    console.warn('Failed to persist attribution context:', error?.message || error);
  }
}

async function captureAttributionFromUrl(url) {
  try {
    if (!url) return;
    const parsed = Linking.parse(url);
    const normalized = normalizeAttributionParams(parsed?.queryParams || {}, url);
    if (Object.keys(normalized).length === 0) return;

    attributionContext = {
      ...attributionContext,
      ...normalized,
    };
    await persistAttributionContext(attributionContext);

    if (__DEV__) {
      console.log('Attribution context captured from URL:', {
        campaign_id: attributionContext.campaign_id || null,
        campaign_name: attributionContext.campaign_name || null,
        adset_id: attributionContext.adset_id || null,
        ad_id: attributionContext.ad_id || null,
        has_fbc: !!attributionContext.fbc,
        has_fbp: !!attributionContext.fbp,
      });
    }
  } catch (error) {
    console.warn('Failed to capture attribution from URL:', error?.message || error);
  }
}

function enrichWithAttribution(eventParams = {}) {
  const merged = {
    ...attributionContext,
    ...eventParams,
  };

  if (!merged.campaign_id && merged.utm_campaign) {
    merged.campaign_id = merged.utm_campaign;
  }

  if (__DEV__ && (merged.campaign_id || merged.fbc || merged.fbp)) {
    console.log('Attribution payload attached:', {
      campaign_id: merged.campaign_id || null,
      campaign_name: merged.campaign_name || null,
      adset_id: merged.adset_id || null,
      ad_id: merged.ad_id || null,
      has_fbc: !!merged.fbc,
      has_fbp: !!merged.fbp,
    });
  }

  return merged;
}

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

    // Restore existing attribution context and capture launch deep link params.
    attributionContext = await loadStoredAttributionContext();
    try {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await captureAttributionFromUrl(initialUrl);
      }
    } catch (error) {
      console.warn('Failed to read initial URL for attribution:', error?.message || error);
    }

    // Capture attribution updates from runtime deep links.
    if (!linkingListener && typeof Linking.addEventListener === 'function') {
      linkingListener = Linking.addEventListener('url', (event) => {
        captureAttributionFromUrl(event?.url);
      });
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
  const enrichedEventParams = enrichWithAttribution(eventParams);

  try {
    // For conversion events, skip the Meta client-side SDK to avoid double-counting.
    // CAPI is the primary source of truth for these events.
    if (!isCapiOnly) {
      // Track in Meta SDK (client-side) for non-conversion events
      await MetaAnalytics.trackEvent(eventName, { ...enrichedEventParams, _eventId: eventId });
    }

    // Send to CAPI (server-side) for better data quality — always fires
    await sendToCAPI(eventName, enrichedEventParams, eventId);

    // Track in Singular — always fires (Singular has its own deduplication)
    await SingularAnalytics.trackEvent(eventName, enrichedEventParams);
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
