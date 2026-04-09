import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TOKENS } from '../../theme/tokens';
import { useAppTheme } from '../../hooks/useAppTheme';

export const NotificationBell = () => {
  const router = useRouter();
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.surface }]}
      onPress={() => router.push('/notifications' as any)}
    >
      <MaterialCommunityIcons name="bell-outline" size={24} color={theme.primary} />
      <View style={[styles.badge, { backgroundColor: theme.accent }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  }
});
