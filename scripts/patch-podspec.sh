#!/bin/bash

# Patch react-native-safe-area-context podspec to remove visionos support
# This is needed for CocoaPods versions < 1.15 that don't support visionos

PODSPEC_PATH="node_modules/react-native-safe-area-context/react-native-safe-area-context.podspec"

if [ -f "$PODSPEC_PATH" ]; then
  echo "Patching react-native-safe-area-context.podspec..."
  sed -i '' 's/^[[:space:]]*s\.visionos\.deployment_target[[:space:]]*=.*$/# s.visionos.deployment_target = "1.0"  # Commented out for CocoaPods < 1.15 compatibility/' "$PODSPEC_PATH"
  echo "Podspec patched successfully!"
else
  echo "Warning: Podspec file not found at $PODSPEC_PATH"
fi

