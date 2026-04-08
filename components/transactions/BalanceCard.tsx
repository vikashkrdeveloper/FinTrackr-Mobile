import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { useExpenseStore } from '../../store/expenseStore';

export const BalanceCard = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = colors[colorScheme];
  
  const balance = useExpenseStore((state) => state.getBalance());
  const income = useExpenseStore((state) => state.getTotalIncome());
  const expense = useExpenseStore((state) => state.getTotalExpense());

  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <LinearGradient
      colors={[theme.gradientStart, theme.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topSection}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.balance}>{balance < 0 ? '-' : ''}{formatCurrency(balance)}</Text>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.metric}>
          <View style={styles.metricLabelContainer}>
            <View style={[styles.dot, { backgroundColor: '#34D399' }]} />
            <Text style={styles.metricLabel}>Income</Text>
          </View>
          <Text style={styles.metricValue}>{formatCurrency(income)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metric}>
          <View style={styles.metricLabelContainer}>
            <View style={[styles.dot, { backgroundColor: '#F87171' }]} />
            <Text style={styles.metricLabel}>Expenses</Text>
          </View>
          <Text style={styles.metricValue}>{formatCurrency(expense)}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  label: {
    color: '#E0E7FF', // Light indigo text
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
  },
  metric: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  metricLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  metricLabel: {
    color: '#E0E7FF',
    fontSize: 13,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
