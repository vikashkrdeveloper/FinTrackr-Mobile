import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { Transaction, Category } from '../store/expenseStore';
import { format } from 'date-fns';


const escapeCSV = (val: string | number | undefined | null): string => {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
};

const downloadCSVWeb = (csvContent: string, fileName: string) => {
  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Web Download Error:', error);
    alert('Failed to download CSV in browser.');
  }
};

export const exportTransactionsToCSV = async (transactions: Transaction[], categories: Category[]) => {
  if (transactions.length === 0) {
    const msg = 'There are no transactions in the current filtered list to export.';
    if (Platform.OS === 'web') alert(msg);
    else Alert.alert('No Data', msg);
    return;
  }

  try {
    const header = 'Date,Type,Amount,Category,Note\n';
    const rows = transactions.map(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      const dateStr = format(new Date(t.date), 'yyyy-MM-dd HH:mm');
      
      return [
        escapeCSV(dateStr),
        escapeCSV(t.type),
        escapeCSV(t.amount),
        escapeCSV(cat?.name || 'Other'),
        escapeCSV(t.note || '')
      ].join(',');
    }).join('\n');

    const csvContent = header + rows;
    const timestamp = format(new Date(), 'yyyyMMdd_HHmm');
    const fileName = `FinTrackr_Export_${timestamp}.csv`;
    
    if (Platform.OS === 'web') {
      downloadCSVWeb(csvContent, fileName);
      return;
    }

    const baseDir = FileSystem.documentDirectory;
    if (!baseDir) {
      throw new Error('FileSystem.documentDirectory is not available on this platform.');
    }
    
    const fileUri = baseDir.endsWith('/') ? `${baseDir}${fileName}` : `${baseDir}/${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isSharingAvailable = await Sharing.isAvailableAsync();
    
    if (isSharingAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export FinTrackr Data',
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      Alert.alert('Sharing Unavailable', 'Native sharing is not available on this device/environment. The file is saved locally to the document directory.');
    }
  } catch (error: any) {
    console.error('Export Error:', error);
    const errMsg = `An error occurred while generating the CSV: ${error?.message || 'Unknown error'}`;
    if (Platform.OS === 'web') alert(errMsg);
    else Alert.alert('Export Failed', errMsg);
  }
};
