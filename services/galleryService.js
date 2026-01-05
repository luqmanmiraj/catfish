/**
 * Gallery Service
 * Handles populating device gallery with sample images
 */

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

const GALLERY_POPULATED_KEY = '@catfish:galleryPopulated';

// List of sample images to include in the bundle
// These should be placed in assets/sample-images/ folder
const SAMPLE_IMAGES = [
  require('../assets/sample-images/person1.jpg'),
  require('../assets/sample-images/person2.jpg'),
  require('../assets/sample-images/person3.jpg'),
  require('../assets/sample-images/person4.jpg'),
  require('../assets/sample-images/person5.jpg'),
  require('../assets/sample-images/person6.jpg'),
  require('../assets/sample-images/person7.jpg'),
  require('../assets/sample-images/person8.jpg'),
  require('../assets/sample-images/person9.png'),
  require('../assets/sample-images/person10.jpg'),
  require('../assets/sample-images/person11.webp'),
  require('../assets/sample-images/person12.webp'),
  require('../assets/sample-images/person13.webp'),
  require('../assets/sample-images/person14.webp'),
  require('../assets/sample-images/person15.jpg'),
  require('../assets/sample-images/person16.jpg'),
];

/**
 * Check if gallery has already been populated
 */
export async function isGalleryPopulated() {
  try {
    const value = await AsyncStorage.getItem(GALLERY_POPULATED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking gallery populated status:', error);
    return false;
  }
}

/**
 * Mark gallery as populated
 */
async function setGalleryPopulated() {
  try {
    await AsyncStorage.setItem(GALLERY_POPULATED_KEY, 'true');
  } catch (error) {
    console.error('Error setting gallery populated status:', error);
  }
}

/**
 * Request media library permissions
 */
async function requestMediaLibraryPermission() {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return false;
  }
}

/**
 * Get asset file URI for saving to gallery
 */
async function getAssetFileUri(assetModule) {
  try {
    // Resolve the asset URI from the require() module
    const resolved = Image.resolveAssetSource(assetModule);
    
    if (!resolved || !resolved.uri) {
      throw new Error('Could not resolve asset URI');
    }
    
    const assetUri = resolved.uri;
    
    // Create a temporary file name in document directory
    const filename = `sample_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    
    // Check if the asset URI is a remote URL (HTTP/HTTPS) or local file
    if (assetUri.startsWith('http://') || assetUri.startsWith('https://')) {
      // In development, assets are served from dev server - need to download
      const downloadResult = await FileSystem.downloadAsync(assetUri, fileUri);
      return downloadResult.uri;
    } else if (assetUri.startsWith('file://') || assetUri.startsWith('/')) {
      // Local file - copy it
      await FileSystem.copyAsync({
        from: assetUri,
        to: fileUri,
      });
      return fileUri;
    } else {
      // Try downloading as fallback
      const downloadResult = await FileSystem.downloadAsync(assetUri, fileUri);
      return downloadResult.uri;
    }
  } catch (error) {
    console.error('Error getting asset file URI:', error);
    throw error;
  }
}

/**
 * Save image to device gallery
 */
async function saveImageToGallery(fileUri) {
  try {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    return asset;
  } catch (error) {
    console.error('Error saving image to gallery:', error);
    throw error;
  }
}

/**
 * Populate gallery with sample images
 * This function will:
 * 1. Check if already populated (using AsyncStorage - empty on fresh install)
 * 2. Request permissions
 * 3. Copy sample images from app bundle
 * 4. Save them to device gallery
 * 
 * Note: This runs on every fresh app install because AsyncStorage is empty on first launch
 */
export async function populateGalleryWithSamples() {
  try {
    // Check if already populated
    // On fresh install, AsyncStorage is empty, so this will return false
    const alreadyPopulated = await isGalleryPopulated();
    if (alreadyPopulated) {
      console.log('Gallery already populated with sample images (skipping)');
      return { success: true, message: 'Gallery already populated' };
    }

    console.log('Fresh install detected - populating gallery with sample images from app bundle');

    // Request media library permission
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      console.warn('Media library permission not granted, cannot populate gallery');
      return { 
        success: false, 
        message: 'Media library permission required to add sample images' 
      };
    }

    console.log('Starting to populate gallery with sample images...');
    
    let successCount = 0;
    let failCount = 0;

    // Process each sample image
    for (let i = 0; i < SAMPLE_IMAGES.length; i++) {
      let fileUri = null;
      try {
        const imageAsset = SAMPLE_IMAGES[i];
        
        // Get asset file URI (copies to temp location if needed)
        fileUri = await getAssetFileUri(imageAsset);
        
        // Save to gallery
        await saveImageToGallery(fileUri);
        
        successCount++;
        console.log(`Successfully added sample image ${i + 1}/${SAMPLE_IMAGES.length} to gallery`);
      } catch (error) {
        failCount++;
        console.error(`Failed to add sample image ${i + 1}:`, error);
        // Continue with next image even if one fails
      } finally {
        // Clean up temporary file if it was created in document directory
        if (fileUri && fileUri.startsWith(FileSystem.documentDirectory)) {
          try {
            await FileSystem.deleteAsync(fileUri, { idempotent: true });
          } catch (cleanupError) {
            // Ignore cleanup errors
            console.warn('Could not clean up temporary file:', cleanupError);
          }
        }
      }
    }

    // Mark as populated if at least one image was added
    if (successCount > 0) {
      await setGalleryPopulated();
      console.log(`Gallery population complete: ${successCount} images added, ${failCount} failed`);
      return { 
        success: true, 
        message: `Successfully added ${successCount} sample images to gallery`,
        count: successCount
      };
    } else {
      console.error('Failed to add any sample images to gallery');
      return { 
        success: false, 
        message: 'Failed to add sample images to gallery',
        count: 0
      };
    }
  } catch (error) {
    console.error('Error populating gallery:', error);
    return { 
      success: false, 
      message: error.message || 'Unknown error occurred',
      error: error
    };
  }
}

/**
 * Reset gallery populated flag (for testing/debugging)
 */
export async function resetGalleryPopulatedFlag() {
  try {
    await AsyncStorage.removeItem(GALLERY_POPULATED_KEY);
    console.log('Gallery populated flag reset');
  } catch (error) {
    console.error('Error resetting gallery populated flag:', error);
  }
}

