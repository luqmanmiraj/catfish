/**
 * Authentication API Service
 * Handles all authentication-related API calls to the Lambda backend
 */

import apiConfig from '../config/apiConfig';
import { logDeviceMetadata } from '../utils/deviceLogger';

const { API_BASE_URL } = apiConfig;

/**
 * Make API request with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log device info before every request
  await logDeviceMetadata(null, url);
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if access token is provided
  if (options.token) {
    defaultHeaders['Authorization'] = `Bearer ${options.token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name (optional)
 * @returns {Promise<Object>} Sign up result
 */
export async function signUp(email, password, name = null) {
  const body = { email, password };
  if (name) {
    body.name = name;
  }

  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Confirm sign up with verification code
 * @param {string} email - User email
 * @param {string} confirmationCode - Verification code from email
 * @returns {Promise<Object>} Confirmation result
 */
export async function confirmSignUp(email, confirmationCode) {
  return apiRequest('/auth/confirm-signup', {
    method: 'POST',
    body: JSON.stringify({ email, confirmationCode }),
  });
}

/**
 * Resend confirmation code
 * @param {string} email - User email
 * @returns {Promise<Object>} Resend result
 */
export async function resendConfirmationCode(email) {
  return apiRequest('/auth/resend-confirmation', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Sign in user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Sign in result with tokens
 */
export async function signIn(email, password) {
  return apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export async function refreshToken(refreshToken) {
  return apiRequest('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

/**
 * Forgot password - initiate password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Forgot password result
 */
export async function forgotPassword(email) {
  return apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Confirm forgot password - reset password with code
 * @param {string} email - User email
 * @param {string} confirmationCode - Verification code from email
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password reset result
 */
export async function confirmForgotPassword(email, confirmationCode, newPassword) {
  return apiRequest('/auth/confirm-forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email, confirmationCode, newPassword }),
  });
}

/**
 * Get user information
 * @param {string} accessToken - Access token
 * @returns {Promise<Object>} User information
 */
export async function getUserInfo(accessToken) {
  return apiRequest('/auth/user', {
    method: 'GET',
    token: accessToken,
  });
}

/**
 * Guest sign up - creates a temporary user account with device ID
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} Sign up result with tokens
 */
export async function guestSignUp(deviceId) {
  return apiRequest('/auth/guest-signup', {
    method: 'POST',
    body: JSON.stringify({ deviceId }),
  });
}

export default {
  signUp,
  confirmSignUp,
  resendConfirmationCode,
  signIn,
  refreshToken,
  forgotPassword,
  confirmForgotPassword,
  getUserInfo,
  guestSignUp,
};

