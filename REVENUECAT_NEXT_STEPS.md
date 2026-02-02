# RevenueCat Configuration - Next Steps

Since you've already:
- ✅ Added products and offerings in RevenueCat
- ✅ Added one product in App Store Connect

Here are the **next steps** to complete your RevenueCat configuration:

> **⚠️ Important**: If you don't see "App Store Connect" options in RevenueCat, you need to **connect your App Store Connect account first** (Step 1). This is a prerequisite before you can link products.

> **📱 For Android Setup**: See the complete step-by-step guide: [`REVENUECAT_ANDROID_SETUP.md`](./REVENUECAT_ANDROID_SETUP.md)

---

## Step 1: Connect App Store Connect to RevenueCat (REQUIRED FIRST)

**Important**: You must connect your App Store Connect account to RevenueCat before you can link products. This is why you don't see "App Store Connect" options yet.

### ✅ Sandbox Testing: What You Need

**For sandbox testing, you can proceed with:**
- ✅ **In-App Purchase Key (.p8 file)** - **REQUIRED**
- ✅ **Key ID** - **REQUIRED** (must match the .p8 file)
- ✅ **Issuer ID** - **REQUIRED** (your Apple account identifier)
- ❌ **Shared Secret** - **OPTIONAL** (can skip for sandbox, add later for production)

**⚠️ Important: All three are required together:**
1. **.p8 file** - The private key file (downloaded from App Store Connect)
2. **Key ID** - The identifier for that specific .p8 key (shown when you generate it)
3. **Issuer ID** - Your Apple account issuer identifier (shown in Users and Access → Keys)

**These three must match** - RevenueCat validates all three together. If any are missing or incorrect, the connection will fail.

**Additional requirement:**
4. **Bundle ID** - Must match your app's bundle ID exactly

You can add the Shared Secret later when you're ready for production or need full server-side validation.

### 👤 App Manager Role - Quick Guide

**If you have App Manager role (not Admin):**

**What you need to do:**
1. ✅ Check if In-App Purchase Key already exists (you can view it but not download)
2. ❌ Ask Admin/Account Holder to generate In-App Purchase Key for you
3. ✅ Generate App Store Connect API Key (you CAN do this)
4. ✅ Create products in App Store Connect (you CAN do this)
5. ✅ Configure everything in RevenueCat once you have the key

**Quick action items:**
- [ ] Check **Users and Access** → **Integrations** → **In-App Purchase** for existing keys
- [ ] Check **Users and Access** → **Keys** tab (if available) for App Store Connect API option
- [ ] Contact Admin/Account Holder to generate In-App Purchase Key if none exists
- [ ] Proceed with RevenueCat setup once you have the In-App Purchase Key

**Note**: If you don't see "App Store Connect API" option, it's okay - the In-App Purchase Key is the main requirement. The API key is optional.

### Part A: Generate Credentials in App Store Connect

1. **Get In-App Purchase Key (.p8 file)**

   **If you have Admin or Account Holder role:**
   - Go to App Store Connect → **Users and Access** → **Integrations** tab
   - In the **left sidebar**, scroll down to find **"Keys"** section
   - Click on **"In-App Purchase"** (should be under "Keys")
   - Click **"Generate In-App Purchase Key"** or **"+"** button
   - Download the `.p8` file (you can only download it once - save it securely!)
   - Note the **Key ID** and **Issuer ID** (shown on the same page)

   **If you have App Manager role (your situation):**
   - ⚠️ **You cannot generate new keys** - App Manager role doesn't have this permission
   - **Check if key already exists:**
     - Go to **Users and Access** → **Integrations** → **In-App Purchase**
     - Look for any **Active Keys** in the list
     - If a key exists, you can see the **Key ID** and **Issuer ID**
     - But you **cannot download the .p8 file** (only the generator can download it once)
   - **Ask Admin/Account Holder to:**
     - Generate a new In-App Purchase Key
     - Download the `.p8` file (can only download once!)
     - **Share ALL THREE with you securely:**
       1. The `.p8` file
       2. **Key ID** (shown when generating the key)
       3. **Issuer ID** (shown at top of Active Keys section)
     - Or use an existing key if one is already available
     - **⚠️ Important**: You need all three pieces - .p8 file, Key ID, and Issuer ID

