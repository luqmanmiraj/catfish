# Remote Simulator Guide

This guide explains how to set up and use remote simulators to test your mobile app, allowing clients to access and interact with your app through a web browser or shared simulator.

## Method 1: Web Simulator (Easiest - Browser-Based)

Run your app in a web browser that simulates a mobile device. This is the fastest way to share your app remotely.

### Quick Start:

```bash
cd catfish
npm run simulator:web
```

Or manually:
```bash
npx expo start --web
```

### Access Remotely:

1. **Local Network Access:**
   - The app will start on `http://localhost:8081` (or similar)
   - Find your local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
   - Share: `http://YOUR_IP:8081`
   - Clients on the same network can access it

2. **Tunnel Mode (Access from Anywhere):**
   ```bash
   npx expo start --web --tunnel
   ```
   - This creates a public URL that anyone can access
   - Share the generated URL with clients
   - Works from anywhere in the world

3. **Deploy to Web Hosting:**
   ```bash
   npm run build:web
   ```
   - Builds static files in `web-build/` directory
   - Deploy to Vercel, Netlify, or any static hosting
   - Share the public URL

### Features:
- ✅ Works in any browser
- ✅ No installation needed
- ✅ Accessible from anywhere (with tunnel)
- ⚠️ Some native features may be limited (camera, etc.)

---

## Method 2: iOS Simulator Build (EAS Build)

Create an iOS simulator build that can be shared and run on any Mac with Xcode.

### Prerequisites:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login and Configure:**
   ```bash
   eas login
   eas build:configure
   ```

### Build for iOS Simulator:

```bash
npm run build:simulator:ios
```

Or manually:
```bash
eas build --profile simulator --platform ios
```

### After Build Completes:

1. **Download the build:**
   - EAS will provide a download link for a `.tar.gz` file
   - Download and extract it

2. **Install on Simulator:**
   ```bash
   # Extract the downloaded file
   tar -xzf your-build.tar.gz
   
   # Install on simulator (replace with your simulator ID)
   xcrun simctl install booted path/to/your.app
   ```

3. **Share the Simulator:**
   - Use screen sharing (Zoom, TeamViewer, etc.)
   - Or use VNC to allow remote access
   - Or record a video demo

### Remote Access Options:

#### Option A: Screen Sharing
- Use Zoom, Google Meet, or similar
- Share your Mac screen
- Client can see and you can control

#### Option B: VNC (Virtual Network Computing)
```bash
# Enable Screen Sharing on Mac
# System Preferences > Sharing > Screen Sharing

# Or use command line:
sudo /System/Library/CoreServices/RemoteManagement/ARDAgent.app/Contents/Resources/kickstart \
  -activate -configure -access -on \
  -users YOUR_USERNAME -privs -all -restart -agent -menu
```

Then clients can connect using VNC viewer with your IP address.

#### Option C: Cloud Simulator Services
- **Appetize.io** - Upload your simulator build, get a shareable link
- **BrowserStack** - Cloud-based device testing
- **Sauce Labs** - Automated testing platform

---

## Method 3: Android Emulator (Local)

Run Android emulator locally and share access.

### Setup:

1. **Install Android Studio** (if not already installed)

2. **Create an AVD (Android Virtual Device):**
   - Open Android Studio
   - Tools > Device Manager
   - Create Virtual Device
   - Choose a device and system image

3. **Start Emulator:**
   ```bash
   # List available emulators
   emulator -list-avds
   
   # Start specific emulator
   emulator -avd YOUR_AVD_NAME
   ```

4. **Start Expo:**
   ```bash
   npm run simulator:android
   ```

### Remote Access:

Similar to iOS - use screen sharing or VNC to allow remote access to your emulator.

---

## Method 4: Cloud Simulator Services (Recommended for Client Demos)

Use cloud-based services that provide shareable links to simulators.

### Appetize.io (Best for iOS Simulator Sharing)

1. **Build for iOS Simulator:**
   ```bash
   npm run build:simulator:ios
   ```

