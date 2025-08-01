import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/employee-navmenu.css";

const EmployeeNavMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="nav-container">
      <h1 className="portal-title">Employee Portal</h1>
      
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      {isOpen && (
        <div className="nav-links">
          <button onClick={() => navigate('/employee/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/employee/booking')}>Book Travel</button>
          <button onClick={() => navigate('/employee/expense-report')}>Expense Report</button>
          <button onClick={() => navigate('/employee/booking-history')}>Booking History</button>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeNavMenu;
