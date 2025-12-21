# RevenueCat Integration Guide - Complete Setup

This guide provides step-by-step instructions for integrating RevenueCat subscription management into both the backend (AWS Lambda) and frontend (React Native/Expo) of the Catfish application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [RevenueCat Setup](#revenuecat-setup)
3. [Backend Integration](#backend-integration)
4. [Frontend Integration](#frontend-integration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 1. RevenueCat Account
- Sign up at [app.revenuecat.com](https://app.revenuecat.com)
- Create a new project
- Get your **Public API Key** and **Secret API Key**

### 2. App Store Connect / Google Play Console
- **iOS**: Create In-App Purchase products in App Store Connect
- **Android**: Create subscription products in Google Play Console
- Product IDs should match between stores (e.g., `catfish_pro_monthly`)

### 3. Development Tools
- Node.js 18+ installed
- AWS CLI configured
- Expo CLI installed
- RevenueCat account with products configured

---

## RevenueCat Setup

### Step 1: Create Products in RevenueCat Dashboard

1. **Log in to RevenueCat Dashboard**
   - Go to https://app.revenuecat.com
   - Select your project

2. **Create Products**
   - Navigate to **Products** → **Add Product**
   - Create product: `catfish_pro_monthly`
   - Set price (will sync from App Store/Play Store)
   - Add entitlements: `pro` (this grants unlimited scans)

3. **Create Offerings**
   - Navigate to **Offerings** → **Create Offering**
   - Name: `default`
   - Add product: `catfish_pro_monthly`
   - Set as default offering

4. **Get API Keys**
   - Go to **Project Settings** → **API Keys**
   - Copy **Public API Key** (starts with `pk_`)
   - Copy **Secret API Key** (starts with `sk_`)

### Step 2: Configure App Store Connect (iOS)

1. **Create In-App Purchase**
   - Go to App Store Connect → Your App → Features → In-App Purchases
   - Create subscription: "Catfish Pro Monthly"
   - Product ID: `catfish_pro_monthly`
   - Subscription Group: Create new group
   - Set pricing (e.g., $9.99/month)
   - Add localization and description

2. **Link in RevenueCat**
   - In RevenueCat Dashboard → Products
   - Click on `catfish_pro_monthly`
   - Add App Store Connect product ID
   - Save

### Step 3: Configure Google Play Console (Android)

1. **Create Subscription**
   - Go to Google Play Console → Your App → Monetization → Subscriptions
   - Create subscription: "Catfish Pro Monthly"
   - Product ID: `catfish_pro_monthly`
   - Set pricing (e.g., $9.99/month)
   - Add description

2. **Link in RevenueCat**
   - In RevenueCat Dashboard → Products
   - Click on `catfish_pro_monthly`
   - Add Google Play product ID
   - Save

---

## Backend Integration

### Architecture Overview

```
RevenueCat Webhook → Lambda (webhook-handler) → DynamoDB (subscriptions table)
                                                      ↓
User Request → Lambda (analyzeImage) → Check DynamoDB → Allow/Deny
```

### Step 1: Install Dependencies

```bash
cd lambda
npm install --save axios
npm install --save-dev @types/node
```

### Step 2: Create DynamoDB Tables

The `serverless.yml` file will automatically create these tables. They include:
- `subscriptions` table - Stores user subscription info
- `scan-counts` table - Tracks scans per user per month

### Step 3: Create Webhook Handler

The webhook handler (`webhook-handler.js`) will:
- Receive events from RevenueCat
- Update subscription status in DynamoDB
- Update Cognito user attributes (optional)

### Step 4: Create Subscription Service

The subscription service provides:
- Check subscription status
- Get scan count
- Reset monthly scan counts

### Step 5: Update Image Analysis Handler

Modify `image-analysis-handler.js` to:
- Check subscription status before processing
- Enforce scan limits for free users
- Track scan usage

---

## Frontend Integration

### Step 1: Install RevenueCat SDK

```bash
cd catfish
npx expo install react-native-purchases
```

### Step 2: Configure RevenueCat

Create a RevenueCat service that:
- Initializes the SDK with your public API key
- Fetches offerings (products)
- Handles purchases
- Manages subscription status

### Step 3: Create Subscription Context

Create a React Context that:
- Manages subscription state
- Provides subscription status to components
- Handles purchase flow
- Syncs with backend

### Step 4: Update UI Components

- **ProfileScreen**: Show subscription status, handle upgrades
- **ScanScreen**: Show scan limit, handle upgrade prompt
- **App.js**: Initialize RevenueCat, check subscription status

---

## Implementation Steps

### Backend Files to Create/Update

1. ✅ `lambda/webhook-handler.js` - Handle RevenueCat webhooks
2. ✅ `lambda/subscription-handler.js` - Check subscription status
3. ✅ `lambda/serverless.yml` - Add new Lambda functions and DynamoDB tables
4. ✅ `lambda/image-analysis-handler.js` - Add subscription checking

### Frontend Files to Create/Update

1. ✅ `catfish/services/subscriptionApi.js` - API calls to backend
2. ✅ `catfish/services/revenueCatService.js` - RevenueCat SDK wrapper
3. ✅ `catfish/context/SubscriptionContext.js` - Subscription state management
4. ✅ `catfish/App.js` - Integrate subscription logic
5. ✅ `catfish/screens/ProfileScreen.js` - Show subscription status
6. ✅ `catfish/screens/ScanScreen.js` - Show scan limits dynamically

---

## Environment Variables

### Backend (.env file in lambda/)

```bash
# RevenueCat Configuration
REVENUECAT_SECRET_KEY=sk_your_secret_key_here
REVENUECAT_PUBLIC_KEY=pk_your_public_key_here

# AWS Configuration (existing)
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
```

### Frontend (create catfish/.env or use expo-constants)

You'll need to add the RevenueCat public key to your app. Options:

**Option 1: Use expo-constants**
```bash
cd catfish
npx expo install expo-constants
```

**Option 2: Use React Native Config**
```bash
cd catfish
npm install react-native-config
```

---

## Testing

### Test Subscription Flow

1. **Sandbox Testing**
   - Use RevenueCat sandbox environment
   - Test purchases with sandbox accounts
   - Verify webhook events are received

2. **Test Scenarios**
   - Free user reaches scan limit
   - User upgrades to Pro
   - User cancels subscription
   - Subscription expires

### Test Backend

```bash
# Test webhook handler locally
cd lambda
node test-webhook.js

# Test subscription checking
node test-subscription.js
```

### Test Frontend

```bash
cd catfish
npm start

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android
```

---

## Webhook Configuration

In RevenueCat Dashboard:

1. Go to **Project Settings** → **Webhooks**
2. Add webhook URL: `https://your-api-gateway-url/prod/webhook`
3. Enable events:
   - `INITIAL_PURCHASE`
   - `RENEWAL`
   - `CANCELLATION`
   - `UNCANCELLATION`
   - `NON_RENEWING_PURCHASE`
   - `EXPIRATION`
   - `BILLING_ISSUE`

---

## Subscription Tiers

### Free Tier
- **Scans**: 3 per month
- **Features**: Basic analysis
- **Price**: Free

### Pro Tier
- **Scans**: Unlimited
- **Features**: Advanced analysis
- **Price**: $9.99/month
- **Entitlement**: `pro`

---

## Security Considerations

1. **API Keys**
   - Never commit secret keys to git
   - Use AWS Secrets Manager for backend keys
   - Use environment variables for frontend public keys

2. **Webhook Verification**
   - Always verify webhook signatures
   - Validate request origin
   - Use HTTPS only

3. **User Identification**
   - Link RevenueCat appUserID to Cognito User ID
   - Use consistent user IDs across systems

---

## Troubleshooting

### Common Issues

1. **Webhooks not received**
   - Check webhook URL is correct
   - Verify API Gateway is deployed
   - Check Lambda function logs in CloudWatch

2. **Purchases not working**
   - Verify product IDs match exactly
   - Check sandbox environment setup
   - Review RevenueCat SDK logs

3. **Subscription status not updating**
   - Check DynamoDB table for entries
   - Verify webhook handler is processing events
   - Check Cognito user attributes (if used)

---

## Next Steps

After completing this integration:

1. ✅ Set up monitoring and alerts
2. ✅ Configure analytics in RevenueCat
3. ✅ Add subscription management UI
4. ✅ Implement subscription restoration
5. ✅ Add subscription expiration handling
6. ✅ Test on production (staged rollout)

---

## Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native Purchases SDK](https://github.com/RevenueCat/react-native-purchases)
- [RevenueCat Webhooks Guide](https://docs.revenuecat.com/docs/webhooks)
- [RevenueCat Testing Guide](https://docs.revenuecat.com/docs/testing)

---

## Support

For issues or questions:
1. Check RevenueCat dashboard logs
2. Review Lambda CloudWatch logs
3. Check React Native debugger logs
4. Consult RevenueCat documentation
5. Contact RevenueCat support if needed

