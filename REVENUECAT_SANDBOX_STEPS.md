# RevenueCat Sandbox-Only Integration Steps

You see **"Please ensure RevenueCat is configured to complete the purchase"** because **RevenueCat does not work in Expo Go**. The RevenueCat SDK is native and is only loaded in a **development build** or production build. Use the steps below to test purchases in **sandbox only**.

---

## 1. Use a development build (required – Expo Go will not work)

RevenueCat requires a build that includes the native `react-native-purchases` module. In Expo Go the SDK is never loaded, so purchases cannot run there.

**Option A – EAS Build (recommended)**

From the `catfish` folder:

```bash
# Build for a real iOS device (for sandbox testing)
eas build --profile preview --platform ios
```

- `preview` in your `eas.json` already has `simulator: false`, so you get an `.ipa` for a physical device.
- After the build finishes, download the `.ipa` and install on your iPhone:
  - **Xcode**: Window → Devices and Simulators → select your device → drag the `.ipa` into "Installed Apps"
  - Or use **Apple Configurator 2** / drag to device in Finder if supported.

**Option B – Local dev build**

```bash
cd catfish
npx expo prebuild
npx expo run:ios --device
```

Use a **real device** for sandbox IAP; simulator is unreliable for Store Kit.

---


## 2. App Store Connect – products (sandbox uses same products)

1. Go to [App Store Connect](https://appstoreconnect.apple.com) → your app → **Features** → **In-App Purchases**.
2. Create **Consumable** (or Non-Consumable if you prefer) products with these **Product IDs** (must match your app/RevenueCat):
   - `pack_15` – 15 Scans  
   - `pack_50` – 50 Scans  
   - `pack_100` – 100 Scans  
3. Set price, display name, and description. Submit for review only when you’re ready for production; **sandbox does not require app review**.

---

## 3. Connect App Store Connect to RevenueCat

1. **App Store Connect API key (recommended)**  
   - App Store Connect → **Users and Access** → **Keys** → **In-App Purchase** → create a key, download the `.p8` file, note **Key ID** and **Issuer ID**.  
   - RevenueCat Dashboard → **Project** → **Apps & Providers** → your **iOS app** → **App Store Connect API Key**: upload `.p8`, set Key ID, Issuer ID, and **App-specific shared secret** (optional for sandbox).

2. **Bundle ID**  
   - In RevenueCat, your iOS app must use the **same bundle ID** as in `app.json`: `com.anonymous.catfish`.

---

## 4. RevenueCat – products and offering

1. **Products**  
   RevenueCat → **Product Catalog** (or **Products**) → create/link products with identifiers:  
   `pack_15`, `pack_50`, `pack_100`.  
   If you connected App Store Connect, you can link/import these from the store.

2. **Offerings**  
   RevenueCat → **Offerings** → default (or your offering) → add **Packages** that reference `pack_15`, `pack_50`, `pack_100`.  
   Your app already expects packages like “15 Scans”, “50 Scans”, “100 Scans”; matching identifiers here is enough.

3. **API key**  
   Your iOS key is already in `catfish/config/apiConfig.js` (`REVENUECAT_API_KEY.ios`). No change needed for sandbox.

---

## 5. Sandbox Apple ID on device

1. On the **iPhone** where you installed the dev build: **Settings** → **App Store** → **Sandbox Account** (or sign in at the bottom under Sandbox).  
2. Use a **Sandbox Tester** from App Store Connect: **Users and Access** → **Sandbox** → **Testers** → create one and sign in on the device with that Apple ID.  
3. When you tap “Purchase” in your app, iOS will use this Sandbox account and **no real charge** will be made.

---

## 6. Test in the app

1. Open the **development build** (not Expo Go) on your iPhone.  
2. Go to **Purchase Scan Packs**, choose a pack (e.g. 50 Scans), tap **Purchase Now**.  
3. You should see the native Apple payment sheet and complete the purchase with your Sandbox Apple ID.  
4. RevenueCat will receive the event; your backend can be notified via webhooks or your existing `purchaseTokenPack` flow when you’re ready.

---

## Quick checklist (sandbox only)

- [ ] Build installed from EAS `preview` or `expo run:ios --device` (not Expo Go).  
- [ ] App Store Connect: products `pack_15`, `pack_50`, `pack_100` created.  
- [ ] RevenueCat: App Store Connect connected; same bundle ID `com.anonymous.catfish`.  
- [ ] RevenueCat: products and offering configured with those identifiers.  
- [ ] iPhone: signed in with a Sandbox Tester account.  
- [ ] Purchase flow tested in the dev build.

---

**Summary:** The “Configure RevenueCat” message in Expo Go is expected. For sandbox-only testing, use a **development build** on a **real device**, then configure App Store Connect + RevenueCat + Sandbox account as above. No TestFlight or production submission is required for sandbox.
