/**
 * YeetLures Fishing Companion - Color System
 * Premium, clean, modern outdoor aesthetic
 */

export const colors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F7F7F7',
  },

  // Text colors
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    tertiary: '#8A8A8A',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },

  // YeetLures brand accent colors
  accent: {
    primary: '#2C6E49',      // Deep forest green
    secondary: '#4C9F70',    // Fresh outdoor green
    tertiary: '#87C5A4',     // Light mint
    warm: '#D4965B',         // Sunset orange/copper
    cool: '#5A8AA6',         // Water blue
  },

  // Utility colors
  utility: {
    success: '#4C9F70',
    warning: '#E8A75D',
    error: '#D64545',
    info: '#5A8AA6',
  },

  // Borders and dividers
  border: {
    light: '#E6E6E6',
    medium: '#D1D1D1',
    dark: '#BDBDBD',
  },

  // Shadow colors (for opacity usage)
  shadow: {
    light: 'rgba(0, 0, 0, 0.06)',
    medium: 'rgba(0, 0, 0, 0.10)',
    strong: 'rgba(0, 0, 0, 0.18)',
  },

  // Premium feature indicators
  premium: {
    gold: '#D4A574',
    goldLight: '#E8C9A0',
  },
};

export type Colors = typeof colors;
