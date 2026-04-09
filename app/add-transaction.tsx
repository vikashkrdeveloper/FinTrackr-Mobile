import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/expenseStore';
import { TOKENS } from '../theme/tokens';
import { InputField } from '../components/ui/InputField';
import { CategoryChip } from '../components/ui/CategoryChip';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAppTheme } from '../hooks/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

const PREDEFINED_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#D946EF'];
const PREDEFINED_ICONS = ['wallet', 'airplane', 'shopping', 'food', 'medical-bag', 'gas-station', 'home', 'star', 'book', 'gamepad-variant'];

export default function TransactionsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  
  const categories = useExpenseStore((state) => state.categories);
  const addTransaction = useExpenseStore((state) => state.addTransaction);
  const addCategory = useExpenseStore((state) => state.addCategory);

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0].id);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Custom Category State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(PREDEFINED_COLORS[0]);
  const [newCatIcon, setNewCatIcon] = useState(PREDEFINED_ICONS[0]);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const handleSaveTransaction = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid number greater than 0.');
      return;
    }

    setIsSaving(true);
    try {
      // Small artificial delay for visual confirmation of loading state
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addTransaction({
        type,
        amount: Number(amount),
        categoryId: selectedCategoryId,
        date: date.toISOString(),
        note: note.trim(),
      });

      setAmount('');
      setNote('');
      setDate(new Date());
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert('Missing Name', 'Please provide a category name.');
      return;
    }
    
    setIsSavingCategory(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      addCategory({
        name: newCatName.trim(),
        color: newCatColor,
        icon: newCatIcon
      });

      setShowCategoryModal(false);
      setNewCatName('');
    } catch {
      Alert.alert('Error', 'Failed to create category.');
    } finally {
      setIsSavingCategory(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Type Selector */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.secondary }]}>Transaction Type</Text>
            <View style={styles.typeSelector}>
              <CategoryChip 
                category={{ id: 't-exp', name: 'Expense', color: TOKENS.colors.dark.error, icon: 'arrow-down' }}
                isSelected={type === 'expense'} 
                onPress={() => setType('expense')} 
              />
              <CategoryChip 
                category={{ id: 't-inc', name: 'Income', color: TOKENS.colors.dark.accent, icon: 'arrow-up' }}
                isSelected={type === 'income'} 
                onPress={() => setType('income')} 
              />
            </View>
          </View>

          {/* Amount Input */}
          <InputField 
            label="Amount"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            leftIcon={<Text style={{ color: theme.primary, fontSize: 24, fontWeight: '700' }}>$</Text>}
          />

          {/* Category Selector */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.secondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  isSelected={selectedCategoryId === cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                />
              ))}
              <TouchableOpacity 
                style={[styles.addCategoryBtn, { borderColor: theme.surfaceLighter, borderWidth: 1 }]}
                onPress={() => setShowCategoryModal(true)}
              >
                <MaterialCommunityIcons name="plus" size={24} color={theme.primary} />
              </TouchableOpacity>
              <View style={{ width: TOKENS.spacing.xl }} />
            </ScrollView>
          </View>

          {/* Date Selector */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.secondary }]}>Date</Text>
            <TouchableOpacity 
              style={[styles.dateButton, { backgroundColor: theme.surface }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, { color: theme.primary }]}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          {/* Note Input */}
          <InputField 
            label="Note (Optional)"
            placeholder="What was this for?"
            value={note}
            onChangeText={setNote}
          />

          <View style={{ marginTop: TOKENS.spacing.xl }}>
            <PrimaryButton label="Save Transaction" onPress={handleSaveTransaction} loading={isSaving} />
          </View>
        </ScrollView>

        {/* New Category Modal */}
        <Modal visible={showCategoryModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.primary }]}>New Category</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color={theme.primary} />
                </TouchableOpacity>
              </View>

              <InputField 
                label="Category Name"
                placeholder="E.g., Subscriptions"
                value={newCatName}
                onChangeText={setNewCatName}
              />

              <Text style={[styles.label, { color: theme.secondary, marginBottom: 8 }]}>Select Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24, marginHorizontal: -24, paddingHorizontal: 24 }}>
                {PREDEFINED_COLORS.map(color => (
                  <TouchableOpacity 
                    key={color} 
                    onPress={() => setNewCatColor(color)}
                    style={[styles.colorBubble, { backgroundColor: color }, newCatColor === color && styles.colorBubbleSelected]} 
                  />
                ))}
                <View style={{ width: 24 }}/>
              </ScrollView>

              <Text style={[styles.label, { color: theme.secondary, marginBottom: 8 }]}>Select Icon</Text>
              <View style={styles.iconGrid}>
                {PREDEFINED_ICONS.map(icon => (
                  <TouchableOpacity 
                    key={icon} 
                    onPress={() => setNewCatIcon(icon)}
                    style={[
                      styles.iconBubble, 
                      { backgroundColor: theme.surface },
                      newCatIcon === icon && { backgroundColor: theme.primary }
                    ]}
                  >
                    <MaterialCommunityIcons name={icon as any} size={24} color={newCatIcon === icon ? theme.background : theme.primary} />
                  </TouchableOpacity>
                ))}
              </View>

              <PrimaryButton label="Create Category" onPress={handleSaveCategory} loading={isSavingCategory} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: TOKENS.spacing.xl,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: TOKENS.spacing.xl,
  },
  label: {
    ...TOKENS.typography.caption,
    marginBottom: TOKENS.spacing.sm,
    fontWeight: '500',
  },
  typeSelector: {
    flexDirection: 'row',
  },
  categoryScroll: {
    flexDirection: 'row',
    marginHorizontal: -TOKENS.spacing.xl,
    paddingHorizontal: TOKENS.spacing.xl,
  },
  addCategoryBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  dateButton: {
    borderRadius: TOKENS.radius.md,
    paddingHorizontal: TOKENS.spacing.lg,
    paddingVertical: 14,
  },
  dateText: {
    ...TOKENS.typography.body,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    ...TOKENS.typography.subheading,
  },
  colorBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  colorBubbleSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
