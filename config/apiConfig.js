/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Replace with your actual API Gateway endpoint after deployment
// You can get this from: serverless info --verbose
// NOTE: Using /dev endpoint for both dev and production builds
// Change to /prod when you deploy a production stage
const API_BASE_URL = 'https://cw30abur3e.execute-api.us-east-1.amazonaws.com/dev';

// Alternative: Use different endpoints based on environment
// const API_BASE_URL = __DEV__
//   ? 'https://cw30abur3e.execute-api.us-east-1.amazonaws.com/dev'
//   : 'https://cw30abur3e.execute-api.us-east-1.amazonaws.com/prod';

// RevenueCat API Keys
// Get these from RevenueCat Dashboard → Project Settings → API Keys
// For test mode, you can use the same key for both platforms
// For production, you'll need separate keys: 'appl_' for iOS and 'goog_' for Android
// DISABLED: Set to null/empty to disable RevenueCat
const REVENUECAT_API_KEY = {
  ios: null, // Disabled - set to null to disable RevenueCat
  android: null, // Disabled - set to null to disable RevenueCat
};

export default {
  API_BASE_URL,
  REVENUECAT_API_KEY,
};

