import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrency } from '../store/slices/currencySlice';
import { DollarSign, IndianRupee } from 'lucide-react';

const CurrencySwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentCurrency } = useAppSelector(state => state.currency);

  const handleCurrencyChange = (currency: 'INR' | 'USD') => {
    dispatch(setCurrency(currency));
  };

  return (
    <div className="currency-switcher">
      <button
        onClick={() => handleCurrencyChange('INR')}
        className={`currency-btn ${currentCurrency === 'INR' ? 'active' : ''}`}
        title="Switch to Indian Rupees"
      >
        <IndianRupee size={16} />
        <span>INR</span>
      </button>
      <button
        onClick={() => handleCurrencyChange('USD')}
        className={`currency-btn ${currentCurrency === 'USD' ? 'active' : ''}`}
        title="Switch to US Dollars"
      >
        <DollarSign size={16} />
        <span>USD</span>
      </button>
    </div>
  );
};

export default CurrencySwitcher; 