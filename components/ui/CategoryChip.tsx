import React from 'react';
import { TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TOKENS } from '../../theme/tokens';
import { Category } from '../../store/expenseStore';

interface CategoryChipProps {
  category: Category;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryChip = ({ category, isSelected, onPress }: CategoryChipProps) => {
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
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
        color={isSelected ? '#FFFFFF' : category.color} 
        style={styles.icon}
      />
      <Text style={[
        styles.label,
        { color: theme.primary },
        isSelected && { color: '#FFFFFF', fontWeight: '700' }
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
