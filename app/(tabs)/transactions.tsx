import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, useColorScheme, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { CategoryChip } from '../../components/ui/CategoryChip';

export default function HistoryScreen() {
  const isDark = (useColorScheme() ?? 'dark') === 'dark';
  const theme = isDark ? TOKENS.colors.dark : TOKENS.colors.light;
  
  const transactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const deleteTransaction = useExpenseStore((state) => state.deleteTransaction);

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.note?.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'all' || t.type === selectedType;
      const matchesCategory = !selectedCategoryId || t.categoryId === selectedCategoryId;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, selectedType, selectedCategoryId]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.secondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor={theme.secondary}
            style={[styles.searchInput, { color: theme.primary }]}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={theme.secondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterTrack}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {/* Type Filters */}
            <TouchableOpacity 
              onPress={() => setSelectedType('all')}
              style={[
                styles.typePill, 
                { backgroundColor: theme.surface },
                selectedType === 'all' && { backgroundColor: theme.primary }
              ]}
            >
              <Text style={[styles.typeText, { color: theme.primary }, selectedType === 'all' && { color: theme.background }]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSelectedType('income')}
              style={[
                styles.typePill, 
                { backgroundColor: theme.surface },
                selectedType === 'income' && { backgroundColor: theme.accent }
              ]}
            >
              <Text style={[styles.typeText, { color: theme.primary }, selectedType === 'income' && { color: '#000' }]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSelectedType('expense')}
              style={[
                styles.typePill, 
                { backgroundColor: theme.surface },
                selectedType === 'expense' && { backgroundColor: theme.error }
              ]}
            >
              <Text style={[styles.typeText, { color: theme.primary }, selectedType === 'expense' && { color: '#000' }]}>Expense</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Category Filters */}
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                isSelected={selectedCategoryId === cat.id}
                onPress={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="tray-blank" size={48} color={theme.surfaceLighter} />
            <Text style={[styles.emptyText, { color: theme.secondary }]}>No transactions found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onLongPress={() => deleteTransaction(item.id)} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: TOKENS.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: TOKENS.spacing.xl,
    paddingHorizontal: TOKENS.spacing.md,
    height: 48,
    borderRadius: TOKENS.radius.md,
    marginBottom: TOKENS.spacing.md,
  },
  searchIcon: {
    marginRight: TOKENS.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...TOKENS.typography.body,
  },
  filterTrack: {
    marginBottom: TOKENS.spacing.md,
  },
  filterScroll: {
    paddingHorizontal: TOKENS.spacing.xl,
    alignItems: 'center',
    gap: TOKENS.spacing.xs,
  },
  typePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    ...TOKENS.typography.caption,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: TOKENS.spacing.xs,
  },
  listContent: {
    padding: TOKENS.spacing.xl,
    paddingTop: 0,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    ...TOKENS.typography.body,
    marginTop: TOKENS.spacing.md,
  }
});
