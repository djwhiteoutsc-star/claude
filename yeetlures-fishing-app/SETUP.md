# YeetLures Fishing Companion - Setup Guide

This guide will walk you through setting up the YeetLures Fishing Companion app for development.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [API Keys](#api-keys)
5. [Running the App](#running-the-app)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js** (v16 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm** or **yarn**
  - npm comes with Node.js
  - Yarn: `npm install -g yarn`

- **React Native CLI**
  ```bash
  npm install -g react-native-cli
  ```

### For iOS Development (macOS only)

- **Xcode** (latest version)
  - Download from Mac App Store
  - Install Command Line Tools: `xcode-select --install`

- **CocoaPods**
  ```bash
  sudo gem install cocoapods
  ```

### For Android Development

- **Android Studio**
  - Download from [developer.android.com](https://developer.android.com/studio)
  - Install Android SDK (API level 31+)
  - Set up Android emulator

- **Java Development Kit (JDK)**
  - JDK 11 or higher
  - Verify: `java --version`

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yeetlures/fishing-companion.git
cd yeetlures-fishing-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install iOS Dependencies (macOS only)

```bash
cd ios
pod install
cd ..
```

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: "YeetLures Fishing"
4. Enable Google Analytics (optional)
5. Create project

### 2. Add iOS App (Optional)

1. In Firebase Console, click "Add app" → iOS
2. Enter iOS Bundle ID: `com.yeetlures.fishing`
3. Download `GoogleService-Info.plist`
4. Place in `ios/YeetLuresFishing/`

### 3. Add Android App (Optional)

1. In Firebase Console, click "Add app" → Android
2. Enter package name: `com.yeetlures.fishing`
3. Download `google-services.json`
4. Place in `android/app/`

### 4. Enable Firebase Services

**Authentication:**
1. Go to Authentication → Sign-in method
2. Enable Email/Password
3. Enable Google (optional)

**Firestore:**
1. Go to Firestore Database
2. Click "Create database"
3. Start in test mode (change to production later)
4. Choose location closest to your users

**Storage:**
1. Go to Storage
2. Click "Get started"
3. Start in test mode (change to production later)

**Cloud Messaging:**
1. Go to Cloud Messaging
2. Enable Cloud Messaging API

### 5. Get Firebase Configuration

1. Go to Project Settings → General
2. Scroll to "Your apps"
3. Copy configuration values
4. Add to `.env` file (see below)

## API Keys

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Firebase

Add your Firebase credentials to `.env`:

```env
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxx
```

### 3. OpenWeather API

1. Sign up at [OpenWeather](https://openweathermap.org/api)
2. Go to API keys
3. Generate a new key
4. Add to `.env`:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

### 4. AI Service API (Choose One)

**Option A: Anthropic Claude**
1. Sign up at [Anthropic Console](https://console.anthropic.com)
2. Generate API key
3. Add to `.env`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
   ```

**Option B: OpenAI**
1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Generate API key
3. Add to `.env`:
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   ```

### 5. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps SDK for iOS and Android
3. Create API key with restrictions
4. Add to `.env`:
   ```env
   GOOGLE_MAPS_API_KEY=AIzaXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## Running the App

### iOS

```bash
# Start Metro bundler
npm start

# In a new terminal, run iOS
npm run ios

# Or specify a device
npx react-native run-ios --simulator="iPhone 14 Pro"
```

### Android

```bash
# Start Metro bundler
npm start

# In a new terminal, run Android
npm run android

# Or specify a device
npx react-native run-android --deviceId=emulator-5554
```

### Development Mode

The app runs in development mode by default:
- Hot reloading enabled
- Debug console available
- React DevTools accessible

To open developer menu:
- iOS: Cmd+D (simulator) or shake device
- Android: Cmd+M (Mac) or Ctrl+M (Windows/Linux)

## Troubleshooting

### Common Issues

**Metro Bundler Port Conflict**
```bash
# Kill process on port 8081
npx react-native start --reset-cache
```

**iOS Build Fails**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Android Build Fails**
```bash
cd android
./gradlew clean
cd ..
```

**Missing Dependencies**
```bash
rm -rf node_modules
npm install
# or
yarn install
```

**TypeScript Errors**
```bash
npm run type-check
# Fix any type errors before running
```

### Reset Everything

If all else fails:

```bash
# Clean everything
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build
rm -rf android/build
rm -rf android/app/build

# Reinstall
npm install
cd ios && pod install && cd ..

# Rebuild
npm run ios
# or
npm run android
```

### Getting Help

- Check [React Native Docs](https://reactnative.dev/docs/getting-started)
- Review [Firebase Documentation](https://firebase.google.com/docs)
- Search [GitHub Issues](https://github.com/yeetlures/fishing-companion/issues)
- Contact support: support@yeetlures.com

## Next Steps

Once setup is complete:

1. **Explore the codebase**: Start with `App.tsx` and `src/navigation/AppNavigator.tsx`
2. **Review the design system**: Check out `src/theme/`
3. **Test the screens**: Navigate through all screens in the app
4. **Add sample data**: Create test catches and explore features
5. **Read the main README**: Understand the full project architecture

Happy coding!
