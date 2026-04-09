import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';

const THEME = {
  primary: '#10B981',
  background: '#0F0F0F',
  text: '#FFFFFF',
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'FinTrackr (Dev)' : 'FinTrackr',
  slug: 'FinTrackr',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'fintrackr',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.vikash.fintrackr'
  },
  android: {
    adaptiveIcon: {
      backgroundColor: THEME.background,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    package: 'com.vikash.fintrackr',
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: THEME.background,
        dark: {
          backgroundColor: THEME.background,
        },
      },
    ],
    '@react-native-community/datetimepicker',
    'expo-sqlite'
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "bbe19823-750e-4ee2-b43e-5fd7610238c6"
    }
  }
});

