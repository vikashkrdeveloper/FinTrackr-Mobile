import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../theme/tokens';
import { useAppTheme } from '../hooks/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Monthly Goal Reached!',
    message: 'Congratulations! You kept your expenses under $500 this month.',
    time: '2 hours ago',
    icon: 'trophy-outline',
    color: '#F59E0B'
  },
  {
    id: '2',
    title: 'Salary Credited',
    message: 'Your salary for October has been successfully processed.',
    time: '1 day ago',
    icon: 'cash-check',
    color: '#10B981'
  },
  {
    id: '3',
    title: 'Budget Alert',
    message: 'You have spent 80% of your Shopping budget.',
    time: '2 days ago',
    icon: 'alert-circle-outline',
    color: '#EF4444'
  }
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Screen options={{ 
        headerShown: true, 
        title: 'Notifications',
        headerStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        headerTintColor: theme.primary,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 8 }}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.primary} />
          </TouchableOpacity>
        )
      }} />

      <FlatList
        data={MOCK_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.notiCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
              <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={styles.textBox}>
              <View style={styles.notiHeader}>
                <Text style={[styles.notiTitle, { color: theme.primary }]}>{item.title}</Text>
                <Text style={[styles.notiTime, { color: theme.secondary }]}>{item.time}</Text>
              </View>
              <Text style={[styles.notiMessage, { color: theme.secondary }]}>{item.message}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: TOKENS.spacing.xl,
  },
  notiCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textBox: {
    flex: 1,
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notiTitle: {
    ...TOKENS.typography.body,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  notiTime: {
    ...TOKENS.typography.caption,
    fontSize: 10,
  },
  notiMessage: {
    ...TOKENS.typography.caption,
    lineHeight: 16,
  }
});
