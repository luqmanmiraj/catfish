# Understanding Different .p8 Key Types in App Store Connect

This guide explains the difference between the two types of .p8 keys you might encounter in App Store Connect.

---

## Two Types of .p8 Keys

### 1. **In-App Purchase Key (.p8)** - Also called "Subscription Key" or "IAP Key"

**Location in App Store Connect:**
- **Users and Access** → **Integrations** → **In-App Purchase**

**Purpose:**
- ✅ **Primary key for RevenueCat** - This is what you need!
- Validates in-app purchases and subscriptions
- Used for StoreKit 2 receipt validation
- Authenticates server-to-server requests for IAP transactions
- Required for RevenueCat to verify purchases with Apple

**What it's used for:**
- Validating purchase receipts
- Verifying subscription status
- Server-side purchase validation
- RevenueCat integration (main requirement)

**File naming:**
- Usually named something like: `AuthKey_XXXXXXXX.p8` or `SubscriptionKey_XXXXXXXX.p8`
- The "AuthKey" or "SubscriptionKey" prefix is just Apple's naming convention
- Both refer to the same thing: **In-App Purchase Key**

**Required for RevenueCat:**
- ✅ **YES - This is the main requirement**
- You need: .p8 file + Key ID + Issuer ID

---

### 2. **App Store Connect API Key (.p8)** - Also called "Auth Key" or "API Key"

**Location in App Store Connect:**
- **Users and Access** → **Keys** → **App Store Connect API**
- Or **Users and Access** → **Integrations** → **App Store Connect API** (if visible)

**Purpose:**
- General-purpose API authentication
- Access to App Store Connect API for managing apps
- Can manage app metadata, pricing, builds, etc.
- Used by automation tools (like fastlane, CI/CD)

**What it's used for:**
- Managing app information via API
- Automating app store operations
- Accessing App Store Connect programmatically
- Some RevenueCat features (optional, for product import)

**File naming:**
- Usually named something like: `AuthKey_XXXXXXXX.p8`
- The "AuthKey" prefix indicates it's an API key

**Required for RevenueCat:**
- ❌ **NO - This is optional**
- Can be useful for automatic product import
- But In-App Purchase Key is the main requirement

---

## Key Differences Summary

| Feature | In-App Purchase Key | App Store Connect API Key |
|---------|-------------------|---------------------------|
| **Also called** | Subscription Key, IAP Key | Auth Key, API Key |
| **Location** | Integrations → In-App Purchase | Keys → App Store Connect API |
| **Primary use** | Validate purchases/subscriptions | Manage apps via API |
| **For RevenueCat** | ✅ **REQUIRED** (main key) | ❌ Optional (for product import) |
| **File name** | `AuthKey_XXX.p8` or `SubscriptionKey_XXX.p8` | `AuthKey_XXX.p8` |
| **What it validates** | Purchase receipts, subscriptions | API access permissions |
| **StoreKit 2** | ✅ Used for receipt validation | ❌ Not used for receipts |

---

## Which One Do You Need for RevenueCat?

### ✅ **In-App Purchase Key** - REQUIRED

This is the main key you need for RevenueCat. It's used to:
- Validate purchase receipts
- Verify subscription status
- Authenticate with Apple's servers for IAP

**You need:**
1. The .p8 file (In-App Purchase Key)
2. Key ID
3. Issuer ID

### ❌ **App Store Connect API Key** - OPTIONAL

This is optional and mainly useful for:
- Automatic product import from App Store Connect
- Managing products via API

**You can skip this** if you're manually linking products in RevenueCat.

---

## Common Confusion: "AuthKey" vs "SubscriptionKey"

**Important**: Both file names can start with "AuthKey_" or "SubscriptionKey_" - this is just Apple's naming convention. The important thing is **where the key was generated**:

- **In-App Purchase Key**: Generated from **Integrations → In-App Purchase**
- **App Store Connect API Key**: Generated from **Keys → App Store Connect API**

**To identify which key you have:**
1. Check where it was generated in App Store Connect
2. Check the Key ID - it will be listed in the corresponding section
3. For RevenueCat, you need the one from **In-App Purchase** section

---

## For Your RevenueCat Setup

**What you need:**
- ✅ **In-App Purchase Key (.p8 file)** from **Integrations → In-App Purchase**
- ✅ **Key ID** (shown when generating the key)
- ✅ **Issuer ID** (shown in Active Keys section)

**What you can skip:**
- ❌ App Store Connect API Key (optional, only for automatic product import)

---

## Quick Reference

**For RevenueCat iOS setup:**
1. Get **In-App Purchase Key** (.p8 file) - REQUIRED
2. Get **Key ID** - REQUIRED
3. Get **Issuer ID** - REQUIRED
4. Get **Shared Secret** - OPTIONAL (for sandbox testing)

**File naming doesn't matter** - whether it's called "AuthKey" or "SubscriptionKey", what matters is that it's the **In-App Purchase Key** from the correct location in App Store Connect.

---

## Need Help?

If you're unsure which key you have:
1. Check where it was generated in App Store Connect
2. In-App Purchase Key = **Integrations → In-App Purchase**
3. API Key = **Keys → App Store Connect API**

For RevenueCat, you need the **In-App Purchase Key** (the one from Integrations → In-App Purchase).
