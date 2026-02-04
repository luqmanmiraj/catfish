# Why Offerings Are Empty – Debug Guide

## What Your Logs Mean

```
API request completed: GET '.../offerings' (304)
No existing products cached, starting store products request for: ["pack_50", "pack_15", "pack_100"]
Error: None of the products ... could be fetched from App Store Connect (or the StoreKit Configuration file)
```

- **304** = RevenueCat **API is fine** (offerings are configured in the dashboard).
- **Failure** = **StoreKit** (Apple) could not return products `pack_15`, `pack_50`, `pack_100` for this app/session.

So: RevenueCat is correct; the **device/simulator** is not getting those product IDs from Apple (or from a local StoreKit config).

---

## 1. Where Are You Running?

### A. iOS Simulator – Make Sure It Fetches from StoreKit

On the **simulator**, Apple does **not** serve real App Store Connect products. The app must use a **StoreKit Configuration file** so StoreKit returns `pack_15`, `pack_50`, `pack_100` locally.

**You already have:** `ios/app06d4c135e7.storekit` with `pack_15`, `pack_50`, `pack_100` (Consumable), and the **catfish** scheme points to it (Run → StoreKit Configuration).

**To ensure the simulator actually uses it:**

1. **Launch from Xcode** (so the scheme’s StoreKit setting is applied):
   - `cd catfish/ios && open catfish.xcworkspace`
   - In Xcode: **Product → Scheme → Edit Scheme…** (⌘<) → **Run** → **Options** tab → confirm **StoreKit Configuration** is set to **app06d4c135e7.storekit** (no warning).
   - Select an **iPhone simulator** and press **Run** (⌘R). Do **not** start the app from Expo CLI first and then attach; run the app from Xcode so the StoreKit environment is active.
2. **Clean and rerun** if offerings still don’t load:
   - **Product → Clean Build Folder** (⇧⌘K), then **Run** (⌘R) again.
3. **Restart the simulator** once: **Device → Erase All Content and Settings**, then run from Xcode again.

**If you use `npx expo run:ios`:**  
It uses the same scheme, so StoreKit config should apply. If offerings are still empty, run once from **Xcode** as above to confirm the config is used (e.g. offerings load). Then you can switch back to `expo run:ios` if you prefer.

**Optional: create a new StoreKit file**  
If you prefer a different file: **File → New → File…** → **StoreKit Configuration File** → add products `pack_15`, `pack_50`, `pack_100` → in **Edit Scheme → Run → Options** set **StoreKit Configuration** to that file.

---

### B. Real iOS Device

On a **real device**, StoreKit fetches from **App Store Connect**. If offerings are still empty, one of the following is wrong.

**Checklist**

| Check | Where | What to verify |
|-------|--------|-----------------|
| **1. Products exist** | App Store Connect → Your App → Features → In-App Purchases | `pack_15`, `pack_50`, `pack_100` exist. |
| **2. Product status** | Same place | Status is **Ready to Submit** or **Approved** (not Missing Metadata). |
| **3. Bundle ID** | App Store Connect (app) and RevenueCat (iOS app) | Bundle ID is **com.anonymous.catfish** in both. |
| **4. RevenueCat ↔ App Store** | RevenueCat → Apps & Providers → Your iOS app | App Store Connect shows as **Connected**; products are linked to the same IDs. |
| **5. RevenueCat offering** | RevenueCat → Offerings | Default (or your) offering has **packages** that use product IDs `pack_15`, `pack_50`, `pack_100`. |
| **6. Sandbox account** | iPhone: Settings → App Store → Sandbox Account | Signed in with a **Sandbox Tester** from App Store Connect (Users and Access → Sandbox). |

**Quick verification**

- RevenueCat Dashboard → **Events**: look for “offerings” or “products” events and any errors.
- RevenueCat → **Offerings** → your offering: each package should show an iOS product ID (`pack_15` etc.) and no “product not found” warning.

---

## 2. Summary

| Run on | Why offerings empty | Fix |
|--------|---------------------|-----|
| **Simulator** | No real App Store products | Add a **StoreKit Configuration file** in Xcode with `pack_15`, `pack_50`, `pack_100` and set it in the Run scheme. |
| **Device** | Products / bundle ID / connection / sandbox | Use the checklist above (App Store Connect, RevenueCat, bundle ID, sandbox account). |

---

## 3. After Changing Anything

- **Simulator**: Run again from Xcode (or `npx expo run:ios`); no need to sign in to sandbox.
- **Device**: Restart the app; ensure sandbox account is still signed in under Settings → App Store.

Reference: [RevenueCat – Why are my offerings empty?](https://rev.cat/why-are-offerings-empty)
