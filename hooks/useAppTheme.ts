import { useColorScheme } from 'react-native';
import { useExpenseStore } from '../store/expenseStore';
import { TOKENS } from '../theme/tokens';

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const userPreference = useExpenseStore((state) => state.theme);

  const isDark = 
    userPreference === 'system' 
      ? (systemColorScheme ?? 'dark') === 'dark' 
      : userPreference === 'dark';

  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;

  return {
    isDark,
    theme,
    userPreference,
  };
}
