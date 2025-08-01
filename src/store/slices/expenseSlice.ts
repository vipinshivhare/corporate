import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Expense {
  id: number;
  employeeId: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
}

interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (employeeId?: number) => {
    const url = employeeId 
      ? `http://localhost:3001/expenses?employeeId=${employeeId}`
      : 'http://localhost:3001/expenses';
    const response = await axios.get(url);
    return response.data;
  }
);

export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData: Omit<Expense, 'id'>) => {
    const response = await axios.post('http://localhost:3001/expenses', expenseData);
    return response.data;
  }
);

export const updateExpenseStatus = createAsyncThunk(
  'expense/updateExpenseStatus',
  async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
    const response = await axios.patch(`http://localhost:3001/expenses/${id}`, { status });
    return response.data;
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch expenses';
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
      })
      .addCase(updateExpenseStatus.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
      });
  },
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer; 