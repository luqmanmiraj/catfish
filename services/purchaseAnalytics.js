import * as Analytics from './analyticsService';
import * as MetaAnalytics from './metaAnalytics';

// In-memory dedup to avoid double conversion firing in the same app session.
const trackedTransactions = new Set();

function normalizePrice(value) {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
}

function normalizeString(value, fallback = null) {
  if (value === undefined || value === null) return fallback;
  const result = String(value).trim();
  return result.length > 0 ? result : fallback;
}

/**
 * Track a successful purchase across analytics providers.
 * Uses transaction-level dedup to prevent duplicate conversion events.
 */
export async function trackPurchaseSuccess({
  userId = null,
  productId = null,
  packId = null,
  price = 0,
  currency = 'USD',
  transactionId = null,
} = {}) {
  const normalizedTransactionId = normalizeString(transactionId, `${Date.now()}`);
  if (trackedTransactions.has(normalizedTransactionId)) {
    return { tracked: false, reason: 'duplicate_transaction' };
  }

  const normalizedPrice = normalizePrice(price);
  const normalizedCurrency = normalizeString(currency, 'USD');
  const normalizedProductId = normalizeString(productId, 'unknown');
  const normalizedPackId = normalizeString(packId, null);
  const normalizedUserId = normalizeString(userId, null);

  // Reserve transaction ID before dispatch to prevent races in rapid duplicate taps.
  trackedTransactions.add(normalizedTransactionId);

  try {
    await Analytics.trackPurchaseCompleted({
      user_id: normalizedUserId,
      product_id: normalizedProductId,
      pack_id: normalizedPackId,
      price: normalizedPrice,
      currency: normalizedCurrency,
      transaction_id: normalizedTransactionId,
    });

    await MetaAnalytics.trackPurchase({
      value: normalizedPrice,
      currency: normalizedCurrency,
      product_id: normalizedProductId,
      pack_id: normalizedPackId,
      transaction_id: normalizedTransactionId,
      user_id: normalizedUserId,
    });

    return { tracked: true };
  } catch (error) {
    // Allow retry if tracking failed.
    trackedTransactions.delete(normalizedTransactionId);
    throw error;
  }
}

export default {
  trackPurchaseSuccess,
};
