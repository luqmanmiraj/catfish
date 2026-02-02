# Where to Add App Store Connect API Key in RevenueCat

This guide shows you exactly where to add the App Store Connect API key in the RevenueCat dashboard.

---

## Step-by-Step Instructions

### Step 1: Navigate to Your iOS App

1. **Go to RevenueCat Dashboard**
   - Visit https://app.revenuecat.com
   - Sign in to your account
   - Select your project

2. **Go to Apps & Providers**
   - Click **"Apps & Providers"** in the left sidebar
   - Or go to **Project Settings** → **Apps**

3. **Select Your iOS App**
   - Find your iOS app in the list
   - Click on it to open the app settings

### Step 2: Find the App Store Connect API Section

Once you're in your iOS app settings, look for the **App Store Connect API** section. It may appear in different places:

**Option A: Separate Tab**
- Look for tabs at the top of the app settings page
- You might see tabs like:
  - "App Store Connect" (for In-App Purchase Key)
  - "App Store Connect API" (for API Key)
- Click on the **"App Store Connect API"** tab

**Option B: Separate Section**
- Scroll down on the same page where you added the In-App Purchase Key
- Look for a section titled:
  - **"App Store Connect API"**
  - **"API Key"**
  - **"Additional Credentials"**
  - **"Service Credentials"**

**Option C: In the Same Section**
- Sometimes it's in the same "App Store Connect" section
- Look for fields labeled:
  - "App Store Connect API Key"
  - "API Key (.p8 file)"
  - Separate from the In-App Purchase Key fields

### Step 3: Upload the API Key

Once you find the App Store Connect API section, you'll need to provide:

1. **Upload .p8 File**
   - Click **"Upload"** or **"Choose File"**
   - Select the App Store Connect API Key .p8 file
   - ⚠️ **Important**: This is different from the In-App Purchase Key .p8 file
   - The file should be the one you downloaded from **Users and Access → Keys → App Store Connect API**

2. **Enter Issuer ID**
   - Enter your **Issuer ID**
   - This is the same Issuer ID used for your In-App Purchase Key
   - Or the one shown when you generated the App Store Connect API key
   - Usually displayed at the top of the "Active Keys" section in App Store Connect

3. **Enter Vendor Number** (Optional but Recommended)
   - Find your Vendor Number in App Store Connect:
     - Go to **Payments and Financial Reports**
     - Look in the top left corner
     - It's usually a 6-8 digit number
   - Enter it in the Vendor Number field

4. **Save**
   - Click **"Save"** or **"Save Changes"**
   - RevenueCat will validate the credentials

---

## Visual Guide

```
RevenueCat Dashboard
├── Apps & Providers
    └── Your iOS App
        ├── App Store Connect (In-App Purchase Key section)
        │   ├── Upload In-App Purchase Key .p8 file
        │   ├── Key ID
        │   ├── Issuer ID
        │   └── Shared Secret
        │
        └── App Store Connect API (API Key section) ← YOU ARE HERE
            ├── Upload App Store Connect API Key .p8 file
            ├── Issuer ID
            └── Vendor Number
```

---

## Important Notes

### ⚠️ Two Different Keys

**Don't confuse these two keys:**

1. **In-App Purchase Key** (REQUIRED)
   - Location: **App Store Connect** section
   - Used for: Validating purchases and subscriptions
   - This is the main key you need

2. **App Store Connect API Key** (OPTIONAL)
   - Location: **App Store Connect API** section
   - Used for: Automatic product import
   - This is optional - you can skip it if manually linking products

### When Do You Need the API Key?

**You need the App Store Connect API Key if:**
- ✅ You want RevenueCat to automatically import products from App Store Connect
- ✅ You want to sync product information automatically
- ✅ You're using RevenueCat's automatic product management features

**You can skip it if:**
- ❌ You're manually linking products in RevenueCat
- ❌ You're creating products directly in RevenueCat
- ❌ You don't need automatic product sync

---

## Troubleshooting

### Can't Find the "App Store Connect API" Section?

**Possible reasons:**
1. **Not visible yet** - Make sure you've first added the In-App Purchase Key
2. **Different UI** - RevenueCat's UI may vary - look for "API Key" or "Additional Credentials"
3. **Not needed** - If you're manually linking products, you don't need this section

**What to do:**
- Try scrolling down on the app settings page
- Look for tabs at the top
- Check if there's a "Service Credentials" or "Additional Credentials" section
- If you can't find it, you can proceed without it - it's optional

### Error When Uploading?

**Common issues:**
1. **Wrong .p8 file** - Make sure you're uploading the App Store Connect API Key, not the In-App Purchase Key
2. **Issuer ID mismatch** - Verify the Issuer ID matches the one from App Store Connect
3. **File format** - Ensure the .p8 file wasn't corrupted or modified

---

## Quick Checklist

Before adding the App Store Connect API Key:

- [ ] You have the App Store Connect API Key .p8 file (from Users and Access → Keys → App Store Connect API)
- [ ] You have the Issuer ID (shown in App Store Connect)
- [ ] You have the Vendor Number (optional, from Payments and Financial Reports)
- [ ] You've already added the In-App Purchase Key (recommended first)
- [ ] You understand this is optional (only needed for automatic product import)

---

## Summary

**Location**: RevenueCat Dashboard → Apps & Providers → Your iOS App → **App Store Connect API** section

**What to add**:
1. App Store Connect API Key .p8 file
2. Issuer ID
3. Vendor Number (optional)

**Remember**: This is **optional**. The In-App Purchase Key is the main requirement. You only need the API key if you want automatic product import.

---

Need more help? Check the RevenueCat documentation or contact RevenueCat support.
