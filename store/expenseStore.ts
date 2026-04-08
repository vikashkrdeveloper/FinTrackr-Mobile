import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  date: string; // ISO date string
  note: string;
}

export type ThemeType = 'light' | 'dark' | 'system';

interface ExpenseState {
  transactions: Transaction[];
  categories: Category[];
  theme: ThemeType;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  setTheme: (theme: ThemeType) => void;
  getAllTransactions: () => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getBalance: () => number;
  getCurrentMonthTransactions: () => Transaction[];
  getCurrentMonthIncome: () => number;
  getCurrentMonthExpense: () => number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', icon: 'silverware-fork-knife', color: '#F59E0B' },
  { id: 'cat-2', name: 'Salary', icon: 'cash', color: '#10B981' },
  { id: 'cat-3', name: 'Shopping', icon: 'shopping', color: '#EC4899' },
  { id: 'cat-4', name: 'Transport', icon: 'bus', color: '#3B82F6' },
  { id: 'cat-5', name: 'Utilities', icon: 'lightning-bolt', color: '#8B5CF6' },
  { id: 'cat-6', name: 'Entertainment', icon: 'movie', color: '#F43F5E' },
  { id: 'cat-7', name: 'Health', icon: 'medical-bag', color: '#14B8A6' },
  { id: 'cat-8', name: 'Other', icon: 'dots-horizontal', color: '#6B7280' },
];

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      theme: 'system',
      
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: uuid.v4() as string,
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
      
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: uuid.v4() as string,
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      setTheme: (theme) => set({ theme }),

      getAllTransactions: () => {
        return get().transactions;
      },
      
      getTransactionsByCategory: (categoryId) => {
        return get().transactions.filter((t) => t.categoryId === categoryId);
      },

      getTotalIncome: () => {
        return get().transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpense: () => {
        return get().transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        return get().getTotalIncome() - get().getTotalExpense();
      },

      getCurrentMonthTransactions: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        return get().transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getFullYear() === year && tDate.getMonth() === month;
        });
      },

      getCurrentMonthIncome: () => {
        return get().getCurrentMonthTransactions()
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getCurrentMonthExpense: () => {
        return get().getCurrentMonthTransactions()
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },
    }),
    {
      name: 'fintrackr-storage',
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState: any, version) => {
        // Simple wipe on migration to avoid conflicts since Category changed from string to object globally
        if (persistedState.transactions?.length > 0 && typeof persistedState.transactions[0].category === 'string') {
          return { ...persistedState, transactions: [], categories: DEFAULT_CATEGORIES };
        }
        return persistedState as ExpenseState;
      },
      version: 2, // Bump version to trigger migration
    }
  )
);
