# Sentry Build Error - How to Fix

## Error Explanation

**Error Message:**
```
Auth token is required for this request. Please run `sentry-cli login` and try again!
```

**What's happening:**
- During the iOS build, Sentry (`@sentry/react-native`) automatically tries to upload source maps to Sentry
- Source maps help Sentry show readable stack traces for errors
- The upload requires authentication (Sentry auth token), but it's not configured
- This causes the build to fail

**This is NOT a RevenueCat issue** - it's a Sentry configuration issue.

---

## Quick Fix: Disable Source Map Upload (Easiest)

If you don't need source maps uploaded automatically, you can disable it:

### Option 1: Set Environment Variable in EAS Build

1. **Update `eas.json`** to disable Sentry source map upload:

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_NO_CAPABILITY_SYNC": "1",
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    },
    "production": {
      "env": {
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      }
    }
  }
}
```

2. **Or set it to allow failures** (uploads will be skipped if auth fails):

```json
{
  "build": {
    "preview": {
      "env": {
        "EXPO_NO_CAPABILITY_SYNC": "1",
        "SENTRY_ALLOW_FAILURE": "true"
      }
    },
    "production": {
      "env": {
        "SENTRY_ALLOW_FAILURE": "true"
      }
    }
  }
}
```

### Option 2: Disable in app.json Plugin

1. **Open `app.json`**
2. **Find the Sentry plugin** (should be in the `plugins` array)
3. **Add configuration to disable source maps:**

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native",
        {
          "organization": "your-org",
          "project": "catfish",
          "uploadSourceMaps": false
        }
      ]
    ]
  }
}
```

---

## Proper Fix: Configure Sentry Auth Token (Recommended)

If you want source maps uploaded (better error tracking), configure authentication:

### Step 1: Get Sentry Auth Token

1. **Go to Sentry Dashboard**
   - Visit https://sentry.io
   - Sign in to your account

2. **Create Auth Token**
   - Go to **Settings** → **Auth Tokens**
   - Click **"Create New Token"**
   - Give it a name (e.g., "EAS Build Token")
   - Select scopes:
     - ✅ **project:releases** (required for uploading source maps)
     - ✅ **org:read** (to read organization info)
   - Click **"Create Token"**
   - **Copy the token immediately** (you can only see it once!)

### Step 2: Add Token to EAS Secrets

1. **Add as EAS Secret**
   ```bash
   eas secret:create --scope project --name SENTRY_AUTH_TOKEN --value your-token-here
   ```

2. **Or add to eas.json environment variables:**
   ```json
   {
     "build": {
       "production": {
         "env": {
           "SENTRY_AUTH_TOKEN": "your-token-here"
         }
       }
     }
   }
   ```
   ⚠️ **Note**: Don't commit tokens to git! Use EAS secrets instead.

### Step 3: Configure Sentry in app.json

1. **Update `app.json`** with Sentry configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native",
        {
          "organization": "your-org-slug",
          "project": "catfish",
          "authToken": "${SENTRY_AUTH_TOKEN}"
        }
      ]
    ]
  }
}
```

---

## Alternative: Remove Sentry Plugin Temporarily

If you want to build without fixing Sentry right now:

1. **Open `app.json`**
2. **Comment out or remove the Sentry plugin:**

```json
{
  "expo": {
    "plugins": [
      // [
      //   "@sentry/react-native",
      //   {
      //     "organization": "your-org",
      //     "project": "catfish"
      //   }
      // ]
    ]
  }
}
```

3. **Rebuild your app**
4. **Note**: You'll still have Sentry SDK in your app, but source maps won't be uploaded automatically

---

## Recommended Solution

**For now, use Option 1 (disable auto-upload):**

1. **Update `eas.json`:**

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_NO_CAPABILITY_SYNC": "1",
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      },
      "ios": {
        "simulator": true,
        "buildConfiguration": "Release"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "distribution": "store",
      "env": {
        "SENTRY_DISABLE_AUTO_UPLOAD": "true"
      },
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

2. **Rebuild your app**
   ```bash
   eas build --profile preview --platform ios
   ```

This will allow your build to complete without Sentry source map upload errors.

---

## Summary

**The Error:**
- Sentry tries to upload source maps during build
- Needs authentication token
- Token not configured → build fails

**Quick Fix:**
- Add `SENTRY_DISABLE_AUTO_UPLOAD=true` to `eas.json` env variables
- Rebuild

**Proper Fix:**
- Get Sentry auth token
- Add to EAS secrets
- Configure in app.json plugin

**Your app will still work** - Sentry error tracking will still function, you just won't have automatic source map uploads (which are nice but not critical).

---

Need help? Check Sentry documentation: https://docs.sentry.io/platforms/react-native/
