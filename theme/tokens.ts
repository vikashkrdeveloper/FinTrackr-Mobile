export const TOKENS = {
  colors: {
    dark: {
      background: '#000000',
      surface: '#1A1A1A',
      surfaceLighter: '#2A2A2A',
      primary: '#FFFFFF',
      secondary: '#A0A0A0',
      accent: '#50BFA5',
      error: '#FF4B4B',
      cardGradient: ['#D9E4DD', '#50BFA5'],
    },
    light: {
      background: '#F8F9FA',
      surface: '#FFFFFF',
      surfaceLighter: '#F3F4F6',
      primary: '#111827',
      secondary: '#6B7280',
      accent: '#50BFA5',
      error: '#EF4444',
      cardGradient: ['#E6EFEA', '#6FD2BA'],
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
