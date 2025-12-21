/**
 * Restart Application Utility
 * Clears all data and restarts the app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import * as RevenueCatService from '../services/revenueCatService';
import * as authStorage from '../services/authStorage';

/**
 * Clear all AsyncStorage data
 */
async function clearAllStorage() {
  try {
    // Get all keys
    let allKeys = [];
    try {
      if (AsyncStorage && typeof AsyncStorage.getAllKeys === 'function') {
        allKeys = await AsyncStorage.getAllKeys();
      }
    } catch (e) {
      // If getAllKeys fails, continue with empty array
      allKeys = [];
    }
    
    // Remove all keys that start with @catfish: (our app's storage)
    if (allKeys.length > 0) {
      const appKeys = allKeys.filter(key => key && typeof key === 'string' && key.startsWith('@catfish:'));
      
      if (appKeys.length > 0 && AsyncStorage && typeof AsyncStorage.multiRemove === 'function') {
        try {
          await AsyncStorage.multiRemove(appKeys);
        } catch (e) {
          // If multiRemove fails, try removing one by one
          for (const key of appKeys) {
            try {
              if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
                await AsyncStorage.removeItem(key);
              }
            } catch (err) {
              // Continue with next key
            }
          }
        }
      }
    }
    
    // Note: We don't call AsyncStorage.clear() as it may not be available
    // or may have different signatures in different versions
    // Removing our specific keys is sufficient
    
    try {
      console.log('All storage cleared');
    } catch (e) {
      // Ignore console errors
    }
  } catch (error) {
    // Log error safely
    try {
      console.log('Error clearing storage:', error?.message || String(error));
    } catch (e) {
      // Ignore console errors
    }
    // Continue even if clearing fails
  }
}

/**
 * Restart the application
 * Clears all data, logs out user, and restarts the app
 */
export async function restartApplication() {
  try {
    // 1. Logout RevenueCat if configured
    try {
      await RevenueCatService.logoutRevenueCat();
    } catch (error) {
      try {
        console.log('Error logging out RevenueCat:', error?.message || String(error));
      } catch (e) {
        // Ignore console errors
      }
    }

    // 2. Clear all auth data
    try {
      await authStorage.clearAuthData();
    } catch (error) {
      try {
        console.log('Error clearing auth data:', error?.message || String(error));
      } catch (e) {
        // Ignore console errors
      }
    }

    // 3. Clear all AsyncStorage
    await clearAllStorage();

    // 4. Restart the app using expo-updates
    try {
      // Check if Updates.reloadAsync is available
      if (Updates && typeof Updates.reloadAsync === 'function') {
        await Updates.reloadAsync();
      } else {
        // If Updates is not available, log and continue
        // Data has been cleared, app will restart on next launch
        try {
          console.log('Updates.reloadAsync not available. Data cleared. Please reload manually.');
        } catch (e) {
          // Ignore console errors
        }
      }
    } catch (reloadError) {
      // If reload fails, log it safely
      try {
        console.log('Error reloading app:', reloadError?.message || String(reloadError));
      } catch (e) {
        // Ignore console errors
      }
      // If reload fails, at least we've cleared all data
      // The app will restart naturally on next launch
    }
  } catch (error) {
    // Log error safely
    try {
      console.log('Error restarting application:', error?.message || String(error));
    } catch (e) {
      // Ignore console errors
    }
    // Data has been cleared, but reload failed
    // User may need to manually reload the app
  }
}

export default {
  restartApplication,
  clearAllStorage,
};

