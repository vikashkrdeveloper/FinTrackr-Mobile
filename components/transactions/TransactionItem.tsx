import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useExpenseStore, Transaction } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';
import { useAppTheme } from '../../hooks/useAppTheme';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { 
  SharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  transaction: Transaction;
  onPress?: () => void;
  onDelete?: () => void;
}

const RightAction = (
  prog: SharedValue<number>, 
  drag: SharedValue<number>,
  onDelete?: () => void
) => {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(drag.value, [-100, 0], [0, 100], Extrapolation.CLAMP) }],
    };
  });

  return (
    <Reanimated.View style={[styleAnimation, styles.rightActionContainer]}>
      <Pressable 
        style={({ pressed }) => [
          styles.deleteBtn, 
          { opacity: pressed ? 0.8 : 1 }
        ]} 
        onPress={onDelete}
      >
        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#FFFFFF" />
      </Pressable>
    </Reanimated.View>
  );
};

export const TransactionItem = ({ transaction, onPress, onDelete }: Props) => {
  const { theme } = useAppTheme();
  
  const categories = useExpenseStore((state) => state.categories);
  const category = categories.find((c) => c.id === transaction.categoryId);
  
  const isIncome = transaction.type === 'income';
  
  const iconName = category?.icon || 'help-circle';
  const categoryName = category?.name || 'Unknown';
  const categoryColor = category?.color || theme.secondary;

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={(prog, drag) => RightAction(prog, drag, onDelete)}
      containerStyle={styles.swipeContainer}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.content,
          { backgroundColor: theme.surface, opacity: pressed ? 0.9 : 1 }
        ]}
      >
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: `${categoryColor}20` }]}>
            <MaterialCommunityIcons 
              name={iconName as any} 
              size={24} 
              color={categoryColor} 
            />
          </View>
          <View style={styles.details}>
            <Text numberOfLines={1} style={[styles.category, { color: theme.primary }]}>{categoryName}</Text>
            <Text numberOfLines={1} style={[styles.date, { color: theme.secondary }]}>
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
      </Pressable>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: TOKENS.spacing.md,
    overflow: 'visible',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: TOKENS.spacing.lg,
    borderRadius: TOKENS.radius.lg,
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
  rightActionContainer: {
    width: 80,
    height: '100%',
    paddingLeft: TOKENS.spacing.md,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FF4B4B',
    borderRadius: TOKENS.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

