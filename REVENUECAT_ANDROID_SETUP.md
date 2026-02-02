# RevenueCat Android Configuration - Complete Step-by-Step Guide

This guide provides complete instructions for connecting Google Play Console to RevenueCat and configuring Android **one-time in-app purchases** (no subscriptions).

---

## Prerequisites

Before starting, make sure you have:
- ✅ Google Play Console account with admin access
- ✅ Google Cloud account (can be linked to your Play Console account)
- ✅ RevenueCat account with a project created
- ✅ Android app created in Google Play Console (even if not published)

## Important: One-Time Purchases Only

This guide is configured for **one-time in-app purchases only** (no subscriptions). Your app will use:
- **In-app products** in Google Play Console (not subscriptions)
- Products: `basic` and `lifetime` (one-time purchases)
- No recurring billing or subscription management needed

---

## Step 0: Add BILLING Permission to Your App (REQUIRED FIRST)

Before you can create products in Google Play Console, you must add the BILLING permission to your Android app.

### Add Permission to app.json

1. **Open `app.json`**
   - Located in your project root: `catfish/app.json`

2. **Add BILLING Permission**
   - In the `android.permissions` array, add: `"com.android.vending.BILLING"`
   - The permissions array should now include:
   ```json
   "permissions": [
     // ... your existing permissions ...
     "com.android.vending.BILLING"
   ]
   ```

3. **Rebuild Your App**
   - ⚠️ **Important**: You must rebuild your app for the permission to take effect
   - Run: `eas build --profile preview --platform android` (or your build command)
   - Or: `npx expo prebuild` followed by building with Android Studio

4. **Upload New Build to Google Play Console**
   - Upload the new APK/AAB to Google Play Console
   - Go to **Release** → **Production** (or any track) → Upload new version
   - After the build is uploaded, you can create products

**Note**: The BILLING permission has been added to your `app.json` file. You just need to rebuild and upload.

---

## Step 1: Create One-Time Products in Google Play Console

Since your app uses **one-time purchases only** (no subscriptions), you'll create In-app products in Google Play Console.

**Prerequisite**: Make sure you've completed Step 0 (added BILLING permission and uploaded a new build).

### Part A: Create In-App Products

1. **Navigate to In-App Products**
   - Go to Google Play Console → **Your App** → **Monetize** → **Products** → **In-app products**
   - Click **"Create product"**

2. **Create Basic Product**
   - **Product ID**: Enter `basic`
     - ⚠️ **Important**: This must match exactly with your RevenueCat product identifier
   - **Name**: Enter a display name (e.g., "Basic Pack")
   - **Description**: Add a description (e.g., "Get 15 scans")
   - **Price**: Set your price (e.g., $4.99)
   - **Status**: Set to **"Active"**
   - Click **"Save"**
   - Ensure the product status is **"Active"**

3. **Create Lifetime Product**
   - Click **"Create product"** again
   - **Product ID**: Enter `lifetime`
     - ⚠️ **Important**: This must match exactly with your RevenueCat product identifier
   - **Name**: Enter a display name (e.g., "Lifetime Access")
   - **Description**: Add a description (e.g., "Unlimited scans forever")
   - **Price**: Set your price (e.g., $24.99)
   - **Status**: Set to **"Active"**
   - Click **"Save"**
   - Ensure the product status is **"Active"**

### Part B: Verify Product IDs

**Critical**: Your Product IDs in Google Play Console must match your RevenueCat product identifiers exactly.

Your code expects these Product IDs (one-time purchases only):
- `basic` - One-time purchase (e.g., $4.99)
- `lifetime` - One-time purchase (e.g., $24.99)

