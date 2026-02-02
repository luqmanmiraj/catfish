# Complete RevenueCat Setup Guide - Scan Packs Configuration

This is a complete step-by-step guide for configuring RevenueCat with your scan packs:
- **pack_15** - 15 scans pack
- **pack_50** - 50 scans pack  
- **pack_100** - 100 scans pack

**Note**: Product identifiers in RevenueCat are `pack_15`, `pack_50`, `pack_100`. These should match the Product IDs in App Store Connect and Google Play Console for consistency.

---

## Overview

You'll configure:
1. ✅ App Store Connect (iOS) - Create products
2. ✅ Google Play Console (Android) - Create products
3. ✅ RevenueCat Dashboard - Create products, entitlements, offerings
4. ✅ Link products between stores and RevenueCat
5. ✅ Configure API keys in your app

---

## Part 1: Configure App Store Connect (iOS)

### Step 1: Create In-App Purchase Products

1. **Go to App Store Connect**
   - Visit https://appstoreconnect.apple.com
   - Sign in with your Admin account

2. **Navigate to Your App**
   - Click on your app
   - Go to **Features** → **In-App Purchases**

3. **Create First Product: pack_15**
   - Click **"+"** or **"Create"** button
   - Select **"Non-Consumable"** (one-time purchase)
   - **Product ID**: Enter exactly `pack_15` (must match RevenueCat identifier)
   - **Reference Name**: "15 Scans Pack" (for your internal use)
   - Click **"Create"**

4. **Configure pack_15 Product**
   - **Price**: Set to your price (e.g., $4.99)
   - **Display Name**: "15 Scans Pack"
   - **Description**: "Get 15 image scans to detect AI-generated content"
   - **Review Information**: Add screenshot and description for App Review
   - Click **"Save"**
   - Set status to **"Ready to Submit"** or **"Submit for Review"**

5. **Create Second Product: pack_50**
   - Click **"+"** or **"Create"** button
   - Select **"Non-Consumable"**
   - **Product ID**: Enter exactly `pack_50` (must match RevenueCat identifier)
   - **Reference Name**: "50 Scans Pack"
   - Click **"Create"**
   - Configure price, display name, description
   - Set status to **"Ready to Submit"**

6. **Create Third Product: pack_100**
   - Click **"+"** or **"Create"** button
   - Select **"Non-Consumable"**
   - **Product ID**: Enter exactly `pack_100` (must match RevenueCat identifier)
   - **Reference Name**: "100 Scans Pack"
   - Click **"Create"**
   - Configure price, display name, description
   - Set status to **"Ready to Submit"**

### Step 2: Generate In-App Purchase Key (If Not Done)

1. **Go to Users and Access**
   - Click **Users and Access** → **Integrations** → **In-App Purchase**

2. **Generate Key** (if not already done)
   - Click **"+"** or **"Generate In-App Purchase Key"**
   - Name it (e.g., "RevenueCat Integration")
   - Download the `.p8` file (only once!)
   - Note the **Key ID** and **Issuer ID**

3. **Save Credentials**
   - Save: .p8 file, Key ID, Issuer ID securely

---

## Part 2: Configure Google Play Console (Android)

### Step 1: Create In-App Products

1. **Go to Google Play Console**
   - Visit https://play.google.com/console
   - Sign in with your account

2. **Navigate to Your App**
   - Select your app
   - Go to **Monetize** → **Products** → **In-app products**

3. **Create First Product: pack_15**
   - Click **"Create product"**
   - **Product ID**: Enter exactly `pack_15` (must match RevenueCat identifier)
   - **Name**: "15 Scans Pack"
   - **Description**: "Get 15 image scans to detect AI-generated content"
   - **Price**: Set your price (e.g., $4.99)
   - **Status**: Set to **"Active"**
   - Click **"Save"**

4. **Create Second Product: pack_50**
   - Click **"Create product"**
   - **Product ID**: Enter exactly `pack_50` (must match RevenueCat identifier)
   - **Name**: "50 Scans Pack"
   - **Description**: "Get 50 image scans to detect AI-generated content"
   - **Price**: Set your price (e.g., $9.99)
   - **Status**: Set to **"Active"**
   - Click **"Save"**

