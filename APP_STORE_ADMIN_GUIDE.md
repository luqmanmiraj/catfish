# App Store Connect Admin Guide - Creating Keys for RevenueCat

This guide is for **App Store Connect Admins or Account Holders** to create the necessary keys for RevenueCat integration.

---

## Prerequisites

- ✅ Admin or Account Holder role in App Store Connect
- ✅ Access to Users and Access section
- ✅ Secure location to save downloaded files (you can only download once!)

---

## Part 0: Grant Admin Access to a User (If Needed)

If you need to grant Admin access to another user so they can generate keys, follow these steps:

### Step 1: Navigate to Users and Access

1. **Sign in to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Sign in with your Admin or Account Holder account

2. **Go to Users and Access**
   - Click on **"Users and Access"** in the top navigation
   - Or go to: https://appstoreconnect.apple.com/access/users

3. **Open People Tab**
   - Click on the **"People"** tab at the top (this is usually the default view)

### Step 2: Find the User

1. **Locate the Existing User**
   - Scroll through the list of users in the "People" tab
   - Or use the search/filter function to find the specific user by name or email
   - Click on the user's name or email to open their profile/edit page

2. **Note: If User Doesn't Exist**
   - If the user is not in the list, click **"Invite Users"** or **"+"** button
   - Enter their email address
   - They will receive an invitation email
   - After they accept the invitation, you can then change their role to Admin

### Step 3: Change User Role to Admin

1. **Open User's Edit Page**
   - Once you've clicked on the user's name, you'll see their profile/edit page
   - Look for **"Roles"** or **"Access Level"** section
   - You'll see checkboxes or a dropdown for different roles:
     - **Account Holder** (highest level - only one per account)
     - **Admin** (full administrative access) ← **Select this**
     - **App Manager** (can manage apps, but cannot generate keys)
     - **Developer** (limited access)
     - **Marketing** (marketing access only)
     - **Customer Support** (support access only)

2. **Grant Admin Role**
   - Check the **"Admin"** checkbox
   - Or select **"Admin"** from the role dropdown
   - Admin role grants:
     - ✅ Full access to manage users and roles
     - ✅ Ability to generate In-App Purchase Keys
     - ✅ Ability to generate App Store Connect API Keys
     - ✅ Access to all apps and settings
     - ✅ Ability to manage agreements and financial information

3. **Set App Access** (If Applicable)
   - You may see an **"App Access"** section
   - Set it to:
     - **All Apps** - Access to all apps in the account (recommended for Admin)
     - **Specific Apps** - Access to selected apps only
   - For Admin role, "All Apps" is typically the default

4. **Save Changes**
   - Click **"Save"** or **"Save Changes"** button at the bottom of the page
   - You may see a confirmation message
   - The user will now have Admin access

### Step 4: Verify the Change

1. **Confirm Role Update**
   - The user's role should now show as **"Admin"** in the user list
   - The user may need to sign out and sign back in for changes to take effect

2. **Notify the User**
   - Inform the user that they now have Admin access
   - They should sign out and sign back in to App Store Connect
   - They can now generate keys as needed

### Important Notes

- **Account Holder** is the highest role and there can only be one Account Holder per account
- **Admin** role has almost all permissions except transferring Account Holder status
- Only **Account Holder** or **Admin** can:
  - Generate In-App Purchase Keys
  - Generate App Store Connect API Keys
  - Change other users' roles
  - Manage agreements and financial information

### Troubleshooting

**Can't see "Users and Access" option?**
- You need to be Account Holder or Admin to access this section
- If you don't see it, contact your Account Holder

**Can't change a user's role?**
- Only Account Holder or Admin can change roles
- You cannot change your own role (another Admin/Account Holder must do it)
- You cannot change the Account Holder role (only Account Holder can transfer it)

**User not receiving invitation?**
- Check spam/junk folder
- Verify email address is correct
- User may need to accept invitation before role can be changed

---

## Part 1: Create In-App Purchase Key (Subscription Key)

This is the **main key required** for RevenueCat to validate in-app purchases and subscriptions.

### Step 1: Navigate to In-App Purchase Keys

1. **Sign in to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Sign in with your Admin/Account Holder account

2. **Go to Users and Access**
   - Click on **"Users and Access"** in the top navigation
   - Or go to: https://appstoreconnect.apple.com/access/users

3. **Open Integrations Tab**
   - Click on the **"Integrations"** tab at the top

4. **Find In-App Purchase Section**
   - In the **left sidebar**, scroll down to find **"Keys"** section
   - Click on **"In-App Purchase"** (under Keys)

### Step 2: Generate the In-App Purchase Key

1. **Check for Existing Keys**
   - Look at the **"Active Keys"** section
   - If a key already exists and is being used, you can use that one
   - If you need a new key, proceed to generate one

2. **Generate New Key**
   - Click the **"+"** button or **"Generate In-App Purchase Key"** button
   - A dialog will appear

3. **Name the Key** (Optional but Recommended)
   - Enter a descriptive name (e.g., "RevenueCat Integration" or "Catfish App IAP Key")
   - This helps identify the key later

4. **Generate the Key**
   - Click **"Generate"** or **"Create"**
   - The key will be created and displayed

### Step 3: Download and Save the Key

1. **Download the .p8 File**
   - Click **"Download"** or **"Download Key"** button
   - ⚠️ **CRITICAL**: You can only download this file **once**!
   - The file will be named something like: `AuthKey_XXXXXXXX.p8` or `SubscriptionKey_XXXXXXXX.p8`
   - Save it to a secure location immediately

