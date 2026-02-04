# Fix: "Simulator device failed to open" (Error 115)

**Error:** `xcrun simctl openurl ... exited with non-zero code: 115`  
**Meaning:** No app on the simulator is installed to handle the URL `com.anonymous.catfish://...` — the development client app is **not installed** on that simulator.

## Fix

**Install the app on the simulator first**, then open it.

### 1. Boot the simulator (if needed)

- Open **Xcode** → **Window** → **Devices and Simulators** → pick an iPhone simulator and start it,  
  **or**
- Run: `open -a Simulator`

### 2. Build and install the app

From the **catfish** folder:

```bash
npx expo run:ios
```

This builds the native app, installs it on the booted simulator, and launches it. After that, the app is installed and will handle `com.anonymous.catfish://` URLs.

### 3. Use the dev server

- Start the dev server: `npx expo start`
- Press **i** to open on iOS — it should open the **already installed** app on the simulator and connect to the dev server.

If you only run `expo start` and press **i** without ever running `expo run:ios`, the simulator has no app to open → error 115.

## If it still fails

- **Reset the simulator:** Device → Erase All Content and Settings, then run `npx expo run:ios` again.
- **Same Mac, different simulator:** Run `npx expo run:ios` once per simulator type (e.g. iPhone 16 Pro) to install the app on it.
- **Rebuild:** `cd ios && xcodebuild clean` (or clean in Xcode), then `cd .. && npx expo run:ios`.
