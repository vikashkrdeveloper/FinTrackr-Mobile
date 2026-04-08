import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, ScrollView } from 'react-native';
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

export default function HomeScreen() {
  const router = useRouter();
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;
  
  const { user } = useAuthStore();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'User';

  const transactions = useExpenseStore((state) => state.getCurrentMonthTransactions());
  const categories = useExpenseStore((state) => state.categories);
  const deleteTransaction = useExpenseStore((state) => state.deleteTransaction);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const displayedTransactions = useMemo(() => {
    if (!selectedCategoryId) return transactions;
    return transactions.filter(t => t.categoryId === selectedCategoryId);
  }, [transactions, selectedCategoryId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
            </View>
            
            {displayedTransactions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: theme.secondary }]}>
                  No transactions found. Add one!
                </Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onLongPress={() => deleteTransaction(item.id)} 
          />
        )}
      />
      <FloatingActionButton onPress={() => router.push('/add-transaction' as any)} />
    </View>
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
    marginBottom: TOKENS.spacing.lg,
  },
  sectionTitle: {
    ...TOKENS.typography.subheading,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...TOKENS.typography.body,
    textAlign: 'center',
  },
});