2. **Get Shared Secret (Optional for Sandbox Testing)**
   - ⚠️ **For Sandbox Testing**: You can proceed **without** the shared secret initially
   - The **In-App Purchase Key (.p8 file)** is the main requirement for connecting to RevenueCat
   - Shared Secret is mainly needed for:
     - Production purchases (server-side validation)
     - Legacy StoreKit 1 implementations
     - Full webhook/receipt validation
   
   - **If you want to add it now** (recommended for production):
     - **Option A - Primary Shared Secret**:
       - Go to: **Users and Access** → **Integrations** → **Shared Secret**
       - Click **"Generate Primary Shared Secret"** if not already generated
       - Copy the secret (save it securely)
     - **Option B - App-Specific Shared Secret** (recommended):
       - Go to App Store Connect → **Your App** → **App Information** → **App-Specific Shared Secret**
       - Click **"Generate"** if you don't have one
       - Copy the shared secret
   - **Note**: You can add the shared secret later in RevenueCat if you skip it now

3. **Optional: Generate App Store Connect API Key** (May require Admin/Account Holder)
   - ⚠️ **Note**: This option may not be visible to App Manager role
   - **Try these locations:**
     - **Option A**: Go to **Users and Access** → **Keys** tab (not Integrations tab) → **App Store Connect API**
     - **Option B**: Go to **Users and Access** → **Integrations** → Look for **"App Store Connect API"** or **"Team Keys"**
     - **Option C**: The option might only be visible to Admin/Account Holder
   - **If you can see it:**
     - Click **"Generate API Key"** or **"+"** button
     - Select **"App Manager"** or **"Admin"** access level
     - Download the `.p8` file (you can only download it once!)
     - Note the **Key ID** and **Issuer ID**
   - **If you cannot see it:**
     - This option may require Admin/Account Holder to generate it first
     - Ask your Admin/Account Holder to generate it for you
     - Or skip this - it's optional and the In-App Purchase Key is the main requirement

### Part B: Configure App in RevenueCat

