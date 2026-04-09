import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../../theme/tokens';
import { useExpenseStore } from '../../store/expenseStore';
import { useAppTheme } from '../../hooks/useAppTheme';

export const GradientCard = () => {
  const { isDark, theme } = useAppTheme();
  
  const balance = useExpenseStore((state) => state.getBalance());
  
  const formatCurrency = (amount: number) => {
    return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // On the card, we want high contrast. If it's a dark gradient, use white.
  const textColor = '#FFFFFF'; 

  return (
    <LinearGradient
      colors={theme.cardGradient as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={[styles.bankName, { color: textColor }]}>FinTrackr</Text>
        <MaterialCommunityIcons name="integrated-circuit-chip" size={28} color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"} />
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={[styles.label, { color: textColor }]}>Total Balance</Text>
        <Text style={[styles.amount, { color: textColor }]}>
          {balance < 0 ? '-' : ''}{formatCurrency(balance)}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.cardNumber, { color: textColor }]}>**** **** **** 8821</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankName: {
    ...TOKENS.typography.subheading,
    opacity: 0.9,
  },
  balanceContainer: {
    alignItems: 'flex-start',
  },
  label: {
    ...TOKENS.typography.caption,
    opacity: 0.8,
    marginBottom: TOKENS.spacing.xs,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cardNumber: {
    ...TOKENS.typography.body,
    fontWeight: '600',
    opacity: 0.9,
    letterSpacing: 2,
  }
});
