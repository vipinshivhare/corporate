import React, { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import HamburgerMenu from '../../components/HamburgerMenu';
import { DollarSign, Calendar, FileText, TrendingUp, Upload, BarChart3 } from "lucide-react";

import '../../styles/ExpenseReport.css';

const ExpenseReport: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const { expenses } = useAppSelector(state => state.expense);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    receipt: null as File | null
  });

  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        receipt: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: '',
        receipt: null
      });
      setReceiptPreview(null);
      
      alert('Expense submitted successfully!');
    } catch (error) {
      alert('Failed to submit expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate analytics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingExpenses = expenses.filter(expense => expense.status === 'pending').length;
  const approvedExpenses = expenses.filter(expense => expense.status === 'approved').length;

  // Generate monthly expense data for chart
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === (currentMonth - 5 + index + 12) % 12;
      });
      
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        month,
        amount: total,
        count: monthExpenses.length
      };
    });
  };

  const monthlyData = generateMonthlyData();
  const maxAmount = Math.max(...monthlyData.map(d => d.amount), 1000); // Minimum scale of 1000

  // Generate category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalExpenses) * 100
  }));

  return (
    <div className="expense-report">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <HamburgerMenu />
          </div>
          <h1>Expense Report</h1>
          <div className="header-actions">
       
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="expense-container">
          {/* Expense Form */}
          <section className="expense-form-section">
            <h2>Submit New Expense</h2>
            <form onSubmit={handleSubmit} className="expense-form">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FileText size={16} />
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter expense description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <DollarSign size={16} />
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    <TrendingUp size={16} />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="travel">Travel</option>
                    <option value="meals">Meals</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="transportation">Transportation</option>
                    <option value="office">Office Supplies</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    <Calendar size={16} />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Upload size={16} />
                  Receipt (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                {receiptPreview && (
                  <div className="receipt-preview">
                    <img src={receiptPreview} alt="Receipt preview" />
                  </div>
                )}
              </div>

              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Expense'}
              </button>
            </form>
          </section>

          {/* Analytics */}
          <section className="analytics-section">
            <h2>Expense Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-icon">
                  <DollarSign size={24} />
                </div>
                <div className="analytics-content">
                  <h3>Total Expenses</h3>
                  <p className="analytics-value">₹{totalExpenses.toLocaleString()}</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="analytics-icon">
                  <Calendar size={24} />
                </div>
                <div className="analytics-content">
                  <h3>Pending Approvals</h3>
                  <p className="analytics-value">{pendingExpenses}</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="analytics-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="analytics-content">
                  <h3>Approved Expenses</h3>
                  <p className="analytics-value">{approvedExpenses}</p>
                </div>
              </div>
            </div>

            {/* Monthly Expense Chart */}
            <div className="chart-container">
              <h3>Monthly Expense Trends</h3>
              <div className="chart-wrapper">
                <svg width="100%" height="200" className="expense-chart">
                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Y-axis labels */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                    <g key={`y-label-${index}`}>
                      <line
                        x1="60"
                        y1={20 + ratio * 140}
                        x2="100%"
                        y2={20 + ratio * 140}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                      />
                      <text
                        x="50"
                        y={20 + ratio * 140 + 4}
                        fontSize="10"
                        fill="#64748b"
                        textAnchor="end"
                      >
                        ₹{Math.round(maxAmount * ratio).toLocaleString()}
                      </text>
                    </g>
                  ))}

                  {/* Bars */}
                  {monthlyData.map((data, index) => {
                    const barHeight = (data.amount / maxAmount) * 140;
                    const barWidth = 40;
                    const barX = 80 + index * 60;
                    const barY = 160 - barHeight;
                    
                    return (
                      <g key={`bar-${index}`}>
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={barHeight}
                          fill="url(#barGradient)"
                          rx="4"
                          className="chart-bar"
                        />
                        <text
                          x={barX + barWidth / 2}
                          y="175"
                          fontSize="12"
                          fill="#1a202c"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {data.month}
                        </text>
                        <text
                          x={barX + barWidth / 2}
                          y={barY - 5}
                          fontSize="10"
                          fill="#64748b"
                          textAnchor="middle"
                        >
                          ₹{data.amount.toLocaleString()}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="category-breakdown">
              <h3>Expense by Category</h3>
              <div className="category-list">
                {categories.map((cat, index) => (
                  <div key={cat.category} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{cat.category}</span>
                      <span className="category-amount">₹{cat.amount.toLocaleString()}</span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ 
                          width: `${cat.percentage}%`,
                          background: `hsl(${240 + index * 30}, 70%, 60%)`
                        }}
                      />
                    </div>
                    <span className="category-percentage">{cat.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReport;