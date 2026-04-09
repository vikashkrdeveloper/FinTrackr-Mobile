import 'react-native-url-polyfill/auto';
import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';
import { Logger } from './logger';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// It is significantly more stable than 'AsyncStorage' for background auth tasks.
const store = typeof localStorage !== 'undefined' ? localStorage : undefined;

if (!store) {
  Logger.warn('Storage was not initialized correctly. Auth persistence may be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: store,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Log any auth state changes for debugging
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    Logger.success('User signed in', { userId: session?.user.id });
  } else if (event === 'SIGNED_OUT') {
    Logger.info('User signed out');
  } else if (event === 'TOKEN_REFRESHED') {
    Logger.info('Auth token refreshed');
  } else if (event === 'USER_UPDATED') {
    Logger.debug('User profile updated');
  }
});
