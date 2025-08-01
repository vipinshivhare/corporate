import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBookings } from '../../store/slices/bookingSlice';
import { fetchExpenses } from '../../store/slices/expenseSlice';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../../components/HamburgerMenu';
import CurrencySwitcher from '../../components/CurrencySwitcher';
import { convertCurrency, formatCurrency } from '../../utils/currencyUtils';
import { 
  Wallet, 
  CreditCard, 
  Gift, 
  Calendar,
  Plane,
  Hotel,
  Car,
  TrendingUp
} from 'lucide-react';
import '../../styles/EmployeeDashboard.css';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { bookings, loading: bookingsLoading } = useAppSelector(state => state.booking);
  const { expenses, loading: expensesLoading } = useAppSelector(state => state.expense);
  const { currentCurrency, exchangeRate } = useAppSelector(state => state.currency);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBookings(user.id));
      dispatch(fetchExpenses(user.id));
    }
  }, [dispatch, user?.id]);

  const recentBookings = bookings.slice(0, 3);
  const recentExpenses = expenses.slice(0, 3);

  const totalExpenses = expenses.reduce((sum: number, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter((expense) => expense.status === 'pending').length;

  // Convert amounts to selected currency
  const convertedWalletBalance = convertCurrency(user?.walletBalance || 0, 'INR', currentCurrency, exchangeRate);
  const convertedBudget = convertCurrency(user?.budget || 0, 'INR', currentCurrency, exchangeRate);
  const convertedTotalExpenses = convertCurrency(totalExpenses, 'INR', currentCurrency, exchangeRate);
  const convertedBudgetRemaining = convertedBudget - convertedTotalExpenses;

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Welcome back, {user.name}!</h1>
          <div className="header-actions">
            <CurrencySwitcher />
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Summary Cards */}
        <section className="summary-cards">
          <div className="summary-card wallet-card">
            <div className="card-icon">
              <Wallet size={24} />
            </div>
            <div className="card-content">
              <h3>Wallet Balance</h3>
              <p className="amount">{formatCurrency(convertedWalletBalance, currentCurrency)}</p>
            </div>
          </div>

          <div className="summary-card budget-card">
            <div className="card-icon">
              <CreditCard size={24} />
            </div>
            <div className="card-content">
              <h3>Budget Remaining</h3>
              <p className="amount">{formatCurrency(convertedBudgetRemaining, currentCurrency)}</p>
            </div>
          </div>

          <div className="summary-card rewards-card">
            <div className="card-icon">
              <Gift size={24} />
            </div>
            <div className="card-content">
              <h3>Reward Points</h3>
              <p className="amount">{user.rewardPoints}</p>
            </div>
          </div>

          <div className="summary-card pending-card">
            <div className="card-icon">
              <Calendar size={24} />
            </div>
            <div className="card-content">
              <h3>Pending Approvals</h3>
              <p className="amount">{pendingExpenses}</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/employee/book-flight')}
              className="action-button flight"
            >
              <Plane size={20} />
              Book Flight
            </button>
            <button 
              onClick={() => navigate('/employee/book-hotel')}
              className="action-button hotel"
            >
              <Hotel size={20} />
              Book Hotel
            </button>
            <button 
              onClick={() => navigate('/employee/book-pickup')}
              className="action-button pickup"
            >
              <Car size={20} />
              Airport Pickup
            </button>
            <button 
              onClick={() => navigate('/employee/expense-report')}
              className="action-button expense"
            >
              <TrendingUp size={20} />
              Submit Expense
            </button>
            <button 
              onClick={() => navigate('/employee/booking-history')}
              className="action-button history"
            >
              <Calendar size={20} />
              Booking History
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <div className="activity-grid">
          <section className="recent-bookings">
            <h2>Recent Bookings</h2>
            {bookingsLoading ? (
              <div className="loading">Loading bookings...</div>
            ) : recentBookings.length > 0 ? (
              <div className="booking-list">
                {recentBookings.map((booking) => {
                  const convertedAmount = convertCurrency(booking.amount, 'INR', currentCurrency, exchangeRate);
                  return (
                    <div key={booking.id} className="booking-item">
                      <div className="booking-icon">
                        {booking.type === 'flight' && <Plane size={16} />}
                        {booking.type === 'hotel' && <Hotel size={16} />}
                        {booking.type === 'pickup' && <Car size={16} />}
                      </div>
                      <div className="booking-details">
                        <h4>{booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}</h4>
                        <p>
                          {booking.type === 'flight' && `${booking.from} → ${booking.to}`}
                          {booking.type === 'hotel' && `${booking.city}`}
                          {booking.type === 'pickup' && `${booking.city}`}
                        </p>
                        <span className={`status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-amount">
                        {formatCurrency(convertedAmount, currentCurrency)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">No recent bookings</p>
            )}
          </section>

          <section className="recent-expenses">
            <h2>Recent Expenses</h2>
            {expensesLoading ? (
              <div className="loading">Loading expenses...</div>
            ) : recentExpenses.length > 0 ? (
              <div className="expense-list">
                {recentExpenses.map((expense) => {
                  const convertedAmount = convertCurrency(expense.amount, 'INR', currentCurrency, exchangeRate);
                  return (
                    <div key={expense.id} className="expense-item">
                      <div className="expense-details">
                        <h4>{expense.description}</h4>
                        <p>{expense.category}</p>
                        <span className={`status ${expense.status}`}>
                          {expense.status}
                        </span>
                      </div>
                      <div className="expense-amount">
                        {formatCurrency(convertedAmount, currentCurrency)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">No recent expenses</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;