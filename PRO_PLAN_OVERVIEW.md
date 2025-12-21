# Pro Plan Overview - Mobile Application

## Current Implementation Status

### ✅ What's Implemented (UI Only)

The mobile application currently has **UI elements** for the pro plan, but **no backend subscription logic** is implemented yet:

1. **Pricing Display**
   - Shows `$9.99/month` in the ProfileScreen
   - Displays "Cancel anytime • 30-day money-back guarantee" terms

2. **Scan Limits Display**
   - Shows "3 scans remaining" in ScanScreen header
   - Displays "Scans Completed: 3" and "Scan Limit: 3" in ProfileScreen
   - These are **hardcoded values** (not dynamic)

3. **Upgrade Buttons**
   - Upgrade button in ScanScreen header (👑 Upgrade)
   - Upgrade button in ProfileScreen ("Upgrade Now")
   - Currently only logs to console when pressed (`handleUpgrade` function)

### ❌ What's NOT Implemented

1. **Subscription Management**
   - No payment processing integration (e.g., Stripe, Apple In-App Purchase, Google Play Billing)
   - No subscription status tracking in database
   - No subscription validation logic

2. **Scan Limit Enforcement**
   - No actual limit checking before allowing scans
   - Backend Lambda function doesn't check subscription status
   - No tracking of scans per user/device

3. **User Attributes**
   - Cognito User Pool doesn't store subscription information
   - No custom attributes for subscription tier/plan

4. **Backend Integration**
   - Lambda function (`image-analysis-handler.js`) doesn't validate subscription before processing
   - No API endpoint to check subscription status
   - No API endpoint to update subscription

## Current Architecture

### Frontend (Mobile App)

**Files Involved:**
- `catfish/App.js` - Contains `handleUpgrade()` placeholder function
- `catfish/screens/ProfileScreen.js` - Displays upgrade card and pricing
- `catfish/screens/ScanScreen.js` - Shows scan limit and upgrade button

**Key Code Locations:**

1. **Upgrade Handler** (`App.js:151-154`)
   ```javascript
   const handleUpgrade = () => {
     // Handle upgrade
     console.log('Upgrade pressed');
   };
   ```

2. **Hardcoded Scan Limits** (`ScanScreen.js:17`)
   ```javascript
   <Text style={scanStyles.scansRemaining}>3 scans remaining</Text>
   ```

3. **Hardcoded Stats** (`ProfileScreen.js:46-51`)
   ```javascript
   <Text style={profileStyles.statNumber}>3</Text>
   <Text style={profileStyles.statLabel}>Scans Completed</Text>
   <Text style={profileStyles.statNumber}>3</Text>
   <Text style={profileStyles.statLabel}>Scan Limit</Text>
   ```

### Backend (Lambda Functions)

**Files:**
- `lambda/image-analysis-handler.js` - Processes image analysis requests
- `lambda/auth-handler.js` - Handles authentication

**Current Behavior:**
- Lambda function processes **all requests** without checking subscription
- Requests are logged to DynamoDB for tracking, but no subscription validation occurs
- No rate limiting based on subscription tier

## How It Should Work (Recommended Implementation)

### 1. Subscription Tiers

**Free Tier:**
- 3 scans per month
- Basic analysis features

**Pro Plan ($9.99/month):**
- Unlimited scans
- Advanced analysis features (if applicable)
- Priority processing

### 2. User Subscription Storage

**Option A: Cognito Custom Attributes**
- Add custom attribute `custom:subscription_tier` to Cognito User Pool
- Values: `free`, `pro`
- Add `custom:subscription_expires_at` for expiration tracking

**Option B: DynamoDB Table**
- Create `subscriptions` table
- Store subscription info per user (Cognito User ID)
- Fields: `userId`, `tier`, `status`, `expiresAt`, `stripeCustomerId`

### 3. Scan Limit Enforcement

**Frontend:**
- Fetch user's subscription status and scan count on app start
- Check limit before allowing scan
- Show upgrade prompt when limit reached

**Backend:**
- Validate subscription before processing scan request
- Check scan count for free users
- Return error with upgrade message if limit exceeded

### 4. Payment Processing

**For iOS:**
- Use Apple In-App Purchase (IAP)
- Required for App Store compliance
- Use StoreKit 2 or RevenueCat

**For Android:**
- Use Google Play Billing
- Required for Play Store compliance
- Use RevenueCat or native Play Billing Library

**Alternative (Web-only or Cross-platform):**
- Stripe Subscriptions
- Requires web checkout flow
- Not suitable for native app stores

### 5. Implementation Steps

1. **Backend Changes:**
   ```
   a. Add subscription checking in Lambda function
   b. Create subscription management API endpoints
   c. Track scan count per user in DynamoDB
   d. Add Cognito custom attributes or DynamoDB table
   ```

2. **Frontend Changes:**
   ```
   a. Implement subscription status fetching
   b. Add scan count tracking in app state
   c. Implement upgrade flow (IAP/Play Billing)
   d. Update UI to show dynamic limits
   e. Add subscription status refresh logic
   ```

3. **Payment Integration:**
   ```
   a. Set up RevenueCat account (recommended)
   b. Configure products in App Store Connect / Play Console
   c. Integrate RevenueCat SDK in mobile app
   d. Set up webhook handlers for subscription events
   ```

## Recommended Tech Stack for Full Implementation

### Subscription Management
- **RevenueCat** (recommended) - Handles both iOS and Android IAP, webhooks, analytics
- **Stripe** - If you want web-based subscriptions

### Backend Services
- **AWS Cognito Custom Attributes** - Store subscription tier
- **DynamoDB** - Track scan counts and subscription details
- **Lambda Functions** - Validate subscriptions, update counts

### Mobile SDKs
- **RevenueCat React Native SDK** - Simplest option
- **@react-native-async-storage/async-storage** - Already in use for auth

## Current Limitations

1. **No Actual Subscription** - Users can scan unlimited times currently
2. **No Payment Processing** - Upgrade button does nothing
3. **No Backend Validation** - Lambda doesn't check subscription
4. **Hardcoded Values** - Scan limits are static text

## Next Steps to Implement

1. ✅ Set up subscription tracking in backend
2. ✅ Integrate payment processing (RevenueCat recommended)
3. ✅ Add subscription validation to Lambda function
4. ✅ Implement dynamic scan limit checking
5. ✅ Add subscription status management UI
6. ✅ Set up webhooks for subscription lifecycle events

---

**Summary:** The pro plan is currently a UI mockup only. To make it functional, you need to implement subscription management, payment processing, and scan limit enforcement across both frontend and backend.

