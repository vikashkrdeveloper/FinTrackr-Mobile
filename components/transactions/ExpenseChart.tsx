import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useExpenseStore } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';

export const ExpenseChart = () => {
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;

  const transactions = useExpenseStore(state => state.getCurrentMonthTransactions());
  const categories = useExpenseStore(state => state.categories);
  const currentMonthExpense = useExpenseStore(state => state.getCurrentMonthExpense());

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
    marginHorizontal: TOKENS.spacing.xl,
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
