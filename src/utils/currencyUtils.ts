import type { Currency } from '../types/currency';

export const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency, exchangeRate: number): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  }
  
  return amount;
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

export const getCurrencySymbol = (currency: Currency): string => {
  return currency === 'INR' ? '₹' : '$';
}; 