5. **Create Third Product: pack_100**
   - Click **"Create product"**
   - **Product ID**: Enter exactly `pack_100` (must match RevenueCat identifier)
   - **Name**: "100 Scans Pack"
   - **Description**: "Get 100 image scans to detect AI-generated content"
   - **Price**: Set your price (e.g., $16.99)
   - **Status**: Set to **"Active"**
   - Click **"Save"**

### Step 2: Set Up Google Cloud Service Account (If Not Done)

Follow the steps in `REVENUECAT_ANDROID_SETUP.md` to:
1. Create Google Cloud service account
2. Grant permissions in Google Play Console
3. Download JSON credentials

---

## Part 3: Configure RevenueCat Dashboard

### Step 1: Connect App Store Connect to RevenueCat

1. **Go to RevenueCat Dashboard**
   - Visit https://app.revenuecat.com
   - Sign in and select your project

2. **Navigate to Apps & Providers**
   - Click **"Apps & Providers"** in left sidebar
   - Find your iOS app (or create one)

3. **Add App Store Connect Credentials**
   - Click on your iOS app
   - Find **"App Store Connect"** section
   - Upload the **In-App Purchase Key (.p8 file)**
   - Enter **Key ID**
   - Enter **Issuer ID**
   - Enter your **Bundle ID** (must match App Store Connect exactly - case sensitive!)
   - Enter **App Name**
   - Click **"Save"**
   - ⚠️ **Wait for validation** - Look for "Connected" status or any error messages
   - If you see "Credentials need attention", click the refresh button to re-validate
   - **Important**: The connection must be validated before you can link products

### Step 2: Connect Google Play to RevenueCat

1. **Find or Create Android App**
   - In **Apps & Providers**, find your Android app (or create one)

2. **Add Google Play Credentials**
   - Click on your Android app
   - Find **"Google Play"** section
   - Upload the **Service Account JSON file**
   - Enter **Package Name** (must match your app exactly)
   - Click **"Save"**

### Step 3: Create Products in RevenueCat

1. **Go to Products**
   - Click **"Product Catalog"** → **"Products"** in left sidebar

2. **Create pack_15 Product**
   - Click **"Add Product"** or **"+"** button
   - **Product Identifier**: Enter `pack_15` (this is what you already created in RevenueCat)
   - **Display Name**: "15 Scans Pack"
   - **Description**: "Get 15 image scans"
   - Click **"Save"**

