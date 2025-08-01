import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchExpenses, updateExpenseStatus } from '../../store/slices/managerSlice';
import HamburgerMenu from '../../components/HamburgerMenu';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import '../../styles/ExpenseApprovals.css';
 
const ExpenseApprovals: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses, loading } = useAppSelector(state => state.manager);


  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all'
  });

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleStatusUpdate = async (expenseId: number, status: 'approved' | 'rejected') => {
    try {
      await dispatch(updateExpenseStatus({ id: expenseId, status }));
      alert(`Expense ${status} successfully!`);
    } catch {
      alert('Failed to update expense status. Please try again.');
    }
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses]; // Create a copy of the array

    if (filters.status !== 'all') {
      filtered = filtered.filter(expense => expense.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredExpenses = getFilteredExpenses();

  const pendingCount = expenses.filter(expense => expense.status === 'pending').length;
  const approvedCount = expenses.filter(expense => expense.status === 'approved').length;
  const rejectedCount = expenses.filter(expense => expense.status === 'rejected').length;

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Expense Approvals</h1>
          <div className="header-actions">
          
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Summary Stats */}
        <section className="approval-stats">
          <h2>Approval Summary</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3>Pending</h3>
                <p className="stat-value">{pendingCount}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>Approved</h3>
                <p className="stat-value">{approvedCount}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <XCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>Rejected</h3>
                <p className="stat-value">{rejectedCount}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="filters-section">
          <h2>Filters</h2>
          <div className="filter-controls">
            <div className="filter-group">
              <label>Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                <option value="travel">Travel</option>
                <option value="meals">Meals</option>
                <option value="accommodation">Accommodation</option>
                <option value="transportation">Transportation</option>
                <option value="office">Office Supplies</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Expense List */}
        <section className="expense-list">
          <h2>Expense Requests</h2>
          {loading ? (
            <div className="loading">Loading expenses...</div>
          ) : filteredExpenses.length > 0 ? (
            <div className="expense-grid">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="expense-card">
                  <div className="expense-header">
                    <div className="expense-info">
                      <h3>{expense.description}</h3>
                      <p>Employee ID: {expense.employeeId}</p>
                      <span className={`status ${expense.status}`}>
                        {expense.status}
                      </span>
                    </div>
                    <div className="expense-amount">
                      <span className="amount">₹{expense.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="expense-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <CreditCard size={16} />
                        <span>{expense.category}</span>
                      </div>
                      <div className="detail-item">
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {expense.status === 'pending' && (
                    <div className="expense-actions">
                      <button
                        onClick={() => handleStatusUpdate(expense.id, 'approved')}
                        className="approve-btn"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(expense.id, 'rejected')}
                        className="reject-btn"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <CreditCard size={48} />
              <h3>No expenses found</h3>
              <p>No expense requests match your current filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ExpenseApprovals; 