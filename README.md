# Catfish Crasher

**Catfish Crasher: Photo Check** — a mobile app that helps users check whether profile or dating photos are authentic or AI-generated.

Built with **Expo** and **React Native** for iOS, Android, and Web.

## Features

- Scan photos from the camera or gallery
- AI / deepfake detection (Real, Fake, or Inconclusive)
- Scan history with notes
- Share and export branded reports
- User accounts (sign up, sign in, guest mode)
- **Catfish Pro** subscriptions via RevenueCat

## Tech stack

- Expo SDK 54 · React Native 0.81 · React 19
- AWS API Gateway + Lambda (backend)
- RevenueCat, PostHog, Sentry

## Getting started

**Prerequisites:** Node.js, npm, and the [Expo CLI](https://docs.expo.dev/get-started/installation/)

```bash
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android, or `w` for web.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run ios` | Start on iOS |
| `npm run android` | Start on Android |
| `npm run web` | Start on web |
| `npm run build:preview:all` | EAS preview build (iOS + Android) |

## Project structure

```
App.js              # App entry & navigation
screens/            # UI screens (scan, results, auth, etc.)
components/         # Reusable UI components
services/           # API, auth, subscriptions, analytics
context/            # React Context (auth, subscriptions, alerts)
config/             # API endpoints and third-party keys
```
