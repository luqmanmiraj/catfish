/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../services/authApi';
import * as authStorage from '../services/authStorage';
import { getDeviceId } from '../utils/deviceLogger';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check authentication status on app start
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await authStorage.getAccessToken();
      const storedUser = await authStorage.getUser();

      if (token && storedUser) {
        // Verify token is still valid by getting user info
        try {
          const userInfo = await authApi.getUserInfo(token);
          setUser(userInfo.userAttributes || storedUser);
          setAccessToken(token);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be expired, try to refresh
          const refreshToken = await authStorage.getRefreshToken();
          if (refreshToken) {
            try {
              const newTokens = await authApi.refreshToken(refreshToken);
              await authStorage.storeAuthData(newTokens, userInfo?.userAttributes || storedUser);
              setAccessToken(newTokens.accessToken);
              setUser(userInfo?.userAttributes || storedUser);
              setIsAuthenticated(true);
            } catch (refreshError) {
              // Refresh failed, clear auth data
              await authStorage.clearAuthData();
              setUser(null);
              setAccessToken(null);
              setIsAuthenticated(false);
            }
          } else {
            // No refresh token, clear auth data
            await authStorage.clearAuthData();
            setUser(null);
            setAccessToken(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign up a new user
   */
  const signUp = async (email, password, name = null) => {
    try {
      const result = await authApi.signUp(email, password, name);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Confirm sign up with verification code
   */
  const confirmSignUp = async (email, confirmationCode) => {
    try {
      const result = await authApi.confirmSignUp(email, confirmationCode);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Resend confirmation code
   */
  const resendConfirmationCode = async (email) => {
    try {
      const result = await authApi.resendConfirmationCode(email);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (email, password) => {
    try {
      const result = await authApi.signIn(email, password);
      
      if (result.success && result.accessToken) {
        // Store tokens and user info
        await authStorage.storeAuthData({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          idToken: result.idToken,
        });

        // Get user info
        try {
          const userInfo = await authApi.getUserInfo(result.accessToken);
          await authStorage.storeUser(userInfo.userAttributes);
          setUser(userInfo.userAttributes);
        } catch (userError) {
          console.error('Error fetching user info:', userError);
          // Still proceed with sign in even if user info fetch fails
        }

        setAccessToken(result.accessToken);
        setIsAuthenticated(true);
        return { success: true, data: result };
      } else {
        return { success: false, error: result.message || 'Sign in failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Sign out user
   */
  const signOut = async () => {
    try {
      await authStorage.clearAuthData();
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Forgot password
   */
  const forgotPassword = async (email) => {
    try {
      const result = await authApi.forgotPassword(email);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Confirm forgot password
   */
  const confirmForgotPassword = async (email, confirmationCode, newPassword) => {
    try {
      const result = await authApi.confirmForgotPassword(email, confirmationCode, newPassword);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Refresh access token
   */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await authStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await authApi.refreshToken(refreshToken);
      await authStorage.storeAuthData({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        idToken: result.idToken,
      });
      setAccessToken(result.accessToken);
      return { success: true, data: result };
    } catch (error) {
      // Refresh failed, sign out user
      await signOut();
      return { success: false, error: error.message };
    }
  };

  /**
   * Guest sign up - creates a temporary user account with device ID
   */
  const guestSignUp = async (deviceId = null) => {
    try {
      // Get device ID if not provided
      const finalDeviceId = deviceId || await getDeviceId();
      
      const result = await authApi.guestSignUp(finalDeviceId);
      
      if (result.success && result.accessToken) {
        // Store tokens and user info
        await authStorage.storeAuthData({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          idToken: result.idToken,
        });

        // Get user info
        try {
          const userInfo = await authApi.getUserInfo(result.accessToken);
          await authStorage.storeUser(userInfo.userAttributes);
          setUser(userInfo.userAttributes);
        } catch (userError) {
          console.error('Error fetching user info:', userError);
          // Still proceed with sign in even if user info fetch fails
        }

        setAccessToken(result.accessToken);
        setIsAuthenticated(true);
        return { success: true, data: result, isGuest: true };
      } else {
        return { success: false, error: result.message || 'Guest signup failed' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    accessToken,
    signUp,
    confirmSignUp,
    resendConfirmationCode,
    signIn,
    signOut,
    forgotPassword,
    confirmForgotPassword,
    refreshAccessToken,
    guestSignUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

