import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';

const SAMPLE_IMAGES_COPIED_KEY = '@catfish_sample_images_copied';

// Sample images to copy to gallery
const SAMPLE_IMAGES = [
  { name: 'person1', file: require('../assets/sample-images/person1.jpg') },
  { name: 'person2', file: require('../assets/sample-images/person2.png') },
  { name: 'person3', file: require('../assets/sample-images/person3.jpg') },
  { name: 'person4', file: require('../assets/sample-images/person4.webp') },
  { name: 'person5', file: require('../assets/sample-images/person5.webp') },
];

/**
 * Check if sample images have already been copied to gallery
 * @returns {Promise<boolean>}
 */
export const hasCopiedSampleImages = async () => {
  try {
    const value = await AsyncStorage.getItem(SAMPLE_IMAGES_COPIED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error checking sample images copy status:', error);
    return false;
  }
};

/**
 * Mark sample images as copied in AsyncStorage
 * @returns {Promise<void>}
 */
const markSampleImagesCopied = async () => {
  try {
    await AsyncStorage.setItem(SAMPLE_IMAGES_COPIED_KEY, 'true');
  } catch (error) {
    console.error('Error marking sample images as copied:', error);
  }
};

/**
 * Reset the sample images copy flag (for testing purposes)
 * @returns {Promise<void>}
 */
export const resetSampleImagesCopy = async () => {
  try {
    await AsyncStorage.removeItem(SAMPLE_IMAGES_COPIED_KEY);
    console.log('Sample images copy flag reset');
  } catch (error) {
    console.error('Error resetting sample images copy flag:', error);
  }
};

/**
 * Copy a single image from app assets to device gallery
 * @param {Object} imageAsset - The image asset to copy
 * @param {string} imageName - Name for the image file
 * @returns {Promise<MediaLibrary.Asset>}
 */
const copyImageToGallery = async (imageAsset, imageName) => {
  try {
    // Download/load the asset
    const asset = Asset.fromModule(imageAsset);
    await asset.downloadAsync();

    // Get the local URI of the asset
    const localUri = asset.localUri || asset.uri;

    if (!localUri) {
      throw new Error(`Could not get local URI for ${imageName}`);
    }

    // Create a temporary file path in the app's document directory
    const fileExtension = localUri.split('.').pop();
    const tempPath = `${FileSystem.documentDirectory}catfish_sample_${imageName}.${fileExtension}`;

    // Copy the asset to a temporary location
    await FileSystem.copyAsync({
      from: localUri,
      to: tempPath,
    });

    // Save to media library
    const mediaAsset = await MediaLibrary.createAssetAsync(tempPath);

    // Clean up temporary file
    try {
      await FileSystem.deleteAsync(tempPath, { idempotent: true });
    } catch (cleanupError) {
      console.warn('Could not delete temporary file:', cleanupError);
    }

    return mediaAsset;
  } catch (error) {
    console.error(`Error copying image ${imageName} to gallery:`, error);
    throw error;
  }
};

/**
 * Copy all sample images to device gallery
 * Creates an album named "Catfish Sample Images" and adds all images to it
 * @returns {Promise<{success: boolean, copiedCount: number, error?: string}>}
 */
export const copySampleImagesToGallery = async () => {
  try {
    // Check if already copied
    const alreadyCopied = await hasCopiedSampleImages();
    if (alreadyCopied) {
      console.log('Sample images already copied to gallery, skipping...');
      return { success: true, copiedCount: 0, skipped: true };
    }

    // Request permissions
    let status;
    try {
      const result = await MediaLibrary.requestPermissionsAsync(false); // false = only request write permissions
      status = result.status;
    } catch (permError) {
      console.warn('Photo library permission request failed:', permError.message);
      // This can happen in Expo Go with certain permission configurations
      return { 
        success: false, 
        copiedCount: 0, 
        error: `Permission request failed: ${permError.message}` 
      };
    }
    
    if (status !== 'granted') {
      console.warn('Photo library permission not granted');
      return { 
        success: false, 
        copiedCount: 0, 
        error: 'Permission not granted' 
      };
    }

    console.log('Starting to copy sample images to gallery...');

    // Copy each image to gallery
    const copiedAssets = [];
    for (const image of SAMPLE_IMAGES) {
      try {
        console.log(`Copying ${image.name}...`);
        const asset = await copyImageToGallery(image.file, image.name);
        copiedAssets.push(asset);
        console.log(`✓ Copied ${image.name}`);
      } catch (error) {
        console.error(`Failed to copy ${image.name}:`, error);
        // Continue with other images even if one fails
      }
    }

    // Create or get the album
    if (copiedAssets.length > 0) {
      try {
        console.log('Creating "Catfish Sample Images" album...');
        let album = await MediaLibrary.getAlbumAsync('Catfish Sample Images');
        
        if (album == null) {
          // Create new album with the first asset
          album = await MediaLibrary.createAlbumAsync(
            'Catfish Sample Images',
            copiedAssets[0],
            false
          );
          
          // Add remaining assets to the album
          if (copiedAssets.length > 1) {
            await MediaLibrary.addAssetsToAlbumAsync(
              copiedAssets.slice(1),
              album,
              false
            );
          }
        } else {
          // Album exists, add all assets to it
          await MediaLibrary.addAssetsToAlbumAsync(
            copiedAssets,
            album,
            false
          );
        }
        
        console.log(`✓ Created album with ${copiedAssets.length} images`);
      } catch (albumError) {
        console.warn('Could not create album, but images were saved:', albumError);
      }
    }

    // Mark as copied
    await markSampleImagesCopied();

    console.log(`Successfully copied ${copiedAssets.length} sample images to gallery`);
    
    return { 
      success: true, 
      copiedCount: copiedAssets.length 
    };
  } catch (error) {
    console.error('Error copying sample images to gallery:', error);
    return { 
      success: false, 
      copiedCount: 0, 
      error: error.message 
    };
  }
};
