/**
 * YeetLures Fishing Companion
 * Main App Component
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { theme } from './src/theme';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.white}
      />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
