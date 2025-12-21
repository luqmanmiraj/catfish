#!/bin/bash

# Quick script to share your Expo app with clients
# Usage: ./share-app.sh

echo "🚀 Starting Expo development server with tunnel mode..."
echo ""
echo "This will create a shareable link that clients can use to test your app."
echo ""
echo "📱 Clients will need to:"
echo "   1. Install 'Expo Go' app from App Store (iOS) or Google Play (Android)"
echo "   2. Scan the QR code or open the link you share with them"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "---"
echo ""

# Start Expo with tunnel mode for shareable link
npx expo start --tunnel
