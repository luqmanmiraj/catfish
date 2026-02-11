// Subscription API service for backend communication

import apiConfig from '../config/apiConfig';
import { logDeviceMetadata } from '../utils/deviceLogger';

const { API_BASE_URL } = apiConfig;

/**
 * Get subscription status from backend
 * Returns guest user status if there's an error
 */
export async function getSubscriptionStatus(accessToken) {
  try {
    const url = `${API_BASE_URL}/subscription/status`;
    // Log device info before request
    await logDeviceMetadata(null, url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Log the response for debugging
    console.log('📊 Subscription Status API Response:');
    console.log('==========================================');
    console.log(JSON.stringify(data, null, 2));
    console.log('==========================================');
    console.log('Token Balance from API:', data.tokenBalance);
    console.log('Scans Remaining from API:', data.scansRemaining);
    
    return data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    console.error('⚠️ API call failed - returning fallback status with 0 scans (actual DB values may differ)');
    // Return fallback status with 0 scans - don't show fake scans on error
    return {
      success: false,
      subscription: {
        tier: 'free',
        status: 'active',
        isPro: false,
      },
      tokenBalance: 0,
      scanCount: 0,
      scanLimit: 0,
      scansRemaining: 0,
    };
  }
}

/**
 * Check if user can perform a scan
 * @deprecated This function is no longer used. 
 * The app now uses local scansRemaining state from /subscription/status instead.
 * This eliminates the need for a separate /subscription/check API call.
 * 
 * Kept for backward compatibility but should not be called.
 */
export async function checkCanScan(accessToken, userId = null) {
  console.warn('checkCanScan API call is deprecated. Use local scansRemaining state instead.');
  // Return a safe default to prevent errors if somehow still called
  return {
    canScan: false,
    scansRemaining: 0,
    tokenBalance: 0,
  };
}

/**
 * Decrement token after successful scan
 */
export async function decrementToken(accessToken, userId = null) {
  try {
    const body = userId ? { userId } : {};
    const url = `${API_BASE_URL}/subscription/decrement`;
    // Log device info before request
    await logDeviceMetadata(null, url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error decrementing token:', error);
    throw error;
  }
}

/**
 * Purchase token pack
 */
export async function purchaseTokenPack(accessToken, packId, transactionId = null) {
  try {
    const body = { packId, transactionId };
    const url = `${API_BASE_URL}/subscription/purchase`;
    // Log device info before request
    await logDeviceMetadata(null, url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error purchasing token pack:', error);
    throw error;
  }
}

/**
 * Get scan history for the authenticated user
 */
export async function getScanHistory(accessToken, limit = 50, lastEvaluatedKey = null) {
  try {
    let url = `${API_BASE_URL}/scan-history?limit=${limit}`;
    if (lastEvaluatedKey) {
      url += `&lastEvaluatedKey=${encodeURIComponent(JSON.stringify(lastEvaluatedKey))}`;
    }
    
    // Log device info before request
    await logDeviceMetadata(null, url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching scan history:', error);
    throw error;
  }
}

/**
 * Create new scan history entry
 */
export async function createScanHistory(accessToken, scanData) {
  try {
    const url = `${API_BASE_URL}/scan-history`;
    
    // Log device info before request
    await logDeviceMetadata(null, url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(scanData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating scan history:', error);
    throw error;
  }
}

/**
 * Update scan history item (label and note)
 */
export async function updateScanHistory(accessToken, scanId, label, note) {
  try {
    const url = `${API_BASE_URL}/scan-history`;
    
    // Log device info before request
    await logDeviceMetadata(null, url);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        scanId,
        label: label || null,
        note: note || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating scan history:', error);
    throw error;
  }
}

