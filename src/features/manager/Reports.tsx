import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployees, fetchExpenses } from '../../store/slices/managerSlice';
import HamburgerMenu from '../../components/HamburgerMenu';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';
import '../../styles/Reports.css';

const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees, expenses, loading } = useAppSelector(state => state.manager);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Calculate report data
  const totalBudget = employees.reduce((sum, emp) => sum + (emp.budget || 0), 0);
  const totalUsedBudget = employees.reduce((sum, emp) => sum + (emp.usedBudget || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').length;
  const approvedExpenses = expenses.filter(exp => exp.status === 'approved').length;

  // Monthly expense trends (mock data)
  const monthlyTrends = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 }
  ];

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Reports & Charts</h1>
          <div className="header-actions">
            
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Summary Stats */}
        <section className="reports-summary">
          <h2>Financial Overview</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-icon">
                <DollarSign size={24} />
              </div>
              <div className="summary-content">
                <h3>Total Budget</h3>
                <p className="summary-value">₹{totalBudget.toLocaleString()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <TrendingUp size={24} />
              </div>
              <div className="summary-content">
                <h3>Used Budget</h3>
                <p className="summary-value">₹{totalUsedBudget.toLocaleString()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <BarChart3 size={24} />
              </div>
              <div className="summary-content">
                <h3>Total Expenses</h3>
                <p className="summary-value">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <Users size={24} />
              </div>
              <div className="summary-content">
                <h3>Team Size</h3>
                <p className="summary-value">{employees.length}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <div className="charts-container">
          {/* Budget vs Usage Chart */}
          <section className="chart-section">
            <h2>Budget vs Usage per Employee</h2>
            <div className="chart-content">
              {loading ? (
                <div className="loading">Loading chart data...</div>
              ) : employees.length > 0 ? (
                <div className="budget-chart">
                  {employees.map((employee) => {
                    const budgetUsed = employee.usedBudget || 0;
                    const budgetTotal = employee.budget || 0;
                    const usagePercentage = budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;
                    
                    return (
                      <div key={employee.id} className="budget-bar">
                        <div className="employee-info">
                          <h4>{employee.name}</h4>
                          <p>{employee.department}</p>
                        </div>
                        <div className="budget-bar-container">
                          <div className="budget-bar-fill">
                            <div 
                              className="budget-bar-progress"
                              style={{ 
                                width: `${Math.min(usagePercentage, 100)}%`,
                                backgroundColor: usagePercentage > 80 ? '#ef4444' : usagePercentage > 60 ? '#f59e0b' : '#10b981'
                              }}
                            />
                          </div>
                          <div className="budget-labels">
                            <span>₹{budgetUsed.toLocaleString()}</span>
                            <span>₹{budgetTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-data">
                  <Users size={48} />
                  <h3>No employee data</h3>
                  <p>No team members found to display budget data.</p>
                </div>
              )}
            </div>
          </section>

          {/* Monthly Trends Chart */}
          <section className="chart-section">
            <h2>Monthly Expense Trends</h2>
            <div className="chart-content">
              <div className="trends-chart">
                <div className="chart-bars">
                  {monthlyTrends.map((trend, index) => (
                    <div key={index} className="trend-bar">
                      <div 
                        className="trend-bar-fill"
                        style={{ 
                          height: `${(trend.amount / Math.max(...monthlyTrends.map(t => t.amount))) * 200}px`
                        }}
                      />
                      <span className="trend-label">{trend.month}</span>
                      <span className="trend-value">₹{(trend.amount / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Expense Status Distribution */}
          <section className="chart-section">
            <h2>Expense Status Distribution</h2>
            <div className="chart-content">
              <div className="status-distribution">
                <div className="status-item">
                  <div className="status-circle approved">
                    <span>{approvedExpenses}</span>
                  </div>
                  <div className="status-label">
                    <h4>Approved</h4>
                    <p>{approvedExpenses} expenses</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-circle pending">
                    <span>{pendingExpenses}</span>
                  </div>
                  <div className="status-label">
                    <h4>Pending</h4>
                    <p>{pendingExpenses} expenses</p>
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-circle rejected">
                    <span>{expenses.filter(exp => exp.status === 'rejected').length}</span>
                  </div>
                  <div className="status-label">
                    <h4>Rejected</h4>
                    <p>{expenses.filter(exp => exp.status === 'rejected').length} expenses</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Reports; 