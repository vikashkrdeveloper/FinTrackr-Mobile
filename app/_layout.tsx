import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Logger } from '../lib/logger';
import { useAppTheme } from '../hooks/useAppTheme';
import { LoadingScreen } from '../components/ui/LoadingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

/**
 * --- Production-Grade Global Logging & Error Handling ---
 */

// 1. Override Global Console to capture library logs
if (__DEV__ && !(global as any).__LOGGER_INITIALIZED__) {
  (global as any).__LOGGER_INITIALIZED__ = true;
  
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    Logger.info('Console Log', args);
    originalLog(...args);
  };

  console.warn = (...args) => {
    Logger.warn('Console Warn', args);
    originalWarn(...args);
  };

  console.error = (...args) => {
    Logger.error('Console Error', args);
    originalError(...args);
  };
}

// 2. Global JS Error Catching
const errorUtils = (global as any).ErrorUtils;
if (errorUtils) {
  const defaultHandler = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler((error: any, isFatal: boolean) => {
    Logger.error('Global JS Error', error, { isFatal });
    if (defaultHandler) {
      defaultHandler(error, isFatal);
    }
  });
}

// Keep the native splash screen until navigation is ready
SplashScreen.preventAutoHideAsync();

/**
 * INTERNAL COMPONENT: RootNavigationController
 * This component handles all Auth-sync redirects and UI Settling.
 * It is rendered as a child of RootLayout's ThemeProvider to 
 * ensure the Navigator (Stack) is fully available in the context.
 */
function RootNavigationController({ onSettled }: { onSettled: (settled: boolean) => void }) {
  const { session, initialized } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [isNavSettled, setIsNavSettled] = useState(false);

  useEffect(() => {
    // CRITICAL: We wait for the Root Navigator state to be ready
    if (!initialized || !rootNavigationState?.key) return;

    const inAuthGroup = (segments as any).includes('(auth)') || 
                        (segments as any).includes('login') || 
                        (segments as any).includes('register');
    const isAtRoot = (segments as any).length === 0;

    // Use requestAnimationFrame to ensure the navigator is fully mounted 
    // before attempting replaces. This is the safest way in Expo Router.
    const redirectTask = requestAnimationFrame(() => {
      if (!session && !inAuthGroup) {
        router.replace('/(auth)/login' as any);
      } else if (session && (inAuthGroup || isAtRoot)) {
        router.replace('/(tabs)' as any);
      } else {
        // Once the segments align with session state, hide splash and settling UI
        if (!isNavSettled) {
          setIsNavSettled(true);
          onSettled(true);
          SplashScreen.hideAsync();
        }
      }
    });

    return () => cancelAnimationFrame(redirectTask);
  }, [session, initialized, segments, router, isNavSettled, rootNavigationState?.key]);

  return null;
}

export default function RootLayout() {
  const { isDark, theme } = useAppTheme();
  const { initialized } = useAuthStore();
  const [isControllerSettled, setIsControllerSettled] = useState(false);

  const navTheme = useMemo(() => ({
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.surface,
      text: theme.primary,
      border: theme.surfaceLighter,
      notification: theme.accent,
    },
  }), [isDark, theme]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        
        {/* The Navigator (Stack) is always rendered to avoid "Not Mounted" errors */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen 
            name="add-transaction" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Add Transaction',
              headerStyle: { backgroundColor: theme.background },
              headerTintColor: theme.primary,
            }} 
          />
        </Stack>

        {/* This controller handles redirection in a stable context */}
        <RootNavigationController onSettled={setIsControllerSettled} />

        {/* Global Loading Overlay */}
        {(!initialized || !isControllerSettled) && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 999 }]}>
            <LoadingScreen />
          </View>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
