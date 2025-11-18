# YeetLures Fishing Companion

A premium, modern fishing companion mobile app designed to help anglers of all skill levels improve their results through intelligent catch logging, real-time weather analysis, and AI-powered fishing forecasts.

![YeetLures Fishing Companion](https://via.placeholder.com/800x400?text=YeetLures+Fishing+Companion)

## Overview

YeetLures Fishing Companion is a cross-platform mobile application built with React Native that combines traditional catch logging with modern AI technology to provide anglers with data-driven insights and recommendations.

### Key Features

#### MVP Features (Free)
- **Smart Catch Logbook**: Log catches with species, weight, length, notes, photos, location, and automatic weather capture
- **Weather Dashboard**: Real-time weather conditions, wind, barometric pressure, moon phase, solunar activity, sunrise/sunset
- **YeetLures Library**: Complete catalog of YeetLures products with color recommendations and ideal conditions
- **User Notes**: Add personal notes to lures based on your experiences
- **Push Notifications**: Get notified about optimal fishing conditions
- **Clean Bottom Navigation**: Easy access to all major features

#### Premium Features ($3.99/month or $29/year)
- **AI Fishing Forecaster**: Get personalized forecasts with best fishing times and ideal lure recommendations
- **Pattern Detection**: Discover patterns in your catch history based on weather, time, location, and lure effectiveness
- **Heat Maps**: Visualize your most productive fishing spots
- **Seasonal Analytics**: Comprehensive catch analytics broken down by season
- **Advanced Weather Charts**: Hourly weather forecasts and barometric pressure trends
- **Unlimited Photos**: Store unlimited catch photos in cloud storage
- **Ad-Free Experience**: No advertisements

## Design Philosophy

YeetLures Fishing Companion follows a premium, clean, modern outdoor aesthetic with:

- **Spacious Layout**: Generous padding and consistent spacing (4px, 8px, 12px, 16px, 20px, 24px)
- **Soft Shadows**: Light drop shadows (10-18% opacity, 12-24px blur)
- **Unified Corners**: Consistent border radius (cards: 16-20px, buttons: 14-20px, inputs: 12-16px)
- **Clean Typography**: Modern font stack with clear hierarchy
- **Outdoor Color Palette**: Forest greens, natural tones, and subtle accents
- **Smooth Interactions**: Micro-interactions with <180ms transitions

### Design Frame
- Width: 430px
- Height: 932px (standard iPhone 14 Pro dimensions)

## Tech Stack

### Frontend
- **React Native** 0.72.6
- **TypeScript** 5.3.2
- **React Navigation** 6.x (Stack + Bottom Tabs)

### Backend & Services
- **Firebase Auth**: User authentication
- **Cloud Firestore**: NoSQL database for catches, lures, user data
- **Firebase Storage**: Photo storage
- **Firebase Cloud Messaging**: Push notifications

### APIs & Integrations
- **OpenWeather API**: Real-time weather data
- **SunCalc**: Sun/moon calculations for solunar data
- **Anthropic Claude / OpenAI**: AI-powered forecasts and pattern detection
- **Google Maps SDK**: Location services and heat maps

### Data Management
- **AsyncStorage**: Offline catch storage
- **NetInfo**: Network connectivity detection

## Project Structure

```
yeetlures-fishing-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── index.ts
│   ├── screens/             # App screens
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CatchListScreen.tsx
│   │   ├── AddCatchScreen.tsx
│   │   ├── LureLibraryScreen.tsx
│   │   ├── LureDetailScreen.tsx
│   │   ├── WeatherDashboardScreen.tsx
│   │   ├── AIForecasterScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PremiumUpgradeScreen.tsx
│   │   └── index.ts
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── services/            # Business logic and API services
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── catch.service.ts
│   │   │   ├── lure.service.ts
│   │   │   └── index.ts
│   │   ├── weather.service.ts
│   │   ├── ai.service.ts
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── catch.ts
│   │   ├── lure.ts
│   │   ├── user.ts
│   │   ├── weather.ts
│   │   ├── ai.ts
│   │   └── index.ts
│   └── theme/               # Design system
│       ├── colors.ts
│       ├── spacing.ts
│       ├── typography.ts
│       ├── radius.ts
│       ├── shadows.ts
│       └── index.ts
├── App.tsx                  # Root component
├── index.js                 # Entry point
├── package.json
├── tsconfig.json
└── .env.example             # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- Firebase account
- OpenWeather API key
- Anthropic or OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yeetlures/fishing-companion.git
   cd fishing-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   - Firebase credentials (from Firebase Console)
   - OpenWeather API key
   - Anthropic or OpenAI API key
   - Google Maps API key

4. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

5. **Run the app**

   For iOS:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

   For Android:
   ```bash
   npm run android
   # or
   yarn android
   ```

### Firebase Setup

1. Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Firebase Storage
5. Enable Cloud Messaging for notifications
6. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
7. Place configuration files in appropriate directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/YeetLuresFishing/GoogleService-Info.plist`

### API Keys Setup

#### OpenWeather API
1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Generate an API key
3. Add to `.env` as `OPENWEATHER_API_KEY`

#### AI Services (Choose One)

**Anthropic Claude:**
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Generate an API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

**OpenAI:**
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Generate an API key
3. Add to `.env` as `OPENAI_API_KEY`

#### Google Maps
1. Enable Maps SDK in Google Cloud Console
2. Generate an API key
3. Add to `.env` as `GOOGLE_MAPS_API_KEY`

## Development Roadmap

### Week 1-2: Foundation & Design
- [x] Set up React Native project with TypeScript
- [x] Create design system (colors, typography, spacing)
- [x] Build reusable UI components (Card, Button, Input, Badge)
- [x] Define data models and TypeScript interfaces
- [x] Set up Firebase configuration

### Week 3: Core Features
- [x] Implement navigation structure
- [x] Build onboarding flow
- [x] Create catch logging screens (list, add, edit)
- [x] Implement photo upload functionality
- [x] Add location services integration

### Week 4: Weather & Conditions
- [x] Integrate OpenWeather API
- [x] Build weather dashboard with current conditions
- [x] Calculate solunar periods
- [x] Display sun/moon data
- [ ] Implement barometric pressure trends

### Week 5: Premium Features
- [x] Create AI forecasting service
- [x] Build AI Forecaster screen
- [x] Implement pattern detection algorithms
- [ ] Create heat map visualization
- [ ] Build analytics dashboard

### Week 6: Polish & Launch
- [ ] Implement in-app purchases (iOS/Android)
- [ ] Set up push notifications
- [ ] Add offline mode and sync
- [ ] Complete QA testing
- [ ] Submit to App Store and Google Play

## Features Deep Dive

### Catch Logbook
- Species identification
- Weight and length measurements
- Multiple photo uploads
- Location tagging with map integration
- Automatic weather snapshot at catch time
- Lure selection from library
- Custom notes and observations
- Timeline view of all catches

### Weather Dashboard
- Current temperature and conditions
- Wind speed and direction
- Barometric pressure with trend indicator
- Humidity and visibility
- UV index
- Moon phase and illumination percentage
- Sunrise/sunset times
- Moonrise/moonset times
- Solunar activity rating (0-5)
- Major and minor feeding periods

### YeetLures Library
- Complete catalog of YeetLures products
- High-quality product images
- Detailed specifications (weight, length, type)
- Available color options
- Target species recommendations
- Ideal water conditions (clear, stained, murky)
- Best seasons for use
- Recommended techniques
- Deep links to YeetLures store
- User notes and experiences

### AI Fishing Forecaster (Premium)
- Overall fishing rating (0-10)
- Best fishing times with reasoning
- Personalized lure recommendations
- Color suggestions based on conditions
- Pattern detection from user's catch history
- Weather condition analysis
- Solunar period integration
- Confidence scores for recommendations

### Pattern Detection (Premium)
- Time-of-day patterns
- Weather condition correlations
- Location-based success rates
- Lure effectiveness analysis
- Species behavior insights
- Seasonal trends
- Moon phase correlations

### Analytics (Premium)
- Total catches by period (week/month/season/year)
- Species breakdown with percentages
- Best performing locations
- Most effective lures
- Optimal conditions summary
- Personal records and achievements

## Monetization Strategy

### Free Tier
- Basic catch logging (limited to 50 catches)
- Weather dashboard (current conditions only)
- YeetLures library (basic info)
- 3 photos per catch
- Advertisement supported

### Premium ($3.99/month or $29/year)
- Unlimited catches
- AI fishing forecaster
- Pattern detection
- Heat maps
- Advanced analytics
- Hourly weather forecasts
- Pressure trend charts
- Unlimited photos
- Ad-free experience
- Priority support

### Additional Revenue
- YeetLures store deep links (affiliate commissions)
- Optional in-app purchases for special features
- Seasonal promotions and bundle deals

## Design Specifications

### Color Palette
```typescript
Primary Green: #2C6E49
Secondary Green: #4C9F70
Light Mint: #87C5A4
Sunset Orange: #D4965B
Water Blue: #5A8AA6
Premium Gold: #D4A574
```

### Typography
- **Font Family**: System (SF Pro on iOS, Roboto on Android)
- **H1**: 32px, Semi-Bold
- **H2**: 24px, Semi-Bold
- **H3**: 20px, Semi-Bold
- **Body**: 16px, Regular
- **Caption**: 13px, Regular

### Spacing Scale
- XS: 4px
- SM: 8px
- MD: 12px
- LG: 16px
- XL: 20px
- XXL: 24px
- XXXL: 32px

## Data Models

### Catch
```typescript
{
  id: string;
  userId: string;
  species: string;
  weight?: number;
  length?: number;
  notes?: string;
  location?: Location;
  weather?: WeatherSnapshot;
  lureUsed?: string;
  photos: string[];
  timestamp: Date;
  syncStatus: 'synced' | 'pending' | 'failed';
}
```

### Lure
```typescript
{
  id: string;
  name: string;
  type: LureType;
  brand: 'YeetLures' | 'Other';
  colors: string[];
  description: string;
  targetSpecies: string[];
  idealConditions: IdealConditions;
  colorRecommendations: ColorRecommendation[];
  techniques: string[];
  productUrl?: string;
  isPremium: boolean;
}
```

### User
```typescript
{
  id: string;
  email: string;
  displayName?: string;
  subscription: UserSubscription;
  preferences: UserPreferences;
  createdAt: Date;
}
```

## Offline Support

The app includes offline mode for logging catches without internet connectivity:

1. Catches are saved to AsyncStorage when offline
2. Photos are stored locally
3. Weather data uses last known conditions
4. Location uses device GPS
5. Automatic sync when connection is restored
6. Conflict resolution for duplicate entries

## Testing

### Unit Tests
```bash
npm test
# or
yarn test
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Deployment

### iOS App Store

1. Configure app signing in Xcode
2. Update version in `ios/YeetLuresFishing/Info.plist`
3. Build release version
4. Submit via App Store Connect

### Google Play Store

1. Generate signed APK/AAB
2. Update version in `android/app/build.gradle`
3. Upload to Google Play Console
4. Submit for review

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by YeetLures. All rights reserved.

## Support

For technical support or questions:
- Email: support@yeetlures.com
- Website: https://yeetlures.com/support
- GitHub Issues: https://github.com/yeetlures/fishing-companion/issues

## Acknowledgments

- Weather data provided by OpenWeather
- Sun/moon calculations by SunCalc
- AI powered by Anthropic Claude / OpenAI
- Icons and illustrations by [attribution]

---

**Built with ❤️ by the YeetLures team**

*Go fish smarter, not harder.*
