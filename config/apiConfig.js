/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

// Replace with your actual API Gateway endpoint after deployment
// You can get this from: serverless info --verbose
// NOTE: Using /dev endpoint for both dev and production builds
// Change to /prod when you deploy a production stage
const API_BASE_URL = 'https://3oaimkf4g6.execute-api.us-east-1.amazonaws.com/dev';

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

// Analysis endpoint configuration
// Options: 'analyze' (Sightengine) or 'gowinston/detect' (Gowinston AI)
const ANALYSIS_ENDPOINT = 'gowinston/detect';

// Meta (Facebook) SDK Configuration
// Get these from Facebook Developer Console
const META_APP_ID = '2079417662833739'; // Set your Facebook App ID here
const META_PIXEL_ID = '1580597886592592'; // Set your Meta Pixel ID here (for CAPI)

// Singular Analytics Configuration
// Get these from Singular Dashboard → Settings → SDK Keys
const SINGULAR_API_KEY = null; // Set your Singular SDK Key here
const SINGULAR_SECRET = null; // Set your Singular SDK Secret here

// Sentry Error Monitoring Configuration
// Get DSN from Sentry Dashboard → Settings → Projects → Client Keys (DSN)
// Use the same DSN for both iOS and Android, or separate DSNs if needed
const SENTRY_DSN = 'https://1d3093833edb098236620ff3284c15d3@o4510698112679936.ingest.us.sentry.io/4510698121396224'; // Set your Sentry DSN here (e.g., 'https://xxx@sentry.io/xxx')

// PostHog Analytics Configuration
// Get API key from PostHog Dashboard → Project Settings → API Key
const POSTHOG_API_KEY = 'phc_drdNZD5osCDsedf0jVvyVlMAXMbc6xE05ba4xIS1CHd'; // Set your PostHog API key here (e.g., 'phc_xxx')
const POSTHOG_HOST = 'https://app.posthog.com'; // Use 'https://app.posthog.com' or your self-hosted URL

export default {
  API_BASE_URL,
  REVENUECAT_API_KEY,
  ANALYSIS_ENDPOINT,
  META_APP_ID,
  META_PIXEL_ID,
  SINGULAR_API_KEY,
  SINGULAR_SECRET,
  SENTRY_DSN,
  POSTHOG_API_KEY,
  POSTHOG_HOST,
};

