# Sharing Your Mobile App with Clients

This guide explains how to create shareable links for your clients to test your mobile application.

## Quick Start - Method 1: Expo Go (Fastest for Testing)

This is the quickest way to share your app for testing. Clients need to install the Expo Go app on their phones.

### Steps:

1. **Start the development server with tunnel mode:**
   ```bash
   cd catfish
   npm run share
   ```
   
   Or manually:
   ```bash
   npx expo start --tunnel
   ```

2. **Share the QR code or link:**
   - A QR code will appear in your terminal
   - You can also get a shareable link like: `exp://exp.host/@your-username/catfish`
   - Send the QR code or link to your clients

3. **Client Instructions:**
   - Install **Expo Go** from App Store (iOS) or Google Play (Android)
   - Scan the QR code or open the link
   - The app will load in Expo Go

**Note:** Expo Go has limitations - some native modules may not work. For full functionality, use Method 2.

---

## Method 2: EAS Build (Recommended for Production Testing)

This creates standalone builds that can be installed directly on devices without Expo Go.

### Prerequisites:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure your project:**
   ```bash
   eas build:configure
   ```
   
   This will create/update `eas.json` and add a project ID to `app.json`.

### Building for Testing:

#### For iOS (TestFlight or Direct Install):

```bash
# Build for iOS
npm run build:preview:ios

# Or manually:
eas build --profile preview --platform ios
```

After the build completes:
- You'll get a link to download the `.ipa` file
- For TestFlight: Run `eas submit --platform ios` (requires App Store Connect setup)
- For direct install: Share the download link (clients need to trust your developer certificate)

#### For Android (APK - Direct Install):

```bash
# Build for Android
npm run build:preview:android

# Or manually:
eas build --profile preview --platform android
```

After the build completes:
- You'll get a direct download link for the `.apk` file
- Share this link with clients
- Clients can download and install directly (may need to enable "Install from unknown sources")

#### Build for Both Platforms:

```bash
npm run build:preview:all
```

### Sharing the Build:

1. After the build completes, EAS will provide:
   - A download link (for Android APK)
   - A TestFlight link (for iOS, if configured)
   - A QR code for easy access

2. Share the link/QR code with your clients

3. **For iOS:** Clients may need to:
   - Install via TestFlight (if using TestFlight)
   - Or trust your developer certificate (Settings > General > VPN & Device Management)

4. **For Android:** Clients can:
   - Download the APK directly
   - Install it on their device

---

## Method 3: Web Build (Accessible via Browser)

Create a web version that clients can access via any browser URL.

### Steps:

1. **Build the web version:**
   ```bash
   npm run build:web
   ```

2. **Deploy to hosting:**
   - The build output will be in `web-build/` directory
   - Deploy to services like:
     - **Vercel:** `npx vercel --prod`
     - **Netlify:** `npx netlify deploy --prod --dir=web-build`
     - **GitHub Pages:** Follow GitHub Pages deployment guide
     - **AWS S3 + CloudFront:** Upload to S3 and configure CloudFront

3. **Share the URL:**
   - Once deployed, share the public URL with clients
   - Example: `https://your-app.vercel.app`

**Note:** Some native features (like camera) may have limited functionality in web builds.

---

## Method 4: Development Build (Advanced)

For testing with full native functionality but still in development mode.

### Steps:

1. **Build a development client:**
   ```bash
   eas build --profile development --platform ios
   # or
   eas build --profile development --platform android
   ```

2. **Install on device:**
   - Download and install the development build
   - Start your dev server: `npx expo start --dev-client`
   - The app will connect to your development server

---

## Comparison of Methods

| Method | Speed | Native Features | Ease of Use | Best For |
|--------|-------|----------------|-------------|----------|
| Expo Go | ⚡⚡⚡ Fastest | ⚠️ Limited | ✅ Very Easy | Quick demos, early testing |
| EAS Build Preview | ⚡⚡ Medium | ✅ Full | ✅ Easy | Client testing, beta testing |
| Web Build | ⚡⚡ Medium | ⚠️ Limited | ✅ Easy | Web access, demos |
| Development Build | ⚡ Slow | ✅ Full | ⚠️ Complex | Advanced development |

---

## Troubleshooting

### Expo Go Issues:
- **"Unable to resolve module"**: Make sure all dependencies are installed (`npm install`)
- **"Network request failed"**: Check that your dev server is running and accessible

### EAS Build Issues:
- **"Project not found"**: Run `eas build:configure` first
- **"Authentication failed"**: Run `eas login` again
- **iOS build fails**: Make sure you have an Apple Developer account configured

### Web Build Issues:
- **"Module not found"**: Some native modules don't work on web - check compatibility
- **Camera not working**: Web camera requires HTTPS and user permission

---

## Quick Reference Commands

```bash
# Start dev server with shareable link
npm run share

# Build preview for iOS
npm run build:preview:ios

# Build preview for Android
npm run build:preview:android

# Build preview for both
npm run build:preview:all

# Build web version
npm run build:web

# Check build status
eas build:list

# View build details
eas build:view [BUILD_ID]
```

---

## Next Steps

1. **For quick testing:** Use Method 1 (Expo Go)
2. **For client demos:** Use Method 2 (EAS Build Preview)
3. **For production:** Use Method 2 with production profile and submit to app stores

For more information, visit:
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Sharing Guide](https://docs.expo.dev/workflow/sharing/)
