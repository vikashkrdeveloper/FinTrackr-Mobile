import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useExpenseStore, Transaction } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';
import { useAppTheme } from '../../hooks/useAppTheme';

interface Props {
  transaction: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
}

export const TransactionItem = ({ transaction, onPress, onLongPress }: Props) => {
  const { theme } = useAppTheme();
  
  const categories = useExpenseStore((state) => state.categories);
  const category = categories.find((c) => c.id === transaction.categoryId);
  
  const isIncome = transaction.type === 'income';
  
  // Fallback if category was deleted but transaction remains
  const iconName = category?.icon || 'help-circle';
  const categoryName = category?.name || 'Unknown';
  const categoryColor = category?.color || theme.secondary;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <View style={[styles.container, { backgroundColor: theme.surface }]}>
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
            <MaterialCommunityIcons 
              name={iconName as any} 
              size={24} 
              color={categoryColor} 
            />
          </View>
          <View style={styles.details}>
            <Text style={[styles.category, { color: theme.primary }]}>{categoryName}</Text>
            <Text style={[styles.date, { color: theme.secondary }]}>
              {format(new Date(transaction.date), 'MMM dd')} {transaction.note ? `• ${transaction.note}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={[styles.pricePill, { backgroundColor: theme.surfaceLighter }]}>
            <Text style={[styles.amount, { color: isIncome ? theme.accent : theme.primary }]}>
              {isIncome ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: TOKENS.spacing.lg,
    borderRadius: TOKENS.radius.lg,
    marginBottom: TOKENS.spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: TOKENS.spacing.md,
  },
  details: {
    flex: 1,
  },
  category: {
    ...TOKENS.typography.body,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    ...TOKENS.typography.caption,
  },
  rightContent: {
    alignItems: 'flex-end',
    marginLeft: TOKENS.spacing.md,
  },
  pricePill: {
    paddingHorizontal: TOKENS.spacing.md,
    paddingVertical: TOKENS.spacing.sm,
    borderRadius: TOKENS.radius.sm,
  },
  amount: {
    ...TOKENS.typography.body,
    fontWeight: '700',
  },
});
