# RevenueCat "Offerings Empty" Error - Troubleshooting Guide

## Main Error

```
[RevenueCat] 🍎‼️ Error fetching offerings - None of the products registered in the RevenueCat dashboard could be fetched from App Store Connect
```

This means RevenueCat can't find your products in App Store Connect.

---

## Root Causes & Solutions

### Issue 1: Products Don't Exist in App Store Connect

**Check:**
1. Go to App Store Connect → Your App → **Features** → **In-App Purchases**
2. Verify products `pack_15`, `pack_50`, `pack_100` are created
3. Check their status - must be **"Ready to Submit"** or **"Approved"**

**Solution:**
- Create the products in App Store Connect if they don't exist
- Make sure Product IDs match exactly: `pack_15`, `pack_50`, `pack_100`

---

### Issue 2: Products Not Linked in RevenueCat

**Check:**
1. Go to RevenueCat Dashboard → **Offerings** → Edit your offering
2. Verify products are added to the offering
3. Check that iOS app icons show Product IDs linked:
   - Click iOS icon next to each product
   - Verify Product ID matches App Store Connect (e.g., `pack_15`)

**Solution:**
- Link products in the offering (as you did)
- Make sure Product IDs match exactly between RevenueCat and App Store Connect

---

### Issue 3: Running in iOS Simulator

**The Error:**
```
Error Domain=ASDErrorDomain Code=509 "No active account"
Error Domain=StoreKit_Shared.StoreKitInternalError Code=7
```

**Problem:**
- iOS Simulator has limited StoreKit functionality
- Sandbox purchases don't work well in simulator
- StoreKit errors are common in simulator

**Solution:**
- ✅ **Test on a real iOS device** (recommended)
- Or use StoreKit Configuration file for simulator testing
- Simulator is mainly for UI testing, not IAP testing

---

### Issue 4: No Sandbox Account Signed In

**The Error:**
```
Error Domain=ASDErrorDomain Code=509 "No active account"
```

**Problem:**
- No sandbox test account is signed in on the device
- StoreKit needs an account to fetch products

**Solution:**
1. Sign in with sandbox account on your device:
   - Settings → iTunes & App Store → Sandbox Account
   - Sign in with your sandbox tester credentials
2. Restart the app after signing in

---

### Issue 5: Products Not Approved/Active

**Check:**
1. App Store Connect → Your App → Features → In-App Purchases
2. Product status must be:
   - ✅ **"Ready to Submit"** (minimum)
   - ✅ **"Approved"** (best)
   - ❌ **"Missing Metadata"** (won't work)
   - ❌ **"Waiting for Review"** (may not work)

**Solution:**
- Complete all required metadata for products
- Submit products for review (even if app isn't submitted)
- Products can be approved independently of the app

---

### Issue 6: Bundle ID Mismatch

**Check:**
1. RevenueCat Dashboard → Apps & Providers → Your iOS App
2. Verify Bundle ID matches your app exactly
3. Check `app.json` → `ios.bundleIdentifier`
4. Must match exactly (case-sensitive)

**Solution:**
- Update Bundle ID in RevenueCat to match your app
- Or update your app's Bundle ID to match RevenueCat

---

### Issue 7: App Store Connect Connection Issues

**Check:**
1. RevenueCat Dashboard → Apps & Providers → Your iOS App
2. Check "App Store Connect" section status
3. Look for:
   - ✅ "Connected" (good)
   - ⚠️ "Credentials need attention" (needs fixing)
   - ❌ Error messages

**Solution:**
- Verify In-App Purchase Key (.p8 file) is uploaded
- Verify Key ID and Issuer ID are correct
- Click refresh/validate button
- Check for pending legal agreements in App Store Connect

---

### Issue 8: Products Created But Not Synced

**Problem:**
- Products exist in App Store Connect
- Products exist in RevenueCat
- But they're not syncing

**Solution:**
1. Wait 5-10 minutes for sync (can take time)
2. In RevenueCat, try:
   - Go to Product Catalog → Products → Apple App Store tab
   - Click "Import from App Store Connect" or "Sync Products"
3. Verify products are linked in the offering

---

## Quick Checklist

Go through this checklist:

- [ ] Products created in App Store Connect: `pack_15`, `pack_50`, `pack_100`
- [ ] Products status: "Ready to Submit" or "Approved"
- [ ] Products created in RevenueCat: `pack_15`, `pack_50`, `pack_100`
- [ ] Products linked in RevenueCat offering with correct Product IDs
- [ ] Bundle ID matches exactly between app and RevenueCat
- [ ] App Store Connect connected in RevenueCat (shows "Connected")
- [ ] In-App Purchase Key uploaded correctly
- [ ] Testing on **real device** (not simulator)
- [ ] Sandbox account signed in on device
- [ ] Waited 5-10 minutes after linking products

---

## Testing on Real Device (Recommended)

**Why:**
- iOS Simulator has limited StoreKit support
- Sandbox purchases work better on real devices
- StoreKit errors are common in simulator

**Steps:**
1. Build for device (not simulator)
2. Install on real iOS device
3. Sign in with sandbox account:
   - Settings → iTunes & App Store → Sandbox Account
4. Test purchases on device

---

## StoreKit Configuration File (Alternative for Simulator)

If you must test in simulator, you can use a StoreKit Configuration file:

1. **Create `.storekit` file in Xcode**
2. **Add your products** with IDs: `pack_15`, `pack_50`, `pack_100`
3. **Use in Xcode**: Product → Scheme → Edit Scheme → Run → Options → StoreKit Configuration

This allows testing in simulator without App Store Connect products.

---

## Other Errors in Your Logs

### 1. StoreKit Errors (Normal in Simulator)
```
Error Domain=StoreKit_Shared.StoreKitInternalError Code=7
Error Domain=ASDErrorDomain Code=509 "No active account"
```
- **These are normal in simulator**
- Will work on real device with sandbox account

### 2. Facebook SDK Warning
```
FBSDKLog: Starting with v13 of the SDK, a client token must be embedded
```
- **Not critical** - just a warning
- Can be fixed by adding FacebookClientToken to Info.plist (optional)

### 3. PostHog Error
```
'Error initializing PostHog:', [TypeError: undefined is not a function]
```
- **Not critical** - PostHog not initialized
- App will continue without PostHog analytics

### 4. UIBackgroundModes Warnings
```
You've implemented ... but you still need to add "fetch" to UIBackgroundModes
```
- **Not critical** - just warnings
- Can be fixed by adding to Info.plist (optional)

---

## Most Likely Solution

Based on your errors, the most likely issues are:

1. **Running in Simulator** - Test on a real device
2. **No Sandbox Account** - Sign in with sandbox account on device
3. **Products Not Created/Linked** - Verify products exist and are linked correctly

**Try this first:**
1. Build for a real iOS device (not simulator)
2. Sign in with sandbox account on the device
3. Test again

---

## Need More Help?

- RevenueCat Error Reference: https://rev.cat/why-are-offerings-empty
- RevenueCat Support: support@revenuecat.com
- Check RevenueCat Dashboard → Events for detailed logs

---

**Priority Fix**: Test on a real device with a sandbox account signed in. The simulator errors are expected and won't prevent testing on a real device.
