import { colors } from './colors';

export const TOKENS = {
  colors: {
    dark: {
      background: colors.dark.background,
      surface: colors.dark.surface,
      surfaceLighter: colors.dark.surfaceLighter,
      primary: colors.dark.textPrimary,
      secondary: colors.dark.textSecondary,
      accent: colors.brand.teal,
      error: colors.dark.error,
      cardGradient: [colors.brand.tealDark, colors.brand.teal] as [string, string],
    },
    light: {
      background: colors.light.background,
      surface: colors.light.surface,
      surfaceLighter: colors.light.surfaceLighter,
      primary: colors.light.textPrimary,
      secondary: colors.light.textSecondary,
      accent: colors.brand.teal,
      error: colors.light.error,
      cardGradient: [colors.brand.teal, colors.brand.tealLight] as [string, string],
    }
  },
  typography: {
    heading: { fontSize: 24, fontWeight: '700' as const },
    subheading: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 14, fontWeight: '400' as const },
    caption: { fontSize: 12, fontWeight: '400' as const }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 24,
    round: 100,
  }
};
