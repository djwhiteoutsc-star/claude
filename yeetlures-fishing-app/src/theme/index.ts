/**
 * YeetLures Fishing Companion - Theme Index
 * Central export for all theme tokens
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = {
  colors,
  spacing,
  typography,
  radius,
  shadows,

  // Animation timings
  animation: {
    fast: 120,
    normal: 180,
    slow: 250,
  },

  // Screen dimensions (design frame)
  screen: {
    width: 430,
    height: 932,
  },
};

export type Theme = typeof theme;

export { colors, spacing, typography, radius, shadows };
