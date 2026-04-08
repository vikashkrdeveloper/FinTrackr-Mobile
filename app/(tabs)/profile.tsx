import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useExpenseStore } from '../../store/expenseStore';
import { useAuthStore } from '../../store/authStore';
import { TOKENS } from '../../theme/tokens';

export default function ProfileScreen() {
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;
  
  const transactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const { user, signOut } = useAuthStore();

  const fullName = user?.user_metadata?.full_name || 'FinTrackr User';
  const email = user?.email || '';

  const categoryStats = useMemo(() => {
    const stats: Record<string, { amount: number; color: string; name: string }> = {};
    const expenses = transactions.filter(t => t.type === 'expense');
    
    let totalExpenses = 0;
    
    expenses.forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      const catName = cat ? cat.name : 'Unknown';
      const catColor = cat ? cat.color : theme.secondary;

      if (!stats[t.categoryId]) {
        stats[t.categoryId] = { amount: 0, color: catColor, name: catName };
      }

      stats[t.categoryId].amount += t.amount;
      totalExpenses += t.amount;
    });

    return Object.values(stats)
      .map(item => ({
        ...item,
        percentage: totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, theme.secondary]);

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* User Info Header */}
      <View style={[styles.headerCard, { backgroundColor: theme.surface }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.accent }]}>
          <Text style={styles.avatarText}>{fullName.charAt(0)}</Text>
        </View>
        <View style={styles.headerDetails}>
          <Text style={[styles.userName, { color: theme.primary }]}>{fullName}</Text>
          <Text style={[styles.userEmail, { color: theme.secondary }]}>{email}</Text>
        </View>
        <Link href={"/edit-profile" as any} asChild>
          <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.surfaceLighter }]}>
            <MaterialCommunityIcons name="pencil" size={20} color={theme.primary} />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Spending Analytics</Text>

        {categoryStats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: theme.secondary }]}>
              No expenses recorded yet.
            </Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            {categoryStats.map((item: any, index: number) => (
              <View 
                key={item.name} 
                style={[
                  styles.statRow, 
                  index < categoryStats.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.surfaceLighter }
                ]}
              >
                <View style={styles.statDetails}>
                  <Text style={[styles.catName, { color: theme.primary }]}>{item.name}</Text>
                  <Text style={[styles.catAmount, { color: theme.primary }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBackground, { backgroundColor: theme.surfaceLighter }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${item.percentage}%`, backgroundColor: item.color }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.percentage, { color: theme.secondary }]}>
                    {item.percentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Global Actions */}
        <View style={{ marginTop: 32 }}>
          <TouchableOpacity 
            style={[styles.actionRow, { borderBottomWidth: 1, borderBottomColor: theme.surfaceLighter }]}
            onPress={signOut}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${theme.error}20` }]}>
              <MaterialCommunityIcons name="logout" size={22} color={theme.error} />
            </View>
            <Text style={[styles.actionLabel, { color: theme.error }]}>Log Out</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: TOKENS.spacing.xl,
    padding: TOKENS.spacing.xl,
    borderRadius: TOKENS.radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: TOKENS.spacing.lg,
  },
  avatarText: {
    color: '#000000',
    fontSize: 24,
    fontWeight: '700',
  },
  headerDetails: {
    flex: 1,
  },
  userName: {
    ...TOKENS.typography.subheading,
    fontWeight: '700',
  },
  userEmail: {
    ...TOKENS.typography.caption,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: TOKENS.spacing.xl,
  },
  sectionTitle: {
    ...TOKENS.typography.subheading,
    marginBottom: TOKENS.spacing.lg,
  },
  card: {
    borderRadius: TOKENS.radius.lg,
    padding: TOKENS.spacing.xl,
  },
  statRow: {
    paddingVertical: TOKENS.spacing.lg,
  },
  statDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: TOKENS.spacing.sm,
  },
  catName: {
    ...TOKENS.typography.body,
    fontWeight: '600',
  },
  catAmount: {
    ...TOKENS.typography.body,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: TOKENS.spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    ...TOKENS.typography.caption,
    width: 40,
    textAlign: 'right',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    ...TOKENS.typography.body,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionLabel: {
    flex: 1,
    ...TOKENS.typography.body,
    fontWeight: '600',
  },
});
