import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useExpenseStore } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';
import { GradientCard } from '../../components/transactions/GradientCard';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { SummaryCards } from '../../components/transactions/SummaryCards';
import { ExpenseChart } from '../../components/transactions/ExpenseChart';
import { FloatingActionButton } from '../../components/ui/FloatingActionButton';
import { CategoryChip } from '../../components/ui/CategoryChip';
import { NotificationBell } from '../../components/ui/NotificationBell';
import { useAuthStore } from '../../store/authStore';
import { useAppTheme } from '../../hooks/useAppTheme';

import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  
  const { user } = useAuthStore();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  const rawTransactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const deleteTransaction = useExpenseStore((state) => state.deleteTransaction);

  const transactions = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return rawTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });
  }, [rawTransactions]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    if (!selectedCategoryId) return transactions;
    return transactions.filter(t => t.categoryId === selectedCategoryId);
  }, [transactions, selectedCategoryId]);

  // Limit to max 12 for Home Screen
  const displayedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, 12);
  }, [filteredTransactions]);

  const hasRemainingTransactions = filteredTransactions.length > 12;

  const handleViewAll = () => {
    router.replace('/(tabs)/transactions' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={displayedTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.topHeader}>
              <View>
                <Text style={[styles.welcomeText, { color: theme.secondary }]}>Welcome back,</Text>
                <Text style={[styles.userName, { color: theme.primary }]}>{firstName}</Text>
              </View>
              <NotificationBell />
            </View>

            <GradientCard />
            <SummaryCards />
            <ExpenseChart />
            
            {/* Category Filter Pipeline */}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <CategoryChip
                  category={{ id: 'all', name: 'All', icon: 'view-grid', color: theme.primary }}
                  isSelected={selectedCategoryId === null}
                  onPress={() => setSelectedCategoryId(null)}
                />
                {categories.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    isSelected={selectedCategoryId === cat.id}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  />
                ))}
                <View style={{ width: TOKENS.spacing.xl }} />
              </ScrollView>
            </View>

            <View style={styles.recentHeader}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                {selectedCategoryId ? 'Filtered Transactions' : 'Recent Transactions'}
              </Text>
              {hasRemainingTransactions && (
                <TouchableOpacity onPress={handleViewAll} style={styles.viewAllBtn}>
                  <Text style={[styles.viewAllText, { color: theme.accent }]}>View All</Text>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={theme.accent} />
                </TouchableOpacity>
              )}
            </View>
            
            {displayedTransactions.length === 0 && (
              <View style={styles.emptyState}>
                <View style={[styles.emptyIconContainer, { backgroundColor: theme.surfaceLighter }]}>
                  <MaterialCommunityIcons name="receipt-text-plus-outline" size={48} color={theme.secondary} />
                </View>
                <Text style={[styles.emptyStateTitle, { color: theme.primary }]}>
                  No Transactions Yet
                </Text>
                <Text style={[styles.emptyStateText, { color: theme.secondary }]}>
                  Start your financial journey by adding your first income or expense today.
                </Text>
                <TouchableOpacity 
                  style={[styles.emptyStateBtn, { backgroundColor: theme.accent }]}
                  onPress={() => router.push('/add-transaction' as any)}
                >
                  <Text style={[styles.emptyStateBtnText, { color: theme.background }]}>Add Transaction</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onDelete={() => deleteTransaction(item.id)} 
          />
        )}
      />
      <FloatingActionButton onPress={() => router.push('/add-transaction' as any)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: TOKENS.spacing.xl,
    paddingBottom: 100, // padding for tabs + FAB
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TOKENS.spacing.xl,
    paddingTop: TOKENS.spacing.md,
  },
  welcomeText: {
    ...TOKENS.typography.caption,
  },
  userName: {
    ...TOKENS.typography.subheading,
    fontWeight: '700',
  },
  filterContainer: {
    marginHorizontal: -TOKENS.spacing.xl, // Bleed scroll edge
    marginBottom: TOKENS.spacing.lg,
  },
  filterScroll: {
    paddingHorizontal: TOKENS.spacing.xl,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: TOKENS.spacing.xs,
    marginTop: TOKENS.spacing.lg,
  },
  sectionTitle: {
    ...TOKENS.typography.subheading,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    ...TOKENS.typography.caption,
    fontWeight: '700',
  },
  emptyState: {
    padding: 20,
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: TOKENS.spacing.lg,
  },
  emptyStateTitle: {
    ...TOKENS.typography.heading,
    fontSize: 20,
    marginBottom: TOKENS.spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...TOKENS.typography.body,
    textAlign: 'center',
    marginBottom: TOKENS.spacing.xl,
    paddingHorizontal: TOKENS.spacing.xl,
    opacity: 0.7,
  },
  emptyStateBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: TOKENS.radius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateBtnText: {
    ...TOKENS.typography.body,
    fontWeight: '700',
  },
});
