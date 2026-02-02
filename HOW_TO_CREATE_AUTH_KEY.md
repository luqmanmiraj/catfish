# How to Create App Store Connect API Key (Auth Key)

This guide shows you how to create the App Store Connect API Key (also called "Auth Key").

---

## ⚠️ Important: Which Key Do You Need?

**For RevenueCat, you need TWO different keys:**

1. **In-App Purchase Key** (REQUIRED) - For validating purchases
   - Location: Users and Access → Integrations → In-App Purchase
   - This is the main key you need!

2. **App Store Connect API Key** (OPTIONAL) - For automatic product import
   - Location: Users and Access → Keys → App Store Connect API
   - This is optional - only needed if you want automatic product import

**If you already have the In-App Purchase Key, you might not need the API Key!**

---

## How to Create App Store Connect API Key (Auth Key)

### Step 1: Navigate to Keys Section

1. **Sign in to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Sign in with your Admin account

2. **Go to Users and Access**
   - Click on **"Users and Access"** in the top navigation

3. **Open Keys Tab**
   - Click on the **"Keys"** tab at the top
   - (This is different from the "Integrations" tab)

4. **Find App Store Connect API**
   - Look for **"App Store Connect API"** or **"Team Keys"** in the left sidebar
   - Or it may be in the main content area
   - Click on it

### Step 2: Generate the API Key

1. **Check for Existing Keys**
   - Look at the **"Active Keys"** section
   - If a key already exists with appropriate permissions, you can use that one
   - If you need a new key, proceed to generate one

2. **Generate New Key**
   - Click the **"+"** button or **"Generate API Key"** button
   - A dialog will appear

3. **Name the Key**
   - Enter a descriptive name (e.g., "RevenueCat API Key" or "Catfish App API")
   - This helps identify the key later

4. **Select Access Level**
   - Choose **"App Manager"** or **"Admin"** access level
   - **App Manager** is usually sufficient for RevenueCat
   - **Admin** provides full access (use if needed)

5. **Generate the Key**
   - Click **"Generate"** or **"Create"**
   - The key will be created and displayed

### Step 3: Download and Save the Key

1. **Download the .p8 File**
   - Click **"Download"** or **"Download Key"** button
   - ⚠️ **CRITICAL**: You can only download this file **once**!
   - The file will be named: `AuthKey_XXXXXXXX.p8`
   - Save it to a secure location immediately

2. **Note the Key ID**
   - The **Key ID** is displayed on the same page
   - It looks like: `XXXXXXXX` (8-10 character alphanumeric string)
   - **Copy and save this**

3. **Note the Issuer ID**
   - The **Issuer ID** is displayed at the **top** of the "Active Keys" section
   - It's the same Issuer ID as your In-App Purchase Key
   - It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (UUID format)
   - **Copy and save this**

### Step 4: Use in RevenueCat (Optional)

**If you want to use this key in RevenueCat:**

1. **Go to RevenueCat Dashboard**
   - Visit https://app.revenuecat.com
   - Go to **Apps & Providers** → Your iOS App

2. **Find App Store Connect API Section**
   - Look for **"App Store Connect API"** section or tab
   - It may be in the same page as In-App Purchase Key, or a separate tab

3. **Upload the Key**
   - Upload the **.p8 file** (App Store Connect API Key)
   - Enter the **Issuer ID**
   - Enter the **Vendor Number** (optional, found in Payments and Financial Reports)
   - Click **"Save"**

**Note**: This is optional. The In-App Purchase Key is the main requirement. You only need the API Key if you want automatic product import.

---

## Troubleshooting

### Can't Find "App Store Connect API" Option?

**Possible reasons:**
1. **Wrong tab** - Make sure you're in the **"Keys"** tab, not "Integrations" tab
2. **Permissions** - You need Admin or Account Holder role
3. **Not visible** - The option might only be visible to Account Holder

**What to do:**
- Try the **"Keys"** tab (not Integrations)
- Check you have Admin/Account Holder role
- If still not visible, you can skip this - it's optional!

### Already Have In-App Purchase Key?

**Good news**: You might not need the API Key at all!

- The **In-App Purchase Key** is the main requirement
- The **API Key** is only for automatic product import
- If you're manually linking products (which you are), you can skip the API Key

---

## Quick Summary

**To create App Store Connect API Key:**
1. Users and Access → **Keys** tab → App Store Connect API
2. Click "+" → Name it → Select access level → Generate
3. Download .p8 file (only once!)
4. Note Key ID and Issuer ID

**Remember:**
- This is **optional** for RevenueCat
- In-App Purchase Key is the **main requirement**
- Only create this if you need automatic product import

---

## Which Key Do You Actually Need?

**For RevenueCat setup, you need:**

✅ **In-App Purchase Key** (REQUIRED)
- Location: Users and Access → Integrations → In-App Purchase
- Used for: Validating purchases and subscriptions
- This is what you MUST have!

❌ **App Store Connect API Key** (OPTIONAL)
- Location: Users and Access → Keys → App Store Connect API
- Used for: Automatic product import
- You can skip this if manually linking products

**If you're not sure which one you need, you probably need the In-App Purchase Key!**

---

Need help? Check `APP_STORE_ADMIN_GUIDE.md` for detailed instructions on creating the In-App Purchase Key (the main one you need).
