# Testing RevenueCat Purchases - TestFlight Not Required

## Quick Answer

**❌ NO, you do NOT need to upload to TestFlight for sandbox testing.**

You can test RevenueCat in-app purchases with a **development build** installed directly on your device.

---

## Two Ways to Test

### Option 1: Development Build (Recommended for Quick Testing) ✅

**What it is:**
- Build your app using EAS Build or Xcode
- Install directly on your device
- No TestFlight needed

**How to do it:**

**Using EAS Build:**

**Important:** Check your `eas.json` - if `"simulator": true` is set, you'll get a `.tar` file (for simulator), not an `.ipa` file (for device).

**For Real Device (Recommended for RevenueCat Testing):**
```bash
# Option 1: Use production profile (builds for device)
eas build --profile production --platform ios

# Option 2: Temporarily modify eas.json to set "simulator": false in preview profile
eas build --profile preview --platform ios
```

**For Simulator (Not Recommended for RevenueCat):**
```bash
# This creates a .tar file (not .ipa)
eas build --profile simulator --platform ios
# Or if preview has "simulator": true
eas build --profile preview --platform ios
```

**Then install:**

**If you got a `.ipa` file (device build):**
1. Download the `.ipa` file from EAS Build
2. Install on device using:
   - **Apple Configurator 2** (Mac)
   - **Xcode** → Window → Devices and Simulators → Select device → Drag `.ipa` to "Installed Apps"
   - Or drag `.ipa` to device in Finder (if device is connected)

**If you got a `.tar` file (simulator build):**
1. Extract the `.tar` file (double-click on Mac, or use `tar -xzf filename.tar.gz`)
2. You'll get a `.app` bundle inside
3. Open Xcode → Window → Devices and Simulators
4. Select a Simulator
5. Drag the `.app` bundle to the Simulator
6. ⚠️ **Note**: RevenueCat testing in simulator is limited - use real device instead

**Using Xcode:**
1. Open your project in Xcode
2. Connect your iOS device
3. Select your device as build target
4. Build and Run (⌘R)

**Advantages:**
- ✅ **Faster** - no App Store Connect upload needed
- ✅ **Sandbox purchases work perfectly**
- ✅ **No TestFlight required**
- ✅ Good for quick testing during development

---

### Option 2: TestFlight Build (Optional)

**What it is:**
- Upload build to App Store Connect
- Install via TestFlight app
- More realistic testing environment

**How to do it:**
```bash
# Build for production/preview
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios
```

**Then:**
1. Go to App Store Connect → TestFlight
2. Add internal testers (yourself)
3. Install TestFlight app on device
4. Install your app from TestFlight

**Advantages:**
- ✅ More realistic testing (closer to production)
- ✅ Easier to distribute to multiple testers
- ✅ Tests the full distribution flow
- ✅ Still uses sandbox for purchases (unless app is in production)

**Disadvantages:**
- ⏱️ Slower (requires upload and processing)
- 📋 Requires App Store Connect setup

---

## Which Should You Use?

### Use Development Build (Option 1) if:
- ✅ You want to test quickly
- ✅ You're testing during development
- ✅ You only need to test on your own device
- ✅ You want to avoid App Store Connect uploads

### Use TestFlight (Option 2) if:
- ✅ You want more realistic testing
- ✅ You need to test with multiple testers
- ✅ You want to test the full distribution flow
- ✅ You're preparing for production release

---

## Important Notes

### Sandbox Testing Works with Both

- ✅ **Development builds** → Sandbox purchases work
- ✅ **TestFlight builds** → Sandbox purchases work
- ✅ **Production builds** → Production purchases (real money)

**Key Point:** Sandbox testing doesn't require TestFlight. You can test sandbox purchases with a development build installed directly on your device.

---

## Prerequisites for Sandbox Testing

Regardless of which build method you use, you need:

1. ✅ **Apple Developer Program** membership
2. ✅ **Paid Applications Agreement** signed in App Store Connect
3. ✅ **Banking and tax info** set up in App Store Connect
4. ✅ **Products created** in App Store Connect (`pack_15`, `pack_50`, `pack_100`)
5. ✅ **Sandbox test account** created and signed in on device
6. ✅ **Bundle ID matches** between app and App Store Connect

---

## Step-by-Step: Testing with Development Build

1. **Build your app:**
   ```bash
   eas build --profile preview --platform ios
   ```

2. **Download the `.ipa` file** from EAS Build dashboard

3. **Install on device:**
   - Connect device to Mac
   - Open Xcode → Window → Devices and Simulators
   - Select your device
   - Drag `.ipa` file to "Installed Apps" section
   - Or use Apple Configurator 2

4. **Sign in with sandbox account:**
   - Settings → iTunes & App Store → Sandbox Account
   - Sign in with your sandbox tester credentials

5. **Test purchases:**
   - Open your app
   - Navigate to paywall
   - Try purchasing products
   - Verify sandbox purchases work

---

## Common Questions

### Q: Do I need TestFlight for sandbox testing?
**A:** No. Development builds work perfectly for sandbox testing.

### Q: Will sandbox purchases work in development builds?
**A:** Yes! Sandbox purchases work in both development builds and TestFlight builds.

### Q: When do I need TestFlight?
**A:** Only if you want to:
- Test with multiple testers
- Test the full distribution flow
- Test closer to production environment

### Q: Can I test production purchases?
**A:** Production purchases only work with:
- Apps downloaded from App Store (production)
- Or TestFlight builds that are in production status

For testing, use sandbox purchases (works with both development and TestFlight builds).

---

## Summary

**For RevenueCat sandbox testing:**
- ✅ **Development build** → Works perfectly, no TestFlight needed
- ✅ **TestFlight build** → Also works, but optional
- ❌ **Expo Go** → Does NOT work (RevenueCat requires native build)

**Recommendation:** Start with a development build for quick testing. Use TestFlight later if you need more realistic testing or multiple testers.

---

**Bottom Line:** You can test RevenueCat purchases right now with a development build - no TestFlight upload required! 🎉
