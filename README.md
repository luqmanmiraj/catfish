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

## Screenshots

![Screenshot 1](screenshots/2026-02-13%2017-34-29%20High%20Res%20Screenshot.png)
![Screenshot 2](screenshots/2026-02-13%2017-34-54%20High%20Res%20Screenshot.png)
![Screenshot 3](screenshots/2026-02-13%2017-35-21%20High%20Res%20Screenshot.png)
![Screenshot 4](screenshots/2026-02-13%2017-36-46%20High%20Res%20Screenshot.png)
![Screenshot 5](screenshots/2026-02-13%2017-36-54%20High%20Res%20Screenshot.png)
![Screenshot 6](screenshots/2026-02-13%2017-37-29%20High%20Res%20Screenshot.png)
![Screenshot 7](screenshots/2026-02-13%2017-37-37%20High%20Res%20Screenshot.png)
![Screenshot 8](screenshots/2026-02-13%2017-41-26%20High%20Res%20Screenshot.png)
![Screenshot 9](screenshots/2026-02-13%2017-41-46%20High%20Res%20Screenshot.png)