2. **Note the Key ID**
   - The **Key ID** is displayed on the same page
   - It looks like: `XXXXXXXX` (8-10 character alphanumeric string)
   - **Copy and save this** - you'll need it for RevenueCat

3. **Note the Issuer ID**
   - The **Issuer ID** is displayed at the **top** of the "Active Keys" section
   - It looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (UUID format)
   - **Copy and save this** - you'll need it for RevenueCat

### Step 4: Share with Your Team

**You need to share these THREE pieces of information:**

1. ✅ **The .p8 file** (the downloaded file)
2. ✅ **Key ID** (the identifier shown on the page)
3. ✅ **Issuer ID** (shown at top of Active Keys section)

**Share securely:**
- Use a secure file sharing method (encrypted email, secure cloud storage, password-protected zip)
- Never share these publicly or commit them to version control
- The .p8 file is sensitive - treat it like a password

---

## Part 2: Create App Store Connect API Key 



### Step 1: Navigate to App Store Connect API Keys

1. **Go to Users and Access**
   - Click on **"Users and Access"** in the top navigation

2. **Open Keys Tab**
   - Click on the **"Keys"** tab at the top
   - (This is different from the "Integrations" tab)

3. **Find App Store Connect API Section**
   - Look for **"App Store Connect API"** or **"Team Keys"** in the left sidebar
   - Or it may be in the main content area

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

4. **Select Access Level**
   - Choose **"App Manager"** or **"Admin"** access level
   - App Manager is usually sufficient for RevenueCat
   - Admin provides full access (use if needed)

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

### Step 4: Share with Your Team (Optional)

**If using this key, share:**
1. ✅ **The .p8 file** (the downloaded file)
2. ✅ **Key ID** (the identifier shown on the page)
3. ✅ **Issuer ID** (shown at top of Active Keys section)

**Note**: This key is optional. Only share if your team needs automatic product import in RevenueCat.

---

## Summary Checklist

### For In-App Purchase Key (REQUIRED):

- [ ] Navigated to Users and Access → Integrations → In-App Purchase
- [ ] Generated new key (or verified existing key)
- [ ] Downloaded .p8 file (saved securely)
- [ ] Copied Key ID
- [ ] Copied Issuer ID
- [ ] Shared all three pieces securely with team

### For App Store Connect API Key (OPTIONAL):

- [ ] Navigated to Users and Access → Keys → App Store Connect API
- [ ] Generated new key (or verified existing key)
- [ ] Selected appropriate access level (App Manager or Admin)
- [ ] Downloaded .p8 file (saved securely)
- [ ] Copied Key ID
- [ ] Copied Issuer ID
- [ ] Shared all three pieces securely with team (if needed)

---

## What to Share with Your Team

### For RevenueCat Setup, Share:

**In-App Purchase Key (REQUIRED):**
1. The `.p8` file (e.g., `AuthKey_XXXXXXXX.p8`)
2. **Key ID** (e.g., `ABC123XYZ`)
3. **Issuer ID** (e.g., `12345678-1234-1234-1234-123456789012`)

**App Store Connect API Key (OPTIONAL):**
1. The `.p8` file (e.g., `AuthKey_YYYYYYYY.p8`)
2. **Key ID** (e.g., `DEF456UVW`)
3. **Issuer ID** (same as above)

---

## Security Best Practices

1. **Never commit keys to version control** (Git, SVN, etc.)
2. **Use secure file sharing** (encrypted email, secure cloud storage)
3. **Password-protect files** if sharing via email
4. **Delete keys from shared locations** after team has downloaded them
5. **Store keys securely** - treat .p8 files like passwords
6. **Rotate keys periodically** if compromised or team members leave

---

## Troubleshooting

### Can't Find In-App Purchase Section?

- Make sure you're in **Users and Access → Integrations** tab
- Check that you have **Admin or Account Holder** role
- Look in the left sidebar under **"Keys"** section

### Can't Find App Store Connect API Section?

- Make sure you're in **Users and Access → Keys** tab (not Integrations)
- Check that you have **Admin or Account Holder** role
- It may be labeled as **"Team Keys"** or **"App Store Connect API"**

### Lost the .p8 File?

- ⚠️ **You cannot re-download it** - Apple only allows one download
- You'll need to:
  1. Revoke the old key (if possible)
  2. Generate a new key
  3. Update RevenueCat with the new credentials

### Key Not Working in RevenueCat?

- Verify all three pieces are correct: .p8 file, Key ID, and Issuer ID
- Check that the Issuer ID matches (should be the same for both keys)
- Ensure the .p8 file wasn't corrupted or modified
- Make sure you're using the correct key (In-App Purchase Key, not API Key)

---

## Quick Reference

**In-App Purchase Key Location:**
- Users and Access → Integrations → In-App Purchase

**App Store Connect API Key Location:**
- Users and Access → Keys → App Store Connect API

**What to Share:**
- .p8 file + Key ID + Issuer ID (for each key)

**Important:**
- Download .p8 files immediately (can only download once)
- Save all three pieces: .p8 file, Key ID, Issuer ID
- Share securely with your team

---

## Need Help?

- Apple Developer Documentation: https://developer.apple.com/help/app-store-connect/
- RevenueCat Documentation: https://docs.revenuecat.com/
- Contact Apple Developer Support if you encounter issues

---

**You're all set!** Once you've generated and shared the keys, your team can proceed with RevenueCat configuration.
