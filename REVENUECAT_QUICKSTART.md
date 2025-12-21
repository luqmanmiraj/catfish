# RevenueCat Integration Quick Start

This is a quick reference guide for getting RevenueCat integrated and working.

## Step 1: Install Dependencies

### Backend (Lambda)
```bash
cd lambda
npm install --save dotenv
# Note: crypto and AWS SDK are built-in to Node.js Lambda runtime
```

### Frontend (React Native)
```bash
cd catfish
npx expo install react-native-purchases
```

## Step 2: Configure RevenueCat API Keys

### Backend (.env file in lambda/)
```bash
cd lambda
# Add to .env file:
REVENUECAT_SECRET_KEY=sk_your_secret_key_here

# Or store in AWS Secrets Manager:
aws secretsmanager create-secret \
  --name catfish/revenuecat-secret-key \
  --secret-string '{"apiKey":"sk_your_secret_key_here"}'
```

### Frontend (catfish/services/revenueCatService.js)
```javascript
const REVENUECAT_API_KEY = {
  ios: 'appl_YOUR_IOS_API_KEY_HERE',
  android: 'goog_YOUR_ANDROID_API_KEY_HERE',
};
```

## Step 3: Update API URLs

### Frontend Subscription API (catfish/services/subscriptionApi.js)
```javascript
const API_BASE_URL = __DEV__
  ? 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/dev'
  : 'https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod';
```

### Get Your API Gateway URL
```bash
cd lambda
serverless info --verbose
# Look for "endpoints" section
```

## Step 4: Update App.js

Add SubscriptionProvider to wrap your app:

```javascript
import { SubscriptionProvider } from './context/SubscriptionContext';

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  );
}
```

## Step 5: Deploy Backend

```bash
cd lambda
serverless deploy
```

This will create:
- Webhook handler Lambda function
- Subscription handler Lambda function
- Subscriptions DynamoDB table
- Scan counts DynamoDB table

## Step 6: Configure RevenueCat Webhook

1. Go to RevenueCat Dashboard → Project Settings → Webhooks
2. Add webhook URL: `https://YOUR_API_GATEWAY_URL/prod/webhook`
3. Enable these events:
   - INITIAL_PURCHASE
   - RENEWAL
   - CANCELLATION
   - UNCANCELLATION
   - EXPIRATION
   - BILLING_ISSUE

## Step 7: Update Upgrade Handler

Update `handleUpgrade` in `App.js`:

```javascript
const handleUpgrade = async () => {
  try {
    const { purchaseSubscription, getAvailablePackages } = useSubscription();
    const packages = await getAvailablePackages();
    
    if (packages.length > 0) {
      const customerInfo = await purchaseSubscription(packages[0]);
      Alert.alert('Success', 'Subscription activated!');
    } else {
      Alert.alert('Error', 'No subscription packages available');
    }
  } catch (error) {
    console.error('Purchase error:', error);
    Alert.alert('Error', error.message);
  }
};
```

## Step 8: Test Flow

1. **Test Free User Limit**
   - Use app without subscription
   - Try to scan more than 3 times
   - Should show upgrade prompt

2. **Test Purchase Flow**
   - Click upgrade button
   - Complete purchase in sandbox
   - Verify subscription status updates

3. **Test Webhook**
   - Check CloudWatch logs for webhook handler
   - Verify DynamoDB tables are updated

## Step 9: Update UI Components

### ProfileScreen.js
```javascript
const { isPro, scansRemaining, scanCount, scanLimit } = useSubscription();
```

### ScanScreen.js
```javascript
const { scansRemaining, isPro } = useSubscription();
<Text style={scanStyles.scansRemaining}>
  {isPro ? 'Unlimited scans' : `${scansRemaining} scans remaining`}
</Text>
```

## Common Issues

### Issue: "RevenueCat API key not configured"
**Solution**: Update REVENUECAT_API_KEY in revenueCatService.js

### Issue: Webhooks not working
**Solution**: 
1. Check webhook URL is correct in RevenueCat dashboard
2. Verify Lambda function is deployed
3. Check CloudWatch logs for errors

### Issue: Subscription status not updating
**Solution**:
1. Check DynamoDB tables for entries
2. Verify webhook is receiving events
3. Check subscription handler logs

## Next Steps

1. ✅ Test with sandbox accounts
2. ✅ Set up production RevenueCat project
3. ✅ Configure products in App Store Connect / Play Console
4. ✅ Submit app for review
5. ✅ Monitor subscription analytics

## Files Created/Modified

### Backend
- `lambda/webhook-handler.js` - NEW
- `lambda/subscription-handler.js` - NEW
- `lambda/serverless.yml` - UPDATED

### Frontend
- `catfish/services/revenueCatService.js` - NEW
- `catfish/services/subscriptionApi.js` - NEW
- `catfish/context/SubscriptionContext.js` - NEW
- `catfish/App.js` - NEEDS UPDATE (add SubscriptionProvider)

## Support

- RevenueCat Docs: https://docs.revenuecat.com/
- RevenueCat Support: support@revenuecat.com

