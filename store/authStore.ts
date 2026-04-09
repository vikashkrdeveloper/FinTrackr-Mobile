import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Logger } from '../lib/logger';

interface AuthState {
  session: Session | null;
  user: User | null;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initialized: false,
  setSession: (session) => {
    set({ session, user: session?.user ?? null, initialized: true });
    Logger.info('Auth session updated', { hasSession: !!session });
  },
  setUser: (user) => set({ user }),
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null, user: null });
      Logger.success('User signed out successfully');
    } catch (error) {
      Logger.error('Sign out failed', error);
    }
  },
}));

// Initialize listener
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setSession(session);
});
