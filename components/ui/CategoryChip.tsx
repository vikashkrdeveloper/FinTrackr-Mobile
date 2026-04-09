import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../../theme/tokens';
import { Category } from '../../store/expenseStore';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CategoryChipProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryChip = ({ category, isSelected, onPress }: CategoryChipProps) => {
  const { theme, isDark } = useAppTheme();
  const selectedTextColor = (category.id === 'all' && isDark) ? theme.background : '#FFFFFF';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        { backgroundColor: theme.surface },
        isSelected && { backgroundColor: category.color },
        !isSelected && { borderWidth: 1, borderColor: theme.surfaceLighter }
      ]}
    >
      <MaterialCommunityIcons 
        name={category.icon as any} 
        size={18} 
        color={isSelected ? selectedTextColor : category.color} 
        style={styles.icon}
      />
      <Text style={[
        styles.label,
        { color: theme.primary },
        isSelected && { color: selectedTextColor, fontWeight: '700' }
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TOKENS.spacing.lg,
    paddingVertical: TOKENS.spacing.md,
    borderRadius: TOKENS.radius.round,
    marginRight: TOKENS.spacing.sm,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    ...TOKENS.typography.body,
    fontWeight: '500',
  }
});
