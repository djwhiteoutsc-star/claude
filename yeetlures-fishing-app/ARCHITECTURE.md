# YeetLures Fishing Companion - Architecture

This document outlines the technical architecture, design patterns, and key decisions behind the YeetLures Fishing Companion app.

## Table of Contents
1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design System](#design-system)
5. [Data Flow](#data-flow)
6. [Services](#services)
7. [Offline Support](#offline-support)
8. [Performance Optimization](#performance-optimization)

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Home    │  │ Catches  │  │  Lures   │  │Weather │  │
│  │Dashboard │  │ Logbook  │  │ Library  │  │ Dash   │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
│         ▲              ▲              ▲           ▲      │
│         └──────────────┴──────────────┴───────────┘      │
│                         │                                │
│                    ┌────▼─────┐                          │
│                    │ Services │                          │
│                    └────┬─────┘                          │
└─────────────────────────┼─────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
     ┌────▼────┐    ┌─────▼─────┐   ┌────▼────┐
     │Firebase │    │OpenWeather│   │   AI    │
     │         │    │    API    │   │ (Claude/│
     │ - Auth  │    │           │   │ OpenAI) │
     │ - Store │    │           │   │         │
     │ - Cloud │    │           │   │         │
     └─────────┘    └───────────┘   └─────────┘
```

## Technology Stack

### Core Framework
- **React Native 0.72.6**: Cross-platform mobile framework
- **TypeScript 5.3.2**: Static typing and enhanced developer experience

### Navigation
- **React Navigation 6**: Stack and tab-based navigation
  - Bottom Tabs: Main app navigation
  - Stack Navigator: Screen hierarchies

### State Management
- **React Hooks**: Local component state
- **Context API**: Global state (user, theme)
- **AsyncStorage**: Persistent local storage

### Backend Services
- **Firebase**:
  - Authentication: User management
  - Firestore: NoSQL database
  - Storage: Image/file storage
  - Cloud Messaging: Push notifications

### External APIs
- **OpenWeather API**: Weather data
- **SunCalc**: Astronomical calculations
- **Anthropic/OpenAI**: AI predictions
- **Google Maps**: Location services

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Card.tsx         # Container component
│   ├── Button.tsx       # Action button with variants
│   ├── Input.tsx        # Text input with validation
│   ├── Badge.tsx        # Label/tag component
│   └── index.ts         # Component exports
│
├── screens/             # Screen components
│   ├── OnboardingScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CatchListScreen.tsx
│   ├── AddCatchScreen.tsx
│   ├── LureLibraryScreen.tsx
│   ├── LureDetailScreen.tsx
│   ├── WeatherDashboardScreen.tsx
│   ├── AIForecasterScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── PremiumUpgradeScreen.tsx
│   └── index.ts
│
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
│
├── services/            # Business logic layer
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.service.ts
│   │   ├── catch.service.ts
│   │   └── lure.service.ts
│   ├── weather.service.ts
│   ├── ai.service.ts
│   └── index.ts
│
├── types/               # TypeScript definitions
│   ├── catch.ts
│   ├── lure.ts
│   ├── user.ts
│   ├── weather.ts
│   ├── ai.ts
│   └── index.ts
│
└── theme/               # Design system
    ├── colors.ts
    ├── spacing.ts
    ├── typography.ts
    ├── radius.ts
    ├── shadows.ts
    └── index.ts
```

## Design System

### Theme Architecture

The design system is centralized in `src/theme/` with the following modules:

**Colors** (`colors.ts`)
- Base colors (white, black)
- Background hierarchy
- Text colors
- Brand accent colors
- Utility colors (success, warning, error)
- Border colors
- Shadow colors

**Spacing** (`spacing.ts`)
- Consistent spacing scale: 4px, 8px, 12px, 16px, 20px, 24px
- Used for padding, margins, gaps

**Typography** (`typography.ts`)
- Font families (system fonts)
- Font sizes (H1-H3, body, caption)
- Font weights (regular, medium, semibold, bold)
- Line heights (tight, normal, relaxed)

**Radius** (`radius.ts`)
- Component-specific border radii
- Cards: 18px
- Buttons: 16px
- Inputs: 14px
- Modals: 28px

**Shadows** (`shadows.ts`)
- Platform-specific shadow definitions
- Light, medium, strong variants
- iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
- Android: elevation

### Component Design Patterns

All components follow consistent patterns:

1. **Props Interface**: Clear TypeScript interface for all props
2. **Default Props**: Sensible defaults for optional props
3. **Variants**: Support for multiple visual variants
4. **Accessibility**: Proper labels and keyboard navigation
5. **Animations**: Smooth micro-interactions (<180ms)

Example:
```typescript
interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}
```

## Data Flow

### User Authentication Flow

```
User Input
    ↓
authService.signIn()
    ↓
Firebase Auth
    ↓
Get User Document (Firestore)
    ↓
Store in Context/State
    ↓
Navigate to Main App
```

### Catch Logging Flow

```
User Fills Form
    ↓
Get Current Location (GPS)
    ↓
Fetch Weather Data (OpenWeather)
    ↓
Upload Photos (Firebase Storage)
    ↓
Save Catch (Firestore)
    ↓  (if offline)
    ↓
Save to AsyncStorage
    ↓
Sync when online
```

### AI Forecast Flow

```
User Requests Forecast
    ↓
Check Premium Status
    ↓
Fetch Weather Conditions
    ↓
Get User's Catch History
    ↓
Build AI Prompt
    ↓
Call AI API (Claude/OpenAI)
    ↓
Parse Response
    ↓
Display Forecast
```

## Services

### Firebase Services

**Authentication** (`auth.service.ts`)
- Sign up with email/password
- Sign in with email/password
- Sign out
- Password reset
- User profile management

**Catch Service** (`catch.service.ts`)
- Create catch
- Get user catches
- Update catch
- Delete catch
- Upload photos
- Offline sync

**Lure Service** (`lure.service.ts`)
- Get all lures
- Get lure by ID
- Search lures
- User lure notes (CRUD)

### Weather Service

**Functions:**
- `getWeatherConditions()`: Complete weather data
- `getCurrentWeather()`: Current conditions
- `getHourlyForecast()`: Next 24 hours
- `getSunMoonData()`: Astronomical data
- `calculateSolunarData()`: Fishing activity periods

**Data Sources:**
- OpenWeather API: Weather data
- SunCalc library: Sun/moon calculations
- Custom algorithms: Solunar ratings

### AI Service

**Functions:**
- `generateFishingForecast()`: AI-powered forecast
- `detectPatterns()`: Pattern detection in catches
- `generateCatchAnalytics()`: Statistical analysis

**AI Integration:**
- Prompt engineering for fishing context
- Response parsing and structuring
- Confidence scoring
- Error handling and fallbacks

## Offline Support

### Strategy

1. **Optimistic Updates**: Update UI immediately, sync later
2. **Local Storage**: AsyncStorage for pending operations
3. **Queue System**: FIFO queue for offline actions
4. **Conflict Resolution**: Last-write-wins for conflicts

### Implementation

**Offline Catch Storage:**
```typescript
interface OfflineCatch {
  offlineId: string;
  data: CatchFormData;
  timestamp: Date;
  syncStatus: 'pending' | 'syncing' | 'failed';
}
```

**Sync Process:**
1. Detect network connection (NetInfo)
2. Retrieve offline queue from AsyncStorage
3. Process each item sequentially
4. Handle failures with retry logic
5. Update sync status
6. Clear queue on success

### Network Detection

```typescript
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncOfflineData();
  }
});
```

## Performance Optimization

### React Native Best Practices

1. **FlatList for Long Lists**: Efficient rendering of catch lists
2. **Image Optimization**: Resize/compress before upload
3. **Lazy Loading**: Load screens on-demand
4. **Memoization**: React.memo for expensive components
5. **Debouncing**: Search inputs and API calls

### Bundle Optimization

1. **Code Splitting**: Separate vendor and app bundles
2. **Tree Shaking**: Remove unused code
3. **Image Assets**: Optimize sizes and formats
4. **Font Subsetting**: Include only used characters

### API Optimization

1. **Caching**: Cache weather data (15-minute TTL)
2. **Pagination**: Load catches in batches
3. **Batch Requests**: Combine multiple API calls
4. **Request Debouncing**: Limit API call frequency

### Memory Management

1. **Image Cleanup**: Clear cached images
2. **Subscription Cleanup**: Unsubscribe from listeners
3. **Event Listeners**: Remove on unmount
4. **Large Lists**: Use pagination/windowing

## Security

### Data Protection

1. **Firebase Security Rules**: Restrict database access
2. **API Key Protection**: Environment variables
3. **Input Validation**: Sanitize user inputs
4. **Secure Storage**: Encrypted local storage

### Authentication

1. **JWT Tokens**: Firebase Auth tokens
2. **Token Refresh**: Automatic token renewal
3. **Session Management**: Secure session handling
4. **Password Requirements**: Strong password policy

## Testing Strategy

### Unit Tests
- Component rendering
- Business logic functions
- Service methods
- Utility functions

### Integration Tests
- Navigation flows
- API integrations
- Database operations
- Authentication flows

### E2E Tests
- Critical user journeys
- Cross-platform compatibility
- Offline mode functionality

## Deployment

### Build Process

**iOS:**
1. Configure signing certificates
2. Update version/build number
3. Archive for distribution
4. Upload to App Store Connect
5. Submit for review

**Android:**
1. Generate signed APK/AAB
2. Update version code/name
3. Build release bundle
4. Upload to Play Console
5. Submit for review

### CI/CD Pipeline

1. **Code Push**: Trigger on git push
2. **Lint & Type Check**: ESLint + TypeScript
3. **Unit Tests**: Jest test suite
4. **Build**: iOS + Android builds
5. **Deploy**: Staging → Production

## Future Improvements

### Planned Features
1. Real-time catch sharing with friends
2. Tournament mode
3. Species identification with ML
4. Voice logging
5. Apple Watch / Wear OS support

### Technical Debt
1. Implement comprehensive test coverage
2. Add crash reporting (Sentry)
3. Performance monitoring (Firebase Performance)
4. Analytics integration (Mixpanel/Amplitude)
5. A/B testing framework

---

For questions about architecture decisions, contact the development team at dev@yeetlures.com.
