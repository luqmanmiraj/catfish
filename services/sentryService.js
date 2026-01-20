/**
 * Sentry Error Monitoring Service
 * Provides centralized error tracking and crash reporting
 */

import apiConfig from '../config/apiConfig';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Conditionally import Sentry - only available in development builds, not in Expo Go
let Sentry = null;
try {
  // Check if we're in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';
  if (!isExpoGo) {
    Sentry = require('@sentry/react-native');
  } else {
    console.log('Running in Expo Go - Sentry native module not available');
  }
} catch (error) {
  console.log('Sentry module not available:', error.message);
}

let isInitialized = false;

/**
 * Initialize Sentry SDK
 * @param {Object} options - Optional configuration
 */
export async function initializeSentry(options = {}) {
  // Check if Sentry module is available (not in Expo Go)
  if (!Sentry) {
    console.warn('Sentry module not available (running in Expo Go). App will continue without error monitoring.');
    isInitialized = false;
    return;
  }

  // Check if Sentry is disabled (DSN is null/empty)
  if (!apiConfig.SENTRY_DSN || apiConfig.SENTRY_DSN.trim() === '') {
    console.warn('Sentry is disabled. App will continue without error monitoring.');
    isInitialized = false;
    return;
  }

  if (isInitialized) {
    console.log('Sentry already initialized');
    return;
  }

  try {
    // Get app version and build info
    const appVersion = Application.nativeApplicationVersion || '1.0.0';
    const buildNumber = Application.nativeBuildVersion || '1';
    const deviceName = Device.deviceName || 'Unknown';
    const deviceModel = Device.modelName || 'Unknown';
    const osVersion = Device.osVersion || 'Unknown';

    Sentry.init({
      dsn: apiConfig.SENTRY_DSN,
      environment: __DEV__ ? 'development' : 'production',
      enableAutoSessionTracking: true,
      sessionTrackingIntervalMillis: 30000, // 30 seconds
      tracesSampleRate: __DEV__ ? 1.0 : 0.1, // 100% in dev, 10% in prod
      enableNative: true,
      enableNativeCrashHandling: true,
      enableAutoPerformanceInstrumentation: true,
      attachStacktrace: true,
      debug: __DEV__, // Enable debug logging in development
      beforeSend(event, hint) {
        // Filter out development errors if needed
        if (__DEV__ && options.filterDevErrors) {
          return null;
        }
        return event;
      },
      initialScope: {
        tags: {
          platform: Platform.OS,
          app_version: appVersion,
          build_number: buildNumber,
          device_name: deviceName,
          device_model: deviceModel,
          os_version: osVersion,
        },
        contexts: {
          device: {
            name: deviceName,
            model: deviceModel,
            os_version: osVersion,
          },
          app: {
            version: appVersion,
            build: buildNumber,
          },
        },
      },
      ...options,
    });

    isInitialized = true;
    console.log('Sentry initialized successfully');
  } catch (error) {
    console.error('Error initializing Sentry:', error);
    // Don't throw - allow app to continue without Sentry
    isInitialized = false;
  }
}

/**
 * Set user context for error tracking
 * @param {string} userId - User ID (Cognito user ID)
 * @param {Object} userData - Additional user data
 */
export function setUser(userId, userData = {}) {
  if (!Sentry || !isInitialized) return;

  try {
    Sentry.setUser({
      id: userId,
      ...userData,
    });
  } catch (error) {
    console.error('Error setting Sentry user:', error);
  }
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUser() {
  if (!Sentry || !isInitialized) return;

  try {
    Sentry.setUser(null);
  } catch (error) {
    console.error('Error clearing Sentry user:', error);
  }
}

/**
 * Capture an exception/error
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 */
export function captureException(error, context = {}) {
  if (!Sentry || !isInitialized) {
    console.error('Sentry not initialized, error:', error);
    return;
  }

  try {
    Sentry.withScope((scope) => {
      if (context.tags) {
        Object.keys(context.tags).forEach((key) => {
          scope.setTag(key, context.tags[key]);
        });
      }
      if (context.extra) {
        Object.keys(context.extra).forEach((key) => {
          scope.setExtra(key, context.extra[key]);
        });
      }
      Sentry.captureException(error);
    });
  } catch (err) {
    console.error('Error capturing exception to Sentry:', err);
  }
}

/**
 * Capture a message (non-error event)
 * @param {string} message - Message to log
 * @param {string} level - Log level (info, warning, error)
 * @param {Object} context - Additional context
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (!Sentry || !isInitialized) {
    console.log(`[Sentry not initialized] ${level}:`, message);
    return;
  }

  try {
    Sentry.withScope((scope) => {
      if (context.tags) {
        Object.keys(context.tags).forEach((key) => {
          scope.setTag(key, context.tags[key]);
        });
      }
      if (context.extra) {
        Object.keys(context.extra).forEach((key) => {
          scope.setExtra(key, context.extra[key]);
        });
      }
      Sentry.captureMessage(message, level);
    });
  } catch (error) {
    console.error('Error capturing message to Sentry:', error);
  }
}

/**
 * Add breadcrumb (for debugging)
 * @param {string} message - Breadcrumb message
 * @param {string} category - Breadcrumb category
 * @param {string} level - Log level
 * @param {Object} data - Additional data
 */
export function addBreadcrumb(message, category = 'default', level = 'info', data = {}) {
  if (!Sentry || !isInitialized) return;

  try {
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      data,
      timestamp: Date.now() / 1000,
    });
  } catch (error) {
    console.error('Error adding breadcrumb to Sentry:', error);
  }
}

/**
 * Set additional context/tags
 * @param {Object} tags - Tags to set
 * @param {Object} extra - Extra data to set
 */
export function setContext(tags = {}, extra = {}) {
  if (!Sentry || !isInitialized) return;

  try {
    Sentry.withScope((scope) => {
      Object.keys(tags).forEach((key) => {
        scope.setTag(key, tags[key]);
      });
      Object.keys(extra).forEach((key) => {
        scope.setExtra(key, extra[key]);
      });
    });
  } catch (error) {
    console.error('Error setting Sentry context:', error);
  }
}

/**
 * Wrap a function with error tracking
 * @param {Function} fn - Function to wrap
 * @param {string} name - Function name for context
 */
export function wrapWithErrorTracking(fn, name) {
  return async (...args) => {
    try {
      addBreadcrumb(`Calling ${name}`, 'function', 'info');
      const result = await fn(...args);
      addBreadcrumb(`${name} completed successfully`, 'function', 'info');
      return result;
    } catch (error) {
      captureException(error, {
        tags: { function_name: name },
        extra: { args: JSON.stringify(args) },
      });
      throw error;
    }
  };
}

export default {
  initializeSentry,
  setUser,
  clearUser,
  captureException,
  captureMessage,
  addBreadcrumb,
  setContext,
  wrapWithErrorTracking,
};
