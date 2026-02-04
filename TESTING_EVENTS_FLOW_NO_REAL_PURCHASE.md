# Testing the Events Flow (No Real Money)

Ways to test the purchase/events flow **for testing only** – no actual charges.

---

## 1. Sandbox (Recommended – Full Flow, No Real Money)

**Use Apple Sandbox.** Sandbox purchases **do not charge real money**; they’re for testing only.

**Flow you’ll see:**

1. User taps “Purchase” in the app.
2. **RevenueCat** → processes “purchase” with Apple Sandbox.
3. **Backend** → `POST /subscription/purchase` adds tokens (called from app after RevenueCat success).
4. **Analytics** → PostHog / Analytics `trackPurchaseCompleted` fires.

**Setup:**

1. **Device:** Settings → App Store → **Sandbox Account** → sign in with a **Sandbox Tester** from App Store Connect (Users and Access → Sandbox → Testers).
2. **App:** Open the paywall, pick a pack (e.g. 50 Scans), tap **Purchase Now**.
3. When Apple asks, confirm with the **Sandbox** account (no real charge).

**Where to see events:**

- **RevenueCat:** Dashboard → **Customers** → select user → **Customer History** (purchases, restores).
- **Backend:** Lambda logs for `POST /subscription/purchase` and token balance updates.
- **PostHog:** Dashboard → **Events** → filter for `PurchaseCompleted` (or your event name).

---

## 2. Simulator + StoreKit Configuration (Local “Purchase”, No Charge)

**Use a StoreKit Configuration file** so the simulator can “buy” products locally. No Apple server, no real or sandbox charge.

**Flow:**

1. App requests products → StoreKit returns them from your **.storekit** file.
2. User taps “Purchase” → StoreKit completes the “purchase” locally.
3. RevenueCat SDK may still receive the transaction (depending on config).
4. App then calls backend and analytics as in the real flow.

**Setup:**

1. In Xcode: **File → New → File** → **StoreKit Configuration File** → add products `pack_15`, `pack_50`, `pack_100`.
2. **Product → Scheme → Edit Scheme** → **Run** → **Options** → **StoreKit Configuration** → select that file.
3. Run the app in the **simulator** and complete a “purchase” from the paywall.

**Where to see events:** Same as above (RevenueCat dashboard, backend logs, PostHog) if the app reaches those code paths.

---

## 3. Backend-Only: Add Tokens Without Any Purchase

**Use the test endpoint** to add tokens and test **token balance + backend** only. No RevenueCat purchase, no purchase UI, no PostHog purchase event.

**Flow:**

- You call `POST /subscription/test/add-tokens` with `userId` and `tokens`.
- Backend adds tokens to that user.
- When the app refreshes (e.g. open paywall or scan screen), it will show the new balance.

**No purchase events** – only backend and “scans remaining” in the app.

**Example (replace with your API base URL and user ID):**

```bash
curl -X POST "https://YOUR_API_BASE_URL/dev/subscription/test/add-tokens" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"userId": "YOUR_USER_ID", "tokens": 50}'
```

Or without auth (if your backend allows it for this test path):

```bash
curl -X POST "https://YOUR_API_BASE_URL/dev/subscription/test/add-tokens" \
  -H "Content-Type: application/json" \
  -d '{"userId": "YOUR_USER_ID", "tokens": 50}'
```

**Where to see:** Backend logs; app token balance after refresh. No RevenueCat/PostHog purchase events.

---

## 4. Quick Comparison

| Goal | Method | RevenueCat | Backend | PostHog | Real/Sandbox charge |
|------|--------|------------|---------|---------|----------------------|
| Full purchase flow, no real money | **Sandbox** | ✅ | ✅ | ✅ | No (sandbox only) |
| Full flow in simulator | **StoreKit config** | Maybe* | ✅ | ✅ | No |
| Only token balance + backend | **test/add-tokens** | ❌ | ✅ | ❌ | N/A |

\* Depends on RevenueCat/StoreKit behavior with local config.

---

## Summary

- **To see the full events flow (RevenueCat + backend + analytics) without real money:** use **Sandbox** on a real device and do one test purchase with a Sandbox Tester account.
- **To test in simulator with no charge:** use a **StoreKit Configuration** file and complete a “purchase” in the app.
- **To test only token balance and backend:** call **POST /subscription/test/add-tokens** with `userId` and `tokens`; no purchase or purchase events.

Sandbox is the standard way to “test only” and still see the real event flow end-to-end.