**Note**: Your code also references `premium_monthly`, but since you're not using subscriptions, you can either:
- Skip creating `premium_monthly` in Google Play Console (it won't be available on Android)
- Or create it as a one-time product if you want it available (though it's named "monthly", it will be a one-time purchase)

Make sure your Google Play Console products use these exact IDs.

---

## Step 2: Set Up Google Cloud Service Account

### Part A: Create or Access Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Sign in with the same Google account used for Play Console

2. **Create or Select Project**
   - If you don't have a project, click **"Create Project"**
   - Name it (e.g., "Catfish App" or "RevenueCat Integration")
   - Or select an existing project linked to your Play Console

### Part B: Enable Required APIs

1. **Enable Google Play Android Developer API**
   - Go to **APIs & Services** → **Library**
   - Search for **"Google Play Android Developer API"**
   - Click on it and click **"Enable"**

2. **Enable Google Play Developer Reporting API**
   - In the same Library, search for **"Google Play Developer Reporting API"**
   - Click on it and click **"Enable"**

3. **Enable Pub/Sub API** (for real-time notifications - recommended)
   - Search for **"Cloud Pub/Sub API"**
   - Click on it and click **"Enable"**

### Part C: Create Service Account

1. **Navigate to Service Accounts**
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **"Create Service Account"**

2. **Configure Service Account**
   - **Service account name**: Enter a name (e.g., "revenuecat-service")
   - **Service account ID**: Will auto-generate (you can change it)
   - **Description**: Optional - "Service account for RevenueCat integration"
   - Click **"Create and Continue"**

3. **Grant Roles** (IMPORTANT - do not skip)
   - Click **"Select a role"** dropdown
   - Add these roles one by one:
     - **Pub/Sub Editor** (or **Pub/Sub Admin** if Editor doesn't work)
     - **Monitoring Viewer**
   - Click **"Continue"**

4. **Grant Access to Users** (optional - can skip)
   - You can skip this step
   - Click **"Done"**

### Part D: Create and Download JSON Key

1. **Generate Key**
   - Find your newly created service account in the list
   - Click on the service account email
   - Go to **"Keys"** tab
   - Click **"Add Key"** → **"Create new key"**
   - Select **JSON** format
   - Click **"Create"**

2. **Download JSON File**
   - The JSON file will automatically download
   - ⚠️ **CRITICAL**: Save this file securely - you can only download it once!
   - The file will look like: `your-project-xxxxx-xxxxx.json`
   - **Do not share this file publicly** - it contains sensitive credentials

3. **Note the Service Account Email**
   - Copy the service account email (looks like: `revenuecat-service@your-project.iam.gserviceaccount.com`)
   - You'll need this in the next step

---

## Step 3: Grant Access in Google Play Console

### Part A: Invite Service Account as User

1. **Navigate to Users & Permissions**
   - Go to Google Play Console → **Setup** → **Users & permissions**
   - Click **"Invite users"** or **"Invite new users"**

2. **Add Service Account**
   - **Email address**: Paste the service account email you copied
     - Example: `revenuecat-service@your-project.iam.gserviceaccount.com`
   - **Access level**: Select **"App access"** (not Account access, unless you need it)

3. **Grant App Permissions**
   - Under **"App permissions"**, select your app
   - Grant these permissions (all three are required, even for one-time products):
     - ✅ **"View app information and download bulk reports (read-only)"**
     - ✅ **"View financial data, orders, and cancellation survey response"**
     - ✅ **"Manage orders and subscriptions"** (required even for one-time products)
   - Click **"Send invitation"**

4. **Accept Invitation** (if needed)
   - The service account will receive an email invitation
   - You may need to accept it (check the service account email or Play Console)

5. **Verify Access**
   - Go back to **Users & permissions**
   - Verify the service account appears in the list
   - Status should be **"Active"**

### Part B: Verify App Requirements

1. **Check App Status**
   - Your app should be created in Play Console (even if not published)
   - Go to **Your App** → **Release** → **Production** (or any track)
   - You should have at least one app bundle/APK uploaded (even for testing)

2. **Verify Products are Active**
   - Go to **Monetize** → **Products** → **In-app products**
   - Ensure all products show status as **"Active"**

---

## Step 4: Connect Google Play to RevenueCat

### Part A: Navigate to App Settings in RevenueCat

1. **Go to RevenueCat Dashboard**
   - Visit https://app.revenuecat.com
   - Select your project

2. **Navigate to Apps & Providers**
   - Click **"Apps & Providers"** in the left sidebar
   - Or go to **Project Settings** → **Apps**

3. **Find or Create Android App**
   - If you already have an Android app, click on it
   - If not, click **"Add app"** → Select **"Google Play"** → Enter your app details:
     - **Package name**: Must match your app's package name exactly (e.g., `com.yourcompany.catfish`)
     - **App name**: Your app name

### Part B: Upload Service Account Credentials

1. **Upload JSON Key File**
   - In your Android app settings, find **"Google Play"** or **"Service Account"** section
   - Click **"Upload credentials"** or **"Choose file"**
   - Select the JSON file you downloaded from Google Cloud
   - The file will be uploaded

2. **Verify Package Name**
   - Ensure the **Package name** matches your app's package name exactly
   - This is found in your `build.gradle` file: `applicationId`
   - Must match exactly (case-sensitive)

3. **Save Configuration**
   - Click **"Save"** or **"Connect"**
   - RevenueCat will validate the credentials
   - You may see a warning - this is normal (see troubleshooting below)

### Part C: Wait for Credentials to Propagate

⚠️ **IMPORTANT**: Google can take **up to 24-36 hours** to fully propagate the permissions. During this time:
- You may see "Invalid Play Store credentials" errors
- Products may not sync immediately
- This is **normal** - just wait

---

## Step 5: Link/Import Products in RevenueCat

### Option 1: Automatic Import (Recommended - if available)

1. **Navigate to Products**
   - Go to RevenueCat Dashboard → **Product Catalog** → **Products**
   - Click on the **"Google Play"** tab

2. **Import Products**
   - Click **"Import from Google Play"** or **"Sync Products"**
   - RevenueCat will show your products from Google Play Console
   - Select the products you want to import
   - They will automatically be created with the correct Product IDs

### Option 2: Manual Linking

1. **Go to Products**
   - Go to RevenueCat Dashboard → **Products**
   - Click on your existing product (or create a new one)

2. **Link Google Play Product**
   - After Google Play is connected, you should see **"Google Play"** section
   - Enter the **Product ID** exactly as it appears in Google Play Console
   - Select your **App** from the dropdown
   - Click **"Save"**

3. **Verify Product Sync**
   - Wait a few minutes for RevenueCat to sync
   - Product details (price, description) should populate automatically
   - Check that product status shows as "Active"

---

## Step 6: Configure Entitlements

1. **Create Entitlement (if not already created)**
   - Go to RevenueCat Dashboard → **Entitlements** → **Add Entitlement**
   - **Identifier**: `Catfish Pro` (must match exactly - case sensitive)
   - **Display Name**: Catfish Pro (or any friendly name)
   - Click **"Save"**

2. **Attach Products to Entitlement**
   - Click on the **Catfish Pro** entitlement
   - Under **Products**, click **"Attach Product"**
   - Select all your Android products (basic, lifetime, etc.)
   - This ensures all products grant the same entitlement

---

## Step 7: Configure Offerings

1. **Verify Default Offering**
   - Go to RevenueCat Dashboard → **Offerings**
   - Check that you have a **default offering** (or create one named `default`)
   - The default offering is what the app will fetch automatically

2. **Add Products to Offering**
   - Click on your offering
   - Under **Packages**, add all your Android products
   - You can organize them into packages or add products directly

3. **Set as Default**
   - Make sure your offering is marked as **"Default Offering"**

---

## Step 8: Configure API Keys in Your App

1. **Get Android API Key from RevenueCat**
   - Go to RevenueCat Dashboard → **Project Settings** → **API Keys**
   - Copy the **Android Public Key** (starts with `goog_`)
   - Or use the **Test Key** (starts with `test_`) for testing

2. **Update Your App Configuration**
   - Open `catfish/config/apiConfig.js`
   - Update the `REVENUECAT_API_KEY` object:

```javascript
const REVENUECAT_API_KEY = {
  ios: 'appl_YOUR_IOS_KEY_HERE', // Your iOS key (if you have one)
  android: 'goog_YOUR_ANDROID_KEY_HERE', // Replace with your Android public key
};
```

   - **For Testing**: You can use the test key temporarily:
```javascript
const REVENUECAT_API_KEY = {
  ios: 'test_YOUR_TEST_KEY_HERE',
  android: 'test_YOUR_TEST_KEY_HERE',
};
```

---

## Step 9: Set Up Real-Time Notifications (Optional but Recommended)

This enables RevenueCat to receive instant notifications about purchases, cancellations, etc.

### Part A: Configure in RevenueCat

1. **Navigate to App Settings**
   - Go to RevenueCat Dashboard → **Apps & Providers** → Your Android App
   - Find **"Real-Time Notifications"** or **"Google Pub/Sub"** section

2. **Connect to Google**
   - Click **"Connect to Google"** or **"Set up Pub/Sub"**
   - Choose or create a **Topic ID** (e.g., `catfish-notifications`)
   - RevenueCat will generate a subscription URL

3. **Copy Topic ID**
   - Copy the Topic ID that RevenueCat generated
   - You'll need this for the next step

### Part B: Configure in Google Play Console

1. **Navigate to Monetization Setup**
   - Go to Google Play Console → **Your App** → **Monetize** → **Monetization setup**

2. **Enable Real-Time Developer Notifications**
   - Find **"Real-time developer notifications"** section
   - Paste the **Topic ID** from RevenueCat
   - Enable notifications for:
     - ✅ **Voided purchases** (for refunds/cancellations)
     - ✅ **One-time products** (for your in-app purchases)
   - **Note**: You can skip "Subscriptions" since you're not using subscriptions
   - Click **"Save"**

3. **Test Notification** (optional)
   - RevenueCat may provide a test notification feature
   - Use it to verify the setup is working

---

## Step 10: Testing Checklist

Before going to production, test the following:

- [ ] Service account JSON uploaded to RevenueCat
- [ ] Service account has correct permissions in Play Console
- [ ] Products created in Google Play Console with correct IDs
- [ ] Products linked/imported in RevenueCat
- [ ] Entitlement created and products attached
- [ ] Default offering configured with all products
- [ ] Android API key configured in `apiConfig.js`
- [ ] App builds successfully with RevenueCat SDK
- [ ] Products appear in the app (test on a real device or emulator with Google Play Services)
- [ ] Test purchase flow works (use Google Play test accounts)
- [ ] Restore purchases works
- [ ] Entitlement grants correctly after purchase

---

## Troubleshooting Common Issues

### Issue: "Invalid Play Store credentials" Error

**Possible Causes:**
1. **Permissions not granted correctly**
   - Verify all three permissions are granted in Play Console
   - Check service account status is "Active"

2. **JSON file incorrect**
   - Verify you uploaded the correct JSON file
   - Check for extra whitespace or formatting issues
   - Ensure the file wasn't modified

3. **Not enough time passed**
   - Google can take 24-36 hours to propagate permissions
   - Wait at least 24 hours before troubleshooting further

4. **APIs not enabled**
   - Verify Google Play Android Developer API is enabled
   - Verify Google Play Developer Reporting API is enabled

**Solution:**
- Double-check all permissions in Play Console
- Verify service account email matches
- Wait 24-36 hours after initial setup
- Re-upload JSON file if needed

### Issue: Products Not Showing Up

**Possible Causes:**
1. **Products not active in Play Console**
   - Products must be "Active" status
   - Check Play Console → Monetize → Products → In-app products

2. **Product IDs don't match**
   - Verify Product IDs match exactly between Play Console and RevenueCat
   - Check for typos or case sensitivity

3. **Package name mismatch**
   - Verify package name in RevenueCat matches your app's package name exactly
   - Check `build.gradle` → `applicationId`

**Solution:**
- Activate all products in Play Console
- Verify Product IDs match exactly
- Check package name matches

### Issue: "Service Account Not Found" or Permission Errors

**Possible Causes:**
1. **Service account not invited to Play Console**
   - Verify service account email is in Users & Permissions
   - Check invitation was accepted

2. **Incorrect permissions**
   - All three permissions must be granted
   - Check under App permissions, not Account permissions

**Solution:**
- Re-invite service account if needed
- Verify all three permissions are checked
- Wait for permissions to propagate (24-36 hours)

### Issue: Real-Time Notifications Not Working

**Possible Causes:**
1. **Pub/Sub API not enabled**
   - Enable Cloud Pub/Sub API in Google Cloud

2. **Topic ID mismatch**
   - Verify Topic ID in Play Console matches RevenueCat

3. **Notifications not enabled for all product types**
   - Enable for Subscriptions, Voided purchases, AND One-time products

**Solution:**
- Enable Pub/Sub API
- Verify Topic ID matches exactly
- Enable all notification types

---

## Quick Reference

### Product Identifiers Expected by Code:
- `basic` - One-time purchase (e.g., $4.99)
- `lifetime` - One-time purchase (e.g., $24.99)

**Note**: Your code may reference `premium_monthly`, but since you're using one-time purchases only, this product won't be available on Android. The app will handle this gracefully.

### Entitlement Identifier:
- `Catfish Pro` (case sensitive)

### Configuration File:
- `catfish/config/apiConfig.js` - Update `REVENUECAT_API_KEY.android`

### Service Account Permissions Required (for one-time products):
1. View app information and download bulk reports (read-only)
2. View financial data, orders, and cancellation survey response
3. Manage orders and subscriptions (required even for one-time products)

### Google Cloud Roles Required:
- Pub/Sub Editor (or Pub/Sub Admin)
- Monitoring Viewer

---

## Timeline Expectations

- **Service Account Setup**: 5-10 minutes
- **Play Console Permissions**: 5 minutes
- **RevenueCat Configuration**: 5 minutes
- **Google Permission Propagation**: 24-36 hours ⚠️
- **Product Sync**: Usually immediate after propagation

**Total Setup Time**: ~30 minutes of work + 24-36 hour wait for Google

---

## Next Steps After Configuration

1. ✅ Test purchases with Google Play test accounts
2. ✅ Verify entitlements grant correctly
3. ✅ Test restore purchases functionality
4. ✅ Monitor RevenueCat dashboard for purchase events
5. ✅ Set up webhooks (if using backend integration)
6. ✅ Prepare for production release

---

## Need Help?

- RevenueCat Documentation: https://docs.revenuecat.com/
- RevenueCat Support: support@revenuecat.com
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- Check RevenueCat Dashboard → Events for purchase logs
- Enable debug logging in development (already configured in code)

---

**You're all set!** Follow these steps in order, and your Android RevenueCat integration will be complete.
