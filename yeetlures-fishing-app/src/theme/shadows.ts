/**
 * YeetLures Fishing Companion - Shadow System
 * Light drop shadows: 10-18% black opacity, 12-24px blur
 */

import { Platform } from 'react-native';

export const shadows = {
  none: {},

  light: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: {
      elevation: 2,
    },
  }),

  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 16,
    },
    android: {
      elevation: 4,
    },
  }),

  strong: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 20,
    },
    android: {
      elevation: 8,
    },
  }),

  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
    },
    android: {
      elevation: 3,
    },
  }),
};

export type Shadows = typeof shadows;
