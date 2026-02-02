# Sample Images Testing Guide

## Implementation Complete ✓

The sample images feature has been successfully implemented. Here's how to test it:

## What Was Implemented

1. **Service Created**: `services/sampleImagesService.js`
   - Handles copying 5 sample images to device gallery
   - Uses AsyncStorage to track if images have been copied
   - Creates "Catfish Sample Images" album

2. **App Integration**: `App.js`
   - Service is called automatically on app launch
   - Runs asynchronously without blocking app startup
   - Handles permission denials gracefully

3. **Sample Images Used**:
   - person1.jpg
   - person2.png
   - person3.jpg
   - person4.webp
   - person5.webp

## How to Test

### Step 1: Build and Install the App

**Option A: Using Expo Go (Development)**
```bash
cd catfish
npm start
# Then scan QR code with Expo Go app
```

**Option B: Using Development Build**
```bash
cd catfish
npx expo run:ios
# or
npx expo run:android
```

**Option C: Using EAS Build (Production-like)**
```bash
cd catfish
eas build --profile simulator --platform ios
# Wait for build to complete, then download and install
```

### Step 2: First Launch
1. Launch the app for the first time
2. Grant photo library permissions when prompted
3. Check the console logs for confirmation:
   ```
   ✓ Copied 5 sample images to gallery
   ```

### Step 3: Verify Images in Gallery
1. In the app, tap "Tap to Scan"
2. Tap "Upload Image"
3. The native gallery picker should open
4. Look for the "Catfish Sample Images" album
5. Verify all 5 sample images are visible

### Step 4: Test Scanning
1. Select one of the sample images
2. Verify it loads correctly
3. Let the analysis complete
4. Check that results are displayed

### Step 5: Verify No Duplicates
1. Close and reopen the app
2. Check console logs - should see:
   ```
   Sample images already in gallery
   ```
3. Verify no duplicate images were created in the gallery

## Troubleshooting

### Images Not Appearing in Gallery

**Check Permissions:**
- iOS: Settings > Privacy & Security > Photos > Catfish
- Android: Settings > Apps > Catfish > Permissions > Photos

**Reset and Retry:**
You can reset the copy flag for testing:
```javascript
// In a temporary test file or console
import * as SampleImagesService from './services/sampleImagesService';
await SampleImagesService.resetSampleImagesCopy();
// Then restart the app
```

### Permission Denied
If permissions are denied on first launch:
- The app will continue to work normally
- Users can grant permissions later in device settings
- Next app launch will attempt to copy images again

## Console Log Messages

**Success:**
```
Starting to copy sample images to gallery...
Copying person1...
✓ Copied person1
Copying person2...
✓ Copied person2
...
Creating "Catfish Sample Images" album...
✓ Created album with 5 images
Successfully copied 5 sample images to gallery
✓ Copied 5 sample images to gallery
```

**Already Copied:**
```
Sample images already copied to gallery, skipping...
Sample images already in gallery
```

**Permission Denied:**
```
Photo library permission not granted
Could not copy sample images: Permission not granted
```

## Implementation Details

### AsyncStorage Key
- `@catfish_sample_images_copied` - Boolean flag tracking if images have been copied

### File Locations
- Service: `catfish/services/sampleImagesService.js`
- Integration: `catfish/App.js` (lines ~1093-1130)
- Assets: `catfish/assets/sample-images/`

### Dependencies Used
- `expo-media-library` (v18.2.1)
- `expo-file-system` (v19.0.19)
- `expo-asset` (included with expo)
- `@react-native-async-storage/async-storage` (v2.2.0)

## Expected User Experience

1. **First time user installs app**
2. **App launches and requests photo permission**
3. **Sample images are automatically copied to gallery**
4. **User clicks "Tap to Scan"**
5. **User clicks "Upload Image"**
6. **Gallery opens showing sample images**
7. **User can select a sample image to test the scanning feature**

This provides a seamless onboarding experience where users can immediately test the app's scanning functionality without needing their own photos.
