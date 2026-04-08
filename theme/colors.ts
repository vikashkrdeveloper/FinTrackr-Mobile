export const colors = {
  light: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    primary: '#4F46E5', // Indigo
    primaryLight: '#818CF8', // Indigo lighter
    success: '#10B981', // Emerald
    danger: '#EF4444', // Red
    border: '#E5E7EB',
    gradientStart: '#4F46E5',
    gradientEnd: '#818CF8',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#4F46E5',
    tabBackground: '#FFFFFF',
  },
  dark: {
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#6366F1', // Indigo
    primaryLight: '#818CF8',
    success: '#34D399', // Emerald
    danger: '#F87171', // Red
    border: '#374151',
    gradientStart: '#4F46E5',
    gradientEnd: '#6366F1',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#818CF8',
    tabBackground: '#1F2937',
  },
};

export type Theme = 'light' | 'dark';
