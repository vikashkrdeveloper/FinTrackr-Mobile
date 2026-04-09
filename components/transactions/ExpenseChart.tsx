import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useExpenseStore } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';
import { useAppTheme } from '../../hooks/useAppTheme';

export const ExpenseChart = () => {
  const { theme } = useAppTheme();

  const rawTransactions = useExpenseStore(state => state.transactions);
  const categories = useExpenseStore(state => state.categories);

  const { transactions, currentMonthExpense } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const monthlyItems = rawTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });

    const totalExpense = monthlyItems
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { transactions: monthlyItems, currentMonthExpense: totalExpense };
  }, [rawTransactions]);

  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryTotals[t.categoryId] = (categoryTotals[t.categoryId] || 0) + t.amount;
    });

    return Object.entries(categoryTotals).map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId);
      return {
        value: amount,
        color: cat ? cat.color : theme.secondary,
      };
    });
  }, [transactions, categories, theme.secondary]);

  const defaultData = [{ value: 1, color: theme.surfaceLighter }];

  const formatCurrencyCompact = (amount: number) => `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <Text style={[styles.title, { color: theme.primary }]}>Monthly Breakdown</Text>
      <View style={styles.chartWrapper}>
        <PieChart
          data={chartData.length > 0 ? chartData : defaultData}
          donut
          radius={90}
          innerRadius={65}
          innerCircleColor={theme.surface}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={[styles.centerAmount, { color: theme.primary }]}>
                {formatCurrencyCompact(currentMonthExpense)}
              </Text>
              <Text style={[styles.centerSubtitle, { color: theme.secondary }]}>Total</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginHorizontal: TOKENS.spacing.xl,
    padding: TOKENS.spacing.xl,
    borderRadius: TOKENS.radius.lg,
    marginBottom: TOKENS.spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...TOKENS.typography.subheading,
    alignSelf: 'flex-start',
    marginBottom: TOKENS.spacing.lg,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAmount: {
    ...TOKENS.typography.subheading,
    fontWeight: '700',
  },
  centerSubtitle: {
    ...TOKENS.typography.caption,
  },
});
