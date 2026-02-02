# EAS Build File Formats Explained

## Quick Answer

- **`.ipa` file** = For real iOS devices (what you need for RevenueCat testing)
- **`.tar` / `.tar.gz` file** = For iOS Simulator (limited RevenueCat support)

---

## File Types by Build Profile

### 1. Device Builds (`.ipa` file)

**When you get `.ipa`:**
- Build profile has `"simulator": false` or not set
- Production builds (`distribution: "store"`)
- Device-specific builds

**How to use:**
- Install directly on real iOS device
- Use with Xcode → Devices and Simulators
- Use with Apple Configurator 2

**For RevenueCat:**
- ✅ **Recommended** - Full StoreKit support
- ✅ Sandbox purchases work perfectly

---

### 2. Simulator Builds (`.tar` / `.tar.gz` file)

**When you get `.tar`:**
- Build profile has `"simulator": true`
- Simulator-specific builds

**What's inside:**
- A `.app` bundle (not `.ipa`)
- Extracted, it's a folder with `.app` extension

**How to use:**
1. Extract the `.tar` file:
   ```bash
   # On Mac/Linux
   tar -xzf filename.tar.gz
   
   # Or just double-click the file on Mac
   ```
2. You'll get a `.app` bundle
3. Open Xcode → Window → Devices and Simulators
4. Select a Simulator
5. Drag the `.app` bundle to the Simulator

**For RevenueCat:**
- ⚠️ **Limited support** - StoreKit has issues in simulator
- ❌ Sandbox purchases don't work well
- ✅ Use for UI testing only

---

## Your Current Setup

Looking at your `eas.json`:

```json
"preview": {
  "ios": {
    "simulator": true,  // ← This makes it build for simulator (.tar)
    ...
  }
}
```

**This is why you got a `.tar` file!**

---

## How to Get `.ipa` File Instead

### Option 1: Use Production Profile (Easiest)

```bash
eas build --profile production --platform ios
```

This will create an `.ipa` file for real devices.

### Option 2: Modify Preview Profile

Edit `eas.json`:

```json
"preview": {
  "ios": {
    "simulator": false,  // ← Change to false
    ...
  }
}
```

Then build:
```bash
eas build --profile preview --platform ios
```

### Option 3: Create New Profile for Device Testing

Add to `eas.json`:

```json
"device-preview": {
  "distribution": "internal",
  "ios": {
    "simulator": false,  // ← For real device
    "buildConfiguration": "Release"
  }
}
```

Then build:
```bash
eas build --profile device-preview --platform ios
```

---

## Extracting `.tar` File (If You Already Have It)

**On Mac:**
1. Double-click the `.tar` or `.tar.gz` file
2. It will extract automatically
3. You'll see a `.app` bundle

**On Windows:**
1. Use 7-Zip or WinRAR
2. Right-click → Extract
3. You'll get a `.app` folder (but can't use it on Windows - need Mac)

**On Linux:**
```bash
tar -xzf filename.tar.gz
```

---

## Which Should You Use for RevenueCat?

### ✅ Use `.ipa` (Device Build)

**Why:**
- Full StoreKit support
- Sandbox purchases work
- Real-world testing

**How:**
- Build with `"simulator": false`
- Or use `production` profile
- Install on real device

### ❌ Avoid `.tar` (Simulator Build)

**Why:**
- Limited StoreKit support
- Sandbox purchases don't work
- StoreKit errors are common

**When to use:**
- UI testing only
- Quick visual checks
- Not for IAP testing

---

## Quick Reference

| Build Type | File Format | For | RevenueCat Support |
|------------|-------------|-----|-------------------|
| Device | `.ipa` | Real iOS device | ✅ Full support |
| Simulator | `.tar` / `.tar.gz` | iOS Simulator | ⚠️ Limited support |

---

## Summary

**You got a `.tar` file because your `preview` profile has `"simulator": true`.**

**To get an `.ipa` file for device testing:**
1. Use `production` profile: `eas build --profile production --platform ios`
2. Or change `"simulator": false` in `preview` profile
3. Then build again

**For RevenueCat testing, you need the `.ipa` file on a real device!** 🎯
