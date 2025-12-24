# API Endpoint Configuration Notes

## Current Setup

The app is currently configured to use the `/dev` endpoint for both development and production builds:

```
https://cw30abur3e.execute-api.us-east-1.amazonaws.com/dev
```

## Why This Was Changed

When building APK files, `__DEV__` is `false`, which was causing the app to try to use the `/prod` endpoint. However, if you haven't deployed a production stage, the `/prod` endpoint doesn't exist, resulting in 403 errors.

## To Use Production Endpoint

When you're ready to use a production endpoint:

1. **Deploy a production stage:**
   ```bash
   cd lambda
   serverless deploy --stage prod
   ```

2. **Update `config/apiConfig.js`:**
   ```javascript
   const API_BASE_URL = __DEV__
     ? 'https://cw30abur3e.execute-api.us-east-1.amazonaws.com/dev'
     : 'https://YOUR_PROD_API_ID.execute-api.us-east-1.amazonaws.com/prod';
   ```

3. **Rebuild your APK** with the updated configuration

## Troubleshooting 403 Errors

If you get 403 errors:

1. **Check if the endpoint exists:**
   - Test the endpoint in a browser or with curl
   - Verify the stage name matches your deployment

2. **Check CORS configuration:**
   - Ensure CORS is enabled in `serverless.yml` (it should be `cors: true`)

3. **Check API Gateway permissions:**
   - Verify the endpoint is publicly accessible
   - Check if there are any API keys or authorizers blocking requests

4. **Check network connectivity:**
   - Ensure the device has internet access
   - Check if corporate firewalls are blocking the requests

## Current Configuration

- **Development:** Uses `/dev` endpoint
- **Production Builds (APK/IPA):** Uses `/dev` endpoint (change when prod is deployed)








