import React, { useMemo, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore } from '../../store/expenseStore';
import { TOKENS } from '../../theme/tokens';
import { TransactionItem } from '../../components/transactions/TransactionItem';
import { CategoryChip } from '../../components/ui/CategoryChip';
import { exportTransactionsToCSV } from '../../lib/export';
import { useAppTheme } from '../../hooks/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDebounce } from '../../hooks/useDebounce';

const PAGE_SIZE = 12;

export default function HistoryScreen() {
  const { theme } = useAppTheme();
  
  const transactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const deleteTransaction = useExpenseStore((state) => state.deleteTransaction);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const category = categories.find(c => c.id === t.categoryId);
      const categoryName = category?.name || '';
      
      const matchesSearch = !debouncedSearch || 
        t.note?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        categoryName.toLowerCase().includes(debouncedSearch.toLowerCase());
        
      const matchesType = selectedType === 'all' || t.type === selectedType;
      const matchesCategory = !selectedCategoryId || t.categoryId === selectedCategoryId;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, debouncedSearch, selectedType, selectedCategoryId, categories]);

  // Paginated Data
  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(0, visibleCount);
  }, [filteredTransactions, visibleCount]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= filteredTransactions.length) return;

    setIsLoadingMore(true);
    
    // Simulate network delay for "smoothness" and visual feedback
    setTimeout(() => {
      setVisibleCount(prev => prev + PAGE_SIZE);
      setIsLoadingMore(false);
    }, 800);
  }, [isLoadingMore, visibleCount, filteredTransactions.length]);

  const renderFooter = () => {
    if (!isLoadingMore) return <View style={{ height: 20 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.accent} />
        <Text style={[styles.loadingText, { color: theme.secondary }]}>Loading more...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topHeader}>
        <Text style={[styles.title, { color: theme.primary }]}>History</Text>
        <TouchableOpacity 
          style={[styles.exportBtn, { backgroundColor: theme.surface }]}
          onPress={() => exportTransactionsToCSV(filteredTransactions, categories)}
        >
          <MaterialCommunityIcons name="export-variant" size={20} color={theme.primary} />
          <Text style={[styles.exportText, { color: theme.primary }]}>Export</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.secondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search notes or categories..."
            placeholderTextColor={theme.secondary}
            style={[styles.searchInput, { color: theme.primary }]}
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setVisibleCount(PAGE_SIZE); // Reset pagination on search
            }}
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
              onPress={() => {
                setSelectedType('all');
                setVisibleCount(PAGE_SIZE);
              }}
              style={[
                styles.typePill, 
                { backgroundColor: theme.surface },
                selectedType === 'all' && { backgroundColor: theme.primary }
              ]}
            >
              <Text style={[styles.typeText, { color: theme.primary }, selectedType === 'all' && { color: theme.background }]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                setSelectedType('income');
                setVisibleCount(PAGE_SIZE);
              }}
              style={[
                styles.typePill, 
                { backgroundColor: theme.surface },
                selectedType === 'income' && { backgroundColor: theme.accent }
              ]}
            >
              <Text style={[styles.typeText, { color: theme.primary }, selectedType === 'income' && { color: theme.background, fontWeight: '800' }]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                setSelectedType('expense');
                setVisibleCount(PAGE_SIZE);
              }}
              style={[
                styles.typePill, 
                { backgroundColor: theme.surface },
                selectedType === 'expense' && { backgroundColor: theme.error }
              ]}
            >
              <Text style={[styles.typeText, { color: theme.primary }, selectedType === 'expense' && { color: theme.background, fontWeight: '800' }]}>Expense</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.surfaceLighter }]} />

            {/* Category Filters */}
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                category={cat}
                isSelected={selectedCategoryId === cat.id}
                onPress={() => {
                  setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={paginatedTransactions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="tray" size={48} color={theme.surfaceLighter} />
            <Text style={[styles.emptyText, { color: theme.secondary }]}>No transactions found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TransactionItem 
            transaction={item} 
            onDelete={() => deleteTransaction(item.id)} 
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: TOKENS.spacing.xl,
    paddingTop: TOKENS.spacing.md,
    marginBottom: TOKENS.spacing.lg,
  },
  title: {
    ...TOKENS.typography.heading,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: TOKENS.spacing.md,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  exportText: {
    ...TOKENS.typography.caption,
    fontWeight: '700',
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
    marginHorizontal: TOKENS.spacing.xs,
  },
  listContent: {
    padding: TOKENS.spacing.xl,
    paddingTop: 0,
    paddingBottom: 100,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    ...TOKENS.typography.caption,
    fontWeight: '600',
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
