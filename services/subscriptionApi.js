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
    return data;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    // Return guest user status instead of throwing
    return {
      success: true,
      subscription: {
        tier: 'free',
        status: 'active',
        isPro: false,
      },
      scanCount: 0,
      scanLimit: 3,
      scansRemaining: 3,
    };
  }
}

/**
 * Check if user can perform a scan
 */
export async function checkCanScan(accessToken, userId = null) {
  try {
    const body = userId ? { userId } : {};
    const url = `${API_BASE_URL}/subscription/check`;
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
    console.error('Error checking scan eligibility:', error);
    throw error;
  }
}

/**
 * Increment scan count after successful scan
 */
export async function incrementScanCount(accessToken, userId = null) {
  try {
    const body = userId ? { userId } : {};
    const url = `${API_BASE_URL}/subscription/increment`;
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
    console.error('Error incrementing scan count:', error);
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

