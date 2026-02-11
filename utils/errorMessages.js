/**
 * Centralized error message utility
 * Maps raw API/technical error messages to user-friendly messages.
 * 
 * Usage:
 *   import { getFriendlyErrorMessage } from '../utils/errorMessages';
 *   Alert.alert('Error Title', getFriendlyErrorMessage(error));
 */

/**
 * Known error patterns mapped to user-friendly messages.
 * Each entry: [regex or string pattern (case-insensitive), friendly message]
 */
const ERROR_MAP = [
  // === Token / Scan balance errors ===
  [/insufficient.?tokens/i, 'You have no scans remaining. Please purchase a scan pack to continue.'],
  [/insufficient.?credits/i, 'You have no scans remaining. Please purchase a scan pack to continue.'],
  [/no scans remaining/i, 'You have no scans remaining. Please purchase a scan pack to continue.'],
  [/purchase a scan pack/i, 'You have no scans remaining. Please purchase a scan pack to continue.'],

  // === Image analysis errors ===
  [/image too large/i, 'The image is too large. Please use a smaller image (under 20MB).'],
  [/image parsing error/i, 'We couldn\'t process this image. Please try a different photo.'],
  [/gowinston api request failed/i, 'Image analysis is temporarily unavailable. Please try again shortly.'],
  [/analysis request failed/i, 'Image analysis failed. Please try again.'],
  [/s3 bucket not configured/i, 'The service is temporarily unavailable. Please try again later.'],
  [/gowinston.*token.*not configured/i, 'The analysis service is temporarily unavailable. Please try again later.'],
  [/invalid json/i, 'Something went wrong with your request. Please try again.'],
  [/method not allowed/i, 'Something went wrong. Please try again.'],
  [/missing required field/i, 'No image was provided. Please select an image and try again.'],

  // === Network errors ===
  [/network.?error/i, 'Please check your internet connection and try again.'],
  [/network request failed/i, 'Please check your internet connection and try again.'],
  [/request timeout/i, 'The request timed out. Please check your connection and try again.'],
  [/timeout/i, 'The request timed out. Please try again.'],
  [/failed to fetch/i, 'Please check your internet connection and try again.'],
  [/fetch.*failed/i, 'Please check your internet connection and try again.'],
  [/no internet/i, 'Please check your internet connection and try again.'],
  [/econnrefused/i, 'Unable to connect to the server. Please try again later.'],
  [/enotfound/i, 'Unable to connect to the server. Please try again later.'],

  // === Auth errors ===
  [/incorrect.*password/i, 'Incorrect email or password. Please try again.'],
  [/not authorized/i, 'Incorrect email or password. Please try again.'],
  [/user does not exist/i, 'No account found with this email. Please sign up first.'],
  [/user.*not.*found/i, 'No account found with this email. Please sign up first.'],
  [/username.*already.*exists/i, 'An account with this email already exists. Please sign in instead.'],
  [/account.*already.*exists/i, 'An account with this email already exists. Please sign in instead.'],
  [/invalid.*verification.*code/i, 'The verification code is incorrect. Please check and try again.'],
  [/code.*mismatch/i, 'The verification code is incorrect. Please check and try again.'],
  [/expired.*code/i, 'The verification code has expired. Please request a new one.'],
  [/limit.*exceeded/i, 'Too many attempts. Please wait a moment and try again.'],
  [/too many requests/i, 'Too many attempts. Please wait a moment and try again.'],

  // === Purchase errors ===
  [/unable to complete purchase/i, 'Unable to complete purchase. Please try again.'],
  [/purchase.*cancel/i, null], // Return null to suppress (user cancelled)
  [/user.*cancel/i, null], // Return null to suppress (user cancelled)
  [/payment.*declined/i, 'Your payment was declined. Please check your payment method and try again.'],
  [/store.*error/i, 'There was an issue with the App Store. Please try again.'],

  // === Server errors ===
  [/internal server error/i, 'Something went wrong on our end. Please try again later.'],
  [/502|503|504/i, 'The service is temporarily unavailable. Please try again later.'],
  [/server error/i, 'Something went wrong on our end. Please try again later.'],
];

/**
 * Category-specific fallback messages when no pattern matches.
 */
const CATEGORY_FALLBACKS = {
  analysis: 'Unable to analyze image. Please try again.',
  purchase: 'Unable to complete purchase. Please try again.',
  auth: 'An unexpected error occurred. Please try again.',
  history: 'Failed to load data. Please try again.',
  network: 'Please check your internet connection and try again.',
  general: 'Something went wrong. Please try again.',
};

/**
 * Get a user-friendly error message from a raw error.
 * 
 * @param {Error|string|object} error - The raw error (Error object, string, or object with message/error)
 * @param {string} [category='general'] - Error category for fallback messages: 
 *   'analysis' | 'purchase' | 'auth' | 'history' | 'network' | 'general'
 * @returns {string|null} User-friendly message, or null if the error should be suppressed (e.g. user cancelled)
 */
export function getFriendlyErrorMessage(error, category = 'general') {
  // Extract the raw message string
  let rawMessage = '';
  if (typeof error === 'string') {
    rawMessage = error;
  } else if (error instanceof Error) {
    rawMessage = error.message || '';
  } else if (error && typeof error === 'object') {
    rawMessage = error.message || error.error || error.errorMessage || String(error);
  }

  if (!rawMessage) {
    return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.general;
  }

  // Check against known patterns
  for (const [pattern, friendlyMessage] of ERROR_MAP) {
    if (pattern instanceof RegExp) {
      if (pattern.test(rawMessage)) {
        return friendlyMessage; // null means suppress
      }
    } else if (typeof pattern === 'string') {
      if (rawMessage.toLowerCase().includes(pattern.toLowerCase())) {
        return friendlyMessage;
      }
    }
  }

  // Log the unmapped error for debugging (but don't show to user)
  console.warn('Unmapped error (showing fallback to user):', rawMessage);

  // Return category-specific fallback
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.general;
}

/**
 * Check if an error was caused by user cancellation (should be suppressed).
 * 
 * @param {Error|string|object} error - The raw error
 * @returns {boolean} True if the error is a user cancellation
 */
export function isUserCancelledError(error) {
  let rawMessage = '';
  if (typeof error === 'string') {
    rawMessage = error;
  } else if (error instanceof Error) {
    rawMessage = error.message || '';
  } else if (error && typeof error === 'object') {
    if (error.userCancelled) return true;
    rawMessage = error.message || error.error || '';
  }

  const lowerMessage = rawMessage.toLowerCase();
  return lowerMessage.includes('cancel') || lowerMessage.includes('dismissed');
}

export default { getFriendlyErrorMessage, isUserCancelledError };
