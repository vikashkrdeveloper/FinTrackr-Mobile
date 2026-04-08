import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../../theme/tokens';
import { useExpenseStore } from '../../store/expenseStore';

export const GradientCard = () => {
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;
  
  const balance = useExpenseStore((state) => state.getBalance());
  
  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <LinearGradient
      colors={theme.cardGradient as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.bankName}>FinTrackr</Text>
        <MaterialCommunityIcons name="integrated-circuit-chip" size={28} color="rgba(0,0,0,0.6)" />
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.amount}>
          {balance < 0 ? '-' : ''}{formatCurrency(balance)}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.cardNumber}>**** **** **** 8821</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: TOKENS.radius.lg,
    padding: TOKENS.spacing.xl,
    justifyContent: 'space-between',
    marginBottom: TOKENS.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    ...TOKENS.typography.subheading,
    color: '#000000',
    opacity: 0.8,
  },
  balanceContainer: {
    alignItems: 'flex-start',
  },
  label: {
    ...TOKENS.typography.caption,
    color: '#000000',
    opacity: 0.6,
    marginBottom: TOKENS.spacing.xs,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cardNumber: {
    ...TOKENS.typography.body,
    fontWeight: '600',
    color: '#000000',
    opacity: 0.8,
    letterSpacing: 2,
  }
});