1. **Navigate to Apps & Providers**
   - Go to RevenueCat Dashboard → **Apps & Providers** (or **Project Settings** → **Apps**)
   - Find your iOS app (or create one if you haven't)

2. **Add App Store Connect Credentials**
   - Click on your iOS app
   - Look for **"App Store Connect"** or **"Apple"** section
   - **Upload the In-App Purchase Key (.p8 file)** - Required
   - **Enter the Key ID** - Required (must match the .p8 file)
   - **Enter the Issuer ID** - Required (your Apple account identifier)
   - **Shared Secret** (optional for sandbox testing):
     - You can leave this blank for now if testing in sandbox
     - Add it later when moving to production
     - Or add it now if you generated it
   - Enter your **Bundle ID** (must match App Store Connect exactly)
   - Enter your **App Name**
   
   **⚠️ Important**: You must provide all three:
   - ✅ .p8 file (upload)
   - ✅ Key ID (text field)
   - ✅ Issuer ID (text field)
   
   RevenueCat validates all three together. Missing any one will cause the connection to fail.

3. **Optional: Add App Store Connect API Key** (for automatic product import)
   
   **Location in RevenueCat Dashboard:**
   - In the same app settings page where you added the In-App Purchase Key
   - Look for a separate section or tab called **"App Store Connect API"** or **"API Key"**
   - It may be:
     - A separate tab next to the "App Store Connect" section
     - A separate section below the In-App Purchase Key fields
     - Or under **"Service Credentials"** or **"Additional Credentials"**
   
   **What to upload:**
   - **App Store Connect API Key (.p8 file)** - The .p8 file you downloaded from App Store Connect
   - **Issuer ID** - Same Issuer ID as your In-App Purchase Key (or the one shown when you generated the API key)
   - **Vendor Number** (optional, but recommended) - Found in App Store Connect under **Payments and Financial Reports** (top left corner)
   
   **Steps:**
   1. Find the **"App Store Connect API"** section in your iOS app settings
   2. Upload the **.p8 file** (the App Store Connect API key file, not the In-App Purchase key)
   3. Enter the **Issuer ID**
   4. Enter the **Vendor Number** (if available)
   5. Click **"Save"** or **"Save Changes"**
   
   **Note**: This is optional and mainly used for automatic product import. If you're manually linking products, you can skip this.

4. **Save Configuration**
   - Click **"Save"** or **"Connect"**
   - Wait for RevenueCat to verify the connection (may take a minute)

### Part C: Link Products (After Connection is Established)

Once App Store Connect is connected, you have two options:

**Option 1: Automatic Import (Recommended)**
1. Go to RevenueCat Dashboard → **Product Catalog** → **Products**
2. Click on the **"Apple App Store"** tab
3. Click **"Import from App Store Connect"** or **"Sync Products"**
4. RevenueCat will show your products from App Store Connect
5. Select the products you want to import
6. They will automatically be created in RevenueCat with the correct Product IDs

**Option 2: Manual Linking**
1. Go to RevenueCat Dashboard → **Products**
2. Click on your existing product (or create a new one)
3. Now you should see **"App Store Connect"** section (this appears after connection)
4. Enter the **Product ID** exactly as it appears in App Store Connect
5. Select your **App** from the dropdown
6. Click **"Save"**

### Verify Connection
- After connecting, wait a few minutes for RevenueCat to sync
- You should see product details (price, description) populate automatically
- Check that the product status shows as "Active" or "Ready to Submit"

### ⚠️ App Manager Role: What You Can and Cannot Do

If you have **App Manager** role (not Admin or Account Holder):

**✅ What App Manager CAN do:**
- Create and manage in-app purchase products
- View existing In-App Purchase Keys (if already generated)
- Generate App Store Connect API Key (if enabled)
- Manage app information, pricing, and releases
- Configure products in RevenueCat (after connection is set up)

**❌ What App Manager CANNOT do:**
- Generate new In-App Purchase Key (.p8 file) - requires Admin or Account Holder
- Generate Primary Shared Secret - requires Admin or Account Holder
- Manage users and access

### Options for App Manager Role:

**Option 1: Check if Key Already Exists** (Try this first!)
1. Go to App Store Connect → **Users and Access** → **Integrations** → **In-App Purchase**
2. Check if there's already an **Active Key** listed
3. If yes, you can:
   - View the Key ID and Issuer ID
   - **But you cannot download the .p8 file** (only the person who generated it can download it once)
   - Ask the Admin/Account Holder who generated it to share the .p8 file securely

**Option 2: Ask Admin/Account Holder to Generate Key**
1. Contact your team's **Admin** or **Account Holder**
2. Ask them to:
   - Go to **Users and Access** → **Integrations** → **In-App Purchase**
   - Generate a new In-App Purchase Key
   - Download the `.p8` file
   - Share the `.p8` file, **Key ID**, and **Issuer ID** with you securely
   - ⚠️ **Important**: The .p8 file can only be downloaded once, so they must save it securely

**Option 3: Use App Store Connect API Key Instead** (May not be available)
- ⚠️ **Note**: This option may not be visible to App Manager role
- **Try different locations:**
  - **Users and Access** → **Keys** tab (not Integrations) → **App Store Connect API**
  - **Users and Access** → **Integrations** → **Team Keys** or **App Store Connect API**
- **If visible:**
  - App Manager CAN generate App Store Connect API Key
  - Create a new key with App Manager access level
  - This can work as an alternative for some RevenueCat features
- **If not visible:**
  - This option may require Admin/Account Holder to generate it first
  - Ask Admin/Account Holder to generate it for you
  - Or focus on getting the In-App Purchase Key (which is the main requirement)

**Option 4: Request Role Upgrade** (Long-term solution)
- Ask your Account Holder to upgrade your role to **Admin**
- This will give you full access to generate keys

### ⚠️ Troubleshooting: Can't Find In-App Purchase Key

If you don't see "In-App Purchase" in the left sidebar:

1. **Check Account Permissions**
   - **App Manager** role cannot generate In-App Purchase Keys
   - You need **Admin** or **Account Holder** role to generate new keys
   - Contact your account admin or Account Holder

2. **For Sandbox Testing: You Can Skip Shared Secret**
   - ✅ **Yes, you can proceed with sandbox testing without the shared secret**
   - The **In-App Purchase Key (.p8 file)** is the main requirement
   - Shared Secret is optional for sandbox testing
   - You can add it later when moving to production
   - RevenueCat will work for sandbox purchases with just the In-App Purchase Key
   
3. **Alternative: Start with In-App Purchase Key Only**
   - Go to RevenueCat → Apps & Providers → Your App
   - Upload the In-App Purchase Key (.p8 file)
   - Enter Key ID and Issuer ID
   - Leave Shared Secret blank (for now)
   - This is sufficient for sandbox testing

3. **Check Different Locations**
   - Try: **Users and Access** → **Keys** (different tab)
   - Or: **Users and Access** → **Integrations** → scroll down in left sidebar
   - The interface may vary by account type

4. **Contact Apple Support**
   - If you have Admin access but still don't see it, contact Apple Developer Support

---

## Step 2: Configure Entitlements

### In RevenueCat Dashboard:

1. **Create Entitlement (if not already created)**
   - Navigate to **Entitlements** → **Add Entitlement**
   - **Identifier**: `Catfish Pro` (must match exactly - case sensitive)
   - **Display Name**: Catfish Pro (or any friendly name)
   - Click **Save**

2. **Attach Products to Entitlement**
   - Click on the **Catfish Pro** entitlement
   - Under **Products**, click **"Attach Product"**
   - Select all your products (basic, premium_monthly, lifetime, etc.)
   - This ensures all products grant the same entitlement

---

## Step 3: Configure Offerings

### In RevenueCat Dashboard:

1. **Verify Default Offering**
   - Navigate to **Offerings**
   - Check that you have a **default offering** (or create one named `default`)
   - The default offering is what the app will fetch automatically

2. **Add Products to Offering**
   - Click on your offering
   - Under **Packages**, add all your products
   - You can organize them into packages (e.g., "Basic Package", "Premium Package", "Lifetime Package")
   - Or just add products directly

3. **Set as Default**
   - Make sure your offering is marked as **"Default Offering"**
   - This is usually done when creating the offering, or in the offering settings

---

## Step 4: Get and Configure API Keys

### In RevenueCat Dashboard:

1. **Get API Keys**
   - Navigate to **Project Settings** → **API Keys**
   - You'll see different keys for different platforms:
     - **iOS Public Key** (starts with `appl_`)
     - **Android Public Key** (starts with `goog_`)
     - **Test Key** (starts with `test_`) - for testing only

2. **Update Your App Configuration**
   - Open `catfish/config/apiConfig.js`
   - Update the `REVENUECAT_API_KEY` object:

```javascript
const REVENUECAT_API_KEY = {
  ios: 'appl_YOUR_IOS_KEY_HERE', // Replace with your iOS public key
  android: 'goog_YOUR_ANDROID_KEY_HERE', // Replace with your Android public key
};
```

   - **For Testing**: You can use the test key for both platforms temporarily:
```javascript
const REVENUECAT_API_KEY = {
  ios: 'test_YOUR_TEST_KEY_HERE',
  android: 'test_YOUR_TEST_KEY_HERE',
};
```

---

## Step 5: Verify Product IDs Match

### Critical: Product IDs must match exactly!

1. **Check App Store Connect Product ID**
   - Go to App Store Connect → Your App → Features → In-App Purchases
   - Note the exact **Product ID** (e.g., `premium_monthly`)

2. **Check RevenueCat Product Identifier**
   - In RevenueCat Dashboard → Products
   - Verify the product identifier matches exactly
   - The identifier should be the same as your App Store Connect Product ID

3. **Check Your Code**
   - In `catfish/services/revenueCatService.js`, the code looks for:
     - `basic`
     - `premium_monthly`
     - `lifetime`
   - Make sure your App Store Connect products use these exact IDs

---

## Step 6: Add Remaining Products to App Store Connect (if needed)

If you only added one product, you may need to add the others:

### For iOS (App Store Connect):

1. **Create Additional Products**
   - Go to App Store Connect → Your App → Features → In-App Purchases
   - Click **"+"** to create new products
   - Create products with IDs:
     - `basic` - Non-consumable, $4.99
     - `premium_monthly` - Auto-renewable subscription, $9.99/month
     - `lifetime` - Non-consumable, $24.99

2. **Link Each Product in RevenueCat**
   - Repeat Step 1 for each product
   - Link each App Store Connect product to its RevenueCat counterpart

### For Android (Google Play Console):

1. **Create Products**
   - Go to Google Play Console → Your App → Monetization → Products
   - Create products with the same IDs:
     - `basic` - One-time product
     - `premium_monthly` - Subscription
     - `lifetime` - One-time product

2. **Link in RevenueCat**
   - In RevenueCat Dashboard → Products
   - For each product, add the Google Play product ID

---

## Step 7: Configure Webhook (Optional - for Backend Integration)

If you want server-side validation:

1. **Get Your Webhook URL**
   - Deploy your backend (if not already deployed)
   - Get the webhook endpoint URL (e.g., `https://your-api.execute-api.us-east-1.amazonaws.com/prod/webhook`)

2. **Configure in RevenueCat**
   - Go to RevenueCat Dashboard → Project Settings → Webhooks
   - Click **"Add Webhook"**
   - Enter your webhook URL
   - Select events to listen to (at minimum: `INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`)

3. **Get Secret Key**
   - In RevenueCat Dashboard → Project Settings → API Keys
   - Copy the **Secret API Key** (starts with `sk_`)
   - Add it to your backend environment variables:
     ```bash
     REVENUECAT_SECRET_KEY=sk_your_secret_key_here
     ```

---

## Step 8: Test the Integration

### Testing Checklist:

1. **Build Your App**
   - Create a development build (not Expo Go)
   - RevenueCat SDK only works in development/production builds

2. **Test Product Fetching**
   - Open your app
   - Navigate to the paywall/purchase screen
   - Check console logs for RevenueCat initialization
   - Verify products are loading correctly

3. **Test Purchase Flow**
   - Try to purchase a product (use sandbox/test account)
   - Verify purchase completes
   - Check that entitlement is granted
   - Verify subscription status updates

4. **Test Restore Purchases**
   - Test the "Restore Purchases" functionality
   - Verify previous purchases are restored

---

## Step 9: Common Issues and Solutions

### Issue: Products not showing up
**Solution:**
- Verify API keys are correct
- Check that offerings are configured and set as default
- Ensure product IDs match exactly between App Store Connect and RevenueCat
- Wait a few minutes for sync (can take up to 15 minutes)

### Issue: "RevenueCat is not configured" error
**Solution:**
- Check that API keys are set in `apiConfig.js` (not null)
- Verify you're running a development build (not Expo Go)
- Check console logs for initialization errors

### Issue: Products show but purchase fails
**Solution:**
- Verify App Store Connect products are in "Ready to Submit" or "Approved" status
- Check that you're using a sandbox/test account
- Ensure the product is linked correctly in RevenueCat

### Issue: Entitlement not granted after purchase
**Solution:**
- Verify entitlement identifier matches exactly: `Catfish Pro`
- Check that products are attached to the entitlement in RevenueCat
- Verify offering includes the products

---

## Step 10: Production Checklist

Before going to production:

- [ ] All products created in App Store Connect and Google Play Console
- [ ] All products linked in RevenueCat
- [ ] Entitlement created and products attached
- [ ] Default offering configured with all products
- [ ] Production API keys configured (not test keys)
- [ ] Webhook configured (if using backend)
- [ ] Tested purchase flow with sandbox accounts
- [ ] Tested restore purchases
- [ ] Verified entitlement grants correctly
- [ ] Tested on both iOS and Android

---

## Quick Reference

### Product Identifiers Expected by Code:
- `basic` - Basic one-time purchase
- `premium_monthly` - Monthly subscription
- `lifetime` - Lifetime purchase

### Entitlement Identifier:
- `Catfish Pro` (case sensitive)

### Configuration File:
- `catfish/config/apiConfig.js` - Update `REVENUECAT_API_KEY`

### Service File:
- `catfish/services/revenueCatService.js` - Main RevenueCat integration

---

## Need Help?

- RevenueCat Documentation: https://docs.revenuecat.com/
- RevenueCat Support: support@revenuecat.com
- Check RevenueCat Dashboard → Events for purchase logs
- Enable debug logging in development (already configured in code)

---

**Next Action**: Start with Step 1 - Link your App Store Connect product to RevenueCat, then proceed through each step in order.
