#!/bin/bash

# Quick script to start a remote-accessible simulator
# Usage: ./start-remote-simulator.sh [web|ios|android]

MODE=${1:-web}

echo "🚀 Starting Remote Simulator..."
echo ""

case $MODE in
  web)
    echo "📱 Starting Web Simulator with Tunnel Mode"
    echo "   This creates a public URL accessible from anywhere"
    echo ""
    echo "   After starting, you'll get a shareable link"
    echo "   Share this link with clients to test your app"
    echo ""
    echo "   Press Ctrl+C to stop"
    echo "   ---"
    echo ""
    npx expo start --web --tunnel
    ;;
  ios)
    echo "🍎 Starting iOS Simulator"
    echo "   Make sure Xcode and iOS Simulator are installed"
    echo ""
    npx expo start --ios
    ;;
  android)
    echo "🤖 Starting Android Emulator"
    echo "   Make sure Android Studio and an AVD are set up"
    echo ""
    npx expo start --android
    ;;
  *)
    echo "❌ Invalid mode: $MODE"
    echo ""
    echo "Usage: ./start-remote-simulator.sh [web|ios|android]"
    echo ""
    echo "Options:"
    echo "  web      - Start web simulator with tunnel (recommended for remote access)"
    echo "  ios      - Start iOS simulator (requires Mac with Xcode)"
    echo "  android  - Start Android emulator (requires Android Studio)"
    exit 1
    ;;
esac
