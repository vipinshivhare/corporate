import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployees, fetchExpenses } from '../../store/slices/managerSlice';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../../components/HamburgerMenu';
import CurrencySwitcher from '../../components/CurrencySwitcher';
import { convertCurrency, formatCurrency } from '../../utils/currencyUtils';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  BarChart3,
} from 'lucide-react';
import '../../styles/EmployeeDashboard.css';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { employees, expenses, loading } = useAppSelector(state => state.manager);
  const { currentCurrency, exchangeRate } = useAppSelector(state => state.currency);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchExpenses());
  }, [dispatch]);



  const totalBudget = employees.reduce((sum, emp) => sum + (emp.budget || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingApprovals = expenses.filter(exp => exp.status === 'pending').length;

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
          <h1>Manager Dashboard</h1>
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
              <CreditCard size={24} />
            </div>
            <div className="card-content">
              <h3>Total Team Budget</h3>
              <p className="amount">
                {formatCurrency(
                  convertCurrency(totalBudget, 'INR', currentCurrency, exchangeRate),
                  currentCurrency
                )}
              </p>
            </div>
          </div>

          <div className="summary-card budget-card">
            <div className="card-icon">
              <TrendingUp size={24} />
            </div>
            <div className="card-content">
              <h3>Total Expenses</h3>
              <p className="amount">
                {formatCurrency(
                  convertCurrency(totalExpenses, 'INR', currentCurrency, exchangeRate),
                  currentCurrency
                )}
              </p>
            </div>
          </div>

          <div className="summary-card rewards-card">
            <div className="card-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <h3>Employees</h3>
              <p className="amount">{employees.length}</p>
            </div>
          </div>

          <div className="summary-card pending-card">
            <div className="card-icon">
              <BarChart3 size={24} />
            </div>
            <div className="card-content">
              <h3>Pending Approvals</h3>
              <p className="amount">{pendingApprovals}</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/manager/team-management')}
              className="action-button flight"
            >
              <Users size={20} />
              Team Management
            </button>
            <button 
              onClick={() => navigate('/manager/expense-approvals')}
              className="action-button hotel"
            >
              <CreditCard size={20} />
              Expense Approvals
            </button>
            <button 
              onClick={() => navigate('/manager/reports')}
              className="action-button pickup"
            >
              <BarChart3 size={20} />
              Reports & Charts
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <div className="activity-grid">
          <section className="recent-bookings">
            <h2>Recent Expense Submissions</h2>
            {loading ? (
              <div className="loading">Loading expenses...</div>
            ) : expenses.slice(0, 5).length > 0 ? (
              <div className="booking-list">
                {expenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="booking-item">
                    <div className="booking-icon">
                      <CreditCard size={16} />
                    </div>
                    <div className="booking-details">
                      <h4>{expense.description}</h4>
                      <p>By: {expense.employeeName}</p>
                      <span className={`status ${expense.status}`}>
                        {expense.status}
                      </span>
                    </div>
                                         <div className="booking-amount">
                       {formatCurrency(
                         convertCurrency(expense.amount, 'INR', currentCurrency, exchangeRate),
                         currentCurrency
                       )}
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recent expenses</p>
            )}
          </section>

          <section className="recent-expenses">
            <h2>Team Overview</h2>
            {loading ? (
              <div className="loading">Loading team data...</div>
            ) : employees.length > 0 ? (
              <div className="expense-list">
                {employees.slice(0, 5).map((employee) => (
                  <div key={employee.id} className="expense-item">
                    <div className="expense-details">
                      <h4>{employee.name}</h4>
                                             <p>Budget: {formatCurrency(
                         convertCurrency(employee.budget || 0, 'INR', currentCurrency, exchangeRate),
                         currentCurrency
                       )}</p>
                      <span className="status confirmed">
                        Active
                      </span>
                    </div>
                                         <div className="expense-amount">
                       {formatCurrency(
                         convertCurrency(employee.usedBudget || 0, 'INR', currentCurrency, exchangeRate),
                         currentCurrency
                       )}
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No team members</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
