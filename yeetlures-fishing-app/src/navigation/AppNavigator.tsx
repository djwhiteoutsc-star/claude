/**
 * App Navigation Structure
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../theme';

// Import screens (will create these next)
import { HomeScreen } from '../screens/HomeScreen';
import { CatchListScreen } from '../screens/CatchListScreen';
import { AddCatchScreen } from '../screens/AddCatchScreen';
import { LureLibraryScreen } from '../screens/LureLibraryScreen';
import { LureDetailScreen } from '../screens/LureDetailScreen';
import { WeatherDashboardScreen } from '../screens/WeatherDashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { AIForecasterScreen } from '../screens/AIForecasterScreen';
import { PremiumUpgradeScreen } from '../screens/PremiumUpgradeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.white,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
      },
      headerTintColor: theme.colors.text.primary,
      headerTitleStyle: {
        fontWeight: theme.typography.fontWeight.semiBold,
      },
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Dashboard' }} />
    <Stack.Screen name="AIForecaster" component={AIForecasterScreen} options={{ title: 'Fishing Forecast' }} />
  </Stack.Navigator>
);

// Catch Stack
const CatchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="CatchList" component={CatchListScreen} options={{ title: 'Catch Log' }} />
    <Stack.Screen name="AddCatch" component={AddCatchScreen} options={{ title: 'Log New Catch' }} />
  </Stack.Navigator>
);

// Lure Stack
const LureStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="LureLibrary" component={LureLibraryScreen} options={{ title: 'Lure Library' }} />
    <Stack.Screen name="LureDetail" component={LureDetailScreen} options={{ title: 'Lure Details' }} />
  </Stack.Navigator>
);

// Weather Stack
const WeatherStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="WeatherMain" component={WeatherDashboardScreen} options={{ title: 'Conditions' }} />
  </Stack.Navigator>
);

// Profile Stack
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
    <Stack.Screen name="PremiumUpgrade" component={PremiumUpgradeScreen} options={{ title: 'Go Premium' }} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.accent.primary,
      tabBarInactiveTintColor: theme.colors.text.tertiary,
      tabBarStyle: {
        backgroundColor: theme.colors.white,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border.light,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: theme.typography.fontSize.caption,
        fontWeight: theme.typography.fontWeight.medium,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
      }}
    />
    <Tab.Screen
      name="Catches"
      component={CatchStack}
      options={{
        tabBarLabel: 'Catches',
        tabBarIcon: ({ color }) => <TabIcon name="fish" color={color} />,
      }}
    />
    <Tab.Screen
      name="Lures"
      component={LureStack}
      options={{
        tabBarLabel: 'Lures',
        tabBarIcon: ({ color }) => <TabIcon name="lure" color={color} />,
      }}
    />
    <Tab.Screen
      name="Weather"
      component={WeatherStack}
      options={{
        tabBarLabel: 'Weather',
        tabBarIcon: ({ color }) => <TabIcon name="cloud" color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => <TabIcon name="user" color={color} />,
      }}
    />
  </Tab.Navigator>
);

// Simple tab icon placeholder
const TabIcon = ({ name, color }: { name: string; color: string }) => (
  <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
);

// Root Navigator
const RootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Main" component={MainTabs} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};
