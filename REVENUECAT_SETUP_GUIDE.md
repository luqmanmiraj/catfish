# RevenueCat Integration Setup Guide - Catfish Crasher App

This guide provides complete instructions for the RevenueCat SDK integration in your Catfish Crasher React Native app.

## ✅ What's Been Implemented

### 1. SDK Installation
- ✅ `react-native-purchases` (v9.6.8) - Core RevenueCat SDK
- ✅ `react-native-purchases-ui` - RevenueCat Paywall UI and Customer Center

### 2. Configuration
- ✅ API Key configured: `test_RUkWKORAXIzvyDqTDjjcCHloVzB`
- ✅ Location: `catfish/config/apiConfig.js`
- ⚠️ **Note**: For production, you'll need separate keys for iOS (`appl_`) and Android (`goog_`)

### 3. Core Features Implemented

#### RevenueCat Service (`services/revenueCatService.js`)
- ✅ SDK initialization with user ID linking
- ✅ Entitlement checking for **"Catfish Pro"**
- ✅ Product purchase handling
- ✅ Restore purchases
- ✅ Customer info retrieval
- ✅ Paywall UI presentation
- ✅ Customer Center (manage subscriptions)
- ✅ Package organization (Basic, Premium Monthly, Lifetime)
- ✅ Enhanced error handling

#### Subscription Context (`context/SubscriptionContext.js`)
- ✅ React Context for subscription state management
- ✅ Automatic RevenueCat initialization
- ✅ Subscription status refresh
- ✅ Scan limit enforcement
- ✅ Purchase and restore functions
- ✅ Paywall and Customer Center integration

#### Paywall Component (`components/PaywallScreen.js`)
- ✅ Custom paywall with product selection
- ✅ Basic, Premium Monthly, and Lifetime options
- ✅ RevenueCat Paywall UI integration
- ✅ Restore purchases functionality
- ✅ Beautiful, modern UI

### 4. Product Configuration

The app is configured to support three pricing tiers:
- **Basic** (`basic`) - $4.99 one-time payment
- **Premium Monthly** (`premium_monthly`) - $9.99/month recurring subscription
- **Lifetime Access** (`lifetime`) - $24.99 one-time payment (limited early access)

### 5. Entitlement

- **Entitlement Identifier**: `Catfish Pro`
- Used throughout the app to check subscription status
- All three products grant this entitlement

---

## 📋 Setup Steps

### Step 1: RevenueCat Dashboard Configuration

1. **Log in to RevenueCat Dashboard**
   - Go to https://app.revenuecat.com
   - Select your project (or create a new one)

2. **Create Products**
   - Navigate to **Products** → **Add Product**
   - Create products with identifiers:
     - `basic` - $4.99 one-time purchase
     - `premium_monthly` - $9.99/month subscription
     - `lifetime` - $24.99 one-time purchase

3. **Create Entitlement**
   - Navigate to **Entitlements** → **Add Entitlement**
   - Name: **Catfish Pro**
   - Identifier: `Catfish Pro` (must match exactly)
   - Attach all three products to this entitlement

4. **Create Offering**
   - Navigate to **Offerings** → **Create Offering**
   - Name: `default` (or any name)
   - Add all three products (basic, premium_monthly, lifetime)
   - Set as **default offering**

5. **Get API Keys**
   - Go to **Project Settings** → **API Keys**
   - Copy **Public API Key** for iOS (starts with `appl_`)
   - Copy **Public API Key** for Android (starts with `goog_`)
   - For testing, you can use the test key: `test_RUkWKORAXIzvyDqTDjjcCHloVzB`

### Step 2: App Store Connect / Google Play Console

#### iOS (App Store Connect)
1. Go to App Store Connect → Your App → Features → In-App Purchases
2. Create products:
   - Basic: Non-consumable, $4.99
   - Premium Monthly: Auto-renewable subscription, $9.99/month
   - Lifetime: Non-consumable, $24.99
3. Product IDs should match your RevenueCat product identifiers (`basic`, `premium_monthly`, `lifetime`)

#### Android (Google Play Console)
1. Go to Google Play Console → Your App → Monetize → Products
2. Create products:
   - Basic: One-time product, $4.99
   - Premium Monthly: Subscription, $9.99/month
   - Lifetime: One-time product, $24.99
3. Product IDs should match your RevenueCat product identifiers (`basic`, `premium_monthly`, `lifetime`)

### Step 3: Update API Keys (Production)

When ready for production, update `catfish/config/apiConfig.js`:

```javascript
const REVENUECAT_API_KEY = {
  ios: 'appl_YOUR_IOS_PRODUCTION_KEY', // Replace with your iOS key
  android: 'goog_YOUR_ANDROID_PRODUCTION_KEY', // Replace with your Android key
};
```

### Step 4: Test the Integration

1. **Run the app**
   ```bash
   cd catfish
   npm start
   ```

2. **Test Purchase Flow**
   - Tap "Upgrade" button
   - Select a subscription plan
   - Complete test purchase (use sandbox account)