3. **Link Products to App Store Connect and Google Play**

   **Method 1: From Product Page (if available)**
   - Click on the `pack_15` product you just created
   - Look for **"App Store Connect"** section
   - If visible, enter Product ID: `pack_15` (must match App Store Connect Product ID)
   - Select your iOS app from dropdown
   - Find **"Google Play"** section
   - Enter Product ID: `pack_15` (must match Google Play Console Product ID)
   - Select your Android app from dropdown
   - Click **"Save"**

   **Method 2: From Offerings Page (Alternative - Works if Method 1 doesn't show sections)**
   - Go to **Offerings** → Select your offering → Click **"Edit Offering"**
   - Under your products, you'll see product icons for each platform (iOS/Android)
   - Click on the **iOS app icon** (Apple logo) next to your `pack_15` product
   - Enter the Product ID: `pack_15` (must match App Store Connect exactly)
   - Click on the **Android app icon** (Google Play logo) next to your `pack_15` product
   - Enter the Product ID: `pack_15` (must match Google Play Console exactly)
   - Click **"Save"** on the offering
   - ⚠️ **Note**: This method links products directly in the offering, which is also valid!

   **Repeat for pack_50 and pack_100:**
   - Create products with identifiers: `pack_50` and `pack_100` in RevenueCat
   - Use the same method to link them
   - Make sure Product IDs match exactly: `pack_50` and `pack_100` in both stores

### ⚠️ Troubleshooting: App Store Connect Section Not Visible

If you don't see the "App Store Connect" section when viewing a product, try these steps:

**Step 1: Verify App Connection Status**
1. Go to **Apps & Providers** → Click on your iOS app
2. Check the **"App Store Connect"** section
3. Look for any error messages or warnings
4. Check if it says "Connected" or "Credentials need attention"
5. If it says "Credentials need attention", click the **refresh/validate** button

**Step 2: Verify Credentials Are Correct**
1. In your iOS app settings, verify:
   - ✅ .p8 file is uploaded
   - ✅ Key ID is entered correctly
   - ✅ Issuer ID is entered correctly
   - ✅ Bundle ID matches App Store Connect exactly (case-sensitive)
   - ✅ App Name is entered

2. **Check for Errors:**
   - Look for red error messages
   - Check if credentials are validated
   - Try clicking "Save" again to re-validate

**Step 3: Check App Store Connect Legal Agreements**
1. Go to App Store Connect → **Agreements, Tax, and Banking**
2. Check if there are any pending agreements
3. **Only Account Holder can approve agreements**
4. If there are pending agreements, ask Account Holder to approve them
5. This is a common cause - RevenueCat can't connect if agreements aren't approved

**Step 4: Wait for Sync**
1. After adding credentials, RevenueCat needs time to sync with App Store Connect
2. Wait 5-10 minutes
3. Refresh the product page
4. Try navigating away and back to the product

**Step 5: Verify Products Exist in App Store Connect**
1. Go to App Store Connect → Your App → **Features** → **In-App Purchases**
2. Verify your products (`pack_15`, `pack_50`, `pack_100`) are created
3. Check that they are in "Ready to Submit" or "Approved" status
4. Products must exist in App Store Connect before linking in RevenueCat

**Step 6: Use Alternative Method - Link from Offerings Page**
1. If you can't see App Store Connect section on product page, use this method:
2. Go to **Offerings** → Select your offering → Click **"Edit Offering"**
3. You'll see product icons (iOS/Android) next to each product
4. Click the iOS icon and enter Product ID from App Store Connect
5. Click the Android icon and enter Product ID from Google Play Console
6. This method works even if the product page doesn't show the sections!
7. Click **"Save"** on the offering

**Step 7: Try Manual Product Import**
1. Go to RevenueCat → **Product Catalog** → **Products**
2. Click on the **"Apple App Store"** tab (if available)
3. Click **"Import from App Store Connect"** or **"Sync Products"**
4. This may help establish the connection

**Step 7: Check Bundle ID Match**
1. Verify Bundle ID in RevenueCat matches App Store Connect **exactly**
2. Check for:
   - Case sensitivity (must match exactly)
   - Extra spaces
   - Typos
3. Bundle ID should be like: `com.yourcompany.catfish`

**Step 8: Re-upload Credentials**
1. In Apps & Providers → Your iOS App
2. Try removing and re-uploading the .p8 file
3. Re-enter Key ID and Issuer ID
4. Click "Save" and wait for validation

**Step 9: Check RevenueCat Status**
1. Check RevenueCat status page for any service issues
2. Try logging out and back into RevenueCat
3. Clear browser cache and try again

**If Still Not Working:**
- Contact RevenueCat support with:
  - Screenshot of your app settings
  - Screenshot of the product page
  - Your Bundle ID
  - Any error messages you see

4. **Link to Google Play**
   - In the same product page
   - Find **"Google Play"** section
   - Enter Product ID: `scan_15`
   - Select your Android app from dropdown
   - Click **"Save"**

**Note**: You can link products either from the Product page or from the Offering page. Both methods work! If you don't see the App Store Connect section on the product page, use Method 2 (from Offerings page) as described above.

### Step 4: Create Entitlement

1. **Go to Entitlements**
   - Click **"Entitlements"** in left sidebar
   - Click **"Add Entitlement"**

2. **Create Entitlement**
   - **Identifier**: `Catfish Pro` (or your preferred name)
   - **Display Name**: "Catfish Pro"
   - Click **"Save"**

3. **Attach Products to Entitlement**
   - Click on the entitlement you created
   - Under **"Products"**, click **"Attach Product"**
   - Select all three products: `pack_15`, `pack_50`, `pack_100`
   - Click **"Save"**

### Step 5: Create Offering and Link Products

1. **Go to Offerings**
   - Click **"Offerings"** in left sidebar
   - Click **"Create Offering"** or edit the default offering

2. **Configure Offering**
   - **Name**: `default` (or your preferred name)
   - **Identifier**: `default`

3. **Add Products to Offering**
   - Under **"Products"** or **"Packages"**, add your three products:
     - `pack_15`
     - `pack_50`
     - `pack_100`
   - You can add them as packages or directly as products

4. **Link Products to Stores (Important!)**
   - After adding products, click **"Edit Offering"**
   - You'll see each product with platform icons (iOS/Android) next to them
   - **For each product:**
     - Click the **iOS app icon** (Apple logo)
     - Enter the Product ID that matches App Store Connect:
       - For `scan_15` product → Enter `scan_15`
       - For `scan_50` product → Enter `scan_50`
       - For `scan_100` product → Enter `scan_100`
     - Click the **Android app icon** (Google Play logo)
     - Enter the Product ID that matches Google Play Console:
       - For `scan_15` product → Enter `scan_15`
       - For `scan_50` product → Enter `scan_50`
       - For `scan_100` product → Enter `scan_100`
   - ⚠️ **Critical**: Product IDs must match exactly what you created in App Store Connect and Google Play Console

5. **Set as Default**
   - Make sure this offering is marked as **"Default Offering"**
   - Click **"Save"**

### Step 6: Get API Keys

1. **Go to Project Settings**
   - Click **"Project Settings"** in left sidebar
   - Click **"API Keys"**

2. **Copy API Keys**
   - Copy the **iOS Public Key** (starts with `appl_`)
   - Copy the **Android Public Key** (starts with `goog_`)
   - Or use the **Test Key** (starts with `test_`) for testing

---

## Part 4: Configure Your App

### Step 1: Update API Keys

1. **Open `catfish/config/apiConfig.js`**

2. **Update RevenueCat API Keys**
   ```javascript
   const REVENUECAT_API_KEY = {
     ios: 'appl_YOUR_IOS_KEY_HERE', // Replace with your iOS public key
     android: 'goog_YOUR_ANDROID_KEY_HERE', // Replace with your Android public key
   };
   ```

   Or for testing:
   ```javascript
   const REVENUECAT_API_KEY = {
     ios: 'test_YOUR_TEST_KEY_HERE',
     android: 'test_YOUR_TEST_KEY_HERE',
   };
   ```

### Step 2: Verify Product Identifiers in Code

Your code already uses these product identifiers:
- `pack_15`
- `pack_50`
- `pack_100`

The code in `PaywallScreen.js` already handles these identifiers correctly. It looks for products containing "15", "50", "100" or "pack_15", "pack_50", "pack_100" in their identifiers, so your setup will work perfectly.

---

## Part 5: Testing

### Step 1: Test on iOS (Sandbox)

1. **Build Your App**

   **Option A: Development Build (Recommended for Quick Testing)**
   - ✅ **You do NOT need TestFlight for sandbox testing**
   - Build a development build using EAS Build or Xcode
   - Install directly on your device via:
     - EAS Build → Download and install via Apple Configurator/TestFlight (internal)
     - Or Xcode → Connect device → Build and Run
   - **Advantages**: Faster, no App Store Connect upload needed
   - **Sandbox purchases work perfectly** with development builds

   **Option B: TestFlight Build (Optional, More Realistic)**
   - Upload build to App Store Connect → TestFlight
   - Install via TestFlight app on device
   - **Advantages**: More realistic testing environment, easier distribution to testers
   - **Note**: Still uses sandbox for purchases (unless app is in production)

   **Which to Use?**
   - ✅ **Start with Option A** (development build) - faster and sufficient for testing
   - Use Option B (TestFlight) if you want to test the full distribution flow
   - Both work with sandbox purchases - **TestFlight is NOT required**

   ⚠️ **Important**: RevenueCat only works in development/production builds (not Expo Go)

2. **Create and Use Sandbox Test Account**

   **Step A: Create Sandbox Test Account in App Store Connect**
   
   1. **Go to App Store Connect**
      - Visit https://appstoreconnect.apple.com
      - Sign in with your Admin account
   
   2. **Navigate to Sandbox Testers**
      - Click **"Users and Access"** in the top navigation
      - Click the **"Sandbox"** tab at the top
      - In the left sidebar, click **"Testers"** (under Sandbox section)
   
   3. **Create New Sandbox Tester**
      - Click the **"+"** button or **"Create Sandbox Tester"** button
      - A form will appear
   
   4. **Fill in Tester Information**
      - **Email**: Enter an email address that is NOT already associated with an Apple ID
        - ⚠️ **Important**: Use a real email format (e.g., `testuser1@example.com`)
        - You can use email aliases (e.g., `yourname+test1@gmail.com`)
        - The email cannot be used for a real Apple ID account
      - **Password**: Enter a password (at least 8 characters)
      - **First Name**: Enter a first name (e.g., "Test")
      - **Last Name**: Enter a last name (e.g., "User")
      - **Country/Region**: Select your country
   
   5. **Save the Tester**
      - Click **"Save"** or **"Create"**
      - The sandbox tester will be created
      - ⚠️ **Note**: You'll need to verify the email (check your email inbox)
   
   6. **Create Multiple Testers (Optional)**
      - You can create multiple sandbox testers for different test scenarios
      - Each tester needs a unique email address
   
   **Step B: Sign In with Sandbox Account on Your Device**
   
   1. **On Your iOS Test Device**
      - Go to **Settings** → **iTunes & App Store** (or **App Store** on newer iOS)
      - Scroll down to find **"Sandbox Account"** section (at the bottom)
   
   2. **Sign In to Sandbox**
      - Tap **"Sandbox Account"** or **"Sign In"**
      - Enter the email and password you created
      - Sign in
   
   3. **Important Notes:**
      - ✅ You can use sandbox account without signing out of your regular Apple ID (iOS 12+)
      - ✅ Your regular App Store account stays signed in for TestFlight apps
      - ✅ Sandbox purchases are free (no real charges)
      - ✅ You'll see "[Environment: Sandbox]" when confirming purchases
   
   **Prerequisites for Sandbox Testing:**
   - ✅ You must be enrolled in Apple Developer Program
   - ✅ You must have signed the **Paid Applications Agreement** in App Store Connect
   - ✅ Banking and tax information must be set up in App Store Connect
   - ✅ Your app's bundle identifier must match App Store Connect
   - ✅ In-App Purchases capability must be enabled

3. **Test Purchase Flow**
   - Open your app
   - Navigate to the paywall/purchase screen
   - Verify all three products appear
   - Try purchasing each product
   - Verify tokens are added after purchase

### ⚠️ Troubleshooting: "Offerings Empty" Error

If you see this error in your logs:
```
[RevenueCat] Error fetching offerings - None of the products registered in the RevenueCat dashboard could be fetched from App Store Connect
```

**Most Common Causes & Solutions:**

1. **Running in iOS Simulator** ⚠️ **MOST LIKELY ISSUE**
   - **Problem**: iOS Simulator has limited StoreKit support
   - **Error**: `Error Domain=ASDErrorDomain Code=509 "No active account"`
   - **Solution**: ✅ **Test on a real iOS device** (not simulator)
   - StoreKit errors in simulator are normal - they won't prevent testing on device

2. **No Sandbox Account Signed In**
   - **Problem**: Error "No active account" (Code 509)
   - **Solution**: Sign in with sandbox account on your device:
     - Settings → iTunes & App Store → Sandbox Account (at bottom)
     - Sign in with your sandbox tester credentials
     - Restart the app after signing in

3. **Products Not Created in App Store Connect**
   - **Problem**: Products don't exist yet
   - **Solution**: Create products `pack_15`, `pack_50`, `pack_100` in App Store Connect
   - Status must be "Ready to Submit" or "Approved"

4. **Products Not Linked Correctly in RevenueCat**
   - **Problem**: Products exist but not linked
   - **Solution**: Verify in RevenueCat Offering:
     - Products are added to offering
     - iOS icons show correct Product IDs (`pack_15`, `pack_50`, `pack_100`)
     - Product IDs match App Store Connect exactly

5. **Bundle ID Mismatch**
   - **Problem**: Bundle ID doesn't match
   - **Solution**: Verify Bundle ID matches exactly in:
     - RevenueCat Dashboard → Your iOS App
     - Your app's `app.json` → `ios.bundleIdentifier`

**Quick Fix Priority:**
1. ✅ **Test on real device** (not simulator) - This fixes most issues
2. ✅ **Sign in with sandbox account** on device
3. ✅ Verify products exist and are linked correctly

**Other Errors in Your Logs (Not Critical):**
- Facebook SDK warning - Can be ignored or fixed by adding client token
- PostHog error - App continues without PostHog
- UIBackgroundModes warnings - Can be ignored

See `REVENUECAT_OFFERINGS_EMPTY_TROUBLESHOOTING.md` for detailed troubleshooting guide.

### Step 2: Test on Android

1. **Build Your App**
   - Create a development build

2. **Create and Use Test Account**

   **Step A: Add Test Accounts in Google Play Console**
   
   1. **Go to Google Play Console**
      - Visit https://play.google.com/console
      - Sign in with your account
   
   2. **Navigate to License Testing**
      - Go to **Setup** → **License testing** (or **Monetize** → **License testing**)
      - Or go to **Settings** → **License testing**
   
   3. **Add Test Accounts**
      - Find **"License testers"** section
      - Click **"Add email addresses"** or **"Create list"**
      - Enter email addresses of Google accounts you want to use for testing
      - You can add multiple emails (one per line)
      - Click **"Save"**
   
   4. **Alternative: Use Test Accounts**
      - You can use any Google account for testing
      - Just add the email to the license testers list
      - The account doesn't need to be a developer account
   
   **Step B: Sign In with Test Account on Device**
   
   1. **On Your Android Test Device**
      - Go to **Settings** → **Accounts** → **Add account** → **Google**
      - Or open **Google Play Store** → **Profile** → **Add account**
   
   2. **Sign In**
      - Sign in with one of the test accounts you added
      - This account will be used for test purchases
   
   3. **Important Notes:**
      - ✅ Test purchases are free (no real charges)
      - ✅ You can add up to 20 test accounts
      - ✅ Test accounts can make purchases without payment
      - ✅ Products must be published (even if app isn't) for testing

3. **Test Purchase Flow**
   - Open your app
   - Navigate to the paywall/purchase screen
   - Verify all three products appear
   - Try purchasing each product
   - Verify tokens are added after purchase

---

## Verification Checklist

### App Store Connect
- [ ] All three products created: `pack_15`, `pack_50`, `pack_100`
- [ ] All products set to "Ready to Submit" or "Approved"
- [ ] In-App Purchase Key generated and saved
- [ ] Key ID and Issuer ID noted

### Google Play Console
- [ ] All three products created: `pack_15`, `pack_50`, `pack_100`
- [ ] All products set to "Active"
- [ ] Service account created and JSON downloaded
- [ ] Service account has correct permissions in Play Console

### RevenueCat Dashboard
- [ ] iOS app connected with In-App Purchase Key
- [ ] Android app connected with Service Account JSON
- [ ] All three products created in RevenueCat
- [ ] All products linked to App Store Connect
- [ ] All products linked to Google Play
- [ ] Entitlement created and products attached
- [ ] Default offering created with all products
- [ ] API keys copied

### Your App
- [ ] API keys updated in `apiConfig.js`
- [ ] App builds successfully
- [ ] Products appear in paywall
- [ ] Purchases work correctly
- [ ] Tokens are added after purchase

---

## Troubleshooting

### Products Not Showing in App

**Check:**
1. API keys are correct in `apiConfig.js`
2. Products are "Active" in both stores
3. Products are linked correctly in RevenueCat
4. Default offering is configured
5. Product IDs match exactly: `pack_15`, `pack_50`, `pack_100` (in RevenueCat, App Store Connect, and Google Play Console)

### Purchase Fails

**Check:**
1. Products are approved/active in stores
2. Using correct test accounts (sandbox for iOS, test accounts for Android)
3. App is built as development/production build (not Expo Go)
4. RevenueCat credentials are correct

### Products Show But Purchase Doesn't Complete

**Check:**
1. Backend webhook is configured (if using)
2. Token balance updates correctly
3. Check RevenueCat dashboard → Events for purchase logs
4. Check app console logs for errors

---

## Next Steps

After configuration is complete:

1. ✅ Test all three products on both platforms
2. ✅ Verify tokens are added correctly
3. ✅ Test restore purchases functionality
4. ✅ Monitor RevenueCat dashboard for purchase events
5. ✅ Set up webhooks (if using backend integration)
6. ✅ Prepare for production release

---

## Quick Reference

**Product Identifiers:**
- `pack_15` - 15 scans pack
- `pack_50` - 50 scans pack
- `pack_100` - 100 scans pack

**Important**: These identifiers must match exactly in:
- RevenueCat (Product Identifier)
- App Store Connect (Product ID)
- Google Play Console (Product ID)

**Entitlement:**
- `Catfish Pro` (or your preferred name)

**Configuration File:**
- `catfish/config/apiConfig.js` - Update `REVENUECAT_API_KEY`

**Key Files:**
- iOS: In-App Purchase Key (.p8 file) + Key ID + Issuer ID
- Android: Service Account JSON file

---

**You're all set!** Follow these steps in order, and your RevenueCat integration with scan packs will be complete.
