import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEmployees } from '../../store/slices/managerSlice';
import HamburgerMenu from '../../components/HamburgerMenu';
import { convertCurrency, formatCurrency } from '../../utils/currencyUtils';
import {Users, DollarSign, TrendingUp } from 'lucide-react';
import '../../styles/TeamManagement.css';

const TeamManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees, loading } = useAppSelector(state => state.manager);
  const { currentCurrency, exchangeRate } = useAppSelector(state => state.currency);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleBudgetUpdate = (employeeId: string, newBudget: number) => {
    // Handle budget update logic here
    console.log(`Updating budget for employee ${employeeId} to ${newBudget}`);
  };

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Team Budget Management</h1>
          <div className="header-actions">
          
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="team-overview">
          <h2>Team Overview</h2>
          {loading ? (
            <div className="loading">Loading team data...</div>
          ) : (
            <div className="team-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Employees</h3>
                  <p className="stat-value">{employees.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <DollarSign size={24} />
                </div>
                <div className="stat-content">
                  <h3>Total Budget</h3>
                  <p className="stat-value">
                    {formatCurrency(
                      convertCurrency(employees.reduce((sum, emp) => sum + (emp.budget || 0), 0), 'INR', currentCurrency, exchangeRate),
                      currentCurrency
                    )}
                  </p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-content">
                  <h3>Used Budget</h3>
                  <p className="stat-value">
                    {formatCurrency(
                      convertCurrency(employees.reduce((sum, emp) => sum + (emp.usedBudget || 0), 0), 'INR', currentCurrency, exchangeRate),
                      currentCurrency
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="employee-list">
          <h2>Employee Budgets</h2>
          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : employees.length > 0 ? (
            <div className="employee-grid">
              {employees.map((employee) => {
                const budgetUsed = employee.usedBudget || 0;
                const budgetTotal = employee.budget || 0;
                const usagePercentage = budgetTotal > 0 ? (budgetUsed / budgetTotal) * 100 : 0;
                
                return (
                  <div key={employee.id} className="employee-card">
                    <div className="employee-header">
                      <div className="employee-info">
                        <h3>{employee.name}</h3>
                        <p>{employee.department}</p>
                      </div>
                      <div className="budget-status">
                        <span className={`status ${usagePercentage > 80 ? 'warning' : 'normal'}`}>
                          {usagePercentage.toFixed(1)}% used
                        </span>
                      </div>
                    </div>

                    <div className="budget-details">
                      <div className="budget-item">
                        <label>Total Budget:</label>
                        <span>{formatCurrency(convertCurrency(budgetTotal, 'INR', currentCurrency, exchangeRate), currentCurrency)}</span>
                      </div>
                      <div className="budget-item">
                        <label>Used Budget:</label>
                        <span>{formatCurrency(convertCurrency(budgetUsed, 'INR', currentCurrency, exchangeRate), currentCurrency)}</span>
                      </div>
                      <div className="budget-item">
                        <label>Remaining:</label>
                        <span>{formatCurrency(convertCurrency(budgetTotal - budgetUsed, 'INR', currentCurrency, exchangeRate), currentCurrency)}</span>
                      </div>
                    </div>

                    <div className="budget-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min(usagePercentage, 100)}%`,
                            backgroundColor: usagePercentage > 80 ? '#ef4444' : usagePercentage > 60 ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                    </div>

                    <div className="employee-actions">
                      <button 
                        className="edit-budget-btn"
                        onClick={() => {
                          const newBudget = prompt(`Enter new budget for ${employee.name}:`, budgetTotal.toString());
                          if (newBudget && !isNaN(Number(newBudget))) {
                            handleBudgetUpdate(String(employee.id), Number(newBudget));
                          }
                        }}
                      >
                        Edit Budget
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-data">
              <Users size={48} />
              <h3>No employees found</h3>
              <p>No team members have been added yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeamManagement; 