3. **Test Restore Purchases**
   - Tap "Restore Purchases" in PaywallScreen
   - Verify subscription is restored

4. **Test Customer Center**
   - If subscribed, tap "Manage Subscription" in ProfileScreen
   - Verify Customer Center opens

---

## 🎯 Usage Examples

### Check Subscription Status

```javascript
import { useSubscription } from './context/SubscriptionContext';

function MyComponent() {
  const { isPro, scansRemaining, scanLimit } = useSubscription();
  
  return (
    <Text>
      {isPro ? 'Unlimited' : `${scansRemaining}/${scanLimit}`}
    </Text>
  );
}
```

### Show Paywall

```javascript
import { useSubscription } from './context/SubscriptionContext';

function MyComponent() {
  const { presentPaywall } = useSubscription();
  
  const handleUpgrade = async () => {
    try {
      await presentPaywall();
      // Subscription status will be refreshed automatically
    } catch (error) {
      console.error('Error showing paywall:', error);
    }
  };
  
  return <Button onPress={handleUpgrade} title="Upgrade" />;
}
```

### Open Customer Center

```javascript
import { useSubscription } from './context/SubscriptionContext';

function MyComponent() {
  const { presentCustomerCenter, isPro } = useSubscription();
  
  const handleManage = async () => {
    try {
      await presentCustomerCenter();
    } catch (error) {
      console.error('Error opening customer center:', error);
    }
  };
  
  if (isPro) {
    return <Button onPress={handleManage} title="Manage Subscription" />;
  }
}
```

### Purchase Specific Product

```javascript
import { useSubscription } from './context/SubscriptionContext';
import * as RevenueCatService from './services/revenueCatService';

async function purchasePremiumMonthly() {
  try {
    const customerInfo = await RevenueCatService.purchaseProduct('premium_monthly');
    // Handle success
  } catch (error) {
    if (error.userCancelled) {
      // User cancelled
    } else {
      // Handle error
    }
  }
}
```

---

## 🔧 Error Handling

The integration includes comprehensive error handling:

### Purchase Errors
- **User Cancelled**: Handled gracefully, no error shown
- **Payment Pending**: Shows appropriate message
- **Product Not Available**: Shows error message
- **Network Errors**: Shows retry message

### Best Practices
- Always check `error.userCancelled` before showing error messages
- Use try-catch blocks around all RevenueCat operations
- Refresh subscription status after purchases/restores

---

## 📱 Features

### Paywall Options

1. **Custom Paywall** (`PaywallScreen.js`)
   - Full control over UI/UX
   - Product selection interface
   - Basic, Premium Monthly, Lifetime options

2. **RevenueCat Paywall UI**
   - Native RevenueCat paywall
   - Automatically styled
   - Accessible via "Use RevenueCat Paywall UI" button

### Customer Center

- Manage subscriptions
- View subscription details
- Cancel subscriptions
- Restore purchases
- Accessible from ProfileScreen when subscribed

---

## 🐛 Troubleshooting

### Products Not Loading
- ✅ Check API keys are correct
- ✅ Verify products exist in RevenueCat dashboard
- ✅ Ensure offering is set as default
- ✅ Check product identifiers match

### Purchase Fails
- ✅ Verify sandbox/test account is set up
- ✅ Check product IDs match between stores and RevenueCat
- ✅ Ensure products are approved in App Store Connect/Play Console

### Entitlement Not Active
- ✅ Verify entitlement identifier is exactly "Catfish Pro"
- ✅ Check products are attached to entitlement
- ✅ Ensure purchase completed successfully

### Customer Center Not Opening
- ✅ Verify RevenueCat UI package is installed
- ✅ Check user has active subscription
- ✅ Ensure API keys are configured

---

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native Purchases SDK](https://github.com/RevenueCat/react-native-purchases)
- [RevenueCat Paywalls](https://www.revenuecat.com/docs/tools/paywalls)
- [Customer Center](https://www.revenuecat.com/docs/tools/customer-center)

---

## ✨ Next Steps

1. **Configure Products in RevenueCat Dashboard**
   - Create products: monthly, yearly, lifetime
   - Create entitlement: TEKJIN Pro
   - Create offering with all products

2. **Set Up Store Products**
   - Create products in App Store Connect (iOS)
   - Create products in Google Play Console (Android)
   - Match product IDs with RevenueCat

3. **Test Thoroughly**
   - Test purchases in sandbox/test environment
   - Test restore purchases
   - Test subscription management
   - Test entitlement checking

4. **Deploy to Production**
   - Update API keys to production keys
   - Test with real purchases
   - Monitor RevenueCat dashboard for issues

---

## 🎉 You're All Set!

Your RevenueCat integration is complete and ready to use. The app now supports:
- ✅ Subscription purchases (Basic, Premium Monthly, Lifetime)
- ✅ Entitlement checking for Catfish Pro
- ✅ Paywall presentation
- ✅ Customer Center for subscription management
- ✅ Restore purchases
- ✅ Comprehensive error handling

Happy coding! 🚀