2. **Upload to Appetize.io:**
   - Go to [appetize.io](https://appetize.io)
   - Sign up for free account
   - Upload your `.app` file
   - Get a shareable link instantly

3. **Share the Link:**
   - Clients can access the simulator through their browser
   - No installation needed
   - Works on any device

### BrowserStack

1. **Sign up at [browserstack.com](https://www.browserstack.com)**
2. **Upload your app:**
   - Use their App Live feature
   - Upload APK (Android) or IPA (iOS)
   - Get instant access to real devices

3. **Share access:**
   - Generate a shareable link
   - Clients can test on real devices remotely

### AWS Device Farm

1. **Set up AWS Device Farm**
2. **Upload your app build**
3. **Run on real devices**
4. **Share test results and videos**

---

## Method 5: Expo Snack (Online Simulator)

Use Expo's online code editor with built-in simulator.

1. **Go to [snack.expo.dev](https://snack.expo.dev)**
2. **Import your project** (or paste code)
3. **Get shareable link**
4. **Clients can test in browser**

**Note:** Best for quick demos, not full app testing.

---

## Quick Comparison

| Method | Setup Time | Cost | Remote Access | Best For |
|--------|------------|------|---------------|----------|
| Web Simulator | ⚡ Instant | Free | ✅ Yes (tunnel) | Quick demos |
| iOS Simulator Build | ⚡⚡ 5-10 min | Free | ⚠️ Requires Mac/VNC | iOS testing |
| Android Emulator | ⚡⚡ 10-15 min | Free | ⚠️ Requires setup | Android testing |
| Appetize.io | ⚡⚡ 5 min | Free tier available | ✅ Yes | Client demos |
| BrowserStack | ⚡⚡ 5 min | Paid | ✅ Yes | Professional testing |
| Expo Snack | ⚡ Instant | Free | ✅ Yes | Code demos |

---

## Recommended Workflow

### For Quick Client Demos:
```bash
# Option 1: Web simulator with tunnel (fastest)
npx expo start --web --tunnel
# Share the generated URL

# Option 2: Build and upload to Appetize.io
npm run build:simulator:ios
# Upload to appetize.io and share link
```

### For Professional Testing:
1. Build simulator version: `npm run build:simulator:ios`
2. Upload to BrowserStack or Appetize.io
3. Share the testing link with clients
4. Get feedback and analytics

### For Development:
1. Use local simulator: `npm run simulator:ios` or `npm run simulator:android`
2. Share screen via Zoom/Meet for real-time collaboration
3. Use VNC for persistent remote access

---

## Troubleshooting

### Web Simulator Issues:
- **"Module not found"**: Some native modules don't work on web
- **Camera not working**: Web requires HTTPS and user permission
- **Performance issues**: Web may be slower than native

### Simulator Build Issues:
- **"Build failed"**: Check EAS configuration and credentials
- **"Can't install on simulator"**: Make sure Xcode and simulators are installed
- **"App crashes"**: Check simulator logs: `xcrun simctl spawn booted log stream`

### Remote Access Issues:
- **VNC not connecting**: Check firewall settings
- **Screen sharing lag**: Use wired connection or better internet
- **Permission denied**: Check macOS Screen Sharing permissions

---

## Quick Reference Commands

```bash
# Web simulator (local)
npm run simulator:web

# Web simulator (tunnel - accessible from anywhere)
npx expo start --web --tunnel

# iOS simulator (local)
npm run simulator:ios

# Android emulator (local)
npm run simulator:android

# Build iOS simulator version
npm run build:simulator:ios

# Build web version for hosting
npm run build:web
```

---

## Next Steps

1. **For immediate sharing:** Use `npx expo start --web --tunnel`
2. **For iOS simulator sharing:** Build and upload to Appetize.io
3. **For professional demos:** Use BrowserStack or similar service
4. **For development collaboration:** Use screen sharing or VNC

For more information:
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Appetize.io Documentation](https://docs.appetize.io/)
