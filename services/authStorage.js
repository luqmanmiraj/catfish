/**
 * Authentication Storage Service
 * Handles secure storage of authentication tokens
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@catfish:accessToken';
const REFRESH_TOKEN_KEY = '@catfish:refreshToken';
const ID_TOKEN_KEY = '@catfish:idToken';
const USER_KEY = '@catfish:user';

/**
 * Store access token
 */
export async function storeAccessToken(token) {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing access token:', error);
    throw error;
  }
}

/**
 * Get access token
 */
export async function getAccessToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

/**
 * Store refresh token
 */
export async function storeRefreshToken(token) {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
}

/**
 * Get refresh token
 */
export async function getRefreshToken() {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}

/**
 * Store ID token
 */
export async function storeIdToken(token) {
  try {
    await AsyncStorage.setItem(ID_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing ID token:', error);
    throw error;
  }
}

/**
 * Get ID token
 */
export async function getIdToken() {
  try {
    return await AsyncStorage.getItem(ID_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

/**
 * Store user information
 */
export async function storeUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
    throw error;
  }
}

/**
 * Get user information
 */
export async function getUser() {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Store all authentication data
 */
export async function storeAuthData(tokens, user = null) {
  try {
    await Promise.all([
      tokens.accessToken && storeAccessToken(tokens.accessToken),
      tokens.refreshToken && storeRefreshToken(tokens.refreshToken),
      tokens.idToken && storeIdToken(tokens.idToken),
      user && storeUser(user),
    ]);
  } catch (error) {
    console.error('Error storing auth data:', error);
    throw error;
  }
}

/**
 * Clear all authentication data
 */
export async function clearAuthData() {
  try {
    await AsyncStorage.multiRemove([
      TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      ID_TOKEN_KEY,
      USER_KEY,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const token = await getAccessToken();
  return token !== null;
}

export default {
  storeAccessToken,
  getAccessToken,
  storeRefreshToken,
  getRefreshToken,
  storeIdToken,
  getIdToken,
  storeUser,
  getUser,
  storeAuthData,
  clearAuthData,
  isAuthenticated,
};

