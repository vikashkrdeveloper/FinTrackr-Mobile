import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../../theme/tokens';
import { useExpenseStore } from '../../store/expenseStore';
import { useAppTheme } from '../../hooks/useAppTheme';

export const SummaryCards = () => {
  const { theme } = useAppTheme();

  const income = useExpenseStore(state => state.getCurrentMonthIncome());
  const expense = useExpenseStore(state => state.getCurrentMonthExpense());

  const formatCurrency = (amount: number) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.accent}20` }]}>
          <MaterialCommunityIcons name="arrow-down" size={20} color={theme.accent} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: theme.secondary }]}>Income</Text>
          <Text style={[styles.amount, { color: theme.primary }]} adjustsFontSizeToFit numberOfLines={1}>
            {formatCurrency(income)}
          </Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.error}20` }]}>
          <MaterialCommunityIcons name="arrow-up" size={20} color={theme.error} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: theme.secondary }]}>Expense</Text>
          <Text style={[styles.amount, { color: theme.primary }]} adjustsFontSizeToFit numberOfLines={1}>
            {formatCurrency(expense)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: TOKENS.spacing.lg,
    // paddingHorizontal: TOKENS.spacing.xl,
    gap: TOKENS.spacing.md,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: TOKENS.spacing.lg,
    borderRadius: TOKENS.radius.lg,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: TOKENS.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...TOKENS.typography.caption,
    marginBottom: 2,
  },
  amount: {
    ...TOKENS.typography.body,
    fontWeight: '700',
  },
});
