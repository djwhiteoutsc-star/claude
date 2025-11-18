/**
 * YeetLures Fishing Companion - Typography System
 * Modern typography: Inter, Geist, or SF Pro
 */

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',  // Falls back to SF Pro on iOS, Roboto on Android
    semiBold: 'System',
    bold: 'System',
  },

  // Font sizes
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    bodySmall: 15,
    caption: 13,
    tiny: 11,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export type Typography = typeof typography;
