import { createSlice } from '@reduxjs/toolkit';
import type { Currency } from '../../types/currency';

interface CurrencyState {
  currentCurrency: Currency;
  exchangeRate: number; // INR to USD rate (1 USD = ~83 INR)
}

const initialState: CurrencyState = {
  currentCurrency: 'INR',
  exchangeRate: 86.0, // Approximate INR to USD rate
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currentCurrency = action.payload;
    },
    setExchangeRate: (state, action) => {
      state.exchangeRate = action.payload;
    },
  },
});

export const { setCurrency, setExchangeRate } = currencySlice.actions;
export default currencySlice.reducer; 