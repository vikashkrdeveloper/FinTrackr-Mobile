import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Transaction, Category } from '../store/expenseStore';

export const exportTransactionsToCSV = async (transactions: Transaction[], categories: Category[]) => {
  if (transactions.length === 0) return;

  const header = 'Date,Type,Amount,Category,Note\n';
  const rows = transactions.map(t => {
    const cat = categories.find(c => c.id === t.categoryId);
    return `${new Date(t.date).toLocaleDateString()},${t.type},${t.amount},${cat?.name || 'Other'},"${t.note || ''}"`;
  }).join('\n');

  const csvContent = header + rows;
  const fileName = `FinTrackr_Export_${new Date().getTime()}.csv`;
  const fileUri = (FileSystem.documentDirectory || '') + fileName;

  try {
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Transactions',
        UTI: 'public.comma-separated-values-text',
      });
    }
  } catch (error) {
    console.error('Export Error:', error);
  }
};
