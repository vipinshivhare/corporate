import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  budget: number;
  usedBudget: number;
  walletBalance: number;
  rewardPoints: number;
}

interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ManagerState {
  employees: Employee[];
  expenses: Expense[];
  totalTeamBudget: number;
  totalExpenses: number;
  pendingApprovals: number;
  loading: boolean;
  error: string | null;
}

const initialState: ManagerState = {
  employees: [],
  expenses: [],
  totalTeamBudget: 0,
  totalExpenses: 0,
  pendingApprovals: 0,
  loading: false,
  error: null,
};

export const fetchEmployees = createAsyncThunk(
  'manager/fetchEmployees',
  async () => {
    const response = await axios.get('http://localhost:3001/employees');
    return response.data;
  }
);

export const fetchExpenses = createAsyncThunk(
  'manager/fetchExpenses',
  async () => {
    const response = await axios.get('http://localhost:3001/expenses');
    return response.data;
  }
);

export const updateEmployeeBudget = createAsyncThunk(
  'manager/updateEmployeeBudget',
  async ({ id, budget }: { id: number; budget: number }) => {
    const response = await axios.patch(`http://localhost:3001/employees/${id}`, { budget });
    return response.data;
  }
);

export const updateExpenseStatus = createAsyncThunk(
  'manager/updateExpenseStatus',
  async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
    const response = await axios.patch(`http://localhost:3001/expenses/${id}`, { status });
    return response.data;
  }
);

export const fetchManagerStats = createAsyncThunk(
  'manager/fetchManagerStats',
  async () => {
    const [employeesResponse, expensesResponse] = await Promise.all([
      axios.get('http://localhost:3001/employees'),
      axios.get('http://localhost:3001/expenses')
    ]);
    
    const employees = employeesResponse.data;
    const expenses = expensesResponse.data;
    
    const totalTeamBudget = employees.reduce((sum: number, emp: Employee) => sum + emp.budget, 0);
    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const pendingApprovals = expenses.filter((exp: any) => exp.status === 'pending').length;
    
    return {
      employees,
      expenses,
      totalTeamBudget,
      totalExpenses,
      pendingApprovals
    };
  }
);

const managerSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch employees';
      })
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
      .addCase(updateEmployeeBudget.fulfilled, (state, action) => {
        const index = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateExpenseStatus.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index].status = action.payload.status;
        }
      })
      .addCase(fetchManagerStats.fulfilled, (state, action) => {
        state.employees = action.payload.employees;
        state.expenses = action.payload.expenses;
        state.totalTeamBudget = action.payload.totalTeamBudget;
        state.totalExpenses = action.payload.totalExpenses;
        state.pendingApprovals = action.payload.pendingApprovals;
      });
  },
});

export const { clearError } = managerSlice.actions;
export default managerSlice.reducer; 