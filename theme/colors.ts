/**
 * Standardized Color System for FinTrackr
 * defines the core palette used across the tokens and components.
 */

export const colors = {
  // Brand & Semantic Colors
  brand: {
    teal: '#50BFA5',
    tealDark: '#3DA58D',
    tealLight: '#6FD2BA',
  },
  
  // Light Palette
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceLighter: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    error: '#EF4444',
  },

  // Dark Palette (True Dark Aesthetic)
  dark: {
    background: '#000000',
    surface: '#1A1A1A',
    surfaceLighter: '#2A2A2A',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    error: '#FF4B4B',
  }
};

export type Theme = 'light' | 'dark